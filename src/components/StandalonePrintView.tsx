import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import {
  Printer,
  ArrowLeft,
  Download,
  FileText,
  MapPin,
  Table,
  Check,
  RotateCcw,
  Layers,
  Sparkles,
  Phone,
  Building2,
  Calendar,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { STATIONS, REGIONS } from '../data/stations';
import { getStationAdSummary } from '../data/adSpaces';
import { SLOVAKIA_GEOJSON, SLOVAKIA_MASK_GEOJSON } from '../data/slovakiaGeo';
import { createLeafletMarkerIcon } from '../utils/markerUtils';
import { downloadFile } from '../utils/exportUtils';
import {
  PrintMarkerColorMode,
  PrintMarkerLabelMode,
  Station,
} from '../types';

interface StandalonePrintViewProps {
  onBackToApp?: () => void;
  initialConfig?: {
    orientation?: 'landscape' | 'portrait';
    markerSize?: number;
    colorMode?: PrintMarkerColorMode;
    customColor?: string;
    labelMode?: PrintMarkerLabelMode;
    isolateSlovakia?: boolean;
    stations?: Station[];
    allStations?: Station[];
  };
}

export const StandalonePrintView: React.FC<StandalonePrintViewProps> = ({
  onBackToApp,
  initialConfig,
}) => {
  // Parse URL search parameters if any
  const params = useMemo(() => {
    return typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  }, []);

  const [paperOrientation, setPaperOrientation] = useState<'landscape' | 'portrait'>(() => {
    if (initialConfig?.orientation) return initialConfig.orientation;
    return (params.get('orient') as 'landscape' | 'portrait') || 'landscape';
  });

  const allAvailableStations = useMemo(() => {
    return initialConfig?.allStations && initialConfig.allStations.length > 0
      ? initialConfig.allStations
      : STATIONS;
  }, [initialConfig?.allStations]);

  const filteredStations = useMemo(() => {
    if (initialConfig?.stations && initialConfig.stations.length > 0) {
      return initialConfig.stations;
    }
    const idsStr = params.get('ids');
    if (idsStr) {
      const idSet = new Set(
        idsStr
          .split(',')
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id))
      );
      const filtered = STATIONS.filter((s) => idSet.has(s.id));
      if (filtered.length > 0) return filtered;
    }
    return STATIONS;
  }, [params, initialConfig?.stations]);

  // Scope toggle: print only filtered stations or all stations
  const [selectedScope, setSelectedScope] = useState<'filtered' | 'all'>(() => {
    if (filteredStations.length < allAvailableStations.length) {
      return 'filtered';
    }
    return 'all';
  });

  const targetStations = selectedScope === 'filtered' ? filteredStations : allAvailableStations;

  const [showTable, setShowTable] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [tileStyle, setTileStyle] = useState<'bw' | 'color'>('bw');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [printMessage, setPrintMessage] = useState<string | null>(null);

  const markerSize = useMemo(() => {
    if (initialConfig?.markerSize) return initialConfig.markerSize;
    const s = parseInt(params.get('size') || '34', 10);
    return isNaN(s) ? 34 : Math.min(60, Math.max(20, s));
  }, [params, initialConfig?.markerSize]);

  const colorMode = useMemo(() => {
    if (initialConfig?.colorMode) return initialConfig.colorMode;
    return (params.get('color') as PrintMarkerColorMode) || 'region';
  }, [params, initialConfig?.colorMode]);

  const customColor = useMemo(() => {
    if (initialConfig?.customColor) return initialConfig.customColor;
    return params.get('customColor') || '#E11D23';
  }, [params, initialConfig?.customColor]);

  const labelMode = useMemo(() => {
    if (initialConfig?.labelMode) return initialConfig.labelMode;
    return (params.get('label') as PrintMarkerLabelMode) || 'logo';
  }, [params, initialConfig?.labelMode]);

  const isolateSlovakia = useMemo(() => {
    if (initialConfig?.isolateSlovakia !== undefined) return initialConfig.isolateSlovakia;
    return params.get('isolate') !== 'false';
  }, [params, initialConfig?.isolateSlovakia]);

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Ensure body allows scrolling while print view is mounted
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [48.669, 19.699],
      zoom: 8,
      zoomSnap: 0.25,          // Umožňuje jemné desatinné priblíženie namiesto hrubých skokov
      zoomDelta: 0.5,          // Každý klik na tlačidlá + / - mení priblíženie o 0.5
      wheelPxPerZoomLevel: 140,// Citlivé a plynulé zoomovanie kolieskom myši aj touchpadom
      wheelDebounceTime: 40,   // Okamžitá plynulá odozva
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
    });

    mapInstanceRef.current = map;

    // Basemap: light-gray (ink-saving) or clean (color) with crossOrigin: true for html2canvas
    const tileClassName = tileStyle === 'bw' ? 'map-tiles-light-gray' : 'map-tiles-clean';
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      subdomains: 'abc',
      className: tileClassName,
      crossOrigin: true,
    }).addTo(map);

    // Mask Layer (covers countries outside Slovakia)
    if (isolateSlovakia) {
      L.geoJSON(SLOVAKIA_MASK_GEOJSON as any, {
        style: {
          fillColor: '#ffffff',
          fillOpacity: 0.95,
          weight: 0,
          stroke: false,
        },
      }).addTo(map);
    }

    // Slovakia Red Border Line
    L.geoJSON(SLOVAKIA_GEOJSON as any, {
      style: {
        color: '#E11D23',
        weight: 2.2,
        opacity: 0.9,
        fillColor: '#000000',
        fillOpacity: 0,
      },
    }).addTo(map);

    // Markers Layer
    const markersLayer = L.layerGroup().addTo(map);
    const bounds: [number, number][] = [];

    targetStations.forEach((station) => {
      bounds.push([station.lat, station.lng]);
      const reg = REGIONS[station.region];
      const icon = createLeafletMarkerIcon(station, reg, {
        size: markerSize,
        colorMode,
        customColor,
        labelMode,
        showAdBadge: false,
        isPrint: true,
      });

      const marker = L.marker([station.lat, station.lng], { icon });
      marker.bindTooltip(
        `<strong>${station.name}</strong><br/><span style="font-size:11px;color:#64748b;">${station.street || station.city || ''}</span>`,
        { direction: 'top', offset: [0, -markerSize / 2] }
      );
      marker.addTo(markersLayer);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 });
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    targetStations,
    markerSize,
    colorMode,
    customColor,
    labelMode,
    isolateSlovakia,
    paperOrientation,
    tileStyle,
    showTable,
  ]);

  // Invalidate map size when layout changes
  const handleResetMapBounds = () => {
    if (!mapInstanceRef.current || targetStations.length === 0) return;
    const bounds: [number, number][] = targetStations.map((s) => [s.lat, s.lng]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [24, 24], maxZoom: 12 });
  };

  const printDateStr = new Date().toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Direct High-Resolution Client-Side PDF Generation and Download
  const handleExportPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPrintMessage('Pripravujem PDF súbor vo vysokej kvalite pre tlač...');

    try {
      // Ensure tiles and leaflet DOM are stable
      await new Promise((r) => setTimeout(r, 300));

      const isLandscape = paperOrientation === 'landscape';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const printWidth = pageWidth - margin * 2;
      const printMaxHeight = pageHeight - margin * 2;

      // 1. Capture Page 1 (Map sheet)
      const page1El = document.getElementById('print-page-1');
      if (!page1El) {
        throw new Error('Nepodarilo sa nájsť element tlačového hárka.');
      }

      const imgData1 = await toJpeg(page1El, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        filter: (node: HTMLElement) => {
          if (!node || !node.classList) return true;
          return (
            !node.classList.contains('print:hidden') &&
            !node.classList.contains('leaflet-control-zoom')
          );
        },
      });

      const elWidth1 = page1El.offsetWidth || 1100;
      const elHeight1 = page1El.offsetHeight || 750;
      const imgHeight1 = (elHeight1 * printWidth) / elWidth1;

      const finalWidth1 = imgHeight1 > printMaxHeight ? (elWidth1 * printMaxHeight) / elHeight1 : printWidth;
      const finalHeight1 = imgHeight1 > printMaxHeight ? printMaxHeight : imgHeight1;
      const offsetX1 = margin + (printWidth - finalWidth1) / 2;

      pdf.addImage(imgData1, 'JPEG', offsetX1, margin, finalWidth1, finalHeight1);

      // 2. Capture Page 2 (Table sheet) if enabled
      if (showTable) {
        const page2El = document.getElementById('print-page-2');
        if (page2El) {
          const imgData2 = await toJpeg(page2El, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            skipFonts: true,
          });

          pdf.addPage();
          const elWidth2 = page2El.offsetWidth || 1100;
          const elHeight2 = page2El.offsetHeight || 600;
          const imgHeight2 = (elHeight2 * printWidth) / elWidth2;

          const finalWidth2 = imgHeight2 > printMaxHeight ? (elWidth2 * printMaxHeight) / elHeight2 : printWidth;
          const finalHeight2 = imgHeight2 > printMaxHeight ? printMaxHeight : imgHeight2;
          const offsetX2 = margin + (printWidth - finalWidth2) / 2;

          pdf.addImage(imgData2, 'JPEG', offsetX2, margin, finalWidth2, finalHeight2);
        }
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `DALIOIL_Mapa_Siete_${paperOrientation}_${dateStr}.pdf`;
      pdf.save(filename);

      setPrintMessage(`✅ Súbor "${filename}" bol úspešne vygenerovaný a stiahnutý!`);
      setTimeout(() => setPrintMessage(null), 5000);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback: download standalone HTML
      handleDownloadHtml();
      setPrintMessage('Priamy export do PDF zlyhal, stiahol sa náhradný samostatný tlačový HTML súbor.');
      setTimeout(() => setPrintMessage(null), 7000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Trigger system print dialog (with helpful fallback)
  const handleSystemPrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Direct window.print() failed:', err);
    }
    setPrintMessage('Ak sa dialóg tlače v prehliadači neotvoril (prehliadač blokuje okná v náhľadovom iframe), použite červené tlačidlo „Stiahnuť PDF (A4)“, ktoré vám okamžite stiahne hotový PDF súbor.');
    setTimeout(() => setPrintMessage(null), 7000);
  };

  // Keyboard shortcut Ctrl+P support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleExportPdf();
      }
      if (e.key === 'Escape' && onBackToApp) {
        onBackToApp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToApp, handleExportPdf]);

  // Export self-contained HTML for offline printing or distribution
  const handleDownloadHtml = () => {
    const rowsHtml = targetStations
      .map((st) => {
        const reg = REGIONS[st.region];
        const adSummary = getStationAdSummary(st.id);
        return `
        <tr>
          <td style="padding:6px 8px;font-family:monospace;font-weight:bold;border-bottom:1px solid #e2e8f0;">${st.stationCode || `CS-${String(st.id).padStart(3, '0')}`}</td>
          <td style="padding:6px 8px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${st.name} ${st.isTerminal ? '<span style="font-size:9px;background:#e2e8f0;padding:2px 4px;border-radius:3px;">Terminál</span>' : ''}</td>
          <td style="padding:6px 8px;color:#475569;border-bottom:1px solid #e2e8f0;">${st.street ? `${st.street}, ${st.city || ''}` : st.note}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;"><span style="color:${reg?.color || '#000'};font-weight:600;">${reg?.shortName || ''} (${reg?.rep.name || ''})</span></td>
          <td style="padding:6px 8px;font-family:monospace;color:#475569;border-bottom:1px solid #e2e8f0;">${st.phone || st.managerPhone || reg?.rep.phone || ''}</td>
          <td style="padding:6px 8px;text-align:right;font-family:monospace;font-weight:bold;border-bottom:1px solid #e2e8f0;">${adSummary.total > 0 ? `${adSummary.free} voľných / ${adSummary.total}` : '-'}</td>
        </tr>`;
      })
      .join('\n');

    const regionsLegendHtml = Object.values(REGIONS)
      .map(
        (reg) =>
          `<div class="legend-item"><span class="dot" style="background:${reg.color};"></span> ${reg.name} (${reg.rep.name}: ${reg.rep.phone})</div>`
      )
      .join('\n    ');

    const htmlContent = `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <title>DALIOIL - Tlačový hárok siete (${targetStations.length} prevádzok)</title>
  <style>
    @page { size: ${paperOrientation}; margin: 8mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 12px; background: #fff; }
    .header { border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
    .logo span { color: #dc2626; }
    .title { font-size: 15px; font-weight: bold; margin: 2px 0 0; color: #1e293b; }
    .subtitle { font-size: 11px; color: #64748b; margin: 0; }
    .meta { text-align: right; font-size: 11px; color: #64748b; }
    .meta strong { font-size: 14px; color: #0f172a; display: block; }
    .legend { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; margin-bottom: 16px; font-size: 11px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
    .legend-item { display: inline-flex; align-items: center; gap: 6px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
    th { background: #f1f5f9; text-align: left; padding: 7px 8px; font-size: 10px; text-transform: uppercase; color: #475569; border-bottom: 1px solid #cbd5e1; }
    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; padding: 10px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
    <div><strong>Pripravené na tlač.</strong> Pre okamžitú tlač stlačte tlačidlo vpravo alebo Ctrl + P.</div>
    <button onclick="window.print()" style="background:#dc2626;color:#fff;border:none;padding:8px 16px;font-weight:bold;border-radius:6px;cursor:pointer;">Vytlačiť / Uložiť ako PDF</button>
  </div>
  <div class="header">
    <div>
      <div class="logo">DALI<span>OIL</span> <span style="font-size:11px;padding:2px 8px;background:#fee2e2;color:#991b1b;border-radius:12px;font-weight:bold;margin-left:6px;">Marketing & OOH sieť</span></div>
      <h1 class="title">Sieť čerpacích staníc a samoobslužných terminálov DALIOIL</h1>
      <p class="subtitle">Oficiálny zoznam a mapa prevádzok na území Slovenskej republiky</p>
    </div>
    <div class="meta">
      <strong>${targetStations.length} prevádzok</strong>
      <div>Dátum tlače: ${printDateStr}</div>
      <div style="color:#94a3b8;">Verzia: 2026/Q4</div>
    </div>
  </div>
  <div class="legend">
    <div style="font-weight:bold;text-transform:uppercase;color:#475569;margin-right:6px;">Regióny:</div>
    ${regionsLegendHtml}
    <div class="legend-item"><span style="background:#0f172a;color:#fff;padding:1px 5px;border-radius:3px;font-weight:bold;font-size:9px;">T</span> Samoobslužný terminál</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Kód</th>
        <th>Prevádzka</th>
        <th>Adresa</th>
        <th>Región / OZ</th>
        <th>Vedúci / Kontakt</th>
        <th style="text-align:right;">OOH Plochy</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
  <div class="footer">
    <div>DALIOIL, s.r.o. • Komplexná správa siete čerpacích staníc a OOH reklamných nosičov</div>
    <div>www.dalioil.sk • Vygenerované v DALIOIL Marketing Portáli</div>
  </div>
</body>
</html>`;

    downloadFile(
      htmlContent,
      `DALIOIL_Tlacovy_harok_mapa_${paperOrientation}_${new Date().toISOString().slice(0, 10)}.html`,
      'text/html;charset=utf-8;'
    );
    setPrintMessage('Tlačový HTML súbor bol stiahnutý do počítača. Môžete ho priamo otvoriť a vytlačiť.');
    setTimeout(() => setPrintMessage(null), 5000);
  };

  return (
    <div
      id="standalone-print-container"
      className="fixed inset-0 h-screen w-screen overflow-y-scroll bg-slate-100 text-slate-900 print:static print:h-auto print:overflow-visible print:bg-white print:p-0 z-50 selection:bg-red-500 selection:text-white"
    >
      {/* Top Floating Control Bar (Hidden during @media print) */}
      <div className="sticky top-0 z-50 bg-white dark:bg-[#111622] border-b border-slate-300 dark:border-gray-800 shadow-md px-3 sm:px-6 py-2.5 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2.5">
          {/* Back & Branding */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {onBackToApp && (
              <button
                id="btn-back-to-map"
                onClick={onBackToApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 transition cursor-pointer shadow-xs"
                title="Návrat do interaktívnej mapy siete"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                <span>Späť do mapy</span>
              </button>
            )}

            <div className="h-4 w-px bg-slate-300 dark:bg-gray-700" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-950 dark:text-white tracking-tight text-sm sm:text-base">
                  DALI<span className="text-red-600">OIL</span>
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-gray-300 hidden sm:inline">
                  Tlačový hárok mapy
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/60 font-mono">
                  {targetStations.length} prevádzok
                </span>
              </div>
            </div>
          </div>

          {/* Print Customization Controls */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Scope Switcher if filter is active */}
            {filteredStations.length < allAvailableStations.length && (
              <div className="flex bg-slate-200 dark:bg-gray-800 p-0.5 rounded-lg font-semibold text-[11px]">
                <button
                  onClick={() => setSelectedScope('filtered')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    selectedScope === 'filtered'
                      ? 'bg-red-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                  title="Tlačiť len stanice podľa aktuálneho filtra v mape"
                >
                  Vyfiltrované ({filteredStations.length})
                </button>
                <button
                  onClick={() => setSelectedScope('all')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    selectedScope === 'all'
                      ? 'bg-red-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                  title="Tlačiť celú sieť DALIOIL (všetkých 44 prevádzok)"
                >
                  Celá sieť ({allAvailableStations.length})
                </button>
              </div>
            )}

            {/* Paper Orientation: Landscape vs Portrait */}
            <div className="flex bg-slate-200 dark:bg-gray-800 p-0.5 rounded-lg font-semibold text-[11px]">
              <button
                onClick={() => setPaperOrientation('landscape')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  paperOrientation === 'landscape'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
                title="A4 Na šírku (ideálne pre široký tvar Slovenska)"
              >
                Na šírku (A4)
              </button>
              <button
                onClick={() => setPaperOrientation('portrait')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  paperOrientation === 'portrait'
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
                title="A4 Na výšku"
              >
                Na výšku
              </button>
            </div>

            {/* Tile Style: Ink-Saver vs Color */}
            <div className="hidden md:flex bg-slate-200 dark:bg-gray-800 p-0.5 rounded-lg font-semibold text-[11px]">
              <button
                onClick={() => setTileStyle('bw')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  tileStyle === 'bw'
                    ? 'bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
                title="Svetlá úsporná mapa – šetrí toner pri tlači na tlačiarni"
              >
                Úsporná (toner)
              </button>
              <button
                onClick={() => setTileStyle('color')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  tileStyle === 'color'
                    ? 'bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
                title="Plnofarebná OpenStreetMap"
              >
                Farebná
              </button>
            </div>

            {/* Table Toggle */}
            <button
              onClick={() => setShowTable(!showTable)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                showTable
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-gray-800 border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300'
              }`}
              title="Zobraziť alebo skryť podrobnú tabuľku prevádzok na 2. strane"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabuľka: {showTable ? 'Zapnutá (2. strana)' : 'Vypnutá (Iba mapa)'}</span>
            </button>

            {showTable && (
              <button
                onClick={() => {
                  const p2 = document.getElementById('print-page-2');
                  p2?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 transition cursor-pointer shadow-xs"
                title="Presunúť sa dole na 2. stranu dokumentu (tabuľka)"
              >
                <span>2. strana (Tabuľka) ↓</span>
              </button>
            )}

            {/* Download Standalone HTML Button */}
            <button
              id="btn-download-print-html"
              onClick={handleDownloadHtml}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-300 dark:border-gray-700 transition cursor-pointer"
              title="Stiahnuť samostatný HTML súbor pre offline archiváciu"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-gray-300" />
              <span>HTML</span>
            </button>

            {/* System Print Trigger */}
            <button
              id="btn-system-print"
              onClick={handleSystemPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border border-slate-300 dark:border-gray-700 transition cursor-pointer"
              title="Otvoriť systémový dialóg tlače prehliadača (ak to prehliadač povoľuje)"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-gray-300" />
              <span className="hidden sm:inline">Systémová tlač</span>
            </button>

            {/* PRIMARY DOWNLOAD / SAVE PDF BUTTON */}
            <button
              id="btn-print-page"
              disabled={isGeneratingPdf}
              onClick={handleExportPdf}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-900/25 transition cursor-pointer active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
              title="Vygenerovať a okamžite stiahnuť hotový PDF dokument do počítača"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Pripravujem PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Stiahnuť PDF (A4)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-200 dark:border-gray-800 text-[11px] text-slate-500 dark:text-gray-400 flex items-center justify-between flex-wrap gap-2">
          <span>
            📄 <strong>Priamy export:</strong> Kliknutím na červené tlačidlo <em>„Stiahnuť PDF (A4)“</em> sa vygeneruje oficiálny dokument DALIOIL priamo do stiahnutých súborov.
          </span>
          <span className="text-slate-400 font-mono">Orientácia: {paperOrientation === 'landscape' ? 'Na šírku' : 'Na výšku'}</span>
        </div>

        {printMessage && (
          <div className="max-w-7xl mx-auto mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/80 rounded-xl text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{printMessage}</span>
            </span>
            <button
              onClick={() => setPrintMessage(null)}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white font-bold px-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* The Printable Document Sheets */}
      <div className="p-3 sm:p-6 md:p-8 flex flex-col items-center gap-6 print:p-0 print:gap-0">
        {/* PAGE 1: MAP SHEET */}
        <div
          id="print-page-1"
          className={`bg-white text-slate-900 border border-slate-300 shadow-xl rounded-2xl p-5 sm:p-8 flex flex-col transition-all print:border-none print:shadow-none print:p-0 print:rounded-none ${
            paperOrientation === 'landscape'
              ? 'w-full max-w-[1140px] min-h-[750px]'
              : 'w-full max-w-[840px] min-h-[1050px]'
          }`}
        >
          {/* Official Executive Header */}
          <div className="border-b-2 border-red-600 pb-3.5 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl tracking-tight text-slate-950">
                    DALI<span className="text-red-600">OIL</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                    Marketing & OOH sieť
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-slate-800">
                  Sieť čerpacích staníc a samoobslužných terminálov DALIOIL
                </h1>
                <p className="text-xs text-slate-500">
                  Oficiálna mapa rozmiestnenia prevádzok na území Slovenskej republiky
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 shrink-0">
              <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                {targetStations.length} prevádzok
              </div>
              <div>Dátum tlače: {printDateStr}</div>
              <div className="text-[11px] text-slate-400 font-mono">Verzia siete: 2026/Q4 • Strana 1{showTable ? '/2' : ''}</div>
            </div>
          </div>

          {/* Map Container */}
          <div
            className={`relative w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 transition-all ${
              !showTable
                ? paperOrientation === 'landscape'
                  ? 'h-[580px] sm:h-[640px]'
                  : 'h-[620px] sm:h-[720px]'
                : paperOrientation === 'landscape'
                ? 'h-[450px] sm:h-[500px]'
                : 'h-[400px] sm:h-[450px]'
            }`}
          >
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Corner Badge & Reset Map Button (Hidden in Print) - Placed in top-right to avoid covering top-left zoom controls */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2 print:hidden">
              <div className="bg-white/95 border border-slate-300 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-slate-800 pointer-events-none">
                <span>📍 Zobrazených {targetStations.length} prevádzok</span>
              </div>
              <button
                onClick={handleResetMapBounds}
                className="bg-white/95 hover:bg-slate-100 border border-slate-300 px-2.5 py-1.5 rounded-lg shadow-sm text-xs font-bold text-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="Vystrediť na všetky zobrazené prevádzky"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                <span>Vystrediť</span>
              </button>
            </div>
          </div>

          {/* Visual Legend & Area Managers */}
          {showLegend && (
            <div className="mt-3.5 p-3 bg-slate-50 border border-slate-200 rounded-xl break-inside-avoid">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Vysvetlivky a Legenda bodov</span>
                <span className="text-[10px] font-mono font-medium text-slate-500">
                  Režim: {colorMode === 'region' ? 'Podľa regiónov a Area manažérov' : colorMode}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                {colorMode === 'region' && (
                  <>
                    {Object.values(REGIONS).map((reg) => (
                      <div key={reg.id} className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0"
                          style={{ backgroundColor: reg.color }}
                        />
                        <span className="font-semibold text-slate-800">
                          {reg.name} ({reg.rep.name}: {reg.rep.phone})
                        </span>
                      </div>
                    ))}
                  </>
                )}

                {colorMode === 'ad-status' && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border border-white shadow-xs"></span>
                      <span className="font-semibold text-slate-800">Voľné reklamné plochy</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] border border-white shadow-xs"></span>
                      <span className="font-semibold text-slate-800">Končiace zmluvy / Rezervácia</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border border-white shadow-xs"></span>
                      <span className="font-semibold text-slate-800">Plne obsadené</span>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                    T
                  </span>
                  <span className="font-semibold text-slate-800">Samoobslužný terminál (6)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                    ★
                  </span>
                  <span className="font-semibold text-slate-800">Centrála Veľké Bierovce</span>
                </div>
              </div>
            </div>
          )}

          {/* Page 1 Footer */}
          <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 break-inside-avoid">
            <div>DALIOIL, s.r.o. • Komplexná správa siete čerpacích staníc a OOH reklamných nosičov</div>
            <div>www.dalioil.sk • Vygenerované v aplikácii DALIOIL Marketing Portal</div>
          </div>

          {/* Page 1 Navigation to Page 2 (Hidden during print) */}
          {showTable && (
            <div className="mt-4 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between flex-wrap gap-2 print:hidden bg-slate-50 -mx-5 -mb-5 sm:-mx-8 sm:-mb-8 p-3.5 sm:p-4 rounded-b-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Tlačový dokument má <strong>2 strany</strong>. Zoznam a kontakty prevádzok pokračujú na 2. strane.</span>
              </div>
              <button
                id="btn-scroll-to-page-2"
                onClick={() => {
                  const p2 = document.getElementById('print-page-2');
                  p2?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-red-600 text-white shadow-sm transition cursor-pointer group"
                title="Posunúť nadol na 2. stranu (tabuľka prevádzok)"
              >
                <span>Prejsť na 2. stranu (Tabuľka prevádzok)</span>
                <ChevronDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* PAGE 2: TABLE SHEET (if enabled) */}
        {showTable && (
          <div
            id="print-page-2"
            className={`bg-white text-slate-900 border border-slate-300 shadow-xl rounded-2xl p-5 sm:p-8 flex flex-col transition-all print:border-none print:shadow-none print:p-0 print:rounded-none print:break-before-page ${
              paperOrientation === 'landscape'
                ? 'w-full max-w-[1140px]'
                : 'w-full max-w-[840px]'
            }`}
          >
            {/* Header for Page 2 */}
            <div className="border-b-2 border-red-600 pb-3 mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  D
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900">
                    DALIOIL – Zoznam a kontakty prevádzok siete
                  </h2>
                  <p className="text-xs text-slate-500">
                    Oficiálny zoznam {targetStations.length} prevádzok k dátumu {printDateStr}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  id="btn-scroll-to-page-1"
                  onClick={() => {
                    const p1 = document.getElementById('print-page-1');
                    p1?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition cursor-pointer print:hidden shadow-xs"
                  title="Návrat na 1. stranu (Mapa siete)"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-red-600" />
                  <span>Hore na mapu (1. strana)</span>
                </button>
                <div className="text-right text-xs text-slate-400 font-mono">
                  Strana 2/2
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 text-[10px] uppercase font-bold">
                    <th className="py-2 px-2.5">Kód</th>
                    <th className="py-2 px-2.5">Lokalita / Prevádzka</th>
                    <th className="py-2 px-2.5">Adresa</th>
                    <th className="py-2 px-2.5">Región / OZ</th>
                    <th className="py-2 px-2.5">Vedúci / Kontakt</th>
                    <th className="py-2 px-2.5 text-right">OOH Plochy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {targetStations.map((station) => {
                    const reg = REGIONS[station.region];
                    const adSummary = getStationAdSummary(station.id);
                    return (
                      <tr key={station.id} className="hover:bg-slate-50 text-[11px] leading-tight">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-slate-900">
                          {station.stationCode || `CS-${String(station.id).padStart(3, '0')}`}
                        </td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-900">
                          {station.name}
                          {station.isTerminal && (
                            <span className="ml-1 px-1 py-0.2 rounded text-[9px] bg-slate-200 text-slate-700 font-bold">
                              Terminál
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-600">
                          {station.street ? `${station.street}, ${station.city || ''}` : station.note}
                        </td>
                        <td className="py-1.5 px-2.5">
                          <span
                            className="inline-block px-1.5 py-0.2 rounded font-semibold text-[10px]"
                            style={{
                              backgroundColor: `${reg?.color || '#000'}18`,
                              color: reg?.color || '#000',
                              border: `1px solid ${reg?.color || '#000'}40`,
                            }}
                          >
                            {reg?.shortName || ''} ({reg?.rep.name.split(' ')[0] || ''})
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-600 font-mono text-[10px]">
                          {station.phone || station.managerPhone || reg?.rep.phone || ''}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold">
                          {adSummary.total > 0 ? (
                            <span className={adSummary.free > 0 ? 'text-emerald-600' : 'text-slate-800'}>
                              {adSummary.free} voľných / {adSummary.total}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Page 2 Footer */}
            <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
              <div>DALIOIL, s.r.o. • Komplexná správa siete čerpacích staníc a OOH reklamných nosičov</div>
              <div>www.dalioil.sk • Vygenerované v aplikácii DALIOIL Marketing Portal</div>
            </div>
          </div>
        )}
      </div>

      {/* Floating quick-jump indicator between Page 1 and Page 2 */}
      {showTable && (
        <aside
          role="navigation"
          aria-label="Rýchly posun medzi stranami tlačového dokumentu"
          className="fixed bottom-5 right-6 z-50 bg-slate-950/95 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2.5 print:hidden transition-all duration-200 hover:border-slate-500"
        >
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Strany</span>
            <span className="text-xs font-black text-amber-400 font-mono">1 / 2</span>
          </div>
          <div className="h-5 w-px bg-slate-700" />
          <button
            onClick={() => {
              const p1 = document.getElementById('print-page-1');
              p1?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            title="Posunúť na 1. stranu (Mapa prevádzok)"
          >
            <ChevronUp className="w-3.5 h-3.5 text-red-400" />
            <span>1. Mapa</span>
          </button>
          <button
            onClick={() => {
              const p2 = document.getElementById('print-page-2');
              p2?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-sm transition cursor-pointer"
            title="Posunúť na 2. stranu (Tabuľkový zoznam prevádzok)"
          >
            <span>2. Tabuľka</span>
            <ChevronDown className="w-3.5 h-3.5 text-white" />
          </button>
        </aside>
      )}
    </div>
  );
};
