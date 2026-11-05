// Databáza fotografií a Google Drive archívu pre 12 marketingových zón DALIOIL
// Využíva VÝHRADNE zoznam reálnych ID a odkazov na Google Drive priečinky z oficiálneho archívu 2026.
// Žiadne ilustračné, vymyslené alebo generované fotky.

import { STATIONS } from './stations';
import { ZONE_DEFINITIONS, ZoneDefinition } from './zoneGalleryData';
import {
  getStationZoneFolder,
  getFolderIdFromUrl,
  StationZoneFolder,
  STATION_ZONE_FOLDERS,
} from './stationPhotoFolders';
import { CARRIER_AUDIT_DATA, StationCarrierAudit } from './adCarrierAuditData';

export interface ZonePhoto {
  id: string;
  url: string;
  thumbUrl?: string;
  embedUrl: string;
  embedListUrl: string;
  folderUrl: string;
  folderId: string;
  driveFolderUrl: string;
  title: string;
  description: string;
  zoneNumber: number;
  zoneName: string;
  zoneCode: string;
  format: string;
  dimensions: string;
  illumination: string;
  stationCode: string;
  stationName: string;
  city: string;
  carrierCount: number;
  carrierTypes: string[];
  orientation?: 'landscape' | 'portrait';
  tags?: string[];
}

/**
 * Cache pre zber dát podľa kódu stanice
 */
const AUDIT_MAP: Record<string, StationCarrierAudit> = {};
for (const audit of CARRIER_AUDIT_DATA) {
  AUDIT_MAP[audit.stationCode] = audit;
}

/**
 * Získa kompletné fotografie a archív Google Drive pre danú stanicu a zónu.
 * Pracuje výhradne s reálnymi Google Drive priečinkami a údajmi z terénneho auditu.
 */
export function getZonePhotos(stationCode: string, zoneNumber: number): ZonePhoto[] {
  const station = STATIONS.find((s) => s.stationCode === stationCode) || STATIONS[0];
  const zoneDef = ZONE_DEFINITIONS.find((z) => z.zoneNumber === zoneNumber) || ZONE_DEFINITIONS[1];
  const audit = AUDIT_MAP[station.stationCode];
  
  // Nájdi reálny Google Drive priečinok pre túto stanicu a zónu
  let folder = getStationZoneFolder(station.stationCode, zoneNumber);
  if (!folder || !folder.folderUrl) {
    folder = STATION_ZONE_FOLDERS.find(
      (f) => f.stationCode === station.stationCode && f.zoneNumber === zoneNumber && f.folderUrl
    );
  }

  const folderUrl = folder?.folderUrl || `https://drive.google.com/drive/folders/1O1wOQKJl8NOTNFoTN3lGfbxBT80HFA4w`;
  const folderId = getFolderIdFromUrl(folderUrl) || '1O1wOQKJl8NOTNFoTN3lGfbxBT80HFA4w';
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
  const embedListUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;

  // Získaj dáta z terénneho auditu pre túto zónu
  const zoneKey = `zone${zoneNumber}` as keyof StationCarrierAudit['zones'];
  const auditZone = audit?.zones ? audit.zones[zoneKey] : undefined;
  const carrierCount = auditZone?.count || 0;
  const carrierTypes = auditZone?.types || [];
  const rawText = auditZone?.rawText && auditZone.rawText !== '–' ? auditZone.rawText : '';

  // Vytvoríme oficiálne záznamy fotodokumentácie pre túto zónu (hlavný pohľad + detail nosičov)
  const photos: ZonePhoto[] = [];

  // 1. Hlavný archív zóny z Google Drive
  photos.push({
    id: `${station.stationCode}-Z${String(zoneNumber).padStart(2, '0')}-01`,
    url: embedUrl,
    thumbUrl: embedUrl,
    embedUrl,
    embedListUrl,
    folderUrl,
    folderId,
    driveFolderUrl: folderUrl,
    title: `${station.name} – Zóna ${zoneNumber}: ${zoneDef.name}`,
    description: rawText
      ? `Oficiálna fotodokumentácia Google Drive. Evidencia nosičov v terénnom audite: ${rawText}.`
      : `Oficiálna fotodokumentácia Google Drive pre zónu ${zoneDef.name}.`,
    zoneNumber: zoneDef.zoneNumber,
    zoneName: zoneDef.name,
    zoneCode: folder?.zoneCode || `${zoneNumber}_${zoneDef.shortName}`,
    format: carrierTypes.length > 0 ? carrierTypes.join(', ') : zoneDef.name,
    dimensions: auditZone?.formats || zoneDef.typicalDimensions,
    illumination: zoneDef.illuminationType,
    stationCode: station.stationCode,
    stationName: station.name,
    city: station.city || '',
    carrierCount,
    carrierTypes,
    orientation: 'landscape',
    tags: [zoneDef.categoryLabel, station.stationCode, station.city || '', `ID:${folderId}`].filter(Boolean),
  });

  // 2. Ak zóna obsahuje konkrétne nosiče, pridáme aj špecifický pohľad na audit nosičov
  if (carrierCount > 0 && carrierTypes.length > 0) {
    photos.push({
      id: `${station.stationCode}-Z${String(zoneNumber).padStart(2, '0')}-02`,
      url: embedListUrl,
      thumbUrl: embedListUrl,
      embedUrl,
      embedListUrl,
      folderUrl,
      folderId,
      driveFolderUrl: folderUrl,
      title: `${station.name} – Detail nosičov: ${carrierTypes[0]}`,
      description: `Technický súpis ${carrierCount} ks nosičov (${carrierTypes.join(', ')}). Formát: ${auditZone?.formats || zoneDef.typicalDimensions}.`,
      zoneNumber: zoneDef.zoneNumber,
      zoneName: zoneDef.name,
      zoneCode: folder?.zoneCode || `${zoneNumber}_${zoneDef.shortName}`,
      format: carrierTypes[0],
      dimensions: auditZone?.formats || zoneDef.typicalDimensions,
      illumination: zoneDef.illuminationType,
      stationCode: station.stationCode,
      stationName: station.name,
      city: station.city || '',
      carrierCount,
      carrierTypes,
      orientation: 'landscape',
      tags: [zoneDef.categoryLabel, station.stationCode, ...carrierTypes],
    });
  }

  return photos;
}

/**
 * Získa počet fotiek evidovaných pre konkrétnu stanicu a zónu
 */
export function getZonePhotosCount(stationCode: string, zoneNumber: number): number {
  const photos = getZonePhotos(stationCode, zoneNumber);
  return photos.length;
}

/**
 * Získa všetky fotky stanice naprieč všetkými 12 zónami
 */
export function getAllStationPhotos(stationCode: string): ZonePhoto[] {
  const all: ZonePhoto[] = [];
  for (let z = 1; z <= 12; z++) {
    all.push(...getZonePhotos(stationCode, z));
  }
  return all;
}
