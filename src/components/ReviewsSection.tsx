import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { useApprovedReviews } from '../hooks/useReviews';
import { Star, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, loading: reviewsLoading } = useApprovedReviews(6);
  const [formRating, setFormRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  if (reviewsLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-arabic-elegant">
              ⭐ آراء عملائنا
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              اكتشف ما يقوله عملاؤنا عن تجربتهم مع Sodfaa||صُدفةة
            </p>
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
              <div className="text-center">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  لا توجد تقييمات بعد
                </h3>
                <p className="text-gray-500 mb-6">
                  اذهب إلى لوحة التحكم وأضف تقييمات لعملائك
                </p>
                <div className="text-sm text-gray-400">
                  لوحة التحكم → التقييمات → إضافة تقييم
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-arabic-elegant">
            ⭐ آراء عملائنا
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف ما يقوله عملاؤنا عن تجربتهم مع Sodfaa||صُدفةة
          </p>
        </div>


        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-gold-classic"
            >
              {/* Customer Name and Rating */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{review.customerName}</h4>
                <StarRating rating={review.rating} size="sm" />
              </div>

              {/* Review Text */}
              <div className="relative">
                <Quote className="w-6 h-6 text-gray-300 absolute -top-1 -right-1" />
                <p className="text-gray-700 leading-relaxed text-base pr-4 italic">
                  "{review.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Review Form - Fake form for customer satisfaction only, data is not saved */}
        <div className="text-center mt-12">
          {!showForm ? (
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                💬 شاركنا تجربتك
              </h3>
              <p className="text-gray-600 mb-6">
                هل جربت منتجاتنا؟ نحب أن نسمع رأيك!
              </p>
              <button 
                className="btn-gold-real px-8 py-3 rounded-full magnetic-hover text-lg font-semibold"
                onClick={() => setShowForm(true)}
              >
                اترك تقييمك
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                💬 شاركنا تجربتك
              </h3>
              <p className="text-gray-600 mb-6">
                هل جربت منتجاتنا؟ نحب أن نسمع رأيك!
              </p>
              
              <form className="space-y-4 text-right">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسمك *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-classic focus:border-gold-classic"
                    placeholder="أدخل اسمك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تقييمك *
                  </label>
                  <div className="flex justify-center">
                    <StarRating 
                      rating={formRating} 
                      interactive={true} 
                      size="lg" 
                      onRatingChange={setFormRating}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تعليقك *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-classic focus:border-gold-classic"
                    rows={4}
                    placeholder="شاركنا رأيك عن منتجاتنا..."
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-center">
                  <button 
                    type="submit" 
                    className="btn-gold-real px-8 py-3 rounded-full magnetic-hover text-lg font-semibold"
                    onClick={(e) => {
                      e.preventDefault();
                      // Fake form - data is not saved, just for customer satisfaction
                      // إعادة تعيين الفورم
                      setFormRating(0);
                      const form = e.currentTarget.closest('form');
                      if (form) {
                        form.reset();
                      }
                      alert('شكراً لك! تم إرسال تقييمك بنجاح. سنراجعه ونعرضه قريباً.\n\nملاحظة: هذا التقييم للعرض فقط ولا يتم حفظه.');
                      setShowForm(false);
                    }}
                  >
                    إرسال التقييم
                  </button>
                  
                  <button 
                    type="button" 
                    className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-lg font-semibold"
                    onClick={() => setShowForm(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
