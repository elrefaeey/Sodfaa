import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review, ReviewStats } from '../types/review';

const COLLECTION_NAME = 'reviews';

export const addReview = async (review: Omit<Review, 'id' | 'date'>): Promise<string> => {
  try {
    const reviewData = {
      ...review,
      date: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), reviewData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw new Error('Failed to add review');
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
};

export const getApprovedReviews = async (limitCount?: number): Promise<Review[]> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('isApproved', '==', true),
      orderBy('date', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Review[];
  } catch (error: any) {
    console.error('Error fetching approved reviews:', error);
    // Graceful fallback while index deploys: fetch approved then sort client-side
    const message: string = error?.message ?? '';
    if (message.includes('The query requires an index')) {
      try {
        const fallbackQuery = query(
          collection(db, COLLECTION_NAME),
          where('isApproved', '==', true)
        );
        const snapshot = await getDocs(fallbackQuery);
        const reviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        })) as Review[];
        const sorted = reviews.sort((a, b) => b.date.getTime() - a.date.getTime());
        return limitCount ? sorted.slice(0, limitCount) : sorted;
      } catch (fallbackErr) {
        console.error('Fallback fetch for approved reviews failed:', fallbackErr);
      }
    }
    throw new Error('Failed to fetch approved reviews');
  }
};

export const updateReview = async (id: string, updates: Partial<Review>): Promise<void> => {
  try {
    const reviewRef = doc(db, COLLECTION_NAME, id);
    const updateData = { ...updates };
    
    // Convert Date to Timestamp if needed
    if (updateData.date) {
      updateData.date = Timestamp.fromDate(updateData.date);
    }
    
    await updateDoc(reviewRef, updateData);
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    const reviewRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
};

export const getReviewStats = async (): Promise<ReviewStats> => {
  try {
    const reviews = await getApprovedReviews();
    
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++;
      return dist;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    
    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw new Error('Failed to get review stats');
  }
};

export const subscribeToReviews = (callback: (reviews: Review[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('date', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Review[];
    
    callback(reviews);
  }, (error) => {
    console.error('Error subscribing to reviews:', error);
  });
};
