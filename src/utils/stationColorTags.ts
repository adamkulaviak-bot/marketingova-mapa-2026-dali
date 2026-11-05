export interface StationPointStyle {
  stationId: number;
  color?: string; // HEX farba celého pointu (napr. #E11D23, #10B981, atď.)
  size?: number;  // Samostatná veľkosť pointu v pixeloch (napr. 24 až 64 px)
  label?: string; // Voliteľný textový štítok/poznámka
  updatedAt: number;
}

export type StationColorTag = StationPointStyle;

export interface TagColorOption {
  color: string;
  name: string;
  bgClass: string;
  borderClass: string;
}

export const TAG_COLORS: TagColorOption[] = [
  { color: '#E11D23', name: 'DALIOIL Červená', bgClass: 'bg-red-600', borderClass: 'border-red-700' },
  { color: '#10B981', name: 'Smaragdová Zelená', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-600' },
  { color: '#2563EB', name: 'Kráľovská Modrá', bgClass: 'bg-blue-600', borderClass: 'border-blue-700' },
  { color: '#F59E0B', name: 'Jantárová Žltá', bgClass: 'bg-amber-500', borderClass: 'border-amber-600' },
  { color: '#8B5CF6', name: 'Prémiová Fialová', bgClass: 'bg-purple-500', borderClass: 'border-purple-600' },
  { color: '#06B6D4', name: 'Tyrkysová Cyan', bgClass: 'bg-cyan-500', borderClass: 'border-cyan-600' },
  { color: '#EC4899', name: 'Magická Ružová', bgClass: 'bg-pink-500', borderClass: 'border-pink-600' },
  { color: '#475569', name: 'Bridlicová Sivá', bgClass: 'bg-slate-600', borderClass: 'border-slate-700' },
];

const STORAGE_KEY = 'dalioil_station_color_tags_v1';
export const COLOR_TAGS_EVENT = 'dalioil_color_tags_changed';

export function getStoredColorTags(): Record<number, StationPointStyle> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load station point styles:', err);
    return {};
  }
}

export function saveStoredColorTags(tags: Record<number, StationPointStyle>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    window.dispatchEvent(new CustomEvent(COLOR_TAGS_EVENT, { detail: tags }));
  } catch (err) {
    console.error('Failed to save station point styles:', err);
  }
}

export function getColorTag(stationId: number): StationPointStyle | undefined {
  const tags = getStoredColorTags();
  return tags[stationId];
}

export function setStationColorTag(stationId: number, color: string, label?: string, size?: number): void {
  const tags = getStoredColorTags();
  const existing = tags[stationId];
  tags[stationId] = {
    stationId,
    color,
    size: size !== undefined ? size : existing?.size,
    label: label !== undefined ? (label.trim() || undefined) : existing?.label,
    updatedAt: Date.now(),
  };
  saveStoredColorTags(tags);
}

export function setStationPointSize(stationId: number, size: number): void {
  const tags = getStoredColorTags();
  const existing = tags[stationId];
  tags[stationId] = {
    stationId,
    color: existing?.color || '#E11D23',
    size,
    label: existing?.label,
    updatedAt: Date.now(),
  };
  saveStoredColorTags(tags);
}

export function removeStationColorTag(stationId: number): void {
  const tags = getStoredColorTags();
  if (tags[stationId]) {
    delete tags[stationId];
    saveStoredColorTags(tags);
  }
}

export function resetStationPointSize(stationId: number): void {
  const tags = getStoredColorTags();
  if (tags[stationId]) {
    delete tags[stationId].size;
    if (!tags[stationId].color && !tags[stationId].label) {
      delete tags[stationId];
    } else {
      tags[stationId].updatedAt = Date.now();
    }
    saveStoredColorTags(tags);
  }
}

export function clearAllStationColorTags(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(COLOR_TAGS_EVENT, { detail: {} }));
  } catch (err) {
    console.error('Failed to clear station color tags:', err);
  }
}

export function bulkSetStationColorTags(stationIds: number[], color: string, label?: string, size?: number): void {
  const tags = getStoredColorTags();
  const now = Date.now();
  const trimmedLabel = label?.trim() || undefined;

  stationIds.forEach((id) => {
    const existing = tags[id];
    tags[id] = {
      stationId: id,
      color,
      size: size !== undefined ? size : existing?.size,
      label: trimmedLabel !== undefined ? trimmedLabel : existing?.label,
      updatedAt: now,
    };
  });
  saveStoredColorTags(tags);
}

export function bulkSetStationPointSize(stationIds: number[], size: number): void {
  const tags = getStoredColorTags();
  const now = Date.now();

  stationIds.forEach((id) => {
    const existing = tags[id];
    tags[id] = {
      stationId: id,
      color: existing?.color || '#E11D23',
      size,
      label: existing?.label,
      updatedAt: now,
    };
  });
  saveStoredColorTags(tags);
}
