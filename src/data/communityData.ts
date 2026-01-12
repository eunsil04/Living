import { DistrictData, CommunityImpact, InfrastructureNeed } from '../types';

// 공실률 1% 감소당 효과 (연구 기반 추정치)
export const VACANCY_REDUCTION_EFFECTS = {
  economicEffectPerPercent: 2.5,  // 억원/1%
  jobsPerPercent: 15,             // 명/1%
  safetyImprovementPerPercent: 1.2, // %/1%
};

// 생활 인프라 카테고리별 필요 업종
export const INFRASTRUCTURE_CATEGORIES = {
  medical: {
    name: '의료/건강',
    icon: '🏥',
    businesses: ['약국', '병원', '한의원', '치과'],
    minPerPopulation: 3000,  // 인구 3000명당 1개 필요
  },
  food: {
    name: '식음료',
    icon: '🍽️',
    businesses: ['음식점', '카페', '편의점', '마트'],
    minPerPopulation: 500,
  },
  education: {
    name: '교육/문화',
    icon: '📚',
    businesses: ['학원', '서점', '문화센터'],
    minPerPopulation: 2000,
  },
  services: {
    name: '생활서비스',
    icon: '✂️',
    businesses: ['미용실', '세탁소', '수선점'],
    minPerPopulation: 1500,
  },
  fitness: {
    name: '운동/레저',
    icon: '🏋️',
    businesses: ['헬스장', '요가', '필라테스'],
    minPerPopulation: 4000,
  },
};

// 지역별 생활 인프라 부족 분석
export function analyzeInfrastructureNeeds(districts: DistrictData[]): InfrastructureNeed[] {
  const needs: InfrastructureNeed[] = [];
  
  // 의료 인프라 부족 지역 (읍면 지역 + 신규 생활권)
  const medicalShortage = districts.filter(d => 
    d.livingArea.includes('읍면') || d.marketActivationIndex < 50
  );
  if (medicalShortage.length > 0) {
    needs.push({
      category: '의료/건강',
      icon: '🏥',
      shortage: 75,
      districts: medicalShortage.map(d => d.name)
    });
  }

  // 교육 인프라 부족 지역 (인구 대비)
  const educationShortage = districts.filter(d => 
    d.population > 15000 && d.marketActivationIndex < 65
  );
  if (educationShortage.length > 0) {
    needs.push({
      category: '교육/문화',
      icon: '📚',
      shortage: 60,
      districts: educationShortage.map(d => d.name)
    });
  }

  // 생활서비스 부족 지역
  const serviceShortage = districts.filter(d => 
    d.vacancyRate > 25 || d.marketActivationIndex < 45
  );
  if (serviceShortage.length > 0) {
    needs.push({
      category: '생활서비스',
      icon: '✂️',
      shortage: 55,
      districts: serviceShortage.map(d => d.name)
    });
  }

  // 운동/레저 부족 지역
  const fitnessShortage = districts.filter(d => 
    d.population > 20000 && d.livingArea.includes('생활권') && d.marketActivationIndex < 70
  );
  if (fitnessShortage.length > 0) {
    needs.push({
      category: '운동/레저',
      icon: '🏋️',
      shortage: 45,
      districts: fitnessShortage.map(d => d.name)
    });
  }

  return needs.sort((a, b) => b.shortage - a.shortage);
}

// 공실 해소 시뮬레이션
export function simulateVacancyReduction(
  district: DistrictData,
  targetVacancyRate: number
): CommunityImpact {
  const reduction = district.vacancyRate - targetVacancyRate;
  
  return {
    district: district.name,
    currentVacancy: district.vacancyRate,
    targetVacancy: targetVacancyRate,
    economicEffect: Math.round(reduction * VACANCY_REDUCTION_EFFECTS.economicEffectPerPercent * 10) / 10,
    jobCreation: Math.round(reduction * VACANCY_REDUCTION_EFFECTS.jobsPerPercent),
    safetyImprovement: Math.round(reduction * VACANCY_REDUCTION_EFFECTS.safetyImprovementPerPercent * 10) / 10,
    infrastructureScore: district.marketActivationIndex,
    diversityIndex: calculateDiversityIndex(district),
  };
}

// 상권 다양성 지수 계산 (0-100)
export function calculateDiversityIndex(district: DistrictData): number {
  // 다양한 요소를 고려한 다양성 점수
  const populationFactor = Math.min(district.population / 30000, 1) * 30;
  const salesFactor = Math.min(district.cardSales / 20000000000, 1) * 25;
  const transportFactor = (district.brtStations * 5 + district.bikeStations * 2) / 2;
  const activationFactor = district.marketActivationIndex * 0.3;
  
  return Math.round(populationFactor + salesFactor + Math.min(transportFactor, 15) + activationFactor);
}

// 전체 지역 공실 해소 효과 계산
export function calculateTotalCommunityImpact(
  districts: DistrictData[],
  targetReductionPercent: number = 5
): {
  totalEconomicEffect: number;
  totalJobCreation: number;
  avgSafetyImprovement: number;
  affectedDistricts: number;
} {
  const impacts = districts
    .filter(d => d.vacancyRate > 10)  // 공실률 10% 이상인 지역만
    .map(d => simulateVacancyReduction(d, Math.max(d.vacancyRate - targetReductionPercent, 5)));
  
  return {
    totalEconomicEffect: Math.round(impacts.reduce((sum, i) => sum + i.economicEffect, 0)),
    totalJobCreation: impacts.reduce((sum, i) => sum + i.jobCreation, 0),
    avgSafetyImprovement: Math.round(impacts.reduce((sum, i) => sum + i.safetyImprovement, 0) / impacts.length * 10) / 10,
    affectedDistricts: impacts.length,
  };
}

// 업종별 예상 일자리 창출
export const JOB_CREATION_BY_BUSINESS: Record<string, number> = {
  'cafe': 3,
  'restaurant': 5,
  'convenience': 2,
  'beauty': 3,
  'gym': 4,
  'pharmacy': 3,
  'retail': 2,
  'education': 4,
};

// 지역 우선순위 점수 계산 (정책 결정자용)
export function calculatePriorityScore(district: DistrictData): {
  score: number;
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  // 높은 공실률 = 높은 우선순위
  if (district.vacancyRate > 30) {
    score += 30;
    reasons.push('심각한 공실률 (30% 이상)');
  } else if (district.vacancyRate > 20) {
    score += 20;
    reasons.push('높은 공실률 (20-30%)');
  }

  // 인구 대비 상권 활성화 낮음
  if (district.population > 15000 && district.marketActivationIndex < 60) {
    score += 25;
    reasons.push('인구 대비 상권 저활성화');
  }

  // 교통 인프라 부족
  if (district.brtStations === 0 && district.bikeStations < 5) {
    score += 15;
    reasons.push('교통 인프라 부족');
  }

  // 안전 지수 낮음
  if (district.safetyIndex < 0.6) {
    score += 20;
    reasons.push('안전 환경 개선 필요');
  }

  // 읍면 지역 가산점
  if (district.livingArea.includes('읍면') || district.livingArea === '구도심') {
    score += 10;
    reasons.push('균형 발전 대상 지역');
  }

  return { score, reasons };
}

