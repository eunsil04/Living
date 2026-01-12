import { useState } from 'react'
import { VacancyListing, getListingsByDistrict, getNaverRealEstateSearchUrl, getZigbangSearchUrl, getDabangSearchUrl } from '../data/vacancyListings'
import './VacancyListingsModal.css'

interface VacancyListingsModalProps {
  districtName: string
  onClose: () => void
}

function VacancyListingsModal({ districtName, onClose }: VacancyListingsModalProps) {
  const [filter, setFilter] = useState<'all' | '상가' | '점포' | '사무실'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'rent' | 'size'>('recent')

  const listings = getListingsByDistrict(districtName)
  
  // 필터링
  const filteredListings = filter === 'all' 
    ? listings 
    : listings.filter(l => l.type === filter)

  // 정렬
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    if (sortBy === 'rent') return a.rent - b.rent
    if (sortBy === 'size') return b.size - a.size
    return 0
  })

  const formatPrice = (price: number) => {
    if (price >= 10000) return `${(price / 10000).toFixed(1)}억`
    return `${price.toLocaleString()}만원`
  }

  return (
    <div className="vacancy-modal-overlay" onClick={onClose}>
      <div className="vacancy-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-info">
            <h2>🏢 {districtName} 공실 매물</h2>
            <p className="listing-count">현재 <strong>{listings.length}개</strong> 매물이 있습니다</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 필터 & 정렬 */}
        <div className="modal-controls">
          <div className="filter-group">
            <span className="control-label">유형</span>
            <div className="filter-buttons">
              {(['all', '상가', '점포', '사무실'] as const).map(type => (
                <button
                  key={type}
                  className={`filter-btn ${filter === type ? 'active' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {type === 'all' ? '전체' : type}
                </button>
              ))}
            </div>
          </div>
          <div className="sort-group">
            <span className="control-label">정렬</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="recent">최신순</option>
              <option value="rent">월세 낮은순</option>
              <option value="size">면적 큰순</option>
            </select>
          </div>
        </div>

        {/* 외부 플랫폼 연결 */}
        <div className="platform-links">
          <p>🔗 더 많은 매물은 부동산 플랫폼에서 확인하세요</p>
          <div className="link-buttons">
            <a 
              href={getNaverRealEstateSearchUrl(districtName)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="platform-link naver"
            >
              <span>🟢</span> 네이버 부동산
            </a>
            <a 
              href={getZigbangSearchUrl(districtName)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="platform-link zigbang"
            >
              <span>🟠</span> 직방
            </a>
            <a 
              href={getDabangSearchUrl(districtName)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="platform-link dabang"
            >
              <span>🔵</span> 다방
            </a>
          </div>
        </div>

        {/* 매물 목록 */}
        <div className="listings-container">
          {sortedListings.length > 0 ? (
            <div className="listings-grid">
              {sortedListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} formatPrice={formatPrice} />
              ))}
            </div>
          ) : (
            <div className="no-listings">
              <span className="no-icon">📭</span>
              <p>해당 조건의 매물이 없습니다</p>
              <button className="reset-filter" onClick={() => setFilter('all')}>
                전체 매물 보기
              </button>
            </div>
          )}
        </div>

        {/* 실시간 알림 안내 */}
        <div className="realtime-notice">
          <span className="notice-icon">⏰</span>
          <div className="notice-content">
            <strong>실시간 매물 알림 받기</strong>
            <p>새로운 공실 매물이 등록되면 알림을 받아보세요</p>
          </div>
          <button className="notify-btn">알림 설정</button>
        </div>
      </div>
    </div>
  )
}

// 개별 매물 카드 컴포넌트
function ListingCard({ listing, formatPrice }: { listing: VacancyListing, formatPrice: (n: number) => string }) {
  const [expanded, setExpanded] = useState(false)

  const getTypeColor = (type: string) => {
    switch (type) {
      case '상가': return '#3b82f6'
      case '점포': return '#10b981'
      case '사무실': return '#8b5cf6'
      case '오피스텔상가': return '#f59e0b'
      default: return '#64748b'
    }
  }

  return (
    <div className={`listing-card ${expanded ? 'expanded' : ''}`}>
      <div className="card-header">
        <span className="listing-type" style={{ background: getTypeColor(listing.type) }}>
          {listing.type}
        </span>
        <span className="listing-date">{listing.updatedAt}</span>
      </div>

      <div className="card-content">
        <h3 className="listing-address">{listing.address}</h3>
        
        <div className="listing-specs">
          <div className="spec">
            <span className="spec-icon">📐</span>
            <span className="spec-value">{listing.size}평</span>
          </div>
          <div className="spec">
            <span className="spec-icon">🏢</span>
            <span className="spec-value">{listing.floor}</span>
          </div>
          <div className="spec">
            <span className="spec-icon">📅</span>
            <span className="spec-value">{listing.availableDate}</span>
          </div>
        </div>

        <div className="listing-price">
          <div className="price-item deposit">
            <span className="price-label">보증금</span>
            <span className="price-value">{formatPrice(listing.deposit)}</span>
          </div>
          <div className="price-divider">/</div>
          <div className="price-item rent">
            <span className="price-label">월세</span>
            <span className="price-value">{formatPrice(listing.rent)}</span>
          </div>
        </div>

        <div className="listing-features">
          {listing.features.map((feature, idx) => (
            <span key={idx} className="feature-tag">{feature}</span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="card-expanded">
          <div className="contact-info">
            <span className="contact-icon">📞</span>
            <span className="contact-number">{listing.contact}</span>
          </div>
          <div className="action-buttons">
            <a 
              href={`tel:${listing.contact.replace(/-/g, '')}`}
              className="action-btn call"
            >
              전화 문의
            </a>
            <a 
              href={getNaverRealEstateSearchUrl(listing.district, listing.type)}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn view"
            >
              상세 보기
            </a>
          </div>
        </div>
      )}

      <button 
        className="expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '접기 ▲' : '상세보기 ▼'}
      </button>
    </div>
  )
}

export default VacancyListingsModal

