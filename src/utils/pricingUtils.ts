import { Station, RoadTypeFilter } from '../types';

/**
 * OFICIÁLNA TRHOVÁ CENOTVORBA REKLAMNÝCH PLÔCH SIETE DALIOIL
 * 
 * Princíp:
 * Drží sa pri zemi, žiadne premrštené čiastky.
 * Realistické, vysoko konkurencieschopné trhové ceny pre slovenský trh:
 * - Cenové rozpätie jednotlivých nosičov: cca 35 € až 290 € / mesiac
 * - Prepočítané na denné sadzby (iba cca 1,15 € až 9,60 € / deň)
 * - CPT (Cost Per Thousand / cena za 1000 zobrazení): cca 0,70 € až 2,90 €,
 *   čo predstavuje mimoriadne výhodnú ponuku oproti tradičným agentúrnym billboardom
 *   či online reklame pri garantovanom reálnom čase kontaktu.
 */

export interface MarketPriceModel {
  zoneNumber: number;
  basePriceEur: number; // Základná trhová cena (štandardný tranzit)
  minPriceEur: number;  // Najnižšia regionálna cena
  maxPriceEur: number;  // Prémiová diaľničná / mestská cena
  formatName: string;
  exposureTime: string;
  marketBenchmark: string; // Porovnanie s bežným slovenským trhom
  competitivenessNote: string;
}

/**
 * Základné trhové sadzby podľa 12 marketingových zón DALIOIL
 */
export const ZONE_MARKET_PRICING: Record<number, MarketPriceModel> = {
  1: {
    zoneNumber: 1,
    basePriceEur: 190,
    minPriceEur: 150,
    maxPriceEur: 290,
    formatName: 'Zóna 1: Príjazd & Vjazdový totem',
    exposureTime: '5 – 15 sekúnd',
    marketBenchmark: 'Tradičný cestný billboard na SK stojí 300 – 600 €/mes.',
    competitivenessNote: 'O cca 40–50 % lacnejšie ako bežný billboard, priamo pri vjazde do areálu.',
  },
  2: {
    zoneNumber: 2,
    basePriceEur: 120,
    minPriceEur: 85,
    maxPriceEur: 175,
    formatName: 'Zóna 2: Výdajné stojany & Tankovacie ostrovy',
    exposureTime: '3 – 5 minút',
    marketBenchmark: 'Špecializované POS nosiče na ČS bežne stoja 160 – 250 €/mes.',
    competitivenessNote: '100% garantovaný očný kontakt šoféra držiacieho tankovaciu pištoľ.',
  },
  3: {
    zoneNumber: 3,
    basePriceEur: 140,
    minPriceEur: 95,
    maxPriceEur: 195,
    formatName: 'Zóna 3: Vstupná zóna do shopu & Dvere',
    exposureTime: '10 – 30 sekúnd',
    marketBenchmark: 'Citylight (CLV) v mestách stojí 180 – 350 €/mes.',
    competitivenessNote: 'Obojstranná viditeľnosť pri vstupe aj odchode všetkých zákazníkov predajne.',
  },
  4: {
    zoneNumber: 4,
    basePriceEur: 110,
    minPriceEur: 75,
    maxPriceEur: 160,
    formatName: 'Zóna 4: Pokladničná zóna & Pult / Digitál',
    exposureTime: '1 – 3 minúty',
    marketBenchmark: 'In-store displeje v reťazcoch stoja 150 – 280 €/mes.',
    competitivenessNote: 'Okamžitý impulz pri platení, ideálne pre gastro, nápoje a lokálne služby.',
  },
  5: {
    zoneNumber: 5,
    basePriceEur: 45,
    minPriceEur: 35,
    maxPriceEur: 65,
    formatName: 'Zóna 5: Toalety & Sociálne zariadenia',
    exposureTime: '1 – 3 minúty',
    marketBenchmark: 'Ambient WC reklama v nákupných centrách stojí 60 – 110 €/mes.',
    competitivenessNote: 'Nerušená 100% pozornosť, najdostupnejšia cena v celom portfóliu (cca 1,50 €/deň).',
  },
  6: {
    zoneNumber: 6,
    basePriceEur: 60,
    minPriceEur: 45,
    maxPriceEur: 85,
    formatName: 'Zóna 6: Dali Cafe & Kaviarenský kútik',
    exposureTime: '10 – 25 minút',
    marketBenchmark: 'Gastro promo v kaviarňach stojí 80 – 140 €/mes.',
    competitivenessNote: 'Najdlhší čas kontaktu zo všetkých zón, oddychujúci solventní vodiči a obchodníci.',
  },
  7: {
    zoneNumber: 7,
    basePriceEur: 160,
    minPriceEur: 120,
    maxPriceEur: 240,
    formatName: 'Zóna 7: Fasáda budovy & Vonkajší plášť',
    exposureTime: '20 – 60 sekúnd',
    marketBenchmark: 'Fasádne bigboardy a svetelné panely stoja 250 – 480 €/mes.',
    competitivenessNote: 'Dominantná viditeľnosť z celého areálu ČS a priľahlých parkovacích plôch.',
  },
  8: {
    zoneNumber: 8,
    basePriceEur: 75,
    minPriceEur: 55,
    maxPriceEur: 110,
    formatName: 'Zóna 8: Parkovisko & Prístupová plocha',
    exposureTime: '2 – 10 minút',
    marketBenchmark: 'Parkovacie tabule v nákupných parkoch stoja 110 – 180 €/mes.',
    competitivenessNote: 'Výborný pomer cena/výkon pre autoservisy, pneuservisy a regionálne firmy.',
  },
  9: {
    zoneNumber: 9,
    basePriceEur: 130,
    minPriceEur: 95,
    maxPriceEur: 185,
    formatName: 'Zóna 9: Výjazdová zóna & Odjazdový koridor',
    exposureTime: '5 – 15 sekúnd',
    marketBenchmark: 'Výjazdové navigačné panely stoja 160 – 280 €/mes.',
    competitivenessNote: 'Posledný silný vizuálny dojem pri zaradení späť do premávky.',
  },
  10: {
    zoneNumber: 10,
    basePriceEur: 85,
    minPriceEur: 65,
    maxPriceEur: 130,
    formatName: 'Zóna 10: Autoumyváreň & Portálová linka / VAP',
    exposureTime: '5 – 12 minút',
    marketBenchmark: 'Reklama v umývacích centrách stojí 120 – 200 €/mes.',
    competitivenessNote: 'Priame cielenie na motoristov, ktorí sa starajú o svoje vozidlo a investujú doň.',
  },
  11: {
    zoneNumber: 11,
    basePriceEur: 60,
    minPriceEur: 45,
    maxPriceEur: 90,
    formatName: 'Zóna 11: Vonkajšia terasa & Letné sedenie',
    exposureTime: '15 – 35 minút',
    marketBenchmark: 'Sezónny branding terás stojí 90 – 160 €/mes.',
    competitivenessNote: 'Vysoký sezónny zásah rodín s deťmi a cyklistov v jarno-letnom období.',
  },
  12: {
    zoneNumber: 12,
    basePriceEur: 50,
    minPriceEur: 35,
    maxPriceEur: 75,
    formatName: 'Zóna 12: Servisný ostrovček, Kompresor & Vysávač',
    exposureTime: '4 – 8 minút',
    marketBenchmark: 'Servisné plochy na staniciach stoja 70 – 120 €/mes.',
    competitivenessNote: 'Veľmi priaznivá cena, aktívny kontakt pri údržbe tlaku pneumatík a vysávaní.',
  },
};

/**
 * Koeficienty bonity lokality podľa typu dopravného ťahu
 */
export const ROAD_TYPE_MULTIPLIERS: Record<string, { multiplier: number; label: string; description: string }> = {
  'Diaľnica D1/R1': {
    multiplier: 1.25,
    label: 'Diaľničný prémiový ťah (+25%)',
    description: 'Najvyššia frekvencia diaľničnej premávky, celoslovenský a medzinárodný tranzit.',
  },
  'Mestská lokalita': {
    multiplier: 1.15,
    label: 'Mestský uzol & Aglomerácia (+15%)',
    description: 'Vysoká opakovaná frekvencia mestských obyvateľov, silná kúpyschopnosť.',
  },
  'Tranzit 1. triedy': {
    multiplier: 1.0,
    label: 'Hlavný tranzit 1. triedy (Štandard 1.0×)',
    description: 'Vyvážený plynulý tok osobných a nákladných áut medzi okresnými mestami.',
  },
  'Vidiecka / Regionálna': {
    multiplier: 0.85,
    label: 'Regionálna / Vidiecka lokalita (-15%)',
    description: 'Výhodná zvýhodnená cena pre lokálnych podnikateľov a miestnu komunitu.',
  },
};

/**
 * Výpočet presnej trhovej ceny nosiča na konkrétnej stanici
 */
export function calculateAdSpacePrice(station: Station, zoneNumber: number, illumination: string): {
  monthlyPriceEur: number;
  dailyPriceEur: number;
  cpmPriceEur: number;
  roadMultiplier: number;
  trafficMultiplier: number;
  illuminationBonusEur: number;
  valuationBreakdown: string;
} {
  const model = ZONE_MARKET_PRICING[zoneNumber] || {
    zoneNumber,
    basePriceEur: 80,
    minPriceEur: 50,
    maxPriceEur: 130,
    formatName: `Zóna ${zoneNumber}`,
    exposureTime: '2 – 5 minút',
    marketBenchmark: 'Trhová cena OOH nosiča',
    competitivenessNote: 'Konkurencieschopné trhové nacenenie siete DALIOIL.',
  };

  // 1. Koeficient ťahu
  const roadConfig = ROAD_TYPE_MULTIPLIERS[station.roadType || 'Tranzit 1. triedy'] || ROAD_TYPE_MULTIPLIERS['Tranzit 1. triedy'];
  let roadMultiplier = roadConfig.multiplier;

  // Ak ide o bezobslužný terminál
  if (station.isTerminal) {
    // Terminály nemajú shop, kaviareň a WC – interiérové zóny na termináloch sú prispôsobené
    if ([3, 4, 5, 6, 11].includes(zoneNumber)) {
      roadMultiplier *= 0.65;
    } else {
      roadMultiplier *= 0.9;
    }
  }

  // 2. Koeficient návštevnosti pokladne / intenzity dopravy
  let trafficMultiplier = 1.0;
  const visits = station.monthlyVisitsCashier || 0;
  const aadt = station.trafficIntensityAADT || 16000;

  if (visits > 14000 || aadt > 25000) {
    trafficMultiplier = 1.1; // Nadpriemerná návštevnosť
  } else if (visits < 5000 && aadt < 10000 && !station.isTerminal) {
    trafficMultiplier = 0.9; // Pokojnejšia stanica
  }

  // 3. Osvetlenie / Nočná viditeľnosť
  let illuminationBonusEur = 0;
  if (illumination.toLowerCase().includes('digitál') || illumination.toLowerCase().includes('dooh')) {
    illuminationBonusEur = 15;
  } else if (illumination.toLowerCase().includes('podsvit') || illumination.toLowerCase().includes('backlight') || illumination.toLowerCase().includes('led')) {
    illuminationBonusEur = 10;
  }

  // Výpočet výslednej mesačnej ceny
  let rawPrice = model.basePriceEur * roadMultiplier * trafficMultiplier + illuminationBonusEur;

  // Zaokrúhlenie na pekné trhové číslo (násobok 5 €)
  let monthlyPriceEur = Math.round(rawPrice / 5) * 5;

  // Bezpečnostný mantinel: udržať pri zemi!
  if (monthlyPriceEur < model.minPriceEur) monthlyPriceEur = model.minPriceEur;
  if (monthlyPriceEur > model.maxPriceEur) monthlyPriceEur = model.maxPriceEur;

  // Denná sadzba (30 dní)
  const dailyPriceEur = Math.round((monthlyPriceEur / 30) * 100) / 100;

  // CPT / CPM (Cena za 1000 kontaktov)
  // Mesačné kontakty = zhruba denné AADT * 30 * faktor zóny
  const zoneVisibilityFactor = zoneNumber === 1 || zoneNumber === 9 ? 0.45 : zoneNumber === 2 ? 0.35 : 0.25;
  const monthlyEstimatedViews = Math.max(8000, Math.round(aadt * 30 * zoneVisibilityFactor + visits));
  const cpmPriceEur = Math.round(((monthlyPriceEur / monthlyEstimatedViews) * 1000) * 100) / 100;

  // Slovné odôvodnenie transparentnej trhovej ceny
  const roadLabel = station.affectedRoad ? `${station.affectedRoad} (${roadConfig.label})` : roadConfig.label;
  const trafficLabel = station.trafficRange
    ? `${station.trafficRange} voz./24h (CSD)`
    : visits > 0
    ? `${Math.round(visits / 30).toLocaleString('sk-SK')} bločkov/deň (${visits.toLocaleString('sk-SK')}/mes.)`
    : `${aadt.toLocaleString('sk-SK')} AADT`;
  const valuationBreakdown = `Trhová cena ${monthlyPriceEur} €/mesiac (${dailyPriceEur.toFixed(2)} €/deň, CPT cca ${cpmPriceEur.toFixed(2)} €). Základ formátu: ${model.basePriceEur} €, komunikácia: ${roadLabel}, intenzita: ${trafficLabel}. ${model.competitivenessNote}`;

  return {
    monthlyPriceEur,
    dailyPriceEur,
    cpmPriceEur,
    roadMultiplier,
    trafficMultiplier,
    illuminationBonusEur,
    valuationBreakdown,
  };
}

/**
 * Zľavová matica pre dlhodobý prenájom OOH plôch
 */
export const DURATION_DISCOUNTS = [
  { months: 1, discountPercent: 0, label: '1 mesiac (Základná trhová cena)' },
  { months: 3, discountPercent: 5, label: '3 mesiace (-5 % kvartálna zľava)' },
  { months: 6, discountPercent: 10, label: '6 mesiacov (-10 % polročná zľava)' },
  { months: 12, discountPercent: 15, label: '12 mesiacov (-15 % ročný partner)' },
];

/**
 * Získa aplikovateľnú zľavu podľa počtu mesiacov
 */
export function getDurationDiscount(months: number): { percent: number; label: string } {
  if (months >= 12) return { percent: 15, label: 'Ročná zľava -15 %' };
  if (months >= 6) return { percent: 10, label: 'Polročná zľava -10 %' };
  if (months >= 3) return { percent: 5, label: 'Kvartálna zľava -5 %' };
  return { percent: 0, label: 'Bez zľavy' };
}
