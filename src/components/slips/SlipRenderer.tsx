import React from 'react';
import { SlipData } from '../../types/slip';
import { JazzCashSlip } from './JazzCashSlip';
import { EasypaisaSlip } from './EasypaisaSlip';
import { RaastSlip } from './RaastSlip';
import { SadaPaySlip } from './SadaPaySlip';
import { ThermalReceiptSlip } from './ThermalReceiptSlip';
import { Wifi, Signal, Battery } from 'lucide-react';

interface Props {
  data: SlipData;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  showFrame?: boolean;
}

export const SlipRenderer: React.FC<Props> = ({ data, innerRef, showFrame = false }) => {
  const renderProviderSlip = () => {
    switch (data.provider) {
      case 'jazzcash':
        return <JazzCashSlip data={data} />;
      case 'easypaisa':
        return <EasypaisaSlip data={data} />;
      case 'raast':
      case 'bank_alfalah':
        return <RaastSlip data={data} />;
      case 'sadapay':
      case 'nayapay':
        return <SadaPaySlip data={data} />;
      case 'thermal':
        return <ThermalReceiptSlip data={data} />;
      default:
        return <JazzCashSlip data={data} />;
    }
  };

  const isThermal = data.provider === 'thermal';

  // Clean standalone slip view & export target (fixed 390px width for pixel-perfect symmetry)
  if (!showFrame || isThermal) {
    return (
      <div
        ref={innerRef}
        id="printable-slip"
        style={{ width: '390px', minWidth: '390px', maxWidth: '390px' }}
        className="mx-auto overflow-hidden text-[#1E1B1C] bg-transparent flex flex-col items-center"
      >
        {renderProviderSlip()}
      </div>
    );
  }

  // Optional Phone Mockup Wrapper
  return (
    <div
      style={{ width: '410px', maxWidth: '410px' }}
      className="mx-auto bg-[#1C201E] p-2.5 rounded-[44px] shadow-[0_24px_60px_-12px_rgba(20,30,24,0.35)] border-[5px] border-[#2A312D] relative transition-all duration-300"
    >
      {/* Phone Camera Notch Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#18261F] border border-[#2E4237]" />
      </div>

      {/* Screen Container */}
      <div className="bg-white rounded-[36px] overflow-hidden relative flex flex-col min-h-[640px] shadow-inner">
        {/* Status Bar */}
        <div className="w-full px-6 pt-3 pb-1 flex items-center justify-between text-xs text-[#1E1B1C] z-10 select-none font-medium">
          <span className="text-[11px] font-bold">9:41</span>
          <div className="flex items-center gap-1.5 opacity-85">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Clean Slip Content inside innerRef */}
        <div
          ref={innerRef}
          id="printable-slip"
          style={{ width: '390px', minWidth: '390px', maxWidth: '390px' }}
          className="flex-1 flex flex-col items-center justify-start mx-auto"
        >
          {renderProviderSlip()}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full py-2.5 flex justify-center bg-transparent mt-auto select-none">
          <div className="w-32 h-1 bg-[#333835] rounded-full opacity-60" />
        </div>
      </div>
    </div>
  );
};
