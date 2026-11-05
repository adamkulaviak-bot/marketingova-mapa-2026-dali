import React, { useState, useMemo } from 'react';
import {
  X,
  Tag,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  CheckCircle2,
  Clock,
  Car,
  Users,
  Search,
  Filter,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  MapPin,
  ExternalLink,
  Plus,
  Check,
  Eye,
  FileSpreadsheet,
  ArrowUpDown,
} from 'lucide-react';
import { Station, AdSpace, RegionId, RegionInfo } from '../types';
import { ZONE_MARKET_PRICING, ROAD_TYPE_MULTIPLIERS, DURATION_DISCOUNTS } from '../utils/pricingUtils';
import { ZONE_DEFINITIONS } from '../data/zoneGalleryData';
import * as XLSX from 'xlsx';

interface MarketPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  adSpaces: AdSpace[];
  regions: Record<RegionId, RegionInfo>;
  onSelectStationAndOpenDetail: (stationId: number) => void;
  onToggleCampaignPlanItem?: (adSpace: AdSpace, station: Station) => void;
  campaignPlanItemIds?: Set<string>;
}

export const MarketPricingModal: React.FC<MarketPricingModalProps> = ({
  isOpen,
  onClose,
  stations,
  adSpaces,
  regions,
  onSelectStationAndOpenDetail,
  onToggleCampaignPlanItem,
  campaignPlanItemIds,
}) => {
  const [activeTab, setActiveTab] = useState<'zones' | 'catalog' | 'benchmark' | 'discounts'>('zones');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | RegionId>('all');
  const [selectedRoadType, setSelectedRoadType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'all' | 'under75' | '75to150' | '150to220' | 'over220'>('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<number | 'all'>('all');
  const [onlyFree, setOnlyFree] = useState<boolean>(false);
  const [sortField, setSortField] = useState<'price' | 'cpm' | 'station' | 'zone'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Overall Market Metrics
  const metrics = useMemo(() => {
    if (adSpaces.length === 0) return { avg: 0, min: 0, max: 0, totalVal: 0, avgDaily: 0, avgCpm: 0 };
    const prices = adSpaces.map((a) => a.monthlyPriceEur).filter((p) => p > 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const totalVal = prices.reduce((sum, p) => sum + p, 0);
    const avg = Math.round(totalVal / prices.length);
    const avgDaily = Math.round((avg / 30) * 100) / 100;
    const cpms = adSpaces.map((a) => a.cpmPriceEur || 0).filter((c) => c > 0);
    const avgCpm = cpms.length > 0 ? Math.round((cpms.reduce((s, c) => s + c, 0) / cpms.length) * 100) / 100 : 1.45;

    return { avg, min, max, totalVal, avgDaily, avgCpm };
  }, [adSpaces]);

  // Station map lookup for fast joins
  const stationMap = useMemo(() => {
    const map = new Map<number, Station>();
    stations.forEach((s) => map.set(s.id, s));
    return map;
  }, [stations]);

  // Filtered Ad Spaces for Catalog
  const filteredAds = useMemo(() => {
    return adSpaces.filter((ad) => {
      const station = stationMap.get(ad.stationId);
      if (!station) return false;

      // Region filter
      if (selectedRegion !== 'all' && station.region !== selectedRegion) return false;

      // Road Type filter
      if (selectedRoadType !== 'all' && station.roadType !== selectedRoadType) return false;

      // Zone filter
      if (selectedZoneFilter !== 'all' && ad.zoneNumber !== selectedZoneFilter) return false;

      // Free status filter
      if (onlyFree && ad.status !== 'free') return false;

      // Price range filter
      if (selectedPriceRange === 'under75' && ad.monthlyPriceEur > 75) return false;
      if (selectedPriceRange === '75to150' && (ad.monthlyPriceEur < 75 || ad.monthlyPriceEur > 150)) return false;
      if (selectedPriceRange === '150to220' && (ad.monthlyPriceEur < 150 || ad.monthlyPriceEur > 220)) return false;
      if (selectedPriceRange === 'over220' && ad.monthlyPriceEur <= 220) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ad.name.toLowerCase().includes(q);
        const matchStation = station.name.toLowerCase().includes(q);
        const matchCity = (station.city || '').toLowerCase().includes(q);
        const matchCode = (station.stationCode || '').toLowerCase().includes(q) || ad.id.toLowerCase().includes(q);
        if (!matchName && !matchStation && !matchCity && !matchCode) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'price') {
        return sortOrder === 'asc' ? a.monthlyPriceEur - b.monthlyPriceEur : b.monthlyPriceEur - a.monthlyPriceEur;
      }
      if (sortField === 'cpm') {
        const cpmA = a.cpmPriceEur || 0;
        const cpmB = b.cpmPriceEur || 0;
        return sortOrder === 'asc' ? cpmA - cpmB : cpmB - cpmA;
      }
      if (sortField === 'zone') {
        return sortOrder === 'asc' ? (a.zoneNumber || 0) - (b.zoneNumber || 0) : (b.zoneNumber || 0) - (a.zoneNumber || 0);
      }
      // station name
      const nameA = a.stationName || '';
      const nameB = b.stationName || '';
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [adSpaces, stationMap, selectedRegion, selectedRoadType, selectedZoneFilter, onlyFree, selectedPriceRange, searchQuery, sortField, sortOrder]);

  // Export to Excel XLSX
  const handleExportExcel = () => {
    const dataRows = filteredAds.map((ad) => {
      const st = stationMap.get(ad.stationId);
      return {
        'Kód nosiča': ad.id,
        'Kód stanice': st?.stationCode || '',
        'Názov stanice': st?.name || '',
        'Mesto': st?.city || st?.name || '',
        'Región': st ? regions[st.region]?.name : '',
        'Typ ťahu': st?.roadType || 'Tranzit 1. triedy',
        'Dotknutá komunikácia (SSC)': st?.affectedRoad || st?.roadType || '',
        'Intenzita dopravy (voz./24h)': st?.trafficRange || '',
        'Priemerné AADT (autá/deň)': st?.trafficIntensityAADT || 16000,
        'Zdroj sčítania dopravy': st?.trafficSource || 'Slovenská správa ciest (CSD 2022/2023)',
        'Zóna': ad.zoneNumber ? `Zóna ${ad.zoneNumber}` : ad.type,
        'Názov nosiča': ad.name,
        'Rozmery': ad.dimensions,
        'Osvetlenie': ad.illumination,
        'Mesačná trhová cena (EUR)': ad.monthlyPriceEur,
        'Denná sadzba (EUR/deň)': ad.dailyPriceEur || Math.round((ad.monthlyPriceEur / 30) * 100) / 100,
        'CPT (EUR/1000 videní)': ad.cpmPriceEur || 1.45,
        'Stav plochy': ad.status === 'free' ? 'Voľná k prenájmu' : ad.status === 'expiring' ? 'Končí zmluva' : 'Obsadená',
        'Bločky pri pokladni (denne)': Math.round((st?.monthlyVisitsCashier || 0) / 30),
        'Bločky pri pokladni (mesačne)': st?.monthlyVisitsCashier || 0,
        'Odôvodnenie ocenenia': ad.valuationBreakdown || '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trhove_Ceny_DALIOIL');
    XLSX.writeFile(workbook, `DALIOIL_Trhovy_Cennik_Reklamy_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Kod_Nosica',
      'Kod_Stanice',
      'Nazov_Stanice',
      'Mesto',
      'Region',
      'Typ_Tahu',
      'Dotknuta_Komunikacia',
      'Intenzita_Dopravy_Rozsah',
      'Intenzita_AADT',
      'Zdroj_Scitania',
      'Denna_Navstevnost_Blocky',
      'Mesacna_Navstevnost_Pokladna',
      'Zona',
      'Rozmer_cm',
      'Osvetlenie',
      'Mesacna_Trhova_Cena_EUR',
      'Denna_Cena_EUR',
      'CPT_EUR',
      'Status',
    ];

    const rows = filteredAds.map((ad) => {
      const st = stationMap.get(ad.stationId);
      return [
        ad.id,
        st?.stationCode || '',
        `"${st?.name || ''}"`,
        `"${st?.city || ''}"`,
        st ? regions[st.region]?.shortName : '',
        `"${st?.roadType || ''}"`,
        `"${st?.affectedRoad || ''}"`,
        `"${st?.trafficRange || ''}"`,
        st?.trafficIntensityAADT || '',
        `"${st?.trafficSource || ''}"`,
        Math.round((st?.monthlyVisitsCashier || 0) / 30),
        st?.monthlyVisitsCashier || 0,
        `"Zóna ${ad.zoneNumber || ''}"`,
        `"${ad.dimensions}"`,
        `"${ad.illumination}"`,
        ad.monthlyPriceEur,
        ad.dailyPriceEur || Math.round((ad.monthlyPriceEur / 30) * 100) / 100,
        ad.cpmPriceEur || 1.45,
        ad.status === 'free' ? 'Voľná' : ad.status === 'expiring' ? 'Končí zmluva' : 'Obsadená',
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DALIOIL_Cennik_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="market-pricing-modal"
        className="w-full max-w-6xl bg-white dark:bg-[#10141d] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#151c28] to-slate-900 text-white border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Trhové ceny reklamných priestorov DALIOIL</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Konkurencieschopný cenník 2026
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  576 nosičov / 48 prevádzok
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
                Reálne, transparentné trhové nacenenie pri zemi (35 € – 290 € / mesiac, resp. od 1,15 € / deň). Žiadne prestrelené sumy – garantovaný 100% priamy očný kontakt motoristov a zákazníkov.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition border border-slate-700 cursor-pointer shrink-0"
            title="Zavrieť cenník"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-[#0c0f16] border-b border-slate-200 dark:border-gray-800 shrink-0">
          <div className="p-3 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-[11px] font-bold">
              <span>Priemerná trhová cena</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.avg} € <span className="text-xs font-normal text-slate-400">/ mesiac</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              cca {metrics.avgDaily.toFixed(2)} € / deň
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-[11px] font-bold">
              <span>Cenové rozpätie siete</span>
              <Tag className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.min} € – {metrics.max} €
            </div>
            <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              Najnižšia: WC / kompresor • Max: Totem D1
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-[11px] font-bold">
              <span>Priemerný CPT (na 1000 videní)</span>
              <Eye className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              ~{metrics.avgCpm.toFixed(2)} €
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Až o 60 % výhodnejšie než bežný billboard
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 text-[11px] font-bold">
              <span>Hodnota OOH inventára siete</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.totalVal.toLocaleString('sk-SK')} € <span className="text-xs font-normal text-slate-400">/ mes.</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              576 plôch na 48 strategických bodoch
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-[#10141d] px-4 shrink-0 overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('zones')}
              className={`py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'zones'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Prehľad 12 zón & Cenové rozpätia</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4 text-emerald-500" />
              <span>Cenník všetkých nosičov</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-gray-800 text-slate-800 dark:text-gray-200">
                {filteredAds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'benchmark'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-amber-500" />
              <span>Porovnanie s OOH trhom SR</span>
            </button>

            <button
              onClick={() => setActiveTab('discounts')}
              className={`py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'discounts'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Percent className="w-4 h-4 text-purple-500" />
              <span>Zľavy a balíky pre klientov</span>
            </button>
          </div>

          <div className="flex items-center gap-2 py-2">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Stiahnuť oficiálny cenník v Exceli (XLSX)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel cenník</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition flex items-center gap-1 border border-slate-200 dark:border-gray-700 cursor-pointer"
              title="Stiahnuť cenník ako CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 12 Zones Overview & Price Ranges */}
        {activeTab === 'zones' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/60 dark:bg-transparent text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white text-sm block">
                  Metodika tvorby cien siete DALIOIL: Držme sa pri zemi, žiadne premrštené sumy
                </strong>
                <p className="text-slate-600 dark:text-gray-300 mt-1 leading-relaxed">
                  Trhové ceny sú nastavené tak, aby boli mimoriadne atraktívne pre lokálnych podnikateľov, gastroprevádzky a regionálne značky (od 35 €/mesiac), ale aj pre veľké celoslovenské FMCG a automotive kampane. Cena sa odvíja od typu nosiča, bonity dopravného ťahu (+25% diaľnica D1/R1, +15% mestá, -15% vidiecke ČS), reálnej návštevnosti pokladne a prítomnosti LED/nočného podsvietenia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {ZONE_DEFINITIONS.map((zoneDef) => {
                const priceInfo = ZONE_MARKET_PRICING[zoneDef.zoneNumber] || {
                  basePriceEur: 100,
                  minPriceEur: 70,
                  maxPriceEur: 150,
                  exposureTime: '2 – 5 min',
                  marketBenchmark: 'Trhová cena OOH',
                  competitivenessNote: 'Férová trhová cena',
                };

                const minDaily = (priceInfo.minPriceEur / 30).toFixed(2);
                const maxDaily = (priceInfo.maxPriceEur / 30).toFixed(2);

                return (
                  <div
                    key={zoneDef.zoneNumber}
                    className="p-4 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-2xs flex flex-col justify-between hover:border-emerald-500/50 transition space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-gray-800/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0"
                            style={{ backgroundColor: zoneDef.accentColor }}
                          >
                            {zoneDef.zoneNumber}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
                              {zoneDef.shortName}
                            </h4>
                            <span className="text-[10px] text-slate-400 dark:text-gray-500">
                              {zoneDef.categoryLabel}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                            {priceInfo.basePriceEur} € <span className="text-[10px] text-slate-400 font-normal">/ mes.</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            základná sadzba
                          </span>
                        </div>
                      </div>

                      {/* Price Range & Daily rates */}
                      <div className="mt-2.5 p-2 rounded-lg bg-slate-50 dark:bg-[#18202d] border border-slate-200/60 dark:border-gray-800 flex justify-between items-center text-[11px]">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Rozpätie siete</span>
                          <strong className="text-slate-800 dark:text-gray-200">
                            {priceInfo.minPriceEur} € – {priceInfo.maxPriceEur} € / mes.
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Denná cena</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {minDaily} € – {maxDaily} € / deň
                          </span>
                        </div>
                      </div>

                      {/* Exposure & formats */}
                      <div className="mt-2.5 space-y-1 text-[11px] text-slate-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Doba kontaktu: <strong>{priceInfo.exposureTime}</strong></span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-gray-400 italic">
                          {zoneDef.typicalDimensions} • {zoneDef.illuminationType}
                        </div>
                      </div>

                      {/* Benchmark & Competitiveness */}
                      <div className="mt-2.5 p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-[10px] text-amber-900 dark:text-amber-200 leading-snug">
                        <strong>Trhový benchmark:</strong> {priceInfo.marketBenchmark}
                        <div className="text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                          ✓ {priceInfo.competitivenessNote}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-gray-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        48 staníc disponuje touto zónou
                      </span>
                      <button
                        onClick={() => {
                          setSelectedZoneFilter(zoneDef.zoneNumber);
                          setActiveTab('catalog');
                        }}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Zobraziť plochy ({adSpaces.filter((a) => a.zoneNumber === zoneDef.zoneNumber).length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Full Catalog Table with Search & Filters */}
        {activeTab === 'catalog' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs bg-slate-50/50 dark:bg-transparent">
            {/* Filter Bar */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-2xs space-y-3">
              <div className="flex flex-col md:flex-row gap-2.5 items-center justify-between">
                {/* Search query */}
                <div className="relative w-full md:w-80">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hľadať stanicu, obec, kód nosiča..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-gray-700 text-xs text-slate-800 dark:text-gray-200 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Zone Filter */}
                  <select
                    value={selectedZoneFilter}
                    onChange={(e) => setSelectedZoneFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-gray-700 text-xs text-slate-700 dark:text-gray-300 font-medium"
                  >
                    <option value="all">Všetkých 12 zón</option>
                    {ZONE_DEFINITIONS.map((z) => (
                      <option key={z.zoneNumber} value={z.zoneNumber}>
                        Zóna {z.zoneNumber}: {z.shortName}
                      </option>
                    ))}
                  </select>

                  {/* Region Filter */}
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-gray-700 text-xs text-slate-700 dark:text-gray-300 font-medium"
                  >
                    <option value="all">Všetky regióny</option>
                    {Object.values(regions).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>

                  {/* Road Type Filter */}
                  <select
                    value={selectedRoadType}
                    onChange={(e) => setSelectedRoadType(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-gray-700 text-xs text-slate-700 dark:text-gray-300 font-medium"
                  >
                    <option value="all">Všetky typy ťahov</option>
                    <option value="Diaľnica D1/R1">Diaľnica D1/R1 (+25%)</option>
                    <option value="Mestská lokalita">Mestská lokalita (+15%)</option>
                    <option value="Tranzit 1. triedy">Tranzit 1. triedy (Štandard)</option>
                    <option value="Vidiecka / Regionálna">Vidiecka / Regionálna (-15%)</option>
                  </select>

                  {/* Price Range Filter */}
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#18202d] border border-slate-200 dark:border-gray-700 text-xs text-slate-700 dark:text-gray-300 font-medium"
                  >
                    <option value="all">Všetky ceny</option>
                    <option value="under75">Do 75 €/mes. (Dostupné)</option>
                    <option value="75to150">75 € – 150 €/mes. (Stred)</option>
                    <option value="150to220">150 € – 220 €/mes. (Prémiové)</option>
                    <option value="over220">Nad 220 €/mes. (Vlajkové)</option>
                  </select>

                  {/* Only Free toggle */}
                  <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyFree}
                      onChange={(e) => setOnlyFree(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Iba voľné</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Catalog Table */}
            <div className="rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-2xs bg-white dark:bg-[#131924]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-[#151b27] text-slate-600 dark:text-gray-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-gray-800">
                    <tr>
                      <th className="p-2.5">Kód nosiča</th>
                      <th
                        className="p-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                        onClick={() => {
                          setSortField('station');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Stanica & Lokalita</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th
                        className="p-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                        onClick={() => {
                          setSortField('zone');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Zóna & Nosič</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-2.5">Rozmery & Typ</th>
                      <th
                        className="p-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                        onClick={() => {
                          setSortField('price');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Mesačná cena</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-2.5">Denná sadzba</th>
                      <th
                        className="p-2.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                        onClick={() => {
                          setSortField('cpm');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>CPT (1000 vid.)</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-2.5">Stav</th>
                      <th className="p-2.5 text-right">Akcie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80">
                    {filteredAds.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500 dark:text-gray-400">
                          Nenašli sa žiadne reklamné plochy zodpovedajúce zadaným filtrom.
                        </td>
                      </tr>
                    ) : (
                      filteredAds.map((ad) => {
                        const st = stationMap.get(ad.stationId);
                        const isInPlan = campaignPlanItemIds?.has(ad.id);
                        const reg = st ? regions[st.region] : null;

                        return (
                          <tr
                            key={ad.id}
                            className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition"
                          >
                            <td className="p-2.5 font-mono text-[11px] font-bold text-slate-500 dark:text-gray-400">
                              {ad.id}
                            </td>

                            <td className="p-2.5">
                              <button
                                onClick={() => st && onSelectStationAndOpenDetail(st.id)}
                                className="text-left font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline cursor-pointer block"
                              >
                                {st?.name}
                              </button>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5 flex-wrap">
                                {reg && (
                                  <span
                                    className="px-1.5 py-0.2 rounded text-[9px] font-bold"
                                    style={{
                                      backgroundColor: `${reg.color}15`,
                                      color: reg.color,
                                    }}
                                  >
                                    {reg.shortName}
                                  </span>
                                )}
                                {st?.affectedRoad ? (
                                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                    {st.affectedRoad}
                                  </span>
                                ) : (
                                  <span>{st?.roadType || 'Tranzit'}</span>
                                )}
                                {st?.trafficRange && (
                                  <span className="font-mono text-[9px] text-slate-400 dark:text-gray-500" title={`Intenzita dopravy: ${st.trafficRange} voz./24h (CSD)`}>
                                    • {st.trafficRange}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-2.5">
                              <div className="font-bold text-slate-800 dark:text-gray-200">
                                {ad.side}
                              </div>
                              <span className="text-[10px] text-slate-500">
                                Zóna {ad.zoneNumber}: {ad.type}
                              </span>
                            </td>

                            <td className="p-2.5 text-slate-600 dark:text-gray-300">
                              <div className="font-mono">{ad.dimensions}</div>
                              <span className="text-[10px] text-slate-400 truncate block max-w-[120px]">
                                {ad.illumination}
                              </span>
                            </td>

                            <td className="p-2.5">
                              <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                                {ad.monthlyPriceEur} €
                              </div>
                              <span className="text-[10px] text-slate-400">/ mesiac</span>
                            </td>

                            <td className="p-2.5 font-mono font-semibold text-slate-700 dark:text-gray-300">
                              {(ad.dailyPriceEur || Math.round((ad.monthlyPriceEur / 30) * 100) / 100).toFixed(2)} € <span className="text-[10px] font-normal text-slate-400">/ deň</span>
                            </td>

                            <td className="p-2.5">
                              <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs">
                                {(ad.cpmPriceEur || 1.45).toFixed(2)} €
                              </span>
                            </td>

                            <td className="p-2.5">
                              {ad.status === 'free' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                                  Voľná
                                </span>
                              ) : ad.status === 'expiring' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                                  Končí zmluva
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300">
                                  Obsadená
                                </span>
                              )}
                            </td>

                            <td className="p-2.5 text-right space-x-1 whitespace-nowrap">
                              {onToggleCampaignPlanItem && st && (
                                <button
                                  onClick={() => onToggleCampaignPlanItem(ad, st)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    isInPlan
                                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-2xs'
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs'
                                  }`}
                                  title={isInPlan ? 'Odobrať z mediaplánu' : 'Pridať do mediaplánu'}
                                >
                                  {isInPlan ? '✓ V pláne' : '+ Pridať'}
                                </button>
                              )}

                              <button
                                onClick={() => st && onSelectStationAndOpenDetail(st.id)}
                                className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition cursor-pointer"
                                title="Otvoriť detail stanice"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#111622] border-t border-slate-200 dark:border-gray-800 flex justify-between items-center text-xs text-slate-500 dark:text-gray-400">
                <span>Zobrazených <strong>{filteredAds.length}</strong> z celkovo {adSpaces.length} reklamných plôch</span>
                <span className="font-mono">Všetky ceny sú bez DPH v zmysle platných obchodných podmienok DALIOIL</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Market Benchmark & Competitiveness */}
        {activeTab === 'benchmark' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs bg-slate-50/50 dark:bg-transparent">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-emerald-600/10 border border-emerald-300 dark:border-emerald-800/40">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Prečo sú trhové ceny DALIOIL vysoko konkurencieschopné voči bežnému OOH trhu?</span>
              </h3>
              <p className="text-slate-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                Tradičné agentúrne billboardy pri cestách často trpia krátkym časom kontaktu (vodič okolo nich preletí rýchlosťou 90 km/h za 2 sekundy) a vysokou cenou (350 € – 650 €/mesiac). Sieť DALIOIL ponúka priame cielené nosiče s garantovaným kontaktom počas tankovania a platenia (3 až 10 minút) za zlomkovú cenu.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-2xs bg-white dark:bg-[#131924]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-[#151b27] text-slate-600 dark:text-gray-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-gray-800">
                  <tr>
                    <th className="p-3">Typ reklamného média</th>
                    <th className="p-3">Bežná trhová cena (SR)</th>
                    <th className="p-3">Cena DALIOIL</th>
                    <th className="p-3">Čas expozície (kontakt)</th>
                    <th className="p-3">CPT (Cena / 1 000 videní)</th>
                    <th className="p-3">Konkurenčná výhoda DALIOIL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80">
                  <tr className="bg-emerald-50/30 dark:bg-emerald-950/10">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      <div>Príjazd & Vjazdový totem</div>
                      <span className="text-[10px] text-slate-400 font-normal">Zóna 1 DALIOIL vs. Billboard 5×2,4 m</span>
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold line-through">
                      350 € – 600 € / mes.
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      150 € – 290 € / mes.
                    </td>
                    <td className="p-3">5 – 15 sekúnd (vjazd)</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">~1,80 €</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">
                      Úspora 50%, priamo navádza do prevádzky, LED osvetlené v cene.
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/30 dark:bg-emerald-950/10">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      <div>Výdajné stojany & Tankovacie ostrovy</div>
                      <span className="text-[10px] text-slate-400 font-normal">Zóna 2 DALIOIL (Nozzle ads / stĺpy)</span>
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold line-through">
                      180 € – 260 € / mes.
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      85 € – 175 € / mes.
                    </td>
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                      3 – 5 minút (100% kontakt)
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-600">~1,20 €</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">
                      Šofér drží pištoľ v ruke a pozerá sa priamo na reklamu bez rušivých vplyvov.
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/30 dark:bg-emerald-950/10">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      <div>Vstup do predajne & Citylight</div>
                      <span className="text-[10px] text-slate-400 font-normal">Zóna 3 DALIOIL vs. Mestský CLV</span>
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold line-through">
                      220 € – 380 € / mes.
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      95 € – 195 € / mes.
                    </td>
                    <td className="p-3">10 – 30 sekúnd</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">~1,50 €</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">
                      Obojstranný zásah všetkých platiacich zákazníkov a návštevníkov bistra.
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/30 dark:bg-emerald-950/10">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      <div>Pokladničná zóna & Digitálna obrazovka</div>
                      <span className="text-[10px] text-slate-400 font-normal">Zóna 4 DALIOIL (DOOH / LCD / POS)</span>
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold line-through">
                      150 € – 300 € / mes.
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      75 € – 160 € / mes.
                    </td>
                    <td className="p-3">1 – 3 minúty pri kase</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">~1,30 €</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">
                      Zákazník má peňaženku v ruke; ideálne pre okamžité impulzné nákupy.
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/30 dark:bg-emerald-950/10">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      <div>Toalety & Ambientné kliprámy</div>
                      <span className="text-[10px] text-slate-400 font-normal">Zóna 5 DALIOIL vs. OC toalety</span>
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold line-through">
                      60 € – 120 € / mes.
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      35 € – 65 € / mes.
                    </td>
                    <td className="p-3">1 – 3 minúty</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">~0,90 €</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">
                      Najnižšia vstupná bariéra (cca 1,15 € / deň), nulové konkurenčné rozptýlenie.
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/30 dark:bg-emerald-950/10">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      <div>Dali Cafe & Kaviarenský kútik</div>
                      <span className="text-[10px] text-slate-400 font-normal">Zóna 6 DALIOIL vs. Gastro promo</span>
                    </td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold line-through">
                      90 € – 180 € / mes.
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      45 € – 85 € / mes.
                    </td>
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                      10 – 25 minút (maximálny relax)
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-600">~1,10 €</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">
                      Solventní manažéri, obchodní zástupcovia a rodiny počas pauzy pri káve.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Discounts & Campaign Packages */}
        {activeTab === 'discounts' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs bg-slate-50/50 dark:bg-transparent">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                Zľavová matica pre dlhodobých partnerov a sieťové kampane
              </h3>
              <p className="text-slate-500 dark:text-gray-400">
                Podporujeme férové, dlhodobé partnerstvá s postupnou zľavou z trhových cien podľa dĺžky a objemu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {DURATION_DISCOUNTS.map((d) => (
                <div
                  key={d.months}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    d.discountPercent > 0
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                      : 'bg-white dark:bg-[#131924] border-slate-200 dark:border-gray-800'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Doba trvania
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {d.months} {d.months === 1 ? 'mesiac' : d.months < 5 ? 'mesiace' : 'mesiacov'}
                    </h4>
                    <div className="mt-3">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {d.discountPercent > 0 ? `-${d.discountPercent} %` : 'Základ'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-2">
                    {d.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Network bundles */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Zvýhodnené marketingové balíky DALIOIL
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#18202d] border border-slate-200/70 dark:border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">„Dominancia Stanice“</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      -20 % zľava
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300">
                    Prenájom 3 a viac zón na jednej konkrétnej prevádzke (napr. Vjazdový totem + Výdajné stojany + Vstup).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#18202d] border border-slate-200/70 dark:border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">„Regionálny Balík“</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      -15 % zľava
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300">
                    Pokrytie všetkých staníc v jednom kraji alebo regióne (Západ, Sever, Stred, Východ).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#18202d] border border-slate-200/70 dark:border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">„Národná Kampaň 48 CS“</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      -25 % zľava
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-gray-300">
                    Celoslovenský zásah na všetkých 48 staniciach pre celonárodné značky, banky a poisťovne.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 dark:bg-[#0c0f16] border-t border-slate-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
            <Info className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Pre konkrétne cenové ponuky a rezervácie kontaktujte príslušného Area manažéra DALIOIL.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Stiahnuť Excel cenník</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-white transition cursor-pointer"
            >
              Zavrieť
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
