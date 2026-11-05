import React, { useState, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Globe2,
  Table,
  Sparkles,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Phone,
  Filter,
  ArrowDownToLine,
  FileText,
  SlidersHorizontal,
  Eye,
  Printer,
} from 'lucide-react';
import { Station, AdSpace } from '../types';
import { REGIONS } from '../data/stations';
import {
  generateStationsCSV,
  generateAdSpacesCSV,
  generateStationsGeoJSON,
  downloadFile,
  downloadStoreLocationsXLSX,
  generateStoreLocationsCSV,
  generateStoreLocationsTSV,
  copyStoreLocationsToClipboard,
  generateStoreExportRows,
  STORE_EXPORT_COLUMNS,
  StoreExportRow,
  GOOGLE_SHEETS_AUTOMATION_TIPS,
} from '../utils/exportUtils';
import { normalizeText } from '../utils/text';
import * as XLSX from 'xlsx';
import { CARRIER_AUDIT_DATA, AUDIT_PDF_PATH } from '../data/adCarrierAuditData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  allStations?: Station[];
  adSpaces: AdSpace[];
  initialTab?: 'stores' | 'csv' | 'formulas' | 'looker';
  onOpenAdvancedBranchExport?: () => void;
  onOpenPrintMap?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  stations,
  allStations,
  adSpaces,
  initialTab = 'stores',
  onOpenAdvancedBranchExport,
  onOpenPrintMap,
}) => {
  const [activeTab, setActiveTab] = useState<'stores' | 'csv' | 'formulas' | 'looker'>(initialTab);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Store export settings
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('all');
  const [useStandardHours, setUseStandardHours] = useState<boolean>(true);
  const [fallbackManagerPhone, setFallbackManagerPhone] = useState<boolean>(true);
  const [previewSearch, setPreviewSearch] = useState<string>('');
  const [copiedStores, setCopiedStores] = useState<boolean>(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const availableStations = allStations && allStations.length > 0 ? allStations : stations;
  const targetStations = exportScope === 'all' ? availableStations : stations;

  // Build rep phones map for fallbacks
  const repPhones = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(REGIONS).forEach(([k, v]) => {
      map[k] = v.rep.phoneRaw;
    });
    return map;
  }, []);

  // Compute store export rows for preview and download
  const storeExportRows = useMemo<StoreExportRow[]>(() => {
    return generateStoreExportRows(targetStations, {
      useStandardOpeningHours: useStandardHours,
      fallbackManagerPhone,
      repPhoneByRegion: repPhones,
    });
  }, [targetStations, useStandardHours, fallbackManagerPhone, repPhones]);

  // Filter preview rows by search
  const filteredPreviewRows = useMemo(() => {
    if (!previewSearch.trim()) return storeExportRows;
    const query = normalizeText(previewSearch);
    return storeExportRows.filter((r) => {
      return (
        normalizeText(r['Kód predajne']).includes(query) ||
        normalizeText(r['Názov firmy']).includes(query) ||
        normalizeText(r['Prvý riadok adresy']).includes(query) ||
        normalizeText(r['Lokalita']).includes(query) ||
        normalizeText(r['Poštové smerovacie číslo']).includes(query) ||
        normalizeText(r['Hlavné telefónne číslo']).includes(query)
      );
    });
  }, [storeExportRows, previewSearch]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  // 1. Download native Excel (.xlsx)
  const handleDownloadStoresXLSX = () => {
    const filename = `DALIOIL_Zoznam_Prevadzok_${exportScope === 'all' ? 'Vsetky' : 'Vyber'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    downloadStoreLocationsXLSX(targetStations, filename, {
      useStandardOpeningHours: useStandardHours,
      fallbackManagerPhone,
      repPhoneByRegion: repPhones,
    });
    showNotification('Súbor Excel (.xlsx) bol úspešne vygenerovaný a stiahnutý.');
  };

  // 2. Download CSV (Excel semicolon)
  const handleDownloadStoresCSV = () => {
    const csv = generateStoreLocationsCSV(targetStations, ';', {
      useStandardOpeningHours: useStandardHours,
      fallbackManagerPhone,
      repPhoneByRegion: repPhones,
    });
    const filename = `DALIOIL_Zoznam_Prevadzok_${exportScope === 'all' ? 'Vsetky' : 'Vyber'}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(csv, filename);
    showNotification('Súbor CSV (oddeľovač bodkočiarka s UTF-8 BOM) bol stiahnutý.');
  };

  // 3. Download TSV (Tab separated values)
  const handleDownloadStoresTSV = () => {
    const tsv = generateStoreLocationsTSV(targetStations, {
      useStandardOpeningHours: useStandardHours,
      fallbackManagerPhone,
      repPhoneByRegion: repPhones,
    });
    const filename = `DALIOIL_Zoznam_Prevadzok_${exportScope === 'all' ? 'Vsetky' : 'Vyber'}_${new Date().toISOString().slice(0, 10)}.tsv`;
    downloadFile(tsv, filename, 'text/tab-separated-values;charset=utf-8;');
    showNotification('Súbor TSV (tabulátory pre Google Sheets) bol stiahnutý.');
  };

  // 4. Copy to clipboard (Ctrl+V ready for Excel/Sheets)
  const handleCopyStoresToClipboard = async () => {
    const success = await copyStoreLocationsToClipboard(targetStations, {
      useStandardOpeningHours: useStandardHours,
      fallbackManagerPhone,
      repPhoneByRegion: repPhones,
    });
    if (success) {
      setCopiedStores(true);
      showNotification('Tabuľka skopírovaná do schránky! Vložte ju do Excelu alebo Google Sheets (Ctrl+V).');
      setTimeout(() => setCopiedStores(false), 2500);
    }
  };

  // Original exports
  const handleDownloadStationsCSV = () => {
    const csv = generateStationsCSV(stations);
    downloadFile(csv, `DALIOIL_Master_Lokality_${new Date().toISOString().slice(0, 10)}.csv`);
    showNotification('Master Lokality CSV stiahnuté.');
  };

  const handleDownloadAdSpacesCSV = () => {
    const csv = generateAdSpacesCSV(adSpaces, stations);
    downloadFile(csv, `DALIOIL_Master_Reklama_${new Date().toISOString().slice(0, 10)}.csv`);
    showNotification('Master Reklama CSV stiahnuté.');
  };

  const handleDownloadGeoJSON = () => {
    const geojson = generateStationsGeoJSON(stations, adSpaces);
    downloadFile(
      geojson,
      `DALIOIL_Siet_Stanic_${new Date().toISOString().slice(0, 10)}.geojson`,
      'application/geo+json;charset=utf-8;'
    );
    showNotification('GeoJSON stiahnuté.');
  };

  const handleDownloadCarrierAuditXLSX = () => {
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
    showNotification('Súbor Excel so zberom dát nosičov bol stiahnutý.');
  };

  const handleDownloadCarrierAuditCSV = () => {
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
    downloadFile(csvContent, 'DALIOIL_Zber_dat_reklamne_nosice_2026.csv', 'text/csv;charset=utf-8;');
    showNotification('Súbor CSV so zberom dát nosičov bol stiahnutý.');
  };

  const handleCopyFormula = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="export-data-modal"
        className="w-full max-w-6xl bg-white dark:bg-[#121620] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#151c28] border-b border-slate-200 dark:border-gray-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-600 flex items-center justify-center text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Export staníc & dátová integrácia
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 rounded-full">
                  Excel & Google
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Oficiálny export zoznamu prevádzok, Google Firemný profil (Google Business Profile) a OOH mediaplánovanie
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-gray-800 transition cursor-pointer"
            title="Zavrieť"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-[#0d1117] px-3 sm:px-4 shrink-0 overflow-x-auto">
          {/* Main User Requested Tab */}
          <button
            onClick={() => setActiveTab('stores')}
            className={`py-3 px-3.5 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'stores'
                ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Zoznam prevádzok (Excel / Google)</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
              18 stĺpcov
            </span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`py-3 px-3.5 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'csv'
                ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            <Database className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>Master Databáza (CSV / GeoJSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`py-3 px-3.5 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'formulas'
                ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Vzorce pre Google Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('looker')}
            className={`py-3 px-3.5 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'looker'
                ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-gray-800/40'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
            }`}
          >
            <Globe2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span>Looker Studio & Mapy</span>
          </button>

          {onOpenPrintMap && (
            <div className="ml-auto flex items-center py-1.5 pl-3">
              <button
                id="btn-export-modal-print-map"
                onClick={() => {
                  onClose();
                  onOpenPrintMap();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-sm transition cursor-pointer whitespace-nowrap"
                title="Otvoriť tlačový hárok mapy pre tlač alebo uloženie do PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Vytlačiť mapku (PDF)</span>
              </button>
            </div>
          )}
        </div>

        {/* Status Notification Toast */}
        {statusNotification && (
          <div className="bg-emerald-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusNotification}</span>
            </span>
            <button
              onClick={() => setStatusNotification(null)}
              className="text-white/80 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs bg-slate-50/50 dark:bg-transparent">
          {/* TAB 1: ZOZNAM PREVÁDZOK - EXCEL / GOOGLE BUSINESS PROFILE */}
          {activeTab === 'stores' && (
            <div className="space-y-4">
              {/* Info & Format Header Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-2.5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Export zoznamu prevádzok siete DALIOIL</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md">
                        {storeExportRows.length} prevádzok
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Presná tabuľka pripravená na stiahnutie do <strong>Microsoft Excel (.xlsx)</strong>,{' '}
                      <strong>CSV</strong> alebo priamy import do <strong>Google Firemného profilu (Google Business Profile)</strong>.
                    </p>
                  </div>

                  {/* Main Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Excel Export Button */}
                    <button
                      id="download-stores-xlsx-btn"
                      onClick={onOpenAdvancedBranchExport || handleDownloadStoresXLSX}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-900/20 cursor-pointer"
                      title="Export do Excelu"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Export do Excelu</span>
                    </button>

                    {/* CSV Button */}
                    <button
                      id="download-stores-csv-btn"
                      onClick={handleDownloadStoresCSV}
                      className="px-3 py-2 bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700 font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="Stiahnuť súbor CSV so slovenskou diakritikou (UTF-8 BOM a oddeľovač bodkočiarka)"
                    >
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Stiahnuť CSV</span>
                    </button>

                    {/* Copy to Clipboard Button */}
                    <button
                      id="copy-stores-clipboard-btn"
                      onClick={handleCopyStoresToClipboard}
                      className={`px-3 py-2 font-bold rounded-xl transition flex items-center gap-1.5 border cursor-pointer ${
                        copiedStores
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 border-slate-200 dark:border-gray-700 shadow-xs'
                      }`}
                      title="Skopírovať tabuľku s tabulátormi do schránky (v Exceli alebo Google Sheets stačí stlačiť Ctrl+V)"
                    >
                      {copiedStores ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Skopírované!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                          <span>Kopírovať (Ctrl+V)</span>
                        </>
                      )}
                    </button>

                    {/* TSV Button */}
                    <button
                      id="download-stores-tsv-btn"
                      onClick={handleDownloadStoresTSV}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800/80 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-xl transition text-[11px] font-semibold border border-slate-200 dark:border-gray-700"
                      title="Stiahnuť TSV (Tab-separated values pre Google Sheets)"
                    >
                      <span>TSV</span>
                    </button>
                  </div>
                </div>

                {/* Badges of 18 Export Columns */}
                <div className="pt-2 border-t border-slate-100 dark:border-gray-800/80 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1">
                    <Table className="w-3 h-3 text-emerald-500" />
                    <span>Štruktúra stĺpcov:</span>
                  </span>
                  {STORE_EXPORT_COLUMNS.map((col, idx) => (
                    <span
                      key={col}
                      className={`px-1.5 py-0.5 rounded font-mono border ${
                        idx >= 11
                          ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                          : 'bg-slate-100 dark:bg-black/30 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-800'
                      }`}
                      title={`Stĺpec ${idx + 1}: ${col}`}
                    >
                      <strong className="text-slate-400 dark:text-gray-500 mr-1">{idx + 1}.</strong>
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customization Options Bar */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
                {/* Scope selector */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1 text-[11px]">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Rozsah:</span>
                  </span>
                  <div className="flex items-center bg-slate-100 dark:bg-[#0d1117] p-0.5 rounded-lg border border-slate-200 dark:border-gray-800 text-[11px]">
                    <button
                      onClick={() => setExportScope('all')}
                      className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                        exportScope === 'all'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Všetky prevádzky ({availableStations.length})
                    </button>
                    <button
                      onClick={() => setExportScope('filtered')}
                      className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                        exportScope === 'filtered'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Exportovať iba stanice vyhovujúce aktuálnym filtrom z mapy"
                    >
                      Vyfiltrované v mape ({stations.length})
                    </button>
                  </div>
                </div>

                {/* Opening Hours format toggle */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-gray-300 text-[11px] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Otváracie hodiny:</span>
                  </span>
                  <div className="flex items-center bg-slate-100 dark:bg-[#0d1117] p-0.5 rounded-lg border border-slate-200 dark:border-gray-800 text-[11px]">
                    <button
                      onClick={() => setUseStandardHours(true)}
                      className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
                        useStandardHours
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Štandardný Google Business formát (00:00-24:00, 05:00-23:00, Zatvorené)"
                    >
                      Google formát (00:00-24:00)
                    </button>
                    <button
                      onClick={() => setUseStandardHours(false)}
                      className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
                        !useStandardHours
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Podrobný text (00:00 - 24:00 (NONSTOP), Nočný tankomat, atď.)"
                    >
                      Podrobný text
                    </button>
                  </div>
                </div>

                {/* Fallback Phone checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-700 dark:text-gray-300 font-medium">
                  <input
                    type="checkbox"
                    checked={fallbackManagerPhone}
                    onChange={(e) => setFallbackManagerPhone(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                  />
                  <span>Doplniť kontakt manažéra pri samoobslužných ČS</span>
                </label>

                {/* Preview Search Filter */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder="Filtrovať náhľad (obec, kód...)"
                    className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                  {previewSearch && (
                    <button
                      onClick={() => setPreviewSearch('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Data Table Live Preview Container */}
              <div className="bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
                {/* Table Top Status Bar */}
                <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#10141d] border-b border-slate-200 dark:border-gray-800 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2">
                    <Table className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Živý náhľad tabuľky ({filteredPreviewRows.length} z {storeExportRows.length} zobrazených)</span>
                  </span>
                  <span className="text-slate-500 dark:text-gray-400 font-mono text-[10px]">
                    20 stĺpcov • Posun vodorovne doprava 👉
                  </span>
                </div>

                {/* Horizontally and vertically scrollable table */}
                <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-[#0d1117] text-slate-700 dark:text-gray-300 sticky top-0 z-10 border-b border-slate-200 dark:border-gray-800 font-bold">
                      <tr>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-[#121620] sticky left-0 z-20 shadow-xs">
                          #
                        </th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-[#121620] sticky left-8 z-20 shadow-xs">
                          Kód predajne
                        </th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Názov firmy</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Prvý riadok adresy</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Lokalita</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Krajina / oblasť</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Poštové smerovacie číslo</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-right">Zemepisná šírka</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-right">Zemepisná dĺžka</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Hlavné telefónne číslo</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Web</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800">Hlavná kategória</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-sky-600 dark:text-sky-400">Google Mapy odkaz</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-amber-600 dark:text-amber-400">Google Street view odkaz</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-center bg-amber-500/5">Otváracie hodiny v nedeľu</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-center">Otváracie hodiny v pondelok</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-center">Otváracie hodiny v utorok</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-center">Otváracie hodiny v stredu</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-center">Otváracie hodiny vo štvrtok</th>
                        <th className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-center">Otváracie hodiny v piatok</th>
                        <th className="p-2.5 text-center bg-amber-500/5">Otváracie hodiny v sobotu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 font-normal">
                      {filteredPreviewRows.length === 0 ? (
                        <tr>
                          <td colSpan={21} className="p-8 text-center text-slate-500 dark:text-gray-400">
                            Žiadne prevádzky nezodpovedajú zadanému filtru hľadania.
                          </td>
                        </tr>
                      ) : (
                        filteredPreviewRows.map((row, idx) => {
                          const isNonstop = row['Otváracie hodiny v pondelok'].includes('00:00-24:00') || row['Otváracie hodiny v pondelok'].includes('NONSTOP');
                          const isClosed = row['Otváracie hodiny v pondelok'].includes('Zatvorené');

                          return (
                            <tr
                              key={row['Kód predajne']}
                              className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
                            >
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-slate-400 text-right bg-slate-50/50 dark:bg-[#121620] sticky left-0 z-10">
                                {idx + 1}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-slate-50/50 dark:bg-[#121620] sticky left-8 z-10">
                                {row['Kód predajne']}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-semibold text-slate-900 dark:text-white">
                                {row['Názov firmy']}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300">
                                {row['Prvý riadok adresy']}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300">
                                {row['Lokalita']}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 text-center font-bold">
                                {row['Krajina / oblasť']}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono">
                                {row['Poštové smerovacie číslo']}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-right text-slate-600 dark:text-gray-400">
                                {row['Zemepisná šírka'].toFixed(6)}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-right text-slate-600 dark:text-gray-400">
                                {row['Zemepisná dĺžka'].toFixed(6)}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-slate-700 dark:text-gray-300">
                                {row['Hlavné telefónne číslo'] ? (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-emerald-500" />
                                    <span>{row['Hlavné telefónne číslo']}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">—</span>
                                )}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-[10px] text-sky-600 dark:text-sky-400 max-w-[200px] truncate">
                                {row['Web']}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-medium">
                                  {row['Hlavná kategória']}
                                </span>
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-[10px] max-w-[150px] truncate">
                                {row['Google Mapy odkaz'] ? (
                                  <a
                                    href={row['Google Mapy odkaz']}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <MapPin className="w-2.5 h-2.5 text-sky-500 shrink-0" />
                                    <span className="truncate">{row['Google Mapy odkaz']}</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic">—</span>
                                )}
                              </td>
                              <td className="p-2.5 border-r border-slate-200 dark:border-gray-800 font-mono text-[10px] max-w-[150px] truncate">
                                {row['Google Street view odkaz'] ? (
                                  <a
                                    href={row['Google Street view odkaz']}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <Eye className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                    <span className="truncate">{row['Google Street view odkaz']}</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic">—</span>
                                )}
                              </td>

                              {/* Days from Sunday to Saturday */}
                              {(
                                [
                                  'Otváracie hodiny v nedeľu',
                                  'Otváracie hodiny v pondelok',
                                  'Otváracie hodiny v utorok',
                                  'Otváracie hodiny v stredu',
                                  'Otváracie hodiny vo štvrtok',
                                  'Otváracie hodiny v piatok',
                                  'Otváracie hodiny v sobotu',
                                ] as const
                              ).map((dayCol, dayIdx) => {
                                const val = row[dayCol];
                                return (
                                  <td
                                    key={dayCol}
                                    className={`p-2.5 border-r border-slate-200 dark:border-gray-800 text-center font-mono text-[10px] ${
                                      dayIdx === 0 || dayIdx === 6 ? 'bg-amber-500/5' : ''
                                    }`}
                                  >
                                    <span
                                      className={`px-1.5 py-0.5 rounded font-bold ${
                                        isClosed
                                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                                          : isNonstop
                                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                          : 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                                      }`}
                                    >
                                      {val}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer info */}
                <div className="p-3 bg-slate-50 dark:bg-[#0d1117] border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>00:00-24:00 (NONSTOP)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span>05:00-23:00 (Denná prevádzka)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Zatvorené / Rekonštrukcia</span>
                    </span>
                  </div>

                  <div className="font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Pripravené na priamy import do Google Business Profile alebo analýzu v Exceli</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER CSV & GEOJSON */}
          {activeTab === 'csv' && (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-gray-300">
                Súbory relačnej databázy DALIOIL obsahujú kompletné atribúty v štandardnom kódovaní UTF-8 (s BOM),
                takže sa v slovenskom Microsoft Exceli a Google Sheets otvoria bez chýb v diakritike.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Master Lokality */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 flex flex-col justify-between space-y-3 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-black/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                        TABUĽKA 1
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400">{stations.length} riadkov</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Master Lokality (CSV)</h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Zoznam všetkých čerpacích staníc, GPS súradnice, okresy, kraje, AADT intenzita a manažéri.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadStationsCSV}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Stiahnuť Lokality CSV</span>
                  </button>
                </div>

                {/* Master Reklama */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 flex flex-col justify-between space-y-3 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-black/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                        TABUĽKA 2
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400">{adSpaces.length} nosičov</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Master Reklama (CSV)</h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Všetkých {adSpaces.length} plôch, formáty, rozmery, osvetlenie, inzerenti, kampane a prekliky na fotobanku Zón 1–12.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadAdSpacesCSV}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Stiahnuť Reklama CSV</span>
                  </button>
                </div>

                {/* Zber dát nosičov & Stojany PHM (Audit 2026) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 flex flex-col justify-between space-y-3 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700/60">
                        AUDIT 2026
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400">{CARRIER_AUDIT_DATA.length} staníc</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zber dát nosičov & Stojanov</h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Množstvo nosičov a formáty v 12 zónach, stojany PHM, monitory, plachty a billboardy.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={handleDownloadCarrierAuditXLSX}
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-xs shadow-xs cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Stiahnuť Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={handleDownloadCarrierAuditCSV}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 font-semibold rounded-xl transition flex items-center justify-center gap-1 text-xs cursor-pointer border border-slate-200 dark:border-gray-700"
                    >
                      <Download className="w-3 h-3" />
                      <span>Stiahnuť CSV</span>
                    </button>
                  </div>
                </div>

                {/* GeoJSON */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 flex flex-col justify-between space-y-3 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-black/40 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30">
                        GEO DATA
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400">GIS & Mapy</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google My Maps / GeoJSON</h3>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Geografické body staníc s vypočítanými atribútmi voľných plôch a obsadenosti.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadGeoJSON}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Globe2 className="w-4 h-4" />
                    <span>Stiahnuť GeoJSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VZORCE PRE GOOGLE SHEETS */}
          {activeTab === 'formulas' && (
            <div className="space-y-3">
              <p className="text-slate-600 dark:text-gray-300">
                Pripravené Google Sheets vzorce pre automatické prepájanie tabuliek, výpočet zostávajúcich dní
                a dynamické reporty:
              </p>

              <div className="space-y-3">
                {GOOGLE_SHEETS_AUTOMATION_TIPS.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-2 shadow-xs"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{tip.title}</span>
                      </h4>
                      <button
                        onClick={() => handleCopyFormula(tip.code, idx)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-transparent"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400">Skopírované!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kopírovať vzorec</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900 dark:bg-black/60 border border-slate-800 font-mono text-[11px] text-emerald-400 dark:text-emerald-300 overflow-x-auto select-all">
                      {tip.code}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-gray-400">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOOKER STUDIO & MAPY */}
          {activeTab === 'looker' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-3 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span>Ako prepojiť databázu s Google Looker Studio:</span>
                </h3>

                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-gray-300 text-xs">
                  <li>
                    Stiahnite si súbor <strong>Zoznam prevádzok (Excel / Google)</strong> alebo{' '}
                    <strong>Master Lokality (CSV)</strong>.
                  </li>
                  <li>
                    Otvorte <strong className="text-slate-900 dark:text-white">Google Sheets</strong> a importujte dáta.
                  </li>
                  <li>
                    V Google Looker Studio zvoľte <em>„Pridať zdroj údajov“ → „Tabuľky Google“</em>.
                  </li>
                  <li>
                    Vložte mapový graf (Google Maps widget), kde ako dimenziu polohy nastavíte{' '}
                    <code>Zemepisná šírka, Zemepisná dĺžka</code>.
                  </li>
                  <li>
                    Ako popisok (Tooltip) nastavte <code>Názov firmy</code> a <code>Lokalita</code>.
                  </li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200/90 text-xs">
                💡 <strong>Google Business Profile Tip:</strong> Tento formát 18 stĺpcov je priamo optimalizovaný
                pre hromadné nahrávanie (Bulk Upload) pobočiek do Google Firemného profilu. Stačí ho stiahnuť ako Excel (.xlsx) a nahrať do správcu pobočiek Google.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 dark:bg-[#0d1117] border-t border-slate-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-gray-400">
            Sieť DALIOIL • {targetStations.length} prevádzok vybraných na export
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'stores' && (
              <button
                onClick={handleDownloadStoresXLSX}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Stiahnuť .xlsx</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              Zavrieť
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
