import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { parseCSV, parseNumber } from '../utils/csvParser'
import './Chart.css'

function CardSalesChart() {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [districtData, setDistrictData] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const csvData = await parseCSV<any>('/세종특별자치시_카드매출_행정동별 카드소비 현황_20250531.csv')
      
      // 월별 데이터 처리
      const monthlyMap = new Map<string, number>()
      csvData.forEach((row: any) => {
        const date = row.기준일자 || row['기준일자']
        if (date) {
          const month = date.substring(0, 7) // YYYY-MM 형식
          const amount = parseNumber(String(row.카드매출금액 || row['카드매출금액'] || 0))
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + amount)
        }
      })

      const monthly = Array.from(monthlyMap.entries())
        .map(([month, amount]) => ({
          월: month,
          매출액: amount / 1000000000 // 십억원 단위
        }))
        .sort((a, b) => a.월.localeCompare(b.월))

      // 행정동별 데이터 처리 (최신 월 기준)
      const latestMonth = monthly[monthly.length - 1]?.월
      if (latestMonth) {
        const districtMap = new Map<string, number>()
        csvData.forEach((row: any) => {
          const date = row.기준일자 || row['기준일자']
          const district = row.행정동명 || row['행정동명']
          if (date && date.startsWith(latestMonth) && district) {
            const amount = parseNumber(String(row.카드매출금액 || row['카드매출금액'] || 0))
            districtMap.set(district, (districtMap.get(district) || 0) + amount)
          }
        })

        const districts = Array.from(districtMap.entries())
          .map(([name, amount]) => ({
            행정동: name,
            매출액: amount / 1000000000 // 십억원 단위
          }))
          .sort((a, b) => b.매출액 - a.매출액)
          .slice(0, 10) // 상위 10개

        setDistrictData(districts)
      }

      setMonthlyData(monthly)
    }
    loadData()
  }, [])

  return (
    <div className="chart-container">
      <h2>카드매출 현황</h2>
      
      {monthlyData.length > 0 && (
        <div className="chart-section">
          <h3>월별 카드매출 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="월" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}십억원`}
              />
              <Legend />
              <Bar dataKey="매출액" fill="#667eea" name="매출액 (십억원)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {districtData.length > 0 && (
        <div className="chart-section">
          <h3>행정동별 카드매출 (상위 10개)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={districtData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="행정동" type="category" width={100} />
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(1)}십억원`}
              />
              <Legend />
              <Bar dataKey="매출액" fill="#48bb78" name="매출액 (십억원)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default CardSalesChart

