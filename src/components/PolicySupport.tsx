import { DistrictData, BusinessType } from '../types'
import './PolicySupport.css'

interface PolicySupportProps {
  district: DistrictData
  businessType: BusinessType
  onBack: () => void
  onGoHome: () => void
}

interface Policy {
  id: string
  title: string
  icon: string
  category: string
  target: string
  content: string
  period: string
  link: string
  tags: string[]
  highlight?: boolean
}

function PolicySupport({ district, businessType, onBack, onGoHome }: PolicySupportProps) {
  // 세종시 기반 정책 데이터 (실제 링크 연결)
  const policies: Policy[] = [
    {
      id: '1',
      title: '세종시 청년창업지원센터',
      icon: '🏢',
      category: '창업공간',
      target: '만 39세 이하 (예비)창업자',
      content: '창업공간 무상 제공, 멘토링, 네트워킹 프로그램 지원',
      period: '상시 모집',
      link: 'https://www.sjstarton.or.kr/main.do',
      tags: ['공간지원', '멘토링', '네트워킹'],
      highlight: true
    },
    {
      id: '2',
      title: '소상공인 임대료 지원',
      icon: '💰',
      category: '임대료지원',
      target: '연매출 3억 이하 소상공인',
      content: '월 임대료의 50% 지원 (최대 월 50만원, 6개월)',
      period: '2025.01 ~ 2025.12',
      link: 'https://www.sejong.go.kr/prog/depart/sub02_06_01/DS0601/list.do',
      tags: ['임대료', '소상공인', '재정지원'],
      highlight: true
    },
    {
      id: '3',
      title: '공공임대상가 입점 지원',
      icon: '🏪',
      category: '창업공간',
      target: '신규 창업 희망자',
      content: '시세 대비 60~80% 수준의 저렴한 임대료로 상가 입점 기회 제공',
      period: '수시 공고',
      link: 'https://www.sejong.go.kr/prog/depart/sub02_06_01/DS0601/list.do',
      tags: ['공공임대', '저렴한임대료'],
    },
    {
      id: '4',
      title: '청년몰 입점 창업자 모집',
      icon: '🛍️',
      category: '창업공간',
      target: '만 39세 이하 청년 창업자',
      content: '리빙랩 청년몰 입점, 인테리어 비용 지원 (최대 1,000만원)',
      period: '2025.03 모집 예정',
      link: 'https://www.sejong.go.kr/prog/depart/sub02_06_01/DS0601/list.do',
      tags: ['청년몰', '인테리어지원', '청년'],
    },
    {
      id: '5',
      title: '간판 개선 사업',
      icon: '🪧',
      category: '시설개선',
      target: '노후 간판 보유 소상공인',
      content: '간판 제작·설치 비용 80% 지원 (최대 300만원)',
      period: '2025.04 ~ 예산 소진시',
      link: 'https://www.sejong.go.kr/prog/depart/sub02_06_01/DS0601/list.do',
      tags: ['간판', '시설개선'],
    },
    {
      id: '6',
      title: '소상공인 경영컨설팅',
      icon: '📊',
      category: '컨설팅',
      target: '창업 3년 이내 소상공인',
      content: '마케팅, 재무, 법률 등 전문 컨설팅 무료 제공',
      period: '상시',
      link: 'https://www.semas.or.kr/web/business/consult/consulting.kmdc',
      tags: ['컨설팅', '경영지원'],
    },
    {
      id: '7',
      title: '소상공인 정책자금 대출',
      icon: '🏦',
      category: '금융지원',
      target: '사업자등록 소상공인',
      content: '연 2% 저금리 정책자금 대출 (최대 1억원)',
      period: '상시',
      link: 'https://www.semas.or.kr/web/business/policyFund/intro.kmdc',
      tags: ['대출', '저금리', '금융'],
    },
    {
      id: '8',
      title: '디지털 전환 지원사업',
      icon: '💻',
      category: '디지털',
      target: '디지털 전환 희망 소상공인',
      content: '스마트스토어 개설, 키오스크 도입 등 디지털화 비용 지원',
      period: '2025.02 ~ 2025.11',
      link: 'https://www.sbiz.or.kr/cose/main.do',
      tags: ['디지털', '스마트스토어', 'IT'],
    },
  ]

  const categories = ['전체', '창업공간', '임대료지원', '시설개선', '컨설팅', '금융지원', '디지털']

  return (
    <div className="policy-support-page">
      {/* 헤더 */}
      <header className="policy-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <span>←</span>
            <span>상세 분석으로</span>
          </button>
        </div>
        
        <div className="header-center">
          <h1>🎯 맞춤 정책·지원 안내</h1>
          <p><strong>{district.name}</strong> 지역 <strong>{businessType.name}</strong> 창업을 위한 지원 프로그램</p>
        </div>
        
        <div className="header-right">
          <button className="home-btn" onClick={onGoHome}>
            <span>🏠</span>
            <span>처음으로</span>
          </button>
        </div>
      </header>

      <div className="policy-content">
        {/* 카테고리 필터 */}
        <div className="category-filter">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${cat === '전체' ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 추천 정책 하이라이트 */}
        <section className="highlight-section">
          <div className="section-header">
            <h2>⭐ AI 추천 정책</h2>
            <p>{district.name}에서 {businessType.name} 창업 시 가장 적합한 지원 프로그램</p>
          </div>
          
          <div className="highlight-cards">
            {policies.filter(p => p.highlight).map(policy => (
              <div key={policy.id} className="highlight-card">
                <div className="highlight-badge">추천</div>
                <div className="card-icon">{policy.icon}</div>
                <div className="card-content">
                  <span className="card-category">{policy.category}</span>
                  <h3>{policy.title}</h3>
                  <p className="card-target">
                    <span className="target-label">지원대상</span>
                    <span>{policy.target}</span>
                  </p>
                  <p className="card-desc">{policy.content}</p>
                  <div className="card-tags">
                    {policy.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <span className="period">📅 {policy.period}</span>
                    <a href={policy.link} target="_blank" rel="noopener noreferrer" className="apply-btn">
                      신청하기 →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 전체 정책 목록 */}
        <section className="policy-list-section">
          <div className="section-header">
            <h2>📋 전체 지원 정책</h2>
            <p>세종시에서 제공하는 창업 지원 프로그램</p>
          </div>

          <div className="policy-grid">
            {policies.map(policy => (
              <div key={policy.id} className="policy-card">
                <div className="policy-card-header">
                  <span className="policy-icon">{policy.icon}</span>
                  <span className="policy-category">{policy.category}</span>
                </div>
                <h3 className="policy-title">{policy.title}</h3>
                <div className="policy-info">
                  <div className="info-row">
                    <span className="info-label">지원대상</span>
                    <span className="info-value">{policy.target}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">지원내용</span>
                    <span className="info-value">{policy.content}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">신청기간</span>
                    <span className="info-value">{policy.period}</span>
                  </div>
                </div>
                <div className="policy-tags">
                  {policy.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <a href={policy.link} target="_blank" rel="noopener noreferrer" className="policy-link">
                  <span>신청 페이지 바로가기</span>
                  <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 추가 안내 */}
        <section className="info-section">
          <div className="info-card">
            <div className="info-icon">📞</div>
            <div className="info-content">
              <h4>상담 문의</h4>
              <p>세종시 일자리경제과: 044-300-3831</p>
              <p>소상공인시장진흥공단: 1588-5302</p>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🔔</div>
            <div className="info-content">
              <h4>알림 신청</h4>
              <p>새로운 지원 정책이 등록되면 알림을 받아보세요</p>
              <button className="notify-btn">알림 신청하기</button>
            </div>
          </div>
        </section>
      </div>

      {/* 플로팅 액션 */}
      <div className="floating-action">
        <button className="floating-btn" onClick={onGoHome}>
          <span>🔄</span>
          <span>다른 업종으로 다시 분석</span>
        </button>
      </div>
    </div>
  )
}

export default PolicySupport

