import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { useReviews } from '@/hooks/useReviews';
import { Review } from '@/types/review';
import { Star, Check, X, Trash2, Eye, EyeOff, Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';

export const ReviewManagement: React.FC = () => {
  const { reviews, loading, error, addNewReview, updateReviewStatus, updateReviewData, removeReview } = useReviews();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    isApproved: true
  });
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    isApproved: true
  });

  const handleApproveToggle = async (review: Review) => {
    try {
      await updateReviewStatus(review.id, !review.isApproved);
      toast.success(review.isApproved ? 'تم إخفاء التقييم' : 'تم الموافقة على التقييم');
    } catch (error) {
      toast.error('حدث خطأ في تحديث التقييم');
    }
  };

  const handleDelete = async (review: Review) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      try {
        await removeReview(review.id);
        toast.success('تم حذف التقييم بنجاح');
      } catch (error) {
        toast.error('حدث خطأ في حذف التقييم');
      }
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved
    });
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    if (!editForm.customerName.trim() || !editForm.comment.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await updateReviewData(editingReview.id, {
        customerName: editForm.customerName,
        rating: editForm.rating,
        comment: editForm.comment,
        isApproved: editForm.isApproved
      });
      toast.success('تم تحديث التقييم بنجاح');
      setEditingReview(null);
    } catch (error) {
      toast.error('حدث خطأ في تحديث التقييم');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.customerName.trim() || !newReview.comment.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await addNewReview(newReview);
      toast.success('تم إضافة التقييم بنجاح');
      setNewReview({ customerName: '', rating: 5, comment: '', isApproved: true });
      setShowAddForm(false);
    } catch (error) {
      toast.error('حدث خطأ في إضافة التقييم');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            إدارة التقييمات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-classic mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري تحميل التقييمات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            إدارة التقييمات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">خطأ في تحميل التقييمات: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const approvedReviews = reviews.filter(review => review.isApproved);
  const pendingReviews = reviews.filter(review => !review.isApproved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          إدارة التقييمات
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-gold-real magnetic-hover"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة تقييم
        </Button>
      </div>

      {/* Edit Review Form */}
      {editingReview && (
        <Card>
          <CardHeader>
            <CardTitle>تعديل التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العميل *
                </label>
                <input
                  type="text"
                  value={editForm.customerName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-classic focus:border-gold-classic"
                  placeholder="أدخل اسم العميل"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التقييم *
                </label>
                <StarRating
                  rating={editForm.rating}
                  interactive={true}
                  onRatingChange={(rating) => setEditForm(prev => ({ ...prev, rating }))}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التعليق *
                </label>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-classic focus:border-gold-classic"
                  rows={4}
                  placeholder="أدخل تعليق العميل"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="editIsApproved"
                  checked={editForm.isApproved}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isApproved: e.target.checked }))}
                  className="rounded border-gray-300 text-gold-classic focus:ring-gold-classic"
                />
                <label htmlFor="editIsApproved" className="text-sm text-gray-700">
                  موافقة فورية (ظاهر في الموقع)
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="btn-gold-real">
                  حفظ التغييرات
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingReview(null)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Review Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة تقييم جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العميل *
                </label>
                <input
                  type="text"
                  value={newReview.customerName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-classic focus:border-gold-classic"
                  placeholder="أدخل اسم العميل"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التقييم *
                </label>
                <StarRating
                  rating={newReview.rating}
                  interactive={true}
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  size="lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التعليق *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-classic focus:border-gold-classic"
                  rows={4}
                  placeholder="أدخل تعليق العميل"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isApproved"
                  checked={newReview.isApproved}
                  onChange={(e) => setNewReview(prev => ({ ...prev, isApproved: e.target.checked }))}
                  className="rounded border-gray-300 text-gold-classic focus:ring-gold-classic"
                />
                <label htmlFor="isApproved" className="text-sm text-gray-700">
                  موافقة فورية (ظاهر في الموقع)
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="btn-gold-real">
                  إضافة التقييم
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats removed as requested */}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقييمات بعد</h3>
              <p className="text-gray-600 mb-4">ابدأ بإضافة تقييمات لعملائك</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="btn-gold-real magnetic-hover"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة أول تقييم
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className={`${!review.isApproved ? 'opacity-75' : ''} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 ${review.isApproved ? 'border-l-green-500' : 'border-l-orange-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header with name and date */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold-classic to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-gold-classic/20">
                          {review.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{review.customerName}</h4>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-sm text-gray-500">
                              {review.date.toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Comment */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border-r-4 border-gold-classic/30">
                      <p className="text-gray-800 leading-relaxed text-base font-medium italic">"{review.comment}"</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge 
                        variant={review.isApproved ? "default" : "secondary"}
                        className={`px-4 py-2 text-sm font-semibold rounded-full shadow-sm ${
                          review.isApproved 
                            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                            : 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
                        }`}
                      >
                        {review.isApproved ? '✅ موافق عليه' : '⏳ في الانتظار'}
                      </Badge>
                    </div>

                    {/* Approve Button */}
                    {!review.isApproved && (
                      <div className="mb-3">
                        <Button
                          size="sm"
                          onClick={() => handleApproveToggle(review)}
                          className="btn-gold-real text-xs px-3 py-1 h-7"
                        >
                          ✅ موافق عليه
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 bg-gray-50 p-2 rounded-lg border">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(review)}
                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-all duration-200"
                      title="تعديل التقييم"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleApproveToggle(review)}
                      className={`h-6 w-6 p-0 rounded transition-all duration-200 ${
                        review.isApproved 
                          ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-100' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-100'
                      }`}
                      title={review.isApproved ? 'إخفاء التقييم' : 'إظهار التقييم'}
                    >
                      {review.isApproved ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(review)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 rounded transition-all duration-200"
                      title="حذف التقييم"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
