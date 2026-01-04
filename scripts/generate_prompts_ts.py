#!/usr/bin/env python3
"""
README.md에서 모든 프롬프트를 추출하여 TypeScript 파일로 변환
"""
import re
import json

def extract_prompts_from_markdown(md_file):
    """README.md에서 프롬프트를 추출"""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompts = []
    current_category = None
    current_category_id = None
    
    # 카테고리 매핑
    category_map = {
        'Photorealism & Aesthetics': 1,
        'Creative Experiments': 2,
        'Education & Knowledge': 3,
        'E-commerce & Virtual Studio': 4,
        'Workplace & Productivity': 5,
        'Photo Editing & Restoration': 6,
        'Interior Design': 7,
        'Social Media & Marketing': 8,
        'Daily Life & Translation': 9,
        'Social Networking & Avatars': 10,
    }
    
    # 섹션별로 분리
    sections = re.split(r'\n## \d+\. ', content)
    
    for section in sections[1:]:  # 첫 번째는 헤더이므로 제외
        # 섹션 이름 추출
        first_line = section.split('\n')[0]
        if first_line in category_map:
            current_category = first_line
            current_category_id = category_map[first_line]
        
        # 프롬프트 패턴 찾기
        prompt_pattern = r'### (\d+\.\d+)\. (.+?)\n\*(.+?)\*\n(.*?)(?=\n### |\Z)'
        prompt_matches = re.finditer(prompt_pattern, section, re.DOTALL)
        
        for match in prompt_matches:
            prompt_id = match.group(1)
            title = match.group(2).strip()
            description = match.group(3).strip()
            prompt_content = match.group(4)
            
            # 이미지 URL 추출 (여러 패턴 시도)
            image_url = None
            image_alt = None
            
            # <img ... src="..." alt="..." /> 패턴
            img_patterns = [
                r'<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"',
                r'<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"',
                r'<img[^>]+src="([^"]+)"',
            ]
            
            for pattern in img_patterns:
                img_match = re.search(pattern, prompt_content)
                if img_match:
                    if len(img_match.groups()) >= 2:
                        image_url = img_match.group(2) if 'alt' in pattern else img_match.group(1)
                        image_alt = img_match.group(1) if 'alt' in pattern else None
                    else:
                        image_url = img_match.group(1)
                    break
            
            # 프롬프트 텍스트 추출
            prompt_text_pattern = r'\*\*Prompt:\*\*\s*```(?:text|json)\n(.*?)```'
            prompt_text_match = re.search(prompt_text_pattern, prompt_content, re.DOTALL)
            prompt_text = prompt_text_match.group(1).strip() if prompt_text_match else ''
            
            # 프롬프트 타입 결정
            prompt_type = 'json' if '```json' in prompt_content else 'text'
            
            # 소스 추출
            source_name = None
            source_url = None
            source_patterns = [
                r'\*Source: \[([^\]]+)\]\(([^\)]+)\)',
                r'\*Source: ([^\*]+) - \[Post\]\(([^\)]+)\)',
                r'\*Source: ([^\*]+)\*',
            ]
            
            for pattern in source_patterns:
                source_match = re.search(pattern, prompt_content)
                if source_match:
                    if len(source_match.groups()) >= 2:
                        source_name = source_match.group(1)
                        source_url = source_match.group(2)
                    else:
                        source_name = source_match.group(1).strip()
                    break
            
            if prompt_text:  # 프롬프트 텍스트가 있는 경우만 추가
                prompts.append({
                    'id': prompt_id,
                    'title': title,
                    'description': description,
                    'category': current_category or 'Unknown',
                    'categoryId': current_category_id or 0,
                    'imageUrl': image_url,
                    'imageAlt': image_alt or title,
                    'prompt': prompt_text,
                    'promptType': prompt_type,
                    'source': {
                        'name': source_name or 'Unknown',
                        'url': source_url
                    } if source_name else None
                })
    
    return prompts

def generate_typescript(prompts):
    """TypeScript 코드 생성"""
    ts_code = "import { Prompt, Category } from '../types';\n\n"
    ts_code += "export const categories: Category[] = [\n"
    categories = [
        (1, 'Photorealism & Aesthetics', 'Optimize your visual output with these high-fidelity prompts.'),
        (2, 'Creative Experiments', 'Prompts focused on pushing the boundaries of composition and creativity.'),
        (3, 'Education & Knowledge', 'Converts textual concepts into clear, educational illustrations.'),
        (4, 'E-commerce & Virtual Studio', 'Professional product photography and virtual try-on solutions.'),
        (5, 'Workplace & Productivity', 'Convert sketches into professional presentations and designs.'),
        (6, 'Photo Editing & Restoration', 'Smart image editing and restoration techniques.'),
        (7, 'Interior Design', 'Generate complete design presentations from floor plans.'),
        (8, 'Social Media & Marketing', 'Create engaging thumbnails and promotional materials.'),
        (9, 'Daily Life & Translation', 'Translate menus, signs, and digital content seamlessly.'),
        (10, 'Social Networking & Avatars', 'Create avatars, memes, and social media content.'),
    ]
    
    for cat_id, name, desc in categories:
        ts_code += f"  {{\n    id: {cat_id},\n    name: '{name}',\n    description: '{desc}',\n  }},\n"
    
    ts_code += "];\n\n"
    ts_code += "export const prompts: Prompt[] = [\n"
    
    for p in prompts:
        ts_code += "  {\n"
        ts_code += f"    id: '{p['id']}',\n"
        ts_code += f"    title: {json.dumps(p['title'], ensure_ascii=False)},\n"
        ts_code += f"    description: {json.dumps(p['description'], ensure_ascii=False)},\n"
        ts_code += f"    category: {json.dumps(p['category'], ensure_ascii=False)},\n"
        ts_code += f"    categoryId: {p['categoryId']},\n"
        if p['imageUrl']:
            ts_code += f"    imageUrl: {json.dumps(p['imageUrl'], ensure_ascii=False)},\n"
        ts_code += f"    imageAlt: {json.dumps(p['imageAlt'], ensure_ascii=False)},\n"
        # 프롬프트 텍스트는 백틱으로 감싸기
        prompt_text = p['prompt'].replace('`', '\\`').replace('${', '\\${')
        ts_code += f"    prompt: `{prompt_text}`,\n"
        ts_code += f"    promptType: '{p['promptType']}',\n"
        if p['source']:
            ts_code += "    source: {\n"
            ts_code += f"      name: {json.dumps(p['source']['name'], ensure_ascii=False)},\n"
            if p['source'].get('url'):
                ts_code += f"      url: {json.dumps(p['source']['url'], ensure_ascii=False)},\n"
            ts_code += "    },\n"
        ts_code += "  },\n"
    
    ts_code += "];\n"
    return ts_code

if __name__ == '__main__':
    prompts = extract_prompts_from_markdown('README.md')
    print(f"Extracted {len(prompts)} prompts")
    
    ts_code = generate_typescript(prompts)
    with open('src/data/prompts.ts', 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print(f"Generated src/data/prompts.ts with {len(prompts)} prompts")

