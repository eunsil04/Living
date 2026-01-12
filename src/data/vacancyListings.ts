// 세종시 공실 상가 매물 샘플 데이터
// 실제 서비스에서는 API 연동으로 대체

export interface VacancyListing {
  id: string
  district: string
  address: string
  floor: string
  size: number  // 평
  rent: number  // 만원/월
  deposit: number  // 만원
  type: '상가' | '사무실' | '점포' | '오피스텔상가'
  features: string[]
  availableDate: string
  contact: string
  imageUrl?: string
  naverUrl?: string
  updatedAt: string
}

// 샘플 데이터 - 실제로는 API에서 가져옴
export const vacancyListings: VacancyListing[] = [
  // 조치원읍
  {
    id: 'v001',
    district: '조치원읍',
    address: '세종시 조치원읍 신흥리 123-4',
    floor: '1층',
    size: 25,
    rent: 80,
    deposit: 3000,
    type: '상가',
    features: ['코너', '주차가능', '신축'],
    availableDate: '즉시입주',
    contact: '010-1234-5678',
    updatedAt: '2026-01-11'
  },
  {
    id: 'v002',
    district: '조치원읍',
    address: '세종시 조치원읍 교리 45-2',
    floor: '1층',
    size: 18,
    rent: 60,
    deposit: 2000,
    type: '점포',
    features: ['역세권', '유동인구多'],
    availableDate: '즉시입주',
    contact: '010-2345-6789',
    updatedAt: '2026-01-10'
  },
  {
    id: 'v003',
    district: '조치원읍',
    address: '세종시 조치원읍 번암리 78',
    floor: '2층',
    size: 35,
    rent: 70,
    deposit: 2500,
    type: '사무실',
    features: ['엘리베이터', '주차3대'],
    availableDate: '2026-02-01',
    contact: '010-3456-7890',
    updatedAt: '2026-01-09'
  },

  // 한솔동
  {
    id: 'v004',
    district: '한솔동',
    address: '세종시 한솔동 1층 상가 A동',
    floor: '1층',
    size: 22,
    rent: 120,
    deposit: 5000,
    type: '상가',
    features: ['BRT역세권', '대단지', '신축'],
    availableDate: '즉시입주',
    contact: '010-4567-8901',
    updatedAt: '2026-01-11'
  },
  {
    id: 'v005',
    district: '한솔동',
    address: '세종시 한솔동 파란마을 상가',
    floor: '1층',
    size: 15,
    rent: 90,
    deposit: 3000,
    type: '점포',
    features: ['카페추천', '전면유리'],
    availableDate: '즉시입주',
    contact: '010-5678-9012',
    updatedAt: '2026-01-10'
  },

  // 새롬동
  {
    id: 'v006',
    district: '새롬동',
    address: '세종시 새롬동 중심상업지구',
    floor: '1층',
    size: 30,
    rent: 150,
    deposit: 8000,
    type: '상가',
    features: ['메인상권', '대형간판', '주차편리'],
    availableDate: '즉시입주',
    contact: '010-6789-0123',
    updatedAt: '2026-01-11'
  },
  {
    id: 'v007',
    district: '새롬동',
    address: '세종시 새롬동 래미안 상가동',
    floor: '2층',
    size: 28,
    rent: 100,
    deposit: 5000,
    type: '사무실',
    features: ['학원가', '엘리베이터'],
    availableDate: '2026-02-15',
    contact: '010-7890-1234',
    updatedAt: '2026-01-08'
  },

  // 나성동
  {
    id: 'v008',
    district: '나성동',
    address: '세종시 나성동 e편한세상 상가',
    floor: '1층',
    size: 20,
    rent: 110,
    deposit: 4000,
    type: '상가',
    features: ['아파트단지', '유동인구多'],
    availableDate: '즉시입주',
    contact: '010-8901-2345',
    updatedAt: '2026-01-11'
  },

  // 도담동
  {
    id: 'v009',
    district: '도담동',
    address: '세종시 도담동 센트럴 상가',
    floor: '1층',
    size: 32,
    rent: 130,
    deposit: 6000,
    type: '상가',
    features: ['대형', 'BRT인접', '주차넓음'],
    availableDate: '즉시입주',
    contact: '010-9012-3456',
    updatedAt: '2026-01-11'
  },
  {
    id: 'v010',
    district: '도담동',
    address: '세종시 도담동 푸르지오 상가',
    floor: '1층',
    size: 18,
    rent: 95,
    deposit: 3500,
    type: '점포',
    features: ['음식점적합', '환기시설'],
    availableDate: '즉시입주',
    contact: '010-0123-4567',
    updatedAt: '2026-01-10'
  },

  // 어진동
  {
    id: 'v011',
    district: '어진동',
    address: '세종시 어진동 힐스테이트 상가',
    floor: '1층',
    size: 25,
    rent: 140,
    deposit: 7000,
    type: '상가',
    features: ['정부청사인접', '직장인多'],
    availableDate: '즉시입주',
    contact: '010-1111-2222',
    updatedAt: '2026-01-11'
  },
  {
    id: 'v012',
    district: '어진동',
    address: '세종시 어진동 자이 상가 B동',
    floor: '2층',
    size: 40,
    rent: 120,
    deposit: 5000,
    type: '사무실',
    features: ['넓은공간', '회의실가능'],
    availableDate: '2026-01-20',
    contact: '010-2222-3333',
    updatedAt: '2026-01-09'
  },

  // 종촌동
  {
    id: 'v013',
    district: '종촌동',
    address: '세종시 종촌동 호수공원 인근',
    floor: '1층',
    size: 22,
    rent: 100,
    deposit: 4000,
    type: '상가',
    features: ['호수뷰', '카페적합'],
    availableDate: '즉시입주',
    contact: '010-3333-4444',
    updatedAt: '2026-01-11'
  },

  // 아름동
  {
    id: 'v014',
    district: '아름동',
    address: '세종시 아름동 롯데캐슬 상가',
    floor: '1층',
    size: 28,
    rent: 105,
    deposit: 4500,
    type: '상가',
    features: ['대단지', '주민밀집'],
    availableDate: '즉시입주',
    contact: '010-4444-5555',
    updatedAt: '2026-01-10'
  },
  {
    id: 'v015',
    district: '아름동',
    address: '세종시 아름동 2단지 상가',
    floor: '1층',
    size: 16,
    rent: 75,
    deposit: 2500,
    type: '점포',
    features: ['소형', '월세저렴'],
    availableDate: '즉시입주',
    contact: '010-5555-6666',
    updatedAt: '2026-01-09'
  },

  // 대평동
  {
    id: 'v016',
    district: '대평동',
    address: '세종시 대평동 센트럴파크 상가',
    floor: '1층',
    size: 35,
    rent: 160,
    deposit: 8000,
    type: '상가',
    features: ['프리미엄', '대형', '주차편리'],
    availableDate: '즉시입주',
    contact: '010-6666-7777',
    updatedAt: '2026-01-11'
  },

  // 고운동
  {
    id: 'v017',
    district: '고운동',
    address: '세종시 고운동 SK뷰 상가',
    floor: '1층',
    size: 20,
    rent: 85,
    deposit: 3000,
    type: '상가',
    features: ['신축', '깔끔인테리어'],
    availableDate: '즉시입주',
    contact: '010-7777-8888',
    updatedAt: '2026-01-10'
  },
  {
    id: 'v018',
    district: '고운동',
    address: '세종시 고운동 메트로시티',
    floor: '2층',
    size: 45,
    rent: 90,
    deposit: 4000,
    type: '사무실',
    features: ['학원적합', '넓은공간'],
    availableDate: '2026-02-01',
    contact: '010-8888-9999',
    updatedAt: '2026-01-08'
  },

  // 소담동
  {
    id: 'v019',
    district: '소담동',
    address: '세종시 소담동 신규 상가',
    floor: '1층',
    size: 24,
    rent: 95,
    deposit: 3500,
    type: '상가',
    features: ['신규입주', 'BRT인접'],
    availableDate: '즉시입주',
    contact: '010-9999-0000',
    updatedAt: '2026-01-11'
  },

  // 반곡동
  {
    id: 'v020',
    district: '반곡동',
    address: '세종시 반곡동 오션시티 상가',
    floor: '1층',
    size: 30,
    rent: 120,
    deposit: 5000,
    type: '상가',
    features: ['신축', '대단지', '주차넓음'],
    availableDate: '즉시입주',
    contact: '010-0000-1111',
    updatedAt: '2026-01-11'
  },
  {
    id: 'v021',
    district: '반곡동',
    address: '세종시 반곡동 파크뷰 상가',
    floor: '1층',
    size: 18,
    rent: 85,
    deposit: 3000,
    type: '점포',
    features: ['음식점적합', '환기○'],
    availableDate: '즉시입주',
    contact: '010-1234-0000',
    updatedAt: '2026-01-10'
  },

  // 보람동
  {
    id: 'v022',
    district: '보람동',
    address: '세종시 보람동 마을상가',
    floor: '1층',
    size: 15,
    rent: 50,
    deposit: 1500,
    type: '점포',
    features: ['저렴', '소형창업'],
    availableDate: '즉시입주',
    contact: '010-2345-0000',
    updatedAt: '2026-01-09'
  },

  // 금남면
  {
    id: 'v023',
    district: '금남면',
    address: '세종시 금남면 중앙로',
    floor: '1층',
    size: 40,
    rent: 45,
    deposit: 1500,
    type: '상가',
    features: ['넓은공간', '저렴한임대료'],
    availableDate: '즉시입주',
    contact: '010-3456-0000',
    updatedAt: '2026-01-11'
  },

  // 부강면
  {
    id: 'v024',
    district: '부강면',
    address: '세종시 부강면 부강리',
    floor: '1층',
    size: 35,
    rent: 35,
    deposit: 1000,
    type: '상가',
    features: ['주차넓음', '창고포함'],
    availableDate: '즉시입주',
    contact: '010-4567-0000',
    updatedAt: '2026-01-10'
  },

  // 연기면
  {
    id: 'v025',
    district: '연기면',
    address: '세종시 연기면 세종리',
    floor: '1층',
    size: 30,
    rent: 40,
    deposit: 1200,
    type: '점포',
    features: ['마을중심', '주민밀집'],
    availableDate: '즉시입주',
    contact: '010-5678-0000',
    updatedAt: '2026-01-09'
  }
]

// 지역별 공실 매물 가져오기
export function getListingsByDistrict(districtName: string): VacancyListing[] {
  return vacancyListings.filter(listing => listing.district === districtName)
}

// 전체 공실 매물 수
export function getTotalListingsCount(): number {
  return vacancyListings.length
}

// 지역별 공실 매물 수
export function getListingsCountByDistrict(districtName: string): number {
  return vacancyListings.filter(listing => listing.district === districtName).length
}

// 네이버 부동산 검색 URL 생성
export function getNaverRealEstateSearchUrl(district: string, type?: string): string {
  const query = encodeURIComponent(`세종시 ${district} ${type || '상가'} 임대`)
  return `https://land.naver.com/search/result.naver?query=${query}`
}

// 직방 검색 URL 생성
export function getZigbangSearchUrl(district: string): string {
  const query = encodeURIComponent(`세종시 ${district} 상가`)
  return `https://www.zigbang.com/home/search?keyword=${query}`
}

// 다방 검색 URL 생성
export function getDabangSearchUrl(district: string): string {
  const query = encodeURIComponent(`세종 ${district}`)
  return `https://www.dabangapp.com/search?keyword=${query}`
}

