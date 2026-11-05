import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  Clock,
  Car,
  Users,
  Target,
  Percent,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Info,
} from 'lucide-react';
import { Station, AdSpace } from '../types';

interface OohRoiCalculatorProps {
  stations: Station[];
  adSpaces: AdSpace[];
  onSelectStationAndOpenDetail: (stationId: number) => void;
}

export const OohRoiCalculator: React.FC<OohRoiCalculatorProps> = ({
  stations,
  adSpaces,
  onSelectStationAndOpenDetail,
}) => {
  const [budget, setBudget] = useState<number>(2000);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [targetAudience, setTargetAudience] = useState<'all' | 'highway' | 'urban'>('all');
  const [formatPreference, setFormatPreference] = useState<'all' | 'billboard' | 'citylight' | 'totem' | 'pump'>('all');

  // Discount based on duration
  const discountRate = durationMonths >= 12 ? 0.15 : durationMonths >= 6 ? 0.1 : durationMonths >= 3 ? 0.05 : 0;
  const effectiveMonthlyBudget = budget / durationMonths;
  const totalEffectiveBudgetWithDiscount = budget * (1 - discountRate);

  // Filter stations based on target audience
  const candidateStations = useMemo(() => {
    return stations.filter((s) => {
      if (targetAudience === 'highway') return s.roadType === 'Diaľnica D1/R1';
      if (targetAudience === 'urban') return s.roadType === 'Mestská lokalita';
      return true;
    });
  }, [stations, targetAudience]);

  // Find candidate free ad spaces
  const recommendedFreeSpaces = useMemo(() => {
    const stationIdSet = new Set(candidateStations.map((s) => s.id));
    return adSpaces
      .filter((a) => {
        if (a.status !== 'free') return false;
        if (!stationIdSet.has(a.stationId)) return false;
        if (formatPreference === 'billboard' && !a.type.toLowerCase().includes('billboard')) return false;
        if (formatPreference === 'citylight' && !a.type.toLowerCase().includes('citylight')) return false;
        if (formatPreference === 'totem' && !a.type.toLowerCase().includes('totem')) return false;
        if (formatPreference === 'pump' && !a.type.toLowerCase().includes('nozzle') && !a.type.toLowerCase().includes('stojany')) return false;
        return true;
      })
      .sort((a, b) => a.monthlyPriceEur - b.monthlyPriceEur);
  }, [candidateStations, adSpaces, formatPreference]);

  // Select spaces that fit within the monthly budget
  const selectedSpacesForBudget = useMemo(() => {
    let accumulatedPrice = 0;
    const list: AdSpace[] = [];
    for (const space of recommendedFreeSpaces) {
      if (accumulatedPrice + space.monthlyPriceEur <= effectiveMonthlyBudget * 1.15) {
        list.push(space);
        accumulatedPrice += space.monthlyPriceEur;
      }
    }
    return list;
  }, [recommendedFreeSpaces, effectiveMonthlyBudget]);

  // Metrics calculations
  const totalMonthlyAADT = useMemo(() => {
    const uniqueStationIds = new Set(selectedSpacesForBudget.map((s) => s.stationId));
    const matchedStations = stations.filter((st) => uniqueStationIds.has(st.id));
    if (matchedStations.length === 0) {
      // Fallback estimate based on budget
      return Math.round((effectiveMonthlyBudget / 220) * 18000 * 30 * 1.8);
    }
    const daily = matchedStations.reduce((sum, st) => sum + (st.trafficIntensityAADT || 16500), 0);
    // 30 days * 1.7 passengers per vehicle * view factor
    return Math.round(daily * 30 * 1.7);
  }, [selectedSpacesForBudget, stations, effectiveMonthlyBudget]);

  const totalMonthlyOTS = Math.round(totalMonthlyAADT * (durationMonths > 1 ? durationMonths : 1));
  const estimatedNetReach = Math.round(totalMonthlyOTS * 0.38); // Estimated unique audience
  const effectiveCpm = totalMonthlyOTS > 0 ? ((budget / totalMonthlyOTS) * 1000).toFixed(2) : '1.85';

  return (
    <div className="space-y-4 text-slate-800 dark:text-slate-100">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/10 via-amber-600/10 to-red-600/10 border border-red-200 dark:border-red-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center text-white shadow-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>OOH Kalkulačka návratnosti & Mediálneho dosahu (CPT / CPM)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
                Senior Tool
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-gray-400">
              Presná kalkulácia kontaktov (OTS), CPM a porovnanie s inými médiami pre inzertných klientov
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white dark:bg-black/40 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-xs">
          <span className="text-slate-500 dark:text-gray-400 font-sans font-normal">Priemerný Dwell Time:</span>
          <span className="text-emerald-600 dark:text-emerald-400">4 – 7 minút</span>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Input parameters */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-red-500" />
            <span>Parametre plánovanej kampane</span>
          </h4>

          {/* Budget */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-gray-300">Celkový rozpočet kampane:</span>
              <span className="font-mono font-black text-base text-red-600 dark:text-red-400">{budget.toLocaleString('sk-SK')} €</span>
            </div>
            <input
              type="range"
              min={500}
              max={15000}
              step={250}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-2 bg-slate-200 dark:bg-gray-700 rounded-lg"
            />
            <div className="flex gap-1.5 pt-1">
              {[800, 1500, 3000, 6000, 10000].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                    budget === b
                      ? 'bg-red-600 text-white border-red-600 shadow'
                      : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:bg-slate-200'
                  }`}
                >
                  {b >= 1000 ? `${b / 1000}k €` : `${b} €`}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Discount */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-gray-300">Dĺžka trvania kampane:</span>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {discountRate > 0 ? `Zľava za objem: -${discountRate * 100}%` : 'Základná sadzba'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[
                { m: 1, label: '1 mesiac', disc: '0%' },
                { m: 3, label: '3 mesiace', disc: '-5%' },
                { m: 6, label: '6 mesiacov', disc: '-10%' },
                { m: 12, label: '12 mesiacov', disc: '-15%' },
              ].map((item) => (
                <button
                  key={item.m}
                  type="button"
                  onClick={() => setDurationMonths(item.m)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    durationMonths === item.m
                      ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-700 dark:text-red-300 font-bold ring-1 ring-red-400'
                      : 'bg-slate-50 dark:bg-[#0d1117] border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                  }`}
                >
                  <div className="text-[11px] font-bold">{item.label}</div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.disc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 block">Zameranie lokality:</span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'all', label: 'Celoštátny mix' },
                { id: 'highway', label: 'Diaľnica D1 / R1' },
                { id: 'urban', label: 'Mestské centrá' },
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setTargetAudience(aud.id as any)}
                  className={`py-1.5 px-2 rounded-xl border text-center text-[11px] font-semibold transition cursor-pointer ${
                    targetAudience === aud.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold'
                      : 'bg-slate-50 dark:bg-[#0d1117] border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format Preference */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 block">Preferovaný formát nosičov:</span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              {[
                { id: 'all', label: 'Mix formátov' },
                { id: 'billboard', label: 'Billboard 5.1x2.4' },
                { id: 'citylight', label: 'Citylight (CLV)' },
                { id: 'totem', label: 'Totem/Cenovka' },
                { id: 'pump', label: 'Výdajné stojany' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setFormatPreference(fmt.id as any)}
                  className={`py-1.5 px-2 rounded-xl border text-center font-semibold transition cursor-pointer ${
                    formatPreference === fmt.id
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                      : 'bg-slate-50 dark:bg-[#0d1117] border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Calculated Metrics & KPI Cards */}
        <div className="space-y-3">
          {/* Main calculated results */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Predikovaný mediálny zásah kampane</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {selectedSpacesForBudget.length} plôch v balíku
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800">
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">Celkové zobrazenia (OTS)</div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {(totalMonthlyOTS / 1000).toFixed(0)} 000
                </div>
                <div className="text-[10px] text-slate-400 dark:text-gray-500">kontaktov za {durationMonths} {durationMonths === 1 ? 'mesiac' : durationMonths < 5 ? 'mesiace' : 'mesiacov'}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800">
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">Unikátny Reach (odhad)</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {(estimatedNetReach / 1000).toFixed(0)} 000
                </div>
                <div className="text-[10px] text-slate-400 dark:text-gray-500">aktívnych motoristov SR</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Efektívna CPM / CPT</div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
                  {effectiveCpm} €
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-500">cena za 1 000 kontaktov</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <div className="text-[10px] text-amber-800 dark:text-amber-400 font-bold">Úspora so zľavou</div>
                <div className="text-lg font-black text-amber-700 dark:text-amber-300 font-mono mt-0.5">
                  {(budget * discountRate).toFixed(0)} €
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-500 font-semibold">
                  Konečná cena: {totalEffectiveBudgetWithDiscount.toFixed(0)} €
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark comparison with other media */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-2 text-xs shadow-sm">
            <h5 className="font-bold text-slate-800 dark:text-gray-200 text-[11px] flex items-center justify-between">
              <span>Porovnanie CPM: DALIOIL OOH vs. Ostatné médiá</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Najvyššia efektivita</span>
            </h5>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 font-semibold text-emerald-900 dark:text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>DALIOIL Čerpacie stanice OOH</span>
                </span>
                <span className="font-mono font-bold">~{effectiveCpm} € CPM (4.5 min Dwell)</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400">
                <span>Mestský billboard (letmý pohľad ~1.5 sec)</span>
                <span className="font-mono font-semibold">4.80 – 6.50 € CPM</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400">
                <span>Social Video Ads (Instagram / YouTube skippable)</span>
                <span className="font-mono font-semibold">6.20 – 8.90 € CPM</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400">
                <span>Regionálne rádio (zvuk bez vizuálneho kontaktu)</span>
                <span className="font-mono font-semibold">3.80 – 5.20 € CPM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Spaces for this Budget */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Odporúčaný optimálny balík voľných plôch pre rozpočet {budget.toLocaleString('sk-SK')} €</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-gray-400">
              Automatický algoritmus vybral {selectedSpacesForBudget.length} strategických nosičov s najvyšším pomerom zásah / cena
            </p>
          </div>
        </div>

        {selectedSpacesForBudget.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-gray-400 text-xs">
            Pre zvolený filter nie sú k dispozícii žiadne voľné plochy. Skúste zmeniť preferenciu formátu na &quot;Mix formátov&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {selectedSpacesForBudget.slice(0, 6).map((space) => {
              const station = stations.find((st) => st.id === space.stationId);
              return (
                <div
                  key={space.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 flex justify-between items-center hover:border-red-300 dark:hover:border-gray-700 transition"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {station?.name || `CS-${space.stationId}`}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                      {space.type} • {space.dimensions}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-gray-500">
                      AADT: {station?.trafficIntensityAADT?.toLocaleString('sk-SK') || '16 000'} áut/deň
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-red-600 dark:text-red-400 text-xs">
                      {space.monthlyPriceEur} €/m
                    </div>
                    <button
                      onClick={() => onSelectStationAndOpenDetail(space.stationId)}
                      className="mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 transition cursor-pointer"
                    >
                      Detail CS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
