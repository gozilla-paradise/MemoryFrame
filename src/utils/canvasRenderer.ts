import {
  FrameTemplate,
  PhotoTransform,
  PhotoFilters,
  MattingSettings,
  GalleryTextItem,
  ExportMode,
} from '../types/frame';

interface RenderOptions {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement | null;
  template: FrameTemplate;
  transform: PhotoTransform;
  filters: PhotoFilters;
  matting: MattingSettings;
  customText: GalleryTextItem;
  exportMode?: ExportMode;
  scaleFactor?: number;
  drawGuides?: boolean;
}

export function calculateInitialCoverTransform(
  imgWidth: number,
  imgHeight: number,
  apertureWidth: number,
  apertureHeight: number
): PhotoTransform {
  const scaleX = apertureWidth / imgWidth;
  const scaleY = apertureHeight / imgHeight;
  const initialScale = Math.max(scaleX, scaleY);

  return {
    x: 0,
    y: 0,
    scale: initialScale,
    rotation: 0,
    flipH: false,
    flipV: false,
    fitMode: 'cover',
  };
}

export function calculateInitialContainTransform(
  imgWidth: number,
  imgHeight: number,
  apertureWidth: number,
  apertureHeight: number
): PhotoTransform {
  const scaleX = apertureWidth / imgWidth;
  const scaleY = apertureHeight / imgHeight;
  const initialScale = Math.min(scaleX, scaleY);

  return {
    x: 0,
    y: 0,
    scale: initialScale,
    rotation: 0,
    flipH: false,
    flipV: false,
    fitMode: 'contain',
  };
}

export function renderGalleryCanvas({
  canvas,
  image,
  template,
  transform,
  filters,
  matting,
  customText,
  exportMode = 'full_scene',
  scaleFactor = 1,
  drawGuides = false,
}: RenderOptions): void {
  const baseW = template.canvasWidth;
  const baseH = template.canvasHeight;

  // Compute bounding box for export modes
  const rawApX = template.aperture.x * baseW;
  const rawApY = template.aperture.y * baseH;
  const rawApW = template.aperture.width * baseW;
  const rawApH = template.aperture.height * baseH;

  // Frame outer dimensions
  const frameBorderThickness = Math.max(rawApW, rawApH) * 0.16;
  const frameOuterX = rawApX - frameBorderThickness;
  const frameOuterY = rawApY - frameBorderThickness;
  const frameOuterW = rawApW + frameBorderThickness * 2;
  const frameOuterH = rawApH + frameBorderThickness * 2;

  let targetWidth = baseW * scaleFactor;
  let targetHeight = baseH * scaleFactor;
  let cropOffsetX = 0;
  let cropOffsetY = 0;

  if (exportMode === 'frame_only') {
    // Add small margin around the frame for drop shadow
    const shadowMargin = frameBorderThickness * 0.4;
    cropOffsetX = Math.max(0, frameOuterX - shadowMargin);
    cropOffsetY = Math.max(0, frameOuterY - shadowMargin);
    const cropW = Math.min(baseW - cropOffsetX, frameOuterW + shadowMargin * 2);
    const cropH = Math.min(baseH - cropOffsetY, frameOuterH + shadowMargin * 2);

    targetWidth = cropW * scaleFactor;
    targetHeight = cropH * scaleFactor;
  } else if (exportMode === 'inner_artwork') {
    cropOffsetX = rawApX;
    cropOffsetY = rawApY;
    targetWidth = rawApW * scaleFactor;
    targetHeight = rawApH * scaleFactor;
  }

  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  ctx.save();
  ctx.scale(scaleFactor, scaleFactor);
  ctx.translate(-cropOffsetX, -cropOffsetY);

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. DRAW WALL & BACKGROUND
  drawWallBackground(ctx, baseW, baseH, template);

  // 2. DRAW DRAPERY (Origami sculpture on the left for Navy theme)
  if (template.hasDrapery) {
    drawDraperyOrigami(ctx, baseW, baseH);
  }

  // 3. DRAW WOODEN FLOOR & BASEBOARD
  if (template.hasWoodFloor) {
    drawWoodFloor(ctx, baseW, baseH, template);
  }

  // 4. DRAW SPOTLIGHT CONE & AMBIENT LIGHT
  if (template.hasSpotlight) {
    drawSpotlightOverlay(ctx, baseW, baseH, template);
  }

  // 5. DRAW GALLERY WALL TEXT
  if (customText.showText && exportMode === 'full_scene') {
    drawGalleryTypography(ctx, baseW, baseH, customText, template);
  }

  // 6. DRAW FRAME DROP SHADOW
  drawFrameDropShadow(ctx, rawApX, rawApY, rawApW, rawApH, frameBorderThickness);

  // 7. COMPUTE MATTING APERTURE
  let picClipX = rawApX;
  let picClipY = rawApY;
  let picClipW = rawApW;
  let picClipH = rawApH;

  if (matting.enabled && matting.widthPercent > 0) {
    const mSize = (Math.min(rawApW, rawApH) * matting.widthPercent) / 100;
    picClipX = rawApX + mSize;
    picClipY = rawApY + mSize;
    picClipW = Math.max(10, rawApW - mSize * 2);
    picClipH = Math.max(10, rawApH - mSize * 2);

    // Draw matting border surface
    drawMattingSurface(ctx, rawApX, rawApY, rawApW, rawApH, picClipX, picClipY, picClipW, picClipH, matting);
  }

  // 8. DRAW USER PHOTO (CLIPPED TO APERTURE)
  ctx.save();
  ctx.beginPath();
  if (template.aperture.borderRadius) {
    const r = template.aperture.borderRadius;
    ctx.roundRect(picClipX, picClipY, picClipW, picClipH, [r, r, r, r]);
  } else {
    ctx.rect(picClipX, picClipY, picClipW, picClipH);
  }
  ctx.clip();

  // Background of photo aperture (blank canvas before image)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(picClipX, picClipY, picClipW, picClipH);

  if (image && image.complete && image.naturalWidth > 0) {
    drawUserImage(ctx, image, picClipX, picClipY, picClipW, picClipH, transform, filters);
  } else {
    drawEmptyStatePlaceholder(ctx, picClipX, picClipY, picClipW, picClipH);
  }

  // Draw Subtle Glass Reflection / Glint
  drawGlassRefraction(ctx, picClipX, picClipY, picClipW, picClipH, filters.glassReflect);

  // Inner Bevel Shadow for deep framed look
  drawInnerBevelShadow(ctx, picClipX, picClipY, picClipW, picClipH);

  // Guidelines for alignment
  if (drawGuides) {
    drawAlignmentGuides(ctx, picClipX, picClipY, picClipW, picClipH);
  }

  ctx.restore();

  // 9. DRAW ORNATE FRAME
  drawFrameBorder(ctx, rawApX, rawApY, rawApW, rawApH, frameBorderThickness, template.frameStyle);

  // 10. LIGHTING ACCENTS ON FRAME (Gold leaf reflections & spotlight sheen)
  drawFrameLightingReflections(ctx, rawApX, rawApY, rawApW, rawApH, frameBorderThickness, template);

  ctx.restore();
}

function drawWallBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  template: FrameTemplate
) {
  if (template.wallStyle === 'navy_spotlight') {
    // Luxury dark navy wall with radial depth
    const grad = ctx.createRadialGradient(w * 0.35, h * 0.25, 50, w * 0.5, h * 0.5, w * 0.85);
    grad.addColorStop(0, '#2a4875');
    grad.addColorStop(0.3, '#1c345a');
    grad.addColorStop(0.65, '#122340');
    grad.addColorStop(1, '#091322');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle wall texture noise/stipple
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 400; i++) {
      const rx = (i * 197) % w;
      const ry = (i * 313) % (h * 0.9);
      ctx.fillRect(rx, ry, 2, 2);
    }
  } else if (template.wallStyle === 'museum_taupe') {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2e1c14');
    grad.addColorStop(0.5, '#452c20');
    grad.addColorStop(1, '#1f130d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (template.wallStyle === 'slate_minimal') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (template.wallStyle === 'warm_wood') {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fef3c7');
    grad.addColorStop(0.6, '#fde68a');
    grad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (template.wallStyle === 'polaroid_desk') {
    // Rich wooden tabletop
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#78350f');
    grad.addColorStop(0.5, '#92400e');
    grad.addColorStop(1, '#451a03');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Wood planks
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 3;
    for (let y = 100; y < h; y += 150) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else {
    // Dark luxury
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, 80, w * 0.5, h * 0.5, w * 0.7);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.6, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawDraperyOrigami(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Geometric folding drape sculpture on the left (matching the reference photo)
  ctx.save();
  const drapeWidth = w * 0.14;
  const drapeH = h * 0.65;

  const polygons = [
    // Top folds
    { points: [[0, 0], [drapeWidth * 0.7, 0], [drapeWidth * 0.5, drapeH * 0.2], [0, drapeH * 0.15]], color: '#1a2e4e' },
    { points: [[drapeWidth * 0.7, 0], [drapeWidth, 0], [drapeWidth * 0.65, drapeH * 0.18], [drapeWidth * 0.5, drapeH * 0.2]], color: '#0f1d33' },
    // Mid geometric facets
    { points: [[0, drapeH * 0.15], [drapeWidth * 0.5, drapeH * 0.2], [drapeWidth * 0.8, drapeH * 0.35], [drapeWidth * 0.2, drapeH * 0.4]], color: '#27436b' },
    { points: [[drapeWidth * 0.5, drapeH * 0.2], [drapeWidth * 0.9, drapeH * 0.25], [drapeWidth * 0.8, drapeH * 0.35]], color: '#13243d' },
    { points: [[drapeWidth * 0.2, drapeH * 0.4], [drapeWidth * 0.8, drapeH * 0.35], [drapeWidth * 0.7, drapeH * 0.55], [0, drapeH * 0.52]], color: '#193052' },
    { points: [[drapeWidth * 0.8, drapeH * 0.35], [drapeWidth * 0.95, drapeH * 0.45], [drapeWidth * 0.7, drapeH * 0.55]], color: '#0d182b' },
    // Lower cascade folds
    { points: [[0, drapeH * 0.52], [drapeWidth * 0.7, drapeH * 0.55], [drapeWidth * 0.45, drapeH * 0.78], [0, drapeH * 0.72]], color: '#213a61' },
    { points: [[drapeWidth * 0.7, drapeH * 0.55], [drapeWidth * 0.85, drapeH * 0.68], [drapeWidth * 0.45, drapeH * 0.78]], color: '#101e33' },
    { points: [[0, drapeH * 0.72], [drapeWidth * 0.45, drapeH * 0.78], [drapeWidth * 0.35, drapeH * 0.98], [0, drapeH * 0.95]], color: '#172944' },
    { points: [[drapeWidth * 0.45, drapeH * 0.78], [drapeWidth * 0.6, drapeH * 0.9], [drapeWidth * 0.35, drapeH * 0.98]], color: '#0a1321' },
  ];

  for (const poly of polygons) {
    ctx.beginPath();
    ctx.moveTo(poly.points[0][0], poly.points[0][1]);
    for (let i = 1; i < poly.points.length; i++) {
      ctx.lineTo(poly.points[i][0], poly.points[i][1]);
    }
    ctx.closePath();
    ctx.fillStyle = poly.color;
    ctx.fill();

    // Subtle edge highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Soft shadow casting to the right
  const drapeShadow = ctx.createLinearGradient(drapeWidth * 0.7, 0, drapeWidth * 1.3, 0);
  drapeShadow.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
  drapeShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = drapeShadow;
  ctx.fillRect(drapeWidth * 0.7, 0, drapeWidth * 0.6, drapeH * 1.05);

  ctx.restore();
}

function drawWoodFloor(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  template: FrameTemplate
) {
  const floorH = h * 0.085;
  const floorY = h - floorH;

  // Baseboard molding (top of floor)
  const baseboardH = 14;
  const baseboardY = floorY - baseboardH;

  // Baseboard trim
  const baseboardGrad = ctx.createLinearGradient(0, baseboardY, 0, floorY);
  baseboardGrad.addColorStop(0, '#1c130b');
  baseboardGrad.addColorStop(0.3, '#382212');
  baseboardGrad.addColorStop(0.7, '#24160d');
  baseboardGrad.addColorStop(1, '#0e0804');
  ctx.fillStyle = baseboardGrad;
  ctx.fillRect(0, baseboardY, w, baseboardH);

  // Top highlight on baseboard
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, baseboardY, w, 1.5);

  // Hardwood floor surface
  const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
  if (template.wallStyle === 'warm_wood') {
    floorGrad.addColorStop(0, '#92400e');
    floorGrad.addColorStop(0.4, '#b45309');
    floorGrad.addColorStop(1, '#78350f');
  } else {
    floorGrad.addColorStop(0, '#5c3317');
    floorGrad.addColorStop(0.35, '#82491e');
    floorGrad.addColorStop(0.7, '#663918');
    floorGrad.addColorStop(1, '#3b1f0c');
  }
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, floorY, w, floorH);

  // Floor reflections & planks
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  for (let x = 0; x < w; x += 180) {
    ctx.fillRect(x + ((x * 13) % 40), floorY, 2, floorH);
  }

  // Golden floor light sheen reflected from the spotlight
  const floorSheen = ctx.createRadialGradient(w * 0.35, floorY, 10, w * 0.35, floorY + floorH, w * 0.4);
  floorSheen.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
  floorSheen.addColorStop(0.7, 'rgba(217, 119, 6, 0.06)');
  floorSheen.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
  ctx.fillStyle = floorSheen;
  ctx.fillRect(0, floorY, w, floorH);
  ctx.restore();
}

function drawSpotlightOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  template: FrameTemplate
) {
  const spotX = (template.spotlightX ?? 0.35) * w;
  const spotY = (template.spotlightY ?? 0.05) * h;

  // Overhead ceiling light cone
  ctx.save();
  const spotGrad = ctx.createRadialGradient(spotX, spotY, 15, spotX, spotY + h * 0.35, w * 0.45);
  spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
  spotGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.28)');
  spotGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.10)');
  spotGrad.addColorStop(0.8, 'rgba(30, 58, 138, 0.0)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.moveTo(spotX - w * 0.06, 0);
  ctx.lineTo(spotX + w * 0.06, 0);
  ctx.lineTo(spotX + w * 0.38, h * 0.88);
  ctx.lineTo(spotX - w * 0.38, h * 0.88);
  ctx.closePath();
  ctx.fill();

  // Subtle ceiling source flare
  const flareGrad = ctx.createRadialGradient(spotX, 0, 0, spotX, 0, 70);
  flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  flareGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.6)');
  flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = flareGrad;
  ctx.beginPath();
  ctx.arc(spotX, 0, 70, 0, Math.PI);
  ctx.fill();

  ctx.restore();
}

function drawGalleryTypography(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  customText: GalleryTextItem,
  template: FrameTemplate
) {
  ctx.save();

  // Positioning text dynamically to the right side of the frame
  const textLeft = w * 0.585;
  const textCenterY = h * 0.48;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Base font sizing relative to 2000px canvas width
  const baseSize = w * 0.038;

  // Select font family according to setting
  let serifFont = 'Cinzel, "Playfair Display", "Times New Roman", serif';
  if (customText.fontStyle === 'playfair') {
    serifFont = '"Playfair Display", Georgia, serif';
  } else if (customText.fontStyle === 'modern') {
    serifFont = '"Plus Jakarta Sans", -apple-system, sans-serif';
  }

  // Line 1: ONE STORY
  ctx.font = `600 ${Math.round(baseSize * 1.05)}px ${serifFont}`;
  ctx.fillStyle = customText.textColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillText(customText.line1.toUpperCase(), textLeft, textCenterY - baseSize * 1.8);

  // Line 2: A MILLION
  ctx.font = `600 ${Math.round(baseSize * 1.05)}px ${serifFont}`;
  ctx.fillText(customText.line2.toUpperCase(), textLeft, textCenterY - baseSize * 0.7);

  // Line 3: Memories (Cursive Script with golden luster & glow)
  ctx.font = `400 ${Math.round(baseSize * 2.3)}px "Alex Brush", "Great Vibes", "Caveat", cursive`;
  ctx.fillStyle = customText.highlightColor;
  ctx.shadowColor = 'rgba(234, 179, 8, 0.4)';
  ctx.shadowBlur = 18;
  ctx.fillText(customText.highlight, textLeft + 8, textCenterY + baseSize * 0.75);

  // Line 4: Localized Thai/Secondary Subtitle (e.g. 1 เรื่องราว 1 ล้านความทรงจำ)
  ctx.font = `400 ${Math.round(baseSize * 0.48)}px "Prompt", "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = customText.textColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 8;
  ctx.fillText(customText.localized, textLeft, textCenterY + baseSize * 2.1);

  ctx.restore();
}

function drawFrameDropShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  border: number
) {
  ctx.save();
  const ox = x - border;
  const oy = y - border;
  const ow = w + border * 2;
  const oh = h + border * 2;

  // Multi-tier soft realistic drop shadow cast onto wall
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = border * 0.9;
  ctx.shadowOffsetX = border * 0.25;
  ctx.shadowOffsetY = border * 0.45;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(ox + border * 0.1, oy + border * 0.1, ow - border * 0.2, oh - border * 0.2);

  ctx.restore();
}

function drawMattingSurface(
  ctx: CanvasRenderingContext2D,
  outerX: number,
  outerY: number,
  outerW: number,
  outerH: number,
  innerX: number,
  innerY: number,
  innerW: number,
  innerH: number,
  matting: MattingSettings
) {
  ctx.save();
  // Matting board fill
  ctx.fillStyle = matting.color;
  ctx.fillRect(outerX, outerY, outerW, outerH);

  // Matting subtle paper texture
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  for (let i = 0; i < 80; i++) {
    const rx = outerX + ((i * 73) % outerW);
    const ry = outerY + ((i * 97) % outerH);
    ctx.fillRect(rx, ry, 3, 3);
  }

  // Matting bevel core (45-degree angle white/gold cut core)
  if (matting.bevel) {
    const bevelWidth = 4;
    // Top/left bevel highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = bevelWidth;
    ctx.strokeRect(innerX - bevelWidth / 2, innerY - bevelWidth / 2, innerW + bevelWidth, innerH + bevelWidth);

    // Bottom/right bevel shade
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = bevelWidth * 0.7;
    ctx.beginPath();
    ctx.moveTo(innerX - bevelWidth, innerY + innerH + bevelWidth);
    ctx.lineTo(innerX + innerW + bevelWidth, innerY + innerH + bevelWidth);
    ctx.lineTo(innerX + innerW + bevelWidth, innerY - bevelWidth);
    ctx.stroke();
  }

  // Inner gold/dark fine fillet line
  if (matting.innerBorder) {
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(innerX - 8, innerY - 8, innerW + 16, innerH + 16);
  }

  ctx.restore();
}

function drawUserImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  clipX: number,
  clipY: number,
  clipW: number,
  clipH: number,
  transform: PhotoTransform,
  filters: PhotoFilters
) {
  ctx.save();

  const centerX = clipX + clipW / 2;
  const centerY = clipY + clipH / 2;

  // Center coordinate system inside photo box
  ctx.translate(centerX + transform.x, centerY + transform.y);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(
    transform.scale * (transform.flipH ? -1 : 1),
    transform.scale * (transform.flipV ? -1 : 1)
  );

  // Apply CSS Filter effects
  const b = 100 + filters.brightness;
  const c = 100 + filters.contrast;
  const s = 100 + filters.saturation;
  const sep = filters.sepia;
  ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) sepia(${sep}%)`;

  const drawW = img.naturalWidth;
  const drawH = img.naturalHeight;
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

  // Warmth / Temperature Overlay
  if (filters.warmth !== 0) {
    ctx.filter = 'none';
    if (filters.warmth > 0) {
      // Warm amber tint
      ctx.fillStyle = `rgba(245, 158, 11, ${(filters.warmth / 100) * 0.35})`;
      ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      // Cool blue tint
      ctx.fillStyle = `rgba(59, 130, 246, ${(Math.abs(filters.warmth) / 100) * 0.35})`;
      ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    }
  }

  ctx.restore();

  // Vignette overlay around the frame opening
  if (filters.vignette > 0) {
    ctx.save();
    const vGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      Math.min(clipW, clipH) * 0.35,
      centerX,
      centerY,
      Math.max(clipW, clipH) * 0.75
    );
    const alpha = (filters.vignette / 100) * 0.75;
    vGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vGrad.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
    ctx.fillStyle = vGrad;
    ctx.fillRect(clipX, clipY, clipW, clipH);
    ctx.restore();
  }
}

function drawEmptyStatePlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  // Deep elegant canvas fabric texture
  const pGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  pGrad.addColorStop(0, '#1e293b');
  pGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = pGrad;
  ctx.fillRect(x, y, w, h);

  // Dashed border inside
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.strokeRect(x + 20, y + 20, w - 40, h - 40);
  ctx.setLineDash([]);

  // Placeholder icon & text
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
  ctx.font = `600 ${Math.max(16, Math.round(w * 0.055))}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Tap to Upload or Select Sample', cx, cy - 15);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = `400 ${Math.max(12, Math.round(w * 0.036))}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('JPG, PNG, WebP supported • Direct drag & pan', cx, cy + 20);

  ctx.restore();
}

function drawGlassRefraction(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  intensity: number
) {
  if (intensity <= 0) return;
  ctx.save();
  const alpha = (intensity / 100) * 0.22;
  const glassGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  glassGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 1.5})`);
  glassGrad.addColorStop(0.3, `rgba(255, 255, 255, ${alpha * 0.4})`);
  glassGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0)');
  glassGrad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.6})`);
  glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = glassGrad;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function drawInnerBevelShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  const shadowDepth = 14;

  // Top & Left deep inner shadow
  const topGrad = ctx.createLinearGradient(x, y, x, y + shadowDepth);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(x, y, w, shadowDepth);

  const leftGrad = ctx.createLinearGradient(x, y, x + shadowDepth, y);
  leftGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  leftGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(x, y, shadowDepth, h);

  // Bottom & Right slight bounce light
  const botGrad = ctx.createLinearGradient(x, y + h - shadowDepth / 2, x, y + h);
  botGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  botGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
  ctx.fillStyle = botGrad;
  ctx.fillRect(x, y + h - shadowDepth / 2, w, shadowDepth / 2);

  ctx.restore();
}

function drawAlignmentGuides(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);

  // Rule of thirds lines
  ctx.beginPath();
  ctx.moveTo(x + w / 3, y);
  ctx.lineTo(x + w / 3, y + h);
  ctx.moveTo(x + (w * 2) / 3, y);
  ctx.lineTo(x + (w * 2) / 3, y + h);

  ctx.moveTo(x, y + h / 3);
  ctx.lineTo(x + w, y + h / 3);
  ctx.moveTo(x, y + (h * 2) / 3);
  ctx.lineTo(x + w, y + (h * 2) / 3);
  ctx.stroke();

  // Center crosshair
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawFrameBorder(
  ctx: CanvasRenderingContext2D,
  apX: number,
  apY: number,
  apW: number,
  apH: number,
  border: number,
  style: FrameTemplate['frameStyle']
) {
  ctx.save();
  const ox = apX - border;
  const oy = apY - border;
  const ow = apW + border * 2;
  const oh = apH + border * 2;

  if (style === 'baroque_gold' || style === 'ornate_gold_thick') {
    // Ornate Multi-Tier Baroque Gilded Frame
    drawBaroqueGoldFrame(ctx, ox, oy, ow, oh, apX, apY, apW, apH, border);
  } else if (style === 'vintage_walnut') {
    // Mahogany / Walnut Museum Frame with Brass Fillet
    drawWalnutFrame(ctx, ox, oy, ow, oh, apX, apY, apW, apH, border);
  } else if (style === 'modern_black') {
    // Minimalist Anodized Studio Black Frame
    drawModernBlackFrame(ctx, ox, oy, ow, oh, apX, apY, apW, apH, border);
  } else if (style === 'natural_oak') {
    // Natural Scandinavian Oak Wood Frame
    drawNaturalOakFrame(ctx, ox, oy, ow, oh, apX, apY, apW, apH, border);
  } else if (style === 'polaroid_border') {
    // Vintage Instant Film Frame
    drawPolaroidFrame(ctx, ox, oy, ow, oh, apX, apY, apW, apH, border);
  } else {
    // Champagne Silver
    drawBaroqueGoldFrame(ctx, ox, oy, ow, oh, apX, apY, apW, apH, border, true);
  }

  ctx.restore();
}

function drawBaroqueGoldFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ow: number,
  oh: number,
  ix: number,
  iy: number,
  iw: number,
  ih: number,
  border: number,
  isSilver = false
) {
  ctx.save();

  const c1 = isSilver ? '#e2e8f0' : '#fef08a';
  const c2 = isSilver ? '#cbd5e1' : '#f59e0b';
  const c3 = isSilver ? '#94a3b8' : '#b45309';
  const c4 = isSilver ? '#475569' : '#78350f';
  const c5 = isSilver ? '#1e293b' : '#451a03';

  // 1. Base Molding Gradient (Outer Bevel)
  const outerGrad = ctx.createLinearGradient(ox, oy, ox + ow, oy + oh);
  outerGrad.addColorStop(0, c1);
  outerGrad.addColorStop(0.2, c2);
  outerGrad.addColorStop(0.5, c3);
  outerGrad.addColorStop(0.8, c4);
  outerGrad.addColorStop(1, c5);

  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.rect(ox, oy, ow, oh);
  ctx.rect(ix, iy, iw, ih);
  ctx.fill('evenodd');

  // 2. Corner Acanthus / Leaf Flourish Reliefs
  const cornerSize = border * 0.95;
  drawOrnateCorner(ctx, ox, oy, cornerSize, 'tl', isSilver);
  drawOrnateCorner(ctx, ox + ow - cornerSize, oy, cornerSize, 'tr', isSilver);
  drawOrnateCorner(ctx, ox, oy + oh - cornerSize, cornerSize, 'bl', isSilver);
  drawOrnateCorner(ctx, ox + ow - cornerSize, oy + oh - cornerSize, cornerSize, 'br', isSilver);

  // 3. Repeating Beaded Pearl / Guilloche Ornament on Frame Rails
  drawFrameOrnamentRails(ctx, ox, oy, ow, oh, border, isSilver);

  // 4. Inner Gilded Fillet / Bevel Rim
  const filletWidth = border * 0.18;
  const fx = ix - filletWidth;
  const fy = iy - filletWidth;
  const fw = iw + filletWidth * 2;
  const fh = ih + filletWidth * 2;

  const filletGrad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
  filletGrad.addColorStop(0, isSilver ? '#ffffff' : '#fef08a');
  filletGrad.addColorStop(0.4, isSilver ? '#cbd5e1' : '#d97706');
  filletGrad.addColorStop(1, isSilver ? '#64748b' : '#78350f');

  ctx.fillStyle = filletGrad;
  ctx.beginPath();
  ctx.rect(fx, fy, fw, fh);
  ctx.rect(ix, iy, iw, ih);
  ctx.fill('evenodd');

  // 5. Crisp Outer and Inner Highlights
  ctx.strokeStyle = isSilver ? '#ffffff' : '#fef9c3';
  ctx.lineWidth = 2;
  ctx.strokeRect(ox + 1, oy + 1, ow - 2, oh - 2);

  ctx.strokeStyle = isSilver ? '#334155' : '#451a03';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(ix, iy, iw, ih);

  ctx.restore();
}

function drawOrnateCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  pos: 'tl' | 'tr' | 'bl' | 'br',
  isSilver = false
) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  if (pos === 'tr') ctx.rotate(Math.PI / 2);
  if (pos === 'br') ctx.rotate(Math.PI);
  if (pos === 'bl') ctx.rotate(-Math.PI / 2);

  const goldHighlight = isSilver ? 'rgba(255, 255, 255, 0.7)' : 'rgba(254, 240, 138, 0.8)';
  const goldShadow = isSilver ? 'rgba(30, 41, 59, 0.6)' : 'rgba(69, 26, 3, 0.65)';

  // Decorative Baroque Scroll Petals
  ctx.fillStyle = goldHighlight;
  ctx.beginPath();
  ctx.arc(-size * 0.2, -size * 0.2, size * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = goldShadow;
  ctx.beginPath();
  ctx.arc(-size * 0.15, -size * 0.15, size * 0.18, 0, Math.PI * 2);
  ctx.fill();

  // Radiating Flourish Grooves
  ctx.strokeStyle = goldHighlight;
  ctx.lineWidth = 2;
  for (let a = 0; a < 5; a++) {
    const angle = (a * 18 * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(-size * 0.35, -size * 0.35);
    ctx.lineTo(-size * 0.35 + Math.cos(angle) * size * 0.45, -size * 0.35 + Math.sin(angle) * size * 0.45);
    ctx.stroke();
  }

  ctx.restore();
}

function drawFrameOrnamentRails(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ow: number,
  oh: number,
  border: number,
  isSilver = false
) {
  ctx.save();
  const beadRadius = Math.max(2, border * 0.07);
  const beadStep = beadRadius * 3;
  const beadOffset = border * 0.52;

  const beadColor = isSilver ? 'rgba(255, 255, 255, 0.65)' : 'rgba(254, 240, 138, 0.75)';
  const beadShadow = isSilver ? 'rgba(15, 23, 42, 0.5)' : 'rgba(69, 26, 3, 0.6)';

  // Top Rail Beads
  for (let bx = ox + border * 1.2; bx < ox + ow - border * 1.2; bx += beadStep) {
    ctx.fillStyle = beadShadow;
    ctx.beginPath();
    ctx.arc(bx + 1, oy + beadOffset + 1, beadRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = beadColor;
    ctx.beginPath();
    ctx.arc(bx, oy + beadOffset, beadRadius * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bottom Rail Beads
  for (let bx = ox + border * 1.2; bx < ox + ow - border * 1.2; bx += beadStep) {
    ctx.fillStyle = beadShadow;
    ctx.beginPath();
    ctx.arc(bx + 1, oy + oh - beadOffset + 1, beadRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = beadColor;
    ctx.beginPath();
    ctx.arc(bx, oy + oh - beadOffset, beadRadius * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  // Left Rail Beads
  for (let by = oy + border * 1.2; by < oy + oh - border * 1.2; by += beadStep) {
    ctx.fillStyle = beadColor;
    ctx.beginPath();
    ctx.arc(ox + beadOffset, by, beadRadius * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  // Right Rail Beads
  for (let by = oy + border * 1.2; by < oy + oh - border * 1.2; by += beadStep) {
    ctx.fillStyle = beadColor;
    ctx.beginPath();
    ctx.arc(ox + ow - beadOffset, by, beadRadius * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawWalnutFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ow: number,
  oh: number,
  ix: number,
  iy: number,
  iw: number,
  ih: number,
  border: number
) {
  ctx.save();
  // Deep Mahogany Wood Texture
  const woodGrad = ctx.createLinearGradient(ox, oy, ox + ow, oy + oh);
  woodGrad.addColorStop(0, '#451a03');
  woodGrad.addColorStop(0.3, '#78350f');
  woodGrad.addColorStop(0.7, '#2e1205');
  woodGrad.addColorStop(1, '#1b0a03');
  ctx.fillStyle = woodGrad;
  ctx.beginPath();
  ctx.rect(ox, oy, ow, oh);
  ctx.rect(ix, iy, iw, ih);
  ctx.fill('evenodd');

  // Inner Brass Fillet
  const brassW = border * 0.15;
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = brassW;
  ctx.strokeRect(ix - brassW / 2, iy - brassW / 2, iw + brassW, ih + brassW);

  // Outer Edge Highlight
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2;
  ctx.strokeRect(ox, oy, ow, oh);

  ctx.restore();
}

function drawModernBlackFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ow: number,
  oh: number,
  ix: number,
  iy: number,
  iw: number,
  ih: number,
  border: number
) {
  ctx.save();
  // Matte Anodized Black
  const blackGrad = ctx.createLinearGradient(ox, oy, ox + ow, oy + oh);
  blackGrad.addColorStop(0, '#27272a');
  blackGrad.addColorStop(0.5, '#18181b');
  blackGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = blackGrad;
  ctx.beginPath();
  ctx.rect(ox, oy, ow, oh);
  ctx.rect(ix, iy, iw, ih);
  ctx.fill('evenodd');

  // Ultra-fine metallic brushed outer chamfer
  ctx.strokeStyle = '#52525b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ox + 0.5, oy + 0.5, ow - 1, oh - 1);

  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 1;
  ctx.strokeRect(ix - 0.5, iy - 0.5, iw + 1, ih + 1);

  ctx.restore();
}

function drawNaturalOakFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ow: number,
  oh: number,
  ix: number,
  iy: number,
  iw: number,
  ih: number,
  border: number
) {
  ctx.save();
  const oakGrad = ctx.createLinearGradient(ox, oy, ox + ow, oy + oh);
  oakGrad.addColorStop(0, '#fde68a');
  oakGrad.addColorStop(0.5, '#d97706');
  oakGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = oakGrad;
  ctx.beginPath();
  ctx.rect(ox, oy, ow, oh);
  ctx.rect(ix, iy, iw, ih);
  ctx.fill('evenodd');

  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ox + 1, oy + 1, ow - 2, oh - 2);

  ctx.restore();
}

function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  ow: number,
  oh: number,
  ix: number,
  iy: number,
  iw: number,
  ih: number,
  border: number
) {
  ctx.save();
  // Classic Photographic Paper Border
  ctx.fillStyle = '#fafaf9';
  ctx.beginPath();
  ctx.rect(ox, oy, ow, oh);
  ctx.rect(ix, iy, iw, ih);
  ctx.fill('evenodd');

  // Fine edge border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(ox, oy, ow, oh);

  ctx.restore();
}

function drawFrameLightingReflections(
  ctx: CanvasRenderingContext2D,
  apX: number,
  apY: number,
  apW: number,
  apH: number,
  border: number,
  template: FrameTemplate
) {
  if (!template.hasSpotlight) return;

  ctx.save();
  const ox = apX - border;
  const oy = apY - border;
  const ow = apW + border * 2;
  const oh = apH + border * 2;

  // Specular sheen on top rail from overhead spotlight
  const sheenGrad = ctx.createLinearGradient(ox + ow * 0.2, oy, ox + ow * 0.6, oy + border);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = sheenGrad;
  ctx.fillRect(ox, oy, ow, border * 0.85);

  ctx.restore();
}
