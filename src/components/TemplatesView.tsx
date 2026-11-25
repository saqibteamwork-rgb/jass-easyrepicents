import React from 'react';
import { SlipData, SlipProvider } from '../types/slip';
import { PRESETS } from '../data/presets';
import { JazzCashSlip } from './slips/JazzCashSlip';
import { EasypaisaSlip } from './slips/EasypaisaSlip';
import { RaastSlip } from './slips/RaastSlip';
import { SadaPaySlip } from './slips/SadaPaySlip';
import { ThermalReceiptSlip } from './slips/ThermalReceiptSlip';
import { Check, Sparkles, ArrowRight, Lock, ShieldCheck, RefreshCw } from 'lucide-react';

interface Props {
  onSelectPreset: (provider: SlipProvider, force?: boolean) => void;
  activeProvider: SlipProvider;
  enabledProviders?: Record<SlipProvider, boolean>;
}

export const TemplatesView: React.FC<Props> = ({ onSelectPreset, activeProvider, enabledProviders }) => {
  const readyProviders: SlipProvider[] = ['jazzcash', 'easypaisa'];
  const comingSoonProviders: SlipProvider[] = ['raast', 'bank_alfalah', 'nayapay', 'sadapay', 'thermal'];

  const allProviders: SlipProvider[] = [...readyProviders, ...comingSoonProviders];

  const renderMiniSlip = (provider: SlipProvider) => {
    const config = PRESETS[provider];
    const mockData: SlipData = {
      ...config.defaultData,
      id: 'preview-' + provider,
      createdAt: Date.now(),
    };

    switch (provider) {
      case 'jazzcash':
        return <JazzCashSlip data={mockData} />;
      case 'easypaisa':
        return <EasypaisaSlip data={mockData} />;
      case 'raast':
      case 'bank_alfalah':
        return <RaastSlip data={mockData} />;
      case 'sadapay':
      case 'nayapay':
        return <SadaPaySlip data={mockData} />;
      case 'thermal':
        return <ThermalReceiptSlip data={mockData} />;
      default:
        return <EasypaisaSlip data={mockData} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-xs font-bold text-[#00A859] border border-[#BCE8CB]">
          <ShieldCheck className="w-3.5 h-3.5" />
          OFFICIAL VERIFIED BLUEPRINTS
        </div>
        <h1 className="text-3xl font-extrabold text-[#1E1B1C] tracking-tight">
          Fintech Receipt Blueprints
        </h1>
        <p className="text-sm text-[#574143]">
          JazzCash & Easypaisa engines are 100% production-ready. Classic templates can also be used via &ldquo;Force Old Version&rdquo; mode.
        </p>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProviders.map((key) => {
          const preset = PRESETS[key];
          const isReady = readyProviders.includes(key);
          const isCurrent = activeProvider === key;

          return (
            <div
              key={key}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col relative ${
                isCurrent
                  ? 'border-[#84142D] ring-2 ring-[#84142D]/20 shadow-lg'
                  : isReady
                  ? 'border-[#ECE6E7] hover:border-[#84142D]/40 hover:shadow-md'
                  : 'border-[#EAE3E4] opacity-95'
              }`}
            >
              {/* Template Card Top Header */}
              <div className="p-4 border-b border-[#F5ECED] flex items-center justify-between bg-[#FAF7F7]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="font-extrabold text-sm text-[#1E1B1C]">
                    {preset.name}
                  </span>
                </div>
                {isReady ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00A859] bg-[#E8F7EE] px-2 py-0.5 rounded-full border border-[#BCE8CB]">
                    ✓ 100% Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Lock className="w-3 h-3 text-amber-600" />
                    v2.0 Soon • v1 Available
                  </span>
                )}
              </div>

              {/* Scaled Preview Box */}
              <div className="p-4 bg-[#F8F6F6] flex-1 flex items-center justify-center overflow-hidden max-h-[420px] relative">
                <div className={`transform scale-[0.7] origin-top w-full max-w-[360px] pointer-events-none drop-shadow-sm ${!isReady ? 'filter blur-[1.5px] opacity-85' : ''}`}>
                  {renderMiniSlip(key)}
                </div>

                {/* Coming Soon Notice Badge for classic unready providers */}
                {!isReady && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-5 text-center z-10 select-none">
                    <div className="w-10 h-10 rounded-full bg-amber-100/90 border border-amber-300 flex items-center justify-center text-amber-700 mb-2 shadow-xs">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-[#1E1B1C] uppercase tracking-wider">
                      New Version Coming Soon
                    </span>
                    <p className="text-[11px] text-[#554D4F] mt-1 max-w-[210px] leading-relaxed">
                      Available in Classic v1 engine. Official v2.0 arriving soon.
                    </p>
                    <div className="mt-3 flex flex-col gap-2 w-full max-w-[200px]">
                      <button
                        type="button"
                        onClick={() => onSelectPreset(key)}
                        className="w-full py-1.5 px-3 text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Force to Use Old Version</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer selection button */}
              <div className="p-4 border-t border-[#F5ECED] bg-white">
                {enabledProviders && enabledProviders[key] === false ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-dashed border-gray-300"
                  >
                    Engine Disabled by Admin
                  </button>
                ) : isReady ? (
                  <button
                    type="button"
                    onClick={() => onSelectPreset(key)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#84142D] text-white shadow-xs'
                        : 'bg-[#F5ECED] text-[#574143] hover:bg-[#84142D] hover:text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Currently Active' : 'Load Blueprint'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPreset(key)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isCurrent ? 'Active (Classic v1)' : 'Force to Use Old Version'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
