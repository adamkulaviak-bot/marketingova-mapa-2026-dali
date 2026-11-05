import React, { useState, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Search,
  Fuel,
  Building2,
  Layers,
  Sparkles,
  MapPin,
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  FileText,
  CheckCircle2,
  Info,
  Tv,
  Flag,
  Maximize2,
  ChevronRight,
  Printer,
  Copy,
  Check,
  FolderOpen,
  Camera,
  ArrowRight,
  ArrowLeft,
  Grid as GridIcon,
  List as ListIcon,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  CARRIER_AUDIT_DATA,
  StationCarrierAudit,
  getCarrierAuditsSummary,
  AUDIT_PDF_PATH,
} from '../data/adCarrierAuditData';
import { REGIONS, STATIONS } from '../data/stations';
import {
  getStationZoneFolder,
  getEmbeddedFolderViewUrl,
  OFFICIAL_ZONE_NAMES,
  StationZoneFolder,
} from '../data/stationPhotoFolders';
import { ZONE_DEFINITIONS } from '../data/zoneGalleryData';
import { RegionId } from '../types';
import { normalizeText } from '../utils/text';
import { NativeZonePhotoViewer } from './NativeZonePhotoViewer';

interface CarrierDataAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStationDetail?: (stationId: number) => void;
  onOpenZonePhotoBank?: (stationCode: string, zoneNumber: number) => void;
}

export const CarrierDataAuditModal: React.FC<CarrierDataAuditModalProps> = ({
  isOpen,
  onClose,
  onOpenStationDetail,
  onOpenZonePhotoBank,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | RegionId>('all');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'photobank' | 'pdf'>('matrix');
  const [selectedStationAudit, setSelectedStationAudit] = useState<StationCarrierAudit | null>(null);
  const [copiedStationCode, setCopiedStationCode] = useState<string | null>(null);

  // In-App Photobank active selection
  const [selectedPhotoStationCode, setSelectedPhotoStationCode] = useState<string>('DALIOIL_001');
  const [selectedPhotoZoneNumber, setSelectedPhotoZoneNumber] = useState<number>(1);
  const [photoBankDriveMode, setPhotoBankDriveMode] = useState<'grid' | 'list'>('grid');
  const [photoViewerType, setPhotoViewerType] = useState<'native' | 'drive'>('native');

  const handleOpenPhotoBank = (stationCode: string, zoneNumber: number = 1) => {
    setSelectedPhotoStationCode(stationCode);
    setSelectedPhotoZoneNumber(zoneNumber);
    setViewMode('photobank');
  };

  const summary = useMemo(() => getCarrierAuditsSummary(), []);

  // Filtered stations based on search, region, format
  const filteredAudits = useMemo(() => {
    const q = normalizeText(searchQuery);

    return CARRIER_AUDIT_DATA.filter((audit) => {
      // Region filter
      if (selectedRegion !== 'all' && audit.region !== selectedRegion) {
        return false;
      }

      // Format filter
      if (selectedFormatFilter !== 'all') {
        const fullText = (
          audit.primaryCarrierTypes.join(' ') +
          ' ' +
          Object.values(audit.zones).map((z) => `${z.rawText} ${z.types.join(' ')}`).join(' ')
        ).toLowerCase();

        if (selectedFormatFilter === 'billboards' && !fullText.includes('bilboard') && !fullText.includes('billboard') && !fullText.includes('bilb')) {
          return false;
        }
        if (selectedFormatFilter === 'monitors' && !fullText.includes('monitor') && !fullText.includes('obrazovk') && !fullText.includes('lcd')) {
          return false;
        }
        if (selectedFormatFilter === 'a1' && !fullText.includes('a1') && !fullText.includes('a0')) {
          return false;
        }
        if (selectedFormatFilter === 'a4' && !fullText.includes('a4') && !fullText.includes('a3') && !fullText.includes('a5')) {
          return false;
        }
        if (selectedFormatFilter === 'flags' && !fullText.includes('zástav') && !fullText.includes('zastav')) {
          return false;
        }
        if (selectedFormatFilter === 'banners' && !fullText.includes('placht') && !fullText.includes('banner') && !fullText.includes('baner')) {
          return false;
        }
      }

      // Search query
      if (q !== '') {
        const matchName = normalizeText(audit.stationName).includes(q);
        const matchCode = normalizeText(audit.stationCode).includes(q);
        const matchDispensers = normalizeText(audit.fuelDispensers).includes(q);
        const matchTypes = audit.primaryCarrierTypes.some((t) => normalizeText(t).includes(q));
        const matchZones = Object.values(audit.zones).some(
          (z) => normalizeText(z.rawText).includes(q) || z.types.some((zt) => normalizeText(zt).includes(q))
        );

        if (!matchName && !matchCode && !matchDispensers && !matchTypes && !matchZones) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedFormatFilter]);

  if (!isOpen) return null;

  // Export to Excel
  const handleExportExcel = () => {
    const dataRows = CARRIER_AUDIT_DATA.map((s) => ({
      'Čerpacia stanica': s.stationName,
      'Kód stanice': s.stationCode,
      'Región': REGIONS[s.region]?.name || s.region,
      'Počet stojanov PHM': s.fuelDispensers,
      '1_Príjazdová zóna': s.zones.zone1.rawText,
      '2_Výdajné stojany': s.zones.zone2.rawText,
      '3_Vstupná zóna': s.zones.zone3.rawText,
      '4_Pokladničná zóna': s.zones.zone4.rawText,
      '5_Toaletná zóna': s.zones.zone5.rawText,
      '6_Kaviarenský kútik': s.zones.zone6.rawText,
      '7_Budova': s.zones.zone7.rawText,
      '8_Parkovisko': s.zones.zone8.rawText,
      '9_Odjazdová zóna': s.zones.zone9.rawText,
      '10_Autoumyváreň': s.zones.zone10.rawText,
      '11_Vonkajšia terasa': s.zones.zone11.rawText,
      '12_Ostatné': s.zones.zone12.rawText,
      'Spolu nosičov': s.totalCarriersCount,
      'Kľúčové nosiče': s.primaryCarrierTypes.join(', '),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Zber_dat_nosice_DALIOIL');
    XLSX.writeFile(workbook, `DALIOIL_Zber_dat_reklamne_nosice_2026.xlsx`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Čerpacia stanica',
      'Kód stanice',
      'Región',
      'Počet stojanov PHM',
      '1_Prijazdova zona od cesty',
      '2_Zona pri vydajnych stojanoch',
      '3_Vstupna zona do shopu',
      '4_Pokladnicna zona',
      '5_Toaletna zona',
      '6_Kaviarensky kutik',
      '7_Budova',
      '8_Parkovisko a ostatny priestor',
      '9_Odjazdova zona',
      '10_Autoumyvaren',
      '11_Vonkajsia terasa',
      '12_Ostatne',
      'Spolu nosicov',
    ];

    const rows = CARRIER_AUDIT_DATA.map((s) => [
      `"${s.stationName}"`,
      `"${s.stationCode}"`,
      `"${REGIONS[s.region]?.name || s.region}"`,
      `"${s.fuelDispensers}"`,
      `"${s.zones.zone1.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone2.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone3.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone4.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone5.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone6.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone7.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone8.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone9.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone10.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone11.rawText.replace(/"/g, '""')}"`,
      `"${s.zones.zone12.rawText.replace(/"/g, '""')}"`,
      s.totalCarriersCount,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DALIOIL_Zber_dat_reklamne_nosice_2026.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStationCode(code);
    setTimeout(() => setCopiedStationCode(null), 2000);
  };

  const renderCellBadge = (
    text: string,
    count: number,
    types: string[],
    zoneNumber: number,
    stationCode: string,
    stationName: string
  ) => {
    if (!text || text === '–' || text === '0 ks | 0' || text === '0 ks' || text === '0') {
      return (
        <button
          type="button"
          onClick={() => handleOpenPhotoBank(stationCode, zoneNumber)}
          className="text-slate-300 dark:text-gray-600 hover:text-emerald-500 dark:hover:text-emerald-400 font-mono text-xs px-2 py-0.5 rounded hover:bg-emerald-500/10 transition cursor-pointer"
          title={`Zóna ${zoneNumber} (${stationName}): Otvoriť fotobanku`}
        >
          –
        </button>
      );
    }

    const hasBillboard = types.includes('Billboard') || text.toLowerCase().includes('bilboard');
    const hasMonitor = types.includes('Monitory & DOOH') || text.toLowerCase().includes('monitor');
    const hasA0orA1 = types.includes('Formát A1') || types.includes('Formát A0');
    const hasFlags = types.includes('Zástavy') || text.toLowerCase().includes('zástav');
    const hasPlachta = types.includes('Plachta / Banner') || text.toLowerCase().includes('placht');

    let badgeClass = 'bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700';
    if (hasBillboard) {
      badgeClass = 'bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/60 font-semibold';
    } else if (hasMonitor) {
      badgeClass = 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 font-semibold';
    } else if (hasFlags) {
      badgeClass = 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 font-semibold';
    } else if (hasA0orA1) {
      badgeClass = 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    } else if (hasPlachta) {
      badgeClass = 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    }

    return (
      <div className="flex flex-col gap-0.5 text-left max-w-[170px]">
        <button
          type="button"
          onClick={() => handleOpenPhotoBank(stationCode, zoneNumber)}
          className={`group flex items-center justify-between gap-1 px-1.5 py-0.5 rounded text-[11px] border leading-snug cursor-pointer transition text-left hover:scale-[1.02] hover:shadow-xs ${badgeClass}`}
          title={`Zobraziť In-App fotobanku: Zóna ${zoneNumber} (${stationName}) - bez otvárania novej karty`}
        >
          <span className="truncate">{text}</span>
          <Camera className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100 text-emerald-600 dark:text-emerald-400 transition" />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-gray-800 shadow-2xl w-full max-w-[96vw] xl:max-w-7xl h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-gray-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-[#151b2a]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-red-900/20 shrink-0">
              <TableIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Zber dát: Množstvo reklamných nosičov a typy na prevádzkach DALIOIL
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-950/90 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                  Oficiálny terénny audit 2026
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  {summary.totalAuditedStations} staníc • {summary.totalCarriersRecorded} nosičov
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                Komplexný audit 12 zón podľa technickej špecifikácie siete vrátane stojanov PHM, monitorov a billboardov
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer"
              title="Stiahnuť celú tabuľku vo formáte Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 transition cursor-pointer"
              title="Stiahnuť vo formáte CSV pre Google Sheets"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition"
              aria-label="Zavrieť okno"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Network KPI Metric Badges Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-white dark:bg-[#111622] border-b border-slate-200 dark:border-gray-800 shrink-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Auditované stanice</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{summary.totalAuditedStations} prevádzok</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Stojany PHM</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{summary.totalFuelDispensers} výdajných stojanov</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Nosičov v sieti</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{summary.totalCarriersRecorded} ks plôch</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Monitory & DOOH</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{summary.totalDigitalMonitors} obrazoviek</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Veľkoformát & BB</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{summary.totalBillboards} billboardov</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-200/80 dark:border-gray-800 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Zástavy & Bannery</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{summary.totalFlags + summary.totalBanners} ks</p>
            </div>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50/50 dark:bg-[#151b2a]/60 border-b border-slate-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative min-w-[220px] max-w-xs flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Hľadať stanicu, formát (A1, monitor, billboard...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  selectedRegion === 'all'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                Všetky regióny
              </button>
              {(['zapad', 'sever', 'stred', 'vychod'] as RegionId[]).map((regId) => (
                <button
                  key={regId}
                  onClick={() => setSelectedRegion(regId)}
                  className={`px-2 py-1 rounded-lg font-semibold transition ${
                    selectedRegion === regId
                      ? 'bg-slate-900 text-white dark:bg-gray-700 shadow-xs'
                      : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {REGIONS[regId]?.shortName || regId}
                </button>
              ))}
            </div>

            {/* Carrier Format Filter */}
            <div className="hidden xl:flex items-center gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs">
              <button
                onClick={() => setSelectedFormatFilter('all')}
                className={`px-2 py-1 rounded-lg font-semibold transition ${
                  selectedFormatFilter === 'all'
                    ? 'bg-slate-800 text-white dark:bg-gray-700'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                Všetky formáty
              </button>
              <button
                onClick={() => setSelectedFormatFilter(selectedFormatFilter === 'billboards' ? 'all' : 'billboards')}
                className={`px-2 py-1 rounded-lg font-semibold transition ${
                  selectedFormatFilter === 'billboards'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                Billboardy
              </button>
              <button
                onClick={() => setSelectedFormatFilter(selectedFormatFilter === 'monitors' ? 'all' : 'monitors')}
                className={`px-2 py-1 rounded-lg font-semibold transition ${
                  selectedFormatFilter === 'monitors'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                Monitory
              </button>
              <button
                onClick={() => setSelectedFormatFilter(selectedFormatFilter === 'a1' ? 'all' : 'a1')}
                className={`px-2 py-1 rounded-lg font-semibold transition ${
                  selectedFormatFilter === 'a1'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                Formát A0/A1
              </button>
              <button
                onClick={() => setSelectedFormatFilter(selectedFormatFilter === 'flags' ? 'all' : 'flags')}
                className={`px-2 py-1 rounded-lg font-semibold transition ${
                  selectedFormatFilter === 'flags'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
                }`}
              >
                Zástavy
              </button>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl border border-slate-200 dark:border-gray-800 text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Matica dát (12 zón)</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Karty prevádzok</span>
            </button>
            <button
              onClick={() => setViewMode('photobank')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'photobank'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Fotobanka 12 zón (In-App)</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                viewMode === 'pdf'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Originál PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-auto bg-slate-100/50 dark:bg-[#0b0e14]">
          {/* VIEW 1: MATRIX TABLE (MATCHES PDF COLUMNS) */}
          {viewMode === 'matrix' && (
            <div className="p-3 sm:p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111622] shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 font-bold text-slate-700 dark:text-gray-300">
                      <th className="py-3 px-3 min-w-[170px] sticky left-0 z-20 bg-slate-100 dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                        Čerpacia stanica
                      </th>
                      <th className="py-3 px-2.5 min-w-[100px] text-center bg-amber-500/10 text-amber-900 dark:text-amber-300">
                        Stojany PHM
                      </th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 1)} className="py-3 px-2.5 min-w-[140px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 1_Príjazdová zóna">1_Príjazdová zóna 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 2)} className="py-3 px-2.5 min-w-[140px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 2_Výdajné stojany">2_Výdajné stojany 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 3)} className="py-3 px-2.5 min-w-[140px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 3_Vstup do shopu">3_Vstup do shopu 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 4)} className="py-3 px-2.5 min-w-[160px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 4_Pokladničná zóna">4_Pokladničná zóna 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 5)} className="py-3 px-2.5 min-w-[120px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 5_Toalety">5_Toalety 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 6)} className="py-3 px-2.5 min-w-[120px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 6_Cafe kútik">6_Cafe kútik 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 7)} className="py-3 px-2.5 min-w-[140px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 7_Budova & Fasáda">7_Budova & Fasáda 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 8)} className="py-3 px-2.5 min-w-[130px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 8_Parkovisko">8_Parkovisko 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 9)} className="py-3 px-2.5 min-w-[120px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 9_Odjazdová zóna">9_Odjazdová zóna 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 10)} className="py-3 px-2.5 min-w-[110px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 10_Umyváreň">10_Umyváreň 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 11)} className="py-3 px-2.5 min-w-[100px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 11_Terasa">11_Terasa 📷</th>
                      <th onClick={() => handleOpenPhotoBank(selectedPhotoStationCode, 12)} className="py-3 px-2.5 min-w-[100px] cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 transition" title="Zobraziť In-App fotobanku: 12_Ostatné">12_Ostatné 📷</th>
                      <th className="py-3 px-3 min-w-[90px] text-center bg-red-500/10 text-red-700 dark:text-red-400">
                        Spolu nosičov
                      </th>
                      <th className="py-3 px-3 min-w-[100px] text-center">Akcia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80">
                    {filteredAudits.map((item, idx) => {
                      const regionObj = REGIONS[item.region];
                      return (
                        <tr
                          key={item.stationCode}
                          className={`hover:bg-slate-50/80 dark:hover:bg-gray-800/50 transition ${
                            idx % 2 === 0 ? 'bg-white dark:bg-[#111622]' : 'bg-slate-50/40 dark:bg-[#131926]/40'
                          }`}
                        >
                          {/* Station Name & Code */}
                          <td className="py-2.5 px-3 sticky left-0 z-10 bg-inherit font-semibold shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-between gap-1.5">
                              <div>
                                <span className="text-slate-900 dark:text-white font-bold block text-sm">
                                  {item.stationName}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-slate-500 dark:text-gray-400">
                                    {item.stationCode}
                                  </span>
                                  {regionObj && (
                                    <span
                                      className="w-2 h-2 rounded-full inline-block"
                                      style={{ backgroundColor: regionObj.color }}
                                      title={regionObj.name}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Fuel Dispensers */}
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-800 dark:text-amber-300 bg-amber-500/5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50">
                              <Fuel className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              {item.fuelDispensers}
                            </span>
                          </td>

                          {/* Zones 1 to 12 */}
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone1.rawText, item.zones.zone1.count, item.zones.zone1.types, 1, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone2.rawText, item.zones.zone2.count, item.zones.zone2.types, 2, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone3.rawText, item.zones.zone3.count, item.zones.zone3.types, 3, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone4.rawText, item.zones.zone4.count, item.zones.zone4.types, 4, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone5.rawText, item.zones.zone5.count, item.zones.zone5.types, 5, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone6.rawText, item.zones.zone6.count, item.zones.zone6.types, 6, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone7.rawText, item.zones.zone7.count, item.zones.zone7.types, 7, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone8.rawText, item.zones.zone8.count, item.zones.zone8.types, 8, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone9.rawText, item.zones.zone9.count, item.zones.zone9.types, 9, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone10.rawText, item.zones.zone10.count, item.zones.zone10.types, 10, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone11.rawText, item.zones.zone11.count, item.zones.zone11.types, 11, item.stationCode, item.stationName)}</td>
                          <td className="py-2.5 px-2.5">{renderCellBadge(item.zones.zone12.rawText, item.zones.zone12.count, item.zones.zone12.types, 12, item.stationCode, item.stationName)}</td>

                          {/* Total Carriers count */}
                          <td className="py-2.5 px-3 text-center bg-red-500/5 font-mono">
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
                              {item.totalCarriersCount} ks
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => {
                                if (onOpenStationDetail) {
                                  onOpenStationDetail(item.stationId);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-red-600 hover:text-white dark:bg-gray-800 dark:hover:bg-red-600 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 transition cursor-pointer"
                              title="Zobraziť detail stanice a fotografie zón"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredAudits.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm">Nenašli sa žiadne čerpacie stanice spĺňajúce zadané filtre.</p>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: CARDS VIEW */}
          {viewMode === 'cards' && (
            <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAudits.map((item) => {
                const reg = REGIONS[item.region];
                return (
                  <div
                    key={item.stationCode}
                    className="bg-white dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Station Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-gray-800/80 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.stationName}</h3>
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: reg?.color || '#94a3b8' }}
                              title={reg?.name}
                            />
                          </div>
                          <span className="font-mono text-xs text-slate-400 dark:text-gray-500">{item.stationCode}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                            <Fuel className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            {item.fuelDispensers}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
                            {item.totalCarriersCount} nosičov
                          </span>
                        </div>
                      </div>

                      {/* Key carrier formats summary */}
                      {item.primaryCarrierTypes.length > 0 && (
                        <div className="py-2.5 flex flex-wrap gap-1.5 border-b border-slate-100 dark:border-gray-800/80">
                          {item.primaryCarrierTypes.map((type, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Active Zones List */}
                      <div className="py-3 space-y-2">
                        {ZONE_DEFINITIONS.map((zDef) => {
                          const zoneKey = `zone${zDef.zoneNumber}` as keyof typeof item.zones;
                          const zItem = item.zones[zoneKey];
                          if (!zItem || !zItem.hasData || zItem.count === 0) return null;

                          return (
                            <div
                              key={zDef.zoneNumber}
                              onClick={() => handleOpenPhotoBank(item.stationCode, zDef.zoneNumber)}
                              className="group flex items-start justify-between gap-2 text-xs p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-gray-900/60 dark:hover:bg-emerald-950/40 border border-slate-100 hover:border-emerald-300 dark:border-gray-800 dark:hover:border-emerald-700/60 transition cursor-pointer"
                              title={`Kliknutím otvoríte In-App fotobanku Zóny ${zDef.zoneNumber} pre ${item.stationName}`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="w-5 h-5 rounded-md bg-slate-200 group-hover:bg-emerald-600 group-hover:text-white dark:bg-gray-800 font-mono font-bold text-[10px] flex items-center justify-center text-slate-700 dark:text-gray-300 transition shrink-0">
                                  Z{zDef.zoneNumber}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate transition">
                                  {zDef.shortName}:
                                </span>
                              </div>
                              <div className="text-right shrink-0 max-w-[60%] flex items-center gap-1.5">
                                <div>
                                  <span className="font-medium text-slate-600 dark:text-gray-300 text-[11px] block">
                                    {zItem.rawText}
                                  </span>
                                  {zItem.formats && (
                                    <span className="text-[10px] text-slate-400 dark:text-gray-500 block">
                                      {zItem.formats}
                                    </span>
                                  )}
                                </div>
                                <Camera className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 transition" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-gray-800/80 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => handleCopyCode(item.stationCode)}
                        className="text-[11px] text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 flex items-center gap-1"
                      >
                        {copiedStationCode === item.stationCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Skopírované</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kód stanice</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPhotoBank(item.stationCode, 1)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition cursor-pointer"
                          title="Otvoriť In-App fotobanku všetkých 12 zón"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Fotobanka</span>
                        </button>

                        <button
                          onClick={() => {
                            if (onOpenStationDetail) {
                              onOpenStationDetail(item.stationId);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white shadow-xs transition cursor-pointer"
                        >
                          <span>Detail</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW: IN-APP 12-ZONE PHOTO BANK VIEWER */}
          {viewMode === 'photobank' && (() => {
            const currentStationObj = STATIONS.find((s) => s.stationCode === selectedPhotoStationCode) || STATIONS[0];
            const currentAuditObj = CARRIER_AUDIT_DATA.find((a) => a.stationCode === selectedPhotoStationCode);
            const currentZoneDef = ZONE_DEFINITIONS.find((z) => z.zoneNumber === selectedPhotoZoneNumber) || ZONE_DEFINITIONS[0];
            const currentZoneData = currentAuditObj?.zones[`zone${selectedPhotoZoneNumber}` as keyof StationCarrierAudit['zones']];
            const currentFolder = getStationZoneFolder(selectedPhotoStationCode, selectedPhotoZoneNumber);
            const currentEmbedUrl = getEmbeddedFolderViewUrl(currentFolder?.folderUrl, photoBankDriveMode);

            return (
              <div className="p-3 sm:p-5 h-full flex flex-col gap-3 min-h-[640px]">
                {/* Station & View mode toolbar */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-gray-800 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="flex-1 max-w-md">
                      <label htmlFor="audit-photobank-st-select" className="text-[10px] uppercase font-bold text-slate-400 block">
                        Vyberte čerpaciu stanicu (44 auditovaných prevádzok):
                      </label>
                      <select
                        id="audit-photobank-st-select"
                        value={selectedPhotoStationCode}
                        onChange={(e) => setSelectedPhotoStationCode(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        {CARRIER_AUDIT_DATA.map((aud) => (
                          <option key={aud.stationCode} value={aud.stationCode}>
                            {aud.stationCode} – {aud.stationName} ({aud.fuelDispensers} stojanov, {aud.totalCarriersCount} nosičov)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Grid / List toggle */}
                    <div className="flex items-center bg-slate-100 dark:bg-gray-800 p-0.5 rounded-xl border border-slate-200 dark:border-gray-700 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPhotoBankDriveMode('grid')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          photoBankDriveMode === 'grid'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                        }`}
                        title="Zobraziť fotografie v mriežke"
                      >
                        <GridIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mriežka</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoBankDriveMode('list')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          photoBankDriveMode === 'list'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                        }`}
                        title="Zobraziť súbory ako zoznam"
                      >
                        <ListIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Zoznam</span>
                      </button>
                    </div>

                    {/* Lightbox / Open modal button */}
                    {onOpenZonePhotoBank && (
                      <button
                        type="button"
                        onClick={() => onOpenZonePhotoBank(selectedPhotoStationCode, selectedPhotoZoneNumber)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-gray-700 transition cursor-pointer"
                        title="Otvoriť samostatné celoobrazovkové okno fotobanky"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Zväčšiť fotobanku</span>
                      </button>
                    )}

                    {/* Back to matrix table button */}
                    <button
                      type="button"
                      onClick={() => setViewMode('matrix')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white transition cursor-pointer"
                      title="Návrat do celkovej tabuľky nosičov"
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                      <span>Matica zberu dát</span>
                    </button>
                  </div>
                </div>

                {/* 12-Zone Clickable Horizontal Strip */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200 dark:border-gray-800 p-2 overflow-x-auto shadow-xs flex items-center gap-1.5 shrink-0 scrollbar-thin">
                  <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 px-2 hidden lg:inline">
                    Zóny 1–12:
                  </span>
                  {ZONE_DEFINITIONS.map((z) => {
                    const isSelected = z.zoneNumber === selectedPhotoZoneNumber;
                    const zoneKey = `zone${z.zoneNumber}` as keyof StationCarrierAudit['zones'];
                    const zAuditItem = currentAuditObj?.zones[zoneKey];
                    const hasCarriers = zAuditItem && zAuditItem.hasData && zAuditItem.count > 0;

                    return (
                      <button
                        key={z.zoneNumber}
                        type="button"
                        onClick={() => setSelectedPhotoZoneNumber(z.zoneNumber)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-[#131924] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:border-emerald-400'
                        }`}
                        title={`${z.name} - Kliknite pre rýchle prepnutie`}
                      >
                        <span>Z{z.zoneNumber}</span>
                        <span className="hidden xl:inline text-[11px] font-normal opacity-90 truncate max-w-[110px]">
                          {z.shortName}
                        </span>
                        {hasCarriers && (
                          <span
                            className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {zAuditItem.count}ks
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active Zone Audit Specs Banner */}
                <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      Z{currentZoneDef.zoneNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                          Zóna {currentZoneDef.zoneNumber}: {currentZoneDef.name}
                        </h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                          {selectedPhotoStationCode} – {currentStationObj?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-300 mt-1 flex-wrap">
                        <span>Evidencia v zbere dát: <strong className="font-bold text-slate-900 dark:text-white">{currentZoneData?.rawText || 'Bez evidovaných nosičov'}</strong></span>
                        {currentZoneData?.formats && (
                          <span>• Formáty: <strong className="font-mono font-bold text-amber-700 dark:text-amber-400">{currentZoneData.formats}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs shrink-0 flex-wrap">
                    {currentFolder?.folderUrl && (
                      <a
                        href={currentFolder.folderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border border-blue-500/50"
                        title="Otvoriť originálny priečinok na Google Disku v novej karte"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Otvoriť na Google Disku</span>
                      </a>
                    )}

                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-medium hidden sm:inline">
                      {currentZoneDef.typicalDimensions}
                    </span>
                  </div>
                </div>

                {/* Native In-App Photo Gallery with Arrow Navigation & Lightbox */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 bg-slate-950 relative min-h-[460px] shadow-lg flex flex-col">
                  <NativeZonePhotoViewer
                    stationCode={selectedPhotoStationCode}
                    initialZoneNumber={selectedPhotoZoneNumber}
                    onSelectStation={onOpenStationDetail}
                    showZoneSelector={false}
                    showStationSelector={false}
                    className="h-full border-0 rounded-none shadow-none"
                  />
                </div>

                {/* Navigation Bar: Prev / Next Zone */}
                <div className="bg-white dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-gray-800 p-2.5 flex items-center justify-between text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoZoneNumber((prev) => (prev > 1 ? prev - 1 : 12))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 font-bold transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Predchádzajúca zóna (Z{selectedPhotoZoneNumber > 1 ? selectedPhotoZoneNumber - 1 : 12})</span>
                  </button>

                  {onOpenStationDetail && currentStationObj && (
                    <button
                      type="button"
                      onClick={() => onOpenStationDetail(currentStationObj.id)}
                      className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition cursor-pointer"
                    >
                      <span>Detail ČS {currentStationObj.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedPhotoZoneNumber((prev) => (prev < 12 ? prev + 1 : 1))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer shadow-xs"
                  >
                    <span>Nasledujúca zóna (Z{selectedPhotoZoneNumber < 12 ? selectedPhotoZoneNumber + 1 : 1})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* VIEW 3: EMBEDDED ORIGINAL PDF DOCUMENT */}
          {viewMode === 'pdf' && (
            <div className="p-4 sm:p-6 h-full flex flex-col">
              <div className="bg-white dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-gray-800 p-3 mb-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Originálny zdrojový dokument: prehlad_reklamnych_ploch_mnozstvo_reklamnych_nosicov.pdf
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Oficiálna terénna tabuľka reklamných plôch a stojanov PHM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={AUDIT_PDF_PATH}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-xs transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Otvoriť v novom okne</span>
                  </a>
                  <a
                    href={AUDIT_PDF_PATH}
                    download="prehlad_reklamnych_ploch_DALIOIL.pdf"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Stiahnuť súbor</span>
                  </a>
                </div>
              </div>

              <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 dark:border-gray-800 bg-slate-900 shadow-md">
                <iframe
                  src={AUDIT_PDF_PATH}
                  title="Originálny PDF dokument - Prehľad reklamných plôch a nosičov"
                  className="w-full h-full min-h-[550px] border-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-[#151b2a] border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 shrink-0">
          <div>
            Zobrazených <strong>{filteredAudits.length}</strong> z <strong>{CARRIER_AUDIT_DATA.length}</strong> auditovaných staníc
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">
              Všetky zóny sú prepojené s Google Drive fotoarchívom
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 transition"
            >
              Zavrieť
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
