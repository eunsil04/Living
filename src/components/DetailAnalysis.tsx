import { useState, useEffect } from 'react'
import { DistrictData, BusinessType, RecommendationResult } from '../types'
import { realDistrictData, defaultDistrictInfo, getCompetitorInfo } from '../data/realDistrictData'
import { generateAnalysisComment, checkOllamaConnection } from '../services/ollamaService'
import './DetailAnalysis.css'

interface DetailAnalysisProps {
  district: DistrictData
  businessType: BusinessType
  recommendation: RecommendationResult
  onBack: () => void
  onGoToPolicy: () => void
}

type TabType = 'traffic' | 'competition' | 'rent' | 'customer'

function DetailAnalysis({ district, businessType, recommendation, onBack, onGoToPolicy }: DetailAnalysisProps) {
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
                      <span className="type-count">8개 (한식당)</span>
                    </div>
                    <div className="type-item">
                      <span className="type-dot orange"></span>
                      <span>유사 업종</span>
                      <span className="type-count">2개 (중식당)</span>
                    </div>
                    <div className="type-item">
                      <span className="type-dot green"></span>
                      <span>보완 업종</span>
                      <span className="type-count">4개 (카페)</span>
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

