import { useState } from 'react'
import { BusinessType } from '../types'
import { businessTypes } from '../data/districts'
import './HomePage.css'

interface HomePageProps {
  onStart: (business: BusinessType) => void
}

function HomePage({ onStart }: HomePageProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType | null>(null)
  const [step, setStep] = useState<'intro' | 'select' | 'analyzing'>('intro')
  const [rentRange, setRentRange] = useState<[number, number]>([300, 800])
  const [trafficWeight, setTrafficWeight] = useState(50)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleBusinessSelect = (business: BusinessType) => {
    setSelectedBusiness(business)
  }

  const handleStart = () => {
    if (selectedBusiness) {
      // AI 분석 로딩 화면 표시
      setStep('analyzing')
      setAnalysisProgress(0)
      
      // 프로그레스 애니메이션
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 5
        })
      }, 100)
      
      // 2초 후 다음 페이지로 이동
      setTimeout(() => {
        clearInterval(progressInterval)
        onStart(selectedBusiness)
      }, 2000)
    }
  }

  return (
    <div className="home-page">
      {/* 배경 장식 */}
      <div className="home-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      <div className="home-container">
        {step === 'intro' ? (
          <div className="intro-section">
            <div className="intro-content">
              <div className="intro-badge">
                <span>🚀</span>
                <span>세종시 AI 창업 입지 분석 플랫폼</span>
              </div>
              
              <h1 className="intro-title">
                <span className="title-gradient">세종시 창업,</span>
                <br />
                <span className="title-main">AI가 찾아주는 <span className="highlight-text">황금 입지</span></span>
              </h1>

              <p className="intro-description">
                빅데이터 기반 상권 분석으로 창업 성공률을 높이세요.
                <br />
                유동인구, 경쟁현황, 임대료를 종합 분석해 최적의 장소를 추천합니다.
              </p>

              <div className="feature-cards">
                <div className="feature-card">
                  <div className="feature-icon">📍</div>
                  <div className="feature-text">
                    <h3>유망 입지 추천</h3>
                    <p>창업에 적합한 유망 입지 후보를 AI가 분석해 추천</p>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚠️</div>
                  <div className="feature-text">
                    <h3>리스크 사전 파악</h3>
                    <p>예상 리스크 요인을 미리 파악하여 실패 확률 최소화</p>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-text">
                    <h3>정책·지원 연계</h3>
                    <p>지역 맞춤 창업 정책과 지원 프로그램 자동 연계</p>
                  </div>
                </div>
              </div>

              <button className="start-button" onClick={() => setStep('select')}>
                <span>창업 입지 분석 시작하기</span>
                <span className="button-arrow">→</span>
              </button>
            </div>

            <div className="intro-visual">
              <div className="visual-card">
                <div className="visual-map">
                  <div className="map-placeholder">
                    <span className="map-icon">🗺️</span>
                    <div className="map-pins">
                      <div className="pin pin-1">📍</div>
                      <div className="pin pin-2">📍</div>
                      <div className="pin pin-3">📍</div>
                    </div>
                  </div>
                </div>
                <div className="visual-stats">
                  <div className="stat-item">
                    <span className="stat-value">36</span>
                    <span className="stat-label">분석 지역</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">8+</span>
                    <span className="stat-label">분석 업종</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">AI</span>
                    <span className="stat-label">맞춤 분석</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="select-section">
            <button className="back-button" onClick={() => setStep('intro')}>
              <span>←</span>
              <span>뒤로가기</span>
            </button>

            {/* Step 1 헤더 */}
            <div className="step-header-banner">
              <h2>Step 1: 직관적인 조건 설정</h2>
              <div className="step-divider"></div>
            </div>

            <div className="select-header">
              <div className="step-indicator">
                <div className="step active">
                  <span className="step-number">1</span>
                  <span className="step-label">조건 설정</span>
                </div>
                <div className="step-line"></div>
                <div className="step">
                  <span className="step-number">2</span>
                  <span className="step-label">입지 추천</span>
                </div>
                <div className="step-line"></div>
                <div className="step">
                  <span className="step-number">3</span>
                  <span className="step-label">상세 분석</span>
                </div>
              </div>
            </div>

            {/* 3개 UI 카드 */}
            <div className="condition-cards">
              {/* 업종 선택 UI */}
              <div className="condition-card">
                <div className="condition-icon">🍽️</div>
                <h3 className="condition-title">업종 선택 UI</h3>
                <p className="condition-desc">
                  드롭다운 검색 및 태그 추가<br />
                  (최대 3개 다중 선택 가능)<br />
                  업종별 평균 임대료 데이터 연동
                </p>
              </div>

              {/* 지역 선택 UI */}
              <div className="condition-card">
                <div className="condition-icon">📍</div>
                <h3 className="condition-title">지역 선택 UI</h3>
                <p className="condition-desc">
                  Leaflet.js 기반 지도<br />
                  마우스 드래그로 폴리곤 지정<br />
                  선택 범위 면적 및 예상 상가 수 표시
                </p>
              </div>

              {/* 추가 조건 */}
              <div className="condition-card">
                <div className="condition-icon">⚙️</div>
                <h3 className="condition-title">추가 조건</h3>
                <p className="condition-desc">
                  임대료 범위 슬라이더 (300~800만원)<br />
                  고객 특성 가중치 조절<br />
                  (유동인구 vs 가성비)
                </p>
              </div>
            </div>

            {/* 업종 선택 */}
            <div className="selection-section">
              <div className="section-header">
                <span className="section-icon">🎯</span>
                <div>
                  <h3>업종 선택</h3>
                  <p>음식점, 카페 등 대분류/소분류 선택 및 태그 방식</p>
                </div>
              </div>
              
              <div className="business-grid">
                {businessTypes.map((business) => (
                  <button
                    key={business.id}
                    className={`business-card ${selectedBusiness?.id === business.id ? 'selected' : ''}`}
                    onClick={() => handleBusinessSelect(business)}
                  >
                    <span className="business-icon">{business.icon}</span>
                    <span className="business-name">{business.name}</span>
                    <div className="business-check">✓</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 추가 조건 설정 */}
            <div className="additional-conditions">
              <div className="condition-row">
                {/* 임대료 상한선 */}
                <div className="slider-section">
                  <div className="slider-header">
                    <span className="slider-icon">💰</span>
                    <span className="slider-title">임대료 상한선</span>
                    <span className="slider-value">{rentRange[0]}~{rentRange[1]}만원</span>
                  </div>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="100" 
                      max="1000" 
                      value={rentRange[1]}
                      onChange={(e) => setRentRange([rentRange[0], parseInt(e.target.value)])}
                      className="rent-slider"
                    />
                    <div className="slider-labels">
                      <span>100만원</span>
                      <span>500만원</span>
                      <span>1,000만원</span>
                    </div>
                  </div>
                </div>

                {/* 고객층 가중치 */}
                <div className="slider-section">
                  <div className="slider-header">
                    <span className="slider-icon">👥</span>
                    <span className="slider-title">선호 고객층 (유동인구 vs 저임대료)</span>
                  </div>
                  <div className="weight-slider-container">
                    <span className="weight-label">유동인구 중시</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={trafficWeight}
                      onChange={(e) => setTrafficWeight(parseInt(e.target.value))}
                      className="weight-slider"
                    />
                    <span className="weight-label">저임대료 중시</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="select-action">
              <button 
                className={`analyze-button ${selectedBusiness ? 'active' : ''}`}
                onClick={handleStart}
                disabled={!selectedBusiness}
              >
                <span className="button-icon">🚀</span>
                <span>
                  {selectedBusiness 
                    ? `AI에게 유망 입지 추천받기` 
                    : '업종을 선택해주세요'}
                </span>
                <span className="button-arrow">→</span>
              </button>
              <p className="cta-hint">버튼을 누르면 즉시 분석이 시작됩니다</p>
            </div>
          </div>
        )}

        {/* AI 분석 중 화면 */}
        {step === 'analyzing' && selectedBusiness && (
          <div className="analyzing-section">
            <div className="analyzing-content">
              <div className="ai-brain">
                <div className="brain-icon">🤖</div>
                <div className="brain-pulse"></div>
                <div className="brain-pulse delay-1"></div>
                <div className="brain-pulse delay-2"></div>
              </div>
              
              <h2 className="analyzing-title">AI가 분석 중입니다</h2>
              <p className="analyzing-desc">
                <strong>{selectedBusiness.name}</strong> 업종에 적합한 
                <br />세종시 유망 입지를 찾고 있습니다...
              </p>

              <div className="analysis-steps">
                <div className={`analysis-step ${analysisProgress >= 20 ? 'active' : ''}`}>
                  <span className="step-check">{analysisProgress >= 20 ? '✓' : '○'}</span>
                  <span>유동인구 데이터 분석</span>
                </div>
                <div className={`analysis-step ${analysisProgress >= 40 ? 'active' : ''}`}>
                  <span className="step-check">{analysisProgress >= 40 ? '✓' : '○'}</span>
                  <span>경쟁 점포 현황 파악</span>
                </div>
                <div className={`analysis-step ${analysisProgress >= 60 ? 'active' : ''}`}>
                  <span className="step-check">{analysisProgress >= 60 ? '✓' : '○'}</span>
                  <span>임대료 시세 비교</span>
                </div>
                <div className={`analysis-step ${analysisProgress >= 80 ? 'active' : ''}`}>
                  <span className="step-check">{analysisProgress >= 80 ? '✓' : '○'}</span>
                  <span>고객 특성 매칭</span>
                </div>
                <div className={`analysis-step ${analysisProgress >= 100 ? 'active' : ''}`}>
                  <span className="step-check">{analysisProgress >= 100 ? '✓' : '○'}</span>
                  <span>최적 입지 선정</span>
                </div>
              </div>

              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{analysisProgress}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
