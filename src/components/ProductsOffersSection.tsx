import React from 'react';
import { MessageCircle, Instagram, Hourglass } from 'lucide-react';

export const ProductsOffersSection: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201031901879', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/sodfaa__store/', '_blank');
  };
  return (
    <section className="pt-4 pb-0 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Main Content - Mobile responsive design */}
          <div className="bg-white rounded-xl p-6 sm:p-12 md:p-16 shadow-lg max-w-2xl mx-auto flex flex-col items-center justify-center border border-gray-100">
            {/* Animated hourglass */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-amber-50 shadow-inner">
                <Hourglass className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-500 animate-bounce" />
              </div>
            </div>
            
            {/* Main Message */}
            <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
              NO SPECIAL OFFERS AVAILABLE AT THE MOMENT
            </h3>
            
            {/* Secondary Message */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 font-medium px-2">
              CHECK BACK SOON FOR EXCITING DEALS!
            </p>

            {/* Follow us text */}
            <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-gray-700 font-semibold">
              Follow us for the latest offers here
            </p>

            {/* Social Icons (clickable) */}
            <div className="mt-3 sm:mt-4 md:mt-6 flex gap-4 sm:gap-6">
              {/* WhatsApp Icon - Green */}
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform hover:scale-105 focus:outline-none"
                aria-label="Contact us on WhatsApp"
                title="Contact us on WhatsApp"
              >
                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </button>
              
              {/* Instagram Icon - Gradient */}
              <button
                type="button"
                onClick={handleInstagramClick}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform hover:scale-105 focus:outline-none bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:brightness-110"
                aria-label="Follow us on Instagram"
                title="Follow us on Instagram"
              >
                <Instagram className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
