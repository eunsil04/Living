import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { BusinessType, DistrictData, RecommendationResult } from '../types'
import 'leaflet/dist/leaflet.css'
import './ResultMap.css'

interface ResultMapProps {
  businessType: BusinessType
  recommendations: RecommendationResult[]
  onSelectCandidate: (district: DistrictData) => void
  onBack: () => void
}

// 세종시 지역별 좌표 데이터
const districtCoordinates: Record<string, [number, number]> = {
  '도담동': [36.4801, 127.2589],
  '어진동': [36.4921, 127.2612],
  '나성동': [36.5012, 127.2534],
  '새롬동': [36.5089, 127.2601],
  '다정동': [36.5156, 127.2523],
  '소담동': [36.4734, 127.2456],
  '종촌동': [36.4667, 127.2678],
  '아름동': [36.5223, 127.2489],
  '반곡동': [36.4589, 127.2823],
  '보람동': [36.5289, 127.2556],
  '대평동': [36.5367, 127.2634],
  '고운동': [36.5434, 127.2512],
  '가람동': [36.4856, 127.2734],
  '한솔동': [36.4978, 127.2456],
  '산울동': [36.5101, 127.2378],
  '해밀동': [36.5523, 127.2467],
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
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  const top3 = recommendations.slice(0, 3)

  // 점수에 따른 색상 (노란색 → 주황색 → 빨간색)
  const getScoreColor = (score: number) => {
    if (score >= 85) return '#ef4444' // 빨강 (매우 유망)
    if (score >= 75) return '#f97316' // 주황
    if (score >= 65) return '#f59e0b' // 노란주황
    if (score >= 55) return '#eab308' // 노랑
    return '#fde047' // 연한 노랑
  }

  // 점수에 따른 원 크기
  const getCircleRadius = (score: number) => {
    if (score >= 80) return 20
    if (score >= 70) return 17
    if (score >= 60) return 14
    return 11
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
                  className={`candidate-card rank-${index + 1} ${selectedDistrict === district.name ? 'active' : ''}`}
                  onClick={() => onSelectCandidate(district)}
                  onMouseEnter={() => setSelectedDistrict(district.name)}
                  onMouseLeave={() => setSelectedDistrict(null)}
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

            {/* 지역별 원형 마커 - 모든 지역 표시 */}
            {Object.entries(districtCoordinates).map(([districtName, coords]) => {
              // 해당 지역이 recommendations에 있는지 확인
              const rec = recommendations.find(r => r.district.name === districtName)
              
              // recommendations에 있으면 점수에 따른 색상, 없으면 노란색
              const fillColor = rec ? getScoreColor(rec.score) : '#fde047'
              const radius = rec ? getCircleRadius(rec.score) : 12

              return (
                <CircleMarker
                  key={districtName}
                  center={coords}
                  radius={radius}
                  fillColor={fillColor}
                  fillOpacity={0.85}
                  color={selectedDistrict === districtName ? '#ffffff' : 'rgba(255,255,255,0.3)'}
                  weight={selectedDistrict === districtName ? 3 : 1}
                  eventHandlers={{
                    mouseover: () => setSelectedDistrict(districtName),
                    mouseout: () => setSelectedDistrict(null),
                  }}
                >
                  {rec && (
                    <Popup className="custom-popup">
                      <div className="popup-content">
                        <div className="popup-header">
                          <h3>{rec.district.name}</h3>
                          <button className="popup-close">×</button>
                        </div>
                        <span className="popup-badge">{rec.district.livingArea}</span>
                        
                        <div className="popup-stats">
                          <div className="popup-stat">
                            <span className="stat-label">인구</span>
                            <span className="stat-value">{rec.district.population.toLocaleString()}명</span>
                          </div>
                          <div className="popup-stat">
                            <span className="stat-label">공실률</span>
                            <span className={`stat-value ${rec.district.vacancyRate > 10 ? 'warning' : ''}`}>
                              {rec.district.vacancyRate}%{rec.district.vacancyRate > 10 ? ' (주의)' : ''}
                            </span>
                          </div>
                          <div className="popup-stat">
                            <span className="stat-label">상권활성화</span>
                            <span className="stat-value">{rec.district.marketActivationIndex}점</span>
                          </div>
                        </div>

                        <div className="popup-score">
                          <span className="score-label">입지 점수</span>
                          <span className="score-value" style={{ color: getGradeColor(rec.score) }}>
                            {rec.score}점 ({getGrade(rec.score)}등급)
                          </span>
                        </div>

                        <button 
                          className="popup-btn"
                          onClick={() => onSelectCandidate(rec.district)}
                        >
                          <span>🏢</span>
                          <span>상세 분석 보기</span>
                        </button>
                      </div>
                    </Popup>
                  )}
                  {!rec && (
                    <Popup className="custom-popup">
                      <div className="popup-content">
                        <div className="popup-header">
                          <h3>{districtName}</h3>
                          <button className="popup-close">×</button>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                          이 지역은 분석 대상에 포함되지 않았습니다.
                        </p>
                      </div>
                    </Popup>
                  )}
                </CircleMarker>
              )
            })}
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
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResultMap
