import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { DistrictData } from '../types'
import { 
  simulateVacancyReduction, 
  calculateTotalCommunityImpact, 
  analyzeInfrastructureNeeds,
  calculatePriorityScore,
  calculateDiversityIndex,
  JOB_CREATION_BY_BUSINESS
} from '../data/communityData'
import './CommunityDashboard.css'

interface CommunityDashboardProps {
  districts: DistrictData[]
  onClose: () => void
}

function CommunityDashboard({ districts, onClose }: CommunityDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'impact' | 'infrastructure' | 'priority' | 'simulation'>('impact')
  const [simulationTarget, setSimulationTarget] = useState(5)
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0].name)

  // 전체 영향 계산
  const totalImpact = useMemo(() => 
    calculateTotalCommunityImpact(districts, simulationTarget), 
    [districts, simulationTarget]
  )

  // 인프라 부족 분석
  const infrastructureNeeds = useMemo(() => 
    analyzeInfrastructureNeeds(districts),
    [districts]
  )

  // 우선순위 분석
  const priorityAnalysis = useMemo(() => 
    districts
      .map(d => ({ district: d, ...calculatePriorityScore(d) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10),
    [districts]
  )

  // 선택된 지역 시뮬레이션
  const selectedDistrictData = districts.find(d => d.name === selectedDistrict)
  const districtImpact = selectedDistrictData 
    ? simulateVacancyReduction(selectedDistrictData, Math.max(selectedDistrictData.vacancyRate - simulationTarget, 5))
    : null

  // 차트 데이터
  const diversityData = districts
    .filter(d => d.livingArea.includes('생활권'))
    .map(d => ({
      name: d.name,
      다양성지수: calculateDiversityIndex(d),
      상권활성화: d.marketActivationIndex,
      인구만명당: Math.round(d.cardSales / d.population / 1000)
    }))
    .sort((a, b) => b.다양성지수 - a.다양성지수)

  const radarData = selectedDistrictData ? [
    { subject: '수요', value: selectedDistrictData.demandIndex * 100, fullMark: 100 },
    { subject: '접근성', value: selectedDistrictData.accessibilityIndex * 100, fullMark: 100 },
    { subject: '안전', value: selectedDistrictData.safetyIndex * 100, fullMark: 100 },
    { subject: '상권활성화', value: selectedDistrictData.marketActivationIndex, fullMark: 100 },
    { subject: '다양성', value: calculateDiversityIndex(selectedDistrictData), fullMark: 100 },
    { subject: '공실여유', value: 100 - selectedDistrictData.vacancyRate, fullMark: 100 },
  ] : []

  const jobCreationData = Object.entries(JOB_CREATION_BY_BUSINESS).map(([key, value]) => ({
    업종: key === 'cafe' ? '카페' : key === 'restaurant' ? '음식점' : key === 'convenience' ? '편의점' : 
          key === 'beauty' ? '미용실' : key === 'gym' ? '헬스장' : key === 'pharmacy' ? '약국' :
          key === 'retail' ? '소매점' : '학원',
    일자리: value
  }))

  return (
    <div className="community-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <span className="title-icon">🏘️</span>
          <div>
            <h2>지역사회 발전 분석</h2>
            <p>지역주민·정책결정자를 위한 인사이트</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${selectedTab === 'impact' ? 'active' : ''}`}
          onClick={() => setSelectedTab('impact')}
        >
          💰 경제적 효과
        </button>
        <button 
          className={`tab ${selectedTab === 'infrastructure' ? 'active' : ''}`}
          onClick={() => setSelectedTab('infrastructure')}
        >
          🏥 생활인프라
        </button>
        <button 
          className={`tab ${selectedTab === 'priority' ? 'active' : ''}`}
          onClick={() => setSelectedTab('priority')}
        >
          🎯 정책 우선순위
        </button>
        <button 
          className={`tab ${selectedTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setSelectedTab('simulation')}
        >
          🔮 시뮬레이션
        </button>
      </div>

      <div className="dashboard-content">
        {selectedTab === 'impact' && (
          <div className="impact-section">
            {/* 핵심 효과 요약 */}
            <div className="impact-hero">
              <h3>🎯 공실률 {simulationTarget}%p 감소시 지역사회 효과</h3>
              <div className="impact-slider">
                <label>목표 공실률 감소:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  value={simulationTarget}
                  onChange={(e) => setSimulationTarget(Number(e.target.value))}
                />
                <span className="slider-value">{simulationTarget}%p</span>
              </div>
            </div>

            <div className="impact-cards">
              <div className="impact-card economic">
                <div className="impact-icon">💰</div>
                <div className="impact-content">
                  <span className="impact-value">{totalImpact.totalEconomicEffect}억원</span>
                  <span className="impact-label">지역경제 활성화 효과</span>
                  <span className="impact-detail">연간 추정 매출 증가분</span>
                </div>
              </div>
              <div className="impact-card jobs">
                <div className="impact-icon">👥</div>
                <div className="impact-content">
                  <span className="impact-value">{totalImpact.totalJobCreation}명</span>
                  <span className="impact-label">신규 일자리 창출</span>
                  <span className="impact-detail">직접 고용 예상</span>
                </div>
              </div>
              <div className="impact-card safety">
                <div className="impact-icon">🛡️</div>
                <div className="impact-content">
                  <span className="impact-value">+{totalImpact.avgSafetyImprovement}%</span>
                  <span className="impact-label">야간 안전 개선</span>
                  <span className="impact-detail">가로 활성화 효과</span>
                </div>
              </div>
              <div className="impact-card districts">
                <div className="impact-icon">🏘️</div>
                <div className="impact-content">
                  <span className="impact-value">{totalImpact.affectedDistricts}개</span>
                  <span className="impact-label">혜택 지역</span>
                  <span className="impact-detail">공실률 10% 이상 지역</span>
                </div>
              </div>
            </div>

            {/* 업종별 일자리 창출 */}
            <div className="chart-section">
              <h3>👷 업종별 평균 일자리 창출 (1개 매장당)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={jobCreationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="업종" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" unit="명" />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                    formatter={(value: number) => `${value}명`}
                  />
                  <Bar dataKey="일자리" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 상권 다양성 분석 */}
            <div className="chart-section">
              <h3>🌈 생활권별 상권 다양성 지수</h3>
              <p className="chart-desc">다양한 업종이 균형있게 분포할수록 주민 편의 향상</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={diversityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                  />
                  <Legend />
                  <Bar dataKey="다양성지수" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="상권활성화" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedTab === 'infrastructure' && (
          <div className="infrastructure-section">
            <div className="infra-header">
              <h3>🏥 생활 인프라 부족 현황</h3>
              <p>주민 편의시설이 부족한 지역을 파악하여 균형 발전을 도모합니다</p>
            </div>

            <div className="infra-grid">
              {infrastructureNeeds.map((need, index) => (
                <div key={index} className="infra-card">
                  <div className="infra-header-row">
                    <span className="infra-icon">{need.icon}</span>
                    <div className="infra-info">
                      <h4>{need.category}</h4>
                      <span className="shortage-badge" style={{
                        background: need.shortage > 60 ? '#ef4444' : need.shortage > 40 ? '#f59e0b' : '#10b981'
                      }}>
                        부족도 {need.shortage}%
                      </span>
                    </div>
                  </div>
                  <div className="shortage-bar">
                    <div 
                      className="shortage-fill"
                      style={{ 
                        width: `${need.shortage}%`,
                        background: need.shortage > 60 ? '#ef4444' : need.shortage > 40 ? '#f59e0b' : '#10b981'
                      }}
                    />
                  </div>
                  <div className="affected-districts">
                    <span className="label">부족 지역:</span>
                    <div className="district-tags">
                      {need.districts.slice(0, 5).map(d => (
                        <span key={d} className="district-tag">{d}</span>
                      ))}
                      {need.districts.length > 5 && (
                        <span className="district-tag more">+{need.districts.length - 5}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="infra-recommendation">
              <h4>💡 정책 제언</h4>
              <ul>
                <li><strong>의료 인프라</strong>: 읍면 지역 약국·의원 유치 인센티브 필요</li>
                <li><strong>교육 시설</strong>: 신규 생활권 학원가 형성 지원</li>
                <li><strong>생활서비스</strong>: 고공실률 지역 서비스업 임대료 지원 검토</li>
                <li><strong>운동시설</strong>: 공공체육시설 확충 또는 민간 유치</li>
              </ul>
            </div>
          </div>
        )}

        {selectedTab === 'priority' && (
          <div className="priority-section">
            <div className="priority-header">
              <h3>🎯 정책 개입 우선순위</h3>
              <p>공실률, 인구, 인프라, 안전 등을 종합 고려한 우선순위</p>
            </div>

            <div className="priority-list">
              {priorityAnalysis.map((item, index) => (
                <div key={item.district.name} className="priority-item">
                  <div className="priority-rank" style={{
                    background: index < 3 ? '#ef4444' : index < 6 ? '#f59e0b' : '#3b82f6'
                  }}>
                    {index + 1}
                  </div>
                  <div className="priority-info">
                    <div className="priority-main">
                      <h4>{item.district.name}</h4>
                      <span className="living-area">{item.district.livingArea}</span>
                    </div>
                    <div className="priority-stats">
                      <span>공실률 {item.district.vacancyRate}%</span>
                      <span>인구 {item.district.population.toLocaleString()}명</span>
                      <span>상권활성화 {item.district.marketActivationIndex}점</span>
                    </div>
                    <div className="priority-reasons">
                      {item.reasons.map((reason, i) => (
                        <span key={i} className="reason-tag">{reason}</span>
                      ))}
                    </div>
                  </div>
                  <div className="priority-score">
                    <span className="score-value">{item.score}</span>
                    <span className="score-label">우선순위 점수</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'simulation' && (
          <div className="simulation-section">
            <div className="simulation-header">
              <h3>🔮 지역별 공실 해소 시뮬레이션</h3>
              <p>특정 지역의 공실률 감소 효과를 시뮬레이션합니다</p>
            </div>

            <div className="simulation-controls">
              <div className="control-group">
                <label>📍 지역 선택</label>
                <select 
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  {districts.map(d => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.livingArea}) - 현재 공실률 {d.vacancyRate}%
                    </option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>📉 목표 공실률 감소</label>
                <div className="slider-control">
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={simulationTarget}
                    onChange={(e) => setSimulationTarget(Number(e.target.value))}
                  />
                  <span>{simulationTarget}%p 감소</span>
                </div>
              </div>
            </div>

            {districtImpact && selectedDistrictData && (
              <div className="simulation-result">
                <div className="result-header">
                  <h4>{selectedDistrictData.name} 시뮬레이션 결과</h4>
                  <div className="vacancy-change">
                    <span className="before">{districtImpact.currentVacancy}%</span>
                    <span className="arrow">→</span>
                    <span className="after">{districtImpact.targetVacancy}%</span>
                  </div>
                </div>

                <div className="result-grid">
                  <div className="result-card">
                    <span className="result-icon">💰</span>
                    <span className="result-value">{districtImpact.economicEffect}억원</span>
                    <span className="result-label">경제적 효과</span>
                  </div>
                  <div className="result-card">
                    <span className="result-icon">👥</span>
                    <span className="result-value">{districtImpact.jobCreation}명</span>
                    <span className="result-label">일자리 창출</span>
                  </div>
                  <div className="result-card">
                    <span className="result-icon">🛡️</span>
                    <span className="result-value">+{districtImpact.safetyImprovement}%</span>
                    <span className="result-label">안전 개선</span>
                  </div>
                  <div className="result-card">
                    <span className="result-icon">🌈</span>
                    <span className="result-value">{districtImpact.diversityIndex}점</span>
                    <span className="result-label">다양성 지수</span>
                  </div>
                </div>

                <div className="radar-section">
                  <h4>📊 지역 종합 분석</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
                      <Radar
                        name={selectedDistrictData.name}
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="action-recommendations">
                  <h4>📋 권장 조치</h4>
                  <div className="action-list">
                    {selectedDistrictData.vacancyRate > 25 && (
                      <div className="action-item urgent">
                        <span className="action-badge">긴급</span>
                        <p>임대료 지원 또는 세금 감면을 통한 신규 입점 유도</p>
                      </div>
                    )}
                    {selectedDistrictData.marketActivationIndex < 50 && (
                      <div className="action-item high">
                        <span className="action-badge">중요</span>
                        <p>상권 활성화 이벤트 및 마케팅 지원</p>
                      </div>
                    )}
                    {selectedDistrictData.safetyIndex < 0.7 && (
                      <div className="action-item medium">
                        <span className="action-badge">권장</span>
                        <p>가로등, CCTV 확충으로 야간 환경 개선</p>
                      </div>
                    )}
                    <div className="action-item normal">
                      <span className="action-badge">일반</span>
                      <p>지역 특화 업종 발굴 및 창업 교육 지원</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityDashboard

