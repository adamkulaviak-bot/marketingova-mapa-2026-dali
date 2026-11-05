import React, { useState, useMemo } from 'react';
import {
  X,
  Tv,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Radio,
  ExternalLink,
  Table,
  Fuel,
  TrendingUp,
} from 'lucide-react';
import { Station, RegionId, RegionInfo } from '../types';
import { STATIONS, REGIONS } from '../data/stations';
import { LcdScreensViewer } from './LcdScreensViewer';
import { hasStationLcdScreens } from '../data/lcdScreensData';
import { normalizeText } from '../utils/text';

interface LcdNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStationId?: number | null;
  onSelectStationInApp?: (stationId: number) => void;
}

export const LcdNetworkModal: React.FC<LcdNetworkModalProps> = ({
  isOpen,
  onClose,
  initialStationId,
  onSelectStationInApp,
}) => {
  // Filter stations for the selector (stations with shops that have commercial LCD screens)
  const eligibleStations = useMemo(() => {
    return STATIONS.filter((s) => !s.isTerminal && hasStationLcdScreens(s));
  }, []);

  const [selectedStationId, setSelectedStationId] = useState<number>(() => {
    if (typeof initialStationId === 'number' && !isNaN(initialStationId)) {
      const match = STATIONS.find((s) => s.id === initialStationId);
      if (match && hasStationLcdScreens(match)) {
        return initialStationId;
      }
    }
    return STATIONS.find((s) => !s.isTerminal && hasStationLcdScreens(s))?.id || 1;
  });
  const [regionFilter, setRegionFilter] = useState<'all' | RegionId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Update selected station if initialStationId changes and modal opens
  React.useEffect(() => {
    if (typeof initialStationId === 'number' && !isNaN(initialStationId)) {
      const match = STATIONS.find((s) => s.id === initialStationId);
      if (match && hasStationLcdScreens(match)) {
        setSelectedStationId(initialStationId);
      } else {
        setSelectedStationId(eligibleStations[0]?.id || 1);
      }
    }
  }, [initialStationId, isOpen, eligibleStations]);

  const filteredStations = useMemo(() => {
    const q = normalizeText(searchQuery);
    return eligibleStations.filter((s) => {
      if (regionFilter !== 'all' && s.region !== regionFilter) return false;
      if (q) {
        const matchName = normalizeText(s.name).includes(q);
        const matchCode = normalizeText(s.stationCode || '').includes(q);
        const matchCity = s.city ? normalizeText(s.city).includes(q) : false;
        return matchName || matchCode || matchCity;
      }
      return true;
    });
  }, [eligibleStations, regionFilter, searchQuery]);

  const currentStation = useMemo(() => {
    return STATIONS.find((s) => s.id === selectedStationId) || STATIONS[0];
  }, [selectedStationId]);

  const currentIndex = eligibleStations.findIndex((s) => s.id === selectedStationId);

  const handlePrevStation = () => {
    if (currentIndex > 0) {
      setSelectedStationId(eligibleStations[currentIndex - 1].id);
    } else {
      setSelectedStationId(eligibleStations[eligibleStations.length - 1].id);
    }
  };

  const handleNextStation = () => {
    if (currentIndex < eligibleStations.length - 1) {
      setSelectedStationId(eligibleStations[currentIndex + 1].id);
    } else {
      setSelectedStationId(eligibleStations[0].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-gray-800 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#111622] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-900/20 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-red-500">
                <Tv className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Centrálny monitoring 2× LCD obrazoviek DALIOIL
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONLINE DOOH NETWORK</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                Prehľad živého vysielania na predajniach: <strong className="text-slate-800 dark:text-gray-200">{eligibleStations.length * 2} LCD obrazoviek</strong> ({eligibleStations.length} prevádzok × 2) • Slučka 01 (Pokladňa) + Slučka 02 (Kaviareň)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Quick Station Navigation */}
            <div className="flex items-center bg-slate-200/80 dark:bg-gray-800 rounded-xl p-0.5 border border-slate-300 dark:border-gray-700">
              <button
                type="button"
                onClick={handlePrevStation}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition cursor-pointer"
                title="Predchádzajúca stanica"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 font-bold text-slate-700 dark:text-gray-300">
                {currentIndex + 1} / {eligibleStations.length}
              </span>
              <button
                type="button"
                onClick={handleNextStation}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition cursor-pointer"
                title="Nasledujúca stanica"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition border border-slate-200 dark:border-gray-700 cursor-pointer"
              title="Zavrieť monitoring obrazoviek"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Selector & Regional Filter Bar */}
        <div className="px-4 py-3 bg-slate-100/90 dark:bg-[#151c28] border-b border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Station selector dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
            <span className="text-xs font-bold text-slate-700 dark:text-gray-300 shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Zvoľte stanicu:</span>
            </span>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(Number(e.target.value))}
              className="w-full bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer shadow-xs"
            >
              {eligibleStations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.stationCode ? `${st.stationCode} – ` : ''}
                  {st.name} ({REGIONS[st.region]?.shortName})
                  {st.isHeadquarters ? ' [CENTRÁLA]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 w-full sm:w-auto justify-start sm:justify-end overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 mr-1 hidden lg:inline">
              Región:
            </span>
            {(
              [
                { id: 'all', label: 'Všetky' },
                { id: 'zapad', label: 'Západ' },
                { id: 'sever', label: 'Sever' },
                { id: 'stred', label: 'Stred' },
                { id: 'vychod', label: 'Východ' },
              ] as const
            ).map((rf) => (
              <button
                key={rf.id}
                type="button"
                onClick={() => setRegionFilter(rf.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  regionFilter === rf.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Active Station Info + LcdScreensViewer */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Station Context Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gray-900/90 border border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-sm shadow">
                {currentStation.id}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {currentStation.name}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-700 font-bold">
                    {currentStation.stationCode || `CS-${String(currentStation.id).padStart(3, '0')}`}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60">
                    {REGIONS[currentStation.region]?.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  {currentStation.street ? `${currentStation.street}, ` : ''}
                  {currentStation.city || currentStation.name} • Otváracie hodiny:{' '}
                  <strong className="text-slate-800 dark:text-gray-200">
                    {currentStation.openingHours || 'NONSTOP'}
                  </strong>
                </p>
              </div>
            </div>

            {onSelectStationInApp && (
              <button
                type="button"
                onClick={() => {
                  onSelectStationInApp(currentStation.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 font-bold text-xs border border-slate-300 dark:border-gray-700 transition cursor-pointer self-start sm:self-auto"
                title="Zobraziť túto stanicu na mape a otvoriť plný detail"
              >
                <span>Zobraziť na mape</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* The Player Component */}
          <LcdScreensViewer station={currentStation} defaultView="dual" />
        </div>
      </div>
    </div>
  );
};
