import { SlipProvider } from './slip';

export interface AdminSettings {
  adminPin: string;
  dailySlipLimit: number;
  freeTierDailyLimit: number;
  proTierDailyLimit: number;
  premiumTierDailyLimit: number;
  enforceLimit: boolean;
  enforceWatermark: boolean;
  watermarkBrandText: string;
  allowClassicEngines: boolean;
  enabledProviders: Record<SlipProvider, boolean>;
  broadcastBanner: {
    enabled: boolean;
    text: string;
    variant: 'info' | 'alert' | 'success';
  };
  upgradePrices: {
    proMonthly: number;
    proYearly: number;
    premiumMonthly: number;
    premiumYearly: number;
  };
}

export interface UserUsageStats {
  todayDate: string;
  slipsCreatedToday: number;
  totalLifetimeSlips: number;
  totalVolumeSimulated: number;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  adminPin: 'saqib786',
  dailySlipLimit: 15,
  freeTierDailyLimit: 3,
  proTierDailyLimit: 15,
  premiumTierDailyLimit: 999999, // Unlimited
  enforceLimit: false,
  enforceWatermark: false,
  watermarkBrandText: 'CrimsonLedger Verified Slip',
  allowClassicEngines: true,
  enabledProviders: {
    jazzcash: true,
    easypaisa: true,
    raast: true,
    sadapay: true,
    nayapay: true,
    bank_alfalah: true,
    thermal: true,
  },
  broadcastBanner: {
    enabled: false,
    text: '',
    variant: 'info',
  },
  upgradePrices: {
    proMonthly: 50,
    proYearly: 500,
    premiumMonthly: 200,
    premiumYearly: 2000,
  },
};

