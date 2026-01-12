import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { DistrictData, RecommendationResult, ViewMode } from '../types'
import { getScoreGrade } from '../utils/recommendation'
import { getVacancyRiskLevel } from '../data/vacancyData'
import { getListingsCountByDistrict } from '../data/vacancyListings'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

interface MapViewProps {
  districts: DistrictData[]
  recommendations: RecommendationResult[]
  selectedDistrict: string | null
  onDistrictClick: (name: string) => void
  onShowVacancyListings: (districtName: string) => void
  viewMode: ViewMode
}

function MapView({ districts, recommendations, selectedDistrict, onDistrictClick, onShowVacancyListings }: MapViewProps) {
  const [mapReady, setMapReady] = useState(false)
  const [showVacancyLayer, setShowVacancyLayer] = useState(false)

  const getMarkerColor = (district: DistrictData): string => {
    // 공실률 레이어가 켜져있으면 공실률 기반 색상
    if (showVacancyLayer) {
      return getVacancyRiskLevel(district.vacancyRate).color
    }
    
    // 추천 결과가 있으면 추천 점수 기반 색상
    if (recommendations.length > 0) {
      const rec = recommendations.find(r => r.district.name === district.name)
      if (rec) {
        const { color } = getScoreGrade(rec.score)
        return color
      }
    }
    
    return '#64748b'
  }

  const getMarkerSize = (districtName: string): number => {
    const district = districts.find(d => d.name === districtName)
    if (!district) return 15
    
    // 인구에 따른 크기 조정
    const baseSize = 12
    const sizeMultiplier = Math.min(district.population / 10000, 3)
    return baseSize + sizeMultiplier * 5
  }

  return (
    <div className="map-container">
      {/* 레이어 토글 */}
      <div className="map-controls">
        <button 
          className={`layer-toggle ${showVacancyLayer ? 'active' : ''}`}
          onClick={() => setShowVacancyLayer(!showVacancyLayer)}
        >
          <span>🏢</span>
          <span>공실률 레이어</span>
        </button>
      </div>

      <MapContainer
        center={[36.5040, 127.2640]}
        zoom={12}
        className="leaflet-map"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {mapReady && districts.map(district => {
          const rec = recommendations.find(r => r.district.name === district.name)
          const isSelected = selectedDistrict === district.name
          const vacancyRisk = getVacancyRiskLevel(district.vacancyRate)
          
          return (
            <CircleMarker
              key={district.name}
              center={district.coordinates}
              radius={getMarkerSize(district.name)}
              pathOptions={{
                color: isSelected ? '#fff' : getMarkerColor(district),
                fillColor: getMarkerColor(district),
                fillOpacity: isSelected ? 0.9 : 0.7,
                weight: isSelected ? 3 : 2
              }}
              eventHandlers={{
                click: () => onDistrictClick(district.name)
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{district.name}</h3>
                  <span className="living-area-badge">{district.livingArea}</span>
                  <div className="popup-stats">
                    <div className="popup-stat">
                      <span className="label">인구</span>
                      <span className="value">{district.population.toLocaleString()}명</span>
                    </div>
                    <div className="popup-stat">
                      <span className="label">카드매출</span>
                      <span className="value">{(district.cardSales / 1000000000).toFixed(1)}십억</span>
                    </div>
                    <div className="popup-stat">
                      <span className="label">공실률</span>
                      <span className="value" style={{ color: vacancyRisk.color }}>
                        {district.vacancyRate}% ({vacancyRisk.level})
                      </span>
                    </div>
                    <div className="popup-stat">
                      <span className="label">상권활성화</span>
                      <span className="value">{district.marketActivationIndex}점</span>
                    </div>
                    {rec && (
                      <div className="popup-stat highlight">
                        <span className="label">입지 점수</span>
                        <span className="value score" style={{ color: getScoreGrade(rec.score).color }}>
                          {rec.score}점 ({getScoreGrade(rec.score).grade}등급)
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 공실 매물 보기 버튼 */}
                  <button 
                    className="vacancy-listings-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onShowVacancyListings(district.name)
                    }}
                  >
                    <span>🏢</span>
                    <span>공실 매물 보기</span>
                    <span className="listing-count-badge">
                      {getListingsCountByDistrict(district.name)}개
                    </span>
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {/* 범례 */}
      {showVacancyLayer ? (
        <div className="map-legend vacancy">
          <h4>🏢 공실률 위험도</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#10b981' }}></span>
              <span>양호 (10% 미만)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f59e0b' }}></span>
              <span>주의 (10-20%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f97316' }}></span>
              <span>경고 (20-30%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#ef4444' }}></span>
              <span>위험 (30% 이상)</span>
            </div>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="map-legend">
          <h4>입지 적합도</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#10b981' }}></span>
              <span>S등급 (80+)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#3b82f6' }}></span>
              <span>A등급 (70-79)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f59e0b' }}></span>
              <span>B등급 (60-69)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f97316' }}></span>
              <span>C등급 (50-59)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#ef4444' }}></span>
              <span>D등급 (50 미만)</span>
            </div>
          </div>
        </div>
      ) : null}

      {recommendations.length === 0 && !showVacancyLayer && (
        <div className="map-guide">
          <div className="guide-content">
            <span className="guide-icon">👈</span>
            <p>왼쪽에서 <strong>업종을 선택</strong>하면<br/>입지 분석 결과를 확인할 수 있습니다</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
