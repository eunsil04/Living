import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { parseCSV } from '../utils/csvParser'
import './Chart.css'

interface AgeGroupData {
  지역: string
  [key: string]: string | number
}

function AgeGroupChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const csvData = await parseCSV<AgeGroupData>('/202501_202506_연령별인구현황_월간.csv')
      
      if (csvData.length > 0) {
        const firstRow = csvData[0]
        const ageGroups = ['0~9세', '10~19세', '20~29세', '30~39세', '40~49세', '50~59세', '60~69세', '70~79세', '80~89세', '90~99세']
        
        const processed = ageGroups.map(age => {
          const key = `2025년01월_전체인구_${age}`
          const value = firstRow[key] ? parseFloat(String(firstRow[key]).replace(/,/g, '')) : 0
          return {
            연령대: age,
            인구수: value
          }
        }).filter(item => item.인구수 > 0)

        setData(processed)
      }
    }
    loadData()
  }, [])

  return (
    <div className="chart-container">
      <h2>연령대별 인구 분포 (2025년 1월)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="연령대" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => value.toLocaleString() + '명'}
          />
          <Legend />
          <Bar 
            dataKey="인구수" 
            fill="#667eea"
            name="인구수"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AgeGroupChart

