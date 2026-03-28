import { TEMPLATES } from '../lib/templates';
import type { Template, TemplateId } from '../lib/templates';

interface TemplateGridProps {
  selected: TemplateId;
  isPro: boolean;
  onSelect: (id: TemplateId) => void;
  onProClick: () => void;
}

export function TemplateGrid({ selected, isPro, onSelect, onProClick }: TemplateGridProps) {
  const handleClick = (template: Template) => {
    if (template.isPro && !isPro) {
      onProClick();
    } else {
      onSelect(template.id);
    }
  };

  // テキスト色を背景に合わせて決定
  const getTextColor = (id: TemplateId) => {
    if (id === 'clean-white' || id === 'minimal-yellow') return '#374151';
    return '#ffffff';
  };

  const getSubColor = (id: TemplateId) => {
    if (id === 'clean-white') return '#6b7280';
    if (id === 'minimal-yellow') return '#92400e';
    return 'rgba(255,255,255,0.6)';
  };

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {TEMPLATES.map((template) => {
        const locked = template.isPro && !isPro;
        const isSelected = selected === template.id;
        const textColor = getTextColor(template.id);
        const subColor = getSubColor(template.id);
        const isLight = template.id === 'clean-white' || template.id === 'minimal-yellow';

        return (
          <button
            key={template.id}
            onClick={() => handleClick(template)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                : 'border-transparent hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {/* Preview area */}
            <div
              className={`h-20 w-full flex flex-col items-center justify-center px-4 relative ${isLight ? 'border border-gray-200' : ''}`}
              style={{ background: template.previewBg }}
            >
              {/* Accent line for Simple Dark */}
              {template.id === 'simple-dark' && (
                <div className="absolute bottom-4 left-3 right-3 h-0.5 bg-blue-500 opacity-70" />
              )}
              {/* Accent line for Clean White */}
              {template.id === 'clean-white' && (
                <div className="absolute left-4 top-2 bottom-2 w-1.5 rounded bg-blue-500" />
              )}
              {/* Top/bottom lines for Minimal Yellow */}
              {template.id === 'minimal-yellow' && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
                </>
              )}
              {/* Code window chrome */}
              {template.id === 'code' && (
                <div className="absolute top-0 left-0 right-0 h-4 bg-gray-700 flex items-center gap-1 px-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              )}

              <div className={`relative z-10 text-center ${template.id === 'code' ? 'pt-3' : ''}`}>
                <p
                  className="text-xs font-bold leading-tight truncate"
                  style={{
                    color: template.id === 'code' ? '#4ade80' : textColor,
                    fontFamily: template.id === 'code' ? 'monospace' : undefined,
                    textShadow: ['neon-purple'].includes(template.id)
                      ? '0 0 8px #a855f7'
                      : undefined,
                  }}
                >
                  タイトルサンプル
                </p>
                <p
                  className="text-[10px] mt-0.5 truncate"
                  style={{
                    color: template.id === 'code' ? '#6b7280' : subColor,
                    fontFamily: template.id === 'code' ? 'monospace' : undefined,
                  }}
                >
                  {template.id === 'code' ? '// サブタイトル' : 'サブタイトル'}
                </p>
              </div>
            </div>

            {/* Label */}
            <div className="px-2 py-1.5 bg-white flex items-center justify-between gap-1 border-t border-gray-100">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{template.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{template.description}</p>
              </div>
              {template.isPro ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                  isPro ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  PRO
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold flex-shrink-0 bg-green-100 text-green-700">
                  無料
                </span>
              )}
            </div>

            {/* Lock overlay */}
            {locked && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                <div className="bg-white/95 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
