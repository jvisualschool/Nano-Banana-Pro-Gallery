#!/usr/bin/env python3
"""
prompts.ts에서 프롬프트를 읽어서 번역 키를 생성하는 스크립트
"""
import re
import json

def extract_prompts_from_ts(ts_file):
    """TypeScript 파일에서 프롬프트 추출"""
    with open(ts_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompts = []
    # 프롬프트 패턴 찾기
    pattern = r"id: '([^']+)',\s*title: (['\"])([^\"]+]+?)\2,\s*description: (['\"])([^\"]+?)\4"
    
    matches = re.finditer(pattern, content, re.DOTALL)
    
    for match in matches:
        prompt_id = match.group(1)
        title = match.group(3)
        description = match.group(5)
        
        prompts.append({
            'id': prompt_id,
            'title': title,
            'description': description
        })
    
    return prompts

def generate_translation_keys(prompts):
    """번역 키 생성"""
    ko_translations = {}
    en_translations = {}
    
    for prompt in prompts:
        key_id = prompt['id'].replace('.', '_')
        ko_translations[f'prompt.{key_id}.title'] = prompt['title']
        ko_translations[f'prompt.{key_id}.description'] = prompt['description']
        en_translations[f'prompt.{key_id}.title'] = prompt['title']
        en_translations[f'prompt.{key_id}.description'] = prompt['description']
    
    return ko_translations, en_translations

if __name__ == '__main__':
    prompts = extract_prompts_from_ts('src/data/prompts.ts')
    print(f"Extracted {len(prompts)} prompts")
    
    ko_trans, en_trans = generate_translation_keys(prompts)
    
    # JSON으로 출력
    output = {
        'ko': ko_trans,
        'en': en_trans
    }
    
    print(json.dumps(output, indent=2, ensure_ascii=False))

