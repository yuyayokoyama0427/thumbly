import { CANVAS_SIZES } from '../lib/canvas';
import type { CanvasSize } from '../lib/canvas';

interface SizeSelectorProps {
  selectedId: string;
  isPro: boolean;
  onSelect: (size: CanvasSize) => void;
  onProClick: () => void;
}

export function SizeSelector({ selectedId, isPro, onSelect, onProClick }: SizeSelectorProps) {
  const handleClick = (size: CanvasSize) => {
    if (size.isPro && !isPro) {
      onProClick();
    } else {
      onSelect(size);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {CANVAS_SIZES.map((size) => {
        const locked = size.isPro && !isPro;
        const isSelected = selectedId === size.id;

        return (
          <button
            key={size.id}
            onClick={() => handleClick(size)}
            className={`relative flex flex-col items-start gap-0.5 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : locked
                ? 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-1.5 w-full">
              {locked && (
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              <span className="text-sm font-semibold truncate">{size.label}</span>
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : size.isPro
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-green-100 text-green-700'
              }`}>
                {size.isPro ? 'PRO' : '無料'}
              </span>
            </div>
            <span className={`text-[11px] tabular-nums ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
              {size.width} × {size.height}
            </span>
          </button>
        );
      })}
    </div>
  );
}
