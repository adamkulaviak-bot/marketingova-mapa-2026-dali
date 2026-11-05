import React, { useState, useMemo } from 'react';
import {
  X,
  Palette,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  MapPin,
  Tag,
  Search,
  Filter,
  Trash2,
  Bookmark,
  Eye,
  Info,
} from 'lucide-react';
import { Station, RegionId, RegionInfo, MarkerColorMode, MarkerLabelMode } from '../types';
import {
  TAG_COLORS,
  StationColorTag,
  getStoredColorTags,
  setStationColorTag,
  setStationPointSize,
  resetStationPointSize,
  removeStationColorTag,
  clearAllStationColorTags,
  bulkSetStationColorTags,
  bulkSetStationPointSize,
} from '../utils/stationColorTags';
import { buildMarkerHtml } from '../utils/markerUtils';

interface PointColorCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  allStations: Station[];
  regions: Record<RegionId, RegionInfo>;
  activeSize: number;
  activeColorMode: MarkerColorMode;
  activeLabelMode: MarkerLabelMode;
  activeCustomColor: string;
  showAdBadge?: boolean;
  onApply: (
    size: number,
    colorMode: MarkerColorMode,
    labelMode: MarkerLabelMode,
    customColor: string,
    showAdBadge?: boolean
  ) => void;
}

export const PointColorCustomizerModal: React.FC<PointColorCustomizerModalProps> = ({
  isOpen,
  onClose,
  stations,
  allStations,
  regions,
  activeSize,
  activeColorMode,
  activeLabelMode,
  activeCustomColor,
  showAdBadge = true,
  onApply,
}) => {
  const [activeTab, setActiveTab] = useState<'mode' | 'stations'>('mode');
  const [selectedSize, setSelectedSize] = useState<number>(activeSize);
  const [selectedColorMode, setSelectedColorMode] = useState<MarkerColorMode>(activeColorMode);
  const [selectedLabelMode, setSelectedLabelMode] = useState<MarkerLabelMode>(activeLabelMode);
  const [selectedCustomColor, setSelectedCustomColor] = useState<string>(activeCustomColor);
  const [selectedShowAdBadge, setSelectedShowAdBadge] = useState<boolean>(showAdBadge);

  // Station tagging list state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTagColor, setFilterTagColor] = useState<'all' | string>('all');
  const [bulkColor, setBulkColor] = useState<string>('#10B981');
  const [bulkSize, setBulkSize] = useState<number>(34);
  const [bulkLabel, setBulkLabel] = useState<string>('');
  const [colorTags, setColorTags] = useState<Record<number, StationColorTag>>(() => getStoredColorTags());

  // Keep colorTags synced when opening
  React.useEffect(() => {
    if (isOpen) {
      setColorTags(getStoredColorTags());
      setSelectedSize(activeSize);
      setSelectedColorMode(activeColorMode);
      setSelectedLabelMode(activeLabelMode);
      setSelectedCustomColor(activeCustomColor);
      setSelectedShowAdBadge(showAdBadge);
    }
  }, [isOpen, activeSize, activeColorMode, activeLabelMode, activeCustomColor, showAdBadge]);

  // Handle setting a color tag for a station
  const handleSetTag = (stationId: number, color: string, label?: string, size?: number) => {
    setStationColorTag(stationId, color, label, size);
    setColorTags(getStoredColorTags());
  };

  const handleSetSize = (stationId: number, size: number) => {
    const clamped = Math.max(20, Math.min(68, size));
    setStationPointSize(stationId, clamped);
    setColorTags(getStoredColorTags());
  };

  const handleResetSize = (stationId: number) => {
    resetStationPointSize(stationId);
    setColorTags(getStoredColorTags());
  };

  const handleRemoveTag = (stationId: number) => {
    removeStationColorTag(stationId);
    setColorTags(getStoredColorTags());
  };

  const handleClearAllTags = () => {
    if (window.confirm('Naozaj chcete vymazať všetky vlastné farebné označenia a veľkosti staníc?')) {
      clearAllStationColorTags();
      setColorTags({});
    }
  };

  const handleBulkTagCurrentStations = () => {
    const ids = stations.map((s) => s.id);
    if (ids.length === 0) return;
    bulkSetStationColorTags(ids, bulkColor, bulkLabel, bulkSize);
    setColorTags(getStoredColorTags());
    // Auto-switch to custom-tags mode if not active so user sees them immediately
    if (selectedColorMode !== 'custom-tags') {
      setSelectedColorMode('custom-tags');
    }
  };

  const handleBulkApplySizeOnly = () => {
    const ids = stations.map((s) => s.id);
    if (ids.length === 0) return;
    bulkSetStationPointSize(ids, bulkSize);
    setColorTags(getStoredColorTags());
  };

  // Tagged count
  const taggedCount = useMemo(() => Object.keys(colorTags).length, [colorTags]);

  // Filtered station list for Tab 2
  const filteredStationList = useMemo(() => {
    return allStations.filter((st) => {
      if (filterTagColor !== 'all') {
        const tag = colorTags[st.id];
        if (!tag || tag.color !== filterTagColor) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = st.name.toLowerCase().includes(q);
        const matchCode = (st.stationCode || '').toLowerCase().includes(q);
        const matchCity = (st.city || '').toLowerCase().includes(q);
        const tag = colorTags[st.id];
        const matchLabel = tag?.label ? tag.label.toLowerCase().includes(q) : false;
        return matchName || matchCode || matchCity || matchLabel;
      }
      return true;
    });
  }, [allStations, filterTagColor, searchQuery, colorTags]);

  if (!isOpen) return null;

  // Sample station for live preview
  const previewStation = allStations[0] || {
    id: 1,
    stationCode: 'DALIOIL_001',
    name: 'Bratislava-Vajnory',
    city: 'Bratislava',
    region: 'zapad' as RegionId,
    lat: 48.2,
    lng: 17.2,
    number: '1',
    isTerminal: false,
    isNew: false,
    note: '',
  };

  const previewHtml = buildMarkerHtml(previewStation, regions[previewStation.region], {
    size: selectedSize,
    colorMode: selectedColorMode,
    customColor: selectedCustomColor,
    labelMode: selectedLabelMode,
    showAdBadge: selectedShowAdBadge,
    isSelected: false,
    stationColorTags: colorTags,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#111622] rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 flex flex-col overflow-hidden text-slate-800 dark:text-gray-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="marker-customizer-title"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-slate-50 dark:bg-[#151b27]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[10px] flex items-center justify-center">
                <Palette className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <h2 id="marker-customizer-title" className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Farebné označenie a štýl pointov
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Prispôsobte farby, veľkosti a priraďte vlastné farebné značky jednotlivým staniciam
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-gray-800 transition cursor-pointer"
            title="Zavrieť"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Nav */}
        <div className="flex items-center border-b border-slate-200 dark:border-gray-800 bg-slate-100/60 dark:bg-[#0d1117] px-5">
          <button
            onClick={() => setActiveTab('mode')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'mode'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-[#111622]'
                : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-red-500" />
            <span>Režimy zobrazenia & Veľkosť</span>
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'stations'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-[#111622]'
                : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-500" />
            <span>Správa vlastných farebných značiek</span>
            {taggedCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-mono font-black rounded-full bg-red-600 text-white">
                {taggedCount}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'mode' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Color Mode & Size selection */}
              <div className="md:col-span-8 space-y-5">
                {/* 1. Color Mode Selection */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                    1. Režim priradenia farieb na mape:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* Mode: Custom Tags */}
                    <button
                      type="button"
                      onClick={() => setSelectedColorMode('custom-tags')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer relative ${
                        selectedColorMode === 'custom-tags'
                          ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-white ring-2 ring-red-500/40'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#151b27] hover:border-slate-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xl">🏷️</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>Vlastné značky (Moje tagy)</span>
                          {taggedCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono">
                              {taggedCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                          Zobrazuje individuálne farby, ktoré ste priradili jednotlivým prevádzkam.
                        </p>
                      </div>
                    </button>

                    {/* Mode: Region */}
                    <button
                      type="button"
                      onClick={() => setSelectedColorMode('region')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer relative ${
                        selectedColorMode === 'region'
                          ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-white ring-2 ring-red-500/40'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#151b27] hover:border-slate-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xl">🗺️</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          Podľa regiónu (Area manažéri)
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                          Západ (zelená), Sever (modrá), Stred (oranžová), Východ (fialová).
                        </p>
                      </div>
                    </button>

                    {/* Mode: Ad status */}
                    <button
                      type="button"
                      onClick={() => setSelectedColorMode('ad-status')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer relative ${
                        selectedColorMode === 'ad-status'
                          ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-white ring-2 ring-red-500/40'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#151b27] hover:border-slate-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xl">📊</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          Podľa stavu reklamných plôch
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                          Voľné plochy (zelená), Končiace zmluvy (žltá), Plne obsadené (červená).
                        </p>
                      </div>
                    </button>

                    {/* Mode: Station type */}
                    <button
                      type="button"
                      onClick={() => setSelectedColorMode('station-type')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer relative ${
                        selectedColorMode === 'station-type'
                          ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-white ring-2 ring-red-500/40'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#151b27] hover:border-slate-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xl">⛽</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          Podľa typu prevádzky
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                          Čerpacie stanice (červená), Terminály (modrá), Centrála (zlatá).
                        </p>
                      </div>
                    </button>

                    {/* Mode: Dalioil red */}
                    <button
                      type="button"
                      onClick={() => setSelectedColorMode('dalioil-red')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer relative ${
                        selectedColorMode === 'dalioil-red'
                          ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-white ring-2 ring-red-500/40'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#151b27] hover:border-slate-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xl">🔴</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          DALIOIL Červená (Corporate)
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                          Jednotný oficiálny červený branding siete pre všetky prevádzky.
                        </p>
                      </div>
                    </button>

                    {/* Mode: Uniform Custom */}
                    <button
                      type="button"
                      onClick={() => setSelectedColorMode('custom')}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer relative ${
                        selectedColorMode === 'custom'
                          ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-white ring-2 ring-red-500/40'
                          : 'border-slate-200 dark:border-gray-800 bg-white dark:bg-[#151b27] hover:border-slate-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xl">🎨</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          Vlastná jednotná farba
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 leading-snug">
                          Vyberte jednu spoločnú farbu pre všetky body siete.
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* If custom uniform color chosen */}
                  {selectedColorMode === 'custom' && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-2 animate-in fade-in">
                      <span className="text-xs font-bold text-slate-700 dark:text-gray-300 block">
                        Vyberte farbu:
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {TAG_COLORS.map((tc) => (
                          <button
                            key={tc.color}
                            type="button"
                            onClick={() => setSelectedCustomColor(tc.color)}
                            className={`w-7 h-7 rounded-full transition transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                              selectedCustomColor === tc.color
                                ? 'ring-3 ring-slate-900 dark:ring-white scale-110 shadow-md'
                                : 'opacity-85 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: tc.color }}
                            title={tc.name}
                          >
                            {selectedCustomColor === tc.color && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </button>
                        ))}
                        <input
                          type="color"
                          value={selectedCustomColor}
                          onChange={(e) => setSelectedCustomColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 dark:border-gray-700 bg-transparent"
                          title="Vlastný výber farby cez paletu"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Size Slider */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                      2. Veľkosť pointov na mape:
                    </label>
                    <span className="font-mono font-bold text-sm text-red-600 dark:text-red-400">
                      {selectedSize} px
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-semibold">24px</span>
                    <input
                      type="range"
                      min={24}
                      max={52}
                      step={2}
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <span className="text-xs text-slate-400 font-semibold">52px</span>
                  </div>
                </div>

                {/* 3. Marker Label Mode */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-gray-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                    3. Vzhľad vnútra a popisku pointu:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'logo' as MarkerLabelMode, label: 'Logo DALIOIL', icon: '🖼️' },
                      { id: 'code' as MarkerLabelMode, label: 'Kód stanice (001)', icon: '🔢' },
                      { id: 'number' as MarkerLabelMode, label: 'Poradové číslo (#1)', icon: '🏷️' },
                      { id: 'city' as MarkerLabelMode, label: 'Názov mesta pod bodom', icon: '📍' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedLabelMode(item.id)}
                        className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                          selectedLabelMode === item.id
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-white shadow-xs'
                            : 'border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/60 text-slate-600 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="text-[11px] leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Green Circle Free Space Indicator Toggle */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                        4. Zelený krúžok voľných plôch na pointe:
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        Zobrazuje alebo skryje kruhový indikátor voľných reklamných plôch v pravom hornom rohu pointu.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedShowAdBadge(true)}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer flex items-center gap-2.5 ${
                        selectedShowAdBadge
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/40'
                          : 'border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/60 text-slate-600 dark:text-gray-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shrink-0 shadow-xs flex items-center justify-center text-[7px] text-white font-black">
                        ●
                      </span>
                      <div>
                        <div className="text-xs font-bold">Zobraziť zelený krúžok</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-gray-400">
                          Zobrazuje počet voľných / končiacich plôch
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedShowAdBadge(false)}
                      className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer flex items-center gap-2.5 ${
                        !selectedShowAdBadge
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-white ring-2 ring-red-500/40'
                          : 'border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/60 text-slate-600 dark:text-gray-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-gray-600 shrink-0 border border-slate-400 flex items-center justify-center text-[9px] text-slate-500 dark:text-gray-400 font-bold">
                        ✕
                      </span>
                      <div>
                        <div className="text-xs font-bold">Skryť zelený krúžok</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-gray-400">
                          Čistý point bez kruhového odznaku plôch
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Marker Preview Box */}
              <div className="md:col-span-4 bg-slate-50 dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center">
                <div className="w-full">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-700/60 mb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-gray-300">
                      Živý náhľad pointu
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
                      Live Preview
                    </span>
                  </div>

                  <div className="h-44 flex items-center justify-center bg-white dark:bg-black/30 rounded-xl border border-dashed border-slate-200 dark:border-gray-700 p-4 relative overflow-hidden">
                    <div
                      className="transform transition-transform duration-200 hover:scale-115"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>

                  <div className="mt-3 text-xs text-left space-y-1 bg-white dark:bg-[#10141d] p-3 rounded-xl border border-slate-200 dark:border-gray-800">
                    <div className="font-bold text-slate-800 dark:text-gray-200 text-xs truncate">
                      {previewStation.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400">
                      Režim: <strong className="text-slate-700 dark:text-gray-300">{selectedColorMode}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400">
                      Rozmer: <strong className="text-slate-700 dark:text-gray-300">{selectedSize}px</strong> × {Math.round(selectedSize * 1.25)}px
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-gray-400">
                      Krúžok plôch:{' '}
                      <strong className={selectedShowAdBadge ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                        {selectedShowAdBadge ? 'Zobrazený' : 'Skrytý'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="w-full pt-3">
                  <button
                    onClick={() => {
                      onApply(selectedSize, selectedColorMode, selectedLabelMode, selectedCustomColor, selectedShowAdBadge);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-950/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aplikovať na celú mapu</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: Station Tagging & Bulk Management */
            <div className="space-y-4">
              {/* Bulk Tagging Action Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Hromadná úprava farby a veľkosti pointov</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Nastavte farbu a rozmer v pixeloch pre všetkých {stations.length} filtrovaných staníc naraz, alebo ich meňte jednotlivo v tabuľke nižšie.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {taggedCount > 0 && (
                      <button
                        onClick={handleClearAllTags}
                        className="px-2.5 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition border border-red-200 dark:border-red-900/50 flex items-center gap-1 cursor-pointer"
                        title="Vymazať všetky vlastné farebné označenia a veľkosti"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Vymazať všetky úpravy ({taggedCount})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bulk controls row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                  {/* Bulk Color picker */}
                  <div className="md:col-span-5 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300 shrink-0">Farba pointu:</span>
                    <div className="flex items-center gap-1.5">
                      {TAG_COLORS.map((tc) => (
                        <button
                          key={tc.color}
                          type="button"
                          onClick={() => setBulkColor(tc.color)}
                          className={`w-6 h-6 rounded-full transition transform hover:scale-115 flex items-center justify-center cursor-pointer ${
                            bulkColor === tc.color ? 'ring-2 ring-slate-900 dark:ring-white scale-110 shadow-sm' : ''
                          }`}
                          style={{ backgroundColor: tc.color }}
                          title={tc.name}
                        >
                          {bulkColor === tc.color && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bulk Size picker */}
                  <div className="md:col-span-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300 shrink-0">Veľkosť:</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-lg p-0.5">
                      {[28, 34, 44, 52].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setBulkSize(s)}
                          className={`px-2 py-0.5 text-xs font-mono font-bold rounded cursor-pointer transition ${
                            bulkSize === s
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {s}px
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={20}
                      max={68}
                      step={2}
                      value={bulkSize}
                      onChange={(e) => setBulkSize(Math.max(20, Math.min(68, parseInt(e.target.value, 10) || 34)))}
                      className="w-14 px-1.5 py-0.5 text-xs font-mono font-bold text-center bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-lg"
                      title="Priama veľkosť v pixeloch"
                    />
                  </div>

                  {/* Bulk Label input */}
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      value={bulkLabel}
                      onChange={(e) => setBulkLabel(e.target.value)}
                      placeholder="Voliteľný text..."
                      className="w-full bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-gray-100 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Bulk Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/80 dark:border-gray-800/80">
                  <button
                    onClick={handleBulkTagCurrentStations}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Nastaviť farbu aj veľkosť ({bulkSize}px) pre {stations.length} staníc</span>
                  </button>

                  <button
                    onClick={handleBulkApplySizeOnly}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <span>Len nastaviť veľkosť {bulkSize}px ({stations.length} staníc)</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrovať zoznam staníc podľa názvu, kódu, mesta alebo tagu..."
                    className="w-full bg-slate-50 dark:bg-[#151b27] border border-slate-200 dark:border-gray-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400"
                  />
                </div>

                {/* Filter by Tag Color chips */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setFilterTagColor('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                      filterTagColor === 'all'
                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200'
                    }`}
                  >
                    Všetky ({allStations.length})
                  </button>
                  {TAG_COLORS.map((tc) => {
                    const count = Object.values(colorTags).filter((t) => t.color === tc.color).length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={tc.color}
                        onClick={() => setFilterTagColor(filterTagColor === tc.color ? 'all' : tc.color)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0 ${
                          filterTagColor === tc.color
                            ? 'ring-2 ring-slate-900 dark:ring-white shadow-xs text-white'
                            : 'opacity-85 hover:opacity-100 text-white'
                        }`}
                        style={{ backgroundColor: tc.color }}
                        title={`${tc.name}: ${count} staníc`}
                      >
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Station List Table with Individual Color and Size in px */}
              <div className="border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#111622] max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#151b27] border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Stanica / Kód</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Farba celého pointu</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Veľkosť v px</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Vlastný štítok</th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">Akcia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80">
                    {filteredStationList.map((st) => {
                      const tag = colorTags[st.id];
                      const currentSize = tag?.size || activeSize;
                      const hasCustomSize = typeof tag?.size === 'number';

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/70 dark:hover:bg-gray-800/40 transition">
                          {/* Station Name & Info */}
                          <td className="py-2 px-3">
                            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {tag?.color && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                                  style={{ backgroundColor: tag.color }}
                                />
                              )}
                              <span>{st.name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-400">
                                {st.stationCode || `#${st.id}`}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                {st.city || st.street || 'SR'}
                              </span>
                            </div>
                          </td>

                          {/* Quick color palette buttons (Entire pin color) */}
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              {TAG_COLORS.map((tc) => {
                                const isCurrent = tag?.color === tc.color;
                                return (
                                  <button
                                    key={tc.color}
                                    type="button"
                                    onClick={() => handleSetTag(st.id, tc.color, tag?.label, tag?.size)}
                                    className={`w-5 h-5 rounded-full transition transform hover:scale-120 flex items-center justify-center cursor-pointer ${
                                      isCurrent ? 'ring-2 ring-slate-900 dark:ring-white scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'
                                    }`}
                                    style={{ backgroundColor: tc.color }}
                                    title={tc.name}
                                  >
                                    {isCurrent && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          {/* Individual Size Control in px */}
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSetSize(st.id, currentSize - 4)}
                                className="w-6 h-6 rounded bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 font-bold flex items-center justify-center cursor-pointer transition text-xs"
                                title="Zmenšiť point o 4px"
                              >
                                -
                              </button>

                              <div className="relative flex items-center">
                                <input
                                  type="number"
                                  min={20}
                                  max={68}
                                  step={2}
                                  value={currentSize}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val)) handleSetSize(st.id, val);
                                  }}
                                  className={`w-14 px-1 py-0.5 text-xs font-mono font-bold text-center border rounded-lg ${
                                    hasCustomSize
                                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/40'
                                      : 'bg-slate-50 dark:bg-[#0d1117] border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300'
                                  }`}
                                />
                                <span className="absolute right-1.5 text-[9px] font-mono text-slate-400 pointer-events-none">
                                  px
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSetSize(st.id, currentSize + 4)}
                                className="w-6 h-6 rounded bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 font-bold flex items-center justify-center cursor-pointer transition text-xs"
                                title="Zväčšiť point o 4px"
                              >
                                +
                              </button>

                              {/* Reset individual size to default */}
                              {hasCustomSize && (
                                <button
                                  type="button"
                                  onClick={() => handleResetSize(st.id)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 transition cursor-pointer"
                                  title="Resetovať veľkosť na predvolenú mapovú"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Editable tag label */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={tag?.label || ''}
                              onChange={(e) => {
                                handleSetTag(st.id, tag?.color || '#E11D23', e.target.value, tag?.size);
                              }}
                              placeholder={tag ? 'Napr. Priorita...' : 'Priradiť text...'}
                              className="w-full max-w-[150px] bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-lg px-2 py-0.5 text-[11px] text-slate-800 dark:text-gray-200 placeholder-slate-400"
                            />
                          </td>

                          {/* Delete or status */}
                          <td className="py-2 px-3 text-right">
                            {tag ? (
                              <button
                                onClick={() => handleRemoveTag(st.id)}
                                className="p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                                title="Zrušiť farebné označenie a veľkosť"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Štandard</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#151b27] flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-500" />
            <span>
              Označených prevádzok: <strong className="text-slate-800 dark:text-white font-mono">{taggedCount}</strong> z {allStations.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-slate-200/60 dark:hover:bg-gray-800 font-bold transition cursor-pointer"
            >
              Zavrieť
            </button>
            <button
              onClick={() => {
                onApply(selectedSize, selectedColorMode, selectedLabelMode, selectedCustomColor, selectedShowAdBadge);
                onClose();
              }}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Uložiť a použiť na mape</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
