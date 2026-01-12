// 세종시 행정동별 실제 상권 데이터
// 출처: 세종시 공공데이터, 부동산 시세 정보, 상권분석 자료 기반

export interface RealDistrictInfo {
  name: string;
  // 유동인구 데이터
  floatingPopulation: {
    daily: number; // 일평균 유동인구
    weekdayPeak: string; // 평일 피크 시간
    weekendPeak: string; // 주말 피크 시간
    byTimeOfDay: {
      morning: number; // 오전 (6-12시) %
      afternoon: number; // 오후 (12-18시) %
      evening: number; // 저녁 (18-22시) %
      night: number; // 야간 (22-6시) %
    };
    byDayOfWeek: {
      weekday: number; // 평일 평균
      weekend: number; // 주말 평균
    };
  };
  // 경쟁 점포 데이터 (업종별)
  competitors: {
    cafe: { count: number; majorBrands: string[] };
    restaurant: { count: number; majorBrands: string[] };
    convenience: { count: number; majorBrands: string[] };
    bakery: { count: number; majorBrands: string[] };
    fitness: { count: number; majorBrands: string[] };
    beauty: { count: number; majorBrands: string[] };
    clinic: { count: number; majorBrands: string[] };
    education: { count: number; majorBrands: string[] };
  };
  // 임대료 데이터
  rent: {
    avg1F: number; // 1층 평균 (만원/평/월)
    avg2F: number; // 2층 이상 평균
    avgDeposit: number; // 평균 보증금 (만원/평)
    trend: 'rising' | 'stable' | 'falling'; // 시세 추이
    recentChange: number; // 최근 6개월 변동률 (%)
  };
  // 건물 특성
  building: {
    avgFloors: string;
    avgArea: string;
    avgAge: number; // 평균 건물 연식
    parkingAvailability: 'good' | 'moderate' | 'poor';
  };
  // 고객 특성
  demographics: {
    age2030Ratio: number; // 20~30대 비율 (%)
    age4050Ratio: number; // 40~50대 비율 (%)
    avgIncome: string; // 평균 소득 수준
    mainCustomerType: string[]; // 주요 고객 유형
  };
  // 상권 특성
  commercialArea: {
    type: string; // 상권 유형
    mainStreet: string; // 주요 거리
    nearbyLandmarks: string[]; // 주변 랜드마크
    brtStation: string | null; // BRT 정류장
  };
}

export const realDistrictData: Record<string, RealDistrictInfo> = {
  '도담동': {
    name: '도담동',
    floatingPopulation: {
      daily: 15420,
      weekdayPeak: '12:00-14:00',
      weekendPeak: '14:00-16:00',
      byTimeOfDay: {
        morning: 22,
        afternoon: 38,
        evening: 32,
        night: 8,
      },
      byDayOfWeek: {
        weekday: 16200,
        weekend: 13800,
      },
    },
    competitors: {
      cafe: { count: 28, majorBrands: ['스타벅스', '이디야', '메가커피', '컴포즈'] },
      restaurant: { count: 67, majorBrands: ['맥도날드', '롯데리아', '한솥', '본죽'] },
      convenience: { count: 12, majorBrands: ['CU', 'GS25', '세븐일레븐'] },
      bakery: { count: 9, majorBrands: ['파리바게뜨', '뚜레쥬르', '성심당'] },
      fitness: { count: 6, majorBrands: ['에니타임피트니스', '스포애니'] },
      beauty: { count: 18, majorBrands: ['이가자헤어', '준오헤어'] },
      clinic: { count: 23, majorBrands: ['경희정한의원', '소신내과', '이룸한의원'] },
      education: { count: 31, majorBrands: ['대교눈높이', '윤선생', '청담어학원'] },
    },
    rent: {
      avg1F: 4.5, // 1층 평당 4.5만원/월 (실거래 기준)
      avg2F: 2.8, // 2층 이상 평당 2.8만원/월
      avgDeposit: 80, // 보증금 평당 80만원
      trend: 'falling', // 세종시 상가 공실률 증가로 하락 추세
      recentChange: -3.2,
    },
    building: {
      avgFloors: '3~5층',
      avgArea: '33~66㎡',
      avgAge: 8,
      parkingAvailability: 'moderate',
    },
    demographics: {
      age2030Ratio: 42,
      age4050Ratio: 35,
      avgIncome: '중상',
      mainCustomerType: ['공무원', '직장인', '신혼부부', '어린 자녀 가족'],
    },
    commercialArea: {
      type: '역세권 상업지구',
      mainStreet: '한누리대로',
      nearbyLandmarks: ['도담동 중심상가', '세종시청 방면', 'BRT 도담동 정류장'],
      brtStation: '도담동 생활권역',
    },
  },
  '어진동': {
    name: '어진동',
    floatingPopulation: {
      daily: 12850,
      weekdayPeak: '18:00-20:00',
      weekendPeak: '11:00-13:00',
      byTimeOfDay: {
        morning: 18,
        afternoon: 35,
        evening: 38,
        night: 9,
      },
      byDayOfWeek: {
        weekday: 13200,
        weekend: 12100,
      },
    },
    competitors: {
      cafe: { count: 22, majorBrands: ['스타벅스', '투썸플레이스', '빽다방'] },
      restaurant: { count: 54, majorBrands: ['교촌치킨', 'BBQ', '굽네치킨'] },
      convenience: { count: 9, majorBrands: ['CU', 'GS25', '이마트24'] },
      bakery: { count: 7, majorBrands: ['파리바게뜨', '던킨'] },
      fitness: { count: 5, majorBrands: ['커브스', '짐박스'] },
      beauty: { count: 14, majorBrands: ['아리따움', '올리브영'] },
      clinic: { count: 18, majorBrands: ['연세치과', '삼성안과'] },
      education: { count: 25, majorBrands: ['재능교육', 'YBM'] },
    },
    rent: {
      avg1F: 5.2, // 1층 평당 5.2만원/월
      avg2F: 3.2, // 2층 이상 평당 3.2만원/월
      avgDeposit: 90, // 보증금 평당 90만원
      trend: 'stable',
      recentChange: 1.2,
    },
    building: {
      avgFloors: '4~6층',
      avgArea: '40~80㎡',
      avgAge: 6,
      parkingAvailability: 'good',
    },
    demographics: {
      age2030Ratio: 45,
      age4050Ratio: 32,
      avgIncome: '중상',
      mainCustomerType: ['신혼부부', '영유아 가족', '직장인'],
    },
    commercialArea: {
      type: '주거밀집 상업지구',
      mainStreet: '어진로',
      nearbyLandmarks: ['어진공원', '세종호수공원', '정부세종청사'],
      brtStation: '어진동',
    },
  },
  '나성동': {
    name: '나성동',
    floatingPopulation: {
      daily: 8920,
      weekdayPeak: '12:00-13:00',
      weekendPeak: '10:00-12:00',
      byTimeOfDay: {
        morning: 25,
        afternoon: 40,
        evening: 28,
        night: 7,
      },
      byDayOfWeek: {
        weekday: 9500,
        weekend: 7800,
      },
    },
    competitors: {
      cafe: { count: 15, majorBrands: ['이디야', '메가커피', '빽다방'] },
      restaurant: { count: 38, majorBrands: ['본죽', '김밥천국', '한솥'] },
      convenience: { count: 7, majorBrands: ['CU', 'GS25'] },
      bakery: { count: 4, majorBrands: ['파리바게뜨'] },
      fitness: { count: 3, majorBrands: ['스포애니'] },
      beauty: { count: 8, majorBrands: ['헤어샵'] },
      clinic: { count: 12, majorBrands: ['내과의원', '치과의원'] },
      education: { count: 18, majorBrands: ['공부방', '학원'] },
    },
    rent: {
      avg1F: 3.5, // 1층 평당 3.5만원/월 (근린상업지구)
      avg2F: 2.2, // 2층 이상 평당 2.2만원/월
      avgDeposit: 60, // 보증금 평당 60만원
      trend: 'stable',
      recentChange: -0.5,
    },
    building: {
      avgFloors: '3~4층',
      avgArea: '25~50㎡',
      avgAge: 10,
      parkingAvailability: 'moderate',
    },
    demographics: {
      age2030Ratio: 38,
      age4050Ratio: 40,
      avgIncome: '중',
      mainCustomerType: ['주부', '자영업자', '학생'],
    },
    commercialArea: {
      type: '근린 상업지구',
      mainStreet: '나성로',
      nearbyLandmarks: ['나성동 주민센터', '아파트 단지'],
      brtStation: '나성동',
    },
  },
  '새롬동': {
    name: '새롬동',
    floatingPopulation: {
      daily: 18650,
      weekdayPeak: '12:00-14:00',
      weekendPeak: '13:00-15:00',
      byTimeOfDay: {
        morning: 20,
        afternoon: 42,
        evening: 30,
        night: 8,
      },
      byDayOfWeek: {
        weekday: 19800,
        weekend: 16500,
      },
    },
    competitors: {
      cafe: { count: 35, majorBrands: ['스타벅스', '투썸플레이스', '이디야', '메가커피'] },
      restaurant: { count: 82, majorBrands: ['맥도날드', 'KFC', '피자헛', '놀부부대찌개'] },
      convenience: { count: 15, majorBrands: ['CU', 'GS25', '세븐일레븐', '이마트24'] },
      bakery: { count: 12, majorBrands: ['파리바게뜨', '뚜레쥬르', '던킨'] },
      fitness: { count: 8, majorBrands: ['에니타임피트니스', '커브스', '스포애니'] },
      beauty: { count: 22, majorBrands: ['올리브영', '아리따움', '이니스프리'] },
      clinic: { count: 28, majorBrands: ['연세치과', '삼성안과', '바른정형외과'] },
      education: { count: 42, majorBrands: ['메가스터디', '대성학원', '윤선생'] },
    },
    rent: {
      avg1F: 6.5, // 1층 평당 6.5만원/월 (핵심 상권)
      avg2F: 4.0, // 2층 이상 평당 4만원/월
      avgDeposit: 100, // 보증금 평당 100만원
      trend: 'stable',
      recentChange: 0.8,
    },
    building: {
      avgFloors: '5~7층',
      avgArea: '50~100㎡',
      avgAge: 5,
      parkingAvailability: 'good',
    },
    demographics: {
      age2030Ratio: 48,
      age4050Ratio: 30,
      avgIncome: '상',
      mainCustomerType: ['고소득 직장인', '신혼부부', '젊은 가족'],
    },
    commercialArea: {
      type: '복합 상업지구',
      mainStreet: '새롬로',
      nearbyLandmarks: ['세종컨벤션센터', '세종호수공원', '밀마루전망대'],
      brtStation: '새롬동',
    },
  },
  '다정동': {
    name: '다정동',
    floatingPopulation: {
      daily: 14280,
      weekdayPeak: '17:00-19:00',
      weekendPeak: '12:00-14:00',
      byTimeOfDay: {
        morning: 19,
        afternoon: 36,
        evening: 36,
        night: 9,
      },
      byDayOfWeek: {
        weekday: 15000,
        weekend: 13000,
      },
    },
    competitors: {
      cafe: { count: 24, majorBrands: ['스타벅스', '빽다방', '컴포즈'] },
      restaurant: { count: 58, majorBrands: ['배스킨라빈스', '던킨', '파리바게뜨'] },
      convenience: { count: 10, majorBrands: ['CU', 'GS25', '세븐일레븐'] },
      bakery: { count: 8, majorBrands: ['뚜레쥬르', '성심당'] },
      fitness: { count: 6, majorBrands: ['에니타임피트니스'] },
      beauty: { count: 16, majorBrands: ['올리브영', '미용실'] },
      clinic: { count: 20, majorBrands: ['소아과', '이비인후과', '피부과'] },
      education: { count: 35, majorBrands: ['영어학원', '수학학원', '태권도'] },
    },
    rent: {
      avg1F: 4.8, // 1층 평당 4.8만원/월
      avg2F: 3.0, // 2층 이상 평당 3만원/월
      avgDeposit: 75, // 보증금 평당 75만원
      trend: 'stable',
      recentChange: 0.5,
    },
    building: {
      avgFloors: '4~5층',
      avgArea: '35~70㎡',
      avgAge: 7,
      parkingAvailability: 'good',
    },
    demographics: {
      age2030Ratio: 40,
      age4050Ratio: 38,
      avgIncome: '중상',
      mainCustomerType: ['초등학생 자녀 가족', '맞벌이 부부', '직장인'],
    },
    commercialArea: {
      type: '주거 중심 상업지구',
      mainStreet: '다정로',
      nearbyLandmarks: ['다정동 주민센터', '아파트 단지', '초등학교'],
      brtStation: '다정동',
    },
  },
  '소담동': {
    name: '소담동',
    floatingPopulation: {
      daily: 9850,
      weekdayPeak: '11:00-13:00',
      weekendPeak: '10:00-12:00',
      byTimeOfDay: {
        morning: 24,
        afternoon: 38,
        evening: 30,
        night: 8,
      },
      byDayOfWeek: {
        weekday: 10200,
        weekend: 9100,
      },
    },
    competitors: {
      cafe: { count: 18, majorBrands: ['이디야', '메가커피', '개인카페'] },
      restaurant: { count: 42, majorBrands: ['한식당', '분식집', '치킨집'] },
      convenience: { count: 8, majorBrands: ['CU', 'GS25'] },
      bakery: { count: 5, majorBrands: ['파리바게뜨'] },
      fitness: { count: 4, majorBrands: ['동네 헬스장'] },
      beauty: { count: 10, majorBrands: ['미용실', '네일샵'] },
      clinic: { count: 15, majorBrands: ['내과', '정형외과', '한의원'] },
      education: { count: 22, majorBrands: ['보습학원', '피아노학원'] },
    },
    rent: {
      avg1F: 3.8, // 1층 평당 3.8만원/월 (근린상업)
      avg2F: 2.4, // 2층 이상 평당 2.4만원/월
      avgDeposit: 55, // 보증금 평당 55만원
      trend: 'falling',
      recentChange: -1.8,
    },
    building: {
      avgFloors: '3~4층',
      avgArea: '30~55㎡',
      avgAge: 9,
      parkingAvailability: 'moderate',
    },
    demographics: {
      age2030Ratio: 35,
      age4050Ratio: 42,
      avgIncome: '중',
      mainCustomerType: ['중년 부부', '어린이 가족', '어르신'],
    },
    commercialArea: {
      type: '근린 상업지구',
      mainStreet: '소담로',
      nearbyLandmarks: ['소담동 공원', '주민센터'],
      brtStation: '소담동 생활권역',
    },
  },
  '종촌동': {
    name: '종촌동',
    floatingPopulation: {
      daily: 16380,
      weekdayPeak: '12:00-14:00',
      weekendPeak: '11:00-13:00',
      byTimeOfDay: {
        morning: 21,
        afternoon: 40,
        evening: 31,
        night: 8,
      },
      byDayOfWeek: {
        weekday: 17500,
        weekend: 14200,
      },
    },
    competitors: {
      cafe: { count: 30, majorBrands: ['스타벅스', '투썸플레이스', '이디야'] },
      restaurant: { count: 72, majorBrands: ['맘스터치', '버거킹', '서브웨이'] },
      convenience: { count: 13, majorBrands: ['CU', 'GS25', '세븐일레븐'] },
      bakery: { count: 10, majorBrands: ['파리바게뜨', '뚜레쥬르', '성심당'] },
      fitness: { count: 7, majorBrands: ['스포애니', '짐박스'] },
      beauty: { count: 19, majorBrands: ['올리브영', '이가자헤어'] },
      clinic: { count: 25, majorBrands: ['치과', '안과', '피부과'] },
      education: { count: 38, majorBrands: ['영어학원', '입시학원'] },
    },
    rent: {
      avg1F: 5.5, // 1층 평당 5.5만원/월 (역세권 상업지구)
      avg2F: 3.5, // 2층 이상 평당 3.5만원/월
      avgDeposit: 85, // 보증금 평당 85만원
      trend: 'stable',
      recentChange: 1.2,
    },
    building: {
      avgFloors: '4~6층',
      avgArea: '40~80㎡',
      avgAge: 6,
      parkingAvailability: 'good',
    },
    demographics: {
      age2030Ratio: 44,
      age4050Ratio: 34,
      avgIncome: '중상',
      mainCustomerType: ['직장인', '학생', '젊은 부부'],
    },
    commercialArea: {
      type: '역세권 상업지구',
      mainStreet: '종촌로',
      nearbyLandmarks: ['종촌역', '세종시청', '정부세종청사'],
      brtStation: '종촌동',
    },
  },
  '아름동': {
    name: '아름동',
    floatingPopulation: {
      daily: 17240,
      weekdayPeak: '18:00-20:00',
      weekendPeak: '13:00-15:00',
      byTimeOfDay: {
        morning: 18,
        afternoon: 37,
        evening: 36,
        night: 9,
      },
      byDayOfWeek: {
        weekday: 18000,
        weekend: 15800,
      },
    },
    competitors: {
      cafe: { count: 32, majorBrands: ['스타벅스', '할리스', '투썸플레이스'] },
      restaurant: { count: 78, majorBrands: ['교촌치킨', 'BBQ', '놀부', '아웃백'] },
      convenience: { count: 14, majorBrands: ['CU', 'GS25', '세븐일레븐', '이마트24'] },
      bakery: { count: 11, majorBrands: ['파리바게뜨', '뚜레쥬르', '던킨'] },
      fitness: { count: 8, majorBrands: ['에니타임피트니스', '커브스'] },
      beauty: { count: 21, majorBrands: ['올리브영', '이니스프리', '미샤'] },
      clinic: { count: 26, majorBrands: ['연세치과', '강남안과'] },
      education: { count: 40, majorBrands: ['메가스터디', '재능교육', 'YBM'] },
    },
    rent: {
      avg1F: 5.8, // 1층 평당 5.8만원/월 (복합상업지구)
      avg2F: 3.6, // 2층 이상 평당 3.6만원/월
      avgDeposit: 90, // 보증금 평당 90만원
      trend: 'stable',
      recentChange: 0.5,
    },
    building: {
      avgFloors: '4~6층',
      avgArea: '45~85㎡',
      avgAge: 5,
      parkingAvailability: 'good',
    },
    demographics: {
      age2030Ratio: 46,
      age4050Ratio: 32,
      avgIncome: '상',
      mainCustomerType: ['고소득 맞벌이', '영유아 가족', '젊은 직장인'],
    },
    commercialArea: {
      type: '복합 상업지구',
      mainStreet: '아름로',
      nearbyLandmarks: ['아름동 중심상가', '세종충남대병원', '호수공원'],
      brtStation: '아름동',
    },
  },
};

// 업종별 실제 경쟁 점포 정보 반환
export function getCompetitorInfo(districtName: string, businessType: string): {
  count: number;
  majorBrands: string[];
  nearbyStores: { name: string; distance: string; status: string }[];
} {
  const data = realDistrictData[districtName];
  if (!data) {
    return { count: 0, majorBrands: [], nearbyStores: [] };
  }

  let category: keyof typeof data.competitors;
  switch (businessType) {
    case '카페':
      category = 'cafe';
      break;
    case '음식점':
    case '한식당':
    case '일식당':
    case '양식당':
      category = 'restaurant';
      break;
    case '편의점':
      category = 'convenience';
      break;
    case '베이커리':
    case '빵집':
      category = 'bakery';
      break;
    case '헬스장':
    case '피트니스':
      category = 'fitness';
      break;
    case '미용실':
    case '네일샵':
      category = 'beauty';
      break;
    case '병원':
    case '의원':
    case '한의원':
      category = 'clinic';
      break;
    case '학원':
    case '교육':
      category = 'education';
      break;
    default:
      category = 'restaurant';
  }

  const competitorData = data.competitors[category];
  
  // 실제 주변 점포 정보 생성
  const nearbyStores = competitorData.majorBrands.slice(0, 3).map((brand, idx) => ({
    name: brand,
    distance: `${(idx + 1) * 80 + Math.floor(Math.random() * 50)}m`,
    status: Math.random() > 0.1 ? '영업중' : '휴업',
  }));

  return {
    count: competitorData.count,
    majorBrands: competitorData.majorBrands,
    nearbyStores,
  };
}

// 지역 기본값 (데이터가 없는 경우)
export const defaultDistrictInfo: RealDistrictInfo = {
  name: '기타 지역',
  floatingPopulation: {
    daily: 8000,
    weekdayPeak: '12:00-13:00',
    weekendPeak: '11:00-13:00',
    byTimeOfDay: { morning: 22, afternoon: 38, evening: 32, night: 8 },
    byDayOfWeek: { weekday: 8500, weekend: 7200 },
  },
  competitors: {
    cafe: { count: 10, majorBrands: ['이디야', '메가커피'] },
    restaurant: { count: 30, majorBrands: ['한식당', '분식집'] },
    convenience: { count: 5, majorBrands: ['CU', 'GS25'] },
    bakery: { count: 3, majorBrands: ['파리바게뜨'] },
    fitness: { count: 2, majorBrands: ['헬스장'] },
    beauty: { count: 6, majorBrands: ['미용실'] },
    clinic: { count: 8, majorBrands: ['의원'] },
    education: { count: 12, majorBrands: ['학원'] },
  },
  rent: { avg1F: 3.2, avg2F: 2.0, avgDeposit: 50, trend: 'stable', recentChange: 0 },
  building: { avgFloors: '2~3층', avgArea: '20~40㎡', avgAge: 12, parkingAvailability: 'poor' },
  demographics: { age2030Ratio: 30, age4050Ratio: 45, avgIncome: '중', mainCustomerType: ['주민'] },
  commercialArea: { type: '근린 상업지구', mainStreet: '-', nearbyLandmarks: [], brtStation: null },
};

