import type { TemplateId } from '../lib/templates';
import type { CanvasSize } from '../lib/canvas';
import { FONT_OPTIONS } from '../lib/fonts';
import { TemplateGrid } from './TemplateGrid';
import { SizeSelector } from './SizeSelector';

interface EditorProps {
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  fontFamily: string;
  bgImageUrl: string;
  selectedTemplate: TemplateId;
  selectedSize: CanvasSize;
  isPro: boolean;
  onTitleChange: (v: string) => void;
  onSubtitleChange: (v: string) => void;
  onTitleColorChange: (v: string) => void;
  onSubtitleColorChange: (v: string) => void;
  onFontChange: (v: string) => void;
  onBgImageChange: (url: string) => void;
  onTemplateChange: (id: TemplateId) => void;
  onSizeChange: (size: CanvasSize) => void;
  onProClick: () => void;
}

export function Editor({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  fontFamily,
  bgImageUrl,
  selectedTemplate,
  selectedSize,
  isPro,
  onTitleChange,
  onSubtitleChange,
  onTitleColorChange,
  onSubtitleColorChange,
  onFontChange,
  onBgImageChange,
  onTemplateChange,
  onSizeChange,
  onProClick,
}: EditorProps) {
  return (
    <div className="space-y-4">
      {/* Text inputs */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">テキスト</p>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-800">タイトル</label>
            <span className={`text-xs tabular-nums ${title.length > 60 ? 'text-orange-500' : 'text-gray-400'}`}>
              {title.length} / 80
            </span>
          </div>
          <textarea
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="ここにタイトルを入力"
            maxLength={80}
            rows={2}
            className="w-full border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-white transition-colors placeholder-gray-300"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-800">サブタイトル</label>
            <span className={`text-xs tabular-nums ${subtitle.length > 45 ? 'text-orange-500' : 'text-gray-400'}`}>
              {subtitle.length} / 60
            </span>
          </div>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="サブタイトルはここに"
            maxLength={60}
            className="w-full border-2 border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-colors placeholder-gray-300"
          />
        </div>

        {/* Font selector */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-500">フォント</label>
            {!isPro && <span className="text-xs text-blue-500 font-semibold">Pro</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FONT_OPTIONS.map(font => {
              const isLocked = font.isPro && !isPro;
              const isSelected = fontFamily === font.family;
              return (
                <button
                  key={font.id}
                  onClick={() => isLocked ? onProClick() : onFontChange(font.family)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : isLocked
                      ? 'border-gray-200 text-gray-400 bg-gray-50'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  {font.label}
                  {isLocked && <span className="ml-1 text-blue-400">🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Background image upload */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-500">背景画像</label>
            {!isPro && <span className="text-xs text-blue-500 font-semibold">Pro</span>}
          </div>
          {isPro ? (
            <div className="space-y-2">
              <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl py-3 px-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500">画像を選択</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      onBgImageChange(ev.target?.result as string ?? '');
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {bgImageUrl && (
                <div className="flex items-center gap-2">
                  <img src={bgImageUrl} className="w-10 h-10 object-cover rounded-lg border border-gray-200" alt="bg preview" />
                  <button
                    onClick={() => onBgImageChange('')}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onProClick}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
            >
              <span>🔒</span> Pro版で解放
            </button>
          )}
        </div>

        {/* Color pickers */}
        <div className="flex gap-3 pt-1">
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-medium text-gray-500">タイトル色</label>
            <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 py-2 bg-white">
              <input
                type="color"
                value={titleColor}
                onChange={(e) => onTitleColorChange(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-gray-500 uppercase">{titleColor}</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-medium text-gray-500">サブタイトル色</label>
            <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 py-2 bg-white">
              <input
                type="color"
                value={subtitleColor}
                onChange={(e) => onSubtitleColorChange(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-gray-500 uppercase">{subtitleColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template selection */}
      <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">テンプレート</p>
          {!isPro && (
            <button
              onClick={onProClick}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
            >
              Pro版で全解放 →
            </button>
          )}
        </div>
        <TemplateGrid
          selected={selectedTemplate}
          isPro={isPro}
          onSelect={onTemplateChange}
          onProClick={onProClick}
        />
      </div>

      {/* Size selection */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">出力サイズ</p>
          {!isPro && (
            <span className="text-xs text-gray-400">用途に合わせて選択</span>
          )}
        </div>
        <SizeSelector
          selectedId={selectedSize.id}
          isPro={isPro}
          onSelect={onSizeChange}
          onProClick={onProClick}
        />
      </div>
    </div>
  );
}
