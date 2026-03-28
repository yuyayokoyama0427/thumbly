export type TemplateId =
  | 'simple-dark'
  | 'gradient-blue'
  | 'clean-white'
  | 'neon-purple'
  | 'sunset'
  | 'forest'
  | 'minimal-yellow'
  | 'dark-red'
  | 'ocean'
  | 'code';

export interface Template {
  id: TemplateId;
  name: string;
  isPro: boolean;
  description: string;
  previewBg: string; // CSS gradient or color for preview thumbnail
  defaultTitleColor: string;
  defaultSubtitleColor: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'simple-dark',
    name: 'シンプルダーク',
    isPro: false,
    description: 'ダーク系・青アクセント',
    previewBg: 'linear-gradient(135deg, #0f172a, #1e293b)',
    defaultTitleColor: '#ffffff',
    defaultSubtitleColor: '#94a3b8',
  },
  {
    id: 'gradient-blue',
    name: 'グラデーションブルー',
    isPro: false,
    description: '青グラデーション',
    previewBg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    defaultTitleColor: '#ffffff',
    defaultSubtitleColor: '#bfdbfe',
  },
  {
    id: 'clean-white',
    name: 'クリーンホワイト',
    isPro: false,
    description: 'ホワイト・左アクセントライン',
    previewBg: '#f8fafc',
    defaultTitleColor: '#0f172a',
    defaultSubtitleColor: '#6b7280',
  },
  {
    id: 'neon-purple',
    name: 'ネオンパープル',
    isPro: true,
    description: 'ダーク・紫グロー',
    previewBg: 'linear-gradient(135deg, #0d0d1a, #2d1060)',
    defaultTitleColor: '#ffffff',
    defaultSubtitleColor: '#ec4899',
  },
  {
    id: 'sunset',
    name: 'サンセット',
    isPro: true,
    description: 'オレンジ→ピンク',
    previewBg: 'linear-gradient(135deg, #f97316, #ec4899)',
    defaultTitleColor: '#ffffff',
    defaultSubtitleColor: '#fff0f5',
  },
  {
    id: 'forest',
    name: 'フォレスト',
    isPro: true,
    description: '深緑グラデーション',
    previewBg: 'linear-gradient(135deg, #052e16, #166534)',
    defaultTitleColor: '#ffffff',
    defaultSubtitleColor: '#86efac',
  },
  {
    id: 'minimal-yellow',
    name: 'ミニマルイエロー',
    isPro: true,
    description: '黄色・シンプル',
    previewBg: 'linear-gradient(135deg, #fef9c3, #fde68a)',
    defaultTitleColor: '#78350f',
    defaultSubtitleColor: '#92400e',
  },
  {
    id: 'dark-red',
    name: 'ダークレッド',
    isPro: true,
    description: '黒→深紅グラデーション',
    previewBg: 'linear-gradient(135deg, #1c0207, #9f1239)',
    defaultTitleColor: '#ffffff',
    defaultSubtitleColor: '#fda4af',
  },
  {
    id: 'ocean',
    name: 'オーシャン',
    isPro: true,
    description: '深海→水色グラデーション',
    previewBg: 'linear-gradient(135deg, #0c4a6e, #0ea5e9)',
    defaultTitleColor: '#ffffff',
    defaultSubtitleColor: '#bae6fd',
  },
  {
    id: 'code',
    name: 'コード風',
    isPro: true,
    description: 'VSCode風・エンジニア向け',
    previewBg: '#1e1e1e',
    defaultTitleColor: '#4ade80',
    defaultSubtitleColor: '#6b7280',
  },
];
