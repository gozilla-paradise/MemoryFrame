import assert from 'node:assert/strict';
import test from 'node:test';
import type { FrameTemplate } from '../types/frame';
import * as renderer from './canvasRenderer';

const embeddedSceneTemplate = {
  id: 'embedded-scene',
  name: 'Embedded scene',
  category: 'gallery_wall',
  description: 'A complete scene with a built-in frame.',
  canvasWidth: 1080,
  canvasHeight: 1080,
  aperture: {
    x: 388 / 1080,
    y: 400 / 1080,
    width: 315 / 1080,
    height: 350 / 1080,
  },
  wallStyle: 'navy_spotlight',
  frameStyle: 'baroque_gold',
  hasSpotlight: false,
  embeddedScene: {
    src: '/memory-frame.png',
    frameBounds: {
      x: 307 / 1080,
      y: 322 / 1080,
      width: 477 / 1080,
      height: 507 / 1080,
    },
  },
} as FrameTemplate;

test('frame-only export uses the embedded scene frame bounds', () => {
  const calculateRenderViewport = (
    renderer as typeof renderer & {
      calculateRenderViewport?: (
        template: FrameTemplate,
        exportMode: 'frame_only',
        scaleFactor: number
      ) => {
        targetWidth: number;
        targetHeight: number;
        cropOffsetX: number;
        cropOffsetY: number;
      };
    }
  ).calculateRenderViewport;

  assert.ok(calculateRenderViewport, 'calculateRenderViewport must be exported');
  assert.deepEqual(calculateRenderViewport(embeddedSceneTemplate, 'frame_only', 2), {
    targetWidth: 954,
    targetHeight: 1014,
    cropOffsetX: 307,
    cropOffsetY: 322,
  });
});

test('embedded scene image is rendered as the complete canvas background', () => {
  const drawImageCalls: unknown[][] = [];
  const gradient = { addColorStop() {} };
  const context = new Proxy(
    {
      drawImage: (...args: unknown[]) => drawImageCalls.push(args),
      createLinearGradient: () => gradient,
      createRadialGradient: () => gradient,
    },
    {
      get(target, property) {
        if (property in target) {
          return target[property as keyof typeof target];
        }
        return () => undefined;
      },
    }
  ) as unknown as CanvasRenderingContext2D;
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
  } as unknown as HTMLCanvasElement;
  const sceneImage = {} as HTMLImageElement;

  (
    renderer.renderGalleryCanvas as (
      options: Parameters<typeof renderer.renderGalleryCanvas>[0] & {
        sceneImage: HTMLImageElement;
      }
    ) => void
  )({
    canvas,
    image: null,
    sceneImage,
    template: embeddedSceneTemplate,
    transform: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      flipH: false,
      flipV: false,
      fitMode: 'cover',
    },
    filters: {
      preset: 'original',
      brightness: 0,
      contrast: 0,
      saturation: 0,
      warmth: 0,
      sepia: 0,
      vignette: 0,
      glassReflect: 0,
    },
    matting: {
      enabled: false,
      color: '#fff',
      widthPercent: 0,
      bevel: false,
      innerBorder: false,
    },
    customText: {
      line1: '',
      line2: '',
      highlight: '',
      localized: '',
      showText: false,
      textColor: '#fff',
      highlightColor: '#fff',
      fontStyle: 'modern',
    },
  });

  assert.deepEqual(drawImageCalls, [[sceneImage, 0, 0, 1080, 1080]]);
});
