import React, { useState, useMemo } from 'react';
import {
  X,
  Briefcase,
  Trash2,
  Download,
  Send,
  CheckCircle2,
  Calendar,
  Car,
  MapPin,
  Sparkles,
  Printer,
  ExternalLink,
  FolderOpen,
  Camera,
  Layers,
  Users,
  Eye,
  Check,
} from 'lucide-react';
import { CampaignPlanItem } from '../types';
import { downloadFile } from '../utils/exportUtils';
import { getDriveFolderForAd } from '../data/stationPhotoFolders';

interface CampaignPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CampaignPlanItem[];
  onRemoveItem: (adSpaceId: string) => void;
  onClearPlan: () => void;
  onOpenStationDetail: (stationId: number) => void;
}

export const CampaignPlannerModal: React.FC<CampaignPlannerModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearPlan,
  onOpenStationDetail,
}) => {
  const [monthsDuration, setMonthsDuration] = useState<number>(3);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [campaignName, setCampaignName] = useState<string>('');
  const [campaignNotes, setCampaignNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Station counts and audience reach metrics
  const uniqueStationIds = useMemo(() => {
    return Array.from(new Set(items.map((it) => it.station.id)));
  }, [items]);

  const uniqueStations = useMemo(() => {
    const map = new Map<number, (typeof items)[0]['station']>();
    items.forEach((it) => {
      if (!map.has(it.station.id)) {
        map.set(it.station.id, it.station);
      }
    });
    return Array.from(map.values());
  }, [items]);

  const totalDailyTraffic = useMemo(() => {
    return uniqueStations.reduce((sum, st) => sum + (st.trafficIntensityAADT || 16000), 0);
  }, [uniqueStations]);

  const totalMonthlyCashierVisits = useMemo(() => {
    return uniqueStations.reduce((sum, st) => sum + (st.monthlyVisitsCashier || 22000), 0);
  }, [uniqueStations]);

  const cumulativeAudienceOTS = useMemo(() => {
    // 30 days * duration * (AADT * 1.6 passenger factor + cashier footfall)
    const monthlyTotal = Math.round(totalDailyTraffic * 30 * 1.5 + totalMonthlyCashierVisits);
    return monthlyTotal * monthsDuration;
  }, [totalDailyTraffic, totalMonthlyCashierVisits, monthsDuration]);

  // Financial calculations based on realistic competitive market prices
  const monthlySubtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.adSpace.monthlyPriceEur || 0), 0);
  }, [items]);

  const discountPercent = monthsDuration >= 12 ? 15 : monthsDuration >= 6 ? 10 : monthsDuration >= 3 ? 5 : 0;
  const totalFullPrice = monthlySubtotal * monthsDuration;
  const discountAmount = Math.round(totalFullPrice * (discountPercent / 100));
  const finalTotal = totalFullPrice - discountAmount;
  const effectiveMonthlyPrice = Math.round(finalTotal / monthsDuration);
  const averageCpm = cumulativeAudienceOTS > 0 ? Math.round(((finalTotal / cumulativeAudienceOTS) * 1000) * 100) / 100 : 1.45;

  if (!isOpen) return null;

  const handleDownloadPlanCSV = () => {
    const headers = [
      'ID_Plochy',
      'Kod_Stanice',
      'Nazov_Stanice',
      'Mesto',
      'Kraj',
      'Typ_Nosica',
      'Nazov_Nosica',
      'Rozmery_cm',
      'Osvetlenie',
      'Mesacna_Trhova_Cena_EUR',
      'Denna_Cena_EUR',
      'Zona_Fotobanky_1_12',
      'Nazov_Zony_Drive',
      'Google_Drive_Odkaz',
      'Dotknuta_Komunikacia',
      'Intenzita_Dopravy_Rozsah_24h',
      'Denna_Intenzita_AADT',
      'Zdroj_Scitania_Dopravy',
      'Mesacna_Navstevnost_Pokladne',
      'Doba_Trvania_Mesiacov',
      'Celkova_Cena_Bez_Zlavy_EUR',
      'Zlava_Percent',
      'Konecna_Cena_EUR',
    ];

    const rows = items.map((item) => {
      const zoneNum = item.adSpace.zoneNumber || 2;
      const zoneFolder = getDriveFolderForAd(item.station.stationCode, zoneNum, item.adSpace.category);
      const monthlyPrice = item.adSpace.monthlyPriceEur || 0;
      const dailyPrice = item.adSpace.dailyPriceEur || Math.round((monthlyPrice / 30) * 100) / 100;
      const fullPrice = monthlyPrice * monthsDuration;
      const finalPrice = Math.round(fullPrice * (1 - discountPercent / 100));

      return [
        item.adSpace.id,
        item.station.stationCode || `CS-${String(item.station.id).padStart(3, '0')}`,
        `"${item.station.name.replace(/"/g, '""')}"`,
        `"${(item.station.city || '').replace(/"/g, '""')}"`,
        `"${(item.station.kraj || '').replace(/"/g, '""')}"`,
        `"${item.adSpace.type.replace(/"/g, '""')}"`,
        `"${item.adSpace.name.replace(/"/g, '""')}"`,
        `"${item.adSpace.dimensions.replace(/"/g, '""')}"`,
        item.adSpace.illumination,
        monthlyPrice,
        dailyPrice,
        `"Zóna ${zoneNum}"`,
        `"${(zoneFolder?.zoneName || '').replace(/"/g, '""')}"`,
        `"${(zoneFolder?.folderUrl || '').replace(/"/g, '""')}"`,
        `"${(item.station.affectedRoad || item.station.roadType || '').replace(/"/g, '""')}"`,
        `"${(item.station.trafficRange || '').replace(/"/g, '""')}"`,
        item.station.trafficIntensityAADT || 16000,
        `"${(item.station.trafficSource || 'Slovenská správa ciest (CSD 2022/2023)').replace(/"/g, '""')}"`,
        item.station.monthlyVisitsCashier || 22000,
        monthsDuration,
        fullPrice,
        discountPercent,
        finalPrice,
      ];
    });

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    downloadFile(
      csvContent,
      `Mediaplan_DALIOIL_${campaignName ? campaignName.replace(/\s+/g, '_') : 'Kampan'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handlePrintProposal = () => {
    let isInsideIframe = false;
    try {
      isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      isInsideIframe = true;
    }
    
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="sk">
    <head>
      <meta charset="UTF-8">
      <title>Marketingový Mediaplán OOH - DALIOIL Slovensko</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 24px; line-height: 1.4; }
        .toolbar { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 10px; margin-bottom: 20px; }
        .btn { background: #dc2626; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .header { border-bottom: 3px solid #dc2626; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .brand { font-size: 24px; font-weight: 900; color: #dc2626; letter-spacing: -0.5px; }
        .meta { font-size: 13px; color: #64748b; line-height: 1.5; }
        .kpi-row { display: flex; gap: 16px; margin-bottom: 24px; }
        .kpi-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
        .kpi-title { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; }
        .kpi-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .client-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
        .client-box table { width: 100%; font-size: 13px; }
        .client-box td { padding: 4px 0; }
        .client-box td.label { font-weight: bold; width: 180px; color: #475569; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
        table.data-table th { background: #f1f5f9; padding: 10px; text-align: left; border: 1px solid #cbd5e1; font-weight: 700; }
        table.data-table td { padding: 8px 10px; border: 1px solid #e2e8f0; vertical-align: top; }
        .drive-tag { display: inline-block; padding: 2px 6px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; border-radius: 4px; font-weight: bold; font-size: 10px; }
        .conditions { font-size: 11px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        @media print {
          body { margin: 10mm; }
          .toolbar { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="toolbar">
        <div><strong>DALIOIL Mediaplán</strong> • ${items.length} vybraných plôch</div>
        <div style="display: flex; gap: 8px;">
          <button class="btn" onclick="window.print()">🖨️ Vytlačiť / Uložiť ako PDF (Ctrl + P)</button>
          <button class="btn" style="background: #475569;" onclick="window.close()">✕ Zavrieť</button>
        </div>
      </div>

      <div class="header">
        <div>
          <div class="brand">DALIOIL SLOVENSKO</div>
          <div class="meta">Oficiálny mediaplán reklamných plôch a technická špecifikácia siete</div>
        </div>
        <div style="text-align: right;" class="meta">
          <div>Dátum: ${new Date().toLocaleDateString('sk-SK')}</div>
          <div>Stav: Pripravené na rezerváciu</div>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-title">Vybrané nosiče</div>
          <div class="kpi-value">${items.length} plôch</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Zasiahnuté stanice</div>
          <div class="kpi-value">${uniqueStations.length} ČS</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Denný prejazd (AADT)</div>
          <div class="kpi-value">${totalDailyTraffic.toLocaleString('sk-SK')} áut/deň</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Denné nákupy (bločky)</div>
          <div class="kpi-value">${Math.round(totalMonthlyCashierVisits / 30).toLocaleString('sk-SK')} / deň</div>
          <div style="font-size: 10px; color: #64748b; font-family: monospace;">(${totalMonthlyCashierVisits.toLocaleString('sk-SK')} / mesiac)</div>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-title">Mesačná trhová hodnota nosičov</div>
          <div class="kpi-value" style="color: #059669;">${monthlySubtotal.toLocaleString('sk-SK')} € / mes.</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Doba kampane & Zľava</div>
          <div class="kpi-value">${monthsDuration} mes. ${discountPercent > 0 ? `(-${discountPercent} %)` : '(základ)'}</div>
        </div>
        <div class="kpi-card" style="background: #ecfdf5; border-color: #a7f3d0;">
          <div class="kpi-title">Konečný rozpočet kampane</div>
          <div class="kpi-value" style="color: #047857;">${finalTotal.toLocaleString('sk-SK')} € bez DPH</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Efektívny CPT (na 1 000 vid.)</div>
          <div class="kpi-value" style="color: #0284c7;">~${averageCpm.toFixed(2)} €</div>
        </div>
      </div>

      <div class="client-box">
        <table>
          <tr><td class="label">Názov kampane:</td><td><strong>${campaignName || 'OOH Reklamná kampaň 2026'}</strong></td></tr>
          <tr><td class="label">Inzerent / Značka:</td><td><strong>${clientName || 'Záujemca o mediaplán'}</strong></td></tr>
          <tr><td class="label">Kontakt:</td><td>${clientEmail || '–'} ${clientPhone ? `(${clientPhone})` : ''}</td></tr>
          <tr><td class="label">Doba nasadenia:</td><td><strong>${monthsDuration} ${monthsDuration === 1 ? 'mesiac' : monthsDuration < 5 ? 'mesiace' : 'mesiacov'}</strong></td></tr>
          <tr><td class="label">Cenové zhrnutie:</td><td>Základná trhová cena: ${totalFullPrice.toLocaleString('sk-SK')} € | Zľava: -${discountAmount.toLocaleString('sk-SK')} € (${discountPercent}%) | <strong>Konečná suma: ${finalTotal.toLocaleString('sk-SK')} € bez DPH</strong> (cca ${effectiveMonthlyPrice.toLocaleString('sk-SK')} €/mes.)</td></tr>
          ${campaignNotes ? `<tr><td class="label">Poznámky k motívom:</td><td>${campaignNotes}</td></tr>` : ''}
        </table>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Čerpacia stanica & Mesto</th>
            <th>Typ nosiča</th>
            <th>Rozmer</th>
            <th>Osvetlenie</th>
            <th>Trhová cena</th>
            <th>Celkom (${monthsDuration} mes.)</th>
            <th>Fotobanka 12 zón</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map((it) => {
              const zoneNum = it.adSpace.zoneNumber || 2;
              const zoneFolder = getDriveFolderForAd(it.station.stationCode, zoneNum, it.adSpace.category);
              const itemMonthly = it.adSpace.monthlyPriceEur || 0;
              const itemTotal = Math.round(itemMonthly * monthsDuration * (1 - discountPercent / 100));

              return `
              <tr>
                <td><code>${it.adSpace.id}</code></td>
                <td><strong>${it.station.name}</strong><br/><span style="color: #64748b; font-size: 11px;">${it.station.city || ''} (${it.station.stationCode})</span></td>
                <td>${it.adSpace.type}</td>
                <td>${it.adSpace.dimensions}</td>
                <td>${it.adSpace.illumination}</td>
                <td><strong>${itemMonthly} €</strong> / mes.<br/><span style="font-size: 10px; color: #64748b;">${((it.adSpace.dailyPriceEur || itemMonthly / 30)).toFixed(2)} €/deň</span></td>
                <td><strong style="color: #059669;">${itemTotal} €</strong></td>
                <td><span class="drive-tag">Zóna ${zoneNum}</span><br/><span style="font-size: 10px; color: #059669;">${zoneFolder ? 'Drive archív overený' : 'Fotobanka k dispozícii'}</span></td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>

      <div class="conditions">
        <strong>Technické a cenové podmienky siete DALIOIL:</strong><br/>
        1. Všetky ceny sú stanovené podľa transparentného trhového cenníka 2026 a sú uvedené bez DPH.<br/>
        2. Všetky nosiče majú overenú fotodokumentáciu v 12 zónach Google Drive archívu podľa auditu 2026.<br/>
        3. Tlačové podklady a motívy (PDF v mierke 1:1, CMYK, spadávka) je potrebné schváliť minimálne 7 pracovných dní pred začiatkom výlepu.<br/>
        4. Inštalácia je koordinovaná s regionálnymi manažérmi prevádzok DALIOIL s dôrazom na bezpečnosť a viditeľnosť.
      </div>
    </body>
    </html>
  `;

    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        return;
      }
    } catch {
      // window.open failed
    }

    // Fallback: Download HTML file (avoids freezing inside iframe)
    try {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DALIOIL_Mediaplan_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      if (!isInsideIframe) {
        window.print();
      }
    }
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="campaign-planner-modal"
        className="w-full max-w-4xl bg-white dark:bg-[#10141d] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-gradient-to-r dark:from-[#151c28] dark:via-[#121822] dark:to-[#151c28] border-b border-slate-200 dark:border-gray-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-950/50">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Marketingový Mediaplánovač & Rezervácia plôch</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  {items.length} nosičov vo výbere
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Manažérsky výber reklamných nosičov siete DALIOIL s technickou špecifikáciou, zásahom a preklikom na fotobanku Zón 1–12
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs bg-slate-50/50 dark:bg-transparent">
          {items.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700 flex items-center justify-center mx-auto text-slate-400 dark:text-gray-400 shadow-sm">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Váš mediaplán je zatiaľ prázdny</h3>
              <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto text-xs leading-relaxed">
                Pre pridanie plôch do mediaplánu otvorte ľubovoľnú stanicu zo zoznamu alebo mapy, kliknite na záložku <strong>„Reklamné plochy“</strong> a pridajte požadované nosiče kliknutím na tlačidlo <strong>„+ Pridať do výberu“</strong>.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow text-xs cursor-pointer"
              >
                Prezerať stanice siete
              </button>
            </div>
          ) : isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Rezervácia mediaplánu bola úspešne zaznamenaná!</h3>
              <p className="text-slate-600 dark:text-gray-300 max-w-lg mx-auto text-xs leading-relaxed">
                Evidenčný kód dopytu: <strong className="font-mono text-emerald-600 dark:text-emerald-400">PLAN-2026-{Math.floor(1000 + Math.random() * 9000)}</strong>.
                Zoznam vybraných {items.length} nosičov bol pripravený pre marketingové oddelenie a regionálnych manažérov prevádzok.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadPlanCSV}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-800 dark:text-white font-bold rounded-xl transition flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Stiahnuť mediaplán (CSV)</span>
                </button>
                <button
                  onClick={handlePrintProposal}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-800 dark:text-white font-bold rounded-xl transition flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Tlačiť mediaplán (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition text-xs cursor-pointer"
                >
                  Zavrieť
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Marketing & Financial KPI Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <div className="p-3 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400">Vybrané nosiče</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {items.length} plôch
                  </div>
                  <div className="text-[10px] text-slate-500">v aktuálnom pláne</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400">Zasiahnuté stanice</div>
                  <div className="text-base sm:text-lg font-black text-sky-600 dark:text-sky-400 mt-0.5">
                    {uniqueStations.length} ČS
                  </div>
                  <div className="text-[10px] text-slate-500">lokalít na Slovensku</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400">Denný prejazd (AADT)</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">
                    {totalDailyTraffic.toLocaleString('sk-SK')}
                  </div>
                  <div className="text-[10px] text-slate-500">áut denne na ČS</div>
                </div>

                <div className="p-3 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-400">Denné bločky</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">
                    {Math.round(totalMonthlyCashierVisits / 30).toLocaleString('sk-SK')}{' '}
                    <span className="text-xs font-normal text-slate-400">/ deň</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">({totalMonthlyCashierVisits.toLocaleString('sk-SK')} / mesiac)</div>
                </div>

                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Mesačná trhová cena</div>
                  <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {monthlySubtotal.toLocaleString('sk-SK')} €
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">súčet trhových cien</div>
                </div>

                <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white border border-emerald-500 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-100 flex items-center justify-between">
                    <span>Rozpočet ({monthsDuration} mes.)</span>
                    {discountPercent > 0 && <span className="bg-black/30 px-1 py-0.2 rounded text-[9px]">-{discountPercent}%</span>}
                  </div>
                  <div className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
                    {finalTotal.toLocaleString('sk-SK')} €
                  </div>
                  <div className="text-[10px] text-emerald-100 font-mono">bez DPH celkom</div>
                </div>
              </div>

              {/* Campaign Duration Selector */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                      <span>Plánovaná dĺžka nasadenia kampane</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Zvoľte plánované obdobie pre výpočet kumulatívneho zásahu (OTS) a harmonogramu:
                    </p>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-gray-800 shrink-0">
                    {[1, 3, 6, 12].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMonthsDuration(m)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                          monthsDuration === m
                            ? 'bg-sky-600 text-white shadow'
                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {m} {m === 1 ? 'mesiac' : m < 5 ? 'mesiace' : 'mesiacov'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="text-slate-700 dark:text-gray-300">
                      Kumulatívny odhadovaný zásah kontaktov za <strong>{monthsDuration} {monthsDuration === 1 ? 'mesiac' : monthsDuration < 5 ? 'mesiace' : 'mesiacov'}</strong>:
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    cca {cumulativeAudienceOTS.toLocaleString('sk-SK')} OTS
                  </span>
                </div>
              </div>

              {/* List of selected ad spaces */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-500" />
                    <span>Zoznam vybraných reklamných plôch ({items.length})</span>
                  </h3>
                  <button
                    onClick={onClearPlan}
                    className="text-[11px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vymazať celý výber</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-gray-800 bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden max-h-72 overflow-y-auto shadow-xs">
                  {items.map((item) => {
                    const zoneNum = item.adSpace.zoneNumber || 2;
                    const zoneFolder = getDriveFolderForAd(item.station.stationCode, zoneNum, item.adSpace.category);

                    return (
                      <div
                        key={item.adSpace.id}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-800/40 transition gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {zoneFolder ? (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenStationDetail(item.station.id);
                                onClose();
                              }}
                              className="relative w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition shrink-0 group shadow-xs cursor-pointer"
                              title={`Zobraziť fotografie zóny Z${zoneNum} priamo v aplikácii`}
                            >
                              <Camera className="w-5 h-5 group-hover:scale-110 transition" />
                              <span className="absolute -top-1 -right-1 px-1 bg-emerald-600 text-white text-[8px] font-black rounded-full group-hover:bg-slate-900">
                                Z{zoneNum}
                              </span>
                            </button>
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-slate-400 shrink-0">
                              <Briefcase className="w-5 h-5 opacity-40" />
                            </div>
                          )}

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/40 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30">
                                {item.adSpace.id}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white text-xs">{item.adSpace.name}</span>
                              <span className="text-slate-500 dark:text-gray-400">• {item.station.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-slate-700 dark:text-gray-300">{item.adSpace.type}</span>
                              <span>•</span>
                              <span>Rozmer: <strong>{item.adSpace.dimensions}</strong></span>
                              <span>•</span>
                              <span>Osvetlenie: {item.adSpace.illumination}</span>
                              {zoneFolder && (
                                <>
                                  <span>•</span>
                                  <a
                                    href={zoneFolder.folderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1"
                                    title="Otvoriť originálny priečinok na Google Disku v novej karte"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Otvoriť na Google Disku</span>
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                              {item.adSpace.monthlyPriceEur || 0} € <span className="text-[10px] font-normal text-slate-400">/ mes.</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {(item.adSpace.dailyPriceEur || Math.round(((item.adSpace.monthlyPriceEur || 0) / 30) * 100) / 100).toFixed(2)} €/deň
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              onClose();
                              onOpenStationDetail(item.station.id);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition"
                          >
                            Zobraziť ČS
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.adSpace.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
                            title="Odstrániť z výberu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Campaign Reservation Form */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-500" />
                  <span>Rezervácia kampane & Kontaktné údaje</span>
                </h3>

                <form onSubmit={handleSubmitInquiry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-400 mb-1">
                        Názov kampane / Motív
                      </label>
                      <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Napr. Jarné promo 2026..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-400 mb-1">
                        Inzerent / Spoločnosť
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Napr. DALIOIL Retail / Partner s.r.o."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-400 mb-1">
                        E-mailová adresa
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="marketing@partner.sk"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-400 mb-1">
                        Telefónne číslo
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+421 905 ..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-gray-400 mb-1">
                      Poznámky k realizácii, tlačovým podkladom alebo inštalácii
                    </label>
                    <textarea
                      rows={2}
                      value={campaignNotes}
                      onChange={(e) => setCampaignNotes(e.target.value)}
                      placeholder="Požiadavky na termín inštalácie, tlačové formáty, špecifické pokyny k zónam..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadPlanCSV}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 font-bold rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Stiahnuť mediaplán (CSV)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrintProposal}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 font-bold rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Tlačiť mediaplán (PDF)</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-950/20 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Potvrdiť rezerváciu mediaplánu</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 dark:bg-[#0d1117] border-t border-slate-200 dark:border-gray-800 flex justify-between items-center shrink-0 text-xs text-slate-500 dark:text-gray-400">
          <span>Súhrn kampane siete DALIOIL: {items.length} nosičov na {uniqueStations.length} prevádzkach</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 font-semibold rounded-xl transition cursor-pointer"
          >
            Zavrieť plánovač
          </button>
        </div>
      </div>
    </div>
  );
};
