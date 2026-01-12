import { useState } from 'react'
import { BusinessType, RecommendationResult } from '../types'
import { getScoreGrade } from '../utils/recommendation'
import './RecommendationPanel.css'

interface RecommendationPanelProps {
  businessType: BusinessType
  recommendations: RecommendationResult[]
  selectedDistrict: string | null
  onDistrictSelect: (name: string) => void
  onClose: () => void
}

function RecommendationPanel({ 
  businessType, 
  recommendations, 
  selectedDistrict,
  onDistrictSelect,
  onClose 
}: RecommendationPanelProps) {
  const [recommendMode, setRecommendMode] = useState<'optimal' | 'balanced'>('optimal')
  
  const selectedRec = selectedDistrict 
    ? recommendations.find(r => r.district.name === selectedDistrict)
    : null

  // 균형 발전 모드: 공실률 높고, 상권활성화 낮은 지역 우선
  const balancedRecommendations = [...recommendations]
    .map(rec => {
      // 균형 발전 보너스 점수 계산
      const vacancyBonus = rec.district.vacancyRate > 20 ? 15 : rec.district.vacancyRate > 15 ? 10 : 0
      const activationBonus = rec.district.marketActivationIndex < 50 ? 15 : rec.district.marketActivationIndex < 65 ? 10 : 0
      const ruralBonus = rec.district.livingArea.includes('읍면') || rec.district.livingArea === '구도심' ? 10 : 0
      
      return {
        ...rec,
        balancedScore: rec.score + vacancyBonus + activationBonus + ruralBonus,
        isUnderserved: vacancyBonus > 0 || activationBonus > 0 || ruralBonus > 0
      }
    })
    .sort((a, b) => b.balancedScore - a.balancedScore)

  const displayRecommendations = recommendMode === 'balanced' 
    ? balancedRecommendations 
    : recommendations

  // 네이버 부동산 검색 URL 생성
  const getNaverRealEstateUrl = (districtName: string) => {
    const query = encodeURIComponent(`세종시 ${districtName} 상가 임대`)
    return `https://land.naver.com/search/result.naver?query=${query}`
  }

  // 직방 검색 URL
  const getZigbangUrl = (districtName: string) => {
    const query = encodeURIComponent(`세종시 ${districtName} 상가`)
    return `https://www.zigbang.com/home/search?keyword=${query}`
  }

  // 다방 검색 URL
  const getDabangUrl = (districtName: string) => {
    const query = encodeURIComponent(`세종 ${districtName}`)
    return `https://www.dabangapp.com/search?keyword=${query}`
  }

  return (
    <div className="recommendation-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="business-badge">{businessType.icon} {businessType.name}</span>
          <h2>입지 추천 결과</h2>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* 추천 모드 선택 */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${recommendMode === 'optimal' ? 'active' : ''}`}
          onClick={() => setRecommendMode('optimal')}
        >
          <span>🎯</span>
          <span>최적 입지</span>
        </button>
        <button 
          className={`mode-btn balanced ${recommendMode === 'balanced' ? 'active' : ''}`}
          onClick={() => setRecommendMode('balanced')}
        >
          <span>⚖️</span>
          <span>균형 발전</span>
        </button>
      </div>

      {recommendMode === 'balanced' && (
        <div className="balanced-info">
          <span className="info-icon">💡</span>
          <p>공실률이 높거나 상권이 침체된 지역에 <strong>가산점</strong>을 부여하여 <strong>균형 발전</strong>을 유도합니다</p>
        </div>
      )}

      <div className="panel-content">
        {/* 상위 추천 지역 */}
        <div className="top-recommendations">
          <h3>{recommendMode === 'balanced' ? '⚖️ 균형 발전 추천 TOP 5' : '🏆 추천 지역 TOP 5'}</h3>
          <div className="recommendation-list">
            {displayRecommendations.slice(0, 5).map((rec, index) => {
              const { grade, color } = getScoreGrade(recommendMode === 'balanced' ? (rec as any).balancedScore : rec.score)
              const isSelected = selectedDistrict === rec.district.name
              const isUnderserved = recommendMode === 'balanced' && (rec as any).isUnderserved
              
              return (
                <div 
                  key={rec.district.name}
                  className={`recommendation-item ${isSelected ? 'selected' : ''} ${isUnderserved ? 'underserved' : ''}`}
                  onClick={() => onDistrictSelect(rec.district.name)}
                >
                  <div className="rank-badge" style={{ 
                    background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'var(--bg-hover)'
                  }}>
                    {index + 1}
                  </div>
                  <div className="rec-info">
                    <div className="district-header">
                      <span className="district-name">{rec.district.name}</span>
                      {isUnderserved && <span className="underserved-badge">균형발전</span>}
                    </div>
                    <span className="district-population">
                      {rec.district.livingArea} · 인구 {rec.district.population.toLocaleString()}명
                    </span>
                  </div>
                  <div className="score-badge" style={{ background: color }}>
                    <span className="score">
                      {recommendMode === 'balanced' ? (rec as any).balancedScore.toFixed(0) : rec.score}
                    </span>
                    <span className="grade">{grade}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 선택된 지역 상세 분석 */}
        {selectedRec && (
          <div className="detail-analysis">
            <h3>📊 {selectedRec.district.name} 상세 분석</h3>
            
            <div className="score-overview">
              <div className="total-score" style={{ borderColor: getScoreGrade(selectedRec.score).color }}>
                <span className="score-value">{selectedRec.score}</span>
                <span className="score-label">종합 점수</span>
              </div>
              <div className="score-details">
                <div className="detail-row">
                  <span className="label">순위</span>
                  <span className="value">{selectedRec.rank}위 / {recommendations.length}개 지역</span>
                </div>
                <div className="detail-row">
                  <span className="label">등급</span>
                  <span className="value" style={{ color: getScoreGrade(selectedRec.score).color }}>
                    {getScoreGrade(selectedRec.score).grade}등급
                  </span>
                </div>
              </div>
            </div>

            {/* 🆕 부동산 매물 연결 */}
            <div className="real-estate-links">
              <h4>🏠 상가 매물 찾기</h4>
              <p className="link-desc">아래 버튼을 클릭하면 해당 지역의 실제 상가 매물을 확인할 수 있습니다</p>
              <div className="link-buttons">
                <a 
                  href={getNaverRealEstateUrl(selectedRec.district.name)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="estate-link naver"
                >
                  <span className="link-icon">🏢</span>
                  <span>네이버 부동산</span>
                </a>
                <a 
                  href={getZigbangUrl(selectedRec.district.name)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="estate-link zigbang"
                >
                  <span className="link-icon">🏪</span>
                  <span>직방</span>
                </a>
                <a 
                  href={getDabangUrl(selectedRec.district.name)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="estate-link dabang"
                >
                  <span className="link-icon">🏬</span>
                  <span>다방</span>
                </a>
              </div>
              <p className="link-tip">💡 Tip: 검색 결과에서 '상가', '점포', '사무실' 필터를 적용하세요</p>
            </div>

            <div className="analysis-reasons">
              <h4>추천 근거</h4>
              {selectedRec.reasons.slice(0, 4).map((reason, index) => (
                <div key={index} className="reason-card">
                  <div className="reason-header">
                    <span className="reason-category">{reason.category}</span>
                    <div className="reason-score">
                      <span className="contribution">+{reason.contribution.toFixed(1)}점</span>
                    </div>
                  </div>
                  <p className="reason-description">{reason.description}</p>
                  <div className="reason-bar">
                    <div 
                      className="reason-fill" 
                      style={{ width: `${reason.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="district-stats">
              <h4>지역 현황</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-icon">👥</span>
                  <span className="stat-value">{selectedRec.district.population.toLocaleString()}</span>
                  <span className="stat-label">거주인구</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">💳</span>
                  <span className="stat-value">{(selectedRec.district.cardSales / 1000000000).toFixed(1)}십억</span>
                  <span className="stat-label">월 카드매출</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🏢</span>
                  <span className="stat-value">{selectedRec.district.vacancyRate}%</span>
                  <span className="stat-label">공실률</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🌈</span>
                  <span className="stat-value">{selectedRec.district.marketActivationIndex}</span>
                  <span className="stat-label">상권활성화</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedRec && (
          <div className="select-prompt">
            <span className="prompt-icon">👆</span>
            <p>지도 또는 목록에서 지역을 선택하면<br/>상세 분석 결과를 확인할 수 있습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecommendationPanel
