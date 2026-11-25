

import { SlipData } from '../types/slip';

function getExportOptions(element: HTMLElement) {
  const width = 390;
  const height = element.offsetHeight || element.scrollHeight || 740;
  const childElement = (element.firstElementChild as HTMLElement) || element;
  const computedBg = window.getComputedStyle(childElement).backgroundColor;
  const bgColor = computedBg && computedBg !== 'rgba(0, 0, 0, 0)' && computedBg !== 'transparent' ? computedBg : undefined;

  return {
    quality: 0.98,
    pixelRatio: 2.5,
    width,
    height,
    skipFonts: true,
    fontEmbedCSS: '',
    cacheBust: true,
    backgroundColor: bgColor,
    style: {
      width: `${width}px`,
      minWidth: `${width}px`,
      maxWidth: `${width}px`,
      margin: '0 auto',
      transform: 'none',
      left: '0',
      top: '0',
    },
  };
}

export async function downloadSlipAsPng(element: HTMLElement, filename = 'transaction-slip.png') {
  try {
    const options = getExportOptions(element);
    const dataUrl = await (await import('html-to-image')).toPng(element, options);

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (error) {
    console.error('Error generating PNG:', error);
    return false;
  }
}

export async function downloadSlipAsPdf(element: HTMLElement, filename = 'transaction-slip.pdf') {
  try {
    const options = getExportOptions(element);
    const dataUrl = await (await import('html-to-image')).toPng(element, options);

    const pdf = new (await import('jspdf')).jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Centered vertical alignment
    const marginX = 20;
    const targetWidth = pdfWidth - marginX * 2;
    const targetHeight = (imgProps.height * targetWidth) / imgProps.width;
    const posY = Math.max(15, (pdf.internal.pageSize.getHeight() - targetHeight) / 2);

    pdf.addImage(dataUrl, 'PNG', marginX, posY, targetWidth, targetHeight, undefined, 'FAST');
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

export async function copySlipImageToClipboard(element: HTMLElement): Promise<boolean> {
  try {
    const options = getExportOptions(element);
    const blob = await (await import('html-to-image')).toBlob(element, {
      ...options,
      pixelRatio: 2,
    });

    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

export function shareSlipToWhatsApp(data: SlipData) {
  const total = (data.amount + (data.fee || 0)).toFixed(2);
  const text = `*${data.statusTitle}* 💳\n` +
    `📌 *Provider:* ${data.provider.toUpperCase()}\n` +
    `👤 *Transferred to:* ${data.recipientName} (${data.recipientAccount})\n` +
    `💰 *Amount:* ${data.currencyPrefix}${total}\n` +
    `🔢 *TID:* ${data.tid}\n` +
    `📅 *Date:* ${data.dateTime}\n` +
    `🛡️ *Status:* Verified via Crimson Ledger Studio`;

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
