export interface FrameAperture {
  // Percentage coordinates within the canvas (0 to 1)
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius?: number;
  aspectRatio?: number; // width / height of opening
}

export type FrameCategory = 'gallery_wall' | 'standalone' | 'modern' | 'vintage' | 'polaroid';

export type FilterPreset =
  | 'original'
  | 'golden_hour'
  | 'vintage_film'
  | 'bw_fineart'
  | 'dramatic_noir'
  | 'soft_dreamy'
  | 'vivid_pop'
  | 'cool_oceanic'
  | 'custom';

export interface GalleryTextItem {
  line1: string; // e.g. "ONE STORY"
  line2: string; // e.g. "A MILLION"
  highlight: string; // e.g. "Memories"
  localized: string; // e.g. "1 เรื่องราว 1 ล้านความทรงจำ"
  showText: boolean;
  textColor: string;
  highlightColor: string;
  fontStyle: 'cinzel' | 'playfair' | 'classic' | 'modern';
}

export interface FrameTemplate {
  id: string;
  name: string;
  category: FrameCategory;
  description: string;
  badge?: string;
  canvasWidth: number;
  canvasHeight: number;
  aperture: FrameAperture;
  wallStyle: 'navy_spotlight' | 'museum_taupe' | 'slate_minimal' | 'dark_luxury' | 'warm_wood' | 'studio_white' | 'polaroid_desk';
  frameStyle: 'baroque_gold' | 'ornate_gold_thick' | 'modern_black' | 'natural_oak' | 'polaroid_border' | 'vintage_walnut' | 'champagne_silver';
  hasSpotlight: boolean;
  spotlightX?: number; // normalized 0..1
  spotlightY?: number;
  hasDrapery?: boolean;
  hasWoodFloor?: boolean;
  defaultText?: GalleryTextItem;
  defaultMatting?: {
    enabled: boolean;
    color: string;
    widthPercent: number; // percentage of aperture
  };
}

export interface PhotoTransform {
  x: number; // offset in canvas units
  y: number; // offset in canvas units
  scale: number; // 0.1 to 5.0
  rotation: number; // -180 to 180 degrees
  flipH: boolean;
  flipV: boolean;
  fitMode: 'custom' | 'cover' | 'contain';
}

export interface PhotoFilters {
  preset: FilterPreset;
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  warmth: number; // -100 to 100
  sepia: number; // 0 to 100
  vignette: number; // 0 to 100
  glassReflect: number; // 0 to 100
}

export interface MattingSettings {
  enabled: boolean;
  color: string;
  widthPercent: number;
  bevel: boolean;
  innerBorder: boolean;
}

export type ExportMode = 'full_scene' | 'frame_only' | 'inner_artwork';
export type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp';
export type ExportResolution = 1 | 2 | 3;
