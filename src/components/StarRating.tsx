import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumber?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showNumber = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    const isFilled = i <= rating;
    const isHalfFilled = i === Math.ceil(rating) && rating % 1 !== 0;
    
    stars.push(
      <Star
        key={i}
        className={`
          ${sizeClasses[size]}
          ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}
          ${isHalfFilled ? 'text-yellow-400' : ''}
        `}
        onClick={() => handleStarClick(i)}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600 mr-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};





