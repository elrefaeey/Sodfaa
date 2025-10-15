export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5 stars
  comment: string;
  date: Date;
  isApproved: boolean;
  productId?: string; // Optional - for product-specific reviews
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

