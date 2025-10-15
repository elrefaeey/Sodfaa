import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({
  isOpen,
  onClose,
}: CartSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            سلة التسوق
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">سلة التسوق فارغة</h3>
            <p className="text-muted-foreground mb-6">
              أضف بعض الحقائب الجميلة للبدء!
            </p>
            <Button className="btn-gold-real magnetic-hover" onClick={onClose}>
              متابعة التسوق
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};