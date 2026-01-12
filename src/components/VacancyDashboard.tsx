import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { DistrictData } from '../types'
import { getVacancyRiskLevel, overallVacancyStats, calculateOptimalArea } from '../data/vacancyData'
import './VacancyDashboard.css'

interface VacancyDashboardProps {
  districts: DistrictData[]
  onClose: () => void
}

function VacancyDashboard({ districts, onClose }: VacancyDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'calculator' | 'prediction'>('overview')
  
  // 계산기 상태
  const [plotArea, setPlotArea] = useState(1000)
  const [maxFAR, setMaxFAR] = useState(200)
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0].name)

  const selectedDistrictData = districts.find(d => d.name === selectedDistrict)
  const optimalArea = selectedDistrictData 
    ? calculateOptimalArea(plotArea, maxFAR, selectedDistrictData.vacancyRate)
    : 0

  // 차트 데이터 준비
  const vacancyChartData = districts
    .filter(d => d.livingArea.includes('생활권'))
    .sort((a, b) => a.vacancyRate - b.vacancyRate)
    .map(d => ({
      name: d.name,
      공실률: d.vacancyRate,
      예측공실률: d.predictedVacancy2025,
      상권활성화: d.marketActivationIndex
    }))

  const vacancyTypeData = [
    { name: '주거단지상가', 세종시: overallVacancyStats.residential.sejongAvg, 전국평균: overallVacancyStats.residential.nationalAvg },
    { name: '집합상가', 세종시: overallVacancyStats.collective.sejongAvg, 전국평균: overallVacancyStats.collective.nationalAvg },
    { name: '오피스텔', 세종시: overallVacancyStats.officetel.sejongAvg, 전국평균: overallVacancyStats.officetel.nationalAvg }
  ]

  const predictionData = districts
    .filter(d => d.livingArea.includes('생활권'))
    .map(d => ({
      name: d.name,
      현재: d.vacancyRate,
      '2025예측': d.predictedVacancy2025,
      변화: d.vacancyRate - d.predictedVacancy2025
    }))

  const riskDistribution = [
    { name: '양호', value: districts.filter(d => d.vacancyRate < 10).length, color: '#10b981' },
    { name: '주의', value: districts.filter(d => d.vacancyRate >= 10 && d.vacancyRate < 20).length, color: '#f59e0b' },
    { name: '경고', value: districts.filter(d => d.vacancyRate >= 20 && d.vacancyRate < 30).length, color: '#f97316' },
    { name: '위험', value: districts.filter(d => d.vacancyRate >= 30).length, color: '#ef4444' }
  ]

  return (
    <div className="vacancy-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <span className="title-icon">📊</span>
          <div>
            <h2>세종시 상가 공실률 분석</h2>
            <p>2024 월드 스마트시티 엑스포 분석 데이터 기반</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📈 현황 분석
        </button>
        <button 
          className={`tab ${selectedTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setSelectedTab('calculator')}
        >
          🧮 적정면적 계산
        </button>
        <button 
          className={`tab ${selectedTab === 'prediction' ? 'active' : ''}`}
          onClick={() => setSelectedTab('prediction')}
        >
          🔮 2025 예측
        </button>
      </div>

      <div className="dashboard-content">
        {selectedTab === 'overview' && (
          <div className="overview-section">
            {/* 요약 카드 */}
            <div className="summary-cards">
              <div className="summary-card warning">
                <span className="card-icon">⚠️</span>
                <div className="card-content">
                  <span className="card-value">14.4%</span>
                  <span className="card-label">세종시 평균 공실률</span>
                  <span className="card-compare">전국 평균 6.9% 대비 2배↑</span>
                </div>
              </div>
              <div className="summary-card danger">
                <span className="card-icon">🏪</span>
                <div className="card-content">
                  <span className="card-value">25.7%</span>
                  <span className="card-label">집합상가 공실률</span>
                  <span className="card-compare">전국 1위</span>
                </div>
              </div>
              <div className="summary-card info">
                <span className="card-icon">📉</span>
                <div className="card-content">
                  <span className="card-value">-1.2%p</span>
                  <span className="card-label">예측 변화량</span>
                  <span className="card-compare">2025년 소폭 감소 전망</span>
                </div>
              </div>
            </div>

            {/* 세종시 vs 전국 비교 */}
            <div className="chart-section">
              <h3>📊 상가 유형별 공실률 비교 (세종 vs 전국)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={vacancyTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" unit="%" />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                  <Bar dataKey="세종시" fill="#f59e0b" />
                  <Bar dataKey="전국평균" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 생활권별 공실률 */}
            <div className="chart-section">
              <h3>🏘️ 생활권별 공실률 현황</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vacancyChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" unit="%" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Bar dataKey="공실률" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 위험도 분포 */}
            <div className="chart-section half">
              <h3>🎯 공실 위험도 분포</h3>
              <div className="pie-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}개`}
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="risk-legend">
                  {riskDistribution.map(item => (
                    <div key={item.name} className="risk-item">
                      <span className="risk-color" style={{ background: item.color }}></span>
                      <span>{item.name} ({item.value}개)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'calculator' && (
          <div className="calculator-section">
            <div className="formula-card">
              <h3>📐 적정 상가 면적 산출식</h3>
              <div className="formula">
                적정 상가 면적(m²) = 획지 면적 × (최대 허용 용적률/100) × ((100 - 공실률)/100)
              </div>
            </div>

            <div className="calculator-grid">
              <div className="input-group">
                <label>📍 지역 선택</label>
                <select 
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  {districts.map(d => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.livingArea}) - 공실률 {d.vacancyRate}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>📐 획지 면적 (m²)</label>
                <input 
                  type="number"
                  value={plotArea}
                  onChange={(e) => setPlotArea(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label>🏢 최대 허용 용적률 (%)</label>
                <input 
                  type="number"
                  value={maxFAR}
                  onChange={(e) => setMaxFAR(Number(e.target.value))}
                />
              </div>
            </div>

            {selectedDistrictData && (
              <div className="result-card">
                <div className="result-header">
                  <h4>{selectedDistrictData.name} 계산 결과</h4>
                  <span 
                    className="risk-badge"
                    style={{ background: getVacancyRiskLevel(selectedDistrictData.vacancyRate).color }}
                  >
                    {getVacancyRiskLevel(selectedDistrictData.vacancyRate).level}
                  </span>
                </div>

                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-label">현재 공실률</span>
                    <span className="result-value">{selectedDistrictData.vacancyRate}%</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">계획 최대 연면적</span>
                    <span className="result-value">{(plotArea * maxFAR / 100).toLocaleString()} m²</span>
                  </div>
                  <div className="result-item highlight">
                    <span className="result-label">적정 상가 연면적</span>
                    <span className="result-value">{Math.round(optimalArea).toLocaleString()} m²</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">과공급 예상 면적</span>
                    <span className="result-value warning">
                      +{Math.round(plotArea * maxFAR / 100 - optimalArea).toLocaleString()} m²
                    </span>
                  </div>
                </div>

                <p className="result-note">
                  💡 {selectedDistrictData.name}의 현재 공실률({selectedDistrictData.vacancyRate}%)을 고려할 때,
                  계획 대비 약 <strong>{Math.round((1 - optimalArea / (plotArea * maxFAR / 100)) * 100)}%</strong>의 
                  상가 면적 조정이 권장됩니다.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'prediction' && (
          <div className="prediction-section">
            <div className="prediction-summary">
              <div className="prediction-card">
                <span className="pred-icon">📈</span>
                <div>
                  <h4>2025년 공실률 전망</h4>
                  <p>머신러닝 기반 시계열 분석 결과, 세종시 평균 공실률은 <strong>소폭 감소</strong>할 것으로 예측됩니다.</p>
                </div>
              </div>
            </div>

            <div className="chart-section">
              <h3>📉 현재 vs 2025년 예측 공실률</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#94a3b8" unit="%" />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155' }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="현재" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="2025예측" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="prediction-factors">
              <h3>🔍 공실률 영향 요인 분석</h3>
              <div className="factor-grid">
                <div className="factor-card positive">
                  <span className="factor-icon">👥</span>
                  <h4>인구 증가</h4>
                  <p>신규 생활권 입주로 소비 인구 확대</p>
                </div>
                <div className="factor-card positive">
                  <span className="factor-icon">🚌</span>
                  <h4>교통 개선</h4>
                  <p>BRT 노선 확충으로 접근성 향상</p>
                </div>
                <div className="factor-card negative">
                  <span className="factor-icon">🏗️</span>
                  <h4>신규 공급</h4>
                  <p>6-2생활권 등 신규 상가 공급 예정</p>
                </div>
                <div className="factor-card negative">
                  <span className="factor-icon">💻</span>
                  <h4>온라인 쇼핑</h4>
                  <p>전자상거래 성장으로 오프라인 수요 감소</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VacancyDashboard

