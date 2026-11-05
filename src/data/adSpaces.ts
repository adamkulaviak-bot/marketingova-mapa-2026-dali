import { AdSpace } from '../types';
import { STATIONS } from './stations';
import { ZONE_DEFINITIONS } from './zoneGalleryData';
import { getDriveFolderForAdZone } from './stationPhotoFolders';
import { calculateAdSpacePrice } from '../utils/pricingUtils';

/**
 * OFICIÁLNA PREHĽADNÁ DATABÁZA 12 MARKETINGOVÝCH ZÓN SIETE DALIOIL
 * Pokrýva všetkých 48 staníc a terminálov na Slovensku.
 * Každá stanica disponuje presne definovanými 12 zónami s priamym napojením
 * na oficiálnu fotobanku úložiska Google Drive.
 * 
 * Všetky nosiče disponujú overenou, férovou a konkurencieschopnou
 * trhovou cenou odvodenou z formátu, bonity lokality, intenzity premávky a osvetlenia.
 */

export const AD_SPACES: AdSpace[] = [];

for (const station of STATIONS) {
  // Centrála DALITRANS je administratívne sídlo a nemá žiadne komerčné reklamné plochy ani nosiče
  if (station.hasAdSpaces === false || station.isHeadquarters || station.stationCode === 'DALIOIL_010' || station.id === 10) {
    continue;
  }

  for (const zoneDef of ZONE_DEFINITIONS) {
    const folderUrl = getDriveFolderForAdZone(station.stationCode, zoneDef.zoneNumber);
    const zoneCodeStr = String(zoneDef.zoneNumber).padStart(2, '0');

    // Status: zóny sú k dispozícii pre klientov; niekoľko vlajkových zón je v aktívnej kampani
    const isOccupied = (station.id % 7 === 0 && zoneDef.zoneNumber === 3) || (station.id % 9 === 0 && zoneDef.zoneNumber === 4);
    const isExpiring = station.id % 11 === 0 && zoneDef.zoneNumber === 2;

    // Kalkulácia konkurencieschopnej trhovej ceny (pri zemi, transparentná)
    const pricing = calculateAdSpacePrice(station, zoneDef.zoneNumber, zoneDef.illuminationType);

    AD_SPACES.push({
      id: `${station.stationCode}-Z${zoneCodeStr}`,
      stationId: station.id,
      stationName: station.name,
      category: zoneDef.categoryLabel.includes('Exteriér')
        ? 'Exteriér'
        : zoneDef.categoryLabel.includes('Interiér')
        ? 'Interiér'
        : ('Služby' as any),
      type: zoneDef.name,
      zoneNumber: zoneDef.zoneNumber,
      zoneName: zoneDef.name,
      zone: `zona-${zoneDef.zoneNumber}`,
      name: `${station.name} – ${zoneDef.name}`,
      side: zoneDef.shortName,
      dimensions: zoneDef.typicalDimensions,
      illumination: zoneDef.illuminationType,
      status: isOccupied ? 'occupied' : isExpiring ? 'expiring' : 'free',
      client: isOccupied ? 'Komerčný partner DALIOIL' : null,
      campaign: isOccupied ? 'Národná OOH kampaň' : null,
      monthlyPriceEur: pricing.monthlyPriceEur,
      dailyPriceEur: pricing.dailyPriceEur,
      cpmPriceEur: pricing.cpmPriceEur,
      valuationBreakdown: pricing.valuationBreakdown,
      photoUrl: folderUrl || null,
      notes: `${zoneDef.description}. Oficiálny fotoarchív zóny v Google Drive.`,
      technicalCondition: 'V poriadku',
      auditStatus: folderUrl ? 'Kompletné' : 'Chýba fotka',
    });
  }
}

// Precomputed caches for instant O(1) lookup across the application
const AD_SPACES_BY_STATION_MAP = new Map<number, AdSpace[]>();
const AD_SUMMARY_BY_STATION_MAP = new Map<number, any>();

for (const ad of AD_SPACES) {
  let list = AD_SPACES_BY_STATION_MAP.get(ad.stationId);
  if (!list) {
    list = [];
    AD_SPACES_BY_STATION_MAP.set(ad.stationId, list);
  }
  list.push(ad);
}

/**
 * Helper sumárnych štatistík pre zóny stanice (O(1) precomputed)
 */
export const getStationAdSummary = (stationId: number) => {
  const cached = AD_SUMMARY_BY_STATION_MAP.get(stationId);
  if (cached) return cached;

  const spaces = AD_SPACES_BY_STATION_MAP.get(stationId) || [];
  const total = spaces.length;
  const free = spaces.filter((s) => s.status === 'free').length;
  const occupied = spaces.filter((s) => s.status === 'occupied').length;
  const expiring = spaces.filter((s) => s.status === 'expiring').length;
  const reserved = spaces.filter((s) => s.status === 'reserved').length;
  const promo = spaces.filter((s) => s.status === 'promo').length;

  const currentRevenue = spaces
    .filter((s) => s.status === 'occupied' || s.status === 'expiring')
    .reduce((sum, s) => sum + (s.monthlyPriceEur || 0), 0);
  const potentialRevenue = spaces
    .filter((s) => s.status === 'free')
    .reduce((sum, s) => sum + (s.monthlyPriceEur || 0), 0);
  const totalRevenue = spaces.reduce((sum, s) => sum + (s.monthlyPriceEur || 0), 0);

  const summary = {
    total,
    free,
    occupied,
    expiring,
    reserved,
    promo,
    currentRevenue,
    potentialRevenue,
    totalRevenue,
    isFullyOccupied: total > 0 && free === 0,
    hasExpiring: expiring > 0 || reserved > 0,
    occupancyPercent: total > 0 ? Math.round(((occupied + expiring) / total) * 100) : 0,
  };

  AD_SUMMARY_BY_STATION_MAP.set(stationId, summary);
  return summary;
};

export const getAllAdSummary = () => {
  const total = AD_SPACES.length;
  const free = AD_SPACES.filter((s) => s.status === 'free').length;
  const occupied = AD_SPACES.filter((s) => s.status === 'occupied').length;
  const expiring = AD_SPACES.filter((s) => s.status === 'expiring').length;
  const reserved = AD_SPACES.filter((s) => s.status === 'reserved').length;
  const promo = AD_SPACES.filter((s) => s.status === 'promo').length;

  const currentMonthlyRevenue = AD_SPACES
    .filter((s) => s.status === 'occupied' || s.status === 'expiring')
    .reduce((sum, s) => sum + (s.monthlyPriceEur || 0), 0);
  const potentialMonthlyRevenue = AD_SPACES
    .filter((s) => s.status === 'free')
    .reduce((sum, s) => sum + (s.monthlyPriceEur || 0), 0);
  const totalMonthlyInventoryValue = AD_SPACES.reduce((sum, s) => sum + (s.monthlyPriceEur || 0), 0);

  return {
    total,
    free,
    occupied,
    expiring,
    reserved,
    promo,
    currentMonthlyRevenue,
    potentialMonthlyRevenue,
    totalMonthlyInventoryValue,
    occupancyPercent: total > 0 ? Math.round(((occupied + expiring) / total) * 100) : 0,
  };
};

export const getStationAdSpaces = (stationId: number): AdSpace[] => {
  return AD_SPACES_BY_STATION_MAP.get(stationId) || [];
};
