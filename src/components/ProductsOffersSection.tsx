import React, { useState, useEffect } from 'react';
import { MessageCircle, Instagram, Hourglass, Clock, Tag, Loader2 } from 'lucide-react';
import { useOffers } from '@/hooks/useOffers';
import { useOfferCleanup } from '@/hooks/useOfferCleanup';
import { OfferDetails } from '@/components/OfferDetails';
import { Offer } from '@/components/admin/OfferForm';
import { getAllProducts } from '@/services/productService';
import { Product } from '@/data/products';

// TikTok Icon Component
const TikTokIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const ProductsOffersSection: React.FC = () => {
  const { offers, loading } = useOffers();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Auto cleanup expired offers
  useOfferCleanup();

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201031901879', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/sodfaa__store/', '_blank');
  };

  const handleTikTokClick = () => {
    window.open('https://www.tiktok.com/@sodfaa_store__?_t=ZS-90lB63CzuRc&_r=1', '_blank');
  };

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  // Function to format time remaining
  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const timeLeft = endTime.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'انتهى العرض';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} يوم و ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة و ${minutes} دقيقة`;
    return `${minutes} دقيقة`;
  };

  // Show active offers if available
  const activeOffers = offers.filter(offer => offer.isActive && new Date(offer.endTime) > new Date());

  // If viewing offer details
  if (selectedOffer) {
    return (
      <OfferDetails 
        offer={selectedOffer} 
        onBack={() => setSelectedOffer(null)} 
      />
    );
  }

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل العروض...</p>
          </div>
        </div>
      </section>
    );
  }

  if (activeOffers.length > 0) {
    return (
      <section className="pt-1 pb-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Timer Bar for all offers */}
          <div className="bg-red-500 text-white px-4 py-3 rounded-xl mb-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-sm font-medium mb-1">Offer ends in</div>
              <div className="text-lg font-bold tracking-wider">
                {(() => {
                  // Use the earliest ending offer for the timer
                  const earliestOffer = activeOffers.reduce((earliest, current) => 
                    new Date(current.endTime) < new Date(earliest.endTime) ? current : earliest
                  );
                  
                  const timeLeft = new Date(earliestOffer.endTime).getTime() - currentTime.getTime();
                  
                  if (timeLeft <= 0) return '00 : 00 : 00 : 00';
                  
                  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                  
                  return `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
                })()}
              </div>
              <div className="text-xs opacity-90 mt-1">
                <span className="mr-8">D</span>
                <span className="mr-8">H</span>
                <span className="mr-8">M</span>
                <span>S</span>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
              العروض الخاصة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استغلي العروض دي قبل ما تخلص!
            </p>
          </div>

          {/* Offers Grid - 2 columns on mobile, 3 on larger screens */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {activeOffers.map((offer) => {
              // Find the corresponding product
              const product = products.find(p => p.id === offer.productId);
              const originalPrice = product?.price || offer.originalPrice || 0;
              const discountedPrice = originalPrice * (1 - offer.discount / 100);
              const productImage = product?.images?.[0] || offer.images?.[0] || "/api/placeholder/400/400";
              const productName = product?.name || offer.productName;

              return (
                <div
                  key={offer.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    // Store offer data in localStorage for the new tab
                    localStorage.setItem('selectedOffer', JSON.stringify(offer));
                    // Open in new tab with offer ID
                    window.open(`/offer/${offer.id}`, '_blank');
                  }}
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Discount Badge */}
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{offer.discount}%
                      </div>
                      
                      {/* Timer Badge */}
                      <div className="absolute top-2 left-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="hidden sm:inline">{formatTimeRemaining(new Date(offer.endTime))}</span>
                        <span className="sm:hidden">{formatTimeRemaining(new Date(offer.endTime)).split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                        {productName}
                      </h3>
                      
                      {/* Price Section */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg sm:text-xl font-bold text-[#D4AF37]">
                          EGP {discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          EGP {originalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Order Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/products/${product.id}`;
                        }}
                        className="w-full bg-[#2D3748] hover:bg-[#1A202C] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        اطلبي من هنا
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
            العروض الخاصة
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            مفيش عروض دلوقتي يا بنات خالتي
          </p>
        </div>

        {/* No Offers Card */}
        <div className="max-w-2xl mx-auto">
          <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            {/* Background with gradient */}
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-800 p-6">
                {/* Icon */}
                <div className="mb-6">
                  <Hourglass className="w-16 h-16 text-gray-600" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
                  استنونا قريب، في حاجات نار جاية
                </h3>
                
                <p className="text-center opacity-90 mb-6">
                  ومتنسيش تعملي فولو هنا عشان أول ما العروض تنزل تكوني أول واحدة تعرف 😉💖
                </p>
                
                {/* Social Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={handleInstagramClick}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </button>
                  <button
                    onClick={handleTikTokClick}
                    className="bg-black hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <TikTokIcon />
                    TikTok
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
