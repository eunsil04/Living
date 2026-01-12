import Papa from 'papaparse'

export interface PopulationData {
  시점: string
  총인구: number
  남자인구: number
  여자인구: number
  세대수: number
  '65세이상 고령자인구': number
}

export interface AgeGroupData {
  지역: string
  월: string
  총인구: number
  남자총인구: number
  여자총인구: number
  [key: string]: string | number
}

export interface TransportationData {
  대여소ID: string
  대여소명: string
  운영여부: string
  행정동: string
  주소: string
  위도: number
  경도: number
  거치대수: number
}

export interface BRTSData {
  노선명: string
  정류장ID: string
  정류장명: string
  행정동: string
  위도: number
  경도: number
  순번: number
}

export interface CardSalesData {
  기준일자: string
  행정동코드: string
  행정동명: string
  카드매출금액: number
  비율: number
  증감률: number
}

export async function parseCSV<T>(filePath: string): Promise<T[]> {
  try {
    const response = await fetch(filePath)
    const text = await response.text()
    
    return new Promise((resolve, reject) => {
      Papa.parse<T>(text, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        complete: (results) => {
          resolve(results.data)
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  } catch (error) {
    console.error(`Error parsing CSV ${filePath}:`, error)
    return []
  }
}

export function parseNumber(value: string): number {
  if (!value || value === '-' || value === '') return 0
  const cleaned = value.replace(/,/g, '').trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

