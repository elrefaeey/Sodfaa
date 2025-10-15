import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { products, categories } from '@/data/products';

// Collections
const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const OFFERS_COLLECTION = 'offers';
const HERO_IMAGES_COLLECTION = 'heroImages';
const BANNER_TEXT_COLLECTION = 'bannerText';
const DISCOUNT_CODES_COLLECTION = 'discountCodes';
const DELIVERY_AREAS_COLLECTION = 'deliveryAreas';

// Sample data for collections
const sampleOffers = [
  {
    title: "خصم 20% على جميع الحقائب",
    description: "احصل على خصم 20% على جميع الحقائب الجلدية الفاخرة",
    discountPercentage: 20,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    applicableProducts: [], // Empty means all products
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "عرض خاص على الحقائب الصغيرة",
    description: "خصم 15% على جميع الحقائب الصغيرة والكلاتش",
    discountPercentage: 15,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    applicableProducts: [], // Empty means all products
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleHeroImages = [
  {
    url: "/api/placeholder/1200/600",
    alt: "Sodfaa||صُدفةة - Luxury Bags Collection",
    title: "مجموعة الحقائب الفاخرة",
    subtitle: "اكتشف الأناقة والجودة في كل قطعة",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    url: "/api/placeholder/1200/600",
    alt: "Sodfaa||صُدفةة - Premium Leather Bags",
    title: "حقائب جلدية فاخرة",
    subtitle: "صناعة يدوية بجودة عالية",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleBannerText = [
  {
    text: "مرحباً بك في Sodfaa||صُدفةة - وجهتك للحقائب الفاخرة",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    text: "شحن مجاني للطلبات أكثر من 500 جنيه",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleDiscountCodes = [
  {
    code: "WELCOME10",
    description: "خصم 10% للعملاء الجدد",
    discountPercentage: 10,
    isActive: true,
    usageLimit: 100,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    minimumOrderAmount: 200,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "SAVE20",
    description: "خصم 20% على الطلبات أكثر من 500 جنيه",
    discountPercentage: 20,
    isActive: true,
    usageLimit: 50,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    minimumOrderAmount: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleDeliveryAreas = [
  {
    name: "القاهرة",
    governorate: "القاهرة",
    deliveryFee: 30,
    isActive: true,
    estimatedDays: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "الجيزة",
    governorate: "الجيزة",
    deliveryFee: 35,
    isActive: true,
    estimatedDays: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "الإسكندرية",
    governorate: "الإسكندرية",
    deliveryFee: 40,
    isActive: true,
    estimatedDays: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "المنصورة",
    governorate: "الدقهلية",
    deliveryFee: 50,
    isActive: true,
    estimatedDays: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const seedAllData = async () => {
  try {
    console.log('🚀 Starting comprehensive Firestore seeding...');

    // Seed Categories
    console.log('📁 Seeding categories...');
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const existingCategories = await getDocs(categoriesRef);

    if (existingCategories.size === 0) {
      const categoryPromises = categories.map(async (category) => {
        const { id, ...categoryData } = category;
        return addDoc(categoriesRef, {
          ...categoryData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      await Promise.all(categoryPromises);
      console.log(`✅ Successfully seeded ${categories.length} categories!`);
    } else {
      console.log('⏭️ Categories already exist. Skipping...');
    }

    // Seed Products
    console.log('🛍️ Seeding products...');
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const existingProducts = await getDocs(productsRef);

    if (existingProducts.size === 0) {
      const productPromises = products.map(async (product) => {
        const { id, ...productData } = product;
        return addDoc(productsRef, {
          ...productData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      await Promise.all(productPromises);
      console.log(`✅ Successfully seeded ${products.length} products!`);
    } else {
      console.log('⏭️ Products already exist. Skipping...');
    }

    // Seed Offers
    console.log('🎯 Seeding offers...');
    const offersRef = collection(db, OFFERS_COLLECTION);
    const existingOffers = await getDocs(offersRef);

    if (existingOffers.size === 0) {
      const offerPromises = sampleOffers.map(async (offer) => {
        return addDoc(offersRef, offer);
      });
      await Promise.all(offerPromises);
      console.log(`✅ Successfully seeded ${sampleOffers.length} offers!`);
    } else {
      console.log('⏭️ Offers already exist. Skipping...');
    }

    // Seed Hero Images
    console.log('🖼️ Seeding hero images...');
    const heroImagesRef = collection(db, HERO_IMAGES_COLLECTION);
    const existingHeroImages = await getDocs(heroImagesRef);

    if (existingHeroImages.size === 0) {
      const heroImagePromises = sampleHeroImages.map(async (heroImage) => {
        return addDoc(heroImagesRef, heroImage);
      });
      await Promise.all(heroImagePromises);
      console.log(`✅ Successfully seeded ${sampleHeroImages.length} hero images!`);
    } else {
      console.log('⏭️ Hero images already exist. Skipping...');
    }

    // Seed Banner Text
    console.log('📢 Seeding banner text...');
    const bannerTextRef = collection(db, BANNER_TEXT_COLLECTION);
    const existingBannerText = await getDocs(bannerTextRef);

    if (existingBannerText.size === 0) {
      const bannerTextPromises = sampleBannerText.map(async (bannerText) => {
        return addDoc(bannerTextRef, bannerText);
      });
      await Promise.all(bannerTextPromises);
      console.log(`✅ Successfully seeded ${sampleBannerText.length} banner texts!`);
    } else {
      console.log('⏭️ Banner text already exist. Skipping...');
    }

    // Seed Discount Codes
    console.log('🎫 Seeding discount codes...');
    const discountCodesRef = collection(db, DISCOUNT_CODES_COLLECTION);
    const existingDiscountCodes = await getDocs(discountCodesRef);

    if (existingDiscountCodes.size === 0) {
      const discountCodePromises = sampleDiscountCodes.map(async (discountCode) => {
        return addDoc(discountCodesRef, discountCode);
      });
      await Promise.all(discountCodePromises);
      console.log(`✅ Successfully seeded ${sampleDiscountCodes.length} discount codes!`);
    } else {
      console.log('⏭️ Discount codes already exist. Skipping...');
    }

    // Seed Delivery Areas
    console.log('🚚 Seeding delivery areas...');
    const deliveryAreasRef = collection(db, DELIVERY_AREAS_COLLECTION);
    const existingDeliveryAreas = await getDocs(deliveryAreasRef);

    if (existingDeliveryAreas.size === 0) {
      const deliveryAreaPromises = sampleDeliveryAreas.map(async (deliveryArea) => {
        return addDoc(deliveryAreasRef, deliveryArea);
      });
      await Promise.all(deliveryAreaPromises);
      console.log(`✅ Successfully seeded ${sampleDeliveryAreas.length} delivery areas!`);
    } else {
      console.log('⏭️ Delivery areas already exist. Skipping...');
    }

    console.log('🎉 All data seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

// Function to call from browser console for manual seeding
if (typeof window !== 'undefined') {
  (window as any).seedAllData = seedAllData;
}


