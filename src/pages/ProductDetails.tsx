import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/data/products';
import { getProductById, subscribeToProduct } from '@/services/productService';
import { ChevronDown, Sparkles, ShoppingBag, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOffers } from '@/hooks/useOffers';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { offers } = useOffers();

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const p = await getProductById(id);
        setProduct(p || null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    if (id) {
      unsubscribe = subscribeToProduct(id, (p) => setProduct(p));
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id]);

  const productColors = useMemo(() => {
    if (!product) return [] as { name: string; image: string }[];
    if (product.colors && product.colors.length > 0) return product.colors;
    const fallback = product.images?.[0] || '/api/placeholder/600/600';
    return [{ name: 'Default', image: fallback }];
  }, [product]);

  const selectedColor = useMemo(() => {
    if (!productColors.length) return null;
    if (selectedColorName) {
      const match = productColors.find((c) => c.name === selectedColorName);
      if (match) return match;
    }
    return productColors[0];
  }, [productColors, selectedColorName]);

  // Find active offer for this product
  const activeOffer = useMemo(() => {
    if (!product || !offers.length) return null;
    return offers.find(offer => 
      offer.productId === product.id && 
      new Date(offer.endTime) > currentTime
    );
  }, [product, offers, currentTime]);

  const isOnSale = !!product?.originalPrice || !!activeOffer;
  const originalPrice = activeOffer ? product?.price || 0 : (product?.originalPrice || product?.price || 0);
  const displayPrice = activeOffer 
    ? (product?.price || 0) * (1 - activeOffer.discount / 100)
    : (product ? (product.originalPrice ? product.price : product.price) : 0);
  const discountPercentage = activeOffer 
    ? activeOffer.discount
    : (product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  // Countdown timer for offers
  const getTimeRemaining = (endTime: string) => {
    const total = new Date(endTime).getTime() - currentTime.getTime();
    if (total <= 0) return null;
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = async () => {
    if (!product || !selectedColor) return;
    if (!product.inStock) return;
    
    setIsAddingToCart(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(displayPrice.toFixed(2)),
      quantity,
      image: selectedColor.image,
      color: selectedColor.name
    });
    
    // Enhanced toast with sparkles
    toast({
      title: '✨ تمت الإضافة إلى السلة بنجاح!',
      description: `${product.name} - الكمية: ${quantity}`,
      duration: 3000,
    });
    
    setIsAddingToCart(false);
    // Navigate to products list to continue shopping
    navigate('/', { state: { openProducts: true } });
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">المنتج غير موجود</p>
        <Button onClick={() => navigate(-1)}>الرجوع</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
        <div className="sticky top-2 z-30 mb-3 sm:mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/', { state: { openProducts: true } })}
            className="rounded-xl px-5 py-2 font-semibold w-fit"
          >
            BACK
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-center md:text-left">{product.name}</h1>
            <div 
              className="relative w-full overflow-hidden bg-transparent flex items-center justify-center rounded-lg shadow-sm cursor-zoom-in group"
              onMouseEnter={() => setIsImageZoomed(true)}
              onMouseLeave={() => setIsImageZoomed(false)}
            >
              {selectedColor && (
                <img
                  src={selectedColor.image}
                  alt={`${product.name} - ${selectedColor.name}`}
                  className={`block w-full h-auto object-contain max-h-[60vh] sm:max-h-[70vh] transition-all duration-500 ${
                    isImageZoomed ? 'scale-110' : 'scale-100'
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/600/600';
                  }}
                />
              )}
              
              {/* Zoom indicator */}
              <div className={`absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs transition-opacity duration-300 ${
                isImageZoomed ? 'opacity-100' : 'opacity-0'
              }`}>
                🔍 Zoomed
              </div>
              {isOnSale && discountPercentage > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold px-3 py-1 shadow-lg">
                    -{discountPercentage}%
                  </span>
                </div>
              )}
              {/* Scroll hint */}
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white/90 via-white/40 to-transparent flex items-end justify-center pointer-events-none">
                <div className="mb-2 text-xs sm:text-sm text-gray-700 drop-shadow">
                  <div className="flex items-center gap-2">
                    <span>مرر لأسفل للمزيد من التفاصيل</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            {productColors.length > 1 && (
              <div className="mt-3 sm:mt-4">
                <div className="grid grid-cols-6 gap-2">
                  {productColors.slice(0, 6).map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorName(color.name)}
                      className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 overflow-hidden ${
                        selectedColor?.name === color.name ? 'border-blue-500 shadow' : 'border-gray-300 hover:border-blue-300'
                      }`}
                      style={{ backgroundImage: `url(${color.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      title={color.name}
                      aria-label={`اختيار اللون ${color.name}`}
                    />
                  ))}
                </div>
                {productColors.length > 6 && (
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {productColors.slice(6).map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColorName(color.name)}
                        className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-200 overflow-hidden ${
                          selectedColor?.name === color.name ? 'border-blue-500 shadow' : 'border-gray-300 hover:border-blue-300'
                        }`}
                        style={{ backgroundImage: `url(${color.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        title={color.name}
                        aria-label={`اختيار اللون ${color.name}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {productColors.length > 1 && (
              <div className="mt-2 text-sm text-muted-foreground">
                Color: {selectedColor?.name}
              </div>
            )}
          </div>

          <div className="p-1 sm:p-2 w-full animate-slide-in-up">
            <p className="text-foreground mb-4 leading-relaxed text-base sm:text-lg font-medium">{product.description}</p>
            
            {/* Offer Countdown Timer */}
            {activeOffer && (() => {
              const timeRemaining = getTimeRemaining(activeOffer.endTime);
              return timeRemaining ? (
                <div className="mb-2 p-2 bg-gradient-to-r from-red-50 to-orange-50 rounded border border-red-200">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-red-600" />
                    <span className="text-xs font-medium text-red-700">العرض ينتهي خلال:</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-red-600">
                    {timeRemaining.days > 0 && (
                      <div className="text-center">
                        <div className="bg-red-600 text-white px-1 py-0.5 rounded text-xs">{timeRemaining.days}</div>
                        <div className="text-xs text-red-500 mt-0.5">يوم</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="bg-red-600 text-white px-1 py-0.5 rounded text-xs">{timeRemaining.hours.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-red-500 mt-0.5">ساعة</div>
                    </div>
                    <span className="text-red-600 text-xs">:</span>
                    <div className="text-center">
                      <div className="bg-red-600 text-white px-1 py-0.5 rounded text-xs">{timeRemaining.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-red-500 mt-0.5">دقيقة</div>
                    </div>
                    <span className="text-red-600 text-xs">:</span>
                    <div className="text-center">
                      <div className="bg-red-600 text-white px-1 py-0.5 rounded text-xs">{timeRemaining.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-xs text-red-500 mt-0.5">ثانية</div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              {isOnSale && (
                <Badge className="bg-destructive text-destructive-foreground">-{discountPercentage}%</Badge>
              )}
              <div className="flex flex-col gap-1">
                {isOnSale && (
                  <span className="text-sm text-muted-foreground line-through">EGP {originalPrice.toFixed(2)}</span>
                )}
                <span className="text-2xl font-semibold text-green-600">EGP {displayPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-6">
              <div className="inline-flex items-center border rounded w-fit">
                <button className="px-4 py-3 sm:px-3 sm:py-2" onClick={decreaseQuantity} aria-label="decrease">-</button>
                <span className="px-5 sm:px-4 select-none">{quantity}</span>
                <button className="px-4 py-3 sm:px-3 sm:py-2" onClick={increaseQuantity} aria-label="increase">+</button>
              </div>
              <Button 
                className="btn-dark-gray w-full sm:w-auto py-4 sm:py-2 magnetic-hover relative overflow-hidden" 
                disabled={!product.inStock || isAddingToCart} 
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الإضافة...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>{product.inStock ? 'إضافة إلى السلة' : 'غير متوفر'}</span>
                    <Sparkles className="h-4 w-4 opacity-70" />
                  </div>
                )}
              </Button>
            </div>
            <div className="mt-1 text-xs sm:text-sm">
              <button
                className="text-muted-foreground hover:text-foreground underline"
                onClick={() => navigate('/', { state: { openProducts: true } })}
              >
                Back to Products
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* sticky bar removed as requested */}
    </div>
  );
};

export default ProductDetails;


