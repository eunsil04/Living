import { useState, useMemo, useEffect } from 'react'
import HomePage from './HomePage'
import ResultMap from './ResultMap'
import DetailAnalysis from './DetailAnalysis'
import PolicySupport from './PolicySupport'
import { BusinessType, DistrictData } from '../types'
import { sejongDistricts } from '../data/districts'
import { calculateRecommendations } from '../utils/recommendation'
import './Platform.css'

type FlowStep = 'home' | 'result' | 'detail' | 'policy'

function Platform() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('home')
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)

  // 화면 전환 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [currentStep])

  const recommendations = useMemo(() => {
    if (!selectedBusiness) return []
    return calculateRecommendations(sejongDistricts, selectedBusiness)
  }, [selectedBusiness])

  const selectedRecommendation = useMemo(() => {
    if (!selectedDistrict) return null
    return recommendations.find(r => r.district.name === selectedDistrict.name)
  }, [selectedDistrict, recommendations])

  // 홈에서 업종 선택 후 시작
  const handleStart = (business: BusinessType) => {
    setSelectedBusiness(business)
    setCurrentStep('result')
  }

  // 결과 맵에서 후보지 선택
  const handleSelectCandidate = (district: DistrictData) => {
    setSelectedDistrict(district)
    setCurrentStep('detail')
  }

  // 상세 분석에서 정책 페이지로
  const handleGoToPolicy = () => {
    setCurrentStep('policy')
  }

  // 결과 맵으로 돌아가기
  const handleBackToResult = () => {
    setCurrentStep('result')
  }

  // 상세 분석으로 돌아가기
  const handleBackToDetail = () => {
    setCurrentStep('detail')
  }

  // 홈으로 돌아가기
  const handleGoHome = () => {
    setCurrentStep('home')
    setSelectedBusiness(null)
    setSelectedDistrict(null)
  }

  return (
    <div className="platform">
      {currentStep === 'home' && (
        <HomePage onStart={handleStart} />
      )}
      
      {currentStep === 'result' && selectedBusiness && (
        <ResultMap
          businessType={selectedBusiness}
          recommendations={recommendations}
          onSelectCandidate={handleSelectCandidate}
          onBack={handleGoHome}
        />
      )}
      
      {currentStep === 'detail' && selectedBusiness && selectedDistrict && selectedRecommendation && (
        <DetailAnalysis
          district={selectedDistrict}
          businessType={selectedBusiness}
          recommendation={selectedRecommendation}
          recommendations={recommendations}
          onBack={handleBackToResult}
          onGoToPolicy={handleGoToPolicy}
        />
      )}
      
      {currentStep === 'policy' && selectedBusiness && selectedDistrict && (
        <PolicySupport
          district={selectedDistrict}
          businessType={selectedBusiness}
          onBack={handleBackToDetail}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  )
}

export default Platform
