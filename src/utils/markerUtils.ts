import L from 'leaflet';
import { Station, RegionInfo, MarkerColorMode, MarkerLabelMode } from '../types';
import { getStationAdSummary } from '../data/adSpaces';
import { StationColorTag } from './stationColorTags';

export interface MarkerRenderOptions {
  size?: number; // default global width in pixels (height is size * 1.25)
  colorMode?: MarkerColorMode;
  customColor?: string;
  labelMode?: MarkerLabelMode;
  showAdBadge?: boolean;
  isSelected?: boolean;
  isPrint?: boolean;
  stationColorTags?: Record<number, StationColorTag>;
}

export function getStationPinColor(
  station: Station,
  region: RegionInfo | undefined,
  colorMode: MarkerColorMode = 'region',
  customColor: string = '#E11D23',
  stationColorTags?: Record<number, StationColorTag>
): {
  pinColor: string;
  strokeColor: string;
  strokeWidth: number;
  innerBg: string;
  textOrIconColor: string;
  hasCustomTag?: boolean;
  tagColor?: string;
  tagLabel?: string;
} {
  const isTerm = station.isTerminal;
  const isCentrala = !!station.isHeadquarters || station.stationCode === 'DALIOIL_010';
  const tag = stationColorTags ? stationColorTags[station.id] : undefined;

  // PRIORITY: If this individual station has a custom color assigned by the user,
  // the ENTIRE POINT pin body takes this color!
  if (tag?.color) {
    if (isTerm) {
      return {
        pinColor: tag.color,
        strokeColor: '#ffffff',
        strokeWidth: 2.5,
        innerBg: '#0f172a',
        textOrIconColor: '#ffffff',
        hasCustomTag: true,
        tagColor: tag.color,
        tagLabel: tag.label,
      };
    }
    return {
      pinColor: tag.color,
      strokeColor: '#ffffff',
      strokeWidth: 2,
      innerBg: '#ffffff',
      textOrIconColor: tag.color,
      hasCustomTag: true,
      tagColor: tag.color,
      tagLabel: tag.label,
    };
  }

  // 1. User Custom Tags Mode (when no individual color is assigned to this station)
  if (colorMode === 'custom-tags') {
    if (isTerm) {
      return {
        pinColor: '#ffffff',
        strokeColor: '#64748b',
        strokeWidth: 2,
        innerBg: '#64748b',
        textOrIconColor: '#ffffff',
        hasCustomTag: false,
      };
    }
    return {
      pinColor: '#94a3b8',
      strokeColor: '#ffffff',
      strokeWidth: 1.5,
      innerBg: '#ffffff',
      textOrIconColor: '#64748b',
      hasCustomTag: false,
    };
  }

  // 2. Dalioil Red Mode
  if (colorMode === 'dalioil-red') {
    if (isTerm) {
      return {
        pinColor: '#ffffff',
        strokeColor: '#0f172a',
        strokeWidth: 2.5,
        innerBg: '#0f172a',
        textOrIconColor: '#ffffff',
      };
    }
    return {
      pinColor: '#E11D23',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      innerBg: '#ffffff',
      textOrIconColor: '#E11D23',
    };
  }

  // 3. Ad status mode (Voľné = zelená, Končí = jantár, Obsadené = červená, Centrála = sivá)
  if (colorMode === 'ad-status') {
    if (isCentrala) {
      return {
        pinColor: '#94a3b8',
        strokeColor: '#ffffff',
        strokeWidth: 2,
        innerBg: '#ffffff',
        textOrIconColor: '#64748b',
      };
    }
    const summary = getStationAdSummary(station.id);
    if (summary.free > 0) {
      return {
        pinColor: '#10B981',
        strokeColor: '#ffffff',
        strokeWidth: 2,
        innerBg: '#ffffff',
        textOrIconColor: '#10B981',
      };
    } else if (summary.expiring > 0 || summary.reserved > 0) {
      return {
        pinColor: '#F59E0B',
        strokeColor: '#ffffff',
        strokeWidth: 2,
        innerBg: '#ffffff',
        textOrIconColor: '#F59E0B',
      };
    } else {
      return {
        pinColor: '#EF4444',
        strokeColor: '#ffffff',
        strokeWidth: 2,
        innerBg: '#ffffff',
        textOrIconColor: '#EF4444',
      };
    }
  }

  // 4. Station type mode (ČS vs Terminál vs Centrála)
  if (colorMode === 'station-type') {
    if (isCentrala) {
      return {
        pinColor: '#D97706',
        strokeColor: '#ffffff',
        strokeWidth: 2.5,
        innerBg: '#ffffff',
        textOrIconColor: '#D97706',
      };
    }
    if (isTerm) {
      return {
        pinColor: '#0284C7',
        strokeColor: '#ffffff',
        strokeWidth: 2.5,
        innerBg: '#ffffff',
        textOrIconColor: '#0284C7',
      };
    }
    return {
      pinColor: '#E11D23',
      strokeColor: '#ffffff',
      strokeWidth: 2,
      innerBg: '#ffffff',
      textOrIconColor: '#E11D23',
    };
  }

  // 5. Custom uniform color
  if (colorMode === 'custom') {
    const color = customColor || '#E11D23';
    if (isTerm) {
      return {
        pinColor: '#ffffff',
        strokeColor: color,
        strokeWidth: 3,
        innerBg: color,
        textOrIconColor: '#ffffff',
      };
    }
    return {
      pinColor: color,
      strokeColor: '#ffffff',
      strokeWidth: 2,
      innerBg: '#ffffff',
      textOrIconColor: color,
    };
  }

  // Default: 'region' (Západ, Sever, Stred, Východ)
  if (isTerm) {
    return {
      pinColor: '#ffffff',
      strokeColor: '#0f172a',
      strokeWidth: 2.5,
      innerBg: '#0f172a',
      textOrIconColor: '#ffffff',
    };
  }
  const regColor = region ? region.color : '#E11D23';
  return {
    pinColor: regColor,
    strokeColor: '#ffffff',
    strokeWidth: 2,
    innerBg: '#ffffff',
    textOrIconColor: regColor,
  };
}

export function buildMarkerHtml(
  station: Station,
  region: RegionInfo | undefined,
  options: MarkerRenderOptions = {}
): string {
  const stationTag = options.stationColorTags ? options.stationColorTags[station.id] : undefined;
  // INDIVIDUAL SIZE IN PIXELS:
  // If this station has an individual custom size in pixels, use it! Otherwise fallback to options.size (default 34)
  const size = stationTag?.size || options.size || 34;
  const height = Math.round(size * 1.25);
  const colorMode = options.colorMode || 'region';
  const customColor = options.customColor || '#E11D23';
  const labelMode = options.labelMode || 'logo';
  const showAdBadge = options.showAdBadge ?? true;
  const isSelected = options.isSelected ?? false;
  const isPrint = options.isPrint ?? false;
  const stationColorTags = options.stationColorTags;

  const isTerm = station.isTerminal;
  const colorSpec = getStationPinColor(station, region, colorMode, customColor, stationColorTags);

  // Ad status badge (top right)
  let adIndicatorHtml = '';
  if (showAdBadge && !isPrint && !station.isHeadquarters && station.id !== 10) {
    const adSummary = getStationAdSummary(station.id);
    const badgeSize = Math.max(12, Math.round(size * 0.35));
    const badgeOffset = Math.round(badgeSize * 0.25);
    if (adSummary.free > 0) {
      adIndicatorHtml = `<div style="width:${badgeSize}px; height:${badgeSize}px; top:-${badgeOffset}px; right:-${badgeOffset}px;" class="absolute rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[7px] font-black text-white shadow-md z-20" title="${adSummary.free} voľných plôch">●</div>`;
    } else if (adSummary.expiring > 0) {
      adIndicatorHtml = `<div style="width:${badgeSize}px; height:${badgeSize}px; top:-${badgeOffset}px; right:-${badgeOffset}px;" class="absolute rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[7px] font-black text-black shadow-md z-20" title="${adSummary.expiring} končiacich zmlúv">!</div>`;
    }
  }

  // Inner badge dimensions
  const innerSize = Math.round(size * 0.68);
  const innerTop = Math.round(size * 0.12);
  const innerLeft = Math.round((size - innerSize) / 2);

  // Inner badge content based on labelMode
  let innerBadgeHtml = '';

  if (labelMode === 'code') {
    const rawCode = station.stationCode || station.storeCode || String(station.id);
    const shortCode = rawCode.replace('DALIOIL_', '').replace('CS-', '');
    const fontSize = Math.max(8, Math.round(innerSize * 0.44));

    innerBadgeHtml = `
      <div style="top:${innerTop}px; left:${innerLeft}px; width:${innerSize}px; height:${innerSize}px; background-color:${colorSpec.innerBg};" 
           class="absolute rounded-full flex items-center justify-center pointer-events-none shadow-inner border border-slate-200">
        <span style="font-size:${fontSize}px; color:${colorSpec.textOrIconColor};" class="font-black leading-none font-mono tracking-tight">${shortCode}</span>
      </div>
    `;
  } else if (labelMode === 'number') {
    const num = station.number || String(station.id);
    const fontSize = Math.max(8, Math.round(innerSize * 0.48));

    innerBadgeHtml = `
      <div style="top:${innerTop}px; left:${innerLeft}px; width:${innerSize}px; height:${innerSize}px; background-color:${colorSpec.innerBg};" 
           class="absolute rounded-full flex items-center justify-center pointer-events-none shadow-inner border border-slate-200">
        <span style="font-size:${fontSize}px; color:${colorSpec.textOrIconColor};" class="font-black leading-none font-sans tracking-tight">${num}</span>
      </div>
    `;
  } else {
    // labelMode: 'logo', 'city', or 'code-city'
    if (isTerm) {
      const fontSize = Math.max(9, Math.round(innerSize * 0.55));
      innerBadgeHtml = `
        <div style="top:${innerTop}px; left:${innerLeft}px; width:${innerSize}px; height:${innerSize}px;" 
             class="absolute rounded-full bg-slate-900 flex items-center justify-center pointer-events-none shadow-inner border border-slate-700">
          <span style="font-size:${fontSize}px;" class="text-white font-black leading-none font-sans tracking-tight">T</span>
        </div>
      `;
    } else {
      innerBadgeHtml = `
        <div style="top:${innerTop}px; left:${innerLeft}px; width:${innerSize}px; height:${innerSize}px;" 
             class="absolute rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden shadow-inner pointer-events-none border border-slate-100">
          <img src="/logo dali2.jpg" alt="DALI OIL" class="w-full h-full object-contain rounded-full" onerror="this.onerror=null;this.src='/logo-dali.png';" />
        </div>
      `;
    }
  }

  // External City / Code / Custom Tag Label below the pin
  let externalLabelHtml = '';
  if (colorSpec.tagLabel) {
    externalLabelHtml = `
      <div class="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 whitespace-nowrap text-white font-bold px-1.5 py-0.5 rounded text-[9px] shadow-md pointer-events-none z-30 select-none flex items-center gap-1 border border-white/30"
           style="background-color: ${colorSpec.pinColor};">
        <span>${colorSpec.tagLabel}</span>
        ${stationTag?.size ? `<span class="opacity-75 font-mono text-[8px]">(${stationTag.size}px)</span>` : ''}
      </div>
    `;
  } else if (labelMode === 'city' || labelMode === 'code-city') {
    const rawCode = station.stationCode ? station.stationCode.replace('DALIOIL_', 'CS-') : `CS-${station.id}`;
    const cityText = station.city || station.name.split('-')[0].trim();
    const labelText = labelMode === 'code-city' ? `${rawCode} ${cityText}` : cityText;

    externalLabelHtml = `
      <div class="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 whitespace-nowrap bg-white/95 dark:bg-gray-900/95 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-gray-700 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-md pointer-events-none z-30 select-none">
        ${labelText}
      </div>
    `;
  }

  return `
    <div class="dali-marker-wrapper relative group ${isSelected ? 'dali-marker-selected' : ''}" style="width:${size}px; height:${height}px;">
      <svg width="${size}" height="${height}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.45));">
        <path d="M16 1C8.268 1 2 7.268 2 15C2 24.5 14.3 37.8 15.3 38.8C15.7 39.2 16.3 39.2 16.7 38.8C17.7 37.8 30 24.5 30 15C30 7.268 23.732 1 16 1Z" 
              fill="${colorSpec.pinColor}" 
              stroke="${colorSpec.strokeColor}" 
              stroke-width="${colorSpec.strokeWidth}"/>
        <circle cx="16" cy="15" r="11" fill="${colorSpec.strokeColor === '#000000' ? '#ffffff' : colorSpec.innerBg}"/>
      </svg>
      ${innerBadgeHtml}
      ${adIndicatorHtml}
      ${externalLabelHtml}
    </div>
  `;
}

export function createLeafletMarkerIcon(
  station: Station,
  region: RegionInfo | undefined,
  options: MarkerRenderOptions = {}
): L.DivIcon {
  const stationTag = options.stationColorTags ? options.stationColorTags[station.id] : undefined;
  const size = stationTag?.size || options.size || 34;
  const height = Math.round(size * 1.25);
  const html = buildMarkerHtml(station, region, options);

  return L.divIcon({
    className: 'custom-marker',
    html,
    iconSize: [size, height],
    iconAnchor: [Math.round(size / 2), height - 1],
    popupAnchor: [0, -height + 2],
  });
}
