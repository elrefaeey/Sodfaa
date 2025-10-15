import { AllProductsSection } from './AllProductsSection';
import { Offer } from './admin/OfferForm';

interface ProductsSectionProps {
  offers?: Offer[];
  onOfferExpired?: (offerId: string) => void;
  onNavigateToCart?: () => void;
}

export const ProductsSection = ({ offers = [], onOfferExpired, onNavigateToCart }: ProductsSectionProps) => {

  return (
    <>
      {/* All Products Section */}
      <AllProductsSection offers={offers} onNavigateToCart={onNavigateToCart} />
    </>
  );
};
