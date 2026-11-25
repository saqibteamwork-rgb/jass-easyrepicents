import React from 'react';
import { SlipData } from '../types/slip';
import { Sliders, Shield, Printer, FileText } from 'lucide-react';

interface Props {
  data: SlipData;
  onChange: (data: SlipData) => void;
}

export const ExportSettingsView: React.FC<Props> = ({ data, onChange }) => {
  const updateField = <K extends keyof SlipData>(key: K, value: SlipData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1E1B1C] tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-[#84142D]" />
          Slip Export & Typography Settings
        </h1>
        <p className="text-xs text-[#574143] mt-1">
          Calibrate print resolutions, watermark endorsements, and thermal receipt formats.
        </p>
      </div>

      <div className="bg-white border border-[#ECE6E7] rounded-2xl p-6 shadow-xs space-y-6">
        {/* Currency & Symbol */}
        <div>
          <h3 className="text-sm font-bold text-[#1E1B1C] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#84142D]" />
            Currency & Prefix Symbol
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Rs. ', 'PKR ', '₨ ', '$ '].map((prefix) => (
              <button
                key={prefix}
                type="button"
                onClick={() => updateField('currencyPrefix', prefix)}
                className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                  data.currencyPrefix === prefix
                    ? 'border-[#84142D] bg-[#FDF1F3] text-[#84142D]'
                    : 'border-[#ECE6E7] bg-white text-[#574143] hover:bg-[#FAF7F7]'
                }`}
              >
                {prefix} ({prefix.trim()})
              </button>
            ))}
          </div>
        </div>

        {/* Security Watermark */}
        <div className="pt-4 border-t border-[#F5ECED]">
          <h3 className="text-sm font-bold text-[#1E1B1C] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#84142D]" />
            Ledger Cryptographic Endorsement
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1B1C] cursor-pointer">
              <input
                type="checkbox"
                checked={data.showWatermark}
                onChange={(e) => updateField('showWatermark', e.target.checked)}
                className="rounded text-[#84142D]"
              />
              Embed Digital Verification Watermark on Output Slip
            </label>

            {data.showWatermark && (
              <div>
                <label className="block text-xs font-semibold text-[#574143] mb-1">
                  Watermark Label Text
                </label>
                <input
                  type="text"
                  value={data.watermarkText || ''}
                  onChange={(e) => updateField('watermarkText', e.target.value)}
                  placeholder="e.g. 1LINK VERIFIED • CENTRAL CLEARING SETTLEMENT"
                  className="w-full px-3 py-2 text-sm bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:border-[#84142D]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notches Geometry */}
        <div className="pt-4 border-t border-[#F5ECED]">
          <h3 className="text-sm font-bold text-[#1E1B1C] mb-3 flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#84142D]" />
            Ticket Perforation Geometry
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => updateField('notchStyle', 'round')}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.notchStyle === 'round'
                  ? 'border-[#84142D] bg-[#FDF1F3]'
                  : 'border-[#ECE6E7] bg-white hover:bg-[#FAF7F7]'
              }`}
            >
              <div className="text-xs font-bold text-[#1E1B1C]">Micro Notches</div>
              <div className="text-[11px] text-[#7A7273] mt-0.5">Semicircular ticket punch-outs</div>
            </button>

            <button
              type="button"
              onClick={() => updateField('notchStyle', 'square')}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.notchStyle === 'square'
                  ? 'border-[#84142D] bg-[#FDF1F3]'
                  : 'border-[#ECE6E7] bg-white hover:bg-[#FAF7F7]'
              }`}
            >
              <div className="text-xs font-bold text-[#1E1B1C]">POS Thermal Punch</div>
              <div className="text-[11px] text-[#7A7273] mt-0.5">Square perforation edges</div>
            </button>

            <button
              type="button"
              onClick={() => updateField('notchStyle', 'none')}
              className={`p-3 rounded-xl border text-left transition-all ${
                data.notchStyle === 'none'
                  ? 'border-[#84142D] bg-[#FDF1F3]'
                  : 'border-[#ECE6E7] bg-white hover:bg-[#FAF7F7]'
              }`}
            >
              <div className="text-xs font-bold text-[#1E1B1C]">Flat Edge</div>
              <div className="text-[11px] text-[#7A7273] mt-0.5">Standard clean borders</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
