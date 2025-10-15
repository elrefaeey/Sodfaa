import { MessageCircle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FloatingSocialIcons = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201031901879', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/sodfaa__store/', '_blank');
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3">
      <Button
        onClick={handleWhatsAppClick}
        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-medium hover:scale-110 transition-all duration-300 magnetic-hover"
        title="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      <Button
        onClick={handleInstagramClick}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:brightness-110 text-white shadow-medium hover:scale-110 transition-all duration-300 magnetic-hover"
        title="Follow us on Instagram"
      >
        <Instagram className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};