import { useState } from 'react';
import type { UseProReturn } from '../hooks/usePro';

const CHECKOUT_URL = 'https://yomiyasu.lemonsqueezy.com/checkout/buy/6feaf3bc-86cc-4114-9bcd-7f73786cb7ae';

interface LicenseModalProps {
  onClose: () => void;
  proHook: UseProReturn;
}

export function LicenseModal({ onClose, proHook }: LicenseModalProps) {
  const { activate, isVerifying, error, isPro, deactivate } = proHook;
  const [inputKey, setInputKey] = useState('');

  const handleActivate = async () => {
    await activate(inputKey.trim());
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Thumbly Pro</h2>
            <p className="text-sm text-gray-500 mt-0.5">月額 500円（税込）</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Pro features */}
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-4 mb-6 border border-blue-100">
          <p className="text-sm font-semibold text-blue-900 mb-3">Pro版でできること</p>
          <ul className="space-y-2.5">
            {[
              { icon: '🎨', text: 'ネオンパープル・サンセット・フォレストなど 7種のProテンプレート' },
              { icon: '🖼️', text: '背景画像アップロード（自分の写真を背景に）' },
              { icon: '✏️', text: 'フォント選択（Noto Sans・Zen Maru Gothicなど）' },
              { icon: '∞', text: 'いつでもキャンセル可能（月額500円）' },
            ].map((feature) => (
              <li key={feature.text} className="flex items-start gap-2 text-sm text-blue-800">
                <span className="flex-shrink-0 mt-0.5">{feature.icon}</span>
                <span className="flex-1">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {isPro ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-green-700 font-semibold text-sm">Pro版が有効です</p>
            </div>
            <button
              onClick={() => { deactivate(); onClose(); }}
              className="w-full text-sm text-gray-400 hover:text-red-500 underline"
            >
              ライセンスを解除する
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Purchase button */}
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-xl transition-colors"
            >
              Pro版を始める（月額500円）
            </a>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">すでに購入済みの方</span>
              </div>
            </div>

            {/* License key input */}
            <div className="space-y-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="ライセンスキーを入力"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}
              <button
                onClick={handleActivate}
                disabled={isVerifying || !inputKey.trim()}
                className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {isVerifying ? '認証中...' : '認証する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
