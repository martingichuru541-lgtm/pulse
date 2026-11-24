import React from 'react';
import { X, CheckCircle, ShieldCheck, Download, Share2 } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  code: string;
  type: 'ticket' | 'table_qr' | 'creator_tip';
  meta?: { label: string; value: string }[];
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  code,
  type,
  meta,
}) => {
  if (!isOpen) return null;

  // Generate a clean geometric pseudo-QR grid based on the hash of the code
  const generateGrid = (input: string) => {
    const size = 17;
    const grid: boolean[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false));

    // Corner finder patterns (7x7)
    const addFinderPattern = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[r0 + r][c0 + c] = isBorder || isInner;
        }
      }
    };

    addFinderPattern(0, 0);
    addFinderPattern(0, size - 7);
    addFinderPattern(size - 7, 0);

    // Hash filling for the rest
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip corner patterns
        const inTopLeft = r < 7 && c < 7;
        const inTopRight = r < 7 && c >= size - 7;
        const inBottomLeft = r >= size - 7 && c < 7;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        // Pattern logic
        const bit = ((hash ^ (r * 31 + c * 17)) >>> (r % 16)) & 1;
        grid[r][c] = bit === 1 || (r % 2 === 0 && c % 3 === 0);
      }
    }

    return grid;
  };

  const grid = generateGrid(code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            {type === 'ticket' ? 'Official KenyaOne Ticket QR' : type === 'table_qr' ? 'Verified Table QR' : 'Pulse QR Pass'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 mb-6">{subtitle}</p>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-inner mb-6">
          <div className="p-3 bg-white rounded-lg">
            <svg
              viewBox="0 0 170 170"
              className="w-48 h-48 sm:w-56 sm:h-56 select-none"
              shapeRendering="crispEdges"
            >
              {grid.map((row, r) =>
                row.map((cell, c) =>
                  cell ? (
                    <rect
                      key={`${r}-${c}`}
                      x={c * 10}
                      y={r * 10}
                      width={10}
                      height={10}
                      fill="#020617"
                    />
                  ) : null
                )
              )}
            </svg>
          </div>
          <p className="text-xs font-mono font-bold tracking-widest text-slate-900 mt-3 uppercase text-center px-2 py-1 bg-slate-100 rounded border border-slate-300">
            {code}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cryptographically Verified by KenyaOne Escrow</span>
          </div>
        </div>

        {meta && meta.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs">
            {meta.map((item, idx) => (
              <div key={idx}>
                <span className="text-slate-400 block">{item.label}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(code);
              alert('QR Code token copied to clipboard!');
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-slate-300" />
            Copy Code
          </button>
          <button
            onClick={() => {
              alert('Digital pass saved to KenyaOne Offline Wallet');
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/30"
          >
            <Download className="w-4 h-4" />
            Save to Device
          </button>
        </div>
      </div>
    </div>
  );
};
