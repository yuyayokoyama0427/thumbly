import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Editor } from './components/Editor';
import { CanvasPreview } from './components/CanvasPreview';
import { LicenseModal } from './components/LicenseModal';
import { usePro } from './hooks/usePro';
import { CANVAS_SIZES } from './lib/canvas';
import type { CanvasSize } from './lib/canvas';
import { TEMPLATES } from './lib/templates';
import type { TemplateId } from './lib/templates';

function App() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [subtitleColor, setSubtitleColor] = useState('#94a3b8');
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('simple-dark');
  const [selectedSize, setSelectedSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [showModal, setShowModal] = useState(false);

  const proHook = usePro();

  const handleDownload = (ref: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = ref.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = title.replace(/[^a-zA-Z0-9\u3040-\u9FFF]/g, '_').slice(0, 30) || 'thumbnail';
    a.download = `thumbly_${safeTitle}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm leading-none">T</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-lg">Thumbly</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium hidden sm:inline">
                サムネイル作成ツール
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {proHook.isPro ? (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-semibold">
                ✓ Pro版
              </span>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="text-sm bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm"
              >
                Pro版を試す
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main: プレビュー左(固定) / コントロール右(独立スクロール) */}
      <div
        className="max-w-screen-xl mx-auto flex flex-col lg:flex-row"
        style={{ height: 'calc(100vh - 57px)' }}
      >
        {/* Left: Preview — sticky、スクロールしない */}
        <div className="lg:flex-1 min-w-0 flex items-center justify-center p-8 overflow-hidden">
          <div className="w-full">
            <CanvasPreview
              bgImageUrl={bgImageUrl}
              disabled={!title.trim()}
              options={{
                title,
                subtitle,
                templateId: selectedTemplate,
                width: selectedSize.width,
                height: selectedSize.height,
                titleColor,
                subtitleColor,
                fontFamily,
              }}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* Right: Controls — 独立スクロール */}
        <div className="w-full lg:w-[360px] flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-5">
            <Editor
              title={title}
              subtitle={subtitle}
              titleColor={titleColor}
              subtitleColor={subtitleColor}
              selectedTemplate={selectedTemplate}
              selectedSize={selectedSize}
              isPro={proHook.isPro}
              onTitleChange={setTitle}
              onSubtitleChange={setSubtitle}
              onTitleColorChange={setTitleColor}
              onSubtitleColorChange={setSubtitleColor}
              fontFamily={fontFamily}
              onFontChange={setFontFamily}
              bgImageUrl={bgImageUrl}
              onBgImageChange={setBgImageUrl}
              onTemplateChange={(id) => {
                setSelectedTemplate(id);
                const tpl = TEMPLATES.find(t => t.id === id);
                if (tpl) {
                  setTitleColor(tpl.defaultTitleColor);
                  setSubtitleColor(tpl.defaultSubtitleColor);
                }
              }}
              onSizeChange={setSelectedSize}
              onProClick={() => setShowModal(true)}
            />
            {!proHook.isPro && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm"
              >
                Pro版を試す — 月額500円
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8 py-6 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 Thumbly</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-gray-600 underline">プライバシーポリシー</a>
            <a href="/terms" className="hover:text-gray-600 underline">利用規約</a>
            {!proHook.isPro && (
              <button onClick={() => setShowModal(true)} className="hover:text-blue-600 transition-colors">
                Pro版を始める（月額500円）
              </button>
            )}
          </div>
        </div>
      </footer>

      {showModal && (
        <LicenseModal onClose={() => setShowModal(false)} proHook={proHook} />
      )}

      <Analytics />
    </div>
  );
}

export default App;
