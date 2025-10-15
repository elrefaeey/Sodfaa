import { useState, useEffect } from 'react';
import { Review, ReviewStats } from '../types/review';
import { 
  getAllReviews, 
  getApprovedReviews, 
  addReview, 
  updateReview, 
  deleteReview, 
  getReviewStats,
  subscribeToReviews 
} from '../services/reviewService';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await getAllReviews();
        setReviews(reviewsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const addNewReview = async (reviewData: Omit<Review, 'id' | 'date'>) => {
    try {
      const reviewId = await addReview(reviewData);
      const newReview: Review = {
        ...reviewData,
        id: reviewId,
        date: new Date(),
      };
      setReviews(prev => [newReview, ...prev]);
      return reviewId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
      throw err;
    }
  };

  const updateReviewStatus = async (id: string, isApproved: boolean) => {
    try {
      await updateReview(id, { isApproved });
      setReviews(prev => 
        prev.map(review => 
          review.id === id ? { ...review, isApproved } : review
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      throw err;
    }
  };

  const updateReviewData = async (id: string, updates: Partial<Review>) => {
    try {
      await updateReview(id, updates);
      setReviews(prev => 
        prev.map(review => 
          review.id === id ? { ...review, ...updates } : review
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      throw err;
    }
  };

  const removeReview = async (id: string) => {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(review => review.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      throw err;
    }
  };

  return {
    reviews,
    loading,
    error,
    addNewReview,
    updateReviewStatus,
    updateReviewData,
    removeReview,
  };
};

export const useApprovedReviews = (limitCount?: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApprovedReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await getApprovedReviews(limitCount);
        setReviews(reviewsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
        console.error('Error loading approved reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    loadApprovedReviews();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToReviews((allReviews) => {
      const approvedReviews = allReviews
        .filter(review => review.isApproved)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      const limitedReviews = limitCount 
        ? approvedReviews.slice(0, limitCount)
        : approvedReviews;
      
      setReviews(limitedReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limitCount]);

  return {
    reviews,
    loading,
    error,
  };
};

export const useReviewStats = () => {
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const statsData = await getReviewStats();
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load review stats');
        console.error('Error loading review stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Subscribe to real-time updates for stats
    const unsubscribe = subscribeToReviews((allReviews) => {
      const approvedReviews = allReviews.filter(review => review.isApproved);
      
      if (approvedReviews.length === 0) {
        setStats({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      } else {
        const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / approvedReviews.length;
        
        const ratingDistribution = approvedReviews.reduce((dist, review) => {
          dist[review.rating as keyof typeof dist]++;
          return dist;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        
        setStats({
          totalReviews: approvedReviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution
        });
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    stats,
    loading,
    error,
  };
};
