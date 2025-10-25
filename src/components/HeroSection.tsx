import { Button } from '@/components/ui/button';
import heroImage from '../WhatsApp Image 2025-10-16 at 01.39.02_229c88d0.jpg';

interface HeroSectionProps {
  onShopNowClick: () => void;
}

export const HeroSection = ({ onShopNowClick }: HeroSectionProps) => {
  // Static hero image URL
  const heroImageUrl = heroImage;

  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImageUrl}
          alt="Sodfaa Store Hero Background"
          className="absolute inset-0 w-full h-full hero-vertical-image object-cover"
          style={{
            objectPosition: 'center bottom'
          }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Arabic Decorative Element */}
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FAD26A] to-transparent opacity-80"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-wider slide-in-up">
            <span className="text-white drop-shadow-2xl font-arabic-elegant">Sodfaa||صُدفةة</span>
          </h1>
          {/* Arabic Decorative Element */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FAD26A] to-transparent opacity-80"></div>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 slide-in-up [animation-delay:200ms] max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
            كل الي نفسك فيه ف صدفه<br />
            <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">هتلاقيه يبنتخالتي</span>
          </p>
          <div className="slide-in-up [animation-delay:400ms]">
            <Button
              className="btn-gold-real text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4 magnetic-hover font-bold uppercase tracking-wide"
              onClick={onShopNowClick}
            >
              اطلبي من هنا
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};