#!/usr/bin/env python3
"""
README.md에서 모든 프롬프트를 추출하여 TypeScript 번역 파일 생성
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

def generate_translation_code(prompts):
    """TypeScript 번역 코드 생성"""
    ko_translations = {}
    en_translations = {}
    
    # 간단한 한국어 번역 (주요 프롬프트만)
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
        'Star Wars "Where\'s Waldo"': '스타워즈 "왈도를 찾아라"',
        'Aging Through the Years': '세월에 따른 노화',
        'Recursive Visuals': '재귀적 시각화',
        'Coordinate Visualization': '좌표 시각화',
        'Conceptual Visualization': '개념적 시각화',
        'Literal Interpretation': '문자 그대로 해석',
        'Multi-Subject Compositing': '다중 주제 합성',
        'Whiteboard Marker Art': '화이트보드 마커 아트',
        'Split View 3D Render - iPhone 17 Pro': '분할 뷰 3D 렌더 - iPhone 17 Pro',
        'USA 3D Diorama with Landmarks': '랜드마크가 있는 미국 3D 디오라마',
        'US Map Made of Famous Foods': '유명 음식으로 만든 미국 지도',
        'City\'s Tallest Buildings 3D Cartoon View': '도시 최고층 건물 3D 만화 뷰',
        '3D Isometric Home Office Illustration': '3D 아이소메트릭 홈 오피스 일러스트',
        'Emoji Combination - Banana with Sunglasses': '이모지 조합 - 선글라스를 쓴 바나나',
        'Torn Paper Art Effect': '찢어진 종이 아트 효과',
        'Cinematic Keyframe Generator': '시네마틱 키프레임 생성기',
        'Photo Book Style Magazine Cover with Coordinates': '좌표가 있는 포토북 스타일 매거진 커버',
        'Floating Country Island Diorama': '떠다니는 국가 섬 디오라마',
        'Novel Scene 3D Poster': '소설 장면 3D 포스터',
        'Miniature Swimming Pool Diorama': '미니어처 수영장 디오라마',
        'Christmas Ornament 3D Character': '크리스마스 장식 3D 캐릭터',
        'Ironing Out Wrinkles': '주름 다림질',
        'Perfectly Isometric Photography': '완벽한 아이소메트릭 사진',
        'Extreme Wide Angle Phone Screen Replacement': '극단적 광각 폰 화면 교체',
        'Shop Window Cartoon Reflection': '쇼핑 윈도우 만화 반사',
        'Urban 3D LED Display': '도시 3D LED 디스플레이',
        'Trans-Dimensional Liquid Pour': '차원 간 액체 부음',
        'Fisheye Matcha Girl': '어안 말차 소녀',
        'Canon IXUS Aesthetic Portrait': 'Canon IXUS 미학 초상화',
        'Hyperrealistic Anime Portrait Spotlight': '하이퍼리얼리스틱 애니메 초상화 스포트라이트',
        'Concept Visualization (Text to Infographic)': '개념 시각화 (텍스트를 인포그래픽으로)',
        'Kids\' Crayon Travel Journal Illustrator': '어린이 크레용 여행 일기 일러스트레이터',
        'Financial Sankey Diagram Visualization': '재무 Sankey 다이어그램 시각화',
        'Virtual Model Try-On': '가상 모델 착용',
        'Professional Product Photography': '전문 제품 사진',
        '3D Chibi-Style Miniature Brand Store': '3D 치비 스타일 미니어처 브랜드 스토어',
        'Room Furnishing Visualization': '방 가구 배치 시각화',
        'Hand-drawn Flowchart to Corporate Charts': '손그림 플로우차트를 기업용 차트로',
        'UI Hand-drawn Sketch to High-Fidelity Prototype': 'UI 손그림 스케치를 고품질 프로토타입으로',
        'Magazine Layout Generator': '매거진 레이아웃 생성기',
        'Composition Rescue (Smart Outpainting)': '구도 구출 (스마트 아웃페인팅)',
        'Smart Crowd Removal': '스마트 군중 제거',
        'Face Detection CCTV Simulation': '얼굴 인식 CCTV 시뮬레이션',
        'Hard Furnishing Preview (Floor Plan to Design)': '하드 퍼니싱 미리보기 (평면도를 디자인으로)',
        'Viral Cover Image (Youtube/Douyin/TikTok)': '바이럴 커버 이미지 (유튜브/도우인/틱톡)',
        'Commercial Promotional Poster': '상업용 홍보 포스터',
        'Physical Store/Travel Translation': '실제 매장/여행 번역',
        'Digital Content Localization (Comics/Memes)': '디지털 콘텐츠 현지화 (만화/밈)',
        '3D Blind Box Style Avatar': '3D 블라인드 박스 스타일 아바타',
        'Pet Meme Creation': '펫 밈 생성',
        'Y2K Scrapbook Poster with Multiple Poses': '다양한 포즈의 Y2K 스크랩북 포스터',
        'Japanese High School Student Snap Photo': '일본 고등학생 스냅 사진',
        'AI Skin Analysis and Skincare Routine': 'AI 피부 분석 및 스킨케어 루틴',
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
        'Photorealistic documentation of a chalkboard anime drawing': '칠판 애니메 그림의 사진 리얼리스틱 문서화',
        'Create a winter portrait with a puppy': '강아지와 함께한 겨울 초상화 생성',
        'A 360-degree selfie with movie characters': '영화 캐릭터와 함께한 360도 셀피',
        'Take a selfie with a movie character while preserving your features': '당신의 특징을 유지하면서 영화 캐릭터와 셀피 찍기',
        'A commercial-grade photo with a classical oil painting': '고전적인 유화와 함께한 상업용 사진',
        'A photo displayed on a compact digital camera screen': '컴팩트 디지털 카메라 화면에 표시된 사진',
        'Create a glossy magazine cover': '광택 있는 매거진 커버 생성',
        'Create a floating luxury product shot': '떠다니는 럭셔리 제품 사진 생성',
    }
    
    for prompt in prompts:
        key_id = prompt['id'].replace('.', '_')
        
        # 영어는 원본 그대로
        en_translations[f'prompt.{key_id}.title'] = prompt['title']
        en_translations[f'prompt.{key_id}.description'] = prompt['description']
        
        # 한국어는 번역 맵에서 찾거나 원본 사용
        ko_title = ko_title_map.get(prompt['title'], prompt['title'])
        ko_desc = ko_desc_map.get(prompt['description'], prompt['description'])
        
        ko_translations[f'prompt.{key_id}.title'] = ko_title
        ko_translations[f'prompt.{key_id}.description'] = ko_desc
    
    return ko_translations, en_translations

if __name__ == '__main__':
    prompts = extract_prompts_from_readme('README.md')
    print(f"Extracted {len(prompts)} prompts")
    
    ko_trans, en_trans = generate_translation_code(prompts)
    
    # TypeScript 형식으로 출력
    print("\n// 한국어 번역 추가")
    for key in sorted(ko_trans.keys()):
        value = ko_trans[key].replace("'", "\\'")
        print(f"    '{key}': '{value}',")
    
    print("\n// 영어 번역 추가")
    for key in sorted(en_trans.keys()):
        value = en_trans[key].replace("'", "\\'")
        print(f"    '{key}': '{value}',")

