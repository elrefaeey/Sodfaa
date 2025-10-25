import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MessageCircle, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Offer } from '@/components/admin/OfferForm';
import { getAllProducts } from '@/services/productService';
import { Product } from '@/data/products';
import { deleteOffer } from '@/services/offerService';

interface OfferDetailsProps {
  offer: Offer;
  onBack: () => void;
}

export const OfferDetails = ({ offer, onBack }: OfferDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [product, setProduct] = useState<Product | null>(null);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await getAllProducts();
        const foundProduct = products.find(p => p.id === offer.productId);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };

    if (offer.productId) {
      loadProduct();
    }
  }, [offer.productId]);

  // Get images from product data or offer data or use placeholder
  const images = product?.images && product.images.length > 0 
    ? product.images 
    : offer.images && offer.images.length > 0 
    ? offer.images 
    : ['/api/placeholder/600/600', '/api/placeholder/600/600', '/api/placeholder/600/600'];

  // Update countdown timer and auto-delete when expired
  useEffect(() => {
    const updateTimer = async () => {
      const now = new Date();
      const timeLeft = new Date(offer.endTime).getTime() - now.getTime();
      
      if (timeLeft <= 0) {
        setTimeRemaining('انتهى العرض');
        // Auto delete expired offer and go back
        try {
          await deleteOffer(offer.id);
          onBack(); // Go back to offers list
        } catch (error) {
          console.error('Error deleting expired offer:', error);
        }
        return;
      }
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setTimeRemaining(`${days} يوم ${hours} ساعة ${minutes} دقيقة`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`);
      } else {
        setTimeRemaining(`${minutes} دقيقة ${seconds} ثانية`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [offer.endTime, offer.id, onBack]);

  const handleWhatsAppClick = () => {
    const productName = offer.productName || 'المنتج';
    const discountPercent = offer.discount || 0;
    const message = `مرحباً، أريد طلب ${productName} بالعرض الخاص (خصم ${discountPercent}%)`;
    window.open(`https://wa.me/201031901879?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Use product price if available, otherwise use offer price
  const originalPrice = product?.price || offer.originalPrice || 0;
  const discount = offer.discount || 0;
  const discountedPrice = originalPrice * (1 - discount / 100);
  const savings = originalPrice - discountedPrice;

  return (
    <div className="min-h-screen bg-background">


      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={images[currentImageIndex]}
                alt={offer.productName}
                className="w-full h-full object-cover"
              />
              
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                -{offer.discount}%
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${offer.productName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Timer Section */}
            <div className="bg-red-500 text-white px-4 py-3 rounded-xl">
              <div className="text-center">
                <div className="text-sm font-medium mb-1">Offer ends in</div>
                <div className="text-lg font-bold tracking-wider">
                  {(() => {
                    const now = new Date();
                    const timeLeft = new Date(offer.endTime).getTime() - now.getTime();
                    
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


            {/* Product Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
                {product?.name || offer.productName}
              </h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                عرض خاص محدود
              </Badge>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#D4AF37]">
                  {discountedPrice.toFixed(2)} جنيه
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {originalPrice.toFixed(2)} جنيه
                </span>
              </div>
              <div className="text-green-600 font-semibold">
                وفرتي {savings.toFixed(2)} جنيه!
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold">تفاصيل السعر</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">السعر الأصلي:</span>
                  <span className="text-lg font-semibold line-through text-gray-500">
                    {originalPrice.toFixed(2)} جنيه
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الخصم ({discount}%):</span>
                  <span className="text-lg font-semibold text-red-600">
                    -{savings.toFixed(2)} جنيه
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-lg font-bold">السعر النهائي:</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    {discountedPrice.toFixed(2)} جنيه
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg rounded-xl flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-6 h-6" />
                إضافة إلى السلة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};