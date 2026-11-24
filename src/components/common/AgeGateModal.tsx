import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { usePulse } from '../../context/PulseContext';

interface AgeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ isOpen, onClose, reason }) => {
  const { verifyAge } = usePulse();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-red-500/30 p-6 shadow-2xl text-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center mb-4 mx-auto text-red-500">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="text-center mb-4">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
            Age Verification Required (18+)
          </span>
          <h3 className="text-2xl font-black text-white mt-2">Nightlife & Licensed Venues</h3>
          <p className="text-sm text-slate-300 mt-2">
            {reason || 'This experience contains nightlife entertainment, bottle service reservations, and licensed venue discovery governed by the Alcoholic Drinks Control Act of Kenya.'}
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-6 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Strict 18+ age verification enforced at venue gates with National ID / Passport.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>KenyaOne Escrow ensures all venue reservations are transparent and dispute-protected.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              verifyAge();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-bold text-white shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
          >
            I am 18 or Older — Enter Nightlife
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            I am under 18 (Browse All-Ages Cultural & Festival Content)
          </button>
        </div>
      </div>
    </div>
  );
};
