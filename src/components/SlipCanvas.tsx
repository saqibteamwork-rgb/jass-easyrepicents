import React, { useState } from 'react';
import { SlipData } from '../types/slip';
import { SlipRenderer } from './slips/SlipRenderer';
import { 
  Copy, 
  Share2, 
  Download, 
  FileText, 
  Maximize2, 
  Smartphone, 
  Check, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

interface Props {
  data: SlipData;
  slipRef: React.RefObject<HTMLDivElement | null>;
  onExportPng: () => void;
  onExportPdf: () => void;
  onCopyImage: () => void;
  onShareWhatsApp: () => void;
  isCopied?: boolean;
}

export const SlipCanvas: React.FC<Props> = ({
  data,
  slipRef,
  onExportPng,
  onExportPdf,
  onCopyImage,
  onShareWhatsApp,
  isCopied = false,
}) => {
  const [showFrame, setShowFrame] = useState(false);

  return (
    <div className="flex flex-col h-full sticky top-20 w-full max-w-[440px] mx-auto">
      {/* Canvas Top Bar */}
      <div className="bg-white border border-[#ECE6E7] rounded-t-2xl p-2.5 sm:p-3 px-3 sm:px-4 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#00A859] animate-ping shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-[#1E1B1C] tracking-tight uppercase truncate">
            Live Preview
          </span>
          <span className="hidden xs:inline text-[10px] font-mono text-[#7A7273] bg-[#F5ECED] px-1.5 py-0.5 rounded">
            390px
          </span>
        </div>

        {/* Quick Action Strip */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-xs">
          <button
            type="button"
            onClick={onCopyImage}
            title="Copy Slip Image to Clipboard"
            className="flex items-center gap-1 px-2 py-1.5 bg-white border border-[#D9D3D4] hover:bg-gray-50 text-[#1E1B1C] font-semibold rounded-lg transition-colors cursor-pointer text-xs"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-700 text-[11px] hidden xs:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#574143]" />
                <span className="text-[11px] hidden xs:inline">Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onShareWhatsApp}
            title="Share via WhatsApp"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 bg-[#EBF7EE] border border-[#25D366]/40 hover:bg-[#25D366] text-[#075E54] hover:text-white font-semibold rounded-lg transition-colors cursor-pointer text-xs group"
          >
            <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366] group-hover:text-white transition-colors" />
            <span className="text-[11px] hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onExportPng}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#84142D] hover:bg-[#6B1024] text-white font-bold rounded-lg transition-colors cursor-pointer shadow-2xs text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px]">Save PNG</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport (Auto-scaling responsive viewport) */}
      <div className="bg-[#EAE4E5]/40 border-x border-b border-[#ECE6E7] rounded-b-2xl p-2 sm:p-6 flex items-center justify-center min-h-[580px] sm:min-h-[640px] overflow-hidden">
        <div className="w-full flex justify-center py-2 max-w-full overflow-hidden">
          {/* Responsive scale wrapper for mobile screens < 400px */}
          <div className="w-full max-w-[390px] flex justify-center overflow-visible transform scale-[0.88] xs:scale-[0.94] sm:scale-100 origin-top">
            <SlipRenderer
              data={data}
              innerRef={slipRef}
              showFrame={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
