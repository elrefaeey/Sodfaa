import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';

export interface ReviewImage {
  id: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const COLLECTION_NAME = 'reviewImages';

export const addReviewImage = async (reviewData: Omit<ReviewImage, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...reviewData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding review image:', error);
    throw new Error('فشل في إضافة صورة التقييم');
  }
};

export const updateReviewImage = async (id: string, reviewData: Partial<Omit<ReviewImage, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, reviewData);
  } catch (error) {
    console.error('Error updating review image:', error);
    throw new Error('فشل في تحديث صورة التقييم');
  }
};

export const deleteReviewImage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting review image:', error);
    throw new Error('فشل في حذف صورة التقييم');
  }
};

export const getAllReviewImages = async (): Promise<ReviewImage[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as ReviewImage[];
  } catch (error) {
    console.error('Error getting review images:', error);
    throw new Error('فشل في تحميل صور التقييمات');
  }
};

export const getActiveReviewImages = async (): Promise<ReviewImage[]> => {
  try {
    const allReviews = await getAllReviewImages();
    return allReviews.filter(review => review.isActive);
  } catch (error) {
    console.error('Error getting active review images:', error);
    throw new Error('فشل في تحميل صور التقييمات النشطة');
  }
};

export const subscribeToReviewImages = (callback: (reviews: ReviewImage[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as ReviewImage[];
    
    callback(reviews);
  }, (error) => {
    console.error('Error in review images subscription:', error);
  });
};