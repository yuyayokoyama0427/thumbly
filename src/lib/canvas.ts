import type { TemplateId } from './templates';

export type CanvasSize = {
  id: string;
  label: string;
  width: number;
  height: number;
  isPro: boolean;
};

export const CANVAS_SIZES: CanvasSize[] = [
  { id: 'youtube', label: 'YouTube', width: 1280, height: 720, isPro: false },
  { id: 'note-ogp', label: 'note / OGP', width: 1200, height: 630, isPro: false },
  { id: 'instagram', label: 'Instagram', width: 1080, height: 1080, isPro: false },
  { id: 'twitter', label: 'Twitter / X', width: 1200, height: 628, isPro: false },
];

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  // For Japanese text, wrap by character width
  for (const char of words) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function wrapTextByWords(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];

  // Try space-based splitting first, fallback to char-by-char
  const hasSpaces = text.includes(' ');
  if (hasSpaces) {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  return wrapText(ctx, text, maxWidth);
}

export interface DrawOptions {
  title: string;
  subtitle: string;
  templateId: TemplateId;
  width: number;
  height: number;
  titleColor?: string;
  subtitleColor?: string;
  fontFamily?: string;
  bgImage?: HTMLImageElement | null;
}

/** カバーフィットで背景画像を描画し、半透明オーバーレイを重ねる */
function drawBgImage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  img: HTMLImageElement,
  overlayColor = 'rgba(0,0,0,0.45)',
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
  ctx.fillStyle = overlayColor;
  ctx.fillRect(0, 0, w, h);
}

export function drawThumbnail(
  canvas: HTMLCanvasElement,
  options: DrawOptions
): void {
  const { title, subtitle, templateId, width, height, titleColor, subtitleColor, fontFamily = 'sans-serif', bgImage } = options;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  switch (templateId) {
    case 'simple-dark':
      drawSimpleDark(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'gradient-blue':
      drawGradientBlue(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'clean-white':
      drawCleanWhite(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'neon-purple':
      drawNeonPurple(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'sunset':
      drawSunset(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'forest':
      drawForest(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'minimal-yellow':
      drawMinimalYellow(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'dark-red':
      drawDarkRed(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'ocean':
      drawOcean(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
    case 'code':
      drawCode(ctx, width, height, title, subtitle, titleColor, subtitleColor, fontFamily, bgImage);
      break;
  }
}

// ---- Simple Dark ----
function drawSimpleDark(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  // Background
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(0,0,0,0.5)');
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#1e293b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  // Accent line
  const lineY = h * 0.58;
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(w * 0.1, lineY, w * 0.8, Math.max(4, h * 0.006));

  // Title
  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.38 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  // Subtitle
  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? '#94a3b8';
    ctx.fillText(subtitle, w / 2, h * 0.72, w * 0.8);
  }
}

// ---- Gradient Blue ----
function drawGradientBlue(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(30,58,138,0.5)');
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#1e3a8a');
    bg.addColorStop(1, '#3b82f6');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  // Decorative circles (bottom right)
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    const r = h * (0.3 + i * 0.15);
    ctx.arc(w * 0.92, h * 0.9, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2, h * 0.004);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Title
  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.42 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  // Subtitle
  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? 'rgba(255,255,255,0.75)';
    ctx.fillText(subtitle, w / 2, h * 0.68, w * 0.8);
  }
}

// ---- Clean White ----
function drawCleanWhite(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(255,255,255,0.25)');
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }

  // Left accent line
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(w * 0.07, h * 0.18, Math.max(8, w * 0.008), h * 0.64);

  // Title
  const titleSize = Math.floor(h * 0.095);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.68);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.38 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w * 0.18, titleStartY + i * lineHeight);
  });

  // Subtitle
  if (subtitle) {
    const subSize = Math.floor(h * 0.042);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? '#6b7280';
    ctx.fillText(subtitle, w * 0.18, h * 0.68, w * 0.72);
  }
}

// ---- Neon Purple ----
function drawNeonPurple(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(13,13,26,0.6)');
  } else {
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, w, h);
  }

  // Glow effect (shadow)
  ctx.shadowBlur = h * 0.08;
  ctx.shadowColor = '#a855f7';

  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.42 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  ctx.shadowBlur = 0;

  // Subtitle with pink glow
  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.shadowBlur = h * 0.04;
    ctx.shadowColor = subtitleColor ?? '#ec4899';
    ctx.fillStyle = subtitleColor ?? '#ec4899';
    ctx.fillText(subtitle, w / 2, h * 0.68, w * 0.8);
    ctx.shadowBlur = 0;
  }

  // Bottom gradient line
  const lineGrad = ctx.createLinearGradient(w * 0.1, 0, w * 0.9, 0);
  lineGrad.addColorStop(0, '#a855f7');
  lineGrad.addColorStop(1, '#ec4899');
  ctx.fillStyle = lineGrad;
  ctx.fillRect(w * 0.1, h * 0.8, w * 0.8, Math.max(3, h * 0.005));
}

// ---- Sunset ----
function drawSunset(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(249,115,22,0.4)');
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#f97316');
    bg.addColorStop(1, '#ec4899');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = h * 0.03;
  ctx.shadowColor = 'rgba(0,0,0,0.3)';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.42 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });
  ctx.shadowBlur = 0;

  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? 'rgba(255,255,255,0.9)';
    ctx.fillText(subtitle, w / 2, h * 0.68, w * 0.8);
  }
}

// ---- Forest ----
function drawForest(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(5,46,22,0.55)');
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#052e16');
    bg.addColorStop(1, '#166534');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  // Leaf-like circles pattern
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.ellipse(
      w * 0.85 + Math.cos(i * 0.8) * w * 0.08,
      h * 0.2 + Math.sin(i * 0.8) * h * 0.1,
      w * 0.04,
      h * 0.07,
      i * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#86efac';
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.42 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? '#86efac';
    ctx.fillText(subtitle, w / 2, h * 0.68, w * 0.8);
  }
}

// ---- Minimal Yellow ----
function drawMinimalYellow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(254,249,195,0.3)');
  } else {
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(0, 0, w, h);
  }

  // Accent line top
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, w, Math.max(8, h * 0.012));

  // Accent line bottom
  ctx.fillRect(0, h - Math.max(8, h * 0.012), w, Math.max(8, h * 0.012));

  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#78350f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.42 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? '#92400e';
    ctx.fillText(subtitle, w / 2, h * 0.68, w * 0.8);
  }
}

// ---- Dark Red ----
function drawDarkRed(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(28,2,7,0.6)');
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#1c0207');
    bg.addColorStop(1, '#9f1239');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.42 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? '#fda4af';
    ctx.fillText(subtitle, w / 2, h * 0.68, w * 0.8);
  }
}

// ---- Ocean ----
function drawOcean(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(12,74,110,0.5)');
  } else {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0c4a6e');
    bg.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  // Wave pattern
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, h * (0.6 + i * 0.1));
    for (let x = 0; x <= w; x += w / 10) {
      ctx.quadraticCurveTo(
        x + w / 20,
        h * (0.55 + i * 0.1),
        x + w / 10,
        h * (0.6 + i * 0.1)
      );
    }
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = Math.max(2, h * 0.004);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const titleSize = Math.floor(h * 0.1);
  ctx.font = `bold ${titleSize}px ${fontFamily}`;
  ctx.fillStyle = titleColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'タイトルを入力', w * 0.8);
  const lineHeight = titleSize * 1.3;
  const titleStartY = h * 0.42 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  if (subtitle) {
    const subSize = Math.floor(h * 0.045);
    ctx.font = `${subSize}px ${fontFamily}`;
    ctx.fillStyle = subtitleColor ?? '#bae6fd';
    ctx.fillText(subtitle, w / 2, h * 0.68, w * 0.8);
  }
}

// ---- Code ----
function drawCode(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  subtitle: string,
  titleColor?: string,
  subtitleColor?: string,
  _fontFamily = 'sans-serif',
  bgImage?: HTMLImageElement | null,
) {
  if (bgImage) {
    drawBgImage(ctx, w, h, bgImage, 'rgba(30,30,30,0.7)');
  } else {
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, w, h);
  }

  // Window chrome
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(0, 0, w, h * 0.08);

  // Traffic lights
  const dotY = h * 0.04;
  const dotR = Math.max(6, h * 0.018);
  [['#ff5f57', w * 0.04], ['#febc2e', w * 0.065], ['#28c840', w * 0.09]].forEach(
    ([color, x]) => {
      ctx.beginPath();
      ctx.arc(x as number, dotY, dotR, 0, Math.PI * 2);
      ctx.fillStyle = color as string;
      ctx.fill();
    }
  );

  // Title (monospace style)
  const titleSize = Math.floor(h * 0.095);
  ctx.font = `bold ${titleSize}px monospace`;
  ctx.fillStyle = titleColor ?? '#4ade80';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleLines = wrapTextByWords(ctx, title || 'console.log("Hello")', w * 0.8);
  const lineHeight = titleSize * 1.4;
  const titleStartY = h * 0.48 - ((titleLines.length - 1) * lineHeight) / 2;
  titleLines.forEach((line, i) => {
    ctx.fillText(line, w / 2, titleStartY + i * lineHeight);
  });

  // Subtitle (comment style)
  if (subtitle) {
    const subSize = Math.floor(h * 0.042);
    ctx.font = `${subSize}px monospace`;
    ctx.fillStyle = subtitleColor ?? '#6b7280';
    ctx.fillText(`// ${subtitle}`, w / 2, h * 0.72, w * 0.8);
  }
}
