import React from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ rating = 0, count = 0, size = 14, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
      <div className="stars-row">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`f-${i}`} size={size} className="star-filled" fill="currentColor" />
        ))}
        {hasHalf && (
          <div className="star-half-wrap" style={{ width: size, height: size }}>
            <Star size={size} className="star-empty" />
            <div className="star-half-clip" style={{ width: size / 2 }}>
              <Star size={size} className="star-filled" fill="currentColor" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="star-empty" />
        ))}
      </div>
      {showCount && (
        <span className="star-count">
          <span className="star-value">{rating}</span>
          {count > 0 && <span className="star-reviews">({count})</span>}
        </span>
      )}
    </div>
  );
};

export default StarRating;
