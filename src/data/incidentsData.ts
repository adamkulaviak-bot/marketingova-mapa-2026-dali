import { AdIncident, IncidentType, IncidentSeverity, IncidentStatus, RegionId } from '../types';

export const INCIDENT_TYPE_LABELS: Record<IncidentType, { label: string; icon: string; defaultCost: number }> = {
  broken_lighting: {
    label: 'Nefunkčné osvetlenie / backlight',
    icon: '💡',
    defaultCost: 120,
  },
  damaged_banner: {
    label: 'Poškodený / uvoľnený banner / fólia',
    icon: '🚩',
    defaultCost: 90,
  },
  vandalism: {
    label: 'Vandalizmus / grafiti / znečistenie',
    icon: '🎨',
    defaultCost: 75,
  },
  structural_damage: {
    label: 'Mechanické poškodenie rámu / konštrukcie',
    icon: '🔨',
    defaultCost: 280,
  },
  glass_crack: {
    label: 'Prasknuté sklo / plexisklo na CLV',
    icon: '⚡',
    defaultCost: 190,
  },
  screen_failure: {
    label: 'Výpadok digitálnej obrazovky (DOOH)',
    icon: '🖥️',
    defaultCost: 350,
  },
  obstruction: {
    label: 'Zatienená viditeľnosť / zarastená zeleň',
    icon: '🌿',
    defaultCost: 60,
  },
  other: {
    label: 'Iná technická porucha / závada',
    icon: '⚠️',
    defaultCost: 100,
  },
};

export const SEVERITY_CONFIG: Record<
  IncidentSeverity,
  { label: string; bg: string; text: string; border: string; badge: string }
> = {
  critical: {
    label: 'Kritická (Urgentná)',
    bg: 'bg-red-500/15',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-500/40',
    badge: 'bg-red-600 text-white',
  },
  high: {
    label: 'Vysoká priorita',
    bg: 'bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/40',
    badge: 'bg-amber-500 text-slate-950 font-bold',
  },
  medium: {
    label: 'Stredná',
    bg: 'bg-blue-500/15',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-500/40',
    badge: 'bg-blue-600 text-white',
  },
  low: {
    label: 'Nízka (Kozmetická)',
    bg: 'bg-slate-500/15',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-500/40',
    badge: 'bg-slate-500 text-white',
  },
};

export const STATUS_CONFIG: Record<
  IncidentStatus,
  { label: string; badgeBg: string; textColor: string; icon: string }
> = {
  new: {
    label: 'Nové hlásenie',
    badgeBg: 'bg-red-100 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
    textColor: 'text-red-600',
    icon: '🔴',
  },
  in_progress: {
    label: 'V riešení / Objednaný servis',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    textColor: 'text-amber-600',
    icon: '🟡',
  },
  waiting_parts: {
    label: 'Čaká sa na tlač / náhradný diel',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/80 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300',
    textColor: 'text-purple-600',
    icon: '🟣',
  },
  resolved: {
    label: 'Vyriešené / Opravené',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
    textColor: 'text-emerald-600',
    icon: '🟢',
  },
};

// Vstupné reálne vzorové incidenty pre okamžitý prehľad naviazané na reálne reklamné nosiče
export const INITIAL_INCIDENTS: AdIncident[] = [
  {
    id: 'INC-2026-001',
    adSpaceId: 'AD-REAL-127',
    adSpaceName: 'Dolný Hričov – Zóna 11: Terasa',
    adSpaceType: 'Zóna 11: Vonkajšia terasa & Sedenie',
    stationId: 15,
    stationName: 'Dolný Hričov',
    stationCode: 'CS-015',
    regionId: 'sever',
    type: 'damaged_banner',
    typeLabel: 'Poškodený / uvoľnený banner / fólia',
    severity: 'high',
    status: 'in_progress',
    title: 'Uvoľnené kotvenie terasového banneru po silnom vetre',
    description: 'Po nočnom vetre sa uvoľnili dve horné napínacie očká na veľkoplošnom banneri. Klient hlásil zníženú stabilitu vizuálu.',
    reportedBy: 'Henrieta Chlebanová (OZ Sever)',
    reporterContact: '+421 905 633 001',
    reportedAt: '2026-09-18 08:30',
    targetResolutionDate: '2026-09-22',
    estimatedCostEur: 140,
    serviceNotes: [
      {
        id: 'note-1',
        author: 'Henrieta Chlebanová',
        createdAt: '2026-09-18 09:10',
        text: 'Nahlásené servisnému partnerovi v Žiline. Diagnostika a prepnutie lán naplánované na 20.09.',
      },
      {
        id: 'note-2',
        author: 'Servisný technik',
        createdAt: '2026-09-19 14:00',
        text: 'Náhradné napínacie oká a oceľové lanká pripravené, montáž prebehne v pondelok ráno.',
      },
    ],
  },
  {
    id: 'INC-2026-002',
    adSpaceId: 'AD-REAL-025',
    adSpaceName: 'Bratislava-Vajnory – Zóna 3: Vstup do shopu',
    adSpaceType: 'Zóna 3: Vstupná zóna do shopu',
    stationId: 1,
    stationName: 'Bratislava-Vajnory',
    stationCode: 'CS-001',
    regionId: 'zapad',
    type: 'vandalism',
    typeLabel: 'Vandalizmus / grafiti / znečistenie',
    severity: 'medium',
    status: 'waiting_parts',
    title: 'Znečistený spodný roh okenného polepu',
    description: 'Pri vchode do predajne došlo k mechanickému poškriabaniu spodnej ochrannej laminácie dverí nákupným vozíkom.',
    reportedBy: 'Peter Kováč (Vedúci ČS)',
    reporterContact: '+421 905 033 292',
    reportedAt: '2026-09-17 11:15',
    targetResolutionDate: '2026-09-21',
    estimatedCostEur: 85,
    serviceNotes: [
      {
        id: 'note-3',
        author: 'Enikó Kelecsényiová',
        createdAt: '2026-09-17 12:45',
        text: 'Dočasne očistené personálom ČS. Zadaná dotlač náhradného spodného dielca polepu.',
      },
    ],
  },
  {
    id: 'INC-2026-003',
    adSpaceId: 'AD-REAL-068',
    adSpaceName: 'Košice - Dargovských Hrdinov – Portálová umyváreň č. 1',
    adSpaceType: 'Portálová autoumyváreň (Atika / Portál)',
    stationId: 38,
    stationName: 'Košice - Dargovských Hrdinov',
    stationCode: 'CS-038',
    regionId: 'vychod',
    type: 'structural_damage',
    typeLabel: 'Mechanické poškodenie rámu / konštrukcie',
    severity: 'critical',
    status: 'in_progress',
    title: 'Uvoľnený ochranný kryt atiky umyvárne',
    description: 'Vplyvom vibrácií z umývacieho portálu sa uvoľnila pravá bočná lišta rámu reklamného panelu.',
    reportedBy: 'Zuzana Matejovská (OZ Východ)',
    reporterContact: '+421 905 670 046',
    reportedAt: '2026-09-18 16:40',
    targetResolutionDate: '2026-09-23',
    estimatedCostEur: 160,
    serviceNotes: [
      {
        id: 'note-4',
        author: 'Zuzana Matejovská',
        createdAt: '2026-09-19 10:00',
        text: 'Objednaný servisný zásah a spevnenie konštrukcie nosiča.',
      },
    ],
  },
  {
    id: 'INC-2026-004',
    adSpaceId: 'AD-REAL-043',
    adSpaceName: 'Tupá – Zóna 3: Vstupná zóna do shopu',
    adSpaceType: 'Zóna 3: Vstupná zóna do shopu',
    stationId: 25,
    stationName: 'Tupá',
    stationCode: 'CS-025',
    regionId: 'stred',
    type: 'damaged_banner',
    typeLabel: 'Poškodený / uvoľnený banner / fólia',
    severity: 'low',
    status: 'new',
    title: 'Odlepujúci sa roh polepu pri kľučke',
    description: 'Častým dotykom kľučky dverí sa mierne nadvihla samolepiaca fólia. Odporúčaná lokálna oprava teplovzdušnou pištoľou.',
    reportedBy: 'Ladislav Hegedus (OZ Stred)',
    reporterContact: '+421 905 387 258',
    reportedAt: '2026-09-19 14:20',
    targetResolutionDate: '2026-09-25',
    estimatedCostEur: 45,
    serviceNotes: [],
  },
  {
    id: 'INC-2026-005',
    adSpaceId: 'AD-REAL-052',
    adSpaceName: 'Tupá – Zóna 10: Autoumyváreň',
    adSpaceType: 'Zóna 10: Autoumyváreň & Portál',
    stationId: 25,
    stationName: 'Tupá',
    stationCode: 'CS-025',
    regionId: 'stred',
    type: 'obstruction',
    typeLabel: 'Zatienená viditeľnosť / zarastená zeleň',
    severity: 'low',
    status: 'resolved',
    title: 'Zarastené vetvy stromov zakrývali nájazdový uhol',
    description: 'Rýchly rast konárov z priľahlého pozemku čiastočne tienil pohľad na box ručného umývania.',
    reportedBy: 'Ladislav Hegedus (OZ Stred)',
    reporterContact: '+421 905 387 258',
    reportedAt: '2026-09-02 09:00',
    resolvedAt: '2026-09-04 15:30',
    estimatedCostEur: 50,
    actualCostEur: 45,
    serviceNotes: [
      {
        id: 'note-5',
        author: 'Ladislav Hegedus',
        createdAt: '2026-09-04 16:00',
        text: 'V spolupráci s údržbou ČS realizovaný orez krov a vetiev. Viditeľnosť nosiča 100% obnovená.',
      },
    ],
  },
];

const STORAGE_KEY = 'senior_ooh_incidents_v3';
const EVENT_NAME = 'senior_ooh_incidents_changed';

/** Načítanie incidentov z localStorage s fallbackom na počiatočné dáta */
export function getStoredIncidents(): AdIncident[] {
  if (typeof window === 'undefined') return INITIAL_INCIDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_INCIDENTS;
  } catch {
    return INITIAL_INCIDENTS;
  }
}

/** Uloženie incidentov a notifikácia komponentov */
export function saveStoredIncidents(incidents: AdIncident[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { incidents } }));
  } catch (err) {
    console.error('Chyba pri ukladaní incidentov:', err);
  }
}

/** Pridanie nového incidentu */
export function createNewIncident(
  data: Omit<AdIncident, 'id' | 'reportedAt' | 'serviceNotes'> & {
    initialNote?: string;
  }
): AdIncident {
  const current = getStoredIncidents();
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

  const nextNum = current.length + 1;
  const newId = `INC-${yyyy}-${String(nextNum).padStart(3, '0')}`;

  const serviceNotes = data.initialNote
    ? [
        {
          id: `note-${Date.now()}`,
          author: data.reportedBy,
          createdAt: dateStr,
          text: data.initialNote,
        },
      ]
    : [];

  const newIncident: AdIncident = {
    ...data,
    id: newId,
    reportedAt: dateStr,
    serviceNotes,
  };

  const updated = [newIncident, ...current];
  saveStoredIncidents(updated);
  return newIncident;
}

/** Zmena statusu incidentu */
export function updateIncidentStatus(
  id: string,
  status: IncidentStatus,
  resolutionNote?: string,
  actualCost?: number
): void {
  const current = getStoredIncidents();
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

  const updated = current.map((inc) => {
    if (inc.id !== id) return inc;

    const notes = [...(inc.serviceNotes || [])];
    if (resolutionNote) {
      notes.push({
        id: `note-${Date.now()}`,
        author: 'Manažér servisu',
        createdAt: dateStr,
        text: resolutionNote,
      });
    }

    return {
      ...inc,
      status,
      resolvedAt: status === 'resolved' ? (inc.resolvedAt || dateStr) : undefined,
      actualCostEur: actualCost !== undefined ? actualCost : inc.actualCostEur,
      serviceNotes: notes,
    };
  });

  saveStoredIncidents(updated);
}

/** Pridanie servisnej poznámky */
export function addIncidentServiceNote(id: string, text: string, author: string): void {
  const current = getStoredIncidents();
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd} ${hh}:${min}`;

  const updated = current.map((inc) => {
    if (inc.id !== id) return inc;
    const notes = [...(inc.serviceNotes || [])];
    notes.push({
      id: `note-${Date.now()}`,
      author,
      createdAt: dateStr,
      text,
    });
    return { ...inc, serviceNotes: notes };
  });

  saveStoredIncidents(updated);
}

/** Zmazanie incidentu */
export function deleteIncident(id: string): void {
  const current = getStoredIncidents();
  const updated = current.filter((inc) => inc.id !== id);
  saveStoredIncidents(updated);
}

/** Získanie incidentov pre konkrétnu stanicu */
export function getStationIncidents(stationId: number): AdIncident[] {
  const all = getStoredIncidents();
  return all.filter((i) => i.stationId === stationId);
}

/** Získanie incidentov pre konkrétny reklamný nosič */
export function getAdSpaceIncidents(adSpaceId: string): AdIncident[] {
  const all = getStoredIncidents();
  return all.filter((i) => i.adSpaceId === adSpaceId);
}

/** Globálna štatistika incidentov */
export function getIncidentsSummary(): {
  total: number;
  active: number;
  critical: number;
  inProgress: number;
  resolved: number;
  totalEstimatedCost: number;
} {
  const all = getStoredIncidents();
  const active = all.filter((i) => i.status !== 'resolved');
  const critical = active.filter((i) => i.severity === 'critical');
  const inProgress = active.filter((i) => i.status === 'in_progress' || i.status === 'waiting_parts');
  const resolved = all.filter((i) => i.status === 'resolved');
  const totalEstimatedCost = active.reduce((acc, curr) => acc + (curr.estimatedCostEur || 0), 0);

  return {
    total: all.length,
    active: active.length,
    critical: critical.length,
    inProgress: inProgress.length,
    resolved: resolved.length,
    totalEstimatedCost,
  };
}
