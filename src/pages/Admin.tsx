import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Package, Users, Eye, Edit, Trash2, Plus, ArrowLeft, Percent } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { categories, Product } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProductForm } from '@/components/admin/ProductForm';
import { EnhancedProductForm } from '@/components/admin/EnhancedProductForm';
import { DiscountCodeForm } from '@/components/admin/DiscountCodeForm';
import { OfferForm, Offer } from '@/components/admin/OfferForm';
import { CategoryManagement } from '@/components/admin/CategoryManagement';
import { BannerTextManagement } from '@/components/admin/BannerTextManagement';
import { ReviewManagement } from '@/components/admin/ReviewManagement';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  subscribeToProducts
} from '@/services/productService';
import {
  addOffer,
  deleteOffer as deleteOfferService
} from '@/services/offerService';
import {
  DiscountCode,
  CreateDiscountCode,
  addDiscountCode,
  updateDiscountCode,
  deleteDiscountCode
} from '@/services/discountService';
import { useOffers } from '@/hooks/useOffers';
import { useDiscountCodes } from '@/hooks/useDiscountCodes';
// import { useReviewStats } from '@/hooks/useReviews';

interface AdminProps {
  onBackToHome: () => void;
}

const AdminDashboard = ({ onBackToHome }: AdminProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { offers, loading: offersLoading } = useOffers();
  const { discountCodes, loading: discountCodesLoading } = useDiscountCodes();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showDiscountCodeForm, setShowDiscountCodeForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [editingDiscountCode, setEditingDiscountCode] = useState<DiscountCode | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const initialTab = (() => {
    const param = new URLSearchParams(window.location.search).get('tab') || 'products';
    return param === 'dashboard' ? 'products' : param;
  })();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [handledCodeDeepLink, setHandledCodeDeepLink] = useState(false);
  


  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        toast({
          title: "خطأ في تحميل المنتجات",
          description: "فشل في تحميل المنتجات من قاعدة البيانات",
          variant: "destructive"
        });
      }
    };

    loadProducts();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleSaveProduct = async (productData: Omit<Product, 'id'> & { id?: string }) => {
    setIsLoading(true);
    try {
      if (productData.id) {
        // Edit existing product
        await updateProduct(productData.id, productData);
      } else {
        // Add new product
        await addProduct(productData as Omit<Product, 'id'>);
      }
      setEditingProduct(undefined);
      setShowProductForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOffer = async (offerData: Omit<Offer, 'id'>) => {
    try {
      await addOffer(offerData);
      toast({
        title: "تم إنشاء العرض",
        description: "تم إنشاء العرض بنجاح وسيظهر في صفحة المنتجات",
      });
      setShowOfferForm(false);
    } catch (error) {
      console.error('Error adding offer:', error);
      toast({
        title: "خطأ في إنشاء العرض",
        description: "فشل في إنشاء العرض، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await deleteOfferService(offerId);
      toast({
        title: "تم حذف العرض",
        description: "تم حذف العرض بنجاح",
      });
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: "خطأ في حذف العرض",
        description: "فشل في حذف العرض، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  // Discount Code Handlers
  const handleSaveDiscountCode = async (discountCodeData: CreateDiscountCode | (DiscountCode & { id: string })) => {
    setIsLoading(true);
    try {
      if ('id' in discountCodeData) {
        // Update existing discount code
        await updateDiscountCode(discountCodeData.id, discountCodeData);
        toast({
          title: "تم تحديث كود الخصم",
          description: "تم تحديث كود الخصم بنجاح",
        });
      } else {
        // Create new discount code
        await addDiscountCode(discountCodeData);
        toast({
          title: "تم إنشاء كود الخصم",
          description: "تم إنشاء كود الخصم بنجاح",
        });
      }
      setEditingDiscountCode(undefined);
      setShowDiscountCodeForm(false);
    } catch (error) {
      console.error('Error saving discount code:', error);
      toast({
        title: "خطأ في حفظ كود الخصم",
        description: "فشل في حفظ كود الخصم، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDiscountCode = (discountCode: DiscountCode) => {
    setEditingDiscountCode(discountCode);
    setShowDiscountCodeForm(true);
  };

  const handleDeleteDiscountCode = async (discountCodeId: string) => {
    try {
      await deleteDiscountCode(discountCodeId);
      toast({
        title: "تم حذف كود الخصم",
        description: "تم حذف كود الخصم بنجاح",
      });
    } catch (error) {
      console.error('Error deleting discount code:', error);
      toast({
        title: "خطأ في حذف كود الخصم",
        description: "فشل في حذف كود الخصم، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  // Deep-link: open discounts tab and preselect code
  useEffect(() => {
    if (handledCodeDeepLink) return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const tab = params.get('tab');
    if (tab === 'discounts') setActiveTab('discounts');
    if (code && discountCodes.length > 0) {
      const found = discountCodes.find(dc => dc.code.toUpperCase() === code.toUpperCase());
      if (found) {
        setEditingDiscountCode(found);
        setShowDiscountCodeForm(true);
        setHandledCodeDeepLink(true);
      }
    }
  }, [discountCodes, handledCodeDeepLink]);

  return (
    <div className="min-h-screen bg-clean-secondary">
      {/* Header */}
      <div className="bg-white border-b border-clean-neutral shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-2xl font-bold text-black">Sodfaa||صُدفةة Admin</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-sm text-muted-foreground">
                مرحباً، {user?.email}
              </div>
              <Button
                variant="outline"
                onClick={onBackToHome}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">العودة للمتجر</span>
                <span className="sm:hidden">العودة</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
                <span className="sm:hidden">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={(val) => {
            setActiveTab(val);
            const params = new URLSearchParams(window.location.search);
            params.set('tab', val);
            window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
          }} className="space-y-4 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-0 h-auto sm:h-10 p-1">
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2 sm:py-1.5">المنتجات</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs sm:text-sm py-2 sm:py-1.5">الفئات</TabsTrigger>
            <TabsTrigger value="offers" className="text-xs sm:text-sm py-2 sm:py-1.5">العروض</TabsTrigger>
            <TabsTrigger value="discounts" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <span className="hidden sm:inline">أكواد الخصم</span>
              <span className="sm:hidden">الخصم</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <span className="hidden sm:inline">التقييمات</span>
              <span className="sm:hidden">التقييمات</span>
            </TabsTrigger>
            <TabsTrigger value="banner-text" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <span className="hidden sm:inline">الجملة</span>
              <span className="sm:hidden">الجملة</span>
            </TabsTrigger>
          </TabsList>


          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <ReviewManagement />
          </TabsContent>

          {/* Banner Text Tab */}
          <TabsContent value="banner-text" className="space-y-6">
            <BannerTextManagement />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
              <div className="flex gap-2">
                <Button
                  className="rounded-full btn-gold-real px-4 py-2 shadow-sm magnetic-hover"
                  onClick={() => setShowProductForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة منتج
                </Button>
              </div>
            </div>

            <Card className="shadow-soft">
              <CardContent className="p-0">
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-4">Image</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="p-4">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          </td>
                          <td className="p-4 font-medium">{product.name}</td>
                          <td className="p-4">{product.category}</td>
                          <td className="p-4">${product.price}</td>
                          <td className="p-4">
                            <Badge variant={product.inStock ? "default" : "secondary"}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>تأكيد حذف المنتج</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 hover:bg-red-700">
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile list cards */}
                <div className="sm:hidden p-4 space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-xl p-4 flex gap-4 items-start bg-white">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium text-base truncate">{product.name}</p>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-base">${product.price}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تأكيد حذف المنتج</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 hover:bg-red-700">
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <CategoryManagement />
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة العروض</h2>
              <Button className="rounded-full bg-gold-classic hover:bg-soft-gold text-black px-4 py-2 shadow-sm magnetic-hover" onClick={() => setShowOfferForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة عرض
              </Button>
            </div>

            {offers.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد عروض بعد</h3>
                  <p className="text-muted-foreground mb-4">
                    أنشئ أول عرض لبدء الترويج بخصومات ومؤقت عدّ تنازلي.
                  </p>
                  <Button 
                    className="btn-gold"
                    onClick={() => setShowOfferForm(true)}
                  >
                    أنشئ أول عرض لك
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offers.map((offer) => (
                    <Card key={offer.id} className="shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">{offer.productName}</h3>
                          <Badge variant={offer.isActive ? "default" : "secondary"}>
                            {offer.discount}% OFF
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Ends: {offer.endTime.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteOffer(offer.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center">
                  <Button 
                    className="rounded-full btn-gold-real px-4 py-2 shadow-sm magnetic-hover"
                    onClick={() => setShowOfferForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة عرض آخر
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Discount Codes Tab */}
          <TabsContent value="discounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة أكواد الخصم</h2>
              <Button
                className="rounded-full btn-gold-real px-4 py-2 shadow-sm magnetic-hover"
                onClick={() => setShowDiscountCodeForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة كود خصم
              </Button>
            </div>

            {discountCodes.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  <Percent className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد أكواد خصم</h3>
                  <p className="text-muted-foreground mb-4">
                    أنشئ أول كود خصم لتقديم عروض خاصة للعملاء.
                  </p>
                  <Button
                    className="rounded-full btn-gold-real px-4 py-2 shadow-sm magnetic-hover"
                    onClick={() => setShowDiscountCodeForm(true)}
                  >
                    أنشئ أول كود خصم
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-soft">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-left p-4">Code</th>
                          <th className="text-left p-4">Discount</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {discountCodes.map((discountCode) => (
                          <tr key={discountCode.id} className="border-b">
                            <td className="p-4 font-mono font-bold text-lg">
                              {discountCode.code}
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {discountCode.discountPercentage}% OFF
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant={discountCode.isActive ? "default" : "secondary"}>
                                {discountCode.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditDiscountCode(discountCode)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteDiscountCode(discountCode.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

        </Tabs>
      </div>

      {/* Enhanced Product Form Modal */}
      <EnhancedProductForm
        isOpen={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(undefined);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Offer Form Modal */}
      <OfferForm
        isOpen={showOfferForm}
        onClose={() => setShowOfferForm(false)}
        products={products}
        onSave={handleSaveOffer}
      />

      {/* Discount Code Form Modal */}
      <DiscountCodeForm
        isOpen={showDiscountCodeForm}
        onClose={() => {
          setShowDiscountCodeForm(false);
          setEditingDiscountCode(undefined);
        }}
        discountCode={editingDiscountCode}
        onSave={handleSaveDiscountCode}
      />
    </div>
  );
};

// Main Admin component with protection
export const Admin = ({ onBackToHome }: AdminProps) => {
  return (
    <ProtectedRoute onBackToHome={onBackToHome}>
      <AdminDashboard onBackToHome={onBackToHome} />
    </ProtectedRoute>
  );
};