import { ViewMode } from '../types'
import './Header.css'

interface HeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

function Header({ viewMode, onViewModeChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <span className="logo-icon">🏙️</span>
          <div className="logo-text">
            <h1>세종시 상권 분석 플랫폼</h1>
            <p>공실·상권 데이터 통합 지도 및 AI 기반 업종 입지 추천</p>
          </div>
        </div>
      </div>
      <nav className="header-nav">
        <div 
          className={`nav-item ${viewMode === 'recommendation' ? 'active' : ''}`}
          onClick={() => onViewModeChange('recommendation')}
        >
          <span>💡</span>
          <span>입지 추천</span>
        </div>
        <div 
          className={`nav-item ${viewMode === 'vacancy' ? 'active' : ''}`}
          onClick={() => onViewModeChange('vacancy')}
        >
          <span>📊</span>
          <span>공실률 분석</span>
        </div>
        <div 
          className={`nav-item ${viewMode === 'community' ? 'active' : ''}`}
          onClick={() => onViewModeChange('community')}
        >
          <span>🏘️</span>
          <span>지역사회 발전</span>
        </div>
        <div 
          className={`nav-item ${viewMode === 'analysis' ? 'active' : ''}`}
          onClick={() => onViewModeChange('analysis')}
        >
          <span>🗺️</span>
          <span>지도 분석</span>
        </div>
      </nav>
      <div className="header-info">
        <span className="badge team">502호 방보러 와유</span>
        <span className="badge category">도시환경·교통·안전</span>
        <span className="badge accent">세종RISE 리빙랩 2025</span>
      </div>
    </header>
  )
}

export default Header
