import './AboutSection.css'

interface AboutSectionProps {
  onClose: () => void
}

function AboutSection({ onClose }: AboutSectionProps) {
  return (
    <div className="about-overlay">
      <div className="about-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="about-header">
          <span className="about-icon">🏙️</span>
          <h2>세종시 공실·상권 데이터 통합 지도 및<br/>AI 기반 업종 입지 추천 플랫폼</h2>
          <p className="about-category">도시 환경·교통·안전 혁신</p>
        </div>

        <div className="about-section">
          <h3>🎯 프로젝트 목적</h3>
          <p>
            세종시 내 공실 및 상권 관련 정보를 한눈에 확인할 수 있는 지도 기반 통합 플랫폼입니다.
            예비 창업자의 합리적 의사결정을 지원하고, <strong>공실 해소 및 상권 활성화</strong>로 
            도시 미관·안전·활력을 개선하는 <strong>지역사회 발전</strong>에 기여합니다.
          </p>
        </div>

        <div className="about-section">
          <h3>📊 주요 기능</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon">🗺️</span>
              <div>
                <h4>통합 지도</h4>
                <p>공실/상가 위치·조건 시각화</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <div>
                <h4>지표 분석</h4>
                <p>카드매출·인구·교통·안전 집계</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <div>
                <h4>AI 추천</h4>
                <p>업종별 입지 적합도 추천</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <div>
                <h4>설명가능 AI</h4>
                <p>추천 근거 상세 제공</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>🤝 희망 협력기관</h3>
          <div className="partner-list">
            <div className="partner-item">
              <span>🏛️</span>
              <span>세종특별자치시 (상권·도시·교통·안전 관련 부서)</span>
            </div>
            <div className="partner-item">
              <span>🏪</span>
              <span>세종시 소상공인/상권 활성화 유관기관</span>
            </div>
            <div className="partner-item">
              <span>🚌</span>
              <span>세종도시교통공사 (대중교통 데이터)</span>
            </div>
            <div className="partner-item">
              <span>🏠</span>
              <span>지역 상인회·부동산 중개 네트워크 (현장 검증)</span>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>🌱 기대 효과</h3>
          <div className="effect-grid">
            <div className="effect-item">
              <div className="effect-number">📉</div>
              <p>정보 탐색 비용 절감</p>
            </div>
            <div className="effect-item">
              <div className="effect-number">💼</div>
              <p>창업 의사결정 객관성 향상</p>
            </div>
            <div className="effect-item">
              <div className="effect-number">🏙️</div>
              <p>도시 미관 개선</p>
            </div>
            <div className="effect-item">
              <div className="effect-number">🛡️</div>
              <p>안전 취약 요소 완화</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>🔄 확장 가능성</h3>
          <p className="expansion-text">
            분석 지표/추천 기준/지도 UI를 <strong>모듈화</strong>하여 
            세종시 내 신규 생활권 확장 및 <strong>타 지역(신도시, 혁신도시) 적용</strong>이 가능한 
            확장형 도시 데이터 기반 서비스 모델입니다.
          </p>
          <div className="expansion-targets">
            <span className="target-badge">세종시 6-2생활권</span>
            <span className="target-badge">전국 혁신도시</span>
            <span className="target-badge">신규 개발 신도시</span>
          </div>
        </div>

        <div className="about-section team-section">
          <h3>👥 팀 소개</h3>
          <div className="team-info">
            <div className="team-name">
              <span className="team-badge">팀명</span>
              <span>502호 방보러 와유</span>
            </div>
            <div className="team-members">
              <span className="team-badge">팀원</span>
              <span>최은실(팀장), 김주훈, 정재성</span>
            </div>
            <div className="team-school">
              <span className="team-badge">소속</span>
              <span>국립한밭대학교 인공지능소프트웨어학과</span>
            </div>
          </div>
        </div>

        <div className="about-footer">
          <p>2025-2026 지역혁신을 위한 실증 리빙랩 경진대회</p>
          <p>국립한밭대학교 세종RISE사업추진단</p>
        </div>
      </div>
    </div>
  )
}

export default AboutSection

