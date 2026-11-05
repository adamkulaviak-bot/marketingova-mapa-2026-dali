import * as XLSX from 'xlsx';
import { Station, AdSpace } from '../types';
import { getDriveFolderForAd } from '../data/stationPhotoFolders';

/**
 * Exact store location columns requested by user:
 * Kód predajne, Názov firmy, Prvý riadok adresy, Lokalita, Krajina / oblasť,
 * Poštové smerovacie číslo, Zemepisná šírka, Zemepisná dĺžka, Hlavné telefónne číslo,
 * Web, Hlavná kategória, Otváracie hodiny v nedeľu, Otváracie hodiny v pondelok,
 * Otváracie hodiny v utorok, Otváracie hodiny v stredu, Otváracie hodiny vo štvrtok,
 * Otváracie hodiny v piatok, Otváracie hodiny v sobotu
 */
export interface StoreExportRow {
  'Kód predajne': string;
  'Názov firmy': string;
  'Prvý riadok adresy': string;
  'Lokalita': string;
  'Krajina / oblasť': string;
  'Poštové smerovacie číslo': string;
  'Zemepisná šírka': number;
  'Zemepisná dĺžka': number;
  'Hlavné telefónne číslo': string;
  'Web': string;
  'Hlavná kategória': string;
  'Otváracie hodiny v nedeľu': string;
  'Otváracie hodiny v pondelok': string;
  'Otváracie hodiny v utorok': string;
  'Otváracie hodiny v stredu': string;
  'Otváracie hodiny vo štvrtok': string;
  'Otváracie hodiny v piatok': string;
  'Otváracie hodiny v sobotu': string;
  'Google Mapy odkaz'?: string;
  'Google Street view odkaz'?: string;
}

export const STORE_EXPORT_COLUMNS: (keyof StoreExportRow)[] = [
  'Kód predajne',
  'Názov firmy',
  'Prvý riadok adresy',
  'Lokalita',
  'Krajina / oblasť',
  'Poštové smerovacie číslo',
  'Zemepisná šírka',
  'Zemepisná dĺžka',
  'Hlavné telefónne číslo',
  'Web',
  'Hlavná kategória',
  'Google Mapy odkaz',
  'Google Street view odkaz',
  'Otváracie hodiny v nedeľu',
  'Otváracie hodiny v pondelok',
  'Otváracie hodiny v utorok',
  'Otváracie hodiny v stredu',
  'Otváracie hodiny vo štvrtok',
  'Otváracie hodiny v piatok',
  'Otváracie hodiny v sobotu',
];

/**
 * Normalizes opening hours for Google Business Profile / Excel
 * Examples:
 * - "00:00 - 24:00 (NONSTOP)" -> "00:00-24:00"
 * - "05:00 - 23:00" -> "05:00-23:00"
 * - "V rekonštrukcii (zatvorená)" -> "Zatvorené"
 */
export function formatStoreOpeningHours(rawHours?: string, useStandardFormat = true): string {
  if (!rawHours) return '00:00-24:00';
  if (!useStandardFormat) return rawHours;

  const lower = rawHours.toLowerCase();
  if (lower.includes('zatvoren') || lower.includes('rekonštrukc')) {
    return 'Zatvorené';
  }
  if (lower.includes('nonstop') || lower.includes('24:00') || lower.includes('00:00 - 24:00')) {
    return '00:00-24:00';
  }
  if (lower.includes('05:00') && lower.includes('23:00')) {
    return '05:00-23:00';
  }

  const match = rawHours.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return rawHours;
}

export interface StoreExportOptions {
  useStandardOpeningHours?: boolean;
  fallbackManagerPhone?: boolean;
  repPhoneByRegion?: Record<string, string>;
}

/**
 * Generates structured store rows matching exact requested column headers
 */
export function generateStoreExportRows(
  stations: Station[],
  options?: StoreExportOptions
): StoreExportRow[] {
  const useStandardHours = options?.useStandardOpeningHours ?? true;
  const fallbackPhone = options?.fallbackManagerPhone ?? true;
  const repPhones = options?.repPhoneByRegion || {};

  return stations.map((s) => {
    const rawHours = s.openingHours || '';
    const formattedHours = formatStoreOpeningHours(rawHours, useStandardHours);

    // Primary phone resolution
    let phone = s.phone?.trim() || '';
    if (!phone && fallbackPhone && !s.isHeadquarters && s.stationCode !== 'DALIOIL_010') {
      phone = s.managerPhone?.trim() || repPhones[s.region] || '';
    }

    const storeCode = s.storeCode || s.stationCode || `DALIOIL_${String(s.id).padStart(3, '0')}`;
    const companyName = s.companyName || `DALI OIL - ${s.name}`;
    const address = s.street || '';
    const locality = s.city || s.name || '';
    const country = s.country || 'SK';
    const zip = s.zip || '';
    const lat = s.exportLat ?? s.lat;
    const lng = s.exportLng ?? s.lng;
    const web = s.web || 'https://dalioil.sk/';
    const category = s.category || (s.isTerminal ? 'Čerpacia stanica s terminálom' : 'Čerpacia stanica');

    return {
      'Kód predajne': storeCode,
      'Názov firmy': companyName,
      'Prvý riadok adresy': address,
      'Lokalita': locality,
      'Krajina / oblasť': country,
      'Poštové smerovacie číslo': zip,
      'Zemepisná šírka': lat,
      'Zemepisná dĺžka': lng,
      'Hlavné telefónne číslo': phone,
      'Web': web,
      'Hlavná kategória': category,
      'Google Mapy odkaz': s.googleMapsUrl || '',
      'Google Street view odkaz': s.googleStreetViewUrl || '',
      'Otváracie hodiny v nedeľu': formattedHours,
      'Otváracie hodiny v pondelok': formattedHours,
      'Otváracie hodiny v utorok': formattedHours,
      'Otváracie hodiny v stredu': formattedHours,
      'Otváracie hodiny vo štvrtok': formattedHours,
      'Otváracie hodiny v piatok': formattedHours,
      'Otváracie hodiny v sobotu': formattedHours,
    };
  });
}

/**
 * Exports store locations table to native Microsoft Excel (.xlsx) file
 */
export function downloadStoreLocationsXLSX(
  stations: Station[],
  filename = `DALIOIL_Zoznam_Prevadzok_${new Date().toISOString().slice(0, 10)}.xlsx`,
  options?: StoreExportOptions
) {
  const rows = generateStoreExportRows(stations, options);
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: STORE_EXPORT_COLUMNS as string[] });

  // Explicit column widths for clean readability in Excel
  worksheet['!cols'] = [
    { wch: 15 }, // Kód predajne
    { wch: 32 }, // Názov firmy
    { wch: 30 }, // Prvý riadok adresy
    { wch: 25 }, // Lokalita
    { wch: 16 }, // Krajina / oblasť
    { wch: 14 }, // Poštové smerovacie číslo
    { wch: 16 }, // Zemepisná šírka
    { wch: 16 }, // Zemepisná dĺžka
    { wch: 20 }, // Hlavné telefónne číslo
    { wch: 38 }, // Web
    { wch: 20 }, // Hlavná kategória
    { wch: 45 }, // Google Mapy odkaz
    { wch: 45 }, // Google Street view odkaz
    { wch: 18 }, // Otváracie hodiny v nedeľu
    { wch: 18 }, // Otváracie hodiny v pondelok
    { wch: 18 }, // Otváracie hodiny v utorok
    { wch: 18 }, // Otváracie hodiny v stredu
    { wch: 18 }, // Otváracie hodiny vo štvrtok
    { wch: 18 }, // Otváracie hodiny v piatok
    { wch: 18 }, // Otváracie hodiny v sobotu
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Zoznam prevádzok');
  XLSX.writeFile(workbook, filename);
}

/**
 * Exports store locations table to Excel-compatible CSV (semicolon delimited with UTF-8 BOM)
 */
export function generateStoreLocationsCSV(
  stations: Station[],
  delimiter = ';',
  options?: StoreExportOptions
): string {
  const rows = generateStoreExportRows(stations, options);

  const escapeCell = (val: any) => {
    if (val === undefined || val === null) return '';
    const str = String(val);
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = STORE_EXPORT_COLUMNS.map(escapeCell).join(delimiter);
  const rowLines = rows.map((r) =>
    STORE_EXPORT_COLUMNS.map((col) => escapeCell(r[col])).join(delimiter)
  );

  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
}

/**
 * Exports store locations table to Tab-Separated Values (TSV)
 * Format matches the exact TSV clipboard structure from user prompt
 */
export function generateStoreLocationsTSV(
  stations: Station[],
  options?: StoreExportOptions
): string {
  const rows = generateStoreExportRows(stations, options);
  const headerLine = STORE_EXPORT_COLUMNS.join('\t');
  const rowLines = rows.map((r) =>
    STORE_EXPORT_COLUMNS.map((col) => String(r[col] ?? '').replace(/[\t\r\n]/g, ' ')).join('\t')
  );

  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
}

/**
 * Copies the store locations table to user clipboard as tab-separated text
 * Direct paste (Ctrl+V) into Excel or Google Sheets immediately formats into 18 columns
 */
export async function copyStoreLocationsToClipboard(
  stations: Station[],
  options?: StoreExportOptions
): Promise<boolean> {
  const tsv = generateStoreLocationsTSV(stations, options);
  const cleanText = tsv.replace(/^\uFEFF/, '');
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(cleanText);
      return true;
    }
    // Fallback if clipboard API is restricted
    const textArea = document.createElement('textarea');
    textArea.value = cleanText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Downloads a string as a file in the user's browser
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports TABUĽKA 1: Prehľad čerpacích staníc (Master Lokality) into CSV
 */
export function generateStationsCSV(stations: Station[]): string {
  const headers = [
    'ID_Stanice',
    'Nazov_Prevadzky',
    'GPS_Latitude',
    'GPS_Longitude',
    'Ulica_Cislo',
    'Mesto',
    'PSC',
    'Kraj',
    'Okres',
    'Typ_Tahu',
    'Dotknuta_Komunikacia',
    'Intenzita_Dopravy_Rozsah_24h',
    'Intenzita_Dopravy_AADT',
    'Zdroj_Scitania_Dopravy',
    'Denna_Navstevnost_Blocky',
    'Mesacna_Navstevnost_Pokladna',
    'Zodpovedny_Manazer',
    'Telefon_Veduceho',
    'Telefon_CS',
    'Email_CS',
    'Doplnkove_Sluzby',
    'Kategoria_Prevadzky',
    'Stav',
  ];

  const rows = stations.map((s) => [
    s.stationCode || `CS-${String(s.id).padStart(3, '0')}`,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    s.lat.toFixed(6),
    s.lng.toFixed(6),
    `"${(s.street || '').replace(/"/g, '""')}"`,
    `"${(s.city || '').replace(/"/g, '""')}"`,
    `"${(s.zip || '').replace(/"/g, '""')}"`,
    `"${(s.kraj || '').replace(/"/g, '""')}"`,
    `"${(s.okres || '').replace(/"/g, '""')}"`,
    `"${(s.roadType || '').replace(/"/g, '""')}"`,
    `"${(s.affectedRoad || '').replace(/"/g, '""')}"`,
    `"${(s.trafficRange || '').replace(/"/g, '""')}"`,
    s.trafficIntensityAADT || '',
    `"${(s.trafficSource || '').replace(/"/g, '""')}"`,
    s.dailyVisitsCashier || (s.monthlyVisitsCashier ? Math.round(s.monthlyVisitsCashier / 30) : ''),
    s.monthlyVisitsCashier || '',
    `"${(s.manager || '').replace(/"/g, '""')}"`,
    `"${(s.managerPhone || '').replace(/"/g, '""')}"`,
    `"${(s.phone || '').replace(/"/g, '""')}"`,
    `"${(s.email || '').replace(/"/g, '""')}"`,
    `"${(s.services || '').replace(/"/g, '""')}"`,
    s.isTerminal ? 'Terminál' : 'Čerpacia stanica',
    s.isNew ? 'Nová' : 'Aktívna',
  ]);

  // Include UTF-8 BOM for Microsoft Excel compatibility
  return '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
}

/**
 * Exports TABUĽKA 2: Reklamné plochy a Prenájmy (Master Reklama) into CSV
 */
export function generateAdSpacesCSV(adSpaces: AdSpace[], stations: Station[]): string {
  const stationMap = new Map(stations.map((s) => [s.id, s]));

  const headers = [
    'ID_Plochy',
    'ID_Stanice',
    'Nazov_Stanice',
    'Mesto',
    'Kraj',
    'Typ_Tahu',
    'Cislo_Zony_1_12',
    'Nazov_Zony_Fotobanky',
    'Kategoria',
    'Typ_Nosica',
    'Nazov_Nosica',
    'Strana_Orientacia',
    'Rozmer_cm',
    'Osvetlenie',
    'Status_Plochy',
    'Aktualny_Klient',
    'Nazov_Kampane',
    'Datum_Zaciatok',
    'Datum_Koniec',
    'Dni_Do_Konca',
    'Inspektor_Auditu',
    'Stav_Fotodokumentacie',
    'Google_Drive_Priecinok_Zony',
    'Cislo_Zmluvy',
    'Fakturacia_Status',
    'Exkluzivita_Kategoria',
    'Technicky_Stav',
    'Datum_Poslednej_Kontroly',
  ];

  const rows = adSpaces.map((ad) => {
    const st = stationMap.get(ad.stationId);
    const stationCode = st?.stationCode || `CS-${String(ad.stationId).padStart(3, '0')}`;
    const stationName = st?.name || '';
    const city = st?.city || '';
    const kraj = st?.kraj || '';
    const roadType = st?.roadType || '';
    const zoneNum = ad.zoneNumber || 2;
    const zoneFolder = getDriveFolderForAd(stationCode, zoneNum, ad.category);
    const zoneName = zoneFolder?.zoneName || ad.zoneName || `Zóna ${zoneNum}`;

    return [
      ad.id,
      stationCode,
      `"${stationName.replace(/"/g, '""')}"`,
      `"${city.replace(/"/g, '""')}"`,
      `"${kraj.replace(/"/g, '""')}"`,
      `"${roadType.replace(/"/g, '""')}"`,
      zoneNum,
      `"${zoneName.replace(/"/g, '""')}"`,
      ad.category,
      `"${ad.type.replace(/"/g, '""')}"`,
      `"${ad.name.replace(/"/g, '""')}"`,
      `"${ad.side.replace(/"/g, '""')}"`,
      `"${ad.dimensions.replace(/"/g, '""')}"`,
      ad.illumination,
      ad.status,
      `"${(ad.client || '').replace(/"/g, '""')}"`,
      `"${(ad.campaign || '').replace(/"/g, '""')}"`,
      ad.dateStart || '',
      ad.dateEnd || '',
      ad.daysLeft !== undefined && ad.daysLeft !== null ? ad.daysLeft : '',
      `"${(ad.inspector || '').replace(/"/g, '""')}"`,
      ad.auditStatus || 'Kompletné',
      `"${(zoneFolder?.folderUrl || '').replace(/"/g, '""')}"`,
      `"${(ad.contractNumber || '').replace(/"/g, '""')}"`,
      ad.billingStatus || '',
      `"${(ad.exclusivity || '').replace(/"/g, '""')}"`,
      ad.technicalCondition || 'V poriadku',
      ad.lastInspectionDate || '',
    ];
  });

  return '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
}

/**
 * Generates valid GeoJSON FeatureCollection of stations with their ad summaries
 * Ready for Google My Maps, Looker Studio map widgets, or GIS software
 */
export function generateStationsGeoJSON(stations: Station[], adSpaces: AdSpace[]): string {
  const geojson = {
    type: 'FeatureCollection',
    name: 'DALIOIL_Marketing_Siet_SR',
    features: stations.map((st) => {
      const stationAds = adSpaces.filter((a) => a.stationId === st.id);
      const freeCount = stationAds.filter((a) => a.status === 'free').length;
      const occupiedCount = stationAds.filter((a) => a.status === 'occupied').length;
      const expiringCount = stationAds.filter((a) => a.status === 'expiring').length;
      const occ = stationAds.length > 0 ? Math.round(((occupiedCount + expiringCount) / stationAds.length) * 100) : 0;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [st.lng, st.lat],
        },
        properties: {
          ID_Stanice: st.stationCode || `CS-${String(st.id).padStart(3, '0')}`,
          Nazov_Prevadzky: st.name,
          Mesto: st.city || '',
          Okres: st.okres || '',
          Kraj: st.kraj || '',
          Typ_Tahu: st.roadType || '',
          Plochy_Spolu: stationAds.length,
          Volne_Plochy: freeCount,
          Obsadene_Plochy: occupiedCount,
          Konciace_Plochy: expiringCount,
          Obsadenost_Percent: occ,
          Intenzita_AADT: st.trafficIntensityAADT || 0,
          Denne_Transakcie_Blocky: st.dailyVisitsCashier || (st.monthlyVisitsCashier ? Math.round(st.monthlyVisitsCashier / 30) : 0),
          Mesacne_Transakcie: st.monthlyVisitsCashier || 0,
          Zodpovedny_Manazer: st.manager || '',
        },
      };
    }),
  };

  return JSON.stringify(geojson, null, 2);
}

/**
 * Google Sheets template formulas & automation guidelines
 */
export const GOOGLE_SHEETS_AUTOMATION_TIPS = [
  {
    title: 'Automatický výpočet zostávajúcich dní (Dni_Do_Konca)',
    code: '=IF(ISBLANK(Q2); ""; DATEDIF(TODAY(); Q2; "D"))',
    description: 'Vypočíta presný počet dní zostávajúcich do konca zmluvy podľa aktuálneho dátumu.',
  },
  {
    title: 'Podmienený status podľa dátumu konca zmluvy',
    code: '=IF(ISBLANK(Q2); "Voľná"; IF(Q2 < TODAY(); "Expirovaná"; IF((Q2 - TODAY()) <= 14; "Končí do 14 dní"; "Obsadená")))',
    description: 'Dynamicky zmení status nosiča podľa vypršania prenájmu bez potreby manuálnej zmeny.',
  },
  {
    title: 'Prepojenie Tabuľky 1 a Tabuľky 2 cez XLOOKUP',
    code: '=XLOOKUP(B2; \'Master Lokality\'!A:A; \'Master Lokality\'!B:J)',
    description: 'Automaticky dotiahne názov stanice, mesto, kraj, okres a intenzitu AADT podľa ID_Stanice.',
  },
  {
    title: 'Dynamický zoznam voľných plôch pre obchodný tím (QUERY)',
    code: '=QUERY(\'Master Reklama\'!A:T; "SELECT A, B, C, D, G, H, M, S WHERE M = \'Voľná\' ORDER BY G"; 1)',
    description: 'Vygeneruje live aktualizovaný zoznam voľných nosičov rozdelený podľa typu a lokality.',
  },
  {
    title: 'Súhrnný mesačný výnos siete (SUMIF)',
    code: '=SUMIF(\'Master Reklama\'!M:M; "Obsadená"; \'Master Reklama\'!S:S) + SUMIF(\'Master Reklama\'!M:M; "Končí do 14 dní"; \'Master Reklama\'!S:S)',
    description: 'Spočíta celkový mesačný príjem siete z aktívnych zmlúv.',
  },
];
