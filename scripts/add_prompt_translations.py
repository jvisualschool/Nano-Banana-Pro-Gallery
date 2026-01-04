#!/usr/bin/env python3
"""
프롬프트 번역을 LanguageContext에 추가하는 스크립트
"""
import re
import json

def extract_prompts_from_readme(md_file):
    """README.md에서 프롬프트 추출"""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prompts = []
    sections = re.split(r'\n## \d+\. ', content)
    
    for section in sections[1:]:
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

def generate_ts_translations(prompts):
    """TypeScript 번역 코드 생성"""
    ko_lines = []
    en_lines = []
    
    # 간단한 한국어 번역 맵 (주요 항목만)
    ko_title_map = {
        'Hyper-Realistic Crowd Composition': '하이퍼 리얼리스틱 군중 구성',
        '2000s Mirror Selfie': '2000년대 거울 셀피',
        "Victoria's Secret Style Photoshoot": '빅토리아 시크릿 스타일 사진 촬영',
        '1990s Camera Style Portrait': '1990년대 카메라 스타일 초상화',
        'One-Click Business Photo (Silicon Valley Style)': '원클릭 비즈니스 사진 (실리콘 밸리 스타일)',
        'Emotional Film Photography': '감성적인 필름 사진',
        'Professional Headshot Creator': '전문 프로필 사진 생성기',
        'Hyperrealistic Anime Portrait in Spotlight': '스포트라이트 하이퍼리얼리스틱 애니메 초상화',
        'Bathroom Mirror Selfie': '욕실 거울 셀피',
        'Chalkboard Anime Art Documentation': '칠판 애니메 아트 문서화',
        'Portrait with Puppy in Snow': '눈 속 강아지와 함께한 초상화',
        'Fisheye Movie Character Selfie': '어안 영화 캐릭터 셀피',
        'Character Consistency Selfie with Movie Character': '영화 캐릭터와의 캐릭터 일관성 셀피',
        'Museum Art Exhibition Selfie': '미술관 전시 셀피',
        'Compact Camera Screen Display': '컴팩트 카메라 화면 표시',
        'Magazine Cover Portrait': '매거진 커버 초상화',
        'Luxury Product Photography': '럭셔리 제품 사진',
    }
    
    ko_desc_map = {
        'Handling complex compositions with multiple famous faces and specific lighting.': '여러 유명 인물과 특정 조명을 가진 복잡한 구도 처리.',
        'A structured JSON prompt to generate an authentic early-2000s aesthetic with flash photography and nostalgic elements.': '플래시 사진과 향수를 불러일으키는 요소로 진정한 2000년대 초 미학을 생성하는 구조화된 JSON 프롬프트.',
        "Great for creating high-glamour, backstage-style fashion photography with intricate details.": '복잡한 세부사항을 가진 고급스러운 백스테이지 스타일 패션 사진 제작에 적합.',
        "Test the model's ability to replicate specific film textures, flash photography, and era-specific atmosphere.": '특정 필름 질감, 플래시 사진, 시대별 분위기를 재현하는 모델의 능력 테스트.',
        'Transforms casual photos into professional studio headshots using specific lens and lighting instructions.': '특정 렌즈와 조명 지침을 사용하여 캐주얼 사진을 전문 스튜디오 헤드샷으로 변환.',
        'Creates a cinematic, nostalgic "Kodak Portra" look while maintaining facial consistency.': '얼굴 일관성을 유지하면서 시네마틱하고 향수를 불러일으키는 "Kodak Portra" 룩 생성.',
        'Create a professional profile photo from a selfie': '셀피에서 전문 프로필 사진 생성',
        'A hyperrealistic anime-style portrait with dramatic lighting': '극적인 조명을 가진 하이퍼리얼리스틱 애니메 스타일 초상화',
        'Create a candid mirror selfie with specific styling and composition': '특정 스타일링과 구도로 솔직한 거울 셀피 생성',
    }
    
    for prompt in prompts:
        key_id = prompt['id'].replace('.', '_')
        
        # 영어는 원본
        en_title = prompt['title'].replace("'", "\\'")
        en_desc = prompt['description'].replace("'", "\\'")
        en_lines.append(f"    'prompt.{key_id}.title': '{en_title}',")
        en_lines.append(f"    'prompt.{key_id}.description': '{en_desc}',")
        
        # 한국어는 번역 맵에서 찾거나 원본 사용
        ko_title = ko_title_map.get(prompt['title'], prompt['title']).replace("'", "\\'")
        ko_desc = ko_desc_map.get(prompt['description'], prompt['description']).replace("'", "\\'")
        ko_lines.append(f"    'prompt.{key_id}.title': '{ko_title}',")
        ko_lines.append(f"    'prompt.{key_id}.description': '{ko_desc}',")
    
    return ko_lines, en_lines

if __name__ == '__main__':
    prompts = extract_prompts_from_readme('README.md')
    ko_lines, en_lines = generate_ts_translations(prompts)
    
    print("// 한국어 번역")
    for line in ko_lines:
        print(line)
    
    print("\n// 영어 번역")
    for line in en_lines:
        print(line)

