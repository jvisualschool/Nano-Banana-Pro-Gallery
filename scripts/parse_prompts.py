#!/usr/bin/env python3
"""
README.md에서 모든 프롬프트를 추출하여 TypeScript 파일로 변환하는 스크립트
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
    
    # 섹션 패턴 찾기
    section_pattern = r'## (\d+)\. (.+?)\n\n(.*?)(?=\n## |\Z)'
    sections = re.finditer(section_pattern, content, re.DOTALL)
    
    for section in sections:
        section_num = int(section.group(1))
        section_name = section.group(2)
        section_content = section.group(3)
        
        if section_name in category_map:
            current_category = section_name
            current_category_id = category_map[section_name]
        
        # 프롬프트 패턴 찾기 (### 번호. 제목 형식)
        prompt_pattern = r'### (\d+\.\d+)\. (.+?)\n\*(.+?)\*\n(.*?)(?=\n### |\Z)'
        prompt_matches = re.finditer(prompt_pattern, section_content, re.DOTALL)
        
        for match in prompt_matches:
            prompt_id = match.group(1)
            title = match.group(2).strip()
            description = match.group(3).strip()
            prompt_content = match.group(4)
            
            # 이미지 URL 추출
            img_pattern = r'<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"'
            img_match = re.search(img_pattern, prompt_content)
            image_url = img_match.group(1) if img_match else None
            image_alt = img_match.group(2) if img_match and img_match.lastindex >= 2 else None
            
            # 프롬프트 텍스트 추출
            prompt_text_pattern = r'\*\*Prompt:\*\*\s*```(?:text|json)\n(.*?)```'
            prompt_text_match = re.search(prompt_text_pattern, prompt_content, re.DOTALL)
            prompt_text = prompt_text_match.group(1).strip() if prompt_text_match else ''
            
            # 프롬프트 타입 결정
            prompt_type = 'json' if '```json' in prompt_content else 'text'
            
            # 소스 추출
            source_pattern = r'\*Source: (?:\[([^\]]+)\]\(([^\)]+)\)|([^\)]+))\*'
            source_match = re.search(source_pattern, prompt_content)
            source_name = None
            source_url = None
            if source_match:
                if source_match.group(1):
                    source_name = source_match.group(1)
                    source_url = source_match.group(2)
                else:
                    source_name = source_match.group(3).strip()
            
            if prompt_text:  # 프롬프트 텍스트가 있는 경우만 추가
                prompts.append({
                    'id': prompt_id,
                    'title': title,
                    'description': description,
                    'category': current_category or section_name,
                    'categoryId': current_category_id or section_num,
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

if __name__ == '__main__':
    prompts = extract_prompts_from_markdown('README.md')
    print(f"Extracted {len(prompts)} prompts")
    print(json.dumps(prompts[:3], indent=2, ensure_ascii=False))

