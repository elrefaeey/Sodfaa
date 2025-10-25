import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';

interface FooterProps {
  onAdminClick?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToProducts?: () => void;
}

export const Footer = ({
  onAdminClick,
  onNavigateToHome,
  onNavigateToProducts
}: FooterProps) => {
  const [showPolicy, setShowPolicy] = useState(false);

  // Developer WhatsApp contact message in Arabic
  const developerWhatsapp = '201092940685';
  const developerMessage = 'جئت من موقع Sodfaa||صُدفةة، هل يمكنني الحصول على مزيد من التفاصيل إذا أردت إنشاء موقع؟';

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/sodfaa__store/', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201031901879', '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:+201031901879', '_self');
  };

  const handleTikTokClick = () => {
    window.open('https://www.tiktok.com/@sodfaa_store__?_t=ZS-90lB63CzuRc&_r=1', '_blank');
  };


  // Real WhatsApp Icon SVG
  const WhatsAppIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  );

  // Real Instagram Icon SVG
  const InstagramIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  // Phone Icon SVG
  const PhoneIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );

  // TikTok Icon SVG
  const TikTokIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="arabic-bg text-gray-800 border-t border-clean-neutral">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Mobile-First Vertical Stack Layout */}
          <div className="flex flex-col items-center text-center space-y-8">

            {/* Brand Section */}
            <div className="space-y-4">
              {/* Arabic Decorative Element */}
              <div className="flex justify-center">
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#E6BE8A] to-transparent opacity-80"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-wide font-arabic-elegant">Sodfaa||صُدفةة</h2>
              {/* Arabic Decorative Element */}
              <div className="flex justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#E6BE8A] to-transparent opacity-80"></div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Quick Links</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={onNavigateToHome}
                  className="text-gray-600 hover:text-clean-accent transition-colors duration-200 text-sm sm:text-base font-medium"
                >
                  Home
                </button>
                <button
                  onClick={onNavigateToProducts}
                  className="text-gray-600 hover:text-clean-accent transition-colors duration-200 text-sm sm:text-base font-medium"
                >
                  Products
                </button>
              </div>
            </div>

            {/* Social Icons Section */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Follow Us</h3>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleInstagramClick}
                  className="flex items-center justify-center gap-3 text-gray-600 hover:text-clean-accent transition-all duration-300 text-sm sm:text-base font-medium magnetic-hover"
                >
                  <InstagramIcon />
                  Instagram
                </button>
                <button
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center gap-3 text-gray-600 hover:text-clean-accent transition-all duration-300 text-sm sm:text-base font-medium magnetic-hover"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </button>
                <button
                  onClick={handleTikTokClick}
                  className="flex items-center justify-center gap-3 text-gray-600 hover:text-clean-accent transition-all duration-300 text-sm sm:text-base font-medium magnetic-hover"
                >
                  <TikTokIcon />
                  TikTok
                </button>
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center justify-center gap-3 text-gray-600 hover:text-clean-accent transition-all duration-300 text-sm sm:text-base font-medium magnetic-hover"
                >
                  <PhoneIcon />
                  01031901879
                </button>
              </div>
            </div>

            {/* Bottom Section with Policy Link and Lock Icon */}
            <div className="border-t border-clean-neutral pt-6 w-full">
              <div className="flex flex-col items-center justify-center gap-3">


                <p className="text-xs sm:text-sm text-gray-500 font-light text-center">
                  © 2025 Sodfaa||صُدفةة. All rights reserved.<br />
                  Developed by{' '}
                  <a
                    href={`https://wa.me/${developerWhatsapp}?text=${encodeURIComponent(developerMessage)}`}
                    style={{ color: '#FFD700', fontWeight: 'bold', textDecoration: 'none' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ahmed erefaey
                  </a>
                </p>
                {onAdminClick && (
                  <button
                    onClick={onAdminClick}
                    className="text-gray-500 hover:text-clean-accent transition-colors duration-200"
                    title="Admin Access"
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Dialog */}
      <Dialog open={showPolicy} onOpenChange={setShowPolicy}>
        <DialogContent aria-describedby="policy-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-center mb-3">Order Receipt Policy</DialogTitle>
            <DialogDescription id="policy-dialog-description" className="sr-only">
              سياسة استلام الطلبات وشروط التسليم
            </DialogDescription>
          </DialogHeader>
          <div className="p-5 sm:p-6">
            <p className="text-sm leading-7 text-gray-700" dir="rtl">
              عميلنا العزيز، نود التوضيح أن الشحنة يتم تجهيزها طبقًا لما تم طلبه فقط، ولا يتم إرسال أكثر من قطعة للاختيار بينها. كما أن نظامنا لا يتيح التسليم الجزئي، حيث يتم تسليم الطلب كاملًا مع سداد المبلغ المستحق، أو يتم إرجاع الطلب بالكامل. شاكرين تفهمكم وتقديركم.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};