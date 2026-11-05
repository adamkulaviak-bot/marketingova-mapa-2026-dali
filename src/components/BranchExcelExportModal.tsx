import React, { useState, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Search,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Table,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Clock,
  TrendingUp,
  Globe2,
  FileText,
  Sparkles,
  Info,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Station, AdSpace } from '../types';
import { REGIONS } from '../data/stations';
import { getStationAdSummary } from '../data/adSpaces';
import { getStationCarrierAudit } from '../data/adCarrierAuditData';
import { STATION_ZONE_FOLDERS } from '../data/stationPhotoFolders';
import { formatStoreOpeningHours, downloadFile } from '../utils/exportUtils';
import { normalizeText } from '../utils/text';

export interface BranchExportColumnDef {
  id: string;
  label: string; // Header in Excel / CSV
  category: 'id' | 'address' | 'contacts' | 'hours' | 'marketing' | 'digital';
  categoryLabel: string;
  description: string;
  defaultSelected: boolean;
  googleProfileDefault?: boolean;
  colWidth?: number;
  getValue: (station: Station, context: BranchExportContext) => string | number;
}

export interface BranchExportContext {
  useStandardHours: boolean;
  fallbackManagerPhone: boolean;
  repPhones: Record<string, string>;
  repEmails: Record<string, string>;
  repNames: Record<string, string>;
}

// Complete set of 47 granular, verified columns for DALIOIL branches
export const BRANCH_EXPORT_COLUMNS: BranchExportColumnDef[] = [
  // 1. ZÁKLADNÁ IDENTIFIKÁCIA
  {
    id: 'stationCode',
    label: 'Kód predajne',
    category: 'id',
    categoryLabel: 'Základná identifikácia',
    description: 'Jedinečný kód pobočky v sieti (napr. DALIOIL_001)',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 16,
    getValue: (s) => s.storeCode || s.stationCode || `DALIOIL_${String(s.id).padStart(3, '0')}`,
  },
  {
    id: 'companyName',
    label: 'Názov firmy',
    category: 'id',
    categoryLabel: 'Základná identifikácia',
    description: 'Oficiálny firemný názov pre Google Business (DALI OIL - Lokalita)',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 32,
    getValue: (s) => s.companyName || `DALI OIL - ${s.name}`,
  },
  {
    id: 'name',
    label: 'Názov prevádzky / Lokalita',
    category: 'id',
    categoryLabel: 'Základná identifikácia',
    description: 'Marketingový názov čerpacej stanice alebo terminálu',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 26,
    getValue: (s) => s.name,
  },
  {
    id: 'stationType',
    label: 'Typ prevádzky',
    category: 'id',
    categoryLabel: 'Základná identifikácia',
    description: 'Čerpacia stanica s obsluhou / Samoobslužný terminál / Centrála',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 26,
    getValue: (s) =>
      s.isHeadquarters || s.stationCode === 'DALIOIL_010'
        ? 'Centrála DALIOIL / DALITRANS'
        : s.isTerminal
        ? 'Samoobslužný tankovací terminál'
        : 'Čerpacia stanica s obsluhou',
  },
  {
    id: 'category',
    label: 'Hlavná kategória',
    category: 'id',
    categoryLabel: 'Základná identifikácia',
    description: 'Kategória v Google Firemnom profile (Čerpacia stanica)',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 22,
    getValue: (s) => s.category || (s.isTerminal ? 'Čerpacia stanica s terminálom' : 'Čerpacia stanica'),
  },
  {
    id: 'number',
    label: 'Interné číslo stanice',
    category: 'id',
    categoryLabel: 'Základná identifikácia',
    description: 'Interné poradové číslo v databáze DALIOIL',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 14,
    getValue: (s) => s.number,
  },
  {
    id: 'isNew',
    label: 'Nová prevádzka v sieti',
    category: 'id',
    categoryLabel: 'Základná identifikácia',
    description: 'Indikátor novootvorenej alebo modernizovanej pobočky',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 16,
    getValue: (s) => (s.isNew ? 'Áno (Nová)' : 'Nie'),
  },

  // 2. ADRESA A GEOGRAFICKÉ ÚDAJE
  {
    id: 'street',
    label: 'Prvý riadok adresy',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Ulica a orientačné/súpisné číslo prevádzky',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 32,
    getValue: (s) => s.street || '',
  },
  {
    id: 'city',
    label: 'Lokalita (Mesto / Obec)',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Názov mesta alebo obce',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 24,
    getValue: (s) => s.city || s.name || '',
  },
  {
    id: 'zip',
    label: 'Poštové smerovacie číslo',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Formátované PSČ (napr. 831 06)',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 16,
    getValue: (s) => s.zip || '',
  },
  {
    id: 'country',
    label: 'Krajina / oblasť',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Dvojmiestny kód krajiny (SK)',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 14,
    getValue: (s) => s.country || 'SK',
  },
  {
    id: 'region',
    label: 'Región siete DALIOIL',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Západné Slovensko, Severné Slovensko, Stred alebo Východ',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => REGIONS[s.region]?.name || s.region,
  },
  {
    id: 'kraj',
    label: 'Kraj SR',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Vyšší územný celok (Bratislavský, Žilinský, Banskobystrický...)',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 20,
    getValue: (s) => s.kraj || '',
  },
  {
    id: 'okres',
    label: 'Okres SR',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Okres umiestnenia čerpacej stanice',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 18,
    getValue: (s) => s.okres || '',
  },
  {
    id: 'roadType',
    label: 'Typ cestného ťahu',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Diaľnica D1/R1, Tranzit 1. triedy, Mestská lokalita...',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => s.roadType || 'Tranzitná komunikácia',
  },
  {
    id: 'lat',
    label: 'Zemepisná šírka (Latitude)',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Presné WGS-84 GPS súradnice šírky',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 18,
    getValue: (s) => (s.exportLat ?? s.lat),
  },
  {
    id: 'lng',
    label: 'Zemepisná dĺžka (Longitude)',
    category: 'address',
    categoryLabel: 'Adresa & GPS koordináty',
    description: 'Presné WGS-84 GPS súradnice dĺžky',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 18,
    getValue: (s) => (s.exportLng ?? s.lng),
  },

  // 3. KONTAKTNÉ ÚDAJE A MANAŽMENT
  {
    id: 'phone',
    label: 'Hlavné telefónne číslo',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'Oficiálny telefón pobočky (alebo kontakt manažéra)',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 22,
    getValue: (s, ctx) => {
      let phone = s.phone?.trim() || '';
      if (!phone && ctx.fallbackManagerPhone && !s.isHeadquarters && s.stationCode !== 'DALIOIL_010') {
        phone = s.managerPhone?.trim() || ctx.repPhones[s.region] || '';
      }
      return phone;
    },
  },
  {
    id: 'email',
    label: 'Oficiálny e-mail',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'Oficiálny kontaktný e-mail čerpacej stanice',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 28,
    getValue: (s) => s.email || '',
  },
  {
    id: 'web',
    label: 'Webová stránka',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'Priamy webový odkaz na pobočku na dalioil.sk',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 38,
    getValue: (s) => s.web || 'https://dalioil.sk/',
  },
  {
    id: 'manager',
    label: 'Vedúci stanice / Manažér',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'Meno zodpovedného vedúceho prevádzky',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 24,
    getValue: (s) => s.manager || '',
  },
  {
    id: 'managerPhone',
    label: 'Telefón vedúceho prevádzky',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'Priamy mobilný telefón na vedúceho stanice',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => s.managerPhone || '',
  },
  {
    id: 'repName',
    label: 'Regionálny obchodný zástupca',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'Pridelený obchodný zástupca pre daný región DALIOIL',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 26,
    getValue: (s, ctx) => ctx.repNames[s.region] || '',
  },
  {
    id: 'repPhone',
    label: 'Telefón obchodného zástupcu',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'Mobilný kontakt na regionálneho obchodného zástupcu',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s, ctx) => ctx.repPhones[s.region] || '',
  },
  {
    id: 'repEmail',
    label: 'E-mail obchodného zástupcu',
    category: 'contacts',
    categoryLabel: 'Kontakty & Zodpovedné osoby',
    description: 'E-mail na obchodného zástupcu pre daný región',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 28,
    getValue: (s, ctx) => ctx.repEmails[s.region] || '',
  },

  // 4. OTVÁRACIE HODINY & SLUŽBY
  {
    id: 'openingHoursText',
    label: 'Otváracie hodiny (Súhrnný text)',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Kompletný text otváracích hodín (NONSTOP, nočný tankomat...)',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 30,
    getValue: (s) => s.openingHours || '00:00 - 24:00 (NONSTOP)',
  },
  {
    id: 'hoursSunday',
    label: 'Otváracie hodiny v nedeľu',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Štandardný formát otváracích hodín (napr. 00:00-24:00 alebo Zatvorené)',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 20,
    getValue: (s, ctx) => formatStoreOpeningHours(s.openingHours, ctx.useStandardHours),
  },
  {
    id: 'hoursMonday',
    label: 'Otváracie hodiny v pondelok',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Štandardný Google formát pre pondelok',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 20,
    getValue: (s, ctx) => formatStoreOpeningHours(s.openingHours, ctx.useStandardHours),
  },
  {
    id: 'hoursTuesday',
    label: 'Otváracie hodiny v utorok',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Štandardný Google formát pre utorok',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 20,
    getValue: (s, ctx) => formatStoreOpeningHours(s.openingHours, ctx.useStandardHours),
  },
  {
    id: 'hoursWednesday',
    label: 'Otváracie hodiny v stredu',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Štandardný Google formát pre stredu',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 20,
    getValue: (s, ctx) => formatStoreOpeningHours(s.openingHours, ctx.useStandardHours),
  },
  {
    id: 'hoursThursday',
    label: 'Otváracie hodiny vo štvrtok',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Štandardný Google formát pre štvrtok',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 20,
    getValue: (s, ctx) => formatStoreOpeningHours(s.openingHours, ctx.useStandardHours),
  },
  {
    id: 'hoursFriday',
    label: 'Otváracie hodiny v piatok',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Štandardný Google formát pre piatok',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 20,
    getValue: (s, ctx) => formatStoreOpeningHours(s.openingHours, ctx.useStandardHours),
  },
  {
    id: 'hoursSaturday',
    label: 'Otváracie hodiny v sobotu',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'Štandardný Google formát pre sobotu',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 20,
    getValue: (s, ctx) => formatStoreOpeningHours(s.openingHours, ctx.useStandardHours),
  },
  {
    id: 'services',
    label: 'Doplnkové služby a vybavenie',
    category: 'hours',
    categoryLabel: 'Otváracie hodiny & Služby',
    description: 'DALI CAFE, ROADSHOP, autoumyváreň, vysávač, kompresor...',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 36,
    getValue: (s) => s.services || 'Predaj PHM, Tankovací automat',
  },

  // 5. MARKETING, DOPRAVA & NOSIČE
  {
    id: 'dailyVisits',
    label: 'Denná návštevnosť (bločky / deň)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Prepočítaná priemerná denná návštevnosť pokladne z auditu bločkov (priemer/30)',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => (s.dailyVisitsCashier || (s.monthlyVisitsCashier ? Math.round(s.monthlyVisitsCashier / 30) : '')),
  },
  {
    id: 'monthlyVisits',
    label: 'Mesačná návštevnosť (vydané bločky)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Reálna priemerná mesačná návštevnosť pokladne z auditu',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => s.monthlyVisitsCashier ?? '',
  },
  {
    id: 'affectedRoad',
    label: 'Dotknutá komunikácia (SSC)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Cesta I., II., III. triedy alebo miestna komunikácia podľa CSD',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 20,
    getValue: (s) => s.affectedRoad ?? '',
  },
  {
    id: 'trafficRange',
    label: 'Odhadovaná intenzita dopravy (voz./24h)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Oficiálny rozsah premávky za 24h z Celoštátneho sčítania dopravy',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 26,
    getValue: (s) => s.trafficRange ?? '',
  },
  {
    id: 'trafficAADT',
    label: 'Priemerná intenzita dopravy (AADT)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Priemerná denná intenzita prechádzajúcich vozidiel pre OOH metriky',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => s.trafficIntensityAADT ?? '',
  },
  {
    id: 'trafficSource',
    label: 'Zdroj sčítania dopravy',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Oficiálna inštitúcia a rok sčítania dopravy (SSC CSD 2022/2023)',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 28,
    getValue: (s) => s.trafficSource ?? '',
  },
  {
    id: 'fuelDispensers',
    label: 'Počet výdajných stojanov PHM',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Počet tankovacích stojanov z terénneho auditu 2026',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 20,
    getValue: (s) => {
      const audit = getStationCarrierAudit(s.id) || getStationCarrierAudit(s.stationCode);
      return audit ? audit.fuelDispensers : '';
    },
  },
  {
    id: 'totalAuditCarriers',
    label: 'Spolu reklamných nosičov (Audit PDF)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Zistený celkový počet nosičov v 12 zónach z auditu',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => {
      const audit = getStationCarrierAudit(s.id) || getStationCarrierAudit(s.stationCode);
      return audit ? audit.totalCarriersCount : 0;
    },
  },
  {
    id: 'totalAdSpaces',
    label: 'Kapacita reklamných plôch (OOH)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Počet evidovaných komerčných plôch na prenájom',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => getStationAdSummary(s.id).total,
  },
  {
    id: 'freeAdSpaces',
    label: 'Počet voľných reklamných plôch',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Plochy ihneď k dispozícii pre klientov a kampane',
    defaultSelected: true,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => getStationAdSummary(s.id).free,
  },
  {
    id: 'occupiedAdSpaces',
    label: 'Počet obsadených reklamných plôch',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Aktuálne zazmluvnené plochy klientov',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 22,
    getValue: (s) => getStationAdSummary(s.id).occupied,
  },
  {
    id: 'occupancyRate',
    label: 'Obsadenosť reklamných plôch (%)',
    category: 'marketing',
    categoryLabel: 'Marketing, Návštevnosť & Doprava',
    description: 'Percentuálne vyťaženie reklamnej kapacity pobočky',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 20,
    getValue: (s) => {
      const sum = getStationAdSummary(s.id);
      return sum.total > 0 ? `${Math.round((sum.occupied / sum.total) * 100)} %` : '0 %';
    },
  },

  // 6. DIGITÁLNE ODKAZY & PROFILY
  {
    id: 'googleMapsUrl',
    label: 'Google Mapy odkaz',
    category: 'digital',
    categoryLabel: 'Digitálne profily & Odkazy',
    description: 'Priamy overený odkaz na lokalitu v Google Maps',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 45,
    getValue: (s) => s.googleMapsUrl || '',
  },
  {
    id: 'googleStreetViewUrl',
    label: 'Google Street View 360° odkaz',
    category: 'digital',
    categoryLabel: 'Digitálne profily & Odkazy',
    description: 'Priamy panoramatický pohľad 360° na čerpaciu stanicu',
    defaultSelected: true,
    googleProfileDefault: true,
    colWidth: 45,
    getValue: (s) => s.googleStreetViewUrl || '',
  },
  {
    id: 'isGoogleVerified',
    label: 'Google profil overený',
    category: 'digital',
    categoryLabel: 'Digitálne profily & Odkazy',
    description: 'Potvrdené spárovanie s oficiálnou dokumentáciou Google',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 18,
    getValue: (s) => (s.isGoogleVerified ? 'Áno' : 'Nie'),
  },
  {
    id: 'driveFolderUrl',
    label: 'Google Drive Fotobanka odkaz',
    category: 'digital',
    categoryLabel: 'Digitálne profily & Odkazy',
    description: 'Priamy odkaz na fotobanku stanice v Google Drive',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 45,
    getValue: (s) => {
      const folder = STATION_ZONE_FOLDERS.find(
        (f) => f.stationCode === s.stationCode || f.stationCode === s.storeCode
      );
      return folder ? folder.folderUrl : '';
    },
  },
  {
    id: 'note',
    label: 'Poznámka / Špecifikácia',
    category: 'digital',
    categoryLabel: 'Digitálne profily & Odkazy',
    description: 'Interné poznámky o lokalite alebo technickom stave',
    defaultSelected: false,
    googleProfileDefault: false,
    colWidth: 32,
    getValue: (s) => s.note || '',
  },
];

interface BranchExcelExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  allStations?: Station[];
}

export const BranchExcelExportModal: React.FC<BranchExcelExportModalProps> = ({
  isOpen,
  onClose,
  stations,
  allStations,
}) => {
  // 1. Export scope (all vs filtered)
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('all');

  // 2. Export Mode: Full (all columns) vs Partial (only checked items)
  const [exportMode, setExportMode] = useState<'full' | 'partial'>('partial');

  // 3. Checked column IDs
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>(() =>
    BRANCH_EXPORT_COLUMNS.filter((c) => c.defaultSelected).map((c) => c.id)
  );

  // Settings
  const [useStandardHours, setUseStandardHours] = useState<boolean>(true);
  const [fallbackManagerPhone, setFallbackManagerPhone] = useState<boolean>(true);
  const [columnSearch, setColumnSearch] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const availableStations = allStations && allStations.length > 0 ? allStations : stations;
  const targetStations = exportScope === 'all' ? availableStations : stations;

  // Build context for getters
  const exportContext = useMemo<BranchExportContext>(() => {
    const repPhones: Record<string, string> = {};
    const repEmails: Record<string, string> = {};
    const repNames: Record<string, string> = {};

    Object.entries(REGIONS).forEach(([k, v]) => {
      repPhones[k] = v.rep.phoneRaw;
      repEmails[k] = v.rep.email;
      repNames[k] = v.rep.name;
    });

    return {
      useStandardHours,
      fallbackManagerPhone,
      repPhones,
      repEmails,
      repNames,
    };
  }, [useStandardHours, fallbackManagerPhone]);

  // Actual columns to export based on exportMode
  const activeExportColumns = useMemo<BranchExportColumnDef[]>(() => {
    if (exportMode === 'full') {
      return BRANCH_EXPORT_COLUMNS;
    }
    const idSet = new Set(selectedColumnIds);
    return BRANCH_EXPORT_COLUMNS.filter((col) => idSet.has(col.id));
  }, [exportMode, selectedColumnIds]);

  // Categories list
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    BRANCH_EXPORT_COLUMNS.forEach((col) => {
      const existing = map.get(col.category);
      if (existing) {
        existing.count++;
      } else {
        map.set(col.category, { id: col.category, label: col.categoryLabel, count: 1 });
      }
    });
    return Array.from(map.values());
  }, []);

  // Filtered columns in checkbox UI based on search and category tab
  const displayColumns = useMemo(() => {
    return BRANCH_EXPORT_COLUMNS.filter((col) => {
      if (activeCategoryFilter !== 'all' && col.category !== activeCategoryFilter) {
        return false;
      }
      if (columnSearch.trim()) {
        const query = normalizeText(columnSearch);
        const matchLabel = normalizeText(col.label).includes(query);
        const matchDesc = normalizeText(col.description).includes(query);
        const matchCat = normalizeText(col.categoryLabel).includes(query);
        return matchLabel || matchDesc || matchCat;
      }
      return true;
    });
  }, [activeCategoryFilter, columnSearch]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Checkbox management: Select All / Deselect All
  const handleSelectAll = () => {
    setSelectedColumnIds(BRANCH_EXPORT_COLUMNS.map((c) => c.id));
    setExportMode('partial');
    showToast(`Označených všetkých ${BRANCH_EXPORT_COLUMNS.length} stĺpcov.`);
  };

  const handleDeselectAll = () => {
    setSelectedColumnIds([]);
    setExportMode('partial');
    showToast('Všetky stĺpce boli odznačené.');
  };

  const handleToggleColumn = (colId: string) => {
    setExportMode('partial');
    setSelectedColumnIds((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const handleToggleCategory = (catId: string) => {
    setExportMode('partial');
    const catColIds = BRANCH_EXPORT_COLUMNS.filter((c) => c.category === catId).map((c) => c.id);
    const allInCatSelected = catColIds.every((id) => selectedColumnIds.includes(id));

    if (allInCatSelected) {
      // Deselect category
      setSelectedColumnIds((prev) => prev.filter((id) => !catColIds.includes(id)));
    } else {
      // Select all in category
      setSelectedColumnIds((prev) => Array.from(new Set([...prev, ...catColIds])));
    }
  };

  // Quick Preset Handlers
  const handleApplyPreset = (preset: 'google' | 'basic' | 'contacts' | 'marketing' | 'full') => {
    if (preset === 'full') {
      setExportMode('full');
      setSelectedColumnIds(BRANCH_EXPORT_COLUMNS.map((c) => c.id));
      showToast('Aktivovaný kompletný export (všetkých 47 stĺpcov).');
      return;
    }

    setExportMode('partial');
    let ids: string[] = [];

    if (preset === 'google') {
      ids = BRANCH_EXPORT_COLUMNS.filter((c) => c.googleProfileDefault).map((c) => c.id);
      showToast('Nastavená šablóna Google Firemný profil (18 stĺpcov).');
    } else if (preset === 'basic') {
      ids = ['stationCode', 'companyName', 'name', 'street', 'city', 'zip', 'region', 'lat', 'lng', 'phone', 'manager'];
      showToast('Nastavený základný prehľad pobočiek (11 stĺpcov).');
    } else if (preset === 'contacts') {
      ids = ['stationCode', 'name', 'city', 'phone', 'email', 'manager', 'managerPhone', 'region', 'repName', 'repPhone', 'repEmail', 'web'];
      showToast('Nastavené kontakty a manažment (12 stĺpcov).');
    } else if (preset === 'marketing') {
      ids = ['stationCode', 'name', 'city', 'region', 'roadType', 'affectedRoad', 'trafficRange', 'trafficAADT', 'trafficSource', 'dailyVisits', 'monthlyVisits', 'fuelDispensers', 'totalAuditCarriers', 'totalAdSpaces', 'freeAdSpaces', 'googleMapsUrl', 'googleStreetViewUrl'];
      showToast('Nastavená šablóna Marketing, Návštevnosť a Nosiče (17 stĺpcov).');
    }

    setSelectedColumnIds(ids);
  };

  // Generate rows for export based on active columns
  const generateExportData = () => {
    const columns = activeExportColumns;
    if (columns.length === 0) {
      return { headers: [] as string[], rows: [] as Record<string, any>[], columns: [] as BranchExportColumnDef[] };
    }

    const headers = columns.map((c) => c.label);
    const rows = targetStations.map((station) => {
      const rowObj: Record<string, any> = {};
      columns.forEach((col) => {
        rowObj[col.label] = col.getValue(station, exportContext);
      });
      return rowObj;
    });

    return { headers, rows, columns };
  };

  // 1. Download Native Microsoft Excel (.xlsx)
  const handleDownloadXLSX = () => {
    const { headers, rows, columns } = generateExportData();
    if (columns.length === 0) {
      alert('Prosím, vyberte aspoň jeden stĺpec pre export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });

    // Set custom column widths
    worksheet['!cols'] = columns.map((c) => ({ wch: c.colWidth || 20 }));

    const workbook = XLSX.utils.book_new();
    const sheetName = exportMode === 'full' ? 'Všetky dáta pobočiek' : 'Vybrané dáta pobočiek';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const modeStr = exportMode === 'full' ? 'Kompletne' : `Vyber_${columns.length}_stlpce`;
    const scopeStr = exportScope === 'all' ? 'Vsetky_pobocky' : 'Vyfiltrovane';
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `DALIOIL_Pobocky_${modeStr}_${scopeStr}_${dateStr}.xlsx`;

    XLSX.writeFile(workbook, filename);
    showToast(`Súbor Excel (.xlsx) s ${columns.length} stĺpcami bol úspešne stiahnutý.`);
  };

  // 2. Download CSV (.csv) with UTF-8 BOM and semicolon
  const handleDownloadCSV = () => {
    const { headers, rows, columns } = generateExportData();
    if (columns.length === 0) {
      alert('Prosím, vyberte aspoň jeden stĺpec pre export.');
      return;
    }

    const escapeCell = (val: any) => {
      if (val === undefined || val === null) return '';
      const str = String(val);
      if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerLine = headers.map(escapeCell).join(';');
    const rowLines = rows.map((r) => headers.map((h) => escapeCell(r[h])).join(';'));
    const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

    const modeStr = exportMode === 'full' ? 'Kompletne' : `Vyber_${columns.length}_stlpce`;
    const scopeStr = exportScope === 'all' ? 'Vsetky_pobocky' : 'Vyfiltrovane';
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `DALIOIL_Pobocky_${modeStr}_${scopeStr}_${dateStr}.csv`;

    downloadFile(csvContent, filename);
    showToast(`Súbor CSV s ${columns.length} stĺpcami bol úspešne stiahnutý.`);
  };

  // 3. Copy to clipboard (Tab-separated values for direct Ctrl+V into Excel or Sheets)
  const handleCopyToClipboard = async () => {
    const { headers, rows, columns } = generateExportData();
    if (columns.length === 0) return;

    const headerLine = headers.join('\t');
    const rowLines = rows.map((r) =>
      headers.map((h) => String(r[h] ?? '').replace(/[\t\r\n]/g, ' ')).join('\t')
    );
    const tsvContent = [headerLine, ...rowLines].join('\r\n');

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(tsvContent);
        setCopiedSuccess(true);
        showToast('Tabuľka skopírovaná do schránky! Vložte ju do Excelu pomocou Ctrl+V.');
        setTimeout(() => setCopiedSuccess(false), 2500);
      }
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = tsvContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedSuccess(true);
      showToast('Tabuľka skopírovaná do schránky (Ctrl+V).');
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="branch-excel-export-modal"
        className="w-full max-w-5xl bg-white dark:bg-[#121620] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-[#131c27] dark:via-[#141d25] dark:to-[#121620] border-b border-slate-200 dark:border-gray-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Export údajov pobočiek do Excelu
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                Vyberte si konkrétne položky pre export alebo zvoľte kompletné stiahnutie všetkých údajov siete DALIOIL
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

        {/* Status Toast Banner */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMessage}</span>
            </span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white ml-2 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-[#0e121a]">
          {/* 1. SEKCIA: VOĽBA REŽIMU EXPORTU (Kompletný vs Čiastočný) */}
          <div className="bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
                <span>1. Rozsah exportu a výber režimu</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                Cieľový súbor: <strong>{targetStations.length} pobočiek</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option A: Kompletný export */}
              <button
                type="button"
                onClick={() => handleApplyPreset('full')}
                className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  exportMode === 'full'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50/80 dark:bg-[#101520] border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                    exportMode === 'full'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 dark:border-gray-600'
                  }`}
                >
                  {exportMode === 'full' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Kompletný export
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      Všetky dáta ({BRANCH_EXPORT_COLUMNS.length} stĺpcov)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                    Exportuje všetky existujúce atribúty, adresy, GPS, kontakty, otváracie hodiny, audit nosičov aj Google odkazy do jedného uceleného súboru.
                  </p>
                </div>
              </button>

              {/* Option B: Čiastočný export */}
              <button
                type="button"
                onClick={() => setExportMode('partial')}
                className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  exportMode === 'partial'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50/80 dark:bg-[#101520] border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                    exportMode === 'partial'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 dark:border-gray-600'
                  }`}
                >
                  {exportMode === 'partial' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Čiastočný export
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                      Iba zaškrtnuté položky ({selectedColumnIds.length})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                    Výsledný súbor bude obsahovať výhradne tie stĺpce, ktoré zaškrtnete v zozname checkboxov nižšie.
                  </p>
                </div>
              </button>
            </div>

            {/* Scope toggle (All vs Filtered) & Options */}
            <div className="pt-2 border-t border-slate-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-gray-300">Pobočky:</span>
                <div className="flex items-center bg-slate-100 dark:bg-[#0d1117] p-0.5 rounded-lg border border-slate-200 dark:border-gray-800 text-[11px]">
                  <button
                    onClick={() => setExportScope('all')}
                    className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                      exportScope === 'all'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Všetky pobočky siete ({availableStations.length})
                  </button>
                  <button
                    onClick={() => setExportScope('filtered')}
                    className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                      exportScope === 'filtered'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Iba vyfiltrované v mape ({stations.length})
                  </button>
                </div>
              </div>

              {/* Format options */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 dark:text-gray-400 select-none">
                  <input
                    type="checkbox"
                    checked={useStandardHours}
                    onChange={(e) => setUseStandardHours(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                  />
                  <span>Google formát hodín (00:00-24:00)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 dark:text-gray-400 select-none">
                  <input
                    type="checkbox"
                    checked={fallbackManagerPhone}
                    onChange={(e) => setFallbackManagerPhone(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
                  />
                  <span>Doplniť tel. vedúceho pri termináloch</span>
                </label>
              </div>
            </div>
          </div>

          {/* 2. SEKCIA: OVLÁDANIE CHECKBOXOV A VÝBER STĹPCOV */}
          <div className="bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-3">
            {/* Header controls with "Vybrať všetko" and "Zrušiť všetko" */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-emerald-500" />
                  <span>2. Výber stĺpcov do exportu</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                  Vyberte si požadované stĺpce zaškrtnutím jednotlivých políčok, kategórií alebo rýchlych šablón.
                </p>
              </div>

              {/* Buttons: Vybrať všetko / Zrušiť všetko */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  id="btn-select-all-columns"
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Označiť všetky stĺpce v databáze"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Vybrať všetko ({BRANCH_EXPORT_COLUMNS.length})</span>
                </button>

                <button
                  type="button"
                  id="btn-deselect-all-columns"
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Odznačiť všetky zaškrtávacie políčka"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Zrušiť všetko</span>
                </button>
              </div>
            </div>

            {/* Quick Templates Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-gray-800/80">
              <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Rýchle šablóny:</span>
              </span>

              <button
                type="button"
                onClick={() => handleApplyPreset('google')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 text-[11px] font-medium border border-slate-200 dark:border-gray-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>Google Profil (18)</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('basic')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 text-[11px] font-medium border border-slate-200 dark:border-gray-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>Základný prehľad (11)</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('contacts')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 text-[11px] font-medium border border-slate-200 dark:border-gray-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>Kontakty & Manažéri (12)</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('marketing')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 text-[11px] font-medium border border-slate-200 dark:border-gray-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>Marketing & Nosiče (13)</span>
              </button>
            </div>

            {/* Filter and Category Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
              {/* Category pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition cursor-pointer text-[11px] ${
                    activeCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-gray-800/80 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Všetky kategórie ({BRANCH_EXPORT_COLUMNS.length})
                </button>
                {categories.map((cat) => {
                  const catColIds = BRANCH_EXPORT_COLUMNS.filter((c) => c.category === cat.id).map((c) => c.id);
                  const selectedCount = catColIds.filter((id) => selectedColumnIds.includes(id)).length;
                  const isActive = activeCategoryFilter === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer text-[11px] flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-gray-800/80 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[9px] font-mono px-1 rounded-full ${
                          isActive
                            ? 'bg-black/20 text-white'
                            : 'bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                        }`}
                      >
                        {selectedCount}/{cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search in columns */}
              <div className="relative w-full sm:w-60 shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={columnSearch}
                  onChange={(e) => setColumnSearch(e.target.value)}
                  placeholder="Hľadať v stĺpcoch..."
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                />
                {columnSearch && (
                  <button
                    onClick={() => setColumnSearch('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Checkbox Grid Grouped by Category */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {categories
                .filter((cat) => activeCategoryFilter === 'all' || activeCategoryFilter === cat.id)
                .map((cat) => {
                  const catCols = displayColumns.filter((c) => c.category === cat.id);
                  if (catCols.length === 0) return null;

                  const allCatColIds = BRANCH_EXPORT_COLUMNS.filter((c) => c.category === cat.id).map((c) => c.id);
                  const isAllCatSelected = allCatColIds.every((id) => selectedColumnIds.includes(id));
                  const selectedInCat = allCatColIds.filter((id) => selectedColumnIds.includes(id)).length;

                  return (
                    <div
                      key={cat.id}
                      className="border border-slate-200/80 dark:border-gray-800/80 rounded-xl p-3 bg-slate-50/40 dark:bg-[#10141d]"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200 dark:border-gray-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 dark:text-gray-200">
                            {cat.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {selectedInCat} z {cat.count} vybraných
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleCategory(cat.id)}
                          className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          {isAllCatSelected ? 'Zrušiť kategóriu' : 'Označiť celú kategóriu'}
                        </button>
                      </div>

                      {/* Columns Checkbox Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {catCols.map((col) => {
                          const isChecked =
                            exportMode === 'full' || selectedColumnIds.includes(col.id);

                          return (
                            <label
                              key={col.id}
                              className={`p-2.5 rounded-xl border transition flex items-start gap-2.5 cursor-pointer select-none ${
                                isChecked
                                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60 shadow-2xs'
                                  : 'bg-white dark:bg-[#151b27] border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleColumn(col.id)}
                                className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-gray-700 dark:bg-gray-800 cursor-pointer shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {col.label}
                                  </span>
                                  {col.googleProfileDefault && (
                                    <span
                                      className="px-1 py-0.2 rounded text-[9px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 shrink-0"
                                      title="Odporúčané pre Google Firemný Profil"
                                    >
                                      Google
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                  {col.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 3. SEKCIA: ŽIVÝ NÁHĽAD VÝSTUPNÝCH STĹPCOV */}
          <div className="bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Náhľad stĺpcov v exportovanom súbore ({activeExportColumns.length})</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-gray-400">
                Poradie stĺpcov zľava doprava 👉
              </span>
            </div>

            {activeExportColumns.length === 0 ? (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Nie je vybraný žiadny stĺpec. Prosím, zaškrtnite aspoň jeden stĺpec alebo kliknite na &quot;Vybrať všetko&quot;.</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-gray-800">
                {activeExportColumns.map((col, idx) => (
                  <span
                    key={col.id}
                    className="px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700 shadow-2xs flex items-center gap-1"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{idx + 1}.</span>
                    <span>{col.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Primary Download Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-100 dark:bg-[#151c28] border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Pripravené na stiahnutie: <strong className="text-slate-900 dark:text-white font-mono">{activeExportColumns.length} stĺpcov</strong> •{' '}
              <strong className="text-slate-900 dark:text-white font-mono">{targetStations.length} riadkov</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 font-bold text-xs transition cursor-pointer"
            >
              Zavrieť
            </button>

            {/* Copy to Clipboard (Ctrl+V ready for Excel) */}
            <button
              type="button"
              id="branch-export-copy-clipboard-btn"
              onClick={handleCopyToClipboard}
              disabled={activeExportColumns.length === 0}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                copiedSuccess
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 border-slate-200 dark:border-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed shadow-xs`}
              title="Skopírovať tabuľku s vybranými stĺpcami do schránky (v Exceli stačí stlačiť Ctrl+V)"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Skopírované!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Kopírovať (Ctrl+V)</span>
                </>
              )}
            </button>

            {/* CSV Download Button */}
            <button
              type="button"
              id="branch-export-download-csv-btn"
              onClick={handleDownloadCSV}
              disabled={activeExportColumns.length === 0}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              title="Stiahnuť súbor CSV so slovenskou diakritikou (UTF-8 BOM a oddeľovač bodkočiarka)"
            >
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Stiahnuť CSV</span>
            </button>

            {/* PRIMARY Native XLSX Download Button */}
            <button
              type="button"
              id="branch-export-download-xlsx-btn"
              onClick={handleDownloadXLSX}
              disabled={activeExportColumns.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-950/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Vygenerovať a stiahnuť Microsoft Excel (.xlsx) súbor so zvolenými stĺpcami"
            >
              <Download className="w-4 h-4" />
              <span>Stiahnuť Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
