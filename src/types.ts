export type RegionId = 'zapad' | 'sever' | 'stred' | 'vychod';

export type StationTypeFilter = 'all' | 'stations' | 'terminals';

export type AdStatusFilter = 'all' | 'free' | 'expiring' | 'occupied' | 'reserved' | 'promo';

export type ZoneNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type AdZone =
  | 'zona-1'
  | 'zona-2'
  | 'zona-3'
  | 'zona-4'
  | 'zona-5'
  | 'zona-6'
  | 'zona-7'
  | 'zona-8'
  | 'zona-9'
  | 'zona-10'
  | 'zona-11'
  | 'zona-12'
  | string;

export type AdTypeFilter =
  | 'all'
  | 'zona-1'
  | 'zona-2'
  | 'zona-3'
  | 'zona-4'
  | 'zona-5'
  | 'zona-6'
  | 'zona-7'
  | 'zona-8'
  | 'zona-9'
  | 'zona-10'
  | 'zona-11'
  | 'zona-12';

export type RoadTypeFilter =
  | 'all'
  | 'Diaľnica D1/R1'
  | 'Tranzit 1. triedy'
  | 'Mestská lokalita'
  | 'Vidiecka / Regionálna';

export interface SalesRep {
  name: string;
  phone: string;
  phoneRaw: string;
  email: string;
  title?: string;
}

export interface RegionInfo {
  id: RegionId;
  name: string;
  shortName: string;
  color: string;
  badgeBg: string;
  rep: SalesRep;
}

export interface StationReceiptsHistory {
  monthly: number[]; // [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct]
  total: number;
  monthlyAverage: number;
  dailyAverage?: number; // Prepočítaný denný priemer vydaných dokladov / bločkov (priemer / 30)
  peakMonth?: string;
  peakValue?: number;
  peakDailyValue?: number; // Prepočítaný denný priemer v najsilnejšom mesiaci
}

export type StationDetailTab = 'photos' | 'ads' | 'info' | 'incidents' | 'audit' | 'lcd';

// TABUĽKA 1: Prehľad čerpacích staníc (Master Lokality)
export interface Station {
  id: number;
  stationCode: string; // Kód predajne, napr. "DALIOIL_001" alebo "CS-001"
  storeCode?: string; // Oficiálny kód predajne z dokumentu, napr. "DALIOIL_001"
  name: string; // Názov prevádzky / Lokality, napr. "Bratislava-Vajnory"
  companyName?: string; // Názov firmy z dokumentu, napr. "DALI OIL - Bratislava-Vajnory"
  region: RegionId;
  lat: number; // GPS_Latitude (presné koordináty z dokumentu)
  lng: number; // GPS_Longitude (presné koordináty z dokumentu)
  number: string;
  isTerminal: boolean;
  isHeadquarters?: boolean; // Označenie pre Centrálu DALITRANS / DALIOIL
  hasLcdScreens?: boolean; // Indikátor dostupnosti komerčných LCD obrazoviek (false pre Centrálu DALITRANS)
  hasAdSpaces?: boolean; // Indikátor existencie komerčných reklamných plôch (false pre Centrálu DALITRANS)
  isNew: boolean;
  note: string;
  exportLat?: number; // Presná zemepisná šírka pre export tabuliek
  exportLng?: number; // Presná zemepisná dĺžka pre export tabuliek
  street?: string; // Prvý riadok adresy, napr. "Púchovská ul.10182/18"
  city?: string; // Lokalita z dokumentu, napr. "Bratislava-Vajnory"
  zip?: string; // Poštové smerovacie číslo (PSČ), napr. "831 06"
  country?: string; // Krajina / oblasť, napr. "SK"
  phone?: string; // Hlavné telefónne číslo z dokumentu, napr. "+421905033292"
  web?: string; // Webová adresa z dokumentu, napr. "https://dalioil.sk/bratislava-vajnory/"
  category?: string; // Hlavná kategória, napr. "Čerpacia stanica"
  openingHours?: string; // Otváracie hodiny z dokumentu, napr. "00:00-24:00" (NONSTOP) alebo "05:00-23:00"
  kraj?: string; // Kraj (Bratislavský, Trnavský, Trenčiansky, Nitriansky, Žilinský, Banskobystrický, Prešovský, Košický)
  okres?: string; // Okres
  roadType?: 'Diaľnica D1/R1' | 'Tranzit 1. triedy' | 'Mestská lokalita' | 'Vidiecka / Regionálna'; // Typ_Tahu
  monthlyVisitsCashier?: number; // Reálna priemerná mesačná návštevnosť / počet vydaných bločkov pri pokladni
  dailyVisitsCashier?: number; // Prepočítaná denná návštevnosť / počet vydaných bločkov denne pri pokladni (mesačne / 30)
  receiptsHistory?: StationReceiptsHistory; // Audit vydaných bločkov podľa mesiacov
  trafficIntensityAADT?: number; // Intenzita_Dopravy_AADT (denný prejazd áut podľa CSD)
  affectedRoad?: string; // Dotknutá komunikácia z CSD (napr. Cesta I/61, Cesta I/18, Miestna kom.)
  trafficRange?: string; // Odhadovaná intenzita dopravy voz./24h (napr. 18 000 – 24 000)
  trafficSource?: string; // Zdroj a rok sčítania (napr. Slovenská správa ciest (CSD 2022/2023))
  email?: string; // Oficiálny email ČS, napr. "bava@dalioil.sk"
  manager?: string; // Vedúci stanice / prevádzky
  managerPhone?: string; // Telefón vedúceho prevádzky
  services?: string; // Doplnkové služby (ROADSHOP, DALI CAFE, atď.)
  googleMapsUrl?: string; // Priamy overený odkaz na Google Mapy
  googleStreetViewUrl?: string; // Priamy overený odkaz na Google Street View 360°
  isGoogleVerified?: boolean; // Overený oficiálny link z dokumentácie DALIOIL
}

// TABUĽKA 2: Reklamné plochy a Prenájmy (Master Reklama)
export type AdCategory = 'Exteriér' | 'Interiér' | 'Vstup' | 'Sociálne zariadenia' | 'Umyváreň';

export type AdType =
  | 'Zóna 1: Totem & Vstup'
  | 'Zóna 2: Výdajné stojany & Prístrešok'
  | 'Zóna 3: Vstupná zóna do shopu'
  | 'Zóna 4: Pokladničná zóna & Pult'
  | 'Zóna 5: Predajňa & Regály'
  | 'Zóna 6: DALI Cafe & Posedenie'
  | 'Zóna 7: Fasáda budovy & Vchod'
  | 'Zóna 8: Parkovisko & Komunikácia'
  | 'Zóna 9: Výjazd zo stanice'
  | 'Zóna 10: Autoumyváreň & Portál'
  | 'Zóna 11: Vonkajšia terasa & Sedenie'
  | 'Zóna 12: Servisný ostrovček & Kompresor'
  | string;

export type AdStatus = 'free' | 'occupied' | 'reserved' | 'expiring' | 'promo' | 'maintenance';

export interface AdPhotoAngle {
  label: string;
  url: string;
  thumb?: string;
}

export interface AdPhotos {
  zlava?: string | null;
  stred?: string | null;
  sprava?: string | null;
  additional?: AdPhotoAngle[];
}

export interface AdSpace {
  id: string; // ID_Plochy, napr. "CS001-Z01"
  stationId: number; // ID_Stanice (väzba na Tabuľku 1)
  stationName?: string;
  category: AdCategory; // Kategoria (Exteriér / Interiér)
  type: AdType; // Typ_Nosica
  zoneNumber?: number; // Číslo zóny 1-12
  zoneName?: string; // Názov zóny: napr. "Zóna 3 – Vstupná zóna do shopu"
  zone?: AdZone; // Kľúč zóny (napr. zona-3)
  name: string; // Názov nosiča
  side: string; // Strana_Orientacia
  dimensions: string; // Rozmer_cm (Šírka x Výška)
  illumination: 'Osvetlené' | 'Neosvetlené' | 'Digitál (DOOH)' | 'Podsvietené (Backlight)' | string; // Osvetlenie
  status: AdStatus; // Status_Plochy
  client?: string | null; // Aktualny_Klient
  campaign?: string | null; // Nazov_Kampane
  dateStart?: string | null; // Datum_Zaciatok
  dateEnd?: string | null; // Datum_Koniec
  daysLeft?: number | null; // Dni_Do_Konca
  monthlyPriceEur: number; // Mesacna_Cena_EUR (nacenenie podľa lokality)
  dailyPriceEur?: number; // Denná trhová sadzba EUR/deň (30 dní)
  cpmPriceEur?: number; // CPT / CPM (Cena za 1000 zobrazení)
  contractNumber?: string | null;
  billingStatus?: 'Zaplatené' | 'Fakturované' | 'Neuhradené' | 'Končí zmluva (upozornenie)' | 'Rezervácia (čaká na zálohu)' | string | null;
  exclusivity?: string | null;
  photoUrl?: string | null; // Hlavná fotka (Google Drive)
  photoThumbnail?: string | null; // Google CDN priamy náhľad
  photos?: AdPhotos; // Uhly pohľadu: zľava, stred, sprava
  photoThumbnails?: AdPhotos;
  auditStatus?: 'Kompletné' | 'Chýba fotka';
  inspector?: string; // Vedúci / inšpektor z tabuľky
  valuationBreakdown?: string; // Transparentné vysvetlenie hodnoty podľa lokality
  technicalCondition?: 'V poriadku' | 'Potrebná oprava' | 'Chýba osvetlenie' | string | null;
  lastInspectionDate?: string | null;
  notes?: string | null;
}

// Mediaplán pre plánovanie OOH kampane
export interface CampaignPlanItem {
  adSpace: AdSpace;
  station: Station;
  addedAt: number;
}

export interface MapSettings {
  isolateSlovakia: boolean;
  maskOpacity: number;
  boundaryColor: string;
  boundaryGlow: boolean;
  tileStyle: 'voyager' | 'dark' | 'satellite';
}

// ==========================================
// INCIDENTY A POŠKODENÉ PLOCHY (SERVIS OOH)
// ==========================================
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'new' | 'in_progress' | 'waiting_parts' | 'resolved';

export type IncidentType =
  | 'broken_lighting' // Nefunkčné osvetlenie / backlight
  | 'damaged_banner' // Roztrhnutý / uvoľnený banner / fólia
  | 'vandalism' // Vandalizmus / grafiti
  | 'structural_damage' // Mechanické poškodenie konštrukcie / rámu
  | 'glass_crack' // Rozbité sklo / plexisklo na CLV
  | 'screen_failure' // Výpadok digitálnej obrazovky (DOOH)
  | 'obstruction' // Znečistenie / zatienená viditeľnosť (zeleň)
  | 'other'; // Iná porucha

export interface ServiceNote {
  id: string;
  author: string;
  createdAt: string;
  text: string;
}

export interface AdIncident {
  id: string; // napr. "INC-2026-001"
  adSpaceId: string; // ID nosiča, napr. "CS001-BB-01"
  adSpaceName: string;
  adSpaceType: string;
  stationId: number; // ID stanice
  stationName: string;
  stationCode: string;
  regionId: RegionId;
  type: IncidentType;
  typeLabel: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string;
  reportedBy: string; // Meno a rola nahlasovateľa (napr. "OZ Henrieta Chlebanová")
  reporterContact?: string;
  reportedAt: string; // YYYY-MM-DD HH:mm
  targetResolutionDate?: string; // YYYY-MM-DD
  resolvedAt?: string; // YYYY-MM-DD HH:mm
  estimatedCostEur?: number;
  actualCostEur?: number;
  serviceNotes?: ServiceNote[];
}

// ==========================================
// FAREBNÉ OZNAČENIE & ŠTÝL POINTOV (MARKER STYLING & COLOR TAGS)
// ==========================================
export type MarkerColorMode =
  | 'custom-tags'   // Podľa vlastných priradených farebných značiek (Moje tagy)
  | 'region'        // Podľa regiónu a Area manažéra (Západ, Sever, Stred, Východ)
  | 'ad-status'     // Podľa obsadenosti reklamných plôch (Voľné = zelená, Končí = jantár, Plné = červená)
  | 'station-type'  // ČS vs Terminál vs Centrála
  | 'dalioil-red'   // Oficiálna firemná DALIOIL červená
  | 'custom';       // Vlastná jednotná farba

export type PrintMarkerColorMode = MarkerColorMode;

export type MarkerLabelMode =
  | 'logo'       // Iba logo DALIOIL / ikona
  | 'code'       // Kód stanice (napr. 001, 010)
  | 'number'     // Poradové číslo (#1, #2)
  | 'city'       // Názov lokality / mesta pod pointom
  | 'code-city'; // Kód + mesto pod pointom

export type PrintMarkerLabelMode = MarkerLabelMode;

export interface CurrentMapViewInfo {
  center?: { lat: number; lng: number };
  zoom?: number;
  tileTheme?: 'light' | 'dark' | 'standard';
  isolateSlovakia?: boolean;
  activeFilterTitle?: string;
  displayedStationsCount?: number;
}



