import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Camera,
  FolderOpen,
  MapPin,
  CheckCircle2,
  Grid,
  List,
  Copy,
  Check,
  Fuel,
  Navigation,
  LogIn,
  Receipt,
  Users,
  Coffee,
  Building,
  SquareParking,
  ArrowRight,
  Droplets,
  Umbrella,
  Folder,
  ChevronRight,
  SlidersHorizontal,
  Info,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ZONE_DEFINITIONS, ZoneDefinition } from '../data/zoneGalleryData';
import {
  STATION_ZONE_FOLDERS,
  getEmbeddedFolderViewUrl,
  getStationZoneFolder,
  StationZoneFolder,
} from '../data/stationPhotoFolders';
import { STATIONS } from '../data/stations';
import { AD_SPACES } from '../data/adSpaces';
import { NativeZonePhotoViewer } from './NativeZonePhotoViewer';

interface ZonePhotoBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialZoneNumber?: number | null;
  initialStationCode?: string | null;
  onSelectStation?: (stationId: number) => void;
}

export const ZonePhotoBankModal: React.FC<ZonePhotoBankModalProps> = ({
  isOpen,
  onClose,
  initialZoneNumber,
  initialStationCode,
  onSelectStation,
}) => {
  // Active selection
  const [selectedZoneNumber, setSelectedZoneNumber] = useState<number>(initialZoneNumber || 2);
  const [selectedStationCode, setSelectedStationCode] = useState<string>(initialStationCode || 'DALIOIL_001');
  const [activeTab, setActiveTab] = useState<'photos' | 'drive' | 'overview'>('photos');
  const [driveViewMode, setDriveViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Update selected zone when initialZoneNumber changes
  useEffect(() => {
    if (initialZoneNumber) {
      setSelectedZoneNumber(initialZoneNumber);
      setActiveTab('photos');
    }
  }, [initialZoneNumber]);

  // Update selected station when initialStationCode changes
  useEffect(() => {
    if (initialStationCode) {
      setSelectedStationCode(initialStationCode);
    }
  }, [initialStationCode]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Current zone definition
  const currentZone = useMemo(() => {
    return ZONE_DEFINITIONS.find((z) => z.zoneNumber === selectedZoneNumber) || ZONE_DEFINITIONS[1];
  }, [selectedZoneNumber]);

  // Current station
  const currentStation = useMemo(() => {
    return STATIONS.find((s) => s.stationCode === selectedStationCode) || STATIONS[0];
  }, [selectedStationCode]);

  // Find Google Drive folder for the active station & zone
  const currentFolder = useMemo<StationZoneFolder | undefined>(() => {
    const direct = getStationZoneFolder(selectedStationCode, selectedZoneNumber);
    if (direct && direct.folderUrl) return direct;

    // Fallback: search in station folders
    return STATION_ZONE_FOLDERS.find(
      (f) => f.stationCode === selectedStationCode && f.zoneNumber === selectedZoneNumber && f.folderUrl
    );
  }, [selectedStationCode, selectedZoneNumber]);

  // In-app embedded URL
  const embedUrl = useMemo(() => {
    if (!currentFolder?.folderUrl) return undefined;
    return getEmbeddedFolderViewUrl(currentFolder.folderUrl, driveViewMode);
  }, [currentFolder, driveViewMode]);

  // Copy Drive URL handler
  const handleCopyLink = () => {
    if (!currentFolder?.folderUrl) return;
    navigator.clipboard.writeText(currentFolder.folderUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper for zone icons
  const renderZoneIcon = (zoneNum: number, className = 'w-4 h-4') => {
    switch (zoneNum) {
      case 1:
        return <Navigation className={className} />;
      case 2:
        return <Fuel className={className} />;
      case 3:
        return <LogIn className={className} />;
      case 4:
        return <Receipt className={className} />;
      case 5:
        return <Users className={className} />;
      case 6:
        return <Coffee className={className} />;
      case 7:
        return <Building className={className} />;
      case 8:
        return <SquareParking className={className} />;
      case 9:
        return <ArrowRight className={className} />;
      case 10:
        return <Droplets className={className} />;
      case 11:
        return <Umbrella className={className} />;
      case 12:
      default:
        return <Folder className={className} />;
    }
  };

  // Count registered spaces per zone
  const getZoneAdCount = (zoneNum: number) => {
    return AD_SPACES.filter((ad) => ad.zoneNumber === zoneNum).length;
  };

  // Filtered stations for search dropdown
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return STATIONS;
    const q = searchQuery.toLowerCase().trim();
    return STATIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.city && s.city.toLowerCase().includes(q)) ||
        (s.stationCode && s.stationCode.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200 dark:border-gray-800 rounded-3xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* ========================================================
            TOP BAR / HEADER
            ======================================================== */}
        <header className="px-5 py-3.5 bg-white dark:bg-[#111723] border-b border-slate-200 dark:border-gray-800 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-950/20 shrink-0">
              <Camera className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                  Fotobanka 12 zón DALIOIL
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Plynulé In-App prezeranie šípkami • 48 staníc
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                Prezeranie originálnych fotografií jednotlivých zón čerpacích staníc priamo v aplikácii bez otvárania nových kariet.
              </p>
            </div>
          </div>

          {/* Close button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition cursor-pointer"
              title="Zavrieť fotobanku (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ========================================================
            PRIMARY CONTROLS: STATION SELECTOR & MODE TABS
            ======================================================== */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-[#121927] border-b border-slate-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Station Selector Dropdown */}
          <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <label htmlFor="station-selector" className="text-[10px] uppercase font-bold text-slate-400 block">
                Zvoľte čerpaciu stanicu:
              </label>
              <select
                id="station-selector"
                value={selectedStationCode}
                onChange={(e) => setSelectedStationCode(e.target.value)}
                className="w-full bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-gray-700 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {filteredStations.map((st) => (
                  <option key={st.id} value={st.stationCode}>
                    {st.stationCode} – {st.name} ({st.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tab Switcher & Drive Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View tabs */}
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl p-0.5 border border-slate-200 dark:border-gray-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === 'photos'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900'
                }`}
                title="Plynulé prezeranie fotografií zóny so šípkami a miniatúrami"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>In-App fotky (Z{selectedZoneNumber})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Prehľad 12 zón</span>
              </button>
            </div>

            {/* Grid / List toggle for embedded Drive view */}
            {activeTab === 'drive' && (
              <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl p-0.5 border border-slate-200 dark:border-gray-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDriveViewMode('grid')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    driveViewMode === 'grid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                  }`}
                  title="Mriežkové zobrazenie náhľadov"
                >
                  <Grid className="w-3 h-3" />
                  <span className="hidden sm:inline">Mriežka</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDriveViewMode('list')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    driveViewMode === 'list'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                  }`}
                  title="Zoznamové zobrazenie súborov"
                >
                  <List className="w-3 h-3" />
                  <span className="hidden sm:inline">Zoznam</span>
                </button>
              </div>
            )}

            {/* In-app Copy Link button */}
            {currentFolder?.folderUrl && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Kopírovať interný odkaz na Google Drive priečinok do schránky"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Skopírované!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Kopírovať odkaz</span>
                  </>
                )}
              </button>
            )}

            {/* Dedicated Open on Google Drive button */}
            {currentFolder?.folderUrl && (
              <a
                href={currentFolder.folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Otvoriť originálny priečinok na Google Disku v novej karte"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Otvoriť na Google Disku</span>
                <span className="sm:hidden">Disk ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* ========================================================
            ZONE STRIP / HORIZONTAL TABS (Zóna 1 až Zóna 12)
            ======================================================== */}
        <div className="px-4 py-2 bg-slate-100/70 dark:bg-[#0c1017] border-b border-slate-200 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-thin">
          <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 mr-1 hidden md:inline">
            Zóny:
          </span>
          {ZONE_DEFINITIONS.map((z, idx) => {
            const isSelected = z.zoneNumber === selectedZoneNumber;
            return (
              <button
                key={`zone-tab-${z.zoneNumber}-${idx}`}
                type="button"
                onClick={() => {
                  setSelectedZoneNumber(z.zoneNumber);
                  setActiveTab('photos');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-[#131924] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800'
                }`}
                title={z.name}
              >
                {renderZoneIcon(z.zoneNumber, 'w-3.5 h-3.5')}
                <span>Z{z.zoneNumber}</span>
                <span className="hidden lg:inline text-[11px] font-normal opacity-90">
                  {z.shortName}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            MODAL CONTENT AREA
            ======================================================== */}
        <div className="flex-1 overflow-hidden p-3 sm:p-5 flex flex-col bg-slate-50/50 dark:bg-[#0b0e14]">
          {activeTab === 'photos' ? (
            /* ========================================================
               TAB 1: NATIVE IN-APP PHOTO CAROUSEL & LIGHTBOX
               ======================================================== */
            <NativeZonePhotoViewer
              stationCode={selectedStationCode}
              initialZoneNumber={selectedZoneNumber}
              onSelectStation={onSelectStation}
              showZoneSelector={false}
              showStationSelector={false}
              className="flex-1 rounded-2xl border-0 shadow-lg"
            />
          ) : (
            /* ========================================================
               TAB 2: CLEAN OVERVIEW OF ALL 12 ZONES
               ======================================================== */
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {ZONE_DEFINITIONS.map((zone, zIdx) => {
                  const adCount = getZoneAdCount(zone.zoneNumber);
                  const isSelected = zone.zoneNumber === selectedZoneNumber;

                  return (
                    <div
                      key={`zone-card-${zone.zoneNumber}-${zIdx}`}
                      onClick={() => {
                        setSelectedZoneNumber(zone.zoneNumber);
                        setActiveTab('photos');
                      }}
                      className={`group p-4 rounded-2xl bg-white dark:bg-[#131924] border transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-gray-800 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${zone.gradient} text-white shadow-md shadow-black/10 shrink-0`}>
                            {renderZoneIcon(zone.zoneNumber, 'w-5 h-5')}
                          </div>
                          <span className="font-mono text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700">
                            Zóna {zone.zoneNumber}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {zone.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                            {zone.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {zone.typicalFormats.slice(0, 2).map((fmt, idx) => (
                            <span
                              key={`fmt-${zone.zoneNumber}-${idx}`}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 border border-slate-200/80 dark:border-gray-700/60 truncate max-w-full"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400">
                          {adCount > 0 ? `${adCount} reklamných nosičov` : '48 staníc siete'}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          <span>Otvoriť fotky</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
