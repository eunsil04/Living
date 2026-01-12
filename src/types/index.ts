export interface DistrictData {
  name: string;
  code: string;
  population: number;
  cardSales: number;
  bikeStations: number;
  brtStations: number;
  coordinates: [number, number];
  competitionIndex: number;
  demandIndex: number;
  accessibilityIndex: number;
  safetyIndex: number;
  // 공실률 관련 데이터
  livingArea: string;
  vacancyRate: number;
  residentialVacancy: number;
  collectiveVacancy: number;
  officetelVacancy: number;
  marketActivationIndex: number;
  predictedVacancy2025: number;
}

export interface BusinessType {
  id: string;
  name: string;
  icon: string;
  demandWeight: number;
  competitionWeight: number;
  accessibilityWeight: number;
  safetyWeight: number;
}

export interface RecommendationResult {
  district: DistrictData;
  score: number;
  rank: number;
  reasons: {
    category: string;
    description: string;
    value: number;
    contribution: number;
  }[];
}

export interface BikeStation {
  id: string;
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
}

export interface BRTStation {
  route: string;
  stationId: string;
  stationName: string;
  lat: number;
  lng: number;
  order: number;
}

export interface CardSalesData {
  date: string;
  districtCode: string;
  districtName: string;
  amount: number;
  ratio: number;
  changeRate: number;
}

// 지역사회 영향 분석
export interface CommunityImpact {
  district: string;
  currentVacancy: number;
  targetVacancy: number;
  economicEffect: number;  // 경제적 효과 (억원)
  jobCreation: number;     // 일자리 창출 (명)
  safetyImprovement: number; // 안전 개선도 (%)
  infrastructureScore: number; // 생활인프라 점수
  diversityIndex: number;  // 상권 다양성 지수
}

export interface InfrastructureNeed {
  category: string;
  icon: string;
  shortage: number;  // 부족 정도 (0-100)
  districts: string[];
}

export type ViewMode = 'recommendation' | 'vacancy' | 'analysis' | 'community';

// 별칭 타입 (간단한 사용을 위해)
export type District = DistrictData;
export type Recommendation = RecommendationResult;
