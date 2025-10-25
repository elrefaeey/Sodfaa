import React from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CategoriesSectionProps {
  onNavigateToProducts?: () => void;
}

export const CategoriesSection = ({ onNavigateToProducts }: CategoriesSectionProps) => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري تحميل الأقسام...</p>
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
            أقسامنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            خشي خديلك لفه
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            console.log('Category:', category.name, 'Image:', category.image);
            return (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Category Image */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={category.image || '/placeholder.svg'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    console.log('Image failed to load:', category.image);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Category Info */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                  <h3 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
                    {category.name}
                  </h3>
                  <p className="text-sm text-center opacity-90 mb-4">
                    {category.description}
                  </p>
                  
                  {/* Shop Now Button */}
                  <Button
                    onClick={onNavigateToProducts}
                    className="bg-white text-black hover:bg-gray-100 font-bold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    اطلبي من هنا →
                  </Button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
