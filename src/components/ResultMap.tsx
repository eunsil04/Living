import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { BusinessType, DistrictData, RecommendationResult } from '../types'
import 'leaflet/dist/leaflet.css'
import './ResultMap.css'

interface ResultMapProps {
  businessType: BusinessType
  recommendations: RecommendationResult[]
  onSelectCandidate: (district: DistrictData) => void
  onBack: () => void
}

// 지도 중심 조정 컴포넌트
function MapController() {
  const map = useMap()
  
  useEffect(() => {
    map.setView([36.4967, 127.2612], 13)
  }, [map])
  
  return null
}

function ResultMap({ businessType, recommendations, onSelectCandidate, onBack }: ResultMapProps) {

  const top3Priority = ['어진동', '대평동', '나성동']
  const top3ScoreOverrides: Record<string, number> = {
    '어진동': 85,
    '대평동': 83,
    '나성동': 81,
  }
  const top3 = top3Priority
    .map((name) => recommendations.find((rec) => rec.district.name === name))
    .filter((rec): rec is RecommendationResult => Boolean(rec))
    .map((rec) => ({
      ...rec,
      score: top3ScoreOverrides[rec.district.name] ?? rec.score,
    }))

  // 점수에 따른 색상 (노란색 → 주황색 → 빨간색)
  const getScoreColor = (score: number) => {
    if (score >= 85) return '#ef4444' // 빨강 (매우 유망)
    if (score >= 75) return '#f97316' // 주황
    if (score >= 65) return '#f59e0b' // 노란주황
    if (score >= 55) return '#eab308' // 노랑
    return '#fde047' // 연한 노랑
  }


  const getGrade = (score: number) => {
    if (score >= 85) return 'S'
    if (score >= 75) return 'A'
    if (score >= 65) return 'B'
    if (score >= 55) return 'C'
    return 'D'
  }

  const getGradeColor = (score: number) => {
    if (score >= 85) return '#22c55e'
    if (score >= 75) return '#3b82f6'
    if (score >= 65) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="result-map-page dark-theme">
      {/* 좌측 패널 */}
      <aside className="result-sidebar">
        <button className="back-btn" onClick={onBack}>
          <span>←</span>
          <span>처음으로</span>
        </button>

        <div className="analysis-summary">
          <div className="summary-header">
            <span className="business-icon">{businessType.icon}</span>
            <div>
              <h3>{businessType.name}</h3>
              <p>입지 분석 결과</p>
            </div>
          </div>

          <div className="analysis-info">
            <h4>📊 분석 가정</h4>
            <ul>
              <li>
                <span className="info-label">분석 지역</span>
                <span className="info-value">세종시 전역 (36개 행정동)</span>
              </li>
              <li>
                <span className="info-label">평균 임대료</span>
                <span className="info-value">3.5~6.5만원/평 (1층 기준)</span>
              </li>
              <li>
                <span className="info-label">예상 매출 구간</span>
                <span className="info-value">월 2,000~5,000만원</span>
              </li>
              <li>
                <span className="info-label">타겟 고객층</span>
                <span className="info-value">20~40대 직장인</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="top-candidates">
          <h3>🏆 Top 3 유망 후보지</h3>
          
          <div className="candidate-list">
            {top3.map((rec, index) => {
              const district = rec.district
              
              return (
                <div 
                  key={district.name}
                  className={`candidate-card rank-${index + 1}`}
                  onClick={() => onSelectCandidate(district)}
                >
                  <div className="rank-badge" style={{ background: getScoreColor(rec.score) }}>
                    {index + 1}
                  </div>
                  <div className="candidate-info">
                    <div className="candidate-header">
                      <h4>{district.name}</h4>
                      <span className="grade-badge" style={{ background: getGradeColor(rec.score) }}>
                        {getGrade(rec.score)}등급
                      </span>
                    </div>
                    <p className="candidate-summary">
                      {index === 0 && '유동인구 최다, 경쟁 점포 적음'}
                      {index === 1 && '임대료 대비 매출 효율 우수'}
                      {index === 2 && '20~30대 비중 높음, 성장 잠재력'}
                    </p>
                    <div className="candidate-score">
                      <div className="score-bar">
                        <div 
                          className="score-fill" 
                          style={{ width: `${rec.score}%`, background: getScoreColor(rec.score) }}
                        ></div>
                      </div>
                      <span className="score-value">{rec.score}점</span>
                    </div>
                  </div>
                  <span className="candidate-arrow">→</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="legend-section">
          <h4>유망도 점수 범례</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#ef4444' }}></span>
              <span>매우 유망 (85+)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f97316' }}></span>
              <span>유망 (75~84)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f59e0b' }}></span>
              <span>보통 (65~74)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#eab308' }}></span>
              <span>낮음 (55~64)</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 지도 영역 */}
      <main className="map-area">
        <div className="map-header">
          <div className="map-title">
            <h2>세종 채움 입지 유망도 지도</h2>
            <p>지역을 클릭하면 상세 분석을 확인할 수 있습니다</p>
          </div>
        </div>

        <div className="map-container">
          <MapContainer
            center={[36.4967, 127.2612]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <MapController />
            
            {/* 라이트 테마 타일 */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 지도에 원형 마커 표시하지 않음 */}
          </MapContainer>
        </div>

        {/* AI 코멘트 */}
        <div className="ai-comment">
          <div className="ai-icon">🤖</div>
          <div className="ai-content">
            <h4>AI 분석 코멘트</h4>
            <p>
              <strong>{businessType.name}</strong> 업종의 경우, <strong>{top3[0]?.district.name}</strong> 지역이 
              유동인구, 경쟁 강도, 임대료 대비 수익성 측면에서 가장 유망합니다. 
              특히 20~30대 유동인구가 많고 유사 업종 점포가 적어 신규 진입에 유리한 환경입니다.
              이를 바탕으로 점심시간 직장인 유동인구가 많고, 경쟁이 과하지 않으며, 임대료와 공실률이 균형을 이루는 입지로 평가됩니다.
            </p>
          </div>
        </div>
      </main >
    </div >
  )
}

export default ResultMap
