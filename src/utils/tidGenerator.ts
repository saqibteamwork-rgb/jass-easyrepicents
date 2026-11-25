import { SlipProvider } from '../types/slip';

export function generateTID(provider: SlipProvider): string {
  const timestamp = Date.now().toString();
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  
  switch (provider) {
    case 'jazzcash':
      // 12-digit numeric TID like 726196409195
      const prefix = ['726', '728', '730', '814', '692'][Math.floor(Math.random() * 5)];
      const middle = Math.floor(100000 + Math.random() * 900000).toString();
      const suffix = Math.floor(100 + Math.random() * 900).toString();
      return `${prefix}${middle}${suffix}`;
      
    case 'easypaisa':
      // # followed by 11 digits like #56879236840
      const epPrefix = ['568', '572', '601', '489', '774'][Math.floor(Math.random() * 5)];
      const epBody = Math.floor(10000000 + Math.random() * 90000000).toString();
      return `#${epPrefix}${epBody}`;
      
    case 'raast':
      // Raast transaction ref format RAST-PK-XXXXXXXXXX
      return `RAAST${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    case 'sadapay':
      return `SP-${Math.floor(10000000 + Math.random() * 90000000)}`;

    case 'nayapay':
      return `NP-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    case 'bank_alfalah':
      return `BAFL-${Math.floor(100000000 + Math.random() * 900000000)}`;

    case 'thermal':
      return `TXN-${randomDigits}-${timestamp.slice(-4)}`;

    default:
      return `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  }
}

export function formatCurrentDateTime(provider: SlipProvider): string {
  const now = new Date();
  
  if (provider === 'jazzcash') {
    // Format: "October 5,2026 at 17:27"
    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${month} ${day},${year} at ${hours}:${minutes}`;
  }
  
  if (provider === 'easypaisa') {
    // Format: "05 October 2026, 8:51 AM"
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day} ${month} ${year}, ${timeStr}`;
  }

  // General format
  return now.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function maskIban(iban: string): string {
  if (!iban) return '';
  const clean = iban.replace(/\s+/g, '');
  if (clean.length <= 6) return clean;
  const prefix = clean.slice(0, 2);
  const suffix = clean.slice(-4);
  const asterisks = '*'.repeat(Math.max(4, clean.length - 6));
  return `${prefix}${asterisks}${suffix}`;
}
