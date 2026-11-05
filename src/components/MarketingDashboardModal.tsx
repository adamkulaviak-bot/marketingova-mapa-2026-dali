import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Users,
  Car,
  Building2,
  ChevronRight,
  Receipt,
  Layers,
  MapPin,
  CheckCircle2,
  FolderOpen,
  Table,
} from 'lucide-react';
import { Station, AdSpace, RegionInfo, RegionId } from '../types';
import { RetailCrossPromo } from './RetailCrossPromo';
import { getCarrierAuditsSummary } from '../data/adCarrierAuditData';

interface MarketingDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  adSpaces: AdSpace[];
  regions: Record<RegionId, RegionInfo>;
  onSelectStationAndOpenDetail: (stationId: number) => void;
  onOpenCarrierAudit?: () => void;
}

export const MarketingDashboardModal: React.FC<MarketingDashboardModalProps> = ({
  isOpen,
  onClose,
  stations,
  adSpaces,
  regions,
  onSelectStationAndOpenDetail,
  onOpenCarrierAudit,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'formats' | 'regions' | 'clients' | 'renewals' | 'crossPromo'
  >('overview');

  // Global inventory calculations
  const totalSpaces = adSpaces.length;
  const freeSpaces = adSpaces.filter((a) => a.status === 'free').length;
  const occupiedSpaces = adSpaces.filter((a) => a.status === 'occupied').length;
  const expiringSpaces = adSpaces.filter((a) => a.status === 'expiring').length;
  const reservedSpaces = adSpaces.filter((a) => a.status === 'reserved').length;

  const carrierSummary = useMemo(() => getCarrierAuditsSummary(), []);

  const occupancyRate = totalSpaces > 0 ? Math.round(((occupiedSpaces + expiringSpaces) / totalSpaces) * 100) : 0;

  // Realistic Market Financials
  const totalMonthlyInventoryValue = useMemo(() => {
    return adSpaces.reduce((sum, a) => sum + (a.monthlyPriceEur || 0), 0);
  }, [adSpaces]);

  const currentMonthlyRevenue = useMemo(() => {
    return adSpaces
      .filter((a) => a.status === 'occupied' || a.status === 'expiring')
      .reduce((sum, a) => sum + (a.monthlyPriceEur || 0), 0);
  }, [adSpaces]);

  const potentialMonthlyRevenue = useMemo(() => {
    return adSpaces
      .filter((a) => a.status === 'free')
      .reduce((sum, a) => sum + (a.monthlyPriceEur || 0), 0);
  }, [adSpaces]);

  const averageCarrierPrice = totalSpaces > 0 ? Math.round(totalMonthlyInventoryValue / totalSpaces) : 0;

  // Estimated reach based on station footfall & traffic
  const totalDailyTrafficAADT = stations.reduce((sum, s) => sum + (s.trafficIntensityAADT || 16000), 0);
  const totalMonthlyCashierVisits = stations.reduce((sum, s) => sum + (s.monthlyVisitsCashier || 22000), 0);

  // Group by Ad Formats
  const formatStats = useMemo(() => {
    const map = new Map<string, { total: number; free: number; occupied: number; expiring: number; totalPrice: number }>();

    adSpaces.forEach((ad) => {
      const entry = map.get(ad.type) || { total: 0, free: 0, occupied: 0, expiring: 0, totalPrice: 0 };
      entry.total += 1;
      entry.totalPrice += (ad.monthlyPriceEur || 0);
      if (ad.status === 'free') entry.free += 1;
      if (ad.status === 'occupied') entry.occupied += 1;
      if (ad.status === 'expiring') entry.expiring += 1;
      map.set(ad.type, entry);
    });

    return Array.from(map.entries()).map(([type, data]) => {
      const occ = data.total > 0 ? Math.round(((data.occupied + data.expiring) / data.total) * 100) : 0;
      const share = totalSpaces > 0 ? Math.round((data.total / totalSpaces) * 100) : 0;
      const avgPrice = data.total > 0 ? Math.round(data.totalPrice / data.total) : 0;
      return { type, ...data, occ, share, avgPrice };
    }).sort((a, b) => b.total - a.total);
  }, [adSpaces, totalSpaces]);

  // Group by Region
  const regionStats = useMemo(() => {
    return Object.values(regions).map((reg) => {
      const regStationIds = stations.filter((s) => s.region === reg.id).map((s) => s.id);
      const regAds = adSpaces.filter((a) => regStationIds.includes(a.stationId));
      const total = regAds.length;
      const free = regAds.filter((a) => a.status === 'free').length;
      const occupied = regAds.filter((a) => a.status === 'occupied').length;
      const expiring = regAds.filter((a) => a.status === 'expiring').length;
      const occ = total > 0 ? Math.round(((occupied + expiring) / total) * 100) : 0;
      const totalVisits = stations
        .filter((s) => s.region === reg.id)
        .reduce((sum, s) => sum + (s.monthlyVisitsCashier || 20000), 0);

      return {
        ...reg,
        stationCount: regStationIds.length,
        totalAds: total,
        freeAds: free,
        occupiedAds: occupied,
        expiringAds: expiring,
        occ,
        totalVisits,
      };
    });
  }, [regions, stations, adSpaces]);

  // Top clients
  const clientStats = useMemo(() => {
    const map = new Map<string, { spacesCount: number; campaigns: Set<string>; types: Set<string> }>();

    adSpaces.forEach((ad) => {
      if (!ad.client) return;
      const entry = map.get(ad.client) || { spacesCount: 0, campaigns: new Set(), types: new Set() };
      entry.spacesCount += 1;
      if (ad.campaign) entry.campaigns.add(ad.campaign);
      entry.types.add(ad.type);
      map.set(ad.client, entry);
    });

    return Array.from(map.entries())
      .map(([client, data]) => ({
        client,
        spacesCount: data.spacesCount,
        campaignsCount: data.campaigns.size,
        campaigns: Array.from(data.campaigns),
        types: Array.from(data.types),
      }))
      .sort((a, b) => b.spacesCount - a.spacesCount);
  }, [adSpaces]);

  // Renewal Radar (expiring within 14 days)
  const expiringAdsList = useMemo(() => {
    return adSpaces
      .filter((a) => a.status === 'expiring' || (a.daysLeft !== undefined && a.daysLeft !== null && a.daysLeft <= 14 && a.daysLeft >= 0))
      .sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0));
  }, [adSpaces]);

  // Top 5 Flagship Stations by Real Cashier Footfall
  const topTrafficStations = useMemo(() => {
    return [...stations]
      .filter((s) => !s.isTerminal && s.monthlyVisitsCashier)
      .sort((a, b) => (b.monthlyVisitsCashier || 0) - (a.monthlyVisitsCashier || 0))
      .slice(0, 5);
  }, [stations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="marketing-dashboard-modal"
        className="w-full max-w-5xl bg-white dark:bg-[#10141d] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-gradient-to-r dark:from-[#151c28] dark:via-[#121822] dark:to-[#151c28] border-b border-slate-200 dark:border-gray-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-950/50">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Marketingový & Manažérsky Dashboard siete DALIOIL</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Senior OOH & Retail manažment: {stations.length} lokalít siete ({stations.filter(s => !s.isTerminal).length} ČS, {stations.filter(s => s.isTerminal).length} terminálov) • {totalSpaces} reklamných nosičov
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-gray-800 transition border border-slate-200 dark:border-gray-700/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive KPI Ribbon */}
        <div className="p-4 bg-slate-50 dark:bg-[#0d1117] border-b border-slate-200 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 shrink-0 text-xs">
          <div className="p-2.5 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400">Celková kapacita</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {totalSpaces} plôch
            </div>
            <div className="text-[10px] text-slate-500 dark:text-gray-400">v celej sieti SR</div>
          </div>

          <div className="p-2.5 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400">Obsadenosť siete</div>
            <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
              {occupancyRate}%
            </div>
            <div className="text-[10px] text-slate-500 dark:text-gray-400">{occupiedSpaces + expiringSpaces} aktívnych plôch</div>
          </div>

          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Voľné na kampaň</div>
            <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
              {freeSpaces} plôch
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-500">ihneď k dispozícii</div>
          </div>

          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Renewal Radar</div>
            <div className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-400 font-mono mt-0.5">
              {expiringAdsList.length} nosičov
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-500">končí do 14 dní</div>
          </div>

          <div className="p-2.5 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400">Denný Reach (AADT)</div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {Math.round(totalDailyTrafficAADT / 1000)} tis.
            </div>
            <div className="text-[10px] text-slate-500 dark:text-gray-400">áut denne na ťahoch</div>
          </div>

          <div className="p-2.5 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 rounded-xl shadow-xs">
            <div className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300">Denné bločky (sieť)</div>
            <div className="text-base sm:text-lg font-black text-sky-700 dark:text-sky-300 mt-0.5">
              {Math.round(totalMonthlyCashierVisits / 30).toLocaleString('sk-SK')}
            </div>
            <div className="text-[10px] text-sky-600 dark:text-sky-400">bločkov denne (~{Math.round(totalMonthlyCashierVisits / 1000)} tis./mes.)</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-[#10141d] px-4 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-red-500 text-red-600 dark:text-white bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            Prehľad & KPI
          </button>
          <button
            onClick={() => setActiveTab('formats')}
            className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'formats'
                ? 'border-red-500 text-red-600 dark:text-white bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            Typy nosičov ({formatStats.length})
          </button>
          <button
            onClick={() => setActiveTab('regions')}
            className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'regions'
                ? 'border-red-500 text-red-600 dark:text-white bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            Regióny SR (4 oblasti)
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'clients'
                ? 'border-red-500 text-red-600 dark:text-white bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            Inzerenti ({clientStats.length})
          </button>
          <button
            onClick={() => setActiveTab('renewals')}
            className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'renewals'
                ? 'border-amber-500 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20'
                : 'border-transparent text-amber-600 dark:text-amber-400/80 hover:text-amber-700 dark:hover:text-amber-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Renewal Radar ({expiringAdsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('crossPromo')}
            className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'crossPromo'
                ? 'border-red-500 text-red-600 dark:text-white bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Retail & Sezónny plán</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs bg-slate-50/50 dark:bg-transparent">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Carrier Data Audit Banner (Terénny zber dát nosičov 2026) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-red-500/10 to-transparent dark:from-amber-950/40 dark:via-red-950/30 border border-amber-500/30 dark:border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 text-white shadow-xs shrink-0">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">
                        Oficiálny terénny audit: Zber dát nosičov & stojanov PHM 2026
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        {carrierSummary.totalAuditedStations} prevádzok
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                      Evidovaných <strong>{carrierSummary.totalFuelDispensers}</strong> výdajných stojanov PHM • <strong>{carrierSummary.totalCarriersRecorded}</strong> reklamných nosičov v 12 zónach (monitory, billboardy, bannery)
                    </p>
                  </div>
                </div>

                {onOpenCarrierAudit && (
                  <button
                    onClick={onOpenCarrierAudit}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Zobraziť maticu zberu dát</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Capacity breakdown */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Štruktúra obsadenosti reklamnej siete</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">
                      Spolu: {totalSpaces} nosičov
                    </span>
                  </h3>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-4 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-red-600 transition-all"
                        style={{ width: `${(occupiedSpaces / totalSpaces) * 100}%` }}
                        title={`Obsadené: ${occupiedSpaces} plôch`}
                      />
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${(expiringSpaces / totalSpaces) * 100}%` }}
                        title={`Končiace zmluvy: ${expiringSpaces} plôch`}
                      />
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${(freeSpaces / totalSpaces) * 100}%` }}
                        title={`Voľné kapacity: ${freeSpaces} plôch`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-gray-400 pt-1 flex-wrap gap-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-red-600"></span>
                        <span>Aktívne obsadené: <strong>{occupiedSpaces}</strong></span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                        <span>Končiace zmluvy: <strong>{expiringSpaces}</strong></span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                        <span>Voľné na predaj: <strong>{freeSpaces}</strong></span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-gray-800 text-[11px] text-slate-700 dark:text-gray-300 space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-white">Manažérske zhrnutie pre marketing:</div>
                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                      Sieť disponuje <strong>{freeSpaces} voľnými plochami</strong> s okamžitou dostupnosťou pre novú inzerciu a kampaňové balíky. Zmluvy na <strong>{expiringSpaces} nosičoch</strong> končia v najbližších dvoch týždňoch.
                    </p>
                  </div>
                </div>

                {/* Traffic & Impact overview */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>Zásah a frekvencia kontaktov (Reach)</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">AADT + Retail</span>
                  </h3>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-gray-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Denný prejazd áut (AADT)</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              CSD 2022/2023
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-gray-400">Oficiálne sčítanie Slovenská správa ciest (CSD) • Totemy a exteriér</div>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-sm text-slate-800 dark:text-gray-200">
                        {totalDailyTrafficAADT.toLocaleString('sk-SK')} voz./deň
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-gray-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Mesačné nákupy na pokladniach</div>
                          <div className="text-[10px] text-slate-500 dark:text-gray-400">Interiér shopu, dvere, kávomaty, stojany</div>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {totalMonthlyCashierVisits.toLocaleString('sk-SK')} zákazníkov / m
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Market Revenue & Pricing Overview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent border border-emerald-300 dark:border-emerald-800/60 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Trhová hodnota a finančný potenciál OOH siete DALIOIL (576 nosičov)
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        Realistické trhové ceny odvodené z bonity ťahu, intenzity dopravy a reálnych bločkov pokladne
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Konkurencieschopný cenník 2026
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-3 bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Hodnota inventára</span>
                    <strong className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {totalMonthlyInventoryValue.toLocaleString('sk-SK')} €
                    </strong>
                    <span className="text-[10px] text-slate-500 block">mesačne (všetkých 576 plôch)</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Generované tržby</span>
                    <strong className="text-lg font-black text-red-600 dark:text-red-400 font-mono">
                      {currentMonthlyRevenue.toLocaleString('sk-SK')} €
                    </strong>
                    <span className="text-[10px] text-slate-500 block">z obsadených plôch</span>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">Voľný potenciál</span>
                    <strong className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {potentialMonthlyRevenue.toLocaleString('sk-SK')} €
                    </strong>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-500 block">k okamžitému predaju</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Priemer na nosič</span>
                    <strong className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      ~{averageCarrierPrice} €
                    </strong>
                    <span className="text-[10px] text-slate-500 block">/ mes. (~{((averageCarrierPrice / 30)).toFixed(2)} € / deň)</span>
                  </div>
                </div>
              </div>

              {/* Quick Table: Top performing formats */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kľúčové formáty nosičov v sieti</h3>
                  <button
                    onClick={() => setActiveTab('formats')}
                    className="text-red-600 dark:text-red-400 hover:underline text-xs cursor-pointer font-semibold"
                  >
                    Zobraziť všetky formáty ({formatStats.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {formatStats.slice(0, 4).map((f) => (
                    <div key={f.type} className="p-3 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-gray-800 rounded-xl space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs truncate">{f.type}</div>
                      <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                        {f.total} <span className="text-xs font-normal text-slate-400">plôch ({f.share}%)</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-gray-400 pt-1 border-t border-slate-200 dark:border-gray-800/60">
                        <span>Obsadenosť: <strong>{f.occ}%</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{f.free} voľných</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 Flagship ČS podľa reálnej návštevnosti pokladne */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-600/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                      <Receipt className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Top 5 Flagship čerpacích staníc podľa reálnej návštevnosti pokladne
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Audit vydaných dokladov
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {topTrafficStations.map((st, idx) => (
                    <div
                      key={st.id}
                      onClick={() => onSelectStationAndOpenDetail(st.id)}
                      className="p-3 bg-slate-50 dark:bg-black/30 hover:bg-slate-100 dark:hover:bg-gray-800/60 border border-slate-200 dark:border-gray-800 rounded-xl space-y-1.5 transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                          {idx < 3 ? 'Top Traffic' : 'Vysoký ťah'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {st.name}
                      </div>
                      <div className="text-base font-black text-red-600 dark:text-red-400 font-mono">
                        {Math.round((st.monthlyVisitsCashier || 0) / 30).toLocaleString('sk-SK')}
                        <span className="text-[9px] font-normal text-slate-400"> bločkov/deň</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {st.monthlyVisitsCashier?.toLocaleString('sk-SK')} / mesiac • {st.city || st.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FORMATS */}
          {activeTab === 'formats' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/60 text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3">Typ nosiča</th>
                      <th className="p-3 text-center">Spolu kusov</th>
                      <th className="p-3 text-center">Priem. trhová cena</th>
                      <th className="p-3 text-center">Obsadené</th>
                      <th className="p-3 text-center">Voľné</th>
                      <th className="p-3 text-center">Podiel na sieti</th>
                      <th className="p-3 text-center">Vyťaženosť</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-gray-800/70 text-xs">
                    {formatStats.map((f) => (
                      <tr key={f.type} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition">
                        <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                          <span>{f.type}</span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-slate-100">{f.total}</td>
                        <td className="p-3 text-center">
                          <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
                            {f.avgPrice} €
                          </span>
                          <span className="text-[10px] text-slate-400 block font-normal">/ mesiac</span>
                        </td>
                        <td className="p-3 text-center font-mono text-red-600 dark:text-red-400 font-semibold">
                          {f.occupied + f.expiring}
                        </td>
                        <td className="p-3 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {f.free}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-600 dark:text-gray-300">
                          {f.share}%
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              f.occ >= 75
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : f.occ >= 50
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                            }`}
                          >
                            {f.occ}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: REGIONS */}
          {activeTab === 'regions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {regionStats.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: `${reg.color}20`,
                            color: reg.color,
                            borderColor: `${reg.color}50`,
                          }}
                        >
                          {reg.name}
                        </span>
                        <span className="font-mono text-xs text-slate-500 dark:text-gray-400 font-semibold">{reg.stationCount} staníc</span>
                      </div>

                      <div className="pt-1">
                        <div className="text-[11px] text-slate-500 dark:text-gray-400">Denné transakcie (bločky):</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                          {Math.round(reg.totalVisits / 30).toLocaleString('sk-SK')} <span className="text-xs font-normal text-slate-400">/ deň</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">({reg.totalVisits.toLocaleString('sk-SK')} bločkov / mes.)</div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono text-[11px]">
                        <div className="p-1.5 rounded bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-transparent">
                          <div className="text-[9px] text-slate-400 dark:text-gray-500 uppercase">Spolu</div>
                          <div className="font-bold text-slate-800 dark:text-white">{reg.totalAds}</div>
                        </div>
                        <div className="p-1.5 rounded bg-emerald-50 dark:bg-black/30 border border-emerald-200 dark:border-transparent">
                          <div className="text-[9px] text-emerald-700 dark:text-emerald-400 uppercase">Voľné</div>
                          <div className="font-bold text-emerald-700 dark:text-emerald-400">{reg.freeAds}</div>
                        </div>
                        <div className="p-1.5 rounded bg-red-50 dark:bg-black/30 border border-red-200 dark:border-transparent">
                          <div className="text-[9px] text-red-700 dark:text-red-400 uppercase">Obsadené</div>
                          <div className="font-bold text-red-700 dark:text-red-400">{reg.occupiedAds + reg.expiringAds}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-gray-800 text-[11px] text-slate-500 dark:text-gray-400 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-gray-300">{reg.rep.name}</span>
                      <a href={`tel:${reg.rep.phoneRaw}`} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                        {reg.rep.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CLIENTS */}
          {activeTab === 'clients' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/60 text-slate-500 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="p-3">Inzerent (Firma)</th>
                      <th className="p-3 text-center">Počet plôch</th>
                      <th className="p-3">Aktívne kampane</th>
                      <th className="p-3">Typy prenajatých nosičov</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-gray-800/70 text-xs">
                    {clientStats.map((c) => (
                      <tr key={c.client} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition">
                        <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{c.client}</span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-gray-100">
                          {c.spacesCount}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-gray-300 italic">
                          {c.campaigns.slice(0, 2).join(', ')}
                          {c.campaigns.length > 2 && ` (+${c.campaigns.length - 2} ďalšie)`}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-gray-400 text-[11px]">
                          {c.types.slice(0, 3).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: RENEWAL RADAR */}
          {activeTab === 'renewals' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>
                    Nájdených <strong>{expiringAdsList.length} nosičov</strong> so zmluvami končiacimi v
                    najbližších 14 dňoch pripravených na renegociáciu alebo uvoľnenie do predaja.
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-gray-800/80 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
                {expiringAdsList.map((ad) => {
                  const station = stations.find((s) => s.id === ad.stationId);

                  return (
                    <div
                      key={ad.id}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-800/40 transition gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                            {ad.id}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{ad.name}</span>
                          <span className="text-slate-500 dark:text-gray-400">• {station?.name}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-gray-300 flex items-center gap-3 flex-wrap">
                          <span>
                            Formát: <strong>{ad.type}</strong> ({ad.dimensions})
                          </span>
                          <span>•</span>
                          <span>
                            Klient: <strong className="text-amber-600 dark:text-amber-400">{ad.client}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Koniec: <strong className="font-mono text-red-600 dark:text-red-400">{ad.dateEnd}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
                            Zostáva {ad.daysLeft !== undefined && ad.daysLeft !== null ? ad.daysLeft : 7} dní
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectStationAndOpenDetail(ad.stationId);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1 shadow cursor-pointer"
                        >
                          <span>Otvoriť nosič</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: RETAIL CROSS-PROMO & SEASONALITY */}
          {activeTab === 'crossPromo' && (
            <RetailCrossPromo
              stations={stations}
              adSpaces={adSpaces}
              onSelectStationAndOpenDetail={(stId) => {
                onClose();
                onSelectStationAndOpenDetail(stId);
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 dark:bg-[#0d1117] border-t border-slate-200 dark:border-gray-800 flex justify-between items-center shrink-0 text-xs text-slate-500 dark:text-gray-400">
          <span>Celkový inventár siete DALIOIL: {totalSpaces} reklamných nosičov</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 font-semibold rounded-xl transition cursor-pointer"
          >
            Zavrieť prehľad
          </button>
        </div>
      </div>
    </div>
  );
};
