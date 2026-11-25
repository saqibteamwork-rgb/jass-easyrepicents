export type CouponType = 'pro' | 'premium' | 'custom';

export interface Coupon {
  id: string;
  code: string; // 4-digit for pro, 5-digit for premium, or custom alphanumeric
  type: CouponType;
  title?: string;
  durationDays: number; // e.g. 30 days for Pro, 365 days for Premium, 3 days for Custom
  maxUses: number; // max number of accounts allowed (e.g. 10, 15)
  usedCount: number; // how many accounts have used it
  customSlipLimit?: number; // for custom coupons (e.g. 25 slips / day)
  isActive: boolean;
  createdAt: string;
  expiresAt?: string | null;
  usedByUserIds: string[]; // list of user ids who claimed this coupon
}

export interface CouponRedemptionResult {
  success: boolean;
  message: string;
  coupon?: Coupon;
}
