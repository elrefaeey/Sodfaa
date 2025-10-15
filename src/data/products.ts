export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  colors: Array<{
    name: string;
    image: string;
  }>;
  inStock: boolean;

  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "default-category",
    name: "فئة افتراضية",
    description: "فئة افتراضية يمكن تعديلها أو حذفها",
    image: "/api/placeholder/300/200"
  }
];

export const products: Product[] = [
  {
    id: "default-product",
    name: "منتج افتراضي",
    description: "منتج افتراضي يمكن تعديله أو حذفه",
    price: 100,
    category: "default-category",
    images: ["/api/placeholder/400/400"],
    colors: [
      { name: "افتراضي", image: "/api/placeholder/400/400" }
    ],
    inStock: true
  }
];

export const getProductsByCategory = (categoryId: string) => {
  return products.filter(product => product.category === categoryId);
};



export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};