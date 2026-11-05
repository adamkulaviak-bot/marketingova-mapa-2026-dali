// Definície 12 marketingových zón DALIOIL napojené výhradne na originálne fotografie z Google Drive (zber_fotiek 2026)
import { STATION_ZONE_FOLDERS, getStationZoneFolder, StationZoneFolder } from './stationPhotoFolders';

export interface ZoneDefinition {
  zoneNumber: number;
  code: string;
  name: string;
  shortName: string;
  category: 'exterior' | 'interior' | 'services';
  categoryLabel: string;
  description: string;
  iconName: string;
  accentColor: string;
  gradient: string;
  typicalFormats: string[];
  typicalDimensions: string;
  illuminationType: string;
  targetAudience: string;
}

export const ZONE_DEFINITIONS: ZoneDefinition[] = [
  {
    zoneNumber: 1,
    code: '1_Prijazdova zona od cesty',
    name: 'Zóna 1: Príjazdová zóna & Vjazdový totem',
    shortName: 'Príjazd & Totem',
    category: 'exterior',
    categoryLabel: 'Exteriér',
    description: 'Vjazdové cenové totemy, príjazdové pásy, orientačné a smerové tabule od hlavnej komunikácie.',
    iconName: 'Navigation',
    accentColor: '#ef4444',
    gradient: 'from-red-600 to-amber-600',
    typicalFormats: ['Cenový totem (pylón)', 'Smerová navigačná tabuľa', 'Veľkoformátový billboard 504×238 cm'],
    typicalDimensions: '200 × 600 cm / 504 × 238 cm',
    illuminationType: 'Obojstranný integrovaný LED podsvit',
    targetAudience: 'Vodiči prichádzajúci z hlavnej cesty a diaľničných privádzačov',
  },
  {
    zoneNumber: 2,
    code: '2_Zona pri vydajnych stojanoch',
    name: 'Zóna 2: Výdajné stojany & Tankovacie ostrovy',
    shortName: 'Výdajné stojany',
    category: 'exterior',
    categoryLabel: 'Exteriér',
    description: 'Čelné plochy stĺpov prestrešenia, stojanové reklamné rámiky, pištoľové nosiče (Nozzle ads) a atika.',
    iconName: 'Fuel',
    accentColor: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    typicalFormats: ['Plochy na stĺpoch prestrešenia', 'Stojanové A3/A4 kliprámy', 'Nozzle pištoľové bannery', 'Atika prestrešenia'],
    typicalDimensions: '80 × 120 cm / A3 / 600 × 80 cm',
    illuminationType: 'Priame LED stropné osvetlenie prestrešenia ČS',
    targetAudience: '100% zákazníkov tankujúcich pohonné hmoty (priemerný čas kontaktu 3–5 minút)',
  },
  {
    zoneNumber: 3,
    code: '3_Vstupna zona do shopu',
    name: 'Zóna 3: Vstupná zóna do shopu & Presklené dvere',
    shortName: 'Vstup do shopu',
    category: 'exterior',
    categoryLabel: 'Exteriér / Vstup',
    description: 'Automatické presklené dvere do predajne, vstupné citylight vitríny, uvítacie sklá a výklady.',
    iconName: 'LogIn',
    accentColor: '#10b981',
    gradient: 'from-emerald-600 to-teal-600',
    typicalFormats: ['Presklené vstupné plochy', 'Obojstranný vstupný Citylight', 'Podlahová grafika pri vchode'],
    typicalDimensions: '110 × 210 cm / 118,5 × 175 cm',
    illuminationType: 'Podsvietený portál a interiérové svetlo z predajne',
    targetAudience: 'Všetci zákazníci vstupujúci do predajne a k pokladniam',
  },
  {
    zoneNumber: 4,
    code: '4_Pokladnicna zona',
    name: 'Zóna 4: Pokladničná zóna & Predajný pult',
    shortName: 'Pokladňa & Pult',
    category: 'interior',
    categoryLabel: 'Interiér',
    description: 'Čelá pokladničných pultov, POS stojany, digitálne obrazovky nad kasou a impulzné regály.',
    iconName: 'Receipt',
    accentColor: '#3b82f6',
    gradient: 'from-blue-600 to-indigo-600',
    typicalFormats: ['Digitálny obrazovkový panel (Digital Signage)', 'Pultový POS display', 'Čelo pokladničného pásu'],
    typicalDimensions: '55" Full HD obrazovka / 120 × 40 cm',
    illuminationType: 'LED interiérové bodové nasvietenie',
    targetAudience: '100% platiacich zákazníkov s vysokou mierou spontánneho nákupného rozhodovania',
  },
  {
    zoneNumber: 5,
    code: '5_Toaletna zona',
    name: 'Zóna 5: Toaletná zóna & Sociálne zariadenia',
    shortName: 'Toalety & WC',
    category: 'interior',
    categoryLabel: 'Interiér',
    description: 'Predsieň toaliet, dverové plochy WC kabínok, zrkadlové reklamné plochy a kliprámy A4/A3.',
    iconName: 'Users',
    accentColor: '#8b5cf6',
    gradient: 'from-purple-600 to-violet-600',
    typicalFormats: ['Kliprám A4 / A3 na dverách kabíniek', 'Zrkadlový display s LED podsvitom', 'Závesný panel v predsieni'],
    typicalDimensions: 'Formát A4 (21 × 29,7 cm) / A3 (29,7 × 42 cm)',
    illuminationType: 'Rovnomerné interiérové osvetlenie',
    targetAudience: 'Garantovaná 100% pozornosť bez rušivých vplyvov (čas kontaktu 1–3 min)',
  },
  {
    zoneNumber: 6,
    code: '6_Kaviarensky kutik',
    name: 'Zóna 6: Kaviarenský kútik & Dali Cafe',
    shortName: 'Dali Cafe & Bistro',
    category: 'interior',
    categoryLabel: 'Interiér',
    description: 'Priestory kaviarenského posedenia, stolové menu boardy, steny s brandovými obrazmi a kávové promo.',
    iconName: 'Coffee',
    accentColor: '#d97706',
    gradient: 'from-amber-600 to-yellow-600',
    typicalFormats: ['Kaviarenský nástenný panel', 'Stolový reklamný stojanček', 'Menu board s promo ponukou'],
    typicalDimensions: '70 × 100 cm / A5 stojanček',
    illuminationType: 'Teplé ambientné kaviarenské LED osvetlenie',
    targetAudience: 'Tranzitní cestujúci, manažéri na cestách a oddychujúci vodiči (čas zotrvania 10–25 min)',
  },
  {
    zoneNumber: 7,
    code: '7_Budova',
    name: 'Zóna 7: Fasáda budovy & Vonkajší plášť',
    shortName: 'Fasáda budovy',
    category: 'exterior',
    categoryLabel: 'Exteriér',
    description: 'Obvodový plášť budovy shopu, atika, vonkajšie osvetlené citylighty, fasádne bannery a štíty.',
    iconName: 'Building',
    accentColor: '#0ea5e9',
    gradient: 'from-sky-600 to-blue-600',
    typicalFormats: ['Fasádny osvetlený nosič', 'Fasádny LED lightbox', 'Okenná perforovaná grafika (One-Way Vision)'],
    typicalDimensions: '400 × 200 cm / 200 × 150 cm',
    illuminationType: 'Vonkajšie LED reflektory a lightbox podsvietenie',
    targetAudience: 'Viditeľné z celého areálu čerpacej stanice a príjazdových trás',
  },
  {
    zoneNumber: 8,
    code: '8_Parkovisko a ostatny priestor',
    name: 'Zóna 8: Parkovisko & Prístupová plocha',
    shortName: 'Parkovisko',
    category: 'exterior',
    categoryLabel: 'Exteriér',
    description: 'Parkovacie státia pre osobné a nákladné vozidlá, prístupové chodníky, oplotenie a obrubníky.',
    iconName: 'SquareParking',
    accentColor: '#64748b',
    gradient: 'from-slate-600 to-zinc-600',
    typicalFormats: ['Parkovacie reklamné tabule', 'Plagáty na stĺpoch verejného osvetlenia', 'Oplotenie areálu'],
    typicalDimensions: '200 × 100 cm / 150 × 80 cm',
    illuminationType: 'Areálové stĺpové výbojkové a LED osvetlenie',
    targetAudience: 'Dlhodobejšie parkujúci vodiči, zákazníci využívajúci gastro a odpočinok',
  },
  {
    zoneNumber: 9,
    code: '9_Odjazdova zona',
    name: 'Zóna 9: Výjazdová zóna & Odjazdový koridor',
    shortName: 'Výjazd zo stanice',
    category: 'exterior',
    categoryLabel: 'Exteriér',
    description: 'Výjazdový koridor z areálu, spätné orientačné tabule, ďakovné panely a cestné billboardy.',
    iconName: 'ArrowRight',
    accentColor: '#f97316',
    gradient: 'from-orange-600 to-red-600',
    typicalFormats: ['Výjazdový billboard', 'Ďakovný portálový panel', 'Smerová tabuľa na diaľnicu / mesto'],
    typicalDimensions: '504 × 238 cm / 300 × 150 cm',
    illuminationType: 'Reflektorové osvetlenie',
    targetAudience: 'Odchádzajúci zákazníci rekapitulujúci dojem zo stanice',
  },
  {
    zoneNumber: 10,
    code: '10_Autoumyvaren',
    name: 'Zóna 10: Autoumyváreň & Portálová umývacia linka',
    shortName: 'Autoumyváreň',
    category: 'services',
    categoryLabel: 'Služby & Umývanie',
    description: 'Portálová kefová umývacia linka, samoobslužné bezdotykové VAP boxy a inštrukčné panely.',
    iconName: 'Droplets',
    accentColor: '#06b6d4',
    gradient: 'from-cyan-600 to-teal-600',
    typicalFormats: ['Plocha na vstupe do umyvárne', 'Bannery v samoobslužných boxoch', 'Inštrukčný promo panel'],
    typicalDimensions: '300 × 120 cm / 200 × 100 cm',
    illuminationType: 'Vodeodolné LED priemyselné svietidlá',
    targetAudience: 'Majitelia motorových vozidiel dbajúci o čistotu a servis automobilu',
  },
  {
    zoneNumber: 11,
    code: '11_Vonkajsia terasa',
    name: 'Zóna 11: Vonkajšia terasa & Letné sedenie',
    shortName: 'Vonkajšia terasa',
    category: 'exterior',
    categoryLabel: 'Exteriér',
    description: 'Vonkajšie letné sedenie, drevené a kovové pergoly, veterné zábrany, slnečníky a terasa.',
    iconName: 'Umbrella',
    accentColor: '#14b8a6',
    gradient: 'from-teal-600 to-emerald-600',
    typicalFormats: ['Panel na pergole a stene terasy', 'Branding slnečníkov a veterných stien', 'Exteriérové stoly s grafikou'],
    typicalDimensions: '500 × 350 cm / 300 × 200 cm',
    illuminationType: 'Terénne záhradné a architektonické LED svetlá',
    targetAudience: 'Zákazníci s rodinami, cyklisti a šoféri počas jarno-letnej sezóny (kontakt 15–40 min)',
  },
  {
    zoneNumber: 12,
    code: '12_Ostatne priestory',
    name: 'Zóna 12: Servisný ostrovček, Kompresor & Vysávač',
    shortName: 'Servis & Kompresor',
    category: 'services',
    categoryLabel: 'Služby & Technika',
    description: 'Stojan na hustenie pneumatík, autovysávač, doplňovanie vody do ostrekovačov a skladové zázemie.',
    iconName: 'Folder',
    accentColor: '#6366f1',
    gradient: 'from-indigo-600 to-purple-600',
    typicalFormats: ['Panel nad kompresorom a vysávačom', 'Branding servisného ostrovčeka', 'Informačné stojany'],
    typicalDimensions: '150 × 100 cm / 80 × 120 cm',
    illuminationType: 'Priame LED osvetlenie servisného boxu',
    targetAudience: 'Zákazníci vykonávajúci údržbu vozidla (čas kontaktu 5–10 min)',
  },
];

/**
 * Získa definíciu zóny podľa jej čísla (1-12)
 */
export function getZoneDefinition(zoneNumber: number): ZoneDefinition | undefined {
  return ZONE_DEFINITIONS.find((z) => z.zoneNumber === zoneNumber);
}

/**
 * Získa Google Drive priečinok zóny pre zadanú stanicu
 */
export function getZoneFolderForStation(stationCode: string, zoneNumber: number): StationZoneFolder | undefined {
  return getStationZoneFolder(stationCode, zoneNumber);
}
