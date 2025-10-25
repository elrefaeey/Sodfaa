import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OfferDetails } from '@/components/OfferDetails';
import { Offer } from '@/components/admin/OfferForm';
import { getAllOffers } from '@/services/offerService';

export const OfferPage = () => {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffer = async () => {
      try {
        // First try to get from localStorage (for immediate access)
        const storedOffer = localStorage.getItem('selectedOffer');
        if (storedOffer) {
          const parsedOffer = JSON.parse(storedOffer);
          if (parsedOffer.id === id) {
            setOffer(parsedOffer);
            setLoading(false);
            return;
          }
        }

        // If not in localStorage, fetch from database
        if (id) {
          const offers = await getAllOffers();
          const foundOffer = offers.find(o => o.id === id);
          if (foundOffer) {
            setOffer(foundOffer);
          }
        }
      } catch (error) {
        console.error('Error loading offer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [id]);

  const handleBack = () => {
    window.close(); // Close the tab
    // If window.close() doesn't work (some browsers block it), redirect to home
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل العرض...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">العرض غير موجود</h1>
          <p className="text-gray-600 mb-4">العرض المطلوب غير متاح أو انتهت صلاحيته</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return <OfferDetails offer={offer} onBack={handleBack} />;
};