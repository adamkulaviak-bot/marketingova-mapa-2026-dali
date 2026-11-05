import { RegionId } from '../types';

export interface StationZoneCarrierItem {
  rawText: string;
  count: number;
  types: string[]; // e.g. ["Billboard", "A1", "Monitory", "A4", "Plachta", "Zástavy"]
  formats?: string; // e.g. "6xA1, 1xA0"
  hasData: boolean;
}

export interface StationCarrierAudit {
  stationName: string;
  stationCode: string;
  stationId: number;
  region: RegionId;
  fuelDispensers: string; // e.g. "4", "5", "8+1", "10", "3+1malý na diesel pre kamióny"
  fuelDispensersCount: number; // parsed numeric for sorting
  zones: {
    zone1: StationZoneCarrierItem; // 1_Prijazdova zona od cesty
    zone2: StationZoneCarrierItem; // 2_Zona pri vydajnych stojanoch
    zone3: StationZoneCarrierItem; // 3_Vstupna zona do shopu
    zone4: StationZoneCarrierItem; // 4_Pokladnicna zona
    zone5: StationZoneCarrierItem; // 5_Toaletna zona
    zone6: StationZoneCarrierItem; // 6_Kaviarensky kutik
    zone7: StationZoneCarrierItem; // 7_Budova
    zone8: StationZoneCarrierItem; // 8_Parkovisko a ostatny priestor
    zone9: StationZoneCarrierItem; // 9_Odjazdova zona
    zone10: StationZoneCarrierItem; // 10_Autoumyvaren
    zone11: StationZoneCarrierItem; // 11_Vonkajsia terasa
    zone12: StationZoneCarrierItem; // 12_Ostatne
  };
  totalCarriersCount: number;
  primaryCarrierTypes: string[];
  notes?: string;
}

export const AUDIT_PDF_PATH = '/assets/aistudio/prehlad_reklamnych_ploch_mnozstvo_reklamnych_nosicov_a7a87c4a.pdf';

/**
 * OFICIÁLNY ZBER DÁT: Množstvo reklamných nosičov a typy na jednotlivých prevádzkach DALIOIL
 * Zdroj: prehlad_reklamnych_ploch_mnozstvo_reklamnych_nosicov_a7a87c4a.pdf (Audit 2026)
 */
export const CARRIER_AUDIT_DATA: StationCarrierAudit[] = [
  {
    stationName: 'Banská Bystrica',
    stationCode: 'DALIOIL_029',
    stationId: 29,
    region: 'stred',
    fuelDispensers: '4',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '2 ks', count: 2, types: ['Pylón / Totem', 'Informačná tabuľa'], hasData: true },
      zone2: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone3: { rawText: '3+1 | A1,A0', count: 4, types: ['Formát A1', 'Formát A0'], formats: '3x A1, 1x A0', hasData: true },
      zone4: { rawText: '2+3 | 2x95x60,1x38x24,1x93x28,1x32x22', count: 5, types: ['Atypické formáty', 'Pokladničný pult'], formats: '2x 95x60cm, 1x 38x24cm, 1x 93x28cm, 1x 32x22cm', hasData: true },
      zone5: { rawText: '–', count: 0, types: [], hasData: false },
      zone6: { rawText: '1 cenník', count: 1, types: ['Cenník / Menu board'], formats: '1x Cenník', hasData: true },
      zone7: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone8: { rawText: '2 bilboardy', count: 2, types: ['Billboard'], formats: '2x Billboard', hasData: true },
      zone9: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 14,
    primaryCarrierTypes: ['Billboard', 'Formát A1', 'Formát A0', 'Atypické pultové rámy', 'Cenník'],
  },
  {
    stationName: 'Gbelce',
    stationCode: 'DALIOIL_026',
    stationId: 26,
    region: 'stred',
    fuelDispensers: '5',
    fuelDispensersCount: 5,
    zones: {
      zone1: { rawText: '3 ks | billboard', count: 3, types: ['Billboard'], formats: '3x Billboard', hasData: true },
      zone2: { rawText: '7 ks | 6xA1 1xA0', count: 7, types: ['Formát A1', 'Formát A0'], formats: '6x A1, 1x A0', hasData: true },
      zone3: { rawText: '1 ks', count: 1, types: ['Vstupný rám'], hasData: true },
      zone4: { rawText: '2 ks | monitory', count: 2, types: ['Monitory & DOOH'], formats: '2x Monitor', hasData: true },
      zone5: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '1 ks | A4', count: 1, types: ['Formát A4'], formats: '1x A4', hasData: true },
      zone7: { rawText: '2 ks | plachta', count: 2, types: ['Plachta / Banner'], formats: '2x Plachta', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 20,
    primaryCarrierTypes: ['Billboard', 'Formát A1', 'Formát A0', 'Monitory & DOOH', 'Formát A4', 'Plachta'],
  },
  {
    stationName: 'Hliník nad Hronom',
    stationCode: 'DALIOIL_028',
    stationId: 28,
    region: 'stred',
    fuelDispensers: '5',
    fuelDispensersCount: 5,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '3 ks', count: 3, types: ['Stojanové rámy'], formats: '3x Nosič na stojanoch', hasData: true },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '–', count: 0, types: [], hasData: false },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '2 ks', count: 2, types: ['Fasádne nosiče'], formats: '2x Nosič budova', hasData: true },
      zone8: { rawText: '3 ks', count: 3, types: ['Areálové plochy'], formats: '3x Plocha na parkovisku', hasData: true },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 8,
    primaryCarrierTypes: ['Stojanové rámy', 'Fasádne nosiče', 'Parkovisko nosiče'],
  },
  {
    stationName: 'Hontianske Nemce',
    stationCode: 'DALIOIL_027',
    stationId: 27,
    region: 'stred',
    fuelDispensers: '3',
    fuelDispensersCount: 3,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '2 ks | A0', count: 2, types: ['Formát A0'], formats: '2x A0', hasData: true },
      zone3: { rawText: '3rám-2stoj | A1', count: 5, types: ['Formát A1', 'Kliprám', 'Stojan'], formats: '3x Rám A1, 2x Stojan A1', hasData: true },
      zone4: { rawText: '4-6 | A4', count: 5, types: ['Formát A4'], formats: '4-6x A4', hasData: true },
      zone5: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone7: { rawText: '1 ks | plach', count: 1, types: ['Plachta / Banner'], formats: '1x Plachta', hasData: true },
      zone8: { rawText: '2 ks | bilb', count: 2, types: ['Billboard'], formats: '2x Billboard', hasData: true },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 21,
    primaryCarrierTypes: ['Billboard', 'Formát A0', 'Formát A1', 'Formát A4', 'Plachta'],
  },
  {
    stationName: 'Kokava nad Rimavicou',
    stationCode: 'DALIOIL_042',
    stationId: 42,
    region: 'stred',
    fuelDispensers: '–',
    fuelDispensersCount: 2,
    zones: {
      zone1: { rawText: '1 ks | A1', count: 1, types: ['Formát A1'], formats: '1x A1', hasData: true },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '4,77m x 2,43m', count: 1, types: ['Veľkoformátová plocha'], formats: '1x 4,77m × 2,43m banner/plocha', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 6,
    primaryCarrierTypes: ['Formát A1', 'Veľkoformát 4.77x2.43m', 'Formát A4'],
  },
  {
    stationName: 'Ludanice',
    stationCode: 'DALIOIL_020',
    stationId: 20,
    region: 'zapad',
    fuelDispensers: '7',
    fuelDispensersCount: 7,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone3: { rawText: '0 ks | A0/A1', count: 0, types: [], formats: 'Pripravené na A0/A1', hasData: false },
      zone4: { rawText: '4x', count: 4, types: ['Pokladničné nosiče'], formats: '4x Pokladňa', hasData: true },
      zone5: { rawText: '5x | A4', count: 5, types: ['Formát A4'], formats: '5x A4', hasData: true },
      zone6: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone7: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone8: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone9: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 9,
    primaryCarrierTypes: ['Formát A4', 'Pokladňa kliprámy'],
  },
  {
    stationName: 'Lučenec',
    stationCode: 'DALIOIL_044',
    stationId: 44,
    region: 'stred',
    fuelDispensers: '4',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '2 ks | A0', count: 2, types: ['Formát A0'], formats: '2x A0', hasData: true },
      zone3: { rawText: '4 ks | A1', count: 4, types: ['Formát A1'], formats: '4x A1', hasData: true },
      zone4: { rawText: '2 ks | A4', count: 2, types: ['Formát A4'], formats: '2x A4', hasData: true },
      zone5: { rawText: '5 ks | A4', count: 5, types: ['Formát A4'], formats: '5x A4', hasData: true },
      zone6: { rawText: '2 ks | A4', count: 2, types: ['Formát A4'], formats: '2x A4', hasData: true },
      zone7: { rawText: '4 ks | ram', count: 4, types: ['Fasádne rámy'], formats: '4x Rám na budove', hasData: true },
      zone8: { rawText: '2 ks | Bilbord', count: 2, types: ['Billboard'], formats: '2x Billboard', hasData: true },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 21,
    primaryCarrierTypes: ['Billboard', 'Formát A0', 'Formát A1', 'Formát A4', 'Fasádne rámy'],
  },
  {
    stationName: 'Partizánske (Malé Bielice)',
    stationCode: 'DALIOIL_021',
    stationId: 21,
    region: 'zapad',
    fuelDispensers: '8',
    fuelDispensersCount: 8,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone4: { rawText: '2x', count: 2, types: ['Pokladničné nosiče'], formats: '2x Pokladňa', hasData: true },
      zone5: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone6: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone7: { rawText: '2x', count: 2, types: ['Fasádne nosiče'], formats: '2x Budova', hasData: true },
      zone8: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone9: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 4,
    primaryCarrierTypes: ['Pokladňa', 'Budova nosiče'],
  },
  {
    stationName: 'Nitrianske Rudno',
    stationCode: 'DALIOIL_022',
    stationId: 22,
    region: 'stred',
    fuelDispensers: '2',
    fuelDispensersCount: 2,
    zones: {
      zone1: { rawText: '4x billboard, Ačko stojan PEPSI a ALGIDA', count: 6, types: ['Billboard', 'A-stojan POS'], formats: '4x Billboard, 2x A-stojan (Pepsi, Algida)', hasData: true },
      zone2: { rawText: '3 ks | 2x windmaster a 1x A1 na stene', count: 3, types: ['Windmaster', 'Formát A1'], formats: '2x Windmaster, 1x A1 na stene', hasData: true },
      zone3: { rawText: '1 ks | vedľa dverí napravo A1 clip na stene', count: 1, types: ['Formát A1', 'Kliprám'], formats: '1x A1 cliprám pri dverách', hasData: true },
      zone4: { rawText: '2x monitor nad cigaretami a 2x LCD monitor cigarety', count: 4, types: ['Monitory & DOOH'], formats: '2x Monitor nad cigaretami, 2x LCD cigarety', hasData: true },
      zone5: { rawText: 'páni- 2x A4 clip a dámy - 2x A4 clip', count: 4, types: ['Formát A4', 'Kliprám'], formats: 'Páni 2x A4 clip, Dámy 2x A4 clip', hasData: true },
      zone6: { rawText: '1x A5 a 1x A4 stojan', count: 2, types: ['Formát A4', 'Formát A5', 'Stojan'], formats: '1x A5 stojan, 1x A4 stojan', hasData: true },
      zone7: { rawText: '1x A1 na stene', count: 1, types: ['Formát A1'], formats: '1x A1 na stene budovy', hasData: true },
      zone8: { rawText: '4x billboard na plote', count: 4, types: ['Billboard'], formats: '4x Billboard na oplotení', hasData: true },
      zone9: { rawText: 'vedľa benkalorov konštrukcia na 2ks banerov', count: 2, types: ['Plachta / Banner'], formats: 'Konštrukcia na 2x Banner', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 27,
    primaryCarrierTypes: ['Billboard', 'Monitory & DOOH', 'Windmaster', 'Formát A1', 'Formát A4', 'Bannery'],
  },
  {
    stationName: 'Tupá',
    stationCode: 'DALIOIL_025',
    stationId: 25,
    region: 'stred',
    fuelDispensers: '6',
    fuelDispensersCount: 6,
    zones: {
      zone1: { rawText: '3 ks | billboardy', count: 3, types: ['Billboard'], formats: '3x Billboard', hasData: true },
      zone2: { rawText: '6 ks | A1', count: 6, types: ['Formát A1'], formats: '6x A1', hasData: true },
      zone3: { rawText: '2 ks | dvere', count: 2, types: ['Dverový polep'], formats: '2x Dvere', hasData: true },
      zone4: { rawText: '2 ks | monitor', count: 2, types: ['Monitory & DOOH'], formats: '2x Monitor', hasData: true },
      zone5: { rawText: '2 ks | A4', count: 2, types: ['Formát A4'], formats: '2x A4', hasData: true },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 15,
    primaryCarrierTypes: ['Billboard', 'Formát A1', 'Monitory & DOOH', 'Dverové polepy', 'Formát A4'],
  },
  {
    stationName: 'Turčianske Teplice',
    stationCode: 'DALIOIL_019',
    stationId: 19,
    region: 'sever',
    fuelDispensers: '4',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '4x bilboard', count: 4, types: ['Billboard'], formats: '4x Billboard', hasData: true },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: 'polep minit + 2 stojany', count: 3, types: ['Polep', 'Stojan'], formats: 'Polep Minit + 2x Stojan', hasData: true },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '4x A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '2 stojany', count: 2, types: ['Kaviarenský stojan'], formats: '2x Stojan Cafe', hasData: true },
      zone7: { rawText: '2x bilboard', count: 2, types: ['Billboard'], formats: '2x Billboard na budove', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 15,
    primaryCarrierTypes: ['Billboard', 'Polepy Minit', 'Stojany', 'Formát A4'],
  },
  {
    stationName: 'Dolný Hričov',
    stationCode: 'DALIOIL_015',
    stationId: 15,
    region: 'sever',
    fuelDispensers: '10',
    fuelDispensersCount: 10,
    zones: {
      zone1: { rawText: '2 Bilbordy | /', count: 2, types: ['Billboard'], formats: '2x Billboard', hasData: true },
      zone2: { rawText: '4 ks | A1', count: 4, types: ['Formát A1'], formats: '4x A1', hasData: true },
      zone3: { rawText: 'Polep minit + stojan Pierre | /', count: 2, types: ['Polep', 'Stojan'], formats: 'Polep Minit + Stojan Pierre Baguette', hasData: true },
      zone4: { rawText: '2 monitory + 2 JTI + 1 PMI | /', count: 5, types: ['Monitory & DOOH', 'Tabak display'], formats: '2x Monitor + 2x JTI + 1x PMI', hasData: true },
      zone5: { rawText: '3x A3 + | A3', count: 3, types: ['Formát A3'], formats: '3x A3', hasData: true },
      zone6: { rawText: '2 ks | A5', count: 2, types: ['Formát A5'], formats: '2x A5', hasData: true },
      zone7: { rawText: '2 ks | 385X250 a 500x250', count: 2, types: ['Veľkoformátová plocha'], formats: '1x 385×250cm, 1x 500×250cm', hasData: true },
      zone8: { rawText: '2 ks | /', count: 2, types: ['Parkovacie plochy'], formats: '2x Plocha', hasData: true },
      zone9: { rawText: '3 Zástavy | /', count: 3, types: ['Zástavy'], formats: '3x Zástava', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 25,
    primaryCarrierTypes: ['Billboard', 'Monitory & DOOH', 'Zástavy', 'Veľkoformáty', 'Formát A1', 'Formát A3'],
  },
  {
    stationName: 'Dubnica nad Váhom',
    stationCode: 'DALIOIL_012',
    stationId: 12,
    region: 'sever',
    fuelDispensers: '8+1',
    fuelDispensersCount: 9,
    zones: {
      zone1: { rawText: '2 ks | A0', count: 2, types: ['Formát A0'], formats: '2x A0', hasData: true },
      zone2: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone3: { rawText: '1 rám | A4', count: 1, types: ['Formát A4'], formats: '1x A4 rám', hasData: true },
      zone4: { rawText: '2 monitory + 2 reklamné obrazovky', count: 4, types: ['Monitory & DOOH'], formats: '2x Monitor + 2x Reklamná obrazovka', hasData: true },
      zone5: { rawText: '5 ks | A4', count: 5, types: ['Formát A4'], formats: '5x A4', hasData: true },
      zone6: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone7: { rawText: '1 - billboard, 6 x A1', count: 7, types: ['Billboard', 'Formát A1'], formats: '1x Billboard, 6x A1', hasData: true },
      zone8: { rawText: '2 billboardy | 0', count: 2, types: ['Billboard'], formats: '2x Billboard', hasData: true },
      zone9: { rawText: '4 billboardy (2x na umývarke)', count: 4, types: ['Billboard', 'Umyváreň nosiče'], formats: '4x Billboard (2x umyváreň)', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 25,
    primaryCarrierTypes: ['Billboard', 'Monitory & DOOH', 'Formát A0', 'Formát A1', 'Formát A4'],
  },
  {
    stationName: 'Kraľovany',
    stationCode: 'DALIOIL_047',
    stationId: 47,
    region: 'sever',
    fuelDispensers: '–',
    fuelDispensersCount: 0,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '–', count: 0, types: [], hasData: false },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 0,
    primaryCarrierTypes: [],
    notes: 'Pripravovaná / prechodná lokalita bez osadených nosičov',
  },
  {
    stationName: 'Krásno nad Kysucou',
    stationCode: 'DALIOIL_016',
    stationId: 16,
    region: 'sever',
    fuelDispensers: '–',
    fuelDispensersCount: 2,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone3: { rawText: '1 ks | A1', count: 1, types: ['Formát A1'], formats: '1x A1', hasData: true },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '–', count: 0, types: [], hasData: false },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 3,
    primaryCarrierTypes: ['Formát A1'],
  },
  {
    stationName: 'Martin',
    stationCode: 'DALIOIL_017',
    stationId: 17,
    region: 'sever',
    fuelDispensers: '–',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '2 bilboardy', count: 2, types: ['Billboard'], formats: '2x Billboard', hasData: true },
      zone2: { rawText: '4x A1', count: 4, types: ['Formát A1'], formats: '4x A1', hasData: true },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: 'plastové A4', count: 1, types: ['Formát A4', 'POS stojanček'], formats: '1x Plastové A4', hasData: true },
      zone5: { rawText: '4x A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: 'A4 cenník', count: 1, types: ['Formát A4', 'Cenník'], formats: '1x A4 cenník', hasData: true },
      zone7: { rawText: '3x A1', count: 3, types: ['Formát A1'], formats: '3x A1', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 15,
    primaryCarrierTypes: ['Billboard', 'Formát A1', 'Formát A4', 'Cenníky'],
  },
  {
    stationName: 'Nemšová',
    stationCode: 'DALIOIL_011',
    stationId: 11,
    region: 'sever',
    fuelDispensers: '9',
    fuelDispensersCount: 9,
    zones: {
      zone1: { rawText: '1 ks', count: 1, types: ['Príjazdový nosič'], hasData: true },
      zone2: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone3: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone4: { rawText: '3 ks | 21x29,5cm', count: 3, types: ['Formát A4'], formats: '3x A4 (21×29,5 cm)', hasData: true },
      zone5: { rawText: '4 ks | 21x29,5cm', count: 4, types: ['Formát A4'], formats: '4x A4 (21×29,5 cm)', hasData: true },
      zone6: { rawText: '1 ks', count: 1, types: ['Cafe nosič'], hasData: true },
      zone7: { rawText: '2 ks', count: 2, types: ['Fasádne nosiče'], formats: '2x Nosič budova', hasData: true },
      zone8: { rawText: '1 ks', count: 1, types: ['Parkovisko nosič'], hasData: true },
      zone9: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 16,
    primaryCarrierTypes: ['Formát A1', 'Formát A4', 'Budova nosiče', 'Parkovisko nosiče'],
  },
  {
    stationName: 'Nová Dubnica',
    stationCode: 'DALIOIL_013',
    stationId: 13,
    region: 'sever',
    fuelDispensers: '3',
    fuelDispensersCount: 3,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '3 + 2 | 3xA4 1ks82x117 1ks87x122', count: 5, types: ['Formát A4', 'Veľkoformátový rám'], formats: '3x A4, 1x 82×117 cm, 1x 87×122 cm', hasData: true },
      zone3: { rawText: '1 ks | A1', count: 1, types: ['Formát A1'], formats: '1x A1', hasData: true },
      zone4: { rawText: '5 ks', count: 5, types: ['Pokladničné nosiče'], formats: '5x Pokladňa', hasData: true },
      zone5: { rawText: '2 ks | A4', count: 2, types: ['Formát A4'], formats: '2x A4', hasData: true },
      zone6: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone7: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone8: { rawText: '3 ks', count: 3, types: ['Areálové plochy'], formats: '3x Plocha parkovisko', hasData: true },
      zone9: { rawText: '2 ks', count: 2, types: ['Výjazdové nosiče'], formats: '2x Výjazd', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 20,
    primaryCarrierTypes: ['Formát A1', 'Formát A4', 'Veľkoformátové rámy', 'Pokladňa', 'Výjazdové panely'],
  },
  {
    stationName: 'Považská Teplá',
    stationCode: 'DALIOIL_014',
    stationId: 14,
    region: 'sever',
    fuelDispensers: '8',
    fuelDispensersCount: 8,
    zones: {
      zone1: { rawText: '2 ks | 740X100', count: 2, types: ['Veľkoformátový banner'], formats: '2x Banner 740×100 cm', hasData: true },
      zone2: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone3: { rawText: 'Polep minit | /', count: 1, types: ['Polep dverí'], formats: 'Polep Minit dvere', hasData: true },
      zone4: { rawText: '2 monitory + 2 JTI + 2PMI | /', count: 6, types: ['Monitory & DOOH', 'Tabak display'], formats: '2x Monitor, 2x JTI, 2x PMI', hasData: true },
      zone5: { rawText: '4xA3+nálepka aplikácia a QR code | A3', count: 5, types: ['Formát A3', 'Nálepka QR kód'], formats: '4x A3, 1x QR kód nálepka', hasData: true },
      zone6: { rawText: '3 ks | A5', count: 3, types: ['Formát A5'], formats: '3x A5', hasData: true },
      zone7: { rawText: '2 ks | 428X211', count: 2, types: ['Veľkoformátová plocha'], formats: '2x Formát 428×211 cm', hasData: true },
      zone8: { rawText: '/ | /', count: 0, types: [], hasData: false },
      zone9: { rawText: '/ | /', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 21,
    primaryCarrierTypes: ['Monitory & DOOH', 'Veľkoformátový banner', 'Formát A1', 'Formát A3', 'Formát A5'],
  },
  {
    stationName: 'Trstená',
    stationCode: 'DALIOIL_031',
    stationId: 31,
    region: 'sever',
    fuelDispensers: '–',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '1 ks | 107X405', count: 1, types: ['Veľkoformátový banner'], formats: '1x Banner 107×405 cm', hasData: true },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: '3 ks | 84x59', count: 3, types: ['Formát A1'], formats: '3x A1 (84×59 cm)', hasData: true },
      zone4: { rawText: '2 monitory | 1JTI 1PMI', count: 4, types: ['Monitory & DOOH', 'Tabak display'], formats: '2x Monitor, 1x JTI, 1x PMI', hasData: true },
      zone5: { rawText: '2 ks | 21x29,5', count: 2, types: ['Formát A4'], formats: '2x A4 (21×29,5 cm)', hasData: true },
      zone6: { rawText: '1 ks', count: 1, types: ['Cafe nosič'], hasData: true },
      zone7: { rawText: '1 ks | 250X500', count: 1, types: ['Veľkoformátový billboard'], formats: '1x Billboard 250×500 cm', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 12,
    primaryCarrierTypes: ['Monitory & DOOH', 'Billboard 250x500cm', 'Banner 107x405cm', 'Formát A1', 'Formát A4'],
  },
  {
    stationName: 'Turany',
    stationCode: 'DALIOIL_018',
    stationId: 18,
    region: 'sever',
    fuelDispensers: '10',
    fuelDispensersCount: 10,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '2x A1 + 2 Atyp. | A1 + 84x54,5cm', count: 4, types: ['Formát A1', 'Atypický formát'], formats: '2x A1, 2x Atyp (84×54,5 cm)', hasData: true },
      zone3: { rawText: '2 tabule na budove + polep minit dvere | A1', count: 3, types: ['Tabule na fasáde', 'Polep dverí'], formats: '2x Tabuľa A1, 1x Polep Minit', hasData: true },
      zone4: { rawText: '2 monitory + 1 JTI + 1PMI | A5 káva A4 pepsi apod.', count: 4, types: ['Monitory & DOOH', 'Tabak display', 'Formát A4', 'Formát A5'], formats: '2x Monitor, 1x JTI, 1x PMI, A4 Pepsi, A5 káva', hasData: true },
      zone5: { rawText: '6 ks | A4', count: 6, types: ['Formát A4'], formats: '6x A4', hasData: true },
      zone6: { rawText: '2x letáky 3x káva | A4,A5', count: 5, types: ['Letáky', 'Kaviarenské nosiče', 'Formát A4', 'Formát A5'], formats: '2x Letáky A4, 3x Káva A5', hasData: true },
      zone7: { rawText: '2 ks | 229x458', count: 2, types: ['Veľkoformátová plocha'], formats: '2x 229×458 cm', hasData: true },
      zone8: { rawText: '2 - obojstranné', count: 2, types: ['Obojstranný nosič'], formats: '2x Obojstranný panel', hasData: true },
      zone9: { rawText: '3 zástavy', count: 3, types: ['Zástavy'], formats: '3x Zástava', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 29,
    primaryCarrierTypes: ['Monitory & DOOH', 'Zástavy', 'Obojstranné panely', 'Veľkoformáty', 'Formát A1', 'Formát A4'],
  },
  {
    stationName: 'Veľké Bierovce',
    stationCode: 'DALIOIL_030',
    stationId: 30,
    region: 'sever',
    fuelDispensers: '11',
    fuelDispensersCount: 11,
    zones: {
      zone1: { rawText: '1 ks | A0', count: 1, types: ['Formát A0'], formats: '1x A0', hasData: true },
      zone2: { rawText: '3 ks | A1', count: 3, types: ['Formát A1'], formats: '3x A1', hasData: true },
      zone3: { rawText: '1 ks', count: 1, types: ['Vstupný nosič'], hasData: true },
      zone4: { rawText: '3+1 | A4', count: 4, types: ['Formát A4'], formats: '3+1x A4', hasData: true },
      zone5: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone8: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone9: { rawText: '2 ks', count: 2, types: ['Výjazdové nosiče'], formats: '2x Výjazd', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 11,
    primaryCarrierTypes: ['Formát A0', 'Formát A1', 'Formát A4', 'Výjazdové nosiče'],
  },
  {
    stationName: 'Bátka',
    stationCode: 'DALIOIL_043',
    stationId: 43,
    region: 'stred',
    fuelDispensers: '3+1malý na diesel pre kamióny',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '0', count: 0, types: [], hasData: false },
      zone2: { rawText: '0', count: 0, types: [], hasData: false },
      zone3: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone4: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone5: { rawText: '8 ks | A4', count: 8, types: ['Formát A4'], formats: '8x A4', hasData: true },
      zone6: { rawText: '3xkáva | A5', count: 3, types: ['Formát A5', 'Kaviarenské stojany'], formats: '3x A5 (káva)', hasData: true },
      zone7: { rawText: '2 ks | baner', count: 2, types: ['Plachta / Banner'], formats: '2x Banner', hasData: true },
      zone8: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone9: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 13,
    primaryCarrierTypes: ['Formát A4', 'Bannery', 'Formát A5 Káva'],
  },
  {
    stationName: 'Dobšiná',
    stationCode: 'DALIOIL_037',
    stationId: 37,
    region: 'vychod',
    fuelDispensers: '2',
    fuelDispensersCount: 2,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '1 ks', count: 1, types: ['Stojanový nosič'], hasData: true },
      zone3: { rawText: '2 ks | 2x reklamné stojany', count: 2, types: ['POS reklamné stojany'], formats: '2x Reklamný stojan', hasData: true },
      zone4: { rawText: '1 monitor + 1 JTI + 1PMI', count: 3, types: ['Monitory & DOOH', 'Tabak display'], formats: '1x Monitor, 1x JTI, 1x PMI', hasData: true },
      zone5: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: 'stôl na státie', count: 1, types: ['Stolový branding'], formats: '1x Stôl na státie promo', hasData: true },
      zone7: { rawText: '3 ks | A1', count: 3, types: ['Formát A1'], formats: '3x A1', hasData: true },
      zone8: { rawText: '3x banner', count: 3, types: ['Plachta / Banner'], formats: '3x Banner', hasData: true },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 18,
    primaryCarrierTypes: ['Monitory & DOOH', 'Bannery', 'Formát A1', 'Formát A4', 'Reklamné stojany'],
  },
  {
    stationName: 'Kežmarok',
    stationCode: 'DALIOIL_035',
    stationId: 35,
    region: 'vychod',
    fuelDispensers: '–',
    fuelDispensersCount: 2,
    zones: {
      zone1: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone2: { rawText: '1 ks | A1 obojstranný', count: 1, types: ['Formát A1', 'Obojstranný nosič'], formats: '1x A1 obojstranný', hasData: true },
      zone3: { rawText: '1 ks | A1', count: 1, types: ['Formát A1'], formats: '1x A1', hasData: true },
      zone4: { rawText: '1 monitor', count: 1, types: ['Monitory & DOOH'], formats: '1x Monitor', hasData: true },
      zone5: { rawText: 'nemáme', count: 0, types: [], hasData: false },
      zone6: { rawText: '3 ks | A4', count: 3, types: ['Formát A4'], formats: '3x A4', hasData: true },
      zone7: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone8: { rawText: '3 ks', count: 3, types: ['Parkovisko nosiče'], formats: '3x Parkovisko', hasData: true },
      zone9: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 9,
    primaryCarrierTypes: ['Monitory & DOOH', 'Formát A1 obojstranný', 'Formát A4', 'Parkovisko'],
  },
  {
    stationName: 'Ivachnová',
    stationCode: 'DALIOIL_032',
    stationId: 32,
    region: 'sever',
    fuelDispensers: '8',
    fuelDispensersCount: 8,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '2+2 | A1 82x59 cm a 42x30 cm', count: 4, types: ['Formát A1', 'Formát A3'], formats: '2x A1 (82×59 cm), 2x A3 (42×30 cm)', hasData: true },
      zone3: { rawText: 'A1 82x59 cm', count: 1, types: ['Formát A1'], formats: '1x A1 (82×59 cm)', hasData: true },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '–', count: 0, types: [], hasData: false },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 5,
    primaryCarrierTypes: ['Formát A1', 'Formát A3'],
  },
  {
    stationName: 'Košice - Dargovských Hrdinov',
    stationCode: 'DALIOIL_038',
    stationId: 38,
    region: 'vychod',
    fuelDispensers: '–',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '1 ks | Starbucks', count: 1, types: ['Brandový nosič Starbucks'], formats: '1x Starbucks branding', hasData: true },
      zone3: { rawText: '1 ks | A1', count: 1, types: ['Formát A1'], formats: '1x A1', hasData: true },
      zone4: { rawText: '2x monitor | 3x A4', count: 5, types: ['Monitory & DOOH', 'Formát A4'], formats: '2x Monitor, 3x A4', hasData: true },
      zone5: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '2 ks | A5', count: 2, types: ['Formát A5'], formats: '2x A5', hasData: true },
      zone7: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone8: { rawText: '3 ks | Bilboardy', count: 3, types: ['Billboard'], formats: '3x Billboard', hasData: true },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 18,
    primaryCarrierTypes: ['Billboard', 'Monitory & DOOH', 'Starbucks branding', 'Formát A1', 'Formát A4'],
  },
  {
    stationName: 'Liptovský Mikuláš',
    stationCode: 'DALIOIL_033',
    stationId: 33,
    region: 'sever',
    fuelDispensers: '5',
    fuelDispensersCount: 5,
    zones: {
      zone1: { rawText: '2 ks | AO BANER', count: 2, types: ['Formát A0', 'Plachta / Banner'], formats: '2x A0 Banner', hasData: true },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: 'polep minit dvere', count: 1, types: ['Polep dverí'], formats: 'Polep Minit dvere', hasData: true },
      zone4: { rawText: '2 monitory + 1 JTI + 1PMI', count: 4, types: ['Monitory & DOOH', 'Tabak display'], formats: '2x Monitor, 1x JTI, 1x PMI', hasData: true },
      zone5: { rawText: '5 ks | A4', count: 5, types: ['Formát A4'], formats: '5x A4', hasData: true },
      zone6: { rawText: '2x letáky 3x káva | 2XA4 3X A5', count: 5, types: ['Letáky', 'Kaviarenské nosiče', 'Formát A4', 'Formát A5'], formats: '2x A4 (letáky), 3x A5 (káva)', hasData: true },
      zone7: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone8: { rawText: '2 - obojstranné', count: 2, types: ['Obojstranný nosič'], formats: '2x Obojstranný panel', hasData: true },
      zone9: { rawText: '3 zástavy', count: 3, types: ['Zástavy'], formats: '3x Zástava', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 24,
    primaryCarrierTypes: ['Monitory & DOOH', 'Zástavy', 'A0 Bannery', 'Obojstranné panely', 'Formát A1', 'Formát A4'],
  },
  {
    stationName: 'Michalovce',
    stationCode: 'DALIOIL_039',
    stationId: 39,
    region: 'vychod',
    fuelDispensers: '–',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '1 ks | A0', count: 1, types: ['Formát A0'], formats: '1x A0', hasData: true },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone4: { rawText: '2monit + 1 JTI | A4', count: 3, types: ['Monitory & DOOH', 'Tabak display', 'Formát A4'], formats: '2x Monitor, 1x JTI, A4', hasData: true },
      zone5: { rawText: '3 ks | A4', count: 3, types: ['Formát A4'], formats: '3x A4', hasData: true },
      zone6: { rawText: '2 káva | A5', count: 2, types: ['Formát A5', 'Kaviarenské nosiče'], formats: '2x A5 (káva)', hasData: true },
      zone7: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '3 zástavy', count: 3, types: ['Zástavy'], formats: '3x Zástava', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 16,
    primaryCarrierTypes: ['Monitory & DOOH', 'Zástavy', 'Formát A0', 'Formát A1', 'Formát A4'],
  },
  {
    stationName: 'Poprad',
    stationCode: 'DALIOIL_034',
    stationId: 34,
    region: 'vychod',
    fuelDispensers: '–',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone2: { rawText: '4 ks | A1', count: 4, types: ['Formát A1'], formats: '4x A1', hasData: true },
      zone3: { rawText: '4 ks | A1', count: 4, types: ['Formát A1'], formats: '4x A1', hasData: true },
      zone4: { rawText: '2 monitory 2xA4 1xA5', count: 5, types: ['Monitory & DOOH', 'Formát A4', 'Formát A5'], formats: '2x Monitor, 2x A4, 1x A5', hasData: true },
      zone5: { rawText: '5 ks | A4', count: 5, types: ['Formát A4'], formats: '5x A4', hasData: true },
      zone6: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone7: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone8: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone9: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 18,
    primaryCarrierTypes: ['Monitory & DOOH', 'Formát A1', 'Formát A4', 'Formát A5'],
  },
  {
    stationName: 'Strážske',
    stationCode: 'DALIOIL_040',
    stationId: 40,
    region: 'vychod',
    fuelDispensers: '4',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '2+4 | A1, A3', count: 6, types: ['Formát A1', 'Formát A3'], formats: '2x A1, 4x A3', hasData: true },
      zone3: { rawText: '1x algida, 1xpepsi | A1', count: 2, types: ['Formát A1', 'Partner branding'], formats: '1x Algida A1, 1x Pepsi A1', hasData: true },
      zone4: { rawText: '1 ks | A4', count: 1, types: ['Formát A4'], formats: '1x A4', hasData: true },
      zone5: { rawText: '2 ks | A4', count: 2, types: ['Formát A4'], formats: '2x A4', hasData: true },
      zone6: { rawText: '1 ks | A4', count: 1, types: ['Formát A4'], formats: '1x A4', hasData: true },
      zone7: { rawText: '3 ks | A1', count: 3, types: ['Formát A1'], formats: '3x A1', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 15,
    primaryCarrierTypes: ['Formát A1', 'Formát A3', 'Formát A4', 'Algida & Pepsi branding'],
  },
  {
    stationName: 'Tisovec',
    stationCode: 'DALIOIL_041',
    stationId: 41,
    region: 'stred',
    fuelDispensers: '3',
    fuelDispensersCount: 3,
    zones: {
      zone1: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone2: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone3: { rawText: '1 ks | 0', count: 1, types: ['Vstupný nosič'], hasData: true },
      zone4: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone5: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone6: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone7: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone8: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone9: { rawText: '0 ks | 0', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 1,
    primaryCarrierTypes: ['Vstupný nosič'],
  },
  {
    stationName: 'Veľká Lomnica',
    stationCode: 'DALIOIL_036',
    stationId: 36,
    region: 'vychod',
    fuelDispensers: '–',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '3 ks | billboardy', count: 3, types: ['Billboard'], formats: '3x Billboard', hasData: true },
      zone2: { rawText: '1 ks | A1', count: 1, types: ['Formát A1'], formats: '1x A1', hasData: true },
      zone3: { rawText: '1 ks | A1 reklamný stojan + polep minit na vstupných', count: 2, types: ['Formát A1', 'Stojan', 'Polep'], formats: '1x A1 stojan, 1x Polep Minit dvere', hasData: true },
      zone4: { rawText: 'JTI + PMI', count: 2, types: ['Tabak display'], formats: 'JTI + PMI display', hasData: true },
      zone5: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '1 ks | A5', count: 1, types: ['Formát A5'], formats: '1x A5', hasData: true },
      zone7: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 14,
    primaryCarrierTypes: ['Billboard', 'Formát A1', 'Formát A4', 'Tabak display', 'Polep Minit'],
  },
  {
    stationName: 'Beladice',
    stationCode: 'DALIOIL_023',
    stationId: 23,
    region: 'zapad',
    fuelDispensers: '4',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone3: { rawText: '0 ks | A3, A1-2x, A0', count: 4, types: ['Formát A0', 'Formát A1', 'Formát A3'], formats: '1x A0, 2x A1, 1x A3 (pripravené rámy)', hasData: true },
      zone4: { rawText: '0 ks | A4, A5-2x', count: 3, types: ['Formát A4', 'Formát A5'], formats: '1x A4, 2x A5', hasData: true },
      zone5: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone6: { rawText: '0 ks | A4, A3-2x', count: 3, types: ['Formát A4', 'Formát A3'], formats: '1x A4, 2x A3', hasData: true },
      zone7: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone8: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone9: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 10,
    primaryCarrierTypes: ['Formát A0', 'Formát A1', 'Formát A3', 'Formát A4', 'Formát A5'],
    notes: 'Rámové kapacity evidované v audite',
  },
  {
    stationName: 'Bratislava-Vajnory',
    stationCode: 'DALIOIL_001',
    stationId: 1,
    region: 'zapad',
    fuelDispensers: '5',
    fuelDispensersCount: 5,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: 'A1-8ks', count: 8, types: ['Formát A1'], formats: '8x A1 na stojanoch', hasData: true },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '2ks 21x29,6cm', count: 2, types: ['Formát A4'], formats: '2x A4 (21×29,6 cm)', hasData: true },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 10,
    primaryCarrierTypes: ['Formát A1 na stojanoch (8ks)', 'Formát A4 toalety'],
  },
  {
    stationName: 'Bučany',
    stationCode: 'DALIOIL_005',
    stationId: 5,
    region: 'zapad',
    fuelDispensers: '–',
    fuelDispensersCount: 0,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '–', count: 0, types: [], hasData: false },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '–', count: 0, types: [], hasData: false },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 0,
    primaryCarrierTypes: [],
    notes: 'Bez evidovaných nosičov v terénnom audite',
  },
  {
    stationName: 'Most pri Bratislave',
    stationCode: 'DALIOIL_002',
    stationId: 2,
    region: 'zapad',
    fuelDispensers: '3',
    fuelDispensersCount: 3,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '2 ks | A0', count: 2, types: ['Formát A0'], formats: '2x A0', hasData: true },
      zone3: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone4: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone5: { rawText: '2 ks | A4', count: 2, types: ['Formát A4'], formats: '2x A4', hasData: true },
      zone6: { rawText: '2 ks | A4,A5', count: 2, types: ['Formát A4', 'Formát A5'], formats: 'A4, A5', hasData: true },
      zone7: { rawText: '2 ks', count: 2, types: ['Fasádne nosiče'], formats: '2x Budova', hasData: true },
      zone8: { rawText: '3 ks | BILLBOARDY', count: 3, types: ['Billboard'], formats: '3x Billboard', hasData: true },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 15,
    primaryCarrierTypes: ['Billboard', 'Formát A0', 'Formát A4', 'Formát A5', 'Budova nosiče'],
  },
  {
    stationName: 'Podhájska',
    stationCode: 'DALIOIL_024',
    stationId: 24,
    region: 'stred',
    fuelDispensers: '4',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '4 bilboardy', count: 4, types: ['Billboard'], formats: '4x Billboard', hasData: true },
      zone2: { rawText: '6 ks | 2xA1, 4xA3', count: 6, types: ['Formát A1', 'Formát A3'], formats: '2x A1, 4x A3', hasData: true },
      zone3: { rawText: '5 ks | 2xA3,1xA1', count: 5, types: ['Formát A1', 'Formát A3'], formats: '1x A1, 2x A3, +2 ďalšie', hasData: true },
      zone4: { rawText: '7 ks', count: 7, types: ['Pokladničné nosiče'], formats: '7x Pokladňa', hasData: true },
      zone5: { rawText: '4 ks | 4xA4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '2 ks', count: 2, types: ['Fasádne nosiče'], formats: '2x Budova', hasData: true },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 28,
    primaryCarrierTypes: ['Billboard', 'Formát A1', 'Formát A3', 'Formát A4', 'Pokladňa nosiče'],
  },
  {
    stationName: 'Rohožník',
    stationCode: 'DALIOIL_003',
    stationId: 3,
    region: 'zapad',
    fuelDispensers: '4',
    fuelDispensersCount: 4,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: 'A1 -3ks', count: 3, types: ['Formát A1'], formats: '3x A1', hasData: true },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '21x29,6 2ks', count: 2, types: ['Formát A4'], formats: '2x A4 (21×29,6 cm)', hasData: true },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 5,
    primaryCarrierTypes: ['Formát A1', 'Formát A4'],
  },
  {
    stationName: 'Tôň',
    stationCode: 'DALIOIL_009',
    stationId: 9,
    region: 'zapad',
    fuelDispensers: '9',
    fuelDispensersCount: 9,
    zones: {
      zone1: { rawText: '1 ks | plachta', count: 1, types: ['Plachta / Banner'], formats: '1x Plachta', hasData: true },
      zone2: { rawText: '9 ks | A1', count: 9, types: ['Formát A1'], formats: '9x A1', hasData: true },
      zone3: { rawText: '5 ks | A1, A4, vlastný rozmer', count: 5, types: ['Formát A1', 'Formát A4', 'Vlastný rozmer'], formats: 'A1, A4, atypický rozmer', hasData: true },
      zone4: { rawText: '8 ks | 2x monitor cigarety, 2x monitor naše, 1x reklamná plocha Davidoff, 1x rekl.plocha JTI', count: 8, types: ['Monitory & DOOH', 'Tabak display'], formats: '2x monitor cigarety, 2x obrazovka naše, 1x Davidoff, 1x JTI', hasData: true },
      zone5: { rawText: '3 ks | A4', count: 3, types: ['Formát A4'], formats: '3x A4', hasData: true },
      zone6: { rawText: '2 ks | A4', count: 2, types: ['Formát A4'], formats: '2x A4', hasData: true },
      zone7: { rawText: '1 ks | plachta', count: 1, types: ['Plachta / Banner'], formats: '1x Plachta budova', hasData: true },
      zone8: { rawText: '5 ks | billboard', count: 5, types: ['Billboard'], formats: '5x Billboard', hasData: true },
      zone9: { rawText: '2 ks | billboard', count: 2, types: ['Billboard'], formats: '2x Billboard výjazd', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 36,
    primaryCarrierTypes: ['Billboard (7ks)', 'Monitory & DOOH (4ks)', 'Formát A1 (9ks)', 'Plachty', 'Formát A4', 'Tabak panely'],
  },
  {
    stationName: 'Zemianska Olča',
    stationCode: 'DALIOIL_008',
    stationId: 8,
    region: 'zapad',
    fuelDispensers: '7',
    fuelDispensersCount: 7,
    zones: {
      zone1: { rawText: '–', count: 0, types: [], hasData: false },
      zone2: { rawText: '8 ks | A1 a A0', count: 8, types: ['Formát A0', 'Formát A1'], formats: '8x A1 a A0', hasData: true },
      zone3: { rawText: '3 ks | A1 a 2x atypické algida a pierre baguette', count: 3, types: ['Formát A1', 'Partner branding'], formats: '1x A1, 2x atyp (Algida, Pierre Baguette)', hasData: true },
      zone4: { rawText: '8 ks | 2x monitor JTI, 2x obrazovka vlastná, 1x reklamná plocha BAT, 1x rekalmná plocha JTI', count: 8, types: ['Monitory & DOOH', 'Tabak display'], formats: '2x monitor JTI, 2x obrazovka vlastná, 1x BAT, 1x JTI', hasData: true },
      zone5: { rawText: '8 ks | A4', count: 8, types: ['Formát A4'], formats: '8x A4', hasData: true },
      zone6: { rawText: '3 ks | A5', count: 3, types: ['Formát A5'], formats: '3x A5', hasData: true },
      zone7: { rawText: '1 ks', count: 1, types: ['Fasádny nosič'], hasData: true },
      zone8: { rawText: '2 ks | billboard', count: 2, types: ['Billboard'], formats: '2x Billboard', hasData: true },
      zone9: { rawText: '-II- | -II-', count: 2, types: ['Billboard'], formats: '2x Billboard výjazd', hasData: true },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 35,
    primaryCarrierTypes: ['Billboard (4ks)', 'Monitory & DOOH (4ks)', 'Formát A0/A1 (8ks)', 'Formát A4 (8ks)', 'Tabak panely'],
  },
  {
    stationName: 'Čiližská Radvaň',
    stationCode: 'DALIOIL_007',
    stationId: 7,
    region: 'zapad',
    fuelDispensers: '8',
    fuelDispensersCount: 8,
    zones: {
      zone1: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone2: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone3: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone4: { rawText: '6 ks | 4x A4, 1x reklamná plocha Blu bar, 1x Zland', count: 6, types: ['Formát A4', 'Brandové plochy'], formats: '4x A4, 1x Blu bar, 1x Zland', hasData: true },
      zone5: { rawText: '3 ks | A4', count: 3, types: ['Formát A4'], formats: '3x A4', hasData: true },
      zone6: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone7: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone8: { rawText: '3 ks | billboardy', count: 3, types: ['Billboard'], formats: '3x Billboard', hasData: true },
      zone9: { rawText: '0 ks', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 14,
    primaryCarrierTypes: ['Billboard', 'Formát A1', 'Formát A4', 'Brandové plochy (Blu bar, Zland)'],
  },
  {
    stationName: 'Šaštín Stráže',
    stationCode: 'DALIOIL_004',
    stationId: 4,
    region: 'zapad',
    fuelDispensers: '4+1',
    fuelDispensersCount: 5,
    zones: {
      zone1: { rawText: '2 ks', count: 2, types: ['Príjazdový nosič'], hasData: true },
      zone2: { rawText: 'A1-2KS', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone3: { rawText: '–', count: 0, types: [], hasData: false },
      zone4: { rawText: '–', count: 0, types: [], hasData: false },
      zone5: { rawText: '21x29,6 -3ks', count: 3, types: ['Formát A4'], formats: '3x A4 (21×29,6 cm)', hasData: true },
      zone6: { rawText: '–', count: 0, types: [], hasData: false },
      zone7: { rawText: '–', count: 0, types: [], hasData: false },
      zone8: { rawText: '–', count: 0, types: [], hasData: false },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 7,
    primaryCarrierTypes: ['Formát A1', 'Formát A4', 'Príjazdové nosiče'],
  },
  {
    stationName: 'Šintava',
    stationCode: 'DALIOIL_006',
    stationId: 6,
    region: 'zapad',
    fuelDispensers: '2',
    fuelDispensersCount: 2,
    zones: {
      zone1: { rawText: 'zástavy 3x', count: 3, types: ['Zástavy'], formats: '3x Zástava', hasData: true },
      zone2: { rawText: '3 ks | A0', count: 3, types: ['Formát A0'], formats: '3x A0', hasData: true },
      zone3: { rawText: '2 ks | A1', count: 2, types: ['Formát A1'], formats: '2x A1', hasData: true },
      zone4: { rawText: 'letáky | A4', count: 1, types: ['Letáky', 'Formát A4'], formats: 'Letáky A4', hasData: true },
      zone5: { rawText: '4 ks | A4', count: 4, types: ['Formát A4'], formats: '4x A4', hasData: true },
      zone6: { rawText: '2 ks | A4, A5', count: 2, types: ['Formát A4', 'Formát A5'], formats: 'A4, A5', hasData: true },
      zone7: { rawText: '1 ks | plachta', count: 1, types: ['Plachta / Banner'], formats: '1x Plachta', hasData: true },
      zone8: { rawText: '3 ks | bilbordy', count: 3, types: ['Billboard'], formats: '3x Billboard', hasData: true },
      zone9: { rawText: '–', count: 0, types: [], hasData: false },
      zone10: { rawText: '–', count: 0, types: [], hasData: false },
      zone11: { rawText: '–', count: 0, types: [], hasData: false },
      zone12: { rawText: '–', count: 0, types: [], hasData: false },
    },
    totalCarriersCount: 19,
    primaryCarrierTypes: ['Billboard', 'Zástavy (3ks)', 'Formát A0', 'Formát A1', 'Formát A4', 'Plachta'],
  },
];

// O(1) Quick Index Map by stationId and stationCode
const AUDIT_BY_ID_MAP = new Map<number, StationCarrierAudit>();
const AUDIT_BY_CODE_MAP = new Map<string, StationCarrierAudit>();

for (const audit of CARRIER_AUDIT_DATA) {
  AUDIT_BY_ID_MAP.set(audit.stationId, audit);
  AUDIT_BY_CODE_MAP.set(audit.stationCode, audit);
}

/**
 * Získa audit zberu dát nosičov pre konkrétnu čerpaciu stanicu podľa ID alebo kódu
 */
export function getStationCarrierAudit(idOrCode: number | string): StationCarrierAudit | undefined {
  if (typeof idOrCode === 'number') {
    return AUDIT_BY_ID_MAP.get(idOrCode);
  }
  return AUDIT_BY_CODE_MAP.get(idOrCode);
}

export interface NetworkCarrierAuditSummary {
  totalAuditedStations: number;
  totalFuelDispensers: number;
  totalCarriersRecorded: number;
  totalBillboards: number;
  totalDigitalMonitors: number;
  totalFormatA0: number;
  totalFormatA1: number;
  totalFormatA4: number;
  totalFlags: number;
  totalBanners: number;
  topStationsByCarriers: { name: string; count: number; dispensers: string }[];
  carriersByZone: { zoneNumber: number; zoneName: string; totalCarriers: number }[];
}

/**
 * Vypočíta agregovaný sumár zberu dát pre celú sieť
 */
export function getCarrierAuditsSummary(): NetworkCarrierAuditSummary {
  let totalDispensers = 0;
  let totalCarriers = 0;
  let totalBillboards = 0;
  let totalDigitalMonitors = 0;
  let totalA0 = 0;
  let totalA1 = 0;
  let totalA4 = 0;
  let totalFlags = 0;
  let totalBanners = 0;

  const zoneSums: number[] = new Array(13).fill(0);

  for (const s of CARRIER_AUDIT_DATA) {
    totalDispensers += s.fuelDispensersCount;
    totalCarriers += s.totalCarriersCount;

    const z = s.zones;
    zoneSums[1] += z.zone1.count;
    zoneSums[2] += z.zone2.count;
    zoneSums[3] += z.zone3.count;
    zoneSums[4] += z.zone4.count;
    zoneSums[5] += z.zone5.count;
    zoneSums[6] += z.zone6.count;
    zoneSums[7] += z.zone7.count;
    zoneSums[8] += z.zone8.count;
    zoneSums[9] += z.zone9.count;
    zoneSums[10] += z.zone10.count;
    zoneSums[11] += z.zone11.count;
    zoneSums[12] += z.zone12.count;

    // Scan types and text
    const allText = Object.values(z).map((item) => `${item.rawText} ${item.types.join(' ')}`).join(' ').toLowerCase();

    if (allText.includes('bilboard') || allText.includes('billboard') || allText.includes('bilb')) {
      // count billboards
      const matches = (
        (z.zone1.types.includes('Billboard') ? z.zone1.count : 0) +
        (z.zone7.types.includes('Billboard') ? z.zone7.count : 0) +
        (z.zone8.types.includes('Billboard') ? z.zone8.count : 0) +
        (z.zone9.types.includes('Billboard') ? z.zone9.count : 0)
      );
      totalBillboards += matches;
    }

    if (allText.includes('monitor') || allText.includes('obrazovk') || allText.includes('lcd')) {
      const monCount = (z.zone4.types.includes('Monitory & DOOH') ? z.zone4.count : 0);
      totalDigitalMonitors += monCount;
    }

    if (allText.includes('a0')) {
      totalA0 += (z.zone1.types.includes('Formát A0') ? z.zone1.count : 0) +
                 (z.zone2.types.includes('Formát A0') ? z.zone2.count : 0) +
                 (z.zone3.types.includes('Formát A0') ? z.zone3.count : 0);
    }

    if (allText.includes('a1')) {
      totalA1 += (z.zone2.types.includes('Formát A1') ? z.zone2.count : 0) +
                 (z.zone3.types.includes('Formát A1') ? z.zone3.count : 0) +
                 (z.zone7.types.includes('Formát A1') ? z.zone7.count : 0);
    }

    if (allText.includes('a4')) {
      totalA4 += (z.zone4.types.includes('Formát A4') ? z.zone4.count : 0) +
                 (z.zone5.types.includes('Formát A4') ? z.zone5.count : 0) +
                 (z.zone6.types.includes('Formát A4') ? z.zone6.count : 0);
    }

    if (allText.includes('zástav') || allText.includes('zastav')) {
      totalFlags += (z.zone1.types.includes('Zástavy') ? z.zone1.count : 0) +
                    (z.zone9.types.includes('Zástavy') ? z.zone9.count : 0);
    }

    if (allText.includes('placht') || allText.includes('banner') || allText.includes('baner')) {
      totalBanners += (z.zone1.types.includes('Plachta / Banner') ? z.zone1.count : 0) +
                      (z.zone7.types.includes('Plachta / Banner') ? z.zone7.count : 0) +
                      (z.zone8.types.includes('Plachta / Banner') ? z.zone8.count : 0) +
                      (z.zone9.types.includes('Plachta / Banner') ? z.zone9.count : 0);
    }
  }

  const sortedStations = [...CARRIER_AUDIT_DATA].sort((a, b) => b.totalCarriersCount - a.totalCarriersCount);

  const zoneNames = [
    '',
    '1. Príjazdová zóna & Totem',
    '2. Výdajné stojany & Ostrovy',
    '3. Vstupná zóna do shopu',
    '4. Pokladničná zóna & Pult',
    '5. Toaletná zóna & WC',
    '6. Kaviarenský kútik Cafe',
    '7. Fasáda budovy & Vchod',
    '8. Parkovisko & Areál',
    '9. Výjazdová zóna',
    '10. Autoumyváreň',
    '11. Vonkajšia terasa',
    '12. Ostatné priestory',
  ];

  const carriersByZone = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => ({
    zoneNumber: num,
    zoneName: zoneNames[num],
    totalCarriers: zoneSums[num],
  }));

  return {
    totalAuditedStations: CARRIER_AUDIT_DATA.length,
    totalFuelDispensers: totalDispensers,
    totalCarriersRecorded: totalCarriers,
    totalBillboards,
    totalDigitalMonitors,
    totalFormatA0: totalA0,
    totalFormatA1: totalA1,
    totalFormatA4: totalA4,
    totalFlags,
    totalBanners,
    topStationsByCarriers: sortedStations.slice(0, 5).map((s) => ({
      name: s.stationName,
      count: s.totalCarriersCount,
      dispensers: s.fuelDispensers,
    })),
    carriersByZone,
  };
}
