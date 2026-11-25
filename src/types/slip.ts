export type SlipProvider = 'jazzcash' | 'easypaisa' | 'raast' | 'sadapay' | 'nayapay' | 'bank_alfalah' | 'thermal';

export interface SlipData {
  id: string;
  provider: SlipProvider;
  statusTitle: string;
  statusSubtitle: string;
  tid: string;
  dateTime: string;
  fundingSource: string;
  
  // Recipient
  recipientName: string;
  recipientAccount: string;
  maskRecipientAccount?: boolean;
  recipientIban?: string;
  recipientBank?: string;
  
  // Sender
  senderName: string;
  senderAccount: string;
  showSender: boolean;
  
  // Financials
  amount: number;
  fee: number;
  totalAmount?: number;
  currencyPrefix: string;
  purposeOfPayment?: string;
  
  // Customization
  badgeImageUrl?: string;
  watermarkText?: string;
  showWatermark: boolean;
  notchStyle: 'round' | 'square' | 'none';
  deviceFrame: boolean;
  notes?: string;
  createdAt: number;
  imageUrl?: string; // Stored backend ImageKit URL
}

export interface PresetConfig {
  id: SlipProvider;
  name: string;
  badgeName: string;
  color: string;
  dotColor: string;
  defaultData: Omit<SlipData, 'id' | 'createdAt'>;
}
