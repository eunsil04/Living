// 세종시 생활권별 공실률 데이터 (세종시ppt.pdf 기반)
export interface VacancyData {
  district: string;
  livingArea: string;  // 생활권
  residentialVacancy: number;  // 주거단지상가 공실률
  collectiveVacancy: number;   // 집합상가 공실률
  officetelVacancy: number;    // 오피스텔 저층부 상가 공실률
  averageVacancy: number;      // 평균 공실률
  marketActivationIndex: number; // 상권활성화지수 (0-100)
  predictedVacancy2025: number;  // 2025년 예측 공실률
}

// 생활권별 공실률 데이터
export const vacancyByLivingArea: VacancyData[] = [
  {
    district: '한솔동',
    livingArea: '1-1생활권',
    residentialVacancy: 8.5,
    collectiveVacancy: 22.3,
    officetelVacancy: 15.2,
    averageVacancy: 15.3,
    marketActivationIndex: 72,
    predictedVacancy2025: 14.1
  },
  {
    district: '새롬동',
    livingArea: '1-2생활권',
    residentialVacancy: 7.2,
    collectiveVacancy: 18.5,
    officetelVacancy: 12.8,
    averageVacancy: 12.8,
    marketActivationIndex: 78,
    predictedVacancy2025: 11.5
  },
  {
    district: '나성동',
    livingArea: '1-3생활권',
    residentialVacancy: 9.1,
    collectiveVacancy: 24.6,
    officetelVacancy: 16.3,
    averageVacancy: 16.7,
    marketActivationIndex: 68,
    predictedVacancy2025: 15.2
  },
  {
    district: '도담동',
    livingArea: '1-4생활권',
    residentialVacancy: 6.8,
    collectiveVacancy: 20.1,
    officetelVacancy: 14.5,
    averageVacancy: 13.8,
    marketActivationIndex: 75,
    predictedVacancy2025: 12.3
  },
  {
    district: '어진동',
    livingArea: '1-5생활권',
    residentialVacancy: 10.2,
    collectiveVacancy: 26.8,
    officetelVacancy: 18.9,
    averageVacancy: 18.6,
    marketActivationIndex: 65,
    predictedVacancy2025: 17.1
  },
  {
    district: '종촌동',
    livingArea: '2-1생활권',
    residentialVacancy: 11.5,
    collectiveVacancy: 28.3,
    officetelVacancy: 19.2,
    averageVacancy: 19.7,
    marketActivationIndex: 62,
    predictedVacancy2025: 18.5
  },
  {
    district: '아름동',
    livingArea: '2-2생활권',
    residentialVacancy: 11.2,
    collectiveVacancy: 29.7,
    officetelVacancy: 19.5,
    averageVacancy: 20.1,
    marketActivationIndex: 60,
    predictedVacancy2025: 18.8
  },
  {
    district: '대평동',
    livingArea: '2-3생활권',
    residentialVacancy: 10.8,
    collectiveVacancy: 27.5,
    officetelVacancy: 18.1,
    averageVacancy: 18.8,
    marketActivationIndex: 64,
    predictedVacancy2025: 17.3
  },
  {
    district: '고운동',
    livingArea: '2-4생활권',
    residentialVacancy: 12.3,
    collectiveVacancy: 31.2,
    officetelVacancy: 21.5,
    averageVacancy: 21.7,
    marketActivationIndex: 58,
    predictedVacancy2025: 20.2
  },
  {
    district: '소담동',
    livingArea: '3-1생활권',
    residentialVacancy: 8.9,
    collectiveVacancy: 23.4,
    officetelVacancy: 15.8,
    averageVacancy: 16.0,
    marketActivationIndex: 70,
    predictedVacancy2025: 14.5
  },
  {
    district: '반곡동',
    livingArea: '3-2생활권',
    residentialVacancy: 7.5,
    collectiveVacancy: 19.8,
    officetelVacancy: 13.6,
    averageVacancy: 13.6,
    marketActivationIndex: 76,
    predictedVacancy2025: 12.1
  },
  {
    district: '조치원읍',
    livingArea: '구도심',
    residentialVacancy: 15.8,
    collectiveVacancy: 35.2,
    officetelVacancy: 25.3,
    averageVacancy: 25.4,
    marketActivationIndex: 48,
    predictedVacancy2025: 24.1
  },
  {
    district: '보람동',
    livingArea: '4-1생활권',
    residentialVacancy: 13.2,
    collectiveVacancy: 32.8,
    officetelVacancy: 22.1,
    averageVacancy: 22.7,
    marketActivationIndex: 55,
    predictedVacancy2025: 21.5
  },
  {
    district: '금남면',
    livingArea: '읍면지역',
    residentialVacancy: 18.5,
    collectiveVacancy: 38.2,
    officetelVacancy: 28.6,
    averageVacancy: 28.4,
    marketActivationIndex: 42,
    predictedVacancy2025: 27.8
  },
  {
    district: '부강면',
    livingArea: '읍면지역',
    residentialVacancy: 20.1,
    collectiveVacancy: 42.5,
    officetelVacancy: 31.2,
    averageVacancy: 31.3,
    marketActivationIndex: 38,
    predictedVacancy2025: 30.5
  },
  {
    district: '연기면',
    livingArea: '읍면지역',
    residentialVacancy: 19.2,
    collectiveVacancy: 40.1,
    officetelVacancy: 29.8,
    averageVacancy: 29.7,
    marketActivationIndex: 40,
    predictedVacancy2025: 28.9
  },
  {
    district: '연서면',
    livingArea: '읍면지역',
    residentialVacancy: 21.5,
    collectiveVacancy: 44.2,
    officetelVacancy: 33.1,
    averageVacancy: 32.9,
    marketActivationIndex: 35,
    predictedVacancy2025: 32.1
  },
  {
    district: '장군면',
    livingArea: '읍면지역',
    residentialVacancy: 23.8,
    collectiveVacancy: 48.5,
    officetelVacancy: 36.2,
    averageVacancy: 36.2,
    marketActivationIndex: 30,
    predictedVacancy2025: 35.5
  },
  {
    district: '전의면',
    livingArea: '읍면지역',
    residentialVacancy: 25.2,
    collectiveVacancy: 52.1,
    officetelVacancy: 38.5,
    averageVacancy: 38.6,
    marketActivationIndex: 28,
    predictedVacancy2025: 37.8
  },
  {
    district: '전동면',
    livingArea: '읍면지역',
    residentialVacancy: 24.5,
    collectiveVacancy: 50.3,
    officetelVacancy: 37.1,
    averageVacancy: 37.3,
    marketActivationIndex: 29,
    predictedVacancy2025: 36.5
  }
];

// 상가 유형별 전체 평균 공실률
export const overallVacancyStats = {
  residential: {
    name: '주거단지상가',
    average: 11.2,
    sejongAvg: 14.4,
    nationalAvg: 6.9
  },
  collective: {
    name: '집합상가',
    average: 29.7,
    sejongAvg: 25.7,
    nationalAvg: 13.8
  },
  officetel: {
    name: '오피스텔 저층부',
    average: 19.5,
    sejongAvg: 18.2,
    nationalAvg: 8.5
  }
};

// 적정 상가 면적 계산 함수
export function calculateOptimalArea(
  plotArea: number,        // 획지 면적 (m²)
  maxFAR: number,          // 최대 허용 용적률 (%)
  vacancyRate: number      // 공실률 (%)
): number {
  return plotArea * (maxFAR / 100) * ((100 - vacancyRate) / 100);
}

// 상권활성화지수 계산 (여러 요인 기반)
export function calculateMarketActivationIndex(
  population: number,
  cardSales: number,
  transportScore: number,
  vacancyRate: number
): number {
  // 정규화된 점수 계산
  const popScore = Math.min(population / 40000, 1) * 25;
  const salesScore = Math.min(cardSales / 50000000000, 1) * 25;
  const transportScoreNorm = transportScore * 25;
  const vacancyScore = (1 - vacancyRate / 50) * 25;
  
  return Math.round(popScore + salesScore + transportScoreNorm + vacancyScore);
}

// 공실 위험도 등급
export function getVacancyRiskLevel(vacancyRate: number): {
  level: string;
  color: string;
  description: string;
} {
  if (vacancyRate < 10) {
    return { level: '양호', color: '#10b981', description: '상권 활성화 양호' };
  } else if (vacancyRate < 20) {
    return { level: '주의', color: '#f59e0b', description: '모니터링 필요' };
  } else if (vacancyRate < 30) {
    return { level: '경고', color: '#f97316', description: '공실 위험 증가' };
  } else {
    return { level: '위험', color: '#ef4444', description: '적극적 대응 필요' };
  }
}

