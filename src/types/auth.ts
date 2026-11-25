export type UserPlan = 'free' | 'pro' | 'premium' | 'custom';

export interface UserProfile {
  id: string;
  customId: string;
  email: string;
  username: string;
  plan: UserPlan;
  createdAt: string;
  expiresAt?: string | null;
  slipsCreatedToday: number;
  totalSlipsCreated: number;
  customDailyLimit?: number; // for custom coupons
  redeemedCouponCode?: string;
}

export interface PlanConfig {
  dailyLimit: number;
  durationDays: number;
  allowCustomFields: boolean;
  allowHighResExport: boolean;
  watermarkMandatory: boolean;
}

export const PLAN_CONFIGS: Record<UserPlan, PlanConfig> = {
  free: {
    dailyLimit: 3,
    durationDays: 365,
    allowCustomFields: true,
    allowHighResExport: true,
    watermarkMandatory: false,
  },
  pro: {
    dailyLimit: 15,
    durationDays: 30,
    allowCustomFields: true,
    allowHighResExport: true,
    watermarkMandatory: false,
  },
  premium: {
    dailyLimit: 999999, // Unlimited
    durationDays: 365,
    allowCustomFields: true,
    allowHighResExport: true,
    watermarkMandatory: false,
  },
  custom: {
    dailyLimit: 25,
    durationDays: 3,
    allowCustomFields: true,
    allowHighResExport: true,
    watermarkMandatory: false,
  },
};
