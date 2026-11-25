import React, { useState } from 'react';
import { SlipData } from '../types/slip';
import { 
  Trash2, 
  Download, 
  ExternalLink, 
  Search, 
  History as HistoryIcon,
  CheckCircle2,
  Calendar,
  CreditCard
} from 'lucide-react';

interface Props {
  history: SlipData[];
  onLoadSlip: (slip: SlipData) => void;
  onDeleteSlip: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<Props> = ({
  history,
  onLoadSlip,
  onDeleteSlip,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.recipientName.toLowerCase().includes(term) ||
      item.recipientAccount.toLowerCase().includes(term) ||
      item.tid.toLowerCase().includes(term) ||
      item.provider.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E1B1C] tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-[#84142D]" />
            Generated Slips Ledger
          </h1>
          <p className="text-xs text-[#574143] mt-1">
            Local encrypted ledger storing your generated transaction proofs.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Ledger History
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by recipient, account number, TID, or provider..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D9D3D4] rounded-xl text-sm focus:outline-none focus:border-[#84142D] shadow-2xs"
        />
      </div>

      {/* History List / Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#ECE6E7] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F5ECED] flex items-center justify-center text-[#84142D]">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1E1B1C]">No Slips in Ledger</h3>
          <p className="text-xs text-[#574143] max-w-sm mx-auto">
            When you generate slips and click "Save Slip", they will appear here for one-click re-editing and export.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#ECE6E7] rounded-2xl p-4 shadow-xs hover:border-[#84142D]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F7] border border-[#ECE6E7] text-[11px] font-bold uppercase tracking-wider text-[#574143]">
                    {item.provider}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#00A859]">
                    {item.currencyPrefix}{item.amount.toFixed(2)}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-[#1E1B1C]">
                  {item.recipientName}
                </h3>
                <div className="text-xs text-[#574143] font-mono mt-0.5">
                  {item.recipientAccount}
                </div>

                <div className="mt-3 pt-3 border-t border-[#F5ECED] space-y-1 text-xs text-[#7A7273]">
                  <div className="flex items-center justify-between">
                    <span>TID:</span>
                    <span className="font-mono text-[#1E1B1C] font-semibold">{item.tid}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Date:</span>
                    <span className="text-[#1E1B1C]">{item.dateTime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F5ECED] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onLoadSlip(item)}
                  className="flex-1 py-1.5 px-3 bg-[#84142D] hover:bg-[#6B1024] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Load
                </button>
                
                {item.imageUrl && (
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 bg-[#00A859] hover:bg-[#008F4C] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Receipt
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteSlip(item.id)}
                  title="Delete from history"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
