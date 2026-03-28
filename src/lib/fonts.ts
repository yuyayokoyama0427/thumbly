export interface FontOption {
  id: string;
  label: string;
  family: string; // CSS font-family value
  isPro: boolean;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'system', label: 'デフォルト', family: 'sans-serif', isPro: false },
  { id: 'noto-sans', label: 'Noto Sans JP', family: '"Noto Sans JP", sans-serif', isPro: true },
  { id: 'zen-maru', label: 'Zen Maru Gothic', family: '"Zen Maru Gothic", sans-serif', isPro: true },
  { id: 'm-plus', label: 'M PLUS Rounded', family: '"M PLUS Rounded 1c", sans-serif', isPro: true },
  { id: 'kaisei', label: 'Kaisei Decol', family: '"Kaisei Decol", serif', isPro: true },
];

export const DEFAULT_FONT = FONT_OPTIONS[0];

/** キャンバス描画前にフォントをロードする */
export async function ensureFont(family: string): Promise<void> {
  if (family === 'sans-serif') return;
  try {
    await document.fonts.load(`bold 40px ${family}`);
    await document.fonts.load(`400 40px ${family}`);
  } catch {
    // font load failure is non-fatal
  }
}
