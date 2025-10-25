import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ReviewImage,
  addReviewImage,
  updateReviewImage,
  deleteReviewImage,
  subscribeToReviewImages
} from '@/services/reviewImageService';

export const ReviewImageManagement = () => {
  const [reviewImages, setReviewImages] = useState<ReviewImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewImage | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    imageUrl: '',
    isActive: true,
    order: 1
  });

  // Update default order when reviewImages change
  useEffect(() => {
    if (!editingReview && !showForm) {
      setFormData(prev => ({ ...prev, order: reviewImages.length + 1 }));
    }
  }, [reviewImages.length, editingReview, showForm]);

  // Load review images from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToReviewImages((reviews) => {
      setReviewImages(reviews);
    });

    return () => unsubscribe();
  }, []);



  const handleSave = async () => {
    if (!formData.imageUrl.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال لينك الصورة",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingReview) {
        // Update existing review
        await updateReviewImage(editingReview.id, formData);
        toast({
          title: "تم تحديث التقييم",
          description: "تم تحديث صورة التقييم بنجاح"
        });
      } else {
        // Add new review
        await addReviewImage(formData);
        toast({
          title: "تم إضافة التقييم",
          description: "تم إضافة صورة التقييم بنجاح"
        });
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ التقييم، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (review: ReviewImage) => {
    setEditingReview(review);
    setFormData({
      imageUrl: review.imageUrl,
      isActive: review.isActive,
      order: review.order
    });
    setShowForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReviewImage(reviewId);
      toast({
        title: "تم حذف التقييم",
        description: "تم حذف صورة التقييم بنجاح"
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف التقييم، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const handleReorder = async (reviewId: string, direction: 'up' | 'down') => {
    const review = reviewImages.find(r => r.id === reviewId);
    if (!review) return;

    const newOrder = direction === 'up' ? review.order - 1 : review.order + 1;
    
    // Find the review that currently has the target order
    const targetReview = reviewImages.find(r => r.order === newOrder);
    
    try {
      // Swap orders
      if (targetReview) {
        await updateReviewImage(targetReview.id, { order: review.order });
      }
      await updateReviewImage(reviewId, { order: newOrder });
      
      toast({
        title: "تم تغيير الترتيب",
        description: "تم تحديث ترتيب التقييم بنجاح"
      });
    } catch (error) {
      console.error('Error reordering review:', error);
      toast({
        title: "خطأ في تغيير الترتيب",
        description: "فشل في تحديث الترتيب، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReview(undefined);
    setFormData({
      imageUrl: '',
      isActive: true,
      order: reviewImages.length + 1
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة صور التقييمات</h2>
        <Button
          className="rounded-full btn-gold-real px-4 py-2 shadow-sm magnetic-hover"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة صورة تقييم
        </Button>
      </div>

      {reviewImages.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد صور تقييمات</h3>
            <p className="text-muted-foreground mb-4">
              أضف أول صورة تقييم لعرض آراء العملاء في الموقع.
            </p>
            <Button
              className="rounded-full btn-gold-real px-4 py-2 shadow-sm magnetic-hover"
              onClick={() => setShowForm(true)}
            >
              أضف أول صورة تقييم
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewImages.map((review) => (
            <Card key={review.id} className="shadow-soft">
              <CardContent className="p-4">
                <div 
                  className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(review.imageUrl, '_blank')}
                  title="اضغط لعرض الصورة بحجم أكبر"
                >
                  <img
                    src={review.imageUrl}
                    alt="صورة تقييم"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        #{review.order}
                      </Badge>
                      <Badge variant={review.isActive ? "default" : "secondary"} className="text-xs">
                        {review.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(review)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(review.id, 'up')}
                      disabled={review.order === 1}
                      title="تحريك لأعلى"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(review.id, 'down')}
                      disabled={review.order === reviewImages.length}
                      title="تحريك لأسفل"
                    >
                      ↓
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
                          <AlertDialogTitle>تأكيد حذف التقييم</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(review.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-xl w-full max-h-[90vh] overflow-y-auto sm:max-w-xl max-w-[95vw] mx-2">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold text-center">
              {editingReview ? 'تعديل صورة التقييم' : 'إضافة صورة تقييم جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6 px-1 sm:px-2">
            {/* Image URL */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="imageUrl" className="text-sm sm:text-base font-semibold">لينك صورة التقييم</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                type="url"
                className="text-sm sm:text-base py-2 sm:py-3"
              />
              {formData.imageUrl && (
                <div className="mt-2 sm:mt-4 border rounded-lg p-2 bg-gray-50">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">معاينة الصورة:</p>
                  <img
                    src={formData.imageUrl}
                    alt="معاينة"
                    className="w-full max-h-48 sm:max-h-64 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Order */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="order" className="text-sm sm:text-base font-semibold">ترتيب العرض</Label>
              <Input
                id="order"
                type="number"
                min="1"
                max={editingReview ? reviewImages.length : reviewImages.length + 1}
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                className="text-sm sm:text-base py-2 sm:py-3"
              />
              <p className="text-xs sm:text-sm text-muted-foreground bg-blue-50 p-2 sm:p-3 rounded-lg">
                {editingReview ? 
                  `الترتيب الحالي: 1 إلى ${reviewImages.length}` : 
                  `سيتم إضافته في الترتيب ${reviewImages.length + 1} إذا لم تغير الرقم`
                }
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2 sm:space-x-3 bg-green-50 p-3 sm:p-4 rounded-lg">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded"
              />
              <Label htmlFor="isActive" className="text-sm sm:text-base font-medium cursor-pointer">
                نشط (سيظهر في الموقع)
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
              <Button
                onClick={handleSave}
                disabled={isLoading || !formData.imageUrl.trim()}
                className="flex-1 py-2 sm:py-3 text-sm sm:text-base font-semibold"
              >
                {isLoading ? 'جاري الحفظ...' : (editingReview ? 'تحديث' : 'إضافة')}
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseForm}
                disabled={isLoading}
                className="px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};