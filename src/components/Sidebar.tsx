import { BusinessType, ViewMode } from '../types'
import './Sidebar.css'

interface SidebarProps {
  businessTypes: BusinessType[]
  selectedBusiness: BusinessType | null
  onBusinessSelect: (business: BusinessType) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onShowAbout: () => void
}

function Sidebar({ businessTypes, selectedBusiness, onBusinessSelect, viewMode, onViewModeChange, onShowAbout }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* 프로젝트 소개 */}
      <div className="sidebar-section project-intro">
        <button className="project-btn" onClick={onShowAbout}>
          <span className="project-icon">📋</span>
          <div className="project-info">
            <span className="project-title">프로젝트 소개</span>
            <span className="project-desc">목적·기능·협력기관·기대효과</span>
          </div>
          <span className="arrow">→</span>
        </button>
      </div>

      {/* 빠른 분석 메뉴 */}
      <div className="sidebar-section">
        <h2 className="sidebar-title">
          <span>⚡</span>
          분석 대시보드
        </h2>
        <div className="quick-menu">
          <button 
            className={`quick-item ${viewMode === 'community' ? 'active community' : ''}`}
            onClick={() => onViewModeChange('community')}
          >
            <span className="quick-icon">🏘️</span>
            <div className="quick-info">
              <span className="quick-name">지역사회 발전</span>
              <span className="quick-desc">경제효과·일자리·정책우선순위</span>
            </div>
          </button>
          <button 
            className={`quick-item ${viewMode === 'vacancy' ? 'active' : ''}`}
            onClick={() => onViewModeChange('vacancy')}
          >
            <span className="quick-icon">📊</span>
            <div className="quick-info">
              <span className="quick-name">공실률 분석</span>
              <span className="quick-desc">현황·적정면적·예측</span>
            </div>
          </button>
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="sidebar-title">
          <span>🎯</span>
          업종별 입지 추천
        </h2>
        <p className="sidebar-description">
          희망 업종을 선택하면 AI가 최적 입지를 추천합니다
        </p>
        <div className="business-list">
          {businessTypes.map(business => (
            <button
              key={business.id}
              className={`business-item ${selectedBusiness?.id === business.id ? 'selected' : ''}`}
              onClick={() => onBusinessSelect(business)}
            >
              <span className="business-icon">{business.icon}</span>
              <span className="business-name">{business.name}</span>
              {selectedBusiness?.id === business.id && (
                <span className="check-icon">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h2 className="sidebar-title">
          <span>📈</span>
          분석 지표 (6종)
        </h2>
        <div className="metrics-list">
          <div className="metric-item">
            <div className="metric-icon" style={{ background: '#10b981' }}>👥</div>
            <div className="metric-info">
              <span className="metric-name">수요</span>
              <span className="metric-desc">거주인구·카드매출</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon" style={{ background: '#f59e0b' }}>🏪</div>
            <div className="metric-info">
              <span className="metric-name">경쟁</span>
              <span className="metric-desc">동종업종 밀집도</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon" style={{ background: '#3b82f6' }}>🚌</div>
            <div className="metric-info">
              <span className="metric-name">접근성</span>
              <span className="metric-desc">BRT·공공자전거</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon" style={{ background: '#8b5cf6' }}>🛡️</div>
            <div className="metric-info">
              <span className="metric-name">안전</span>
              <span className="metric-desc">야간환경·CCTV</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon" style={{ background: '#ef4444' }}>🏢</div>
            <div className="metric-info">
              <span className="metric-name">공실률</span>
              <span className="metric-desc">상가유형별 현황</span>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon" style={{ background: '#06b6d4' }}>🌈</div>
            <div className="metric-info">
              <span className="metric-name">상권활성화</span>
              <span className="metric-desc">다양성·활력지수</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="data-sources">
          <h4>📂 활용 데이터</h4>
          <ul>
            <li>세종시 인구현황 (2022-2025)</li>
            <li>행정동별 카드소비 현황</li>
            <li>BRT 노선별 정류장 현황</li>
            <li>공공자전거 대여소 현황</li>
          </ul>
        </div>
        <div className="footer-badges">
          <span className="footer-badge">🏫 국립한밭대</span>
          <span className="footer-badge">🎯 세종RISE</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
