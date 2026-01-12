import { useState } from 'react'
import PopulationChart from './PopulationChart'
import TransportationMap from './TransportationMap'
import CardSalesChart from './CardSalesChart'
import AgeGroupChart from './AgeGroupChart'
import './Dashboard.css'

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'population' | 'transportation' | 'sales'>('population')

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>세종시 데이터 대시보드</h1>
        <p>인구, 교통, 소비 데이터 분석</p>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'population' ? 'active' : ''}
          onClick={() => setActiveTab('population')}
        >
          인구 현황
        </button>
        <button 
          className={activeTab === 'transportation' ? 'active' : ''}
          onClick={() => setActiveTab('transportation')}
        >
          교통 현황
        </button>
        <button 
          className={activeTab === 'sales' ? 'active' : ''}
          onClick={() => setActiveTab('sales')}
        >
          카드매출 현황
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'population' && (
          <div className="tab-content">
            <PopulationChart />
            <AgeGroupChart />
          </div>
        )}
        {activeTab === 'transportation' && (
          <div className="tab-content">
            <TransportationMap />
          </div>
        )}
        {activeTab === 'sales' && (
          <div className="tab-content">
            <CardSalesChart />
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard

