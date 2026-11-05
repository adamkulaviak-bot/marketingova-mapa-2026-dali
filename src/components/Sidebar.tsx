import React, { useState } from 'react';
import {
  Search,
  X,
  Fuel,
  Factory,
  Globe2,
  Phone,
  Mail,
  Navigation,
  ChevronRight,
  Sparkles,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Wrench,
  User,
  ClipboardCheck,
  ExternalLink,
  FileSpreadsheet,
  Camera,
  MapPin,
  Eye,
  Table,
  Palette,
  Tv,
  Tag,
  Car,
  Printer,
  Building2,
} from 'lucide-react';
import { RegionId, RegionInfo, Station, StationTypeFilter, AdStatusFilter, RoadTypeFilter, StationDetailTab } from '../types';
import { getStationAdSummary, AD_SPACES } from '../data/adSpaces';
import { getStationIncidents } from '../data/incidentsData';
import { getStationCarrierAudit } from '../data/adCarrierAuditData';
import { hasStationLcdScreens } from '../data/lcdScreensData';
import { getStoredColorTags, COLOR_TAGS_EVENT, StationColorTag } from '../utils/stationColorTags';

interface SidebarProps {
  stations: Station[];
  allStations: Station[];
  selectedRegion: 'all' | RegionId;
  onSelectRegion: (region: 'all' | RegionId) => void;
  selectedType: StationTypeFilter;
  onSelectType: (type: StationTypeFilter) => void;
  selectedAdFilter: AdStatusFilter;
  onSelectAdFilter: (filter: AdStatusFilter) => void;
  selectedRoadType?: RoadTypeFilter;
  onSelectRoadType?: (roadType: RoadTypeFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStationId: number | null;
  onSelectStation: (stationId: number) => void;
  onOpenStationDetail: (stationId: number, tab?: StationDetailTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  regions: Record<RegionId, RegionInfo>;
  onOpenExternalSolutions?: (category?: 'all' | 'checklists' | 'reclamations' | 'elearning') => void;
  onOpenExport?: () => void;
  onOpenCarrierAudit?: () => void;
  onOpenLcdScreens?: (stationId?: number) => void;
  onOpenMarketPricing?: () => void;
  onOpenBranchExport?: () => void;
  onOpenColorCustomizer?: () => void;
  onOpenPrintView?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stations,
  allStations,
  selectedRegion,
  onSelectRegion,
  selectedType,
  onSelectType,
  selectedAdFilter,
  onSelectAdFilter,
  selectedRoadType = 'all',
  onSelectRoadType,
  searchQuery,
  onSearchChange,
  selectedStationId,
  onSelectStation,
  onOpenStationDetail,
  isOpenMobile,
  onCloseMobile,
  regions,
  onOpenExternalSolutions,
  onOpenExport,
  onOpenCarrierAudit,
  onOpenLcdScreens,
  onOpenMarketPricing,
  onOpenBranchExport,
  onOpenColorCustomizer,
  onOpenPrintView,
}) => {
  const [showRegionsAccordion, setShowRegionsAccordion] = useState<boolean>(true);
  const [colorTags, setColorTags] = useState<Record<number, StationColorTag>>(() => getStoredColorTags());

  React.useEffect(() => {
    const handleTagsChange = () => {
      setColorTags(getStoredColorTags());
    };
    window.addEventListener(COLOR_TAGS_EVENT, handleTagsChange);
    return () => window.removeEventListener(COLOR_TAGS_EVENT, handleTagsChange);
  }, []);

  const regionList = Object.values(regions);

  const getRegionStationCount = (regId: RegionId) => {
    return allStations.filter((s) => s.region === regId).length;
  };

  const getRegionNewCount = (regId: RegionId) => {
    return allStations.filter((s) => s.region === regId && s.isNew).length;
  };

  const getRegionFreeAdsCount = (regId: RegionId) => {
    const regStationIds = allStations.filter((s) => s.region === regId).map((s) => s.id);
    return AD_SPACES.filter((ad) => regStationIds.includes(ad.stationId) && ad.status === 'free').length;
  };

  return (
    <aside
      id="sidebar-panel"
      className={`w-full sm:w-96 lg:w-[440px] bg-white dark:bg-[#121620] border-r border-slate-200 dark:border-gray-800 flex flex-col shrink-0 absolute lg:static inset-y-0 left-0 z-20 transition-all duration-300 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } shadow-2xl lg:shadow-none`}
    >
      {/* Search & Main filter controls */}
      <div className="p-3.5 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#151b27] space-y-3 shrink-0 transition-colors">
        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="station-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Hľadať obec, vedúceho, inzerenta, typ..."
            className="w-full bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700/80 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300"
              title="Zmazať hľadanie"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter type buttons (Čerpačky vs Terminály) */}
        <div className="flex items-center bg-slate-200/60 dark:bg-[#0d1117] p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs">
          <button
            id="filter-all-btn"
            onClick={() => onSelectType('all')}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition text-xs ${
              selectedType === 'all'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Všetko ({allStations.length})
          </button>
          <button
            id="filter-stations-btn"
            onClick={() => onSelectType('stations')}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition text-xs flex items-center justify-center gap-1 ${
              selectedType === 'stations'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Fuel className="w-3 h-3 text-red-500 dark:text-red-400" /> Čerpačky ({allStations.filter(s => !s.isTerminal).length})
          </button>
          <button
            id="filter-terminals-btn"
            onClick={() => onSelectType('terminals')}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition text-xs flex items-center justify-center gap-1 ${
              selectedType === 'terminals'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Factory className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Terminály ({allStations.filter(s => s.isTerminal).length})
          </button>
        </div>

        {/* Filter by Advertising Status (OOH) */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span>Filter stavu reklamy</span>
            </span>
            {selectedAdFilter !== 'all' && (
              <button
                onClick={() => onSelectAdFilter('all')}
                className="text-[10px] text-red-600 dark:text-red-400 hover:underline normal-case font-semibold"
              >
                Zrušiť filter reklamy
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              id="filter-ad-all-btn"
              onClick={() => onSelectAdFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition text-left flex items-center justify-between border ${
                selectedAdFilter === 'all'
                  ? 'bg-slate-200 dark:bg-gray-800 text-slate-900 dark:text-white border-slate-300 dark:border-gray-600'
                  : 'bg-white dark:bg-[#0d1117] text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
              }`}
            >
              <span>Všetky stanice</span>
            </button>

            <button
              id="filter-ad-free-btn"
              onClick={() => onSelectAdFilter('free')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition text-left flex items-center justify-between border ${
                selectedAdFilter === 'free'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500 ring-1 ring-emerald-400/50 dark:ring-emerald-500/50'
                  : 'bg-white dark:bg-[#0d1117] text-emerald-700 dark:text-emerald-400/90 border-slate-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-800/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>S voľnou plochou</span>
              </span>
            </button>

            <button
              id="filter-ad-expiring-btn"
              onClick={() => onSelectAdFilter('expiring')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition text-left flex items-center justify-between border ${
                selectedAdFilter === 'expiring'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-500 ring-1 ring-amber-400/50 dark:ring-amber-500/50'
                  : 'bg-white dark:bg-[#0d1117] text-amber-700 dark:text-amber-400/90 border-slate-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-800/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                <span>Končí do 14 dní</span>
              </span>
            </button>

            <button
              id="filter-ad-occupied-btn"
              onClick={() => onSelectAdFilter('occupied')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition text-left flex items-center justify-between border ${
                selectedAdFilter === 'occupied'
                  ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-400 dark:border-red-500 ring-1 ring-red-400/50 dark:ring-red-500/50'
                  : 'bg-white dark:bg-[#0d1117] text-red-700 dark:text-red-400/90 border-slate-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-800/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Plne obsadené</span>
              </span>
            </button>
          </div>
        </div>

        {/* Filter by Road Type (D1/R1 vs Tranzit vs Mesto) */}
        {onSelectRoadType && (
          <div className="pt-2 border-t border-slate-200 dark:border-gray-800/80">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              <span>Typ dopravného ťahu</span>
              {selectedRoadType !== 'all' && (
                <button
                  onClick={() => onSelectRoadType('all')}
                  className="text-[10px] text-red-600 dark:text-red-400 hover:underline normal-case font-semibold"
                >
                  Všetky ťahy
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {(
                [
                  { id: 'all', label: 'Všetky' },
                  { id: 'Diaľnica D1/R1', label: 'Diaľnica D1/R1' },
                  { id: 'Tranzit 1. triedy', label: 'Tranzit 1. tr.' },
                  { id: 'Mestská lokalita', label: 'Mestské' },
                  { id: 'Vidiecka / Regionálna', label: 'Vidiecke' },
                ] as const
              ).map((rt) => (
                <button
                  key={rt.id}
                  onClick={() => onSelectRoadType(rt.id)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition border ${
                    selectedRoadType === rt.id
                      ? 'bg-red-100 text-red-800 border-red-400 dark:bg-red-950/80 dark:text-red-200 dark:border-red-500'
                      : 'bg-white dark:bg-[#0d1117] text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-800 hover:text-slate-900 dark:hover:text-gray-200'
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Regions Section Accordion */}
      <div className="border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-[#121620] shrink-0 transition-colors">
        <div
          onClick={() => setShowRegionsAccordion(!showRegionsAccordion)}
          className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800/40 transition select-none"
        >
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-red-500" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-gray-300">
              Regióny & Area manažéri SR ({regionList.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedRegion !== 'all' && (
              <span className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                Filtrované: {regions[selectedRegion].shortName}
              </span>
            )}
            {showRegionsAccordion ? (
              <ChevronUp className="w-4 h-4 text-slate-400 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 dark:text-gray-400" />
            )}
          </div>
        </div>

        {showRegionsAccordion && (
          <div className="px-3 pb-3 grid grid-cols-2 gap-2">
            {regionList.map((reg) => {
              const count = getRegionStationCount(reg.id);
              const newCount = getRegionNewCount(reg.id);
              const freeAds = getRegionFreeAdsCount(reg.id);
              const isRegSelected = selectedRegion === reg.id;

              return (
                <div
                  key={reg.id}
                  onClick={() => onSelectRegion(isRegSelected ? 'all' : reg.id)}
                  className={`p-2.5 rounded-xl cursor-pointer transition border ${
                    isRegSelected
                      ? 'bg-slate-100 dark:bg-gray-800/90 border-red-500 ring-1 ring-red-500/50 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#151b27]/80 dark:hover:bg-gray-800/60 border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: reg.color }}
                      ></span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{reg.shortName}</span>
                    </div>

                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-black/40 text-slate-700 dark:text-gray-300 font-mono font-bold">
                      {count} CS
                    </span>
                  </div>

                  <div className="mt-1.5 text-[10px] text-slate-500 dark:text-gray-400 flex items-center justify-between">
                    <span className="truncate font-medium text-slate-700 dark:text-gray-300" title={reg.rep.name}>
                      {reg.rep.name}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold shrink-0 ml-1">{count * 12} zón v Drive</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick External Solutions & E-learning strip */}
      {onOpenExternalSolutions && (
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-red-50 to-amber-50 dark:from-[#181d2a] dark:to-[#1a1724] border-b border-slate-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-gray-200">
                Checklisty & E-learning (10)
              </span>
            </div>
            <button
              onClick={() => onOpenExternalSolutions('all')}
              className="text-[10px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
            >
              <span>Všetky</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onOpenExternalSolutions('checklists')}
              className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800/90 hover:bg-slate-100 dark:hover:bg-gray-700/80 border border-slate-200 dark:border-gray-700 text-[10px] font-semibold text-slate-700 dark:text-gray-200 text-center truncate transition shadow-2xs"
              title="Starbucks audity a checklisty staníc"
            >
              📋 Checklisty
            </button>
            <button
              onClick={() => onOpenExternalSolutions('reclamations')}
              className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800/90 hover:bg-slate-100 dark:hover:bg-gray-700/80 border border-slate-200 dark:border-gray-700 text-[10px] font-semibold text-slate-700 dark:text-gray-200 text-center truncate transition shadow-2xs"
              title="Reklamácie z QR kódov a dispečing"
            >
              ⚡ Reklamácie
            </button>
            <button
              onClick={() => onOpenExternalSolutions('elearning')}
              className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800/90 hover:bg-slate-100 dark:hover:bg-gray-700/80 border border-slate-200 dark:border-gray-700 text-[10px] font-semibold text-slate-700 dark:text-gray-200 text-center truncate transition shadow-2xs"
              title="Google Drive a školiace materiály"
            >
              🎓 E-learning
            </button>
          </div>
        </div>
      )}

      {/* Stations list */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70 dark:bg-[#0d1117] transition-colors">
        <div className="px-3.5 py-2 bg-slate-100 dark:bg-[#121620] border-b border-slate-200 dark:border-gray-800 flex justify-between items-center text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-slate-600 dark:text-gray-400 text-[11px]">
              Zoznam lokalít ({stations.length})
            </span>
            {(onOpenBranchExport || onOpenExport) && (
              <button
                id="sidebar-export-excel-btn"
                onClick={onOpenBranchExport || onOpenExport}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                title="Export do Excelu"
              >
                <FileSpreadsheet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Export do Excelu</span>
              </button>
            )}
            {onOpenColorCustomizer && (
              <button
                id="sidebar-color-customizer-btn"
                onClick={onOpenColorCustomizer}
                className="px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/70 dark:hover:bg-red-900/80 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 font-bold text-[10px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                title="Farebné označenie pointov siete DALIOIL"
              >
                <Palette className="w-3 h-3 text-red-600 dark:text-red-400" />
                <span>Farby</span>
              </button>
            )}
            {onOpenMarketPricing && (
              <button
                id="sidebar-market-pricing-btn"
                onClick={onOpenMarketPricing}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                title="Trhové ceny a cenník reklamných nosičov siete DALIOIL"
              >
                <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Trhové ceny</span>
              </button>
            )}
            {onOpenPrintView && (
              <button
                id="sidebar-print-map-btn"
                onClick={onOpenPrintView}
                className="px-2 py-0.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 text-slate-800 dark:text-gray-200 font-bold text-[10px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                title="Vytlačiť mapu a zoznam prevádzok siete DALIOIL (A4 / PDF)"
              >
                <Printer className="w-3 h-3 text-red-600 dark:text-red-400" />
                <span>Tlač mapy</span>
              </button>
            )}
          </div>
          <span className="text-slate-500 dark:text-gray-500 text-[10px] hidden sm:inline">
            Kliknutím otvoríte mapu
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-gray-800/60 p-2 space-y-1">
          {stations.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-gray-500 text-xs">
              <Fuel className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Nenašli sa žiadne čerpacie stanice zodpovedajúce zvoleným filtrom.</p>
              <button
                onClick={() => {
                  onSelectAdFilter('all');
                  onSelectRegion('all');
                  onSelectType('all');
                }}
                className="mt-3 px-3 py-1.5 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg text-xs font-semibold"
              >
                Resetovať všetky filtre
              </button>
            </div>
          ) : (
            stations.map((station) => {
              const reg = regions[station.region];
              const isTerm = station.isTerminal;
              const isSelected = selectedStationId === station.id;
              const adSummary = getStationAdSummary(station.id);
              const activeStationIncidents = getStationIncidents(station.id).filter(
                (i) => i.status !== 'resolved'
              );
              const carrierAudit = getStationCarrierAudit(station.id) || getStationCarrierAudit(station.stationCode);

              return (
                <div
                  key={station.id}
                  id={`station-item-${station.id}`}
                  onClick={() => {
                    onSelectStation(station.id);
                    onOpenStationDetail(station.id, station.isHeadquarters ? 'info' : 'photos');
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition flex flex-col gap-2 group ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-gray-800/95 border border-red-500 shadow-md ring-1 ring-red-500/50'
                      : 'bg-white dark:bg-transparent hover:bg-slate-100 dark:hover:bg-gray-800/70 border border-slate-200/80 dark:border-transparent dark:hover:border-gray-700/60 shadow-xs dark:shadow-none'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow shrink-0 ${
                          isTerm
                            ? 'bg-slate-900 text-amber-400 border border-slate-700'
                            : 'text-white'
                        }`}
                        style={{ backgroundColor: !isTerm ? reg.color : undefined }}
                      >
                        {isTerm ? (
                          <span className="font-black text-sm">T</span>
                        ) : (
                          <Fuel className="w-4 h-4 text-white" />
                        )}
                      </div>

                      <div>
                        <div
                          className={`font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 ${
                            isSelected ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400'
                          }`}
                        >
                          <span className="font-mono text-[10px] text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-black/40 px-1.5 py-0.5 rounded border border-slate-200 dark:border-transparent">
                            {station.stationCode || `CS-${String(station.id).padStart(3, '0')}`}
                          </span>
                          <span>{station.name}</span>
                          {colorTags[station.id] && (
                            <span
                              className="text-[9px] font-black px-1.5 py-0.2 rounded-full text-white flex items-center gap-1 shadow-2xs shrink-0"
                              style={{ backgroundColor: colorTags[station.id].color }}
                              title={`Vlastná značka: ${colorTags[station.id].label || colorTags[station.id].color}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                              <span>{colorTags[station.id].label || 'Tag'}</span>
                            </span>
                          )}
                          {station.isHeadquarters && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 tracking-wider">
                              CENTRÁLA
                            </span>
                          )}
                          {activeStationIncidents.length > 0 && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-red-600 text-white flex items-center gap-0.5" title="Evidovaný servisný incident">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {activeStationIncidents.length}
                            </span>
                          )}
                        </div>

                        {/* Vedúci prevádzky (iba ak je zadaný a nie je to Centrála) */}
                        {!station.isHeadquarters && station.manager && (
                          <div className="text-[11px] text-slate-700 dark:text-gray-300 flex items-center gap-1 mt-0.5 font-medium">
                            <User className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="text-slate-400 dark:text-gray-500 text-[10px]">Vedúci:</span>
                            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                              {station.manager}
                            </span>
                          </div>
                        )}

                        {/* Zber dát nosičov & Stojany PHM badges */}
                        {carrierAudit && (
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
                              <Fuel className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                              <span>{carrierAudit.fuelDispensers} stojanov</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenStationDetail(station.id, 'audit');
                              }}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100/90 hover:bg-red-200 dark:bg-red-950/80 dark:hover:bg-red-900/90 text-red-700 dark:text-red-300 border border-red-300/60 dark:border-red-800/60 transition cursor-pointer"
                              title="Zobraziť terénny audit nosičov a 12 zón"
                            >
                              <Table className="w-2.5 h-2.5 text-red-500" />
                              <span>{carrierAudit.totalCarriersCount} nosičov</span>
                            </button>
                          </div>
                        )}

                        {/* Región a typ cesty / adresa */}
                        <div className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <span className="flex items-center gap-1">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: reg.color }}
                            ></span>
                            {reg.shortName}
                          </span>
                          {station.city && (
                            <>
                              <span className="text-slate-400 dark:text-gray-600">•</span>
                              <span className="text-slate-600 dark:text-gray-400 truncate max-w-[110px]">
                                {station.city}
                              </span>
                            </>
                          )}
                          {station.affectedRoad ? (
                            <>
                              <span className="text-slate-400 dark:text-gray-600">•</span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate max-w-[130px]" title={`Dotknutá komunikácia: ${station.affectedRoad} (CSD 2022/2023)`}>
                                {station.affectedRoad}
                              </span>
                            </>
                          ) : station.roadType ? (
                            <>
                              <span className="text-slate-400 dark:text-gray-600">•</span>
                              <span className="text-slate-500 dark:text-gray-400">
                                {station.roadType}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* Button to open 2x LCD Obrazovky tab (iba pre stanice s LCD) */}
                      {hasStationLcdScreens(station) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStationDetail(station.id, 'lcd');
                          }}
                          className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 border border-red-500/50 shadow-xs cursor-pointer"
                          title="Zobraziť živé vysielanie 2x LCD obrazoviek na tejto stanici"
                        >
                          <Tv className="w-3 h-3 text-red-500" />
                          <span className="hidden xl:inline">2× LCD</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        </button>
                      )}

                      {/* Button to open Fotobanka 12 zón drawer alebo Profil centrály */}
                      {station.isHeadquarters ? (
                        <button
                          id={`btn-open-detail-${station.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStationDetail(station.id, 'info');
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-600 text-amber-900 hover:text-white dark:bg-amber-950/60 dark:hover:bg-amber-600 dark:text-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-amber-300 dark:border-amber-800/80 shadow-xs cursor-pointer"
                          title="Otvoriť profil a informácie centrály"
                        >
                          <Building2 className="w-3.5 h-3.5 text-amber-600 group-hover:text-white dark:text-amber-400" />
                          <span>Profil centrály</span>
                        </button>
                      ) : (
                        <button
                          id={`btn-open-detail-${station.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStationDetail(station.id, 'photos');
                          }}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white dark:bg-emerald-950/60 dark:hover:bg-emerald-600 dark:text-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/80 shadow-xs cursor-pointer"
                          title="Otvoriť Fotobanku 12 zón tejto prevádzky"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white dark:text-emerald-400" />
                          <span>Fotobanka 12 zón</span>
                        </button>
                      )}

                      <ChevronRight
                        className={`w-4 h-4 transition ${
                          isSelected
                            ? 'text-red-600 dark:text-red-400 translate-x-0.5'
                            : 'text-slate-400 dark:text-gray-600 group-hover:text-slate-700 dark:group-hover:text-gray-300 group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Quick Action Footer: Visits, Traffic Range, Market OOH Potential, Google Maps & Street View Shortcuts */}
                  <div className="flex items-center justify-between text-[10px] bg-slate-100/90 dark:bg-black/30 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800/80 gap-2">
                    <span className="text-slate-600 dark:text-gray-400 flex items-center gap-2 min-w-0 truncate">
                      {station.trafficRange && (
                        <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 truncate" title={`Oficiálna intenzita dopravy CSD: ${station.trafficRange} voz./24h (${station.trafficSource || 'SSC'})`}>
                          <Car className="w-2.5 h-2.5 shrink-0 text-emerald-600" />
                          <span className="font-mono text-[9px]">{station.trafficRange}</span>
                        </span>
                      )}
                      {(station.dailyVisitsCashier || station.monthlyVisitsCashier) && !station.isHeadquarters ? (
                        <span className="flex items-center gap-1 font-medium truncate" title={`Reálna denná návštevnosť z auditu: ${(station.dailyVisitsCashier || Math.round(station.monthlyVisitsCashier! / 30)).toLocaleString('sk-SK')} bločkov/deň (mesačne: ${station.monthlyVisitsCashier?.toLocaleString('sk-SK')})`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                          <strong className="text-slate-900 dark:text-white font-mono">{(station.dailyVisitsCashier || Math.round(station.monthlyVisitsCashier! / 30)).toLocaleString('sk-SK')}</strong>
                          <span className="text-[9px] text-slate-500">bločkov/deň</span>
                        </span>
                      ) : null}
                      {adSummary.totalRevenue > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold shrink-0" title={`Mesačný trhový potenciál reklamných plôch: ${adSummary.totalRevenue} € / mes. (Voľné: ${adSummary.potentialRevenue} €)`}>
                          <Tag className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-mono">~{adSummary.totalRevenue.toLocaleString('sk-SK')} €/m</span>
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {station.googleMapsUrl && (
                        <a
                          href={station.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 dark:bg-sky-950/80 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-300 font-bold text-[9px] border border-sky-300 dark:border-sky-700/60 flex items-center gap-0.5 transition cursor-pointer"
                          title="Otvoriť Google Mapy prevádzky"
                        >
                          <MapPin className="w-2.5 h-2.5 text-sky-600" />
                          <span>Mapy</span>
                        </a>
                      )}

                      {station.googleStreetViewUrl && (
                        <a
                          href={station.googleStreetViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 font-bold text-[9px] border border-amber-300 dark:border-amber-700/60 flex items-center gap-0.5 transition cursor-pointer"
                          title="Otvoriť Street View 360°"
                        >
                          <Eye className="w-2.5 h-2.5 text-amber-600" />
                          <span>360°</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile close sidebar button */}
      <div className="p-3 bg-white dark:bg-[#111622] border-t border-slate-200 dark:border-gray-800 lg:hidden text-center shrink-0">
        <button
          onClick={onCloseMobile}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-semibold rounded-xl text-slate-800 dark:text-gray-200 transition"
        >
          Zavrieť zoznam a zobraziť mapu
        </button>
      </div>
    </aside>
  );
};
