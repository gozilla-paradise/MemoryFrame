import { PhotoFilters, FilterPreset } from '../types/frame';
import {
  Sun,
  Contrast,
  Sparkles,
  Flame,
  Clock,
  CircleDot,
  RotateCcw,
} from 'lucide-react';

interface FilterControlsProps {
  filters: PhotoFilters;
  onFilterChange: (newFilters: PhotoFilters) => void;
}

const FILTER_PRESETS: Array<{
  id: FilterPreset;
  name: string;
  desc: string;
  presetFilters: Partial<PhotoFilters>;
}> = [
  {
    id: 'original',
    name: 'Original',
    desc: 'True natural tones',
    presetFilters: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      warmth: 0,
      sepia: 0,
      vignette: 0,
    },
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    desc: 'Warm sunset glow',
    presetFilters: {
      brightness: 5,
      contrast: 8,
      saturation: 15,
      warmth: 35,
      sepia: 10,
      vignette: 15,
    },
  },
  {
    id: 'vintage_film',
    name: 'Vintage Film',
    desc: 'Classic Kodak nostalgia',
    presetFilters: {
      brightness: 4,
      contrast: -5,
      saturation: -10,
      warmth: 20,
      sepia: 25,
      vignette: 25,
    },
  },
  {
    id: 'bw_fineart',
    name: 'Fine Art B&W',
    desc: 'High contrast monochrome',
    presetFilters: {
      brightness: 5,
      contrast: 20,
      saturation: -100,
      warmth: 0,
      sepia: 0,
      vignette: 20,
    },
  },
  {
    id: 'dramatic_noir',
    name: 'Dramatic Noir',
    desc: 'Deep shadows & film grain',
    presetFilters: {
      brightness: -10,
      contrast: 35,
      saturation: -85,
      warmth: -10,
      sepia: 5,
      vignette: 45,
    },
  },
  {
    id: 'soft_dreamy',
    name: 'Soft Dreamy',
    desc: 'Gentle airy highlights',
    presetFilters: {
      brightness: 12,
      contrast: -15,
      saturation: 5,
      warmth: 15,
      sepia: 5,
      vignette: 5,
    },
  },
  {
    id: 'vivid_pop',
    name: 'Vivid Pop',
    desc: 'Punchy saturated colors',
    presetFilters: {
      brightness: 5,
      contrast: 15,
      saturation: 30,
      warmth: 5,
      sepia: 0,
      vignette: 10,
    },
  },
  {
    id: 'cool_oceanic',
    name: 'Cool Oceanic',
    desc: 'Crisp azure mood',
    presetFilters: {
      brightness: 0,
      contrast: 10,
      saturation: 10,
      warmth: -30,
      sepia: 0,
      vignette: 15,
    },
  },
];

export function FilterControls({
  filters,
  onFilterChange,
}: FilterControlsProps) {
  const applyPreset = (presetId: FilterPreset) => {
    const target = FILTER_PRESETS.find((p) => p.id === presetId);
    if (!target) return;
    onFilterChange({
      ...filters,
      preset: presetId,
      ...target.presetFilters,
    });
  };

  const handleResetFilters = () => {
    applyPreset('original');
  };

  return (
    <div className="space-y-4">
      {/* Presets Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Aesthetic Filters
          </label>
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {FILTER_PRESETS.map((p) => {
            const isSelected = filters.preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 text-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-slate-800">
                    {p.name}
                  </span>
                  {isSelected && (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Fine-Tuning Sliders */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-3.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Fine-Tuning Adjustments
        </span>

        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-indigo-600" />
              <span>Brightness</span>
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {filters.brightness > 0 ? `+${filters.brightness}` : filters.brightness}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={filters.brightness}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                preset: 'custom',
                brightness: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-indigo-600" />
              <span>Contrast</span>
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {filters.contrast > 0 ? `+${filters.contrast}` : filters.contrast}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={filters.contrast}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                preset: 'custom',
                contrast: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Saturation</span>
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {filters.saturation > 0 ? `+${filters.saturation}` : filters.saturation}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={filters.saturation}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                preset: 'custom',
                saturation: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Warmth */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-indigo-600" />
              <span>Color Temperature / Warmth</span>
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {filters.warmth > 0 ? `+${filters.warmth}` : filters.warmth}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={filters.warmth}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                preset: 'custom',
                warmth: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Sepia */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Vintage Sepia</span>
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {filters.sepia}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.sepia}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                preset: 'custom',
                sepia: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Vignette */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5 text-indigo-600" />
              <span>Vignette Edge Falloff</span>
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {filters.vignette}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            value={filters.vignette}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                preset: 'custom',
                vignette: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Museum Glass Reflection Sheen */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Museum Glass Sheen</span>
            </span>
            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {filters.glassReflect}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={filters.glassReflect}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                glassReflect: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
