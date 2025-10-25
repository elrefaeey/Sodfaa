import { useEffect } from 'react';
import { deleteExpiredOffers } from '@/services/offerService';

export const useOfferCleanup = () => {
  useEffect(() => {
    // Function to clean up expired offers
    const cleanupExpiredOffers = async () => {
      try {
        await deleteExpiredOffers();
      } catch (error) {
        console.error('Failed to cleanup expired offers:', error);
      }
    };

    // Run cleanup immediately
    cleanupExpiredOffers();

    // Set up interval to run cleanup every minute
    const interval = setInterval(cleanupExpiredOffers, 60 * 1000); // 1 minute

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);
};