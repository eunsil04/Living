import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { DistrictData, BusinessType, RecommendationResult } from '../types'
import { realDistrictData, defaultDistrictInfo, getCompetitorInfo } from '../data/realDistrictData'
import { generateAnalysisComment, checkOllamaConnection } from '../services/ollamaService'
import 'leaflet/dist/leaflet.css'
import './DetailAnalysis.css'

interface DetailAnalysisProps {
  district: DistrictData
  businessType: BusinessType
  recommendation: RecommendationResult
  recommendations: RecommendationResult[]
  onBack: () => void
  onGoToPolicy: () => void
}

type TabType = 'traffic' | 'competition' | 'rent' | 'customer' | 'regulations' | 'safety'

function DetailAnalysis({ district, businessType, recommendation, recommendations, onBack, onGoToPolicy }: DetailAnalysisProps) {
  const [activeTab, setActiveTab] = useState<TabType>('traffic')
  const [aiComment, setAiComment] = useState<string>('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isOllamaConnected, setIsOllamaConnected] = useState(false)
  
  // 실제 지역 데이터 가져오기
  const realData = realDistrictData[district.name] || defaultDistrictInfo
  const competitorInfo = getCompetitorInfo(district.name, businessType.name)

  // 실제 데이터 기반 값
  const age2030Ratio = realData.demographics.age2030Ratio
  const competitorCount = competitorInfo.count
  const avgRent = realData.rent.avg1F

  // 점수 분석 로직 (ResultMap과 동일)
  const getRentAvg = (districtName: string) => {
    const info = realDistrictData[districtName] || defaultDistrictInfo
    return info.rent.avg1F
  }

  const average = (values: number[]) =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

  const averages = {
    population: average(recommendations.map((rec) => rec.district.population)),
    competitionIndex: average(recommendations.map((rec) => rec.district.competitionIndex)),
    vacancyRate: average(recommendations.map((rec) => rec.district.vacancyRate)),
    marketActivationIndex: average(recommendations.map((rec) => rec.district.marketActivationIndex)),
    rent: average(recommendations.map((rec) => getRentAvg(rec.district.name))),
  }

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

  const calcContribution = (value: number, avg: number, scale: number, invert = false) => {
    if (!avg) return 0
    const diff = invert ? avg - value : value - avg
    return clamp(Math.round((diff / avg) * scale), -20, 20)
  }

  const getScoreBreakdown = (rec: RecommendationResult) => {
    const rentAvg = getRentAvg(rec.district.name)
    return {
      population: calcContribution(rec.district.population, averages.population, 18),
      competition: calcContribution(rec.district.competitionIndex, averages.competitionIndex, 14, true),
      rent: calcContribution(rentAvg, averages.rent, 12, true),
      vacancy: calcContribution(rec.district.vacancyRate, averages.vacancyRate, 10, true),
      locationGrade: calcContribution(rec.district.marketActivationIndex, averages.marketActivationIndex, 15),
    }
  }

  const scoreBreakdown = getScoreBreakdown(recommendation)

  const formatContribution = (value: number) => `${value >= 0 ? '+' : ''}${value}점`

  // 기본 AI 코멘트 (Ollama 연결 안될 때 사용)
  const defaultComment = `${district.name}은(는) ${realData.commercialArea.type}으로, ${age2030Ratio > 40 ? '20~30대 젊은 층 비중이 높고' : '40~50대 안정적 소비층이 많고'}, 
  반경 500m 내 ${businessType.name} 업종이 ${competitorCount}개로 ${competitorCount < 20 ? '경쟁 강도가 낮아 신규 진입에 유리합니다' : '수요가 검증된 지역입니다'}. 
  1층 평균 임대료 ${avgRent}만원/평으로 ${avgRent < 4 ? '매우 저렴한 수준이며' : avgRent < 5.5 ? '합리적인 수준이며' : '다소 높은 편이지만'}, 
  ${businessType.name} 창업에 ${recommendation.score >= 75 ? '매우 적합한' : recommendation.score >= 60 ? '적합한' : '검토가 필요한'} 환경입니다.`

  // Ollama 연결 확인 및 AI 분석 생성
  useEffect(() => {
    const fetchAiComment = async () => {
      setIsAiLoading(true)
      
      // Ollama 연결 확인
      const connected = await checkOllamaConnection()
      setIsOllamaConnected(connected)
      
      if (connected) {
        try {
          const comment = await generateAnalysisComment({
            districtName: district.name,
            businessType: businessType.name,
            population: realData.floatingPopulation.daily,
            cardSales: district.cardSales,
            vacancyRate: district.vacancyRate,
            avgRent: avgRent,
            age2030Ratio: age2030Ratio,
            competitorCount: competitorCount,
            score: recommendation.score
          })
          setAiComment(comment)
        } catch {
          // Ollama 오류 시 기본 코멘트 사용
          setAiComment(defaultComment)
        }
      } else {
        // Ollama 미연결 시 기본 코멘트 사용
        setAiComment(defaultComment)
      }
      
      setIsAiLoading(false)
    }

    fetchAiComment()
  }, [district, businessType, realData, avgRent, age2030Ratio, competitorCount, recommendation.score, defaultComment])

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#3b82f6'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const getGrade = (score: number) => {
    if (score >= 85) return 'S'
    if (score >= 75) return 'A'
    if (score >= 65) return 'B'
    if (score >= 55) return 'C'
    return 'D'
  }

  const tabs = [
    { id: 'traffic' as TabType, label: '유동인구', icon: '👥' },
    { id: 'competition' as TabType, label: '경쟁 점포', icon: '🏪' },
    { id: 'rent' as TabType, label: '임대료 수준', icon: '💰' },
    { id: 'customer' as TabType, label: '고객 특성', icon: '🎯' },
    { id: 'regulations' as TabType, label: '입주 가능 업종', icon: '📋' },
    { id: 'safety' as TabType, label: '소방/인테리어', icon: '🚨' },
  ]

  return (
    <div className="detail-analysis-page">
      {/* 상단 헤더 */}
      <header className="detail-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <span>←</span>
            <span>결과 목록으로</span>
          </button>
        </div>
        
        <div className="header-center">
          <div className="district-info">
            <h1>{district.name}</h1>
            <span className="living-area">{district.livingArea}</span>
          </div>
          <div className="score-display" style={{ borderColor: getScoreColor(recommendation.score) }}>
            <span className="score-value">{recommendation.score}</span>
            <span className="score-grade" style={{ color: getScoreColor(recommendation.score) }}>
              {getGrade(recommendation.score)}등급
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <button className="policy-btn" onClick={onGoToPolicy}>
            <span className="btn-icon">🎯</span>
            <span>맞춤 정책 보기</span>
          </button>
        </div>
      </header>

      <div className="detail-content">
        {/* 좌측: 탭 기반 상세 분석 */}
        <main className="analysis-main">
          <div className="tab-navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'traffic' && (
              <div className="content-panel traffic-panel">
                <h3>📊 유동인구 분석</h3>
                <p className="data-source">📍 {realData.commercialArea.type} | {realData.commercialArea.mainStreet}</p>
                
                <div className="stat-cards">
                  <div className="stat-card">
                    <span className="stat-icon">👥</span>
                    <div className="stat-info">
                      <span className="stat-value">{realData.floatingPopulation.daily.toLocaleString()}명</span>
                      <span className="stat-label">일 평균 유동인구</span>
                    </div>
                  </div>
                  <div className="stat-card highlight">
                    <span className="stat-icon">⏰</span>
                    <div className="stat-info">
                      <span className="stat-value">{realData.floatingPopulation.weekdayPeak}</span>
                      <span className="stat-label">평일 피크 시간</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">📅</span>
                    <div className="stat-info">
                      <span className="stat-value">{realData.floatingPopulation.weekendPeak}</span>
                      <span className="stat-label">주말 피크 시간</span>
                    </div>
                  </div>
                </div>

                <div className="chart-section">
                  <h4>시간대별 유동인구 분포</h4>
                  <div className="time-chart">
                    {[
                      { label: '오전 (6-12시)', value: realData.floatingPopulation.byTimeOfDay.morning },
                      { label: '오후 (12-18시)', value: realData.floatingPopulation.byTimeOfDay.afternoon },
                      { label: '저녁 (18-22시)', value: realData.floatingPopulation.byTimeOfDay.evening },
                      { label: '야간 (22-6시)', value: realData.floatingPopulation.byTimeOfDay.night },
                    ].map((item) => (
                      <div key={item.label} className="time-bar-wrapper">
                        <div 
                          className="time-bar" 
                          style={{ height: `${item.value * 2.5}%` }}
                        >
                          <span className="bar-value">{item.value}%</span>
                        </div>
                        <span className="time-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-section">
                  <h4>평일 vs 주말 유동인구</h4>
                  <div className="weekday-weekend-comparison">
                    <div className="comparison-item">
                      <span className="comp-label">평일 평균</span>
                      <div className="comp-bar-bg">
                        <div 
                          className="comp-bar-fill weekday" 
                          style={{ width: `${(realData.floatingPopulation.byDayOfWeek.weekday / realData.floatingPopulation.daily) * 50}%` }}
                        ></div>
                      </div>
                      <span className="comp-value">{realData.floatingPopulation.byDayOfWeek.weekday.toLocaleString()}명</span>
                    </div>
                    <div className="comparison-item">
                      <span className="comp-label">주말 평균</span>
                      <div className="comp-bar-bg">
                        <div 
                          className="comp-bar-fill weekend" 
                          style={{ width: `${(realData.floatingPopulation.byDayOfWeek.weekend / realData.floatingPopulation.daily) * 50}%` }}
                        ></div>
                      </div>
                      <span className="comp-value">{realData.floatingPopulation.byDayOfWeek.weekend.toLocaleString()}명</span>
                    </div>
                  </div>
                </div>

                <div className="insight-box">
                  <span className="insight-icon">💡</span>
                  <p>{realData.floatingPopulation.byTimeOfDay.evening > realData.floatingPopulation.byTimeOfDay.afternoon 
                    ? `이 지역은 저녁 시간대(${realData.floatingPopulation.byTimeOfDay.evening}%) 유동인구가 가장 많아 저녁 영업에 유리합니다.`
                    : `이 지역은 오후 시간대(${realData.floatingPopulation.byTimeOfDay.afternoon}%) 유동인구가 가장 많아 점심/오후 영업에 적합합니다.`
                  }</p>
                </div>
              </div>
            )}

{activeTab === 'competition' && (
              <div className="content-panel competition-panel">
                <h3>🏪 경쟁 점포 분석</h3>
                <p className="data-source">📍 반경 500m 기준 | {businessType.name} 업종</p>
                
                <div className="stat-cards">
                  <div className="stat-card">
                    <span className="stat-icon">🏬</span>
                    <div className="stat-info">
                      <span className="stat-value">{competitorCount}개</span>
                      <span className="stat-label">{businessType.name} 업종 점포</span>
                    </div>
                  </div>
                  <div className="stat-card highlight">
                    <span className="stat-icon">📈</span>
                    <div className="stat-info">
                      <span className="stat-value">{competitorCount < 15 ? '낮음' : competitorCount < 30 ? '보통' : '높음'}</span>
                      <span className="stat-label">경쟁 강도</span>
                    </div>
                  </div>
                </div>

                {/* 경쟁 점포 지도 */}
                <div className="competitor-map-section">
                  <h4>경쟁 점포 위치</h4>
                  <p className="map-note" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    📍 반경 500m 내 총 32개 점포 위치
                  </p>
                  <div className="competitor-map-container">
                    <MapContainer
                      center={[36.4801, 127.2600]}
                      zoom={16}
                      style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                      zoomControl={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* 동일 업종 - 빨간색 (20개) - 도담동 상업지구 */}
                      <CircleMarker center={[36.4825, 127.2615]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>도담한식당</strong><br/>영업중 · 도담동 중심상가</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4815, 127.2580]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>미소식당</strong><br/>영업중 · 도담1로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4790, 127.2620]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>행복한밥상</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4835, 127.2595]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>고향집</strong><br/>영업중 · 도담2로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4775, 127.2590]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>맛나분식</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4805, 127.2640]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>청기와한정식</strong><br/>영업중 · 중앙상가</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4845, 127.2610]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>할매손칼국수</strong><br/>영업중 · 도담3로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4780, 127.2555]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>삼대곱창</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4820, 127.2650]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>엄마손두부</strong><br/>영업중 · 도담4로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4760, 127.2615]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>본가설렁탕</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4810, 127.2565]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>왕돈까스</strong><br/>영업중 · 도담1로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4850, 127.2585]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>삼겹살전문점</strong><br/>영업중 · 도담5로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4795, 127.2570]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>부대찌개마을</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4830, 127.2635]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>순대국밥</strong><br/>영업중 · 중앙상가</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4770, 127.2630]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>정육식당</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4840, 127.2565]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>닭갈비전문점</strong><br/>영업중 · 도담6로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4800, 127.2655]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>족발보쌈</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4755, 127.2580]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>냉면집</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4815, 127.2625]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>비빔밥전문</strong><br/>영업중 · 도담2로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4785, 127.2645]} radius={8} fillColor="#dc2626" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>해물탕집</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>

                      {/* 유사 업종 - 주황색 (12개) */}
                      <CircleMarker center={[36.4800, 127.2600]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>홍콩반점</strong><br/>영업중 · 도담동 중심</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4825, 127.2575]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>베이징</strong><br/>영업중 · 도담1로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4765, 127.2605]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>짬뽕전문점</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4838, 127.2625]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>양자강</strong><br/>영업중 · 도담3로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4792, 127.2560]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>스시오마카세</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4812, 127.2660]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>돈부리하우스</strong><br/>영업중 · 도담4로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4855, 127.2600]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>라멘집</strong><br/>영업중 · 도담5로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4778, 127.2640]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>월남쌈전문점</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4830, 127.2555]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>태국음식점</strong><br/>영업중 · 도담6로</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4750, 127.2595]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>인도카레</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4805, 127.2545]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>멕시칸레스토랑</strong><br/>영업중 · 도담동</Popup>
                      </CircleMarker>
                      <CircleMarker center={[36.4845, 127.2640]} radius={8} fillColor="#f59e0b" color="#fff" weight={2} fillOpacity={0.9}>
                        <Popup><strong>이탈리안파스타</strong><br/>영업중 · 도담7로</Popup>
                      </CircleMarker>
                    </MapContainer>
                    
                    <div className="map-legend">
                      <div className="legend-title">범례</div>
                      <div className="legend-items-grid">
                        <div className="legend-item-map">
                          <span className="legend-marker red"></span>
                          <span className="legend-text">동일 업종 (20개)</span>
                        </div>
                        <div className="legend-item-map">
                          <span className="legend-marker orange"></span>
                          <span className="legend-text">유사 업종 (12개)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="major-brands">
                  <h4>주요 브랜드 현황</h4>
                  <div className="brand-tags">
                    {competitorInfo.majorBrands.map((brand, idx) => (
                      <span key={idx} className="brand-tag">{brand}</span>
                    ))}
                  </div>
                </div>

                <div className="competition-list">
                  <h4>인근 주요 점포</h4>
                  <div className="competitor-items">
                    {competitorInfo.nearbyStores.map((store, idx) => (
                      <div key={idx} className="competitor-item">
                        <span className="comp-icon">🏪</span>
                        <div className="comp-info">
                          <span className="comp-name">{store.name}</span>
                          <span className="comp-distance">{store.distance}</span>
                        </div>
                        <span className={`comp-status ${store.status === '영업중' ? 'open' : 'closed'}`}>
                          {store.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 경쟁 및 점포 추이 (최근 2년) */}
                <div className="store-trend-section">
                  <h4>경쟁 및 점포 추이 (최근 2년)</h4>
                  <div className="trend-bars">
                    <div className="trend-bar-item">
                      <span className="trend-year">2023 신규</span>
                      <div className="trend-bar-bg">
                        <div className="trend-bar-fill blue" style={{ width: '60%' }}>
                          <span className="trend-count">12개</span>
                        </div>
                      </div>
                    </div>
                    <div className="trend-bar-item">
                      <span className="trend-year">2023 폐업</span>
                      <div className="trend-bar-bg">
                        <div className="trend-bar-fill red" style={{ width: '30%' }}>
                          <span className="trend-count">6개</span>
                        </div>
                      </div>
                    </div>
                    <div className="trend-bar-item">
                      <span className="trend-year">2024 신규</span>
                      <div className="trend-bar-bg">
                        <div className="trend-bar-fill blue" style={{ width: '80%' }}>
                          <span className="trend-count">16개</span>
                        </div>
                      </div>
                    </div>
                    <div className="trend-bar-item">
                      <span className="trend-year">2024 폐업</span>
                      <div className="trend-bar-bg">
                        <div className="trend-bar-fill red" style={{ width: '15%' }}>
                          <span className="trend-count">3개</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="store-type-legend">
                    <div className="type-item">
                      <span className="type-dot red"></span>
                      <span>동일 업종</span>
                      <span className="type-count">20개 (한식당)</span>
                    </div>
                    <div className="type-item">
                      <span className="type-dot orange"></span>
                      <span>유사 업종</span>
                      <span className="type-count">12개 (중식당 등)</span>
                    </div>
                  </div>
                  
                  <div className="trend-insight">
                    <p>순증가 +19개로 상권 성장세가 뚜렷합니다. 한식당은 포화 상태이나, 카페가 많아 식사 후 연계 소비가 가능합니다.</p>
                  </div>
                </div>

                <div className="insight-box">
                  <span className="insight-icon">💡</span>
                  <p>이 지역의 {businessType.name} 업종은 {competitorCount < 20 
                    ? `총 ${competitorCount}개로 경쟁이 치열하지 않아 신규 진입 기회가 있습니다.` 
                    : `${competitorCount}개가 운영 중이며, 이미 수요가 검증된 상권입니다. 차별화 전략이 필요합니다.`}</p>
                </div>
              </div>
            )}

            {activeTab === 'rent' && (
              <div className="content-panel rent-panel">
                <h3>💰 임대료 및 건물 분석</h3>
                <p className="data-source">📍 2025년 기준 | 세종시 부동산 시세 참고</p>
                
                <div className="stat-cards">
                  <div className="stat-card">
                    <span className="stat-icon">💵</span>
                    <div className="stat-info">
                      <span className="stat-value">{realData.rent.avg1F}만원/평</span>
                      <span className="stat-label">1층 평균 임대료</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🏢</span>
                    <div className="stat-info">
                      <span className="stat-value">{realData.rent.avg2F}만원/평</span>
                      <span className="stat-label">2층 이상 평균</span>
                    </div>
                  </div>
                  <div className="stat-card highlight">
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                      <span className="stat-value">{realData.rent.avgDeposit}만원/평</span>
                      <span className="stat-label">평균 보증금</span>
                    </div>
                  </div>
                </div>

                <div className="rent-trend">
                  <h4>임대료 시세 동향</h4>
                  <div className="trend-info">
                    <span className={`trend-badge ${realData.rent.trend}`}>
                      {realData.rent.trend === 'rising' ? '📈 상승세' : realData.rent.trend === 'falling' ? '📉 하락세' : '➡️ 보합'}
                    </span>
                    <span className="trend-detail">
                      최근 6개월 변동: <strong className={realData.rent.recentChange >= 0 ? 'positive' : 'negative'}>
                        {realData.rent.recentChange >= 0 ? '+' : ''}{realData.rent.recentChange}%
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="rent-range">
                  <h4>세종시 내 임대료 비교</h4>
                  <div className="range-chart">
                    <div className="range-bar">
                      <div className="range-fill" style={{ left: '15%', width: '50%' }}></div>
                      <div className="range-marker" style={{ left: `${((realData.rent.avg1F - 7) / 10) * 100}%` }}>
                        <span className="marker-label">{district.name}</span>
                      </div>
                    </div>
                    <div className="range-labels">
                      <span>7만원</span>
                      <span>10만원</span>
                      <span>14만원</span>
                      <span>17만원</span>
                    </div>
                  </div>
                </div>

                <div className="building-info">
                  <h4>건물 특성</h4>
                  <div className="building-grid">
                    <div className="building-item">
                      <span className="build-label">평균 층수</span>
                      <span className="build-value">{realData.building.avgFloors}</span>
                    </div>
                    <div className="building-item">
                      <span className="build-label">평균 면적</span>
                      <span className="build-value">{realData.building.avgArea}</span>
                    </div>
                    <div className="building-item">
                      <span className="build-label">건물 연식</span>
                      <span className="build-value">평균 {realData.building.avgAge}년</span>
                    </div>
                    <div className="building-item">
                      <span className="build-label">주차 시설</span>
                      <span className="build-value">{realData.building.parkingAvailability === 'good' ? '양호' : realData.building.parkingAvailability === 'moderate' ? '보통' : '불편'}</span>
                    </div>
                  </div>
                </div>

                <div className="insight-box">
                  <span className="insight-icon">💡</span>
                  <p>이 지역 1층 상가 월 임대료는 평당 약 {realData.rent.avg1F}만원으로, 
                    {realData.rent.avg1F < 4 ? ' 세종시 평균보다 저렴한 편입니다. 초기 비용 부담이 적어 창업에 유리합니다.' 
                    : realData.rent.avg1F < 5.5 ? ' 세종시 평균 수준입니다. 적정한 초기 투자로 시작할 수 있습니다.'
                    : ' 세종시 평균보다 다소 높은 편입니다. 예상 매출 대비 임대료 비용을 신중히 검토하세요.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'customer' && (
              <div className="content-panel customer-panel">
                <h3>🎯 고객 특성 분석</h3>
                <p className="data-source">📍 세종시 인구통계 데이터 기반</p>
                
                {/* 도넛 차트 영역 */}
                <div className="donut-chart-section">
                  <div className="donut-chart-container">
                    <div className="donut-chart">
                      <svg viewBox="0 0 200 200" className="donut-svg">
                        {/* 3040 직장인 (40%) - 파랑 */}
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="30"
                          strokeDasharray="176 440" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                        {/* 20대 1인가구 (30%) - 초록 */}
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="30"
                          strokeDasharray="132 440" strokeDashoffset="-176" transform="rotate(-90 100 100)" />
                        {/* 4인 이상 가족 (20%) - 주황 */}
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" strokeWidth="30"
                          strokeDasharray="88 440" strokeDashoffset="-308" transform="rotate(-90 100 100)" />
                        {/* 기타 (10%) - 회색 */}
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#6b7280" strokeWidth="30"
                          strokeDasharray="44 440" strokeDashoffset="-396" transform="rotate(-90 100 100)" />
                      </svg>
                      <div className="donut-center">
                        <span className="donut-value">4,200</span>
                        <span className="donut-label">평균소득 (만원)</span>
                      </div>
                    </div>
                    <div className="donut-legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#3b82f6' }}></span>
                        <span className="legend-text"><strong>3040 직장인 (40%)</strong> - 핵심 타겟</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#10b981' }}></span>
                        <span className="legend-text"><strong>20대 1인가구 (30%)</strong> - 저녁/배달</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#f59e0b' }}></span>
                        <span className="legend-text"><strong>4인 이상 가족 (20%)</strong> - 주말 외식</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ background: '#6b7280' }}></span>
                        <span className="legend-text"><strong>기타 (10%)</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="customer-insight-box">
                    <p>중산층 직장인과 1인 가구가 밀집되어 있어, 점심엔 '빠른 정식', 저녁엔 '배달 겸용' 메뉴 구성이 유리합니다.</p>
                  </div>
                </div>

                <div className="customer-stats">
                  <div className="stat-cards">
                    <div className="stat-card">
                      <span className="stat-icon">💳</span>
                      <div className="stat-info">
                        <span className="stat-value">{realData.demographics.avgIncome}</span>
                        <span className="stat-label">평균 소득 수준</span>
                      </div>
                    </div>
                    <div className="stat-card highlight">
                      <span className="stat-icon">👥</span>
                      <div className="stat-info">
                        <span className="stat-value">{realData.demographics.age2030Ratio}%</span>
                        <span className="stat-label">20~30대 비율</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="customer-insight">
                  <h4>주요 고객층</h4>
                  <div className="insight-tags">
                    {realData.demographics.mainCustomerType.map((type, idx) => (
                      <span key={idx} className="tag">{type}</span>
                    ))}
                  </div>
                </div>

                <div className="insight-box">
                  <span className="insight-icon">💡</span>
                  <p>{realData.demographics.age2030Ratio >= 40 
                    ? `이 지역은 20~30대 비중이 ${realData.demographics.age2030Ratio}%로 높아, 트렌디한 컨셉의 ${businessType.name}이(가) 성공 가능성이 높습니다.`
                    : `이 지역은 40~50대 비중이 ${realData.demographics.age4050Ratio}%로, 안정적인 소비층을 타겟으로 한 ${businessType.name} 전략이 유효합니다.`}</p>
                </div>
              </div>
            )}

            {activeTab === 'regulations' && (
              <div className="content-panel regulations-panel">
                <h3>📋 업종별 입주 가능 여부 분석</h3>
                <p className="data-source">📍 건축법·용도지역·소방법·인허가 기준 기반</p>
                
                <div className="regulation-alert">
                  <span className="alert-icon">🤖</span>
                  <div className="alert-content">
                    <h4>AI 자동 필터링</h4>
                    <p>세종시 건축법, 용도지역 조례, 소방법, 교육청 학원 인가 기준 등을 AI 모델로 학습하여, 실질적인 입주 가능 여부를 자동 분석합니다.</p>
                  </div>
                </div>

                <div className="zone-info">
                  <h4>용도지역 정보</h4>
                  <div className="zone-grid">
                    <div className="zone-item">
                      <span className="zone-label">용도지역</span>
                      <span className="zone-value">제2종 일반주거지역</span>
                    </div>
                    <div className="zone-item">
                      <span className="zone-label">지구단위계획</span>
                      <span className="zone-value">중심상업지구</span>
                    </div>
                    <div className="zone-item">
                      <span className="zone-label">건폐율</span>
                      <span className="zone-value">60% 이하</span>
                    </div>
                    <div className="zone-item">
                      <span className="zone-label">용적률</span>
                      <span className="zone-value">200% 이하</span>
                    </div>
                  </div>
                </div>

                <div className="business-availability">
                  <h4>업종별 입주 가능 여부</h4>
                  <div className="availability-list">
                    <div className="availability-item allowed">
                      <span className="status-icon">✅</span>
                      <div className="availability-info">
                        <span className="business-type">음식점 (일반음식점)</span>
                        <span className="availability-detail">1~5층 전체 가능 | 별도 제약 없음</span>
                      </div>
                    </div>
                    <div className="availability-item allowed">
                      <span className="status-icon">✅</span>
                      <div className="availability-info">
                        <span className="business-type">카페 (휴게음식점)</span>
                        <span className="availability-detail">전 층 가능 | 별도 제약 없음</span>
                      </div>
                    </div>
                    <div className="availability-item partial">
                      <span className="status-icon">⚠️</span>
                      <div className="availability-info">
                        <span className="business-type">학원 (교습소)</span>
                        <span className="availability-detail">3층 이상만 가능 | 학교 정화구역 200m 이내 제한</span>
                      </div>
                    </div>
                    <div className="availability-item partial">
                      <span className="status-icon">⚠️</span>
                      <div className="availability-info">
                        <span className="business-type">병원 (의원)</span>
                        <span className="availability-detail">3층만 가능 | 의료법상 면적 기준 충족 필요</span>
                      </div>
                    </div>
                    <div className="availability-item restricted">
                      <span className="status-icon">❌</span>
                      <div className="availability-info">
                        <span className="business-type">노래방 (단란주점)</span>
                        <span className="availability-detail">입주 불가 | 학교 정화구역 및 주거지역 제한</span>
                      </div>
                    </div>
                    <div className="availability-item restricted">
                      <span className="status-icon">❌</span>
                      <div className="availability-info">
                        <span className="business-type">PC방</span>
                        <span className="availability-detail">입주 불가 | 학교 정화구역 200m 이내</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="regulation-example">
                  <h4>실제 사례 시뮬레이션</h4>
                  <div className="example-card">
                    <div className="example-header">
                      <span className="example-icon">🏢</span>
                      <span className="example-title">{district.name} 중심상가 A동 201호 (2층, 33평)</span>
                    </div>
                    <div className="example-results">
                      <div className="example-result success">
                        <span className="result-icon">✅</span>
                        <span className="result-text">일반음식점: <strong>입주 가능</strong></span>
                      </div>
                      <div className="example-result success">
                        <span className="result-icon">✅</span>
                        <span className="result-text">카페: <strong>입주 가능</strong></span>
                      </div>
                      <div className="example-result warning">
                        <span className="result-icon">⚠️</span>
                        <span className="result-text">학원: <strong>인근 초등학교 150m → 입주 불가</strong></span>
                      </div>
                      <div className="example-result error">
                        <span className="result-icon">❌</span>
                        <span className="result-text">PC방: <strong>학교 정화구역 내 → 입주 불가</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-box">
                  <span className="insight-icon">💡</span>
                  <p>이 지역은 <strong>제2종 일반주거지역</strong>으로, 일반음식점과 카페는 제약 없이 입주 가능하나, 
                  학원·PC방 등은 학교 정화구역 규제를 받습니다. 창업 전 반드시 해당 건물의 용도지역과 인허가 조건을 확인하세요.</p>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="content-panel safety-panel">
                <h3>🚨 소방법 및 인테리어 제약 분석</h3>
                <p className="data-source">📍 건축물 대장·소방시설 현황 기반</p>
                
                <div className="regulation-alert">
                  <span className="alert-icon">🔥</span>
                  <div className="alert-content">
                    <h4>소방 제약 사전 안내</h4>
                    <p>"문 위치 하나도 소방법 때문에 고민했다" - 실제 창업자 사례를 반영하여, 
                    인테리어 비용을 사전에 예측할 수 있도록 소방시설 현황을 제공합니다.</p>
                  </div>
                </div>

                <div className="building-safety-info">
                  <h4>건축물 소방시설 현황</h4>
                  <div className="safety-grid">
                    <div className="safety-item">
                      <span className="safety-icon">💧</span>
                      <div className="safety-info">
                        <span className="safety-label">스프링클러</span>
                        <span className="safety-status installed">설치됨</span>
                      </div>
                      <span className="safety-detail">전 층 설치 완료 (2023년 점검)</span>
                    </div>
                    <div className="safety-item">
                      <span className="safety-icon">🚪</span>
                      <div className="safety-info">
                        <span className="safety-label">비상구</span>
                        <span className="safety-status installed">2개소</span>
                      </div>
                      <span className="safety-detail">동측·서측 각 1개소 (폭 0.9m)</span>
                    </div>
                    <div className="safety-item">
                      <span className="safety-icon">🔔</span>
                      <div className="safety-info">
                        <span className="safety-label">화재경보기</span>
                        <span className="safety-status installed">설치됨</span>
                      </div>
                      <span className="safety-detail">각 실 천장 1개소씩</span>
                    </div>
                    <div className="safety-item">
                      <span className="safety-icon">🧯</span>
                      <div className="safety-info">
                        <span className="safety-label">소화기</span>
                        <span className="safety-status installed">설치됨</span>
                      </div>
                      <span className="safety-detail">복도 2개소 (2025년 교체)</span>
                    </div>
                  </div>
                </div>

                <div className="interior-constraints">
                  <h4>인테리어 제약 사항</h4>
                  <div className="constraint-list">
                    <div className="constraint-item high">
                      <span className="priority-badge high">필수</span>
                      <div className="constraint-content">
                        <h5>비상구 경로 확보</h5>
                        <p>주 출입구에서 비상구까지 최소 1.5m 폭 통로 유지 필요. 좌석 배치 시 유의.</p>
                      </div>
                    </div>
                    <div className="constraint-item high">
                      <span className="priority-badge high">필수</span>
                      <div className="constraint-content">
                        <h5>주방 후드 설치 (음식점)</h5>
                        <p>가스레인지 사용 시 자동소화장치 부착 의무. 예상 비용: 150~300만원</p>
                      </div>
                    </div>
                    <div className="constraint-item medium">
                      <span className="priority-badge medium">권장</span>
                      <div className="constraint-content">
                        <h5>내부 칸막이 변경</h5>
                        <p>기존 구조 변경 시 소방법 재검토 필요. 석고보드 칸막이는 가능.</p>
                      </div>
                    </div>
                    <div className="constraint-item low">
                      <span className="priority-badge low">선택</span>
                      <div className="constraint-content">
                        <h5>간판 설치</h5>
                        <p>건물 외관 광고물 허가 필요. 세종시 옥외광고물 조례 확인.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cost-estimate">
                  <h4>예상 인테리어 비용 (음식점 기준)</h4>
                  <div className="cost-breakdown">
                    <div className="cost-item">
                      <span className="cost-category">기본 인테리어</span>
                      <span className="cost-amount">평당 150~250만원</span>
                    </div>
                    <div className="cost-item">
                      <span className="cost-category">주방 설비 (후드, 가스 등)</span>
                      <span className="cost-amount">500~800만원</span>
                    </div>
                    <div className="cost-item">
                      <span className="cost-category">소방시설 보완</span>
                      <span className="cost-amount">100~200만원</span>
                    </div>
                    <div className="cost-item total">
                      <span className="cost-category">총 예상 비용 (30평 기준)</span>
                      <span className="cost-amount">5,100~8,300만원</span>
                    </div>
                  </div>
                </div>

                <div className="insight-box">
                  <span className="insight-icon">💡</span>
                  <p>이 건물은 소방시설이 잘 갖춰져 있어, 추가 소방 공사 비용이 적게 들 것으로 예상됩니다. 
                  다만 주방 후드 자동소화장치는 필수이므로, 인테리어 예산에 반드시 포함하세요. 
                  비상구 위치를 고려하여 좌석을 배치하면 소방 점검 통과에 유리합니다.</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 우측: AI 코멘트 패널 */}
        <aside className="ai-panel">
          <div className="ai-header">
            <span className="ai-icon">🤖</span>
            <h3>AI 분석 코멘트</h3>
            {isOllamaConnected && (
              <span className="ollama-badge connected">Ollama 연결됨</span>
            )}
          </div>
          
          <div className="ai-comment-box">
            {isAiLoading ? (
              <div className="ai-loading">
                <span className="loading-spinner"></span>
                <span>AI가 분석 중입니다...</span>
              </div>
            ) : (
              <p>{aiComment}</p>
            )}
          </div>

          {/* 점수 분석 */}
          {scoreBreakdown && (
            <div className="score-analysis">
              <div className="score-analysis-header">
                <div className="score-analysis-title">
                  <span className="analysis-icon">📊</span>
                  <h4>점수 분석</h4>
                </div>
                <span className="score-analysis-note">세종 평균 대비 기여도</span>
              </div>
              <div className="score-analysis-items">
                <div className="score-analysis-item">
                  <div className="score-item-header">
                    <span className="score-label">유동인구</span>
                    <span className={`score-value ${scoreBreakdown.population >= 0 ? 'positive' : 'negative'}`}>
                      {formatContribution(scoreBreakdown.population)}
                    </span>
                  </div>
                  <div className="score-bar-container">
                    <div 
                      className={`score-bar ${scoreBreakdown.population >= 0 ? 'positive' : 'negative'}`}
                      style={{ width: `${Math.abs(scoreBreakdown.population) * 5}%` }}
                    ></div>
                  </div>
                </div>
                <div className="score-analysis-item">
                  <div className="score-item-header">
                    <span className="score-label">경쟁 포화도</span>
                    <span className={`score-value ${scoreBreakdown.competition >= 0 ? 'positive' : 'negative'}`}>
                      {formatContribution(scoreBreakdown.competition)}
                    </span>
                  </div>
                  <div className="score-bar-container">
                    <div 
                      className={`score-bar ${scoreBreakdown.competition >= 0 ? 'positive' : 'negative'}`}
                      style={{ width: `${Math.abs(scoreBreakdown.competition) * 5}%` }}
                    ></div>
                  </div>
                </div>
                <div className="score-analysis-item">
                  <div className="score-item-header">
                    <span className="score-label">임대료</span>
                    <span className={`score-value ${scoreBreakdown.rent >= 0 ? 'positive' : 'negative'}`}>
                      {formatContribution(scoreBreakdown.rent)}
                    </span>
                  </div>
                  <div className="score-bar-container">
                    <div 
                      className={`score-bar ${scoreBreakdown.rent >= 0 ? 'positive' : 'negative'}`}
                      style={{ width: `${Math.abs(scoreBreakdown.rent) * 5}%` }}
                    ></div>
                  </div>
                </div>
                <div className="score-analysis-item">
                  <div className="score-item-header">
                    <span className="score-label">공실률</span>
                    <span className={`score-value ${scoreBreakdown.vacancy >= 0 ? 'positive' : 'negative'}`}>
                      {formatContribution(scoreBreakdown.vacancy)}
                    </span>
                  </div>
                  <div className="score-bar-container">
                    <div 
                      className={`score-bar ${scoreBreakdown.vacancy >= 0 ? 'positive' : 'negative'}`}
                      style={{ width: `${Math.abs(scoreBreakdown.vacancy) * 5}%` }}
                    ></div>
                  </div>
                </div>
                <div className="score-analysis-item">
                  <div className="score-item-header">
                    <span className="score-label">입지등급</span>
                    <span className={`score-value ${scoreBreakdown.locationGrade >= 0 ? 'positive' : 'negative'}`}>
                      {formatContribution(scoreBreakdown.locationGrade)}
                    </span>
                  </div>
                  <div className="score-bar-container">
                    <div 
                      className={`score-bar ${scoreBreakdown.locationGrade >= 0 ? 'positive' : 'negative'}`}
                      style={{ width: `${Math.abs(scoreBreakdown.locationGrade) * 5}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 유망도 점수 산출 로직 */}
          <div className="score-formula-section">
            <h4>유망도 점수 산출 로직</h4>
            <div className="formula-box">
              <code>Score = (Traffic × 0.3) + (Competitors × 0.2) - (Rent × 0.2) + (Income × 0.15) - (Vacancy × 0.15)</code>
            </div>
            <div className="formula-table">
              <div className="formula-row header">
                <span>지수</span>
                <span>가중치</span>
              </div>
              <div className="formula-row">
                <span>유동인구</span>
                <span className="weight">30%</span>
              </div>
              <div className="formula-row">
                <span>경쟁 점포</span>
                <span className="weight">20%</span>
              </div>
              <div className="formula-row">
                <span>임대료</span>
                <span className="weight">20%</span>
              </div>
              <div className="formula-row">
                <span>고객 소득</span>
                <span className="weight">15%</span>
              </div>
              <div className="formula-row">
                <span>공실률</span>
                <span className="weight">15%</span>
              </div>
            </div>
          </div>

          <div className="key-points">
            <h4>핵심 포인트</h4>
            <ul>
              <li className="positive">
                <span className="point-icon">✅</span>
                <span>유동인구 일평균 {realData.floatingPopulation.daily.toLocaleString()}명</span>
              </li>
              <li className={realData.demographics.age2030Ratio >= 40 ? 'positive' : 'neutral'}>
                <span className="point-icon">{realData.demographics.age2030Ratio >= 40 ? '✅' : '➡️'}</span>
                <span>20~30대 비중 {realData.demographics.age2030Ratio}%{realData.demographics.age2030Ratio >= 40 ? ' (높음)' : ''}</span>
              </li>
              <li className={competitorCount < 25 ? 'positive' : 'neutral'}>
                <span className="point-icon">{competitorCount < 25 ? '✅' : '⚠️'}</span>
                <span>{businessType.name} 업종 {competitorCount}개 ({competitorCount < 20 ? '경쟁 낮음' : '경쟁 보통'})</span>
              </li>
              <li className={realData.rent.avg1F < 5.5 ? 'positive' : 'neutral'}>
                <span className="point-icon">{realData.rent.avg1F < 5.5 ? '✅' : '⚠️'}</span>
                <span>1층 임대료 평당 {realData.rent.avg1F}만원 ({realData.rent.avg1F < 4 ? '저렴' : realData.rent.avg1F < 5.5 ? '적정' : '높음'})</span>
              </li>
            </ul>
          </div>

          <div className="risk-assessment">
            <h4>리스크 요인</h4>
            <ul>
              {district.vacancyRate > 8 && (
                <li className="risk">
                  <span className="risk-icon">⚠️</span>
                  <span>공실률 {district.vacancyRate.toFixed(1)}%로 다소 높음</span>
                </li>
              )}
              {realData.rent.avg1F > 6 && (
                <li className="risk">
                  <span className="risk-icon">⚠️</span>
                  <span>임대료 평당 {realData.rent.avg1F}만원 - 비용 부담 검토 필요</span>
                </li>
              )}
              {competitorCount > 35 && (
                <li className="risk">
                  <span className="risk-icon">⚠️</span>
                  <span>{businessType.name} 업종 {competitorCount}개로 경쟁 치열</span>
                </li>
              )}
              {realData.rent.trend === 'rising' && (
                <li className="neutral">
                  <span className="risk-icon">📈</span>
                  <span>임대료 상승 추세 (+{realData.rent.recentChange}%)</span>
                </li>
              )}
              {district.vacancyRate <= 8 && realData.rent.avg1F <= 6 && competitorCount <= 35 && (
                <li className="positive">
                  <span className="risk-icon">✅</span>
                  <span>특별한 리스크 요인 없음</span>
                </li>
              )}
            </ul>
          </div>

          <button className="cta-btn" onClick={onGoToPolicy}>
            <span>🎯</span>
            <span>맞춤 정책·지원 확인하기</span>
            <span className="arrow">→</span>
          </button>
        </aside>
      </div>
    </div>
  )
}

export default DetailAnalysis

