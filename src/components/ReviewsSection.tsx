import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ReviewImage, getActiveReviewImages } from '@/services/reviewImageService';

export const ReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);

  // Load review images from Firebase
  useEffect(() => {
    const loadReviewImages = async () => {
      try {
        const activeReviews = await getActiveReviewImages();
        setReviewImages(activeReviews);
      } catch (error) {
        console.error('Error loading review images:', error);
        // Keep default reviews if Firebase fails
      }
    };

    loadReviewImages();
  }, []);

  // If no reviews from admin, show default placeholder reviews
  const defaultReviews: ReviewImage[] = [
    {
      id: '1',
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3Eصورة تقييم 1%3C/text%3E%3C/svg%3E",
      isActive: true,
      order: 1,
      createdAt: new Date()
    },
    {
      id: '2',
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3Eصورة تقييم 2%3C/text%3E%3C/svg%3E",
      isActive: true,
      order: 2,
      createdAt: new Date()
    },
    {
      id: '3',
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3Eصورة تقييم 3%3C/text%3E%3C/svg%3E",
      isActive: true,
      order: 3,
      createdAt: new Date()
    },
    {
      id: '4',
      imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3Eصورة تقييم 4%3C/text%3E%3C/svg%3E",
      isActive: true,
      order: 4,
      createdAt: new Date()
    }
  ];

  const reviews = reviewImages.length > 0 ? reviewImages : defaultReviews;

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index: number) => {
    setCurrentReview(index);
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
            شوفي فيدباك بنات خالتك
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Review Card - Image Only */}
          <div className="bg-white rounded-3xl p-4 mx-12 shadow-2xl relative">
            {/* Review Image Only */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg rounded-lg overflow-hidden shadow-lg">
                <img
                  src={reviews[currentReview].imageUrl}
                  alt="تقييم عميل"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3Eصورة التقييم%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>

            {/* Heart Icon */}
            <div className="absolute -bottom-4 left-8">
              <div className="bg-red-500 rounded-lg p-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentReview
                    ? 'bg-white'
                    : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};