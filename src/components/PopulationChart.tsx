import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { parseCSV, parseNumber, PopulationData } from '../utils/csvParser'
import './Chart.css'

function PopulationChart() {
  const [data, setData] = useState<PopulationData[]>([])

  useEffect(() => {
    async function loadData() {
      const csvData = await parseCSV<PopulationData>('/2022~2024 세종시 인구.csv')
      
      const processed = csvData
        .filter(row => row.시점 && row.시점 !== '합계' && row.시점.length === 6)
        .map(row => ({
          시점: row.시점,
          총인구: parseNumber(String(row.총인구)),
          남자인구: parseNumber(String(row.남자인구)),
          여자인구: parseNumber(String(row.여자인구)),
          세대수: parseNumber(String(row.세대수)),
          '65세이상 고령자인구': parseNumber(String(row['65세이상 고령자인구'] || 0))
        }))
        .filter(row => row.총인구 > 0)
        .sort((a, b) => a.시점.localeCompare(b.시점))
        .slice(-12) // 최근 12개월

      setData(processed)
    }
    loadData()
  }, [])

  const chartData = data.map(item => ({
    날짜: `${item.시점.substring(0, 4)}-${item.시점.substring(4)}`,
    총인구: item.총인구,
    남자: item.남자인구,
    여자: item.여자인구,
    고령자: item['65세이상 고령자인구']
  }))

  return (
    <div className="chart-container">
      <h2>세종시 인구 추이 (최근 12개월)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="날짜" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => value.toLocaleString() + '명'}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="총인구" 
            stroke="#667eea" 
            strokeWidth={2}
            name="총인구"
          />
          <Line 
            type="monotone" 
            dataKey="남자" 
            stroke="#48bb78" 
            strokeWidth={2}
            name="남자"
          />
          <Line 
            type="monotone" 
            dataKey="여자" 
            stroke="#ed64a6" 
            strokeWidth={2}
            name="여자"
          />
          <Line 
            type="monotone" 
            dataKey="고령자" 
            stroke="#f56565" 
            strokeWidth={2}
            name="65세 이상"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PopulationChart

