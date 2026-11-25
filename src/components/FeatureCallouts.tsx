import React from 'react';
import { ShieldCheck, QrCode, Cpu, Layers, Award } from 'lucide-react';

export const FeatureCallouts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      {/* Feature 1 */}
      <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-[#84142D]/40 transition-all">
        <div className="w-10 h-10 rounded-xl bg-[#FDF1F3] text-[#84142D] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-[#1E1B1C] mb-2 tracking-tight">
          Micro–Notch Geometry
        </h3>
        <p className="text-xs text-[#574143] leading-relaxed">
          Faithfully reproduces physical ATM/POS thermal punch-outs with CSS clipping and radial mask arcs for tactile veracity.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-[#84142D]/40 transition-all">
        <div className="w-10 h-10 rounded-xl bg-[#FFF9E6] text-[#B87A00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <QrCode className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-[#1E1B1C] mb-2 tracking-tight">
          Valid TID Sequencer
        </h3>
        <p className="text-xs text-[#574143] leading-relaxed">
          Generates mathematically formatted 12-digit transaction identifiers compliant with 1Link and JazzCash switch gateways.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:border-[#84142D]/40 transition-all">
        <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#00A859] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <Award className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-[#1E1B1C] mb-2 tracking-tight">
          300 DPI Thermal Raster
        </h3>
        <p className="text-xs text-[#574143] leading-relaxed">
          Direct export to lossless vector-aligned bitmap formats for pristine printing or instant proof delivery to customers.
        </p>
      </div>
    </div>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAF7F7] border-t border-[#ECE6E7] py-6 mt-16 text-xs text-[#7A7273]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#84142D]" />
          <span>Regulatory Compliant Ledger Format • End-to-End Cryptographic Watermark</span>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-[#574143]">
          <span className="hover:text-[#1E1B1C] cursor-pointer">Audit Log Policy</span>
          <span>•</span>
          <span className="hover:text-[#1E1B1C] cursor-pointer">Print Setup</span>
          <span>•</span>
          <span>© 2026 CrimsonLedger • Powered by System</span>
        </div>
      </div>
    </footer>
  );
};

