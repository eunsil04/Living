// Ollama AI 서비스
// Ollama가 로컬에서 실행 중이어야 합니다 (http://localhost:11434)

const OLLAMA_BASE_URL = 'http://localhost:11434'

export interface OllamaResponse {
  model: string
  response: string
  done: boolean
}

export interface AnalysisData {
  districtName: string
  businessType: string
  population: number
  cardSales: number
  vacancyRate: number
  avgRent: number
  age2030Ratio: number
  competitorCount: number
  score: number
}

// Ollama 연결 상태 확인
export async function checkOllamaConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
    })
    return response.ok
  } catch {
    return false
  }
}

// AI 분석 코멘트 생성
export async function generateAnalysisComment(data: AnalysisData): Promise<string> {
  const prompt = `당신은 세종시 상권 분석 전문가 AI입니다. 다음 데이터를 기반으로 창업 입지 분석 코멘트를 2-3문장으로 간결하게 작성해주세요.

지역: ${data.districtName}
업종: ${data.businessType}
일일 유동인구: ${data.population.toLocaleString()}명
월 카드매출: ${(data.cardSales / 100000000).toFixed(1)}억원
공실률: ${data.vacancyRate}%
1층 평균 임대료: ${data.avgRent}만원/평
20-30대 비율: ${data.age2030Ratio}%
경쟁 점포 수: ${data.competitorCount}개
입지 점수: ${data.score}점 (100점 만점)

위 데이터를 종합하여 이 지역에서 ${data.businessType} 창업의 장단점과 추천 여부를 분석해주세요. 한국어로 답변하세요.`

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',  // 또는 'mistral', 'gemma2' 등 설치된 모델
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 300,
        }
      }),
    })

    if (!response.ok) {
      throw new Error('Ollama API 요청 실패')
    }

    const result: OllamaResponse = await response.json()
    return result.response.trim()
  } catch (error) {
    console.error('Ollama 연결 오류:', error)
    throw error
  }
}

// 정책 추천 생성
export async function generatePolicyRecommendation(
  districtName: string, 
  businessType: string,
  userAge?: number
): Promise<string> {
  const prompt = `당신은 세종시 창업 지원 정책 전문가 AI입니다.

지역: ${districtName}
업종: ${businessType}
${userAge ? `창업자 나이: ${userAge}세` : ''}

위 조건에 맞는 세종시 창업 지원 정책을 2-3개 추천하고, 각각 왜 적합한지 간단히 설명해주세요. 한국어로 답변하세요.`

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 400,
        }
      }),
    })

    if (!response.ok) {
      throw new Error('Ollama API 요청 실패')
    }

    const result: OllamaResponse = await response.json()
    return result.response.trim()
  } catch (error) {
    console.error('Ollama 연결 오류:', error)
    throw error
  }
}

// 경쟁 분석 생성
export async function generateCompetitionAnalysis(
  districtName: string,
  businessType: string,
  competitorCount: number,
  majorBrands: string[]
): Promise<string> {
  const prompt = `당신은 상권 경쟁 분석 전문가 AI입니다.

지역: ${districtName}
업종: ${businessType}
경쟁 점포 수: ${competitorCount}개
주요 브랜드: ${majorBrands.join(', ')}

이 지역의 경쟁 상황을 분석하고, 신규 창업자에게 차별화 전략을 2-3가지 제안해주세요. 한국어로 답변하세요.`

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 350,
        }
      }),
    })

    if (!response.ok) {
      throw new Error('Ollama API 요청 실패')
    }

    const result: OllamaResponse = await response.json()
    return result.response.trim()
  } catch (error) {
    console.error('Ollama 연결 오류:', error)
    throw error
  }
}

