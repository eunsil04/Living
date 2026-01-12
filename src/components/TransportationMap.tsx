import { useEffect, useState } from 'react'
import { parseCSV, TransportationData, BRTSData } from '../utils/csvParser'
import './Chart.css'

function TransportationMap() {
  const [bikeStations, setBikeStations] = useState<TransportationData[]>([])
  const [brtStations, setBrtStations] = useState<BRTSData[]>([])

  useEffect(() => {
    async function loadData() {
      const bikeData = await parseCSV<TransportationData>('/세종도시교통공사_공공자전거(어울링)_대여소현황_20250106.csv')
      const brtData = await parseCSV<BRTSData>('/세종특별자치시_BRT노선별 정류장 현황_20250717.csv')
      
      const processedBike = bikeData
        .filter(row => row.운영여부 === 'Y' && row.위도 && row.경도)
        .map(row => ({
          ...row,
          위도: parseFloat(String(row.위도)),
          경도: parseFloat(String(row.경도)),
          거치대수: parseInt(String(row.거치대수 || 0))
        }))
        .slice(0, 50) // 처음 50개만 표시

      const processedBRT = brtData
        .filter(row => row.위도 && row.경도)
        .map(row => ({
          ...row,
          위도: parseFloat(String(row.위도)),
          경도: parseFloat(String(row.경도)),
          순번: parseInt(String(row.순번 || 0))
        }))

      setBikeStations(processedBike)
      setBrtStations(processedBRT)
    }
    loadData()
  }, [])

  const totalBikeStations = bikeStations.length
  const totalBRTStations = brtStations.length
  const uniqueBRTRoutes = new Set(brtStations.map(s => s.노선명)).size

  return (
    <div className="chart-container">
      <h2>교통 인프라 현황</h2>
      
      <div className="transport-stats">
        <div className="stat-card">
          <h3>공공자전거 대여소</h3>
          <p className="stat-number">{totalBikeStations}</p>
          <p className="stat-label">개소</p>
        </div>
        <div className="stat-card">
          <h3>BRT 정류장</h3>
          <p className="stat-number">{totalBRTStations}</p>
          <p className="stat-label">개소</p>
        </div>
        <div className="stat-card">
          <h3>BRT 노선</h3>
          <p className="stat-number">{uniqueBRTRoutes}</p>
          <p className="stat-label">개 노선</p>
        </div>
      </div>

      <div className="transport-list">
        <div className="list-section">
          <h3>주요 자전거 대여소 (상위 10개)</h3>
          <ul>
            {bikeStations.slice(0, 10).map((station, idx) => (
              <li key={idx}>
                <strong>{station.대여소명}</strong> - {station.행정동} 
                {station.거치대수 > 0 && ` (거치대: ${station.거치대수}개)`}
              </li>
            ))}
          </ul>
        </div>

        <div className="list-section">
          <h3>BRT 노선별 정류장 수</h3>
          <ul>
            {Array.from(new Set(brtStations.map(s => s.노선명))).map(route => {
              const count = brtStations.filter(s => s.노선명 === route).length
              return (
                <li key={route}>
                  <strong>{route}</strong>: {count}개 정류장
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TransportationMap

