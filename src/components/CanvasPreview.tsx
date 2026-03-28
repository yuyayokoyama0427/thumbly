import { useEffect, useRef, useCallback } from 'react';
import { drawThumbnail } from '../lib/canvas';
import type { DrawOptions } from '../lib/canvas';
import { ensureFont } from '../lib/fonts';

interface CanvasPreviewProps {
  options: Omit<DrawOptions, 'bgImage'>;
  bgImageUrl?: string;
  onDownload: (canvasRef: React.RefObject<HTMLCanvasElement | null>) => void;
  disabled?: boolean;
}

export function CanvasPreview({ options, bgImageUrl, onDownload, disabled }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Load bg image when URL changes
  useEffect(() => {
    if (!bgImageUrl) {
      bgImageRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      bgImageRef.current = img;
      if (canvasRef.current) {
        drawThumbnail(canvasRef.current, { ...options, bgImage: bgImageRef.current });
      }
    };
    img.src = bgImageUrl;
  }, [bgImageUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const redraw = useCallback(async () => {
    if (!canvasRef.current) return;
    if (options.fontFamily) await ensureFont(options.fontFamily);
    drawThumbnail(canvasRef.current, { ...options, bgImage: bgImageRef.current });
  }, [options]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  return (
    <div>
      {/* Preview card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">プレビュー</p>
            <p className="text-xs text-gray-400 mt-0.5">{options.width} × {options.height} px</p>
          </div>
          <button
            onClick={() => onDownload(canvasRef)}
            disabled={disabled}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title={disabled ? 'タイトルを入力してください' : undefined}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PNGで保存
          </button>
        </div>

        {/* Canvas area — checkered bg shows transparency clearly */}
        <div
          className="w-full p-4"
          style={{
            background: 'repeating-conic-gradient(#f0f0f0 0% 25%, #fafafa 0% 50%) 0 0 / 20px 20px',
          }}
        >
          <div
            className="w-full rounded-lg overflow-hidden shadow-lg"
            style={{ aspectRatio: `${options.width} / ${options.height}` }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
          </div>
        </div>

        {/* Footer note */}
        <div className="px-4 pb-3 text-center">
          <p className="text-xs text-gray-400">
            実際の出力は {options.width}×{options.height}px の高解像度PNG
          </p>
        </div>
      </div>
    </div>
  );
}
