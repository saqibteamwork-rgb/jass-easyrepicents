import React from 'react';
import { X, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { creatorPhotoBase64 } from '../assets/creatorAsset';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WHATSAPP_CHANNEL_URL = 'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I';

export const WhatsAppChannelModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-100 text-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top border in official WhatsApp green */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* WhatsApp Avatar & Official WhatsApp Badge */}
        <div className="relative mx-auto w-20 h-20 mb-3.5">
          <div className="w-20 h-20 rounded-full ring-4 ring-[#25D366]/30 overflow-hidden mx-auto shadow-md">
            <img
              src={creatorPhotoBase64}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#25D366] text-white p-1.5 rounded-full ring-2 ring-white shadow-md flex items-center justify-center">
            <FaWhatsapp className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Pill Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F8EE] border border-[#25D366]/40 text-[#075E54] text-[11px] font-extrabold tracking-wide uppercase mb-2">
          <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Official WhatsApp Channel</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-black text-[#1E1B1C] tracking-tight">
          Join Admin on WhatsApp
        </h3>
        <p className="text-xs text-[#5E5557] mt-2 leading-relaxed">
          Stay updated with latest slip templates, v2.0 releases, fintech updates, and direct support by following our official channel!
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col gap-2 pt-2">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-all cursor-pointer"
          >
            <FaWhatsapp className="w-4 h-4 text-white text-base" />
            <span>Follow WhatsApp Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

