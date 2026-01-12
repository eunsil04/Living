import { DistrictData, BusinessType, RecommendationResult } from '../types';

export function calculateRecommendations(
  districts: DistrictData[],
  businessType: BusinessType
): RecommendationResult[] {
  const results: RecommendationResult[] = districts.map(district => {
    // 각 지표별 점수 계산 (0-100 스케일)
    const demandScore = district.demandIndex * 100;
    const competitionScore = (1 - district.competitionIndex) * 100; // 경쟁이 낮을수록 좋음
    const accessibilityScore = district.accessibilityIndex * 100;
    const safetyScore = district.safetyIndex * 100;
    
    // 공실률 기반 추가 점수 (공실률이 적당히 있으면 입주 기회)
    // 너무 높으면 상권 위험, 너무 낮으면 빈 공간 없음
    const vacancyOpportunityScore = getVacancyOpportunityScore(district.vacancyRate);
    
    // 상권활성화지수 반영
    const marketScore = district.marketActivationIndex;

    // 가중치 적용 총점 계산 (공실률과 상권활성화지수 추가)
    const baseScore = 
      demandScore * businessType.demandWeight +
      competitionScore * businessType.competitionWeight +
      accessibilityScore * businessType.accessibilityWeight +
      safetyScore * businessType.safetyWeight;
    
    // 공실 기회와 상권활성화 보너스 (최대 10점)
    const bonusScore = (vacancyOpportunityScore * 0.05) + (marketScore * 0.05);
    
    const totalScore = baseScore + bonusScore;

    // 추천 이유 생성
    const reasons = [
      {
        category: '수요 지표',
        description: getdemandDescription(district),
        value: demandScore,
        contribution: demandScore * businessType.demandWeight
      },
      {
        category: '경쟁 현황',
        description: getCompetitionDescription(district),
        value: competitionScore,
        contribution: competitionScore * businessType.competitionWeight
      },
      {
        category: '교통 접근성',
        description: getAccessibilityDescription(district),
        value: accessibilityScore,
        contribution: accessibilityScore * businessType.accessibilityWeight
      },
      {
        category: '안전 환경',
        description: getSafetyDescription(district),
        value: safetyScore,
        contribution: safetyScore * businessType.safetyWeight
      },
      {
        category: '공실 기회',
        description: getVacancyDescription(district),
        value: vacancyOpportunityScore,
        contribution: vacancyOpportunityScore * 0.05
      },
      {
        category: '상권 활성화',
        description: getMarketDescription(district),
        value: marketScore,
        contribution: marketScore * 0.05
      }
    ];

    return {
      district,
      score: Math.round(totalScore * 10) / 10,
      rank: 0,
      reasons: reasons.sort((a, b) => b.contribution - a.contribution)
    };
  });

  // 순위 정렬 및 부여
  results.sort((a, b) => b.score - a.score);
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return results;
}

// 공실률 기회 점수 (10-25% 구간이 최적)
function getVacancyOpportunityScore(vacancyRate: number): number {
  if (vacancyRate < 5) return 40; // 너무 낮으면 빈 공간 없음
  if (vacancyRate < 10) return 60;
  if (vacancyRate < 15) return 85; // 최적 구간
  if (vacancyRate < 20) return 80;
  if (vacancyRate < 25) return 70;
  if (vacancyRate < 30) return 50;
  return 30; // 너무 높으면 상권 위험
}

function getdemandDescription(district: DistrictData): string {
  const population = district.population;
  const sales = district.cardSales / 1000000000; // 십억원 단위
  
  if (population > 20000 && sales > 15) {
    return `인구 ${population.toLocaleString()}명, 월 카드매출 ${sales.toFixed(1)}십억원으로 높은 소비 수요 예상`;
  } else if (population > 10000) {
    return `인구 ${population.toLocaleString()}명으로 안정적인 수요 기반 보유`;
  } else {
    return `인구 ${population.toLocaleString()}명, 특화 전략 필요`;
  }
}

function getCompetitionDescription(district: DistrictData): string {
  const index = district.competitionIndex;
  
  if (index < 0.4) {
    return '동종 업종 밀집도가 낮아 진입 기회 양호';
  } else if (index < 0.6) {
    return '적정 수준의 경쟁 환경, 차별화 전략 권장';
  } else {
    return '경쟁이 치열한 지역, 명확한 차별화 필수';
  }
}

function getAccessibilityDescription(district: DistrictData): string {
  const bike = district.bikeStations;
  const brt = district.brtStations;
  
  if (brt > 2 && bike > 15) {
    return `BRT ${brt}개소, 공공자전거 ${bike}개소로 우수한 대중교통 접근성`;
  } else if (brt > 0 || bike > 10) {
    return `BRT ${brt}개소, 공공자전거 ${bike}개소로 양호한 접근성`;
  } else {
    return `대중교통 인프라 발전 중, 자가용 의존도 높음`;
  }
}

function getSafetyDescription(district: DistrictData): string {
  const index = district.safetyIndex;
  
  if (index > 0.8) {
    return '야간 유동인구 활성, 가로등·CCTV 양호';
  } else if (index > 0.6) {
    return '전반적으로 안전한 환경';
  } else {
    return '야간 안전 관리 강화 필요 지역';
  }
}

function getVacancyDescription(district: DistrictData): string {
  const rate = district.vacancyRate;
  
  if (rate < 10) {
    return `공실률 ${rate}%로 상권 안정, 신규 입주 공간 제한적`;
  } else if (rate < 20) {
    return `공실률 ${rate}%로 입주 기회 양호, 임대료 협상 가능`;
  } else if (rate < 30) {
    return `공실률 ${rate}%로 입주 용이, 상권 활성화 노력 필요`;
  } else {
    return `공실률 ${rate}%로 높음, 신중한 검토 필요`;
  }
}

function getMarketDescription(district: DistrictData): string {
  const index = district.marketActivationIndex;
  
  if (index >= 70) {
    return `상권활성화지수 ${index}점으로 활발한 상권 형성`;
  } else if (index >= 50) {
    return `상권활성화지수 ${index}점으로 성장 중인 상권`;
  } else {
    return `상권활성화지수 ${index}점으로 발전 초기 단계`;
  }
}

export function getScoreGrade(score: number): { grade: string; color: string } {
  if (score >= 80) return { grade: 'S', color: '#10b981' };
  if (score >= 70) return { grade: 'A', color: '#3b82f6' };
  if (score >= 60) return { grade: 'B', color: '#f59e0b' };
  if (score >= 50) return { grade: 'C', color: '#f97316' };
  return { grade: 'D', color: '#ef4444' };
}
