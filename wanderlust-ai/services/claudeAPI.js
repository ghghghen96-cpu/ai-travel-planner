// services/claudeAPI.js
// Claude API 연동 서비스

// ⚠️ 보안 주의: 실제 프로덕션에서는 API 키를 클라이언트에 노출하지 마세요!
// 백엔드 서버를 통해 API를 호출하는 것을 권장합니다.

const CLAUDE_API_KEY = 'your-api-key-here'; // 여기에 실제 API 키 입력
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Claude API에 메시지 전송
 */
export const sendMessage = async (message, systemPrompt = '') => {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
};

/**
 * 여행 일정 생성
 */
export const generateItinerary = async (travelData) => {
  const systemPrompt = `You are an expert travel planner. Create detailed, personalized travel itineraries based on user preferences. Always respond in Korean and provide specific recommendations with timings.`;

  const userMessage = `
다음 정보를 바탕으로 상세한 여행 일정을 만들어주세요:

목적지: ${travelData.destinations.map(d => `${d.name} (${d.city})`).join(', ')}
여행 기간: ${travelData.dates.start} ~ ${travelData.dates.end}
예산 (1인당): $${travelData.budget}
동행자: ${travelData.travelWith}
여행 스타일: ${travelData.travelVibe}
탐험 스타일: ${travelData.explorationStyle}
활동 강도: ${travelData.pace}%
선호 기후: ${travelData.climates.join(', ')}
식사 선호: ${travelData.dining}
하루 일정: ${travelData.dailyPace}
숙박 유형: ${travelData.accommodation}

다음 형식으로 일정을 만들어주세요:
- 각 날짜별로 구분
- 각 활동마다 시간, 장소명, 설명, 태그 포함
- 현지인만 아는 숨은 명소 포함
- 이동 시간과 교통 수단 정보 포함
- 식사 추천 장소 포함

JSON 형식으로 응답해주세요:
{
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00 AM",
          "name": "장소명",
          "description": "설명",
          "tags": ["태그1", "태그2"],
          "rating": "4.5",
          "reviews": "1.5k+ reviews",
          "location": {
            "lat": 35.6762,
            "lng": 139.6503
          }
        }
      ]
    }
  ],
  "tips": ["팁1", "팁2"],
  "transportation": "교통 정보",
  "estimatedCost": {
    "accommodation": 500,
    "food": 300,
    "activities": 200,
    "transportation": 100
  }
}
`;

  try {
    const response = await sendMessage(userMessage, systemPrompt);
    
    // JSON 추출 (Claude가 ```json ``` 로 감쌀 수 있음)
    let jsonText = response;
    if (response.includes('```json')) {
      jsonText = response.split('```json')[1].split('```')[0].trim();
    } else if (response.includes('```')) {
      jsonText = response.split('```')[1].split('```')[0].trim();
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('일정 생성 오류:', error);
    // 오류 시 샘플 데이터 반환
    return getSampleItinerary();
  }
};

/**
 * 목적지 추천
 */
export const getDestinationRecommendations = async (preferences) => {
  const systemPrompt = `You are a travel destination expert. Recommend destinations based on user preferences. Respond in Korean.`;

  const userMessage = `
다음 선호사항을 바탕으로 최적의 여행지 5곳을 추천해주세요:

선호 기후: ${preferences.climates?.join(', ') || '열대'}
여행 스타일: ${preferences.travelVibe || '조용한'}
예산 범위: $${preferences.budget || 2000}

JSON 형식으로 응답해주세요:
{
  "recommendations": [
    {
      "country": "국가명",
      "city": "도시명",
      "reason": "추천 이유",
      "bestSeason": "최적 시즌",
      "estimatedBudget": 1500,
      "highlights": ["특징1", "특징2"]
    }
  ]
}
`;

  try {
    const response = await sendMessage(userMessage, systemPrompt);
    let jsonText = response;
    if (response.includes('```json')) {
      jsonText = response.split('```json')[1].split('```')[0].trim();
    }
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('목적지 추천 오류:', error);
    return getSampleDestinations();
  }
};

/**
 * 여행 팁 생성
 */
export const getTravelTips = async (destination) => {
  const systemPrompt = `You are a local travel expert. Provide insider tips and hidden gems. Respond in Korean.`;

  const userMessage = `
${destination}에 대한 현지인만 아는 여행 팁을 알려주세요:
- 숨은 명소 3곳
- 현지 음식 추천 3곳
- 피해야 할 관광객 함정
- 교통 팁
- 안전 주의사항

JSON 형식으로 응답해주세요:
{
  "hiddenGems": ["장소1", "장소2", "장소3"],
  "localFood": ["음식점1", "음식점2", "음식점3"],
  "avoidTouristTraps": ["팁1", "팁2"],
  "transportationTips": "교통 팁",
  "safetyTips": ["안전 팁1", "안전 팁2"]
}
`;

  try {
    const response = await sendMessage(userMessage, systemPrompt);
    let jsonText = response;
    if (response.includes('```json')) {
      jsonText = response.split('```json')[1].split('```')[0].trim();
    }
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('여행 팁 생성 오류:', error);
    return getSampleTips();
  }
};

// 샘플 데이터 (API 연동 전 또는 오류 시 사용)
const getSampleItinerary = () => ({
  days: [
    {
      day: 1,
      date: '2025-02-13',
      activities: [
        {
          time: '09:00 AM',
          name: 'TeamLab Planets Immersive Art',
          description: '디지털 물과 거울방을 통한 고독한 감각 여행.',
          tags: ['예술', '조용함', '#정적'],
          rating: '4.7',
          reviews: '8.5k+ reviews',
          location: { lat: 35.6529, lng: 139.7968 },
        },
        {
          time: '01:00 PM',
          name: 'Nezu Museum & Garden',
          description: '놀랍도록 조용한 정원 환경에서 전근대 일본과 동아시아 예술을 감상하는 숨은 보석.',
          tags: ['예술', '조용함', '#경관'],
          rating: '4.6',
          reviews: '3.2k+ reviews',
          location: { lat: 35.6655, lng: 139.7188 },
        },
        {
          time: '05:00 PM',
          name: 'Afuri Ramen',
          description: '현대적인 분위기에서 유자 향이 나는 시그니처 라멘.',
          tags: ['음식', '라멘'],
          rating: '4.6',
          reviews: '15k+ reviews',
          location: { lat: 35.6585, lng: 139.7454 },
        },
      ],
    },
  ],
  tips: [
    '지역 교통 패스를 구매하여 무제한 이용하고 실시간 앱으로 스케줄을 확인하세요.',
    '아침 일찍 도착하여 인파를 피하세요.',
  ],
  transportation: '도쿄 메트로와 JR 라인을 활용하세요. Suica 카드를 구입하면 편리합니다.',
  estimatedCost: {
    accommodation: 600,
    food: 250,
    activities: 150,
    transportation: 80,
  },
});

const getSampleDestinations = () => ({
  recommendations: [
    {
      country: '일본',
      city: '교토',
      reason: '전통적이고 조용한 분위기, 아름다운 사원과 정원',
      bestSeason: '봄(벚꽃) 또는 가을(단풍)',
      estimatedBudget: 1800,
      highlights: ['후시미 이나리 신사', '아라시야마 대나무 숲', '기온 게이샤 지구'],
    },
    {
      country: '인도네시아',
      city: '발리',
      reason: '열대 해변, 요가 리트릿, 저렴한 비용',
      bestSeason: '4월~10월 (건기)',
      estimatedBudget: 1200,
      highlights: ['우붓 라이스 테라스', '탄중 브누아 해변', '티르타 엠풀 사원'],
    },
  ],
});

const getSampleTips = () => ({
  hiddenGems: [
    'Yanaka 동네 - 오래된 도쿄의 분위기',
    'Shimokitazawa - 빈티지 샵과 카페',
    'Kagurazaka - 숨겨진 프렌치-일본 퓨전 지구',
  ],
  localFood: [
    'Tsukiji Outer Market - 신선한 해산물',
    'Nakameguro의 작은 이자카야들',
    'Kichijoji의 Harmonica Yokocho',
  ],
  avoidTouristTraps: [
    '시부야 스크램블 교차로는 구경만, 주변 비싼 식당은 피하기',
    '하라주쿠의 과대광고된 크레페 가게들',
  ],
  transportationTips:
    'Suica/Pasmo 카드를 구입하세요. 대부분의 편의점에서 충전 가능합니다. Google Maps는 도쿄 교통에 매우 정확합니다.',
  safetyTips: [
    '도쿄는 매우 안전하지만 늦은 밤 혼자 다닐 때는 주의하세요',
    '귀중품은 항상 주시하세요 (특히 붐비는 전철에서)',
  ],
});

export default {
  sendMessage,
  generateItinerary,
  getDestinationRecommendations,
  getTravelTips,
};
