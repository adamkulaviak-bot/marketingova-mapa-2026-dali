import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RegionId, RegionInfo, Station, MarkerColorMode, MarkerLabelMode, CurrentMapViewInfo, StationDetailTab } from '../types';
import { SLOVAKIA_GEOJSON, SLOVAKIA_MASK_GEOJSON } from '../data/slovakiaGeo';
import { getStationAdSummary } from '../data/adSpaces';
import { hasStationLcdScreens } from '../data/lcdScreensData';
import { Eye, EyeOff, Layers, RotateCcw, ShieldAlert, MapPin, X, Sparkles, Clock, Palette, Sliders, Box, Printer } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { createLeafletMarkerIcon } from '../utils/markerUtils';
import {
  getStoredColorTags,
  setStationColorTag,
  removeStationColorTag,
  setStationPointSize,
  resetStationPointSize,
  COLOR_TAGS_EVENT,
  TAG_COLORS,
  StationColorTag,
} from '../utils/stationColorTags';

export type TileTheme = 'light' | 'dark' | 'standard';

interface MapComponentProps {
  stations: Station[];
  allStations: Station[];
  regions: Record<RegionId, RegionInfo>;
  selectedStationId: number | null;
  selectedStationTrigger?: number;
  onSelectStation: (id: number | null) => void;
  onOpenStationDetail?: (stationId: number, tab?: StationDetailTab) => void;
  isolateSlovakia: boolean;
  onToggleIsolation: () => void;
  onOpenSidebar: () => void;
  onResetAllFilters?: () => void;
  onOpenColorCustomizer?: () => void;
  onOpenThreeDMapping?: () => void;
  onOpenPrintView?: () => void;
  activeMarkerSize?: number;
  activeMarkerColorMode?: MarkerColorMode;
  activeMarkerLabelMode?: MarkerLabelMode;
  activeCustomColor?: string;
  showAdBadge?: boolean;
  onToggleShowAdBadge?: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  stations,
  allStations,
  regions,
  selectedStationId,
  selectedStationTrigger,
  onSelectStation,
  onOpenStationDetail,
  isolateSlovakia,
  onToggleIsolation,
  onOpenSidebar,
  onResetAllFilters,
  onOpenColorCustomizer,
  onOpenThreeDMapping,
  onOpenPrintView,
  activeMarkerSize = 34,
  activeMarkerColorMode = 'region',
  activeMarkerLabelMode = 'logo',
  activeCustomColor = '#E11D23',
  showAdBadge = true,
  onToggleShowAdBadge,
}) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const maskLayerRef = useRef<L.GeoJSON | null>(null);
  const borderGlowLayerRef = useRef<L.GeoJSON | null>(null);
  const borderLineLayerRef = useRef<L.GeoJSON | null>(null);
  const markersMapRef = useRef<Map<number, L.Marker>>(new Map());
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Settings
  const [borderColor, setBorderColor] = useState<string>('#E11D23');
  const [tileTheme, setTileTheme] = useState<TileTheme>('standard');
  const [maskIntensity, setMaskIntensity] = useState<'solid' | 'veil'>('solid');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState<boolean>(false);
  const [stationColorTags, setStationColorTags] = useState<Record<number, StationColorTag>>(() => getStoredColorTags());

  useEffect(() => {
    const handleTagsChange = () => {
      setStationColorTags(getStoredColorTags());
    };
    window.addEventListener(COLOR_TAGS_EVENT, handleTagsChange);
    return () => window.removeEventListener(COLOR_TAGS_EVENT, handleTagsChange);
  }, []);

  // 3 crystal-clear basemaps: Svetlá - šedá (CartoDB Positron), Tmavá - čierna (CartoDB Dark Matter), Obyčajná (OpenStreetMap)
  const basemapConfigs: Record<TileTheme, {
    name: string;
    shortName: string;
    icon: string;
    description: string;
    url: string;
    subdomains: string;
    className: string;
    maxZoom: number;
    maxNativeZoom: number;
    attribution: string;
  }> = {
    light: {
      name: 'Svetlá - šedá',
      shortName: 'Svetlá - šedá',
      icon: '⚪',
      description: 'Prehľadná svetlo-sivá mapa s vyznačenou cestnou sieťou a názvami miest SR',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      className: 'map-tiles-light-gray',
      maxZoom: 19,
      maxNativeZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> prispievatelia',
    },
    dark: {
      name: 'Tmavá - čierna',
      shortName: 'Tmavá - čierna',
      icon: '⚫',
      description: 'Hlboká tmavo-čierna nočná mapa so zreteľnými cestami a bielymi názvami obcí',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      className: 'map-tiles-dark-black',
      maxZoom: 19,
      maxNativeZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> prispievatelia',
    },
    standard: {
      name: 'Obyčajná',
      shortName: 'Obyčajná',
      icon: '🗺️',
      description: 'Klasická štandardná plnofarebná kartografická mapa (OpenStreetMap) so všetkými obcami a cestami SR',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      className: 'map-tiles-clean',
      maxZoom: 19,
      maxNativeZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> prispievatelia',
    },
  };

  // Helper calculating the mask style covering surrounding countries outside Slovakia
  const getMaskStyle = (
    isolated: boolean,
    themeMode: TileTheme,
    intensity: 'solid' | 'veil',
    uiMode: 'dark' | 'light'
  ): L.PathOptions => {
    if (!isolated) {
      return {
        fillColor: '#000000',
        fillOpacity: 0,
        weight: 0,
        opacity: 0,
        stroke: false,
      };
    }

    const alpha = intensity === 'solid' ? 0.98 : 0.72;

    if (themeMode === 'dark') {
      return {
        fillColor: '#0b0e14',
        fillOpacity: alpha,
        weight: 0,
        opacity: 0,
        stroke: false,
      };
    } else if (themeMode === 'light') {
      return {
        fillColor: '#f1f5f9',
        fillOpacity: alpha,
        weight: 0,
        opacity: 0,
        stroke: false,
      };
    } else {
      // standard (Obyčajná)
      return {
        fillColor: uiMode === 'dark' ? '#0f172a' : '#f1f5f9',
        fillOpacity: alpha,
        weight: 0,
        opacity: 0,
        stroke: false,
      };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Set initial container theme class
    mapContainerRef.current.classList.add(`theme-${tileTheme}`);

    // Center of Slovakia: ~48.6690, 19.6990
    // zoomSnap: 1 eliminates fractional zoom sub-pixel rounding seams
    const map = L.map(mapContainerRef.current, {
      center: [48.669, 19.699],
      zoom: 8,
      minZoom: 6,
      maxZoom: 19,
      zoomControl: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 140,
      wheelDebounceTime: 40,
    });

    mapInstanceRef.current = map;

    // Tile Layer: Clean native raster tiles without external API keys or watermarks
    const initialConfig = basemapConfigs[tileTheme];
    const tileLayer = L.tileLayer(initialConfig.url, {
      maxZoom: initialConfig.maxZoom,
      maxNativeZoom: initialConfig.maxNativeZoom,
      subdomains: initialConfig.subdomains,
      className: initialConfig.className,
      keepBuffer: 8,
      updateWhenZooming: false,
      updateInterval: 100,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom controls at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom attribution
    L.control
      .attribution({
        position: 'bottomleft',
        prefix:
          '<span class="text-[11px] text-gray-400 font-semibold px-2 py-0.5 bg-gray-900/90 rounded border border-gray-800">DALIOIL SLOVAKIA</span>',
      })
      .addTo(map);

    // Dedicated pane for surrounding countries mask (above tiles at 200, below overlay at 400)
    let maskPane = map.getPane('maskPane');
    if (!maskPane) {
      maskPane = map.createPane('maskPane');
      maskPane.style.zIndex = '350';
      maskPane.style.pointerEvents = 'none';
    }

    // 0. Surrounding Countries Mask Layer (wipes/masks countries outside Slovakia borders)
    const maskLayer = L.geoJSON(SLOVAKIA_MASK_GEOJSON as any, {
      pane: 'maskPane',
      interactive: false,
      style: () => getMaskStyle(isolateSlovakia, tileTheme, maskIntensity, theme),
    }).addTo(map);
    maskLayerRef.current = maskLayer;

    // 1. Slovakia Border Glow Layer (prominent territorial boundary)
    const borderGlow = L.geoJSON(SLOVAKIA_GEOJSON as any, {
      interactive: false,
      style: {
        color: borderColor,
        weight: isolateSlovakia ? 7 : 4,
        opacity: isolateSlovakia ? 0.35 : 0.15,
        fill: false,
      },
    }).addTo(map);
    borderGlowLayerRef.current = borderGlow;

    // 2. Slovakia Border Core Crisp Line (crisp red national boundary)
    const borderLine = L.geoJSON(SLOVAKIA_GEOJSON as any, {
      interactive: false,
      style: {
        color: borderColor,
        weight: isolateSlovakia ? 3 : 2,
        opacity: isolateSlovakia ? 0.95 : 0.6,
        fill: false,
      },
    }).addTo(map);
    borderLineLayerRef.current = borderLine;

    // Markers layer group
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Auto-fit to Slovakia polygon
    try {
      const geoBounds = borderLine.getBounds();
      if (geoBounds.isValid()) {
        map.fitBounds(geoBounds, {
          padding: [30, 30],
          maxZoom: 9,
        });
      }
    } catch {
      map.setView([48.669, 19.699], 8);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Theme seamlessly
  const prevThemeRef = useRef<TileTheme>(tileTheme);
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    if (prevThemeRef.current === tileTheme) return;
    prevThemeRef.current = tileTheme;

    const map = mapInstanceRef.current;
    const config = basemapConfigs[tileTheme];

    // Update container background class
    if (mapContainerRef.current) {
      mapContainerRef.current.classList.remove('theme-light', 'theme-dark', 'theme-standard');
      mapContainerRef.current.classList.add(`theme-${tileTheme}`);
    }

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      maxNativeZoom: config.maxNativeZoom,
      subdomains: config.subdomains,
      className: config.className,
      keepBuffer: 8,
      updateWhenZooming: false,
      updateInterval: 100,
    }).addTo(map);

    // Keep tiles at the back of the pane hierarchy
    if ('bringToBack' in newTileLayer) {
      (newTileLayer as any).bringToBack();
    }

    tileLayerRef.current = newTileLayer;
  }, [tileTheme]);

  // Update Mask Layer & Border Highlight
  useEffect(() => {
    if (maskLayerRef.current) {
      maskLayerRef.current.setStyle(
        getMaskStyle(isolateSlovakia, tileTheme, maskIntensity, theme)
      );
    }

    if (borderGlowLayerRef.current) {
      borderGlowLayerRef.current.setStyle({
        color: borderColor,
        weight: isolateSlovakia ? 7 : 4,
        opacity: isolateSlovakia ? (theme === 'dark' ? 0.45 : 0.3) : (theme === 'dark' ? 0.2 : 0.1),
      });
    }

    if (borderLineLayerRef.current) {
      borderLineLayerRef.current.setStyle({
        color: borderColor,
        weight: isolateSlovakia ? 3 : 2,
        opacity: isolateSlovakia ? 0.95 : 0.6,
      });
    }
  }, [isolateSlovakia, tileTheme, maskIntensity, borderColor, theme]);

  // Render Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markersMapRef.current.clear();

    stations.forEach((station) => {
      const reg = regions[station.region];
      const isTerm = station.isTerminal;
      const isCentrala = !!station.isHeadquarters || station.stationCode === 'DALIOIL_010';
      const isPriorityStation = station.stationCode === 'DALIOIL_030' || station.id === 30;
      const isSelected = selectedStationId === station.id;
      const adSummary = getStationAdSummary(station.id);

      const stationTag = stationColorTags[station.id];

      const customIcon = createLeafletMarkerIcon(station, reg, {
        size: activeMarkerSize,
        colorMode: activeMarkerColorMode,
        labelMode: activeMarkerLabelMode,
        customColor: activeCustomColor,
        showAdBadge: showAdBadge,
        isSelected,
        isPrint: false,
        stationColorTags,
      });

      // Priority on map:
      // Selected station: 3500
      // DALIOIL_030: 2500 (primary priority - clearly on top in Veľké Bierovce)
      // Normal stations: 100
      // Terminals: 50
      // Centrála: 10 (druhoradá / secondary)
      const markerZIndex = isSelected
        ? 3500
        : isPriorityStation
        ? 2500
        : isCentrala
        ? 10
        : isTerm
        ? 50
        : 100;

      const marker = L.marker([station.lat, station.lng], {
        icon: customIcon,
        zIndexOffset: markerZIndex,
        title: station.name,
      });

      // Custom Popup HTML
      const rep = reg.rep;
      const googleMapsUrl = station.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;
      const googleStreetViewUrl = station.googleStreetViewUrl;
      const isDark = theme === 'dark';

      const popupWidth = Math.min(520, typeof window !== 'undefined' ? window.innerWidth - 32 : 520);
      const dailyVisits = station.dailyVisitsCashier || (station.monthlyVisitsCashier ? Math.round(station.monthlyVisitsCashier / 30) : 0);

      const popupHtml = `
        <div class="w-[490px] sm:w-[530px] max-w-[calc(100vw-36px)] font-sans ${isDark ? 'bg-[#111827] text-slate-100 border-gray-700' : 'bg-white text-slate-900 border-slate-200'} rounded-xl overflow-hidden border shadow-2xl">
          <!-- Header -->
          <div class="p-3.5 pr-8 ${isDark ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700/80' : 'bg-slate-50 border-slate-200'} border-b">
            <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${reg.badgeBg}">
                ${reg.name}
              </span>
              <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-slate-200 text-slate-700 border-slate-300'} border">
                ${station.stationCode || station.storeCode || `CS-${String(station.id).padStart(3, '0')}`}
              </span>
              ${
                station.isGoogleVerified
                  ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-blue-950/80 text-blue-300 border-blue-700/60' : 'bg-blue-50 text-blue-700 border-blue-200'} border flex items-center gap-0.5" title="Overená integrácia Google Mapy & Street View">✓ Google</span>`
                  : ''
              }
              ${
                station.openingHours
                  ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      station.openingHours.includes('NONSTOP')
                        ? isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : isDark ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-slate-200 text-slate-700 border-slate-300'
                    }">🕒 ${station.openingHours}</span>`
                  : ''
              }
              ${
                !isCentrala && dailyVisits > 0
                  ? `<span class="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                      isDark ? 'bg-red-950/60 text-red-300 border-red-800/60' : 'bg-red-50 text-red-700 border-red-200'
                    }" title="Prepočítaný denný priemer: ${dailyVisits.toLocaleString('sk-SK')} bločkov/deň (mesačne: ${station.monthlyVisitsCashier?.toLocaleString('sk-SK')})">🧾 ~${dailyVisits.toLocaleString('sk-SK')} bločkov/deň</span>`
                  : ''
              }
            </div>

            <div>
              <h3 class="font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'} tracking-wide leading-tight">
                ${station.name}
              </h3>
              <div class="${isDark ? 'text-gray-300' : 'text-slate-600'} text-xs font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                <span>📍 ${station.street ? `${station.street}, ${station.zip || ''} ${station.city || station.name}` : (station.note || '')}</span>
                ${station.phone ? `<a href="tel:${station.phone}" class="${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'} font-semibold font-mono hover:underline">📞 ${station.phone}</a>` : ''}
              </div>
            </div>
          </div>

          <!-- 2-Column Body Layout (Horizontal / Do šírky) -->
          <div class="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <!-- LEFT COLUMN: Reklamné plochy & Kontakty -->
            <div class="space-y-2.5 flex flex-col justify-between">
              
              <!-- Reklamné plochy OOH box -->
              ${
                !isCentrala && adSummary.total > 0
                  ? `<div class="p-2.5 rounded-xl ${isDark ? 'bg-gray-900/90 border-amber-500/40' : 'bg-amber-50/80 border-amber-300/70'} border space-y-1.5">
                <div class="text-[10px] uppercase font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'} tracking-wider flex items-center justify-between">
                  <span>Reklamné plochy (${adSummary.total})</span>
                  <span class="text-[10px] ${isDark ? 'text-gray-300' : 'text-slate-600'} font-semibold">${adSummary.occupancyPercent}% obsadenosť</span>
                </div>

                <div class="flex items-center gap-2 text-[11px] font-semibold flex-wrap">
                  ${
                    adSummary.free > 0
                      ? `<span class="${isDark ? 'text-emerald-400' : 'text-emerald-600'} flex items-center gap-1 font-bold">
                          <span class="w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}"></span>
                          ${adSummary.free} voľných
                        </span>`
                      : `<span class="${isDark ? 'text-gray-400' : 'text-slate-400'}">0 voľných</span>`
                  }
                  ${
                    adSummary.expiring > 0
                      ? `<span class="${isDark ? 'text-amber-400' : 'text-amber-600'} flex items-center gap-1 font-semibold">
                          <span class="w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-500'}"></span>
                          ${adSummary.expiring} končí
                        </span>`
                      : ''
                  }
                  <span class="${isDark ? 'text-gray-400' : 'text-slate-500'} font-normal">(${adSummary.occupied} obsadené)</span>
                </div>
              </div>`
                  : isCentrala ? `
              <div class="p-2.5 rounded-xl ${isDark ? 'bg-slate-900/70 border-slate-700/60' : 'bg-slate-50 border-slate-200'} border text-[11px] text-slate-500 dark:text-gray-400 space-y-0.5">
                <div class="font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1">
                  <span>🏢</span>
                  <span>Administratívne riaditeľstvo DALITRANS</span>
                </div>
                <div class="text-[10px] text-slate-500 dark:text-gray-400">
                  Lokalita bez komerčných reklamných plôch a LCD obrazoviek.
                </div>
              </div>` : ''
              }

              <!-- Denné bločky & Pokladňa (prepočet z auditu) -->
              ${
                !isCentrala && (dailyVisits > 0 || station.monthlyVisitsCashier)
                  ? `
              <div class="p-2.5 rounded-xl ${isDark ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50/70 border-red-200'} border space-y-1">
                <div class="text-[9px] uppercase font-bold ${isDark ? 'text-red-400' : 'text-red-700'} tracking-wider flex items-center justify-between">
                  <span class="flex items-center gap-1">🧾 Denné bločky (pokladňa):</span>
                  <span class="text-[9px] font-mono font-bold ${isDark ? 'text-red-300' : 'text-red-700'}">~${dailyVisits.toLocaleString('sk-SK')} / deň</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-xs font-mono flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                    ${dailyVisits.toLocaleString('sk-SK')} bločkov denne
                  </span>
                  <span class="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                    (${station.monthlyVisitsCashier?.toLocaleString('sk-SK')} / mesiac)
                  </span>
                </div>
              </div>`
                  : ''
              }

              <!-- Vedúci prevádzky (len pre bežné prevádzky) -->
              ${
                !isCentrala
                  ? `
              <div class="p-2.5 rounded-xl ${isDark ? 'bg-amber-950/30 border-amber-500/30' : 'bg-amber-50/70 border-amber-200'} border space-y-1">
                <div class="text-[9px] uppercase font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'} tracking-wider flex items-center justify-between">
                  <span>👤 Vedúci prevádzky:</span>
                  <span class="text-[9px] ${isDark ? 'text-amber-300' : 'text-amber-800'} font-mono font-bold">${station.city || 'Lokalita'}</span>
                </div>
                
                <div class="font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-xs flex items-center justify-between gap-1 flex-wrap">
                  <span>${station.manager || 'Nezadaný'}</span>
                  ${station.managerPhone ? `<a href="tel:${station.managerPhone.replace(/\s+/g, '')}" class="text-[11px] font-mono text-emerald-500 hover:underline font-bold">📞 ${station.managerPhone}</a>` : (station.phone ? `<a href="tel:${station.phone}" class="text-[11px] font-mono text-emerald-500 hover:underline font-bold">📞 ${station.phone}</a>` : '')}
                </div>
              </div>

              <!-- Area manažér -->
              <div class="p-2.5 rounded-xl ${isDark ? 'bg-gray-800/80 border-gray-700/80' : 'bg-slate-50 border-slate-200'} border space-y-1">
                <div class="text-[9px] uppercase font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} tracking-wider flex items-center justify-between">
                  <span>👔 Area manažér:</span>
                  <span class="text-[9px] ${isDark ? 'text-gray-400' : 'text-slate-500'}">${reg.shortName}</span>
                </div>
                
                <div class="font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-xs">
                  ${rep.name}
                </div>

                <div class="pt-1 flex items-center justify-between text-[11px] font-medium border-t ${isDark ? 'border-gray-700/60' : 'border-slate-200'} mt-1">
                  <a href="tel:${rep.phoneRaw}" class="flex items-center gap-1 ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition font-mono font-medium">
                    <span>📞 ${rep.phone}</span>
                  </a>
                  <a href="mailto:${rep.email}" class="${isDark ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'} transition font-medium">
                    <span>✉️ e-mail</span>
                  </a>
                </div>
              </div>`
                  : ''
              }

            </div>

            <!-- RIGHT COLUMN: Úprava pointu & Akčné tlačidlá -->
            <div class="space-y-2.5 flex flex-col justify-between">

              <!-- Farba celého pointu a individuálna veľkosť v px -->
              <div class="p-2.5 rounded-xl ${isDark ? 'bg-gray-900/95 border-gray-700/80' : 'bg-slate-50 border-slate-200'} border space-y-2">
                <!-- 1. Farba celého pointu -->
                <div>
                  <div class="text-[9px] uppercase font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} tracking-wider flex items-center justify-between mb-1">
                    <span>🎨 Farba pointu:</span>
                    ${
                      stationTag?.color
                        ? `<span class="text-[9px] font-bold flex items-center gap-1" style="color: ${stationTag.color};">
                             <span class="w-2 h-2 rounded-full" style="background-color: ${stationTag.color};"></span>
                             ${stationTag.label || 'Vlastná'}
                           </span>`
                        : '<span class="text-[9px] text-slate-400">Predvolená</span>'
                    }
                  </div>
                  <div class="flex items-center gap-1 pt-0.5 justify-between flex-wrap">
                    <div class="flex items-center gap-1 flex-wrap">
                      ${TAG_COLORS.map(
                        (tc) => `
                        <button 
                          data-action="set-station-tag" 
                          data-station-id="${station.id}" 
                          data-color="${tc.color}" 
                          class="w-4.5 h-4.5 rounded-full transition transform hover:scale-125 cursor-pointer ${
                            stationTag?.color === tc.color ? 'ring-2 ring-slate-900 dark:ring-white scale-110 shadow-sm' : 'opacity-75 hover:opacity-100'
                          }" 
                          style="background-color: ${tc.color};" 
                          title="${tc.name}">
                        </button>
                      `
                      ).join('')}
                    </div>
                    ${
                      stationTag?.color
                        ? `
                      <button 
                        data-action="remove-station-tag" 
                        data-station-id="${station.id}" 
                        class="text-[9px] text-red-500 hover:text-red-700 hover:underline font-bold px-1 py-0.5 cursor-pointer" 
                        title="Zrušiť vlastnú farbu">
                        ✕ Reset
                      </button>
                    `
                        : ''
                    }
                  </div>
                </div>

                <!-- 2. Veľkosť tohto pointu v px -->
                <div class="pt-1.5 border-t ${isDark ? 'border-gray-800' : 'border-slate-200'}">
                  <div class="text-[9px] uppercase font-bold ${isDark ? 'text-gray-400' : 'text-slate-500'} tracking-wider flex items-center justify-between mb-1">
                    <span>📐 Veľkosť:</span>
                    <span class="text-[9px] font-mono font-bold text-red-600 dark:text-red-400">
                      ${stationTag?.size || activeMarkerSize} px ${stationTag?.size ? '(vlastná)' : ''}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 justify-between">
                    <button 
                      data-action="adjust-station-size" 
                      data-station-id="${station.id}" 
                      data-delta="-4" 
                      data-current="${stationTag?.size || activeMarkerSize}"
                      class="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold text-[9px] cursor-pointer"
                      title="Zmenšiť point o 4px">
                      -4px
                    </button>
                    
                    <div class="flex items-center gap-0.5">
                      ${[28, 34, 44, 52, 62].map(sz => `
                        <button
                          data-action="set-station-size"
                          data-station-id="${station.id}"
                          data-size="${sz}"
                          class="px-1 py-0.5 rounded font-bold text-[8.5px] cursor-pointer transition ${
                            (stationTag?.size || activeMarkerSize) === sz ? 'bg-red-600 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300'
                          }"
                          title="Nastaviť ${sz}px">
                          ${sz}
                        </button>
                      `).join('')}
                    </div>

                    <button 
                      data-action="adjust-station-size" 
                      data-station-id="${station.id}" 
                      data-delta="4" 
                      data-current="${stationTag?.size || activeMarkerSize}"
                      class="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold text-[9px] cursor-pointer"
                      title="Zväčšiť point o 4px">
                      +4px
                    </button>
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="space-y-1.5">
                <!-- 2x LCD Screens DOOH Live Action (iba pre prevádzky s LCD obrazovkami) -->
                ${
                  hasStationLcdScreens(station)
                    ? `<button id="btn-open-lcd-${station.id}" class="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-lg text-center transition flex items-center justify-between border border-red-500/50 shadow-sm cursor-pointer group">
                  <span class="flex items-center gap-1.5">
                    <span class="text-xs">📺</span>
                    <span>2× LCD Obrazovky (DOOH)</span>
                  </span>
                  <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE</span>
                  </span>
                </button>`
                    : ''
                }

                <!-- Primary Action: Open Ads or Station Detail -->
                ${
                  adSummary.total > 0
                    ? `<button id="btn-open-ads-${station.id}" class="w-full py-2 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-lg text-center transition flex items-center justify-center gap-1.5 shadow-md shadow-red-950/30 cursor-pointer">
                  <span>🎯 Reklamné plochy & Detail (${adSummary.total})</span>
                </button>`
                    : `<button id="btn-open-ads-${station.id}" class="w-full py-2 bg-gradient-to-r from-amber-600 via-slate-800 to-slate-900 hover:from-amber-500 hover:to-slate-800 text-white font-extrabold text-xs rounded-lg text-center transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
                  <span>🏢 Profil a informácie centrály</span>
                </button>`
                }

                <!-- Google Mapy & Google Street View Buttons -->
                <div class="grid grid-cols-2 gap-1.5">
                  <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="py-1 px-1.5 ${isDark ? 'bg-sky-950/70 hover:bg-sky-900/90 text-sky-300 border-sky-700/60' : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-300'} font-bold rounded-lg text-center transition flex items-center justify-center gap-1 border text-[10.5px] shadow-2xs" title="Otvoriť overené Google Mapy prevádzky">
                    <span>📍 Google Mapy</span>
                  </a>
                  ${
                    googleStreetViewUrl
                      ? `<a href="${googleStreetViewUrl}" target="_blank" rel="noopener noreferrer" class="py-1 px-1.5 ${isDark ? 'bg-amber-950/70 hover:bg-amber-900/90 text-amber-300 border-amber-700/60' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'} font-bold rounded-lg text-center transition flex items-center justify-center gap-1 border text-[10.5px] shadow-2xs" title="Otvoriť Google Street View 360° panorámu">
                          <span>👁️ Street View</span>
                        </a>`
                      : `<button id="btn-zoom-detail-${station.id}" class="py-1 px-1.5 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'} font-semibold rounded-lg text-center transition border text-[10.5px] cursor-pointer">
                          <span>🔍 Priblížiť</span>
                        </button>`
                  }
                </div>

                <!-- 3D Mapovanie prevádzok DALIOIL (http://10.7.0.230/pumpy/) -->
                <a href="http://10.7.0.230/pumpy/" target="_blank" rel="noopener noreferrer" class="w-full py-1 px-2 ${isDark ? 'bg-purple-950/80 hover:bg-purple-900 text-purple-200 border-purple-700/70' : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-300'} font-bold rounded-lg text-center transition flex items-center justify-between gap-1 border text-[10.5px] shadow-2xs group" title="Otvoriť 3D priestorové mapovanie prevádzok siete DALIOIL (http://10.7.0.230/pumpy/)">
                  <span class="flex items-center gap-1 font-extrabold">
                    <span class="text-xs">🧊</span>
                    <span>3D Mapovanie</span>
                  </span>
                  <span class="text-[8.5px] font-mono px-1 py-0.2 rounded ${isDark ? 'bg-purple-900/90 text-purple-300 border border-purple-600/50' : 'bg-purple-200 text-purple-800 border border-purple-300'}">10.7.0.230 ↗</span>
                </a>
              </div>

            </div>

          </div>

          <!-- Bottom utility footer row -->
          <div class="px-3.5 py-1.5 ${isDark ? 'bg-gray-900/90 border-gray-800 text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-500'} border-t flex items-center justify-between text-[10px]">
            <span class="font-mono text-[9.5px]">GPS: ${station.lat.toFixed(4)}, ${station.lng.toFixed(4)}</span>
            <button id="btn-zoom-detail-${station.id}" class="hover:underline text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-gray-200 cursor-pointer flex items-center gap-1">
              <span>🔍 Priblížiť na mape</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        minWidth: Math.min(480, popupWidth),
        maxWidth: 540,
        autoPanPadding: [24, 24],
        className: 'station-wide-popup',
      });

      marker.on('click', () => {
        onSelectStation(station.id);
      });

      marker.addTo(markersLayer);
      markersMapRef.current.set(station.id, marker);
    });
  }, [
    stations,
    regions,
    onSelectStation,
    onOpenStationDetail,
    theme,
    selectedStationId,
    activeMarkerSize,
    activeMarkerColorMode,
    activeMarkerLabelMode,
    activeCustomColor,
    stationColorTags,
    showAdBadge,
  ]);

  // Robust Global Event Delegation for Popup Buttons
  useEffect(() => {
    const handleMapPopupClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, a') as HTMLElement | null;
      if (!target) return;

      if (target.dataset && target.dataset.action === 'set-station-tag') {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.dataset.stationId || '', 10);
        const color = target.dataset.color || '#E11D23';
        if (!isNaN(stId)) {
          setStationColorTag(stId, color);
          setTimeout(() => {
            const marker = markersMapRef.current.get(stId);
            if (marker && marker.isPopupOpen()) {
              marker.openPopup();
            }
          }, 30);
        }
      } else if (target.dataset && target.dataset.action === 'remove-station-tag') {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.dataset.stationId || '', 10);
        if (!isNaN(stId)) {
          removeStationColorTag(stId);
          setTimeout(() => {
            const marker = markersMapRef.current.get(stId);
            if (marker && marker.isPopupOpen()) {
              marker.openPopup();
            }
          }, 30);
        }
      } else if (target.dataset && target.dataset.action === 'set-station-size') {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.dataset.stationId || '', 10);
        const sz = parseInt(target.dataset.size || '34', 10);
        if (!isNaN(stId) && !isNaN(sz)) {
          setStationPointSize(stId, sz);
          setTimeout(() => {
            const marker = markersMapRef.current.get(stId);
            if (marker && marker.isPopupOpen()) {
              marker.openPopup();
            }
          }, 30);
        }
      } else if (target.dataset && target.dataset.action === 'adjust-station-size') {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.dataset.stationId || '', 10);
        const delta = parseInt(target.dataset.delta || '0', 10);
        const current = parseInt(target.dataset.current || '34', 10);
        const nextSize = Math.max(20, Math.min(68, current + delta));
        if (!isNaN(stId)) {
          setStationPointSize(stId, nextSize);
          setTimeout(() => {
            const marker = markersMapRef.current.get(stId);
            if (marker && marker.isPopupOpen()) {
              marker.openPopup();
            }
          }, 30);
        }
      } else if (target.dataset && target.dataset.action === 'reset-station-size') {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.dataset.stationId || '', 10);
        if (!isNaN(stId)) {
          resetStationPointSize(stId);
          setTimeout(() => {
            const marker = markersMapRef.current.get(stId);
            if (marker && marker.isPopupOpen()) {
              marker.openPopup();
            }
          }, 30);
        }
      } else if (target.id && target.id.startsWith('btn-open-ads-')) {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.id.replace('btn-open-ads-', ''), 10);
        if (!isNaN(stId)) {
          const st = allStations.find((s) => s.id === stId);
          onOpenStationDetail?.(stId, st?.isHeadquarters ? 'info' : 'ads');
        }
      } else if (target.id && target.id.startsWith('btn-open-lcd-')) {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.id.replace('btn-open-lcd-', ''), 10);
        if (!isNaN(stId)) {
          onOpenStationDetail?.(stId, 'lcd');
        }
      } else if (target.id && target.id.startsWith('btn-zoom-detail-')) {
        e.preventDefault();
        e.stopPropagation();
        const stId = parseInt(target.id.replace('btn-zoom-detail-', ''), 10);
        const st = allStations.find((s) => s.id === stId);
        if (st && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([st.lat, st.lng], 15, { duration: 0.8 });
        }
      }
    };

    document.addEventListener('click', handleMapPopupClick, true);
    return () => {
      document.removeEventListener('click', handleMapPopupClick, true);
    };
  }, [allStations, onOpenStationDetail]);

  // Handle selected station flyTo
  useEffect(() => {
    if (!selectedStationId || !mapInstanceRef.current) return;
    const station = allStations.find((s) => s.id === selectedStationId);
    if (!station) return;

    mapInstanceRef.current.flyTo([station.lat, station.lng], 13, {
      duration: 0.9,
      animate: true,
    });

    const timer = setTimeout(() => {
      const marker = markersMapRef.current.get(selectedStationId);
      if (marker) {
        marker.openPopup();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedStationId, selectedStationTrigger, allStations]);

  // Reset view to all Slovakia
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    if (borderLineLayerRef.current) {
      try {
        const bounds = borderLineLayerRef.current.getBounds();
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [30, 30],
          maxZoom: 9,
          duration: 0.8,
        });
        return;
      } catch {}
    }
    mapInstanceRef.current.setView([48.669, 19.699], 8);
  };

  return (
    <div id="map-wrapper" className="flex-1 relative h-full w-full bg-slate-100 dark:bg-[#0b0e14]">
      {/* Leaflet Map Div */}
      <div id="slovakia-map-container" ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Control overlay (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* Quick Segmented Switch for Basemap (Svetlá - šedá, Tmavá - čierna, Obyčajná) */}
          <div className="bg-white/95 dark:bg-[#121620]/95 border border-slate-200 dark:border-gray-700/80 rounded-xl p-1 shadow-xl backdrop-blur-md flex items-center gap-1 text-xs">
            <button
              id="quick-map-theme-light"
              onClick={() => setTileTheme('light')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                tileTheme === 'light'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Svetlá - šedá (Positron) – moderná svetlo-sivá mapa s prehľadnou cestnou infraštruktúrou"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 inline-block shrink-0"></span>
              <span>Svetlá - šedá</span>
            </button>
            <button
              id="quick-map-theme-dark"
              onClick={() => setTileTheme('dark')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                tileTheme === 'dark'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tmavá - čierna (Dark Matter) – vysokokontrastná čierna nočná mapa"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600 inline-block shrink-0"></span>
              <span>Tmavá - čierna</span>
            </button>
            <button
              id="quick-map-theme-standard"
              onClick={() => setTileTheme('standard')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                tileTheme === 'standard'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Obyčajná – klasická OpenStreetMap so všetkými obcami a cestami SR"
            >
              <span>🗺️</span>
              <span>Obyčajná</span>
            </button>
          </div>

          {/* Quick Toggle Button for Hiding Surrounding Countries */}
          <button
            id="quick-toggle-mask-countries"
            onClick={onToggleIsolation}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border shadow-xl backdrop-blur-md flex items-center space-x-1.5 transition cursor-pointer ${
              isolateSlovakia
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-red-900/30 ring-1 ring-red-400/40'
                : 'bg-white/95 dark:bg-[#121620]/95 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-200 border-slate-200 dark:border-gray-700'
            }`}
            title={
              isolateSlovakia
                ? 'Okolité krajiny sú skryté – kliknutím ich zobrazíte'
                : 'Kliknutím skryjete okolité krajiny a ponecháte len územie SR'
            }
          >
            {isolateSlovakia ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-white" />
                <span>Okolité krajiny: Skryté</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
                <span>Okolité krajiny: Zobrazené</span>
              </>
            )}
          </button>

          {/* Quick Toggle Button for Free Spaces Green Circle Badge */}
          {onToggleShowAdBadge && (
            <button
              id="quick-toggle-ad-badge"
              onClick={onToggleShowAdBadge}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border shadow-xl backdrop-blur-md flex items-center space-x-1.5 transition cursor-pointer ${
                showAdBadge
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-900/30'
                  : 'bg-white/95 dark:bg-[#121620]/95 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-200 border-slate-200 dark:border-gray-700'
              }`}
              title={
                showAdBadge
                  ? 'Zelený krúžok voľných plôch na pointe je aktívny – kliknutím ho skryjete'
                  : 'Zelený krúžok voľných plôch na pointe je skrytý – kliknutím ho zapnete'
              }
            >
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  showAdBadge ? 'bg-white shadow-xs' : 'bg-slate-300 dark:bg-gray-600 border border-slate-400'
                }`}
              />
              <span className="hidden lg:inline">
                {showAdBadge ? 'Zelený krúžok: Zapnutý' : 'Zelený krúžok: Skrytý'}
              </span>
              <span className="lg:hidden">
                {showAdBadge ? 'Krúžok: Zap' : 'Krúžok: Vyp'}
              </span>
            </button>
          )}

          {/* 3D Mapovanie prevádzok Button */}
          <button
            id="btn-quick-3d-mapping"
            onClick={onOpenThreeDMapping || (() => window.open('http://10.7.0.230/pumpy/', '_blank', 'noopener,noreferrer'))}
            className="px-3 py-2 bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-700 hover:from-purple-600 hover:to-sky-600 text-white rounded-xl shadow-xl backdrop-blur-md text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
            title="3D priestorové mapovanie prevádzok siete DALIOIL (http://10.7.0.230/pumpy/)"
          >
            <Box className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">3D Mapovanie</span>
            <span className="text-[10px] bg-black/25 px-1 py-0.2 rounded font-mono">3D</span>
          </button>

          {/* Farby pointov Button */}
          {onOpenColorCustomizer && (
            <button
              id="btn-quick-color-customizer"
              onClick={onOpenColorCustomizer}
              className="px-3 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl shadow-xl backdrop-blur-md text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              title="Farebné označenie pointov siete DALIOIL"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Farby pointov</span>
            </button>
          )}

          {/* Reset View Button */}
          <button
            id="btn-reset-view"
            onClick={handleResetView}
            className="px-3 py-2 bg-white/95 dark:bg-[#121620]/95 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-800 dark:text-gray-200 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            title="Vystrediť na celú Slovenskú republiku"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Celé Slovensko</span>
          </button>

          {/* Vytlačiť mapu Button */}
          {onOpenPrintView && (
            <button
              id="btn-quick-print-map"
              onClick={onOpenPrintView}
              className="px-3 py-2 bg-white/95 dark:bg-[#121620]/95 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-800 dark:text-gray-200 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              title="Vytlačiť mapu siete DALIOIL (A4 tlačový hárok / PDF)"
            >
              <Printer className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span className="hidden sm:inline">Vytlačiť mapu</span>
            </button>
          )}

          {/* Map settings toggle button */}
          <button
            id="btn-toggle-map-settings"
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className="px-3 py-2 bg-white/95 dark:bg-[#121620]/95 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-800 dark:text-gray-200 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            title="Nastavenia vzhľadu mapy"
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Vzhľad</span>
          </button>
        </div>

        {/* Settings Dropdown */}
        {showSettingsDropdown && (
          <div
            id="map-settings-panel"
            className="w-80 bg-white/98 dark:bg-[#121620]/95 border border-slate-200 dark:border-gray-700 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs space-y-3.5 animate-in fade-in duration-150 text-slate-800 dark:text-gray-200"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-gray-700">
              <span className="font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider text-[11px]">
                Nastavenie zobrazenia mapy
              </span>
              <button
                onClick={() => setShowSettingsDropdown(false)}
                className="text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle isolation / hide surrounding countries */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-gray-100 block text-xs">
                    Skryť okolité krajiny
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400">
                    Prekryť zahraničie maskou (iba územie SR)
                  </span>
                </div>
                <button
                  id="btn-settings-toggle-mask"
                  onClick={onToggleIsolation}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isolateSlovakia ? 'bg-red-600' : 'bg-slate-300 dark:bg-gray-700'
                  }`}
                  aria-label="Prepnúť skrytie okolitých krajín"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isolateSlovakia ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Mask opacity choice if isolateSlovakia is enabled */}
              {isolateSlovakia && (
                <div className="pt-2 border-t border-slate-200 dark:border-gray-700/60 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-gray-300">
                    Intenzita prekrytia:
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setMaskIntensity('solid')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                        maskIntensity === 'solid'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-300'
                      }`}
                    >
                      Úplné (100%)
                    </button>
                    <button
                      onClick={() => setMaskIntensity('veil')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                        maskIntensity === 'veil'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-300'
                      }`}
                    >
                      Závoj (72%)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle green circle for free ad spaces */}
            {onToggleShowAdBadge && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/70 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-gray-100 block text-xs flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 inline-block"></span>
                    <span>Zelený krúžok voľných plôch</span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400">
                    Zobraziť odznak počtu voľných plôch na jednotlivých pointoch
                  </span>
                </div>
                <button
                  id="btn-settings-toggle-ad-badge"
                  onClick={onToggleShowAdBadge}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-2 ${
                    showAdBadge ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-gray-700'
                  }`}
                  aria-label="Prepnúť zelený krúžok voľných plôch"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      showAdBadge ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Border color chooser */}
            <div className="space-y-1.5 pt-1">
              <span className="font-semibold text-slate-600 dark:text-gray-300 text-[11px] block">
                Farba štátnej hranice SR:
              </span>
              <div className="flex gap-2">
                {[
                  { color: '#E11D23', label: 'Červená' },
                  { color: '#f59e0b', label: 'Jantár' },
                  { color: '#3b82f6', label: 'Modrá' },
                  { color: '#10b981', label: 'Zelená' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setBorderColor(c.color)}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
                      borderColor === c.color
                        ? 'border-slate-800 dark:border-white text-slate-900 dark:text-white shadow'
                        : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    style={{
                      backgroundColor: borderColor === c.color ? `${c.color}30` : undefined,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Basemap selection (Svetlá - šedá, Tmavá - čierna, Obyčajná) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-gray-300 text-[11px] block">Podkladová mapa:</span>
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                  {basemapConfigs[tileTheme].name}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  onClick={() => setTileTheme('light')}
                  className={`py-2 px-1 rounded-lg border font-bold cursor-pointer transition text-center flex flex-col items-center gap-0.5 ${
                    tileTheme === 'light'
                      ? 'border-red-500 text-red-600 dark:text-white bg-red-50 dark:bg-red-950/60 shadow-sm'
                      : 'border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Svetlá - šedá (Positron) – moderná svetlo-sivá mapa s cestnou infraštruktúrou"
                >
                  <span className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400 my-0.5"></span>
                  <span className="leading-tight">Svetlá - šedá</span>
                  <span className="text-[9px] font-normal opacity-80">Sivý podklad</span>
                </button>
                <button
                  onClick={() => setTileTheme('dark')}
                  className={`py-2 px-1 rounded-lg border font-bold cursor-pointer transition text-center flex flex-col items-center gap-0.5 ${
                    tileTheme === 'dark'
                      ? 'border-red-500 text-red-600 dark:text-white bg-red-50 dark:bg-red-950/60 shadow-sm'
                      : 'border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Tmavá - čierna (Dark Matter) – vysokokontrastná nočná mapa"
                >
                  <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-600 my-0.5"></span>
                  <span className="leading-tight">Tmavá - čierna</span>
                  <span className="text-[9px] font-normal opacity-80">Nočná čierna</span>
                </button>
                <button
                  onClick={() => setTileTheme('standard')}
                  className={`py-2 px-1 rounded-lg border font-bold cursor-pointer transition text-center flex flex-col items-center gap-0.5 ${
                    tileTheme === 'standard'
                      ? 'border-red-500 text-red-600 dark:text-white bg-red-50 dark:bg-red-950/60 shadow-sm'
                      : 'border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Obyčajná (OpenStreetMap) – klasická plnofarebná kartografická mapa"
                >
                  <span className="text-xs my-0.5">🗺️</span>
                  <span className="leading-tight">Obyčajná</span>
                  <span className="text-[9px] font-normal opacity-80">Klasická OSM</span>
                </button>
              </div>
            </div>

            {/* Quick point configurator launcher */}
            {onOpenColorCustomizer && (
              <div className="pt-2 border-t border-slate-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowSettingsDropdown(false);
                    onOpenColorCustomizer();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold text-xs flex items-center justify-between text-slate-800 dark:text-gray-100 transition cursor-pointer border border-slate-200 dark:border-gray-700 shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-red-500" />
                    <span>Farby pointov & Štýl</span>
                  </span>
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold font-mono">
                    {activeMarkerSize}px &rarr;
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Status / Filter banner (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2">
        <div className="bg-white/95 dark:bg-[#121620]/95 border border-slate-200 dark:border-gray-700/80 px-4 py-2 rounded-2xl shadow-xl dark:shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs text-slate-800 dark:text-gray-200">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-semibold text-slate-700 dark:text-gray-200">
              {stations.length === allStations.length ? (
                <>
                  Zobrazených <strong className="text-slate-900 dark:text-white font-black">{allStations.length} prevádzok</strong> (48 CS + 6 terminálov)
                </>
              ) : (
                <>
                  Zobrazených <strong className="text-slate-900 dark:text-white font-black">{stations.length}</strong> z{' '}
                  {allStations.length} prevádzok
                </>
              )}
            </span>
          </div>

          {stations.length < allStations.length && onResetAllFilters && (
            <button
              onClick={onResetAllFilters}
              className="text-[11px] text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-bold underline pl-2 border-l border-slate-200 dark:border-gray-700 cursor-pointer"
            >
              Zrušiť filtre
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
