export interface ICoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  stripeCouponId: string;
  stripePromoCodeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  payments?: {
    id: string;
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
  }[];
  _count?: {
    payments: number;
  };
}

export interface ICouponsResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      totalCouponUses: number;
      revenueFromCoupons: number;
      totalDiscountGiven: number;
      activeCoupons: number;
    };
    data: ICoupon[];
  };
}

export interface ICouponResponse {
  success: boolean;
  message: string;
  data: ICoupon;
}

export interface ICreateCouponRequest {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  usageLimit: number;
  expiryDate: string;
}

export interface IUpdateCouponRequest {
  code?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  usageLimit?: number;
  expiryDate?: string;
  isActive?: boolean;
}
