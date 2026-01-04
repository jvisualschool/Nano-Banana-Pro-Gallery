#!/usr/bin/env python3
"""
README.md에서 프롬프트를 읽어서 번역을 생성하는 스크립트
"""
import re
import json

def extract_prompts_from_readme(md_file):
    """README.md에서 프롬프트 추출"""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompts = []
    
    # 섹션별로 분리
    sections = re.split(r'\n## \d+\. ', content)
    
    for section in sections[1:]:
        # 프롬프트 패턴 찾기
        prompt_pattern = r'### (\d+\.\d+)\. (.+?)\n\*(.+?)\*\n'
        prompt_matches = re.finditer(prompt_pattern, section, re.DOTALL)
        
        for match in prompt_matches:
            prompt_id = match.group(1)
            title = match.group(2).strip()
            description = match.group(3).strip()
            
            prompts.append({
                'id': prompt_id,
                'title': title,
                'description': description
            })
    
    return prompts

def generate_translations(prompts):
    """한국어/영어 번역 생성"""
    ko_translations = {}
    en_translations = {}
    
    # 간단한 번역 매핑 (실제로는 더 정확한 번역이 필요하지만, 여기서는 구조만 생성)
    for prompt in prompts:
        key_id = prompt['id'].replace('.', '_')
        
        # 영어는 원본 그대로
        en_translations[f'prompt.{key_id}.title'] = prompt['title']
        en_translations[f'prompt.{key_id}.description'] = prompt['description']
        
        # 한국어는 간단한 번역 (실제로는 더 정확한 번역 필요)
        # 여기서는 일단 영어를 그대로 사용하고, 나중에 수동으로 번역 가능
        ko_translations[f'prompt.{key_id}.title'] = prompt['title']  # TODO: 번역 필요
        ko_translations[f'prompt.{key_id}.description'] = prompt['description']  # TODO: 번역 필요
    
    return ko_translations, en_translations

if __name__ == '__main__':
    prompts = extract_prompts_from_readme('README.md')
    print(f"Extracted {len(prompts)} prompts")
    
    ko_trans, en_trans = generate_translations(prompts)
    
    # TypeScript 형식으로 출력
    print("\n// 한국어 번역")
    print("const koTranslations = {")
    for key, value in sorted(ko_trans.items()):
        print(f"  '{key}': {json.dumps(value, ensure_ascii=False)},")
    print("};")
    
    print("\n// 영어 번역")
    print("const enTranslations = {")
    for key, value in sorted(en_trans.items()):
        print(f"  '{key}': {json.dumps(value, ensure_ascii=False)},")
    print("};")

