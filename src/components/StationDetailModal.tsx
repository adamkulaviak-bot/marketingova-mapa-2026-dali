import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar,
  DollarSign,
  Building2,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Navigation,
  Phone,
  Mail,
  Share2,
  Eye,
  Camera,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
  Car,
  Users,
  Send,
  Check,
  Copy,
  Briefcase,
  ExternalLink,
  Globe,
  Wrench,
  Plus,
  Palette,
  Printer,
  Table,
  LayoutGrid,
  ShieldAlert,
  User,
  Receipt,
  Folder,
  FolderOpen,
  Fuel,
  Coffee,
  Umbrella,
  Droplets,
  ArrowRight,
  Search,
  LogIn,
  Grid,
  List,
  Maximize2,
  Minimize2,
  Tv,
} from 'lucide-react';
import { Station, RegionInfo, AdSpace, AdStatus, AdIncident, StationDetailTab } from '../types';
import { getStationAdSpaces, getStationAdSummary } from '../data/adSpaces';
import {
  getStationIncidents,
  updateIncidentStatus,
  SEVERITY_CONFIG,
  STATUS_CONFIG,
  INCIDENT_TYPE_LABELS,
} from '../data/incidentsData';
import {
  getStationZoneFolders,
  getDriveFolderForAdZone,
  getDriveFolderForAd,
  getEmbeddedFolderViewUrl,
  getStationZoneFolder,
  StationZoneFolder,
} from '../data/stationPhotoFolders';
import { ZONE_DEFINITIONS, getZoneDefinition } from '../data/zoneGalleryData';
import { getStationCarrierAudit, AUDIT_PDF_PATH } from '../data/adCarrierAuditData';
import { NativeZonePhotoViewer } from './NativeZonePhotoViewer';
import { LcdScreensViewer } from './LcdScreensViewer';
import { hasStationLcdScreens } from '../data/lcdScreensData';
import { getPhotosForZone } from '../data/drivePhotosManifest';
import {
  getColorTag,
  setStationColorTag,
  removeStationColorTag,
  setStationPointSize,
  resetStationPointSize,
  TAG_COLORS,
  COLOR_TAGS_EVENT,
  StationColorTag,
} from '../utils/stationColorTags';

interface StationDetailModalProps {
  station: Station | null;
  region: RegionInfo | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: StationDetailTab;
  campaignPlanItemIds?: Set<string>;
  onToggleCampaignPlanItem?: (adSpace: AdSpace, station: Station) => void;
  onOpenReportIncident?: (station: Station, adSpace?: AdSpace) => void;
  onOpenCarrierAudit?: () => void;
  onOpenZonePhotoBank?: (stationCode: string, zoneNumber: number) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  region,
  isOpen,
  onClose,
  initialTab = 'photos',
  campaignPlanItemIds,
  onToggleCampaignPlanItem,
  onOpenReportIncident,
  onOpenCarrierAudit,
  onOpenZonePhotoBank,
}) => {
  const [activeTab, setActiveTab] = useState<StationDetailTab>('photos');
  const [adFilter, setAdFilter] = useState<'all' | 'free' | 'expiring' | 'occupied' | 'incidents'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedZoneFolder, setSelectedZoneFolder] = useState<StationZoneFolder | null>(null);
  const [embedViewMode, setEmbedViewMode] = useState<'grid' | 'list'>('grid');
  const [isEmbedExpanded, setIsEmbedExpanded] = useState<boolean>(false);
  const [previewZoneNumber, setPreviewZoneNumber] = useState<number>(2); // Default to zone 2 (výdajné stojany) for inline viewer
  const [inquiryAd, setInquiryAd] = useState<AdSpace | null>(null);
  const [inquirySent, setInquirySent] = useState<boolean>(false);
  const [copiedAdId, setCopiedAdId] = useState<string | null>(null);
  const [copiedZoneFolderUrl, setCopiedZoneFolderUrl] = useState<string | null>(null);
  const [copiedGoogleLink, setCopiedGoogleLink] = useState<'map' | 'street' | null>(null);
  const [photoZoneFilter, setPhotoZoneFilter] = useState<'all' | 'exterior' | 'interior' | 'services'>('all');
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  const [incidents, setIncidents] = useState<AdIncident[]>([]);

  // Custom Point Color Tag for this station
  const [currentTag, setCurrentTag] = useState<StationColorTag | undefined>(() =>
    station ? getColorTag(station.id) : undefined
  );

  useEffect(() => {
    if (station) {
      setCurrentTag(getColorTag(station.id));
    }
  }, [station]);

  useEffect(() => {
    const handleTagsChange = () => {
      if (station) {
        setCurrentTag(getColorTag(station.id));
      }
    };
    window.addEventListener(COLOR_TAGS_EVENT, handleTagsChange);
    return () => window.removeEventListener(COLOR_TAGS_EVENT, handleTagsChange);
  }, [station]);

  // Google Drive photo folders for this station
  const stationZoneFolders = useMemo(() => {
    if (!station) return [];
    return getStationZoneFolders(station.stationCode);
  }, [station?.stationCode]);

  // Official carrier and fuel dispenser audit data from PDF
  const stationAudit = useMemo(() => {
    if (!station) return undefined;
    return getStationCarrierAudit(station.id) || getStationCarrierAudit(station.stationCode);
  }, [station]);

  // Form state for inquiry
  const [inquiryClient, setInquiryClient] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMonths, setInquiryMonths] = useState('3');

  // Load incidents for this station
  const loadStationIncidents = () => {
    if (station) {
      setIncidents(getStationIncidents(station.id));
    }
  };

  useEffect(() => {
    if (isOpen && station) {
      const hasLcd = hasStationLcdScreens(station);
      const effectiveTab = !hasLcd && initialTab === 'lcd' ? 'info' : initialTab;
      setActiveTab(effectiveTab);
      setAdFilter('all');
      setInquiryAd(null);
      setInquirySent(false);
      setSelectedZoneFolder(null);
      setIsEmbedExpanded(false);
      setPreviewZoneNumber(2);
      loadStationIncidents();
    }
  }, [isOpen, initialTab, station?.id]);

  useEffect(() => {
    const handleIncidentsChanged = () => loadStationIncidents();
    window.addEventListener('senior_ooh_incidents_changed', handleIncidentsChanged);
    return () => window.removeEventListener('senior_ooh_incidents_changed', handleIncidentsChanged);
  }, [station?.id]);

  // Active incidents map by adSpaceId (hook MUST be before early return)
  const incidentsByAdSpace = useMemo(() => {
    const map = new Map<string, AdIncident[]>();
    incidents.forEach((inc) => {
      if (inc.status !== 'resolved') {
        const list = map.get(inc.adSpaceId) || [];
        list.push(inc);
        map.set(inc.adSpaceId, list);
      }
    });
    return map;
  }, [incidents]);

  // Filtered zone photo folders (hook MUST be before early return)
  const filteredZoneFolders = useMemo(() => {
    return stationZoneFolders.filter((f) => {
      if (photoZoneFilter === 'exterior') {
        if (![1, 2, 7, 8, 9].includes(f.zoneNumber)) return false;
      } else if (photoZoneFilter === 'interior') {
        if (![3, 4, 5, 6].includes(f.zoneNumber)) return false;
      } else if (photoZoneFilter === 'services') {
        if (![10, 11, 12].includes(f.zoneNumber)) return false;
      }
      if (photoSearchQuery.trim()) {
        const q = photoSearchQuery.toLowerCase();
        if (
          !f.zoneName.toLowerCase().includes(q) &&
          !f.zoneCode.toLowerCase().includes(q) &&
          !String(f.zoneNumber).includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [stationZoneFolders, photoZoneFilter, photoSearchQuery]);

  if (!isOpen || !station || !region) return null;

  const adSpaces = getStationAdSpaces(station.id);
  const adSummary = getStationAdSummary(station.id);

  // Filtered ads
  const filteredAds = adSpaces.filter((ad) => {
    if (adFilter === 'free' && ad.status !== 'free') return false;
    if (adFilter === 'expiring' && ad.status !== 'expiring' && ad.status !== 'reserved') return false;
    if (adFilter === 'occupied' && ad.status !== 'occupied') return false;
    if (adFilter === 'incidents' && !incidentsByAdSpace.has(ad.id)) return false;
    return true;
  });

  const handleOpenAdFolder = (ad: AdSpace) => {
    const folder = getDriveFolderForAd(station.stationCode, ad.zoneNumber || ad.zone, ad.category);
    if (folder) {
      setSelectedZoneFolder(folder);
    }
  };

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedAdId(id);
    setTimeout(() => setCopiedAdId(null), 2000);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquiryAd(null);
      setInquirySent(false);
    }, 2500);
  };

  const handlePrintOffer = () => {
    window.print();
  };

  const getStatusBadge = (status: AdStatus, daysLeft?: number | null) => {
    switch (status) {
      case 'free':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            VOĽNÁ NA PRENÁJOM
          </span>
        );
      case 'expiring':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-600 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            KONČÍ O {daysLeft || 7} DNÍ
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-950/90 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-600">
            <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
            REZERVOVANÁ
          </span>
        );
      case 'occupied':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-700">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            OBSADENÁ
          </span>
        );
    }
  };

  const getZoneIcon = (zoneNumber: number) => {
    switch (zoneNumber) {
      case 1:
        return Navigation;
      case 2:
        return Fuel;
      case 3:
        return LogIn;
      case 4:
        return Receipt;
      case 5:
        return Users;
      case 6:
        return Coffee;
      case 7:
        return Building2;
      case 8:
        return Car;
      case 9:
        return ArrowRight;
      case 10:
        return Droplets;
      case 11:
        return Umbrella;
      case 12:
      default:
        return Folder;
    }
  };

  const handleCopyZoneUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedZoneFolderUrl(url);
    setTimeout(() => setCopiedZoneFolderUrl(null), 2000);
  };

  const handleCopyGoogleLink = (url: string, type: 'map' | 'street') => {
    navigator.clipboard.writeText(url);
    setCopiedGoogleLink(type);
    setTimeout(() => setCopiedGoogleLink(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Slide-over Container */}
      <div
        id="station-detail-modal"
        className="w-full sm:w-[580px] md:w-[680px] lg:w-[760px] h-full bg-white dark:bg-[#10141d] border-l border-slate-200 dark:border-gray-800 text-slate-800 dark:text-slate-100 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Top Header with Station Identity */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-white dark:from-[#151c28] dark:to-[#10141d] border-b border-slate-200 dark:border-gray-800 shrink-0">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1.5 flex-1 min-w-0">
              {/* Badges strip */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="font-mono font-black px-2 py-0.5 rounded bg-slate-200 dark:bg-gray-800 text-slate-800 dark:text-gray-200 border border-slate-300 dark:border-gray-700">
                  {station.stationCode || `CS-${String(station.id).padStart(3, '0')}`}
                </span>

                <span
                  className="font-bold px-2 py-0.5 rounded-full border text-[11px]"
                  style={{
                    backgroundColor: `${region.color}18`,
                    color: region.color,
                    borderColor: `${region.color}50`,
                  }}
                >
                  {region.name}
                </span>

                {station.storeCode && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700">
                    {station.storeCode}
                  </span>
                )}

                {station.openingHours && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                      station.openingHours.includes('NONSTOP')
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
                        : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-amber-500" />
                    {station.openingHours}
                  </span>
                )}

                {station.isTerminal && (
                  <span className="text-[11px] font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    Terminál
                  </span>
                )}

                {stationAudit && (
                  <>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700/60" title="Počet výdajných stojanov PHM z terénneho zberu dát">
                      <Fuel className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{stationAudit.fuelDispensers} stojanov PHM</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('audit')}
                      className="text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border bg-red-50 hover:bg-red-100 dark:bg-red-950/80 dark:hover:bg-red-900/80 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/60 transition cursor-pointer"
                      title="Zobraziť terénny audit nosičov pre túto stanicu"
                    >
                      <Table className="w-3 h-3 text-red-500" />
                      <span>Audit: {stationAudit.totalCarriersCount} nosičov</span>
                    </button>
                  </>
                )}

                {/* 2x LCD Obrazovky Quick Launcher (iba pre prevádzky s LCD obrazovkami) */}
                {hasStationLcdScreens(station) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('lcd')}
                    className="text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border bg-slate-900 hover:bg-slate-800 text-white border-red-500/60 transition cursor-pointer shadow-2xs"
                    title="Zobraziť živé vysielanie 2x LCD obrazoviek na tejto stanici"
                  >
                    <Tv className="w-3 h-3 text-red-500" />
                    <span>2× LCD Obrazovky</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </button>
                )}

                {activeIncidents.length > 0 && (
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    {activeIncidents.length} {activeIncidents.length === 1 ? 'porucha' : 'poruchy'}
                  </span>
                )}
              </div>

              {/* Station Name */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{station.name}</span>
                {station.isHeadquarters && (
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 tracking-wider border border-amber-300">
                    CENTRÁLA
                  </span>
                )}
              </h2>

              {/* Location & Quick Contact */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>
                    {station.street ? `${station.street}, ` : ''}
                    {station.zip ? `${station.zip} ` : ''}
                    {station.city || station.name} ({station.okres || region.shortName})
                  </span>
                </span>

                {station.phone && (
                  <a
                    href={`tel:${station.phone}`}
                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{station.phone}</span>
                  </a>
                )}
              </div>

              {/* Quick Google Maps & Street View Direct Actions */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {station.googleMapsUrl && (
                  <a
                    href={station.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-100 dark:hover:bg-sky-900/80 text-sky-800 dark:text-sky-300 font-bold text-xs border border-sky-300 dark:border-sky-700/60 transition shadow-2xs"
                    title="Otvoriť overené Google Mapy prevádzky"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Google Mapy</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                )}

                {station.googleStreetViewUrl && (
                  <a
                    href={station.googleStreetViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-700/60 transition shadow-2xs"
                    title="Otvoriť Google Street View 360° panorámu prevádzky"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Street View 360°</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                )}

                {station.isGoogleVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Overený link z dokumentácie
                  </span>
                )}
              </div>

              {/* Vedúci prevádzky header badge (len pre bežné prevádzky) */}
              {!station.isHeadquarters && (station.manager || station.managerPhone) && (
                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-gray-300 font-medium pt-0.5 flex-wrap">
                  <span className="text-slate-400 dark:text-gray-500 flex items-center gap-1 text-[11px]">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    Vedúci prevádzky:
                  </span>
                  <strong className="text-slate-900 dark:text-white font-bold text-xs">
                    {station.manager}
                  </strong>
                  {station.managerPhone && (
                    <a
                      href={`tel:${station.managerPhone.replace(/\s+/g, '')}`}
                      className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono hover:underline font-semibold"
                    >
                      ({station.managerPhone})
                    </a>
                  )}
                </div>
              )}

              {/* Farebné označenie a individuálna veľkosť pointu v detaile */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-slate-100/90 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700/60 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1.5 shrink-0">
                      <Palette className="w-3.5 h-3.5 text-red-500" />
                      <span>Farba pointu:</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {TAG_COLORS.map((tc) => (
                        <button
                          key={tc.color}
                          type="button"
                          onClick={() => {
                            if (station) {
                              setStationColorTag(station.id, tc.color, currentTag?.label, currentTag?.size);
                              setCurrentTag(getColorTag(station.id));
                            }
                          }}
                          className={`w-5 h-5 rounded-full transition transform hover:scale-125 cursor-pointer ${
                            currentTag?.color === tc.color
                              ? 'ring-2 ring-slate-900 dark:ring-white scale-115 shadow-sm'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: tc.color }}
                          title={tc.name}
                        />
                      ))}
                    </div>
                  </div>

                  {currentTag && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={currentTag.label || ''}
                        onChange={(e) => {
                          if (station) {
                            setStationColorTag(station.id, currentTag.color || '#E11D23', e.target.value, currentTag.size);
                            setCurrentTag(getColorTag(station.id));
                          }
                        }}
                        placeholder="Poznámka..."
                        className="w-24 text-[11px] px-2 py-0.5 rounded bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 text-slate-800 dark:text-gray-200 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (station) {
                            removeStationColorTag(station.id);
                            setCurrentTag(undefined);
                          }
                        }}
                        className="text-[10px] text-red-600 hover:text-red-700 hover:underline font-bold px-1 py-0.5 cursor-pointer"
                        title="Odstrániť vlastnú farbu a veľkosť pointu"
                      >
                        ✕ Resetovať
                      </button>
                    </div>
                  )}
                </div>

                {/* Individuálna veľkosť pointu v pixeloch */}
                <div className="pt-1.5 border-t border-slate-200/80 dark:border-gray-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-gray-300">
                      Veľkosť tohto pointu:
                    </span>
                    <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      {currentTag?.size || 34} px {currentTag?.size ? '(vlastná)' : '(predvolená)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={22}
                      max={64}
                      step={2}
                      value={currentTag?.size || 34}
                      onChange={(e) => {
                        if (station) {
                          setStationPointSize(station.id, parseInt(e.target.value, 10));
                          setCurrentTag(getColorTag(station.id));
                        }
                      }}
                      className="w-28 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-lg cursor-pointer accent-red-600"
                    />

                    <div className="flex items-center gap-1">
                      {[28, 34, 44, 52, 62].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (station) {
                              setStationPointSize(station.id, sz);
                              setCurrentTag(getColorTag(station.id));
                            }
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            (currentTag?.size || 34) === sz
                              ? 'bg-red-600 text-white shadow-2xs'
                              : 'bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-200 hover:bg-slate-200 border border-slate-200 dark:border-gray-600'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    {currentTag?.size && (
                      <button
                        type="button"
                        onClick={() => {
                          if (station) {
                            resetStationPointSize(station.id);
                            setCurrentTag(getColorTag(station.id));
                          }
                        }}
                        className="text-[10px] text-slate-500 hover:text-red-600 underline cursor-pointer ml-1"
                        title="Obnoviť predvolenú veľkosť"
                      >
                        Reset px
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              id="close-station-detail-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition border border-slate-200 dark:border-gray-700 cursor-pointer shrink-0"
              title="Zavrieť detail stanice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#0c0f16] px-4 shrink-0">
          <div className="flex">
            <button
              id="tab-photos-btn"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'photos'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#10141d]'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-500" />
              <span>Fotobanka 12 zón</span>
              <span className="px-2 py-0.5 text-xs font-mono font-black rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                12
              </span>
            </button>

            {hasStationLcdScreens(station) && (
              <button
                id="tab-lcd-btn"
                onClick={() => setActiveTab('lcd')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer ${
                  activeTab === 'lcd'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-[#10141d]'
                    : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4 text-red-500" />
                <span>2× LCD Obrazovky</span>
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-black rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>2× LIVE</span>
                </span>
              </button>
            )}

            <button
              id="tab-ads-btn"
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'ads'
                  ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-[#10141d]'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{adSpaces.length > 0 ? 'Katalóg 12 zón' : 'Reklamné plochy'}</span>
              <span className="px-2 py-0.5 text-xs font-mono font-black rounded-full bg-slate-200 dark:bg-gray-800 text-slate-800 dark:text-gray-200">
                {adSpaces.length}
              </span>
            </button>

            <button
              id="tab-audit-btn"
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'audit'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-white dark:bg-[#10141d]'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-4 h-4 text-amber-500" />
              <span>Zber dát nosičov</span>
              {stationAudit ? (
                <span className="px-2 py-0.5 text-xs font-mono font-black rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                  {stationAudit.totalCarriersCount}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-slate-100 dark:bg-gray-800 text-slate-500">
                  Audit
                </span>
              )}
            </button>

            <button
              id="tab-info-btn"
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-bold text-xs sm:text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'info'
                  ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-[#10141d]'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-sky-500" />
              <span>O stanici</span>
            </button>

            <button
              id="tab-incidents-btn"
              onClick={() => setActiveTab('incidents')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 font-black text-xs sm:text-sm border-b-2 transition cursor-pointer ${
                activeTab === 'incidents'
                  ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-[#10141d]'
                  : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>Servis & Poruchy</span>
              {activeIncidents.length > 0 ? (
                <span className="px-1.5 py-0.2 text-xs font-mono font-black rounded-full bg-red-600 text-white animate-pulse">
                  {activeIncidents.length}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 text-[11px] font-mono rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  0
                </span>
              )}
            </button>
          </div>

          {/* Quick Print Offer Action */}
          {activeTab === 'ads' && adSpaces.length > 0 && (
            <button
              onClick={handlePrintOffer}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-gray-800 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              title="Vytlačiť ponukový list nosičov tejto stanice"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Tlačiť ponuku</span>
            </button>
          )}
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white dark:bg-[#10141d]">
          {activeTab === 'ads' && (
            adSpaces.length === 0 ? (
              <div className="py-12 px-6 rounded-2xl bg-slate-50 dark:bg-[#151c28] border border-slate-200 dark:border-gray-800 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {station.isHeadquarters ? 'Centrála DALITRANS – Bez reklamných plôch' : 'Žiadne evidované reklamné plochy'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                    Táto lokalita (Veľké Bierovce 266) slúži ako administratívne riaditeľstvo spoločnosti DALITRANS / DALIOIL.
                    Pre tento point nie sú evidované žiadne komerčné reklamné plochy, billboardy, CLV nosiče ani komerčné LCD obrazovky na prenájom.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Zobraziť profil centrály</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('photos')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                    <span>Archív fotografií</span>
                  </button>
                </div>
              </div>
            ) : (
            /* ========================================================
               TAB 1: PREHĽADNÁ REKLAMNÁ PONUKA (OFFER DASHBOARD)
               ======================================================== */
            <div className="space-y-4">
              {/* Executive Offer Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Voľné na prenájom
                  </div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
                    {adSummary.free}
                  </div>
                  <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                    ihneď k dispozícii
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    Končí / Re-booking
                  </div>
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-300 font-mono mt-0.5">
                    {adSummary.expiring + adSummary.reserved}
                  </div>
                  <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-medium">
                    do 14 dní
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#141a26] border border-slate-200 dark:border-gray-800 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">
                    Obsadené
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                    {adSummary.occupied}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                    zazmluvnené plochy
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl shadow-xs">
                  <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400">
                    Obsadenosť kapacity
                  </div>
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-300 font-mono mt-0.5">
                    {adSummary.occupancyPercent}%
                  </div>
                  <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-medium">
                    {adSummary.occupied} z {adSummary.total} plôch
                  </div>
                </div>
              </div>

              {/* Verified Cashier Footfall Banner based on Receipt Audit */}
              {station.monthlyVisitsCashier && (
                <div className="p-3 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent dark:from-red-950/40 dark:via-amber-950/20 dark:to-transparent rounded-xl border border-red-200 dark:border-red-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                        <span>Reálna denná návštevnosť pokladne:</span>
                        <strong className="text-red-600 dark:text-red-400 font-mono text-sm">
                          {(station.dailyVisitsCashier || Math.round(station.monthlyVisitsCashier / 30)).toLocaleString('sk-SK')} bločkov / deň
                        </strong>
                        <span className="text-[11px] font-normal text-slate-500 dark:text-gray-400">
                          ({station.monthlyVisitsCashier.toLocaleString('sk-SK')} bločkov / mesiac)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">
                        {station.receiptsHistory
                          ? `Audit vydaných dokladov: celkovo ${station.receiptsHistory.total.toLocaleString('sk-SK')} dokladov • Denný priemer: ${(station.dailyVisitsCashier || Math.round(station.monthlyVisitsCashier / 30)).toLocaleString('sk-SK')} bločkov/deň • Najsilnejší mesiac: ${station.receiptsHistory.peakMonth} (~${Math.round((station.receiptsHistory.peakValue || 0) / 30).toLocaleString('sk-SK')}/deň)`
                          : 'Reálne denné pokladničné transakcie siete DALIOIL'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-black/40 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                      Koeficient:{' '}
                      <strong className="text-red-600 dark:text-red-400 font-black">
                        {station.monthlyVisitsCashier >= 17500
                          ? '1.35x (Flagship)'
                          : station.monthlyVisitsCashier >= 14000
                          ? '1.20x (Vysoká)'
                          : station.monthlyVisitsCashier >= 12000
                          ? '1.10x (Nadpriemer)'
                          : station.monthlyVisitsCashier >= 9000
                          ? '1.00x (Štandard)'
                          : station.monthlyVisitsCashier >= 5500
                          ? '0.85x (Regionálna)'
                          : '0.70x (Kompaktná)'}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Station Advertising Inventory Market Value Banner */}
              <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-transparent rounded-xl border border-emerald-300 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <span>Trhová hodnota reklamného inventára stanice:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                        {adSummary.totalRevenue.toLocaleString('sk-SK')} € / mesiac
                      </strong>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                        12 marketingových zón
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Voľné nosiče k okamžitému prenájmu: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{adSummary.potentialRevenue.toLocaleString('sk-SK')} €/mes.</strong> ({adSummary.free} plôch) • Aktuálne obsadené: <strong className="text-slate-700 dark:text-gray-300 font-mono">{adSummary.currentRevenue.toLocaleString('sk-SK')} €/mes.</strong> ({adSummary.occupied + adSummary.expiring} plôch)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-gray-700">
                    Priemer: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">~{Math.round(adSummary.totalRevenue / (adSpaces.length || 1))} €</strong> / nosič / mes.
                  </span>
                </div>
              </div>

              {/* Offer Filters & View Mode Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-100 dark:bg-[#151b27] rounded-xl border border-slate-200 dark:border-gray-800">
                {/* Status Segment Tabs */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: `Všetky (${adSpaces.length})` },
                    { id: 'free', label: `🟢 Voľné (${adSummary.free})` },
                    { id: 'expiring', label: `🟡 Končiace (${adSummary.expiring})` },
                    { id: 'occupied', label: `🔴 Obsadené (${adSummary.occupied})` },
                    {
                      id: 'incidents',
                      label: `⚠️ Poruchy (${activeIncidents.length})`,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setAdFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        adFilter === tab.id
                          ? 'bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-gray-700'
                          : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* View toggle & Report damage button */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <div className="flex items-center bg-slate-200 dark:bg-gray-800 p-0.5 rounded-lg border border-slate-300 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-1 rounded text-xs font-semibold ${
                        viewMode === 'cards'
                          ? 'bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-gray-400'
                      }`}
                      title="Zobraziť ako katalógové karty"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1 rounded text-xs font-semibold ${
                        viewMode === 'table'
                          ? 'bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-gray-400'
                      }`}
                      title="Zobraziť ako kompaktnú tabuľku"
                    >
                      <Table className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenReportIncident?.(station)}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Nahlásiť poškodenie alebo závadu na tejto stanici"
                  >
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="hidden sm:inline">Nahlásiť závadu</span>
                  </button>
                </div>
              </div>

              {/* Ads Content (Cards or Table) */}
              {filteredAds.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-gray-900/40 rounded-2xl border border-slate-200 dark:border-gray-800 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700 dark:text-gray-300 text-sm">
                    Žiadne reklamné nosiče nezodpovedajú zvolenému filtru.
                  </p>
                  <button
                    onClick={() => setAdFilter('all')}
                    className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline"
                  >
                    Zobraziť všetky nosiče ({adSpaces.length})
                  </button>
                </div>
              ) : viewMode === 'table' ? (
                /* -------------------------------------------
                   COMPACT TABLE VIEW (MARKETING PREHĽAD)
                   ------------------------------------------- */
                <div className="rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-[#151b27] text-slate-600 dark:text-gray-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-gray-800">
                      <tr>
                        <th className="p-2.5">Kód & Foto</th>
                        <th className="p-2.5">Nosič & Typ formátu</th>
                        <th className="p-2.5">Rozmer</th>
                        <th className="p-2.5">Trhová cena</th>
                        <th className="p-2.5">Denná sadzba</th>
                        <th className="p-2.5">Stav plochy</th>
                        <th className="p-2.5 text-right">Mediaplán</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80 bg-white dark:bg-[#10141d]">
                      {filteredAds.map((ad) => {
                        const isInPlan = campaignPlanItemIds?.has(ad.id);

                        return (
                          <tr key={ad.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition">
                            <td className="p-2.5">
                              <button
                                type="button"
                                onClick={() => setActiveTab('photos')}
                                className="group relative flex items-center justify-center w-9 h-9 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition shrink-0 cursor-pointer shadow-xs"
                                title="Prejsť do fotobanky 12 zón stanice"
                              >
                                <Camera className="w-4 h-4" />
                              </button>
                              <div className="font-mono text-[9px] text-slate-400 mt-1">{ad.id}</div>
                            </td>
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900 dark:text-white">{ad.name}</div>
                              <div className="mt-0.5">
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300">
                                  {ad.type}
                                </span>
                              </div>
                            </td>
                            <td className="p-2.5 font-mono text-slate-700 dark:text-gray-300 font-semibold">{ad.dimensions}</td>
                            <td className="p-2.5">
                              <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                                {ad.monthlyPriceEur} € <span className="text-[10px] font-normal text-slate-400">/ mes.</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">CPT {(ad.cpmPriceEur || 1.45).toFixed(2)} €</span>
                            </td>
                            <td className="p-2.5 font-mono text-slate-700 dark:text-gray-300">
                              {(ad.dailyPriceEur || Math.round((ad.monthlyPriceEur / 30) * 100) / 100).toFixed(2)} € / deň
                            </td>
                            <td className="p-2.5">
                              {getStatusBadge(ad.status, ad.daysLeft)}
                            </td>
                            <td className="p-2.5 text-right">
                              {onToggleCampaignPlanItem && (
                                <button
                                  onClick={() => onToggleCampaignPlanItem(ad, station)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    isInPlan
                                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                                  }`}
                                >
                                  {isInPlan ? '✓ V pláne' : '+ Pridať do výberu'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* -------------------------------------------
                   STRUCTURED CATALOG CARDS VIEW (AIRY CARDS)
                   ------------------------------------------- */
                <div className="space-y-3.5">
                  {filteredAds.map((ad) => {
                    const isInPlan = campaignPlanItemIds?.has(ad.id);
                    const adIncidents = incidentsByAdSpace.get(ad.id) || [];

                    return (
                      <div
                        key={ad.id}
                        id={`ad-card-${ad.id}`}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-xs hover:shadow-md transition space-y-3.5"
                      >
                        {/* Card Header */}
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200/80 dark:border-gray-800/80 pb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-black/40 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 flex items-center gap-1">
                                {ad.id}
                                <button
                                  onClick={() => handleCopyId(ad.id)}
                                  className="hover:text-red-500 cursor-pointer ml-1"
                                  title="Kopírovať kód nosiča"
                                >
                                  {copiedAdId === ad.id ? (
                                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-2.5 h-2.5" />
                                  )}
                                </button>
                              </span>

                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-gray-800 text-slate-800 dark:text-gray-200">
                                {ad.type}
                              </span>
                            </div>

                            <h4 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                              {ad.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                  {ad.monthlyPriceEur} €
                                </span>
                                <span className="text-xs font-bold text-slate-500">/ mes.</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {(ad.dailyPriceEur || Math.round((ad.monthlyPriceEur / 30) * 100) / 100).toFixed(2)} €/deň • CPT {(ad.cpmPriceEur || 1.45).toFixed(2)} €
                              </div>
                            </div>
                            {getStatusBadge(ad.status, ad.daysLeft)}
                          </div>
                        </div>

                        {/* Transparent Market Valuation breakdown strip */}
                        <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-slate-700 dark:text-gray-300 flex items-start gap-2">
                          <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className="font-bold text-slate-900 dark:text-white">
                                Férová trhová cena: <span className="text-emerald-600 dark:text-emerald-400 font-black">{ad.monthlyPriceEur} € / mesiac</span> ({((ad.dailyPriceEur || Math.round((ad.monthlyPriceEur / 30) * 100) / 100)).toFixed(2)} € / deň)
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold">
                                Konkurencieschopná cena
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                              {ad.valuationBreakdown || `Odporúčaná trhová sadzba pre formát ${ad.type} na ťahu ${station.roadType || 'Tranzit'}.`}
                            </p>
                          </div>
                        </div>

                        {/* Technical Parameters Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 bg-white dark:bg-[#18202d] rounded-xl border border-slate-200 dark:border-gray-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Nameraný rozmer</span>
                            <strong className="font-mono text-slate-800 dark:text-gray-200">{ad.dimensions}</strong>
                          </div>

                          <div className="p-2.5 bg-white dark:bg-[#18202d] rounded-xl border border-slate-200 dark:border-gray-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Osvetlenie</span>
                            <span className="font-semibold text-slate-800 dark:text-gray-200 truncate block">
                              {ad.illumination}
                            </span>
                          </div>

                          <div className="p-2.5 bg-white dark:bg-[#18202d] rounded-xl border border-slate-200 dark:border-gray-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Umiestnenie / Popis</span>
                            <span className="font-semibold text-slate-800 dark:text-gray-200 truncate block" title={ad.side}>
                              {ad.side}
                            </span>
                          </div>

                          <div className="p-2.5 bg-white dark:bg-[#18202d] rounded-xl border border-slate-200 dark:border-gray-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Technická kontrola</span>
                            <span className="font-semibold text-slate-800 dark:text-gray-200 truncate block" title={ad.inspector}>
                              {ad.technicalCondition || 'V poriadku'} ({ad.lastInspectionDate || 'Audit 2026'})
                            </span>
                          </div>
                        </div>

                        {/* Station 12-Zone Photo Bank Link */}
                        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/25 rounded-xl border border-emerald-200/70 dark:border-emerald-800/40 flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Camera className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>Fotobanka stanice (12 zón)</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                                  Archív 2026
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                                Oficiálna fotodokumentácia prevádzky {station.name} roztriedená do 12 zón
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                            <button
                              type="button"
                              onClick={() => setActiveTab('photos')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                              title="Prejsť do fotobanky 12 zón tejto stanice"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                              <span>Otvoriť fotobanku (12 zón)</span>
                            </button>

                            {stationZoneFolders.length > 0 && stationZoneFolders[0]?.folderUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewZoneNumber(ad.zoneNumber || stationZoneFolders[0].zoneNumber);
                                  setActiveTab('photos');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-gray-800 hover:bg-slate-50 text-slate-700 dark:text-gray-200 rounded-lg text-xs font-bold border border-slate-200 dark:border-gray-700 transition cursor-pointer"
                                title="Zobraziť fotografie zóny v aplikácii"
                              >
                                <Camera className="w-3 h-3 text-emerald-500" />
                                <span>Fotky zóny {ad.zoneNumber || 2}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Active Incident Warning Strip */}
                        {adIncidents.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                <span>Nahlásená porucha na tomto nosiči:</span>
                              </span>
                              <button
                                onClick={() => setActiveTab('incidents')}
                                className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
                              >
                                Otvoriť servisný záznam →
                              </button>
                            </div>
                            {adIncidents.map((inc) => (
                              <div key={inc.id} className="text-slate-700 dark:text-gray-300 text-[11px]">
                                • <strong>{inc.title}</strong> ({STATUS_CONFIG[inc.status].label})
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Card Actions Bar */}
                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOpenReportIncident?.(station, ad)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                              title="Nahlásiť poškodenie alebo nefunkčné osvetlenie na tomto nosiči"
                            >
                              <Wrench className="w-3.5 h-3.5 text-amber-500" />
                              <span>Nahlásiť poruchu</span>
                            </button>
                          </div>

                          {/* Primary CTA: Add to Campaign Media Plan */}
                          <div className="flex items-center gap-2">
                            {ad.status === 'free' && (
                              <button
                                onClick={() => setInquiryAd(ad)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Rýchly dopyt
                              </button>
                            )}

                            {onToggleCampaignPlanItem && (
                              <button
                                onClick={() => onToggleCampaignPlanItem(ad, station)}
                                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                                  isInPlan
                                    ? 'bg-sky-600 hover:bg-sky-500 text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                              >
                                {isInPlan ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>V mediapláne</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Pridať do mediaplánu</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            )
          )}

          {activeTab === 'incidents' && (
            /* ========================================================
               TAB 2: SERVIS & HLÁSENIE PORÚCH PRE TÚTO STANICU
               ======================================================== */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      Servisná kniha stanice {station.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      Evidencia opráv a technických zásahov na nosičoch tejto lokality
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReportIncident?.(station)}
                  className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nahlásiť závadu</span>
                </button>
              </div>

              {incidents.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-gray-800 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Žiadne nahlásené incidenty
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
                    Všetky reklamné plochy na stanici {station.name} sú v 100% prevádzkovom stave bez nahlásených porúch.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((incident) => {
                    const sev = SEVERITY_CONFIG[incident.severity];
                    const stat = STATUS_CONFIG[incident.status];

                    return (
                      <div
                        key={incident.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-gray-800 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap text-xs">
                              <span className="font-mono font-bold text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-black/30 px-1.5 py-0.5 rounded border border-slate-200 dark:border-gray-700">
                                {incident.id}
                              </span>
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {incident.adSpaceId}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${stat.badgeBg}`}>
                                {stat.icon} {stat.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sev.bg} ${sev.text} ${sev.border}`}>
                                {sev.label}
                              </span>
                            </div>

                            <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                              {incident.title}
                            </h4>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Odhad nákladov</span>
                            <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                              {incident.estimatedCostEur || 0} €
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-gray-300">
                          {incident.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-gray-800">
                          <span>
                            Nahlásil: <strong>{incident.reportedBy}</strong> ({incident.reportedAt})
                          </span>

                          <div className="flex items-center gap-1.5">
                            {incident.status !== 'resolved' ? (
                              <button
                                onClick={() => {
                                  updateIncidentStatus(incident.id, 'resolved');
                                  loadStationIncidents();
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                              >
                                Označiť ako opravené
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Opravené
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            /* ========================================================
               TAB 3: TECHNICKÉ PARAMETRE STANICE & KONTAKTY
               ======================================================== */
            <div className="space-y-4">
              {/* Pre Centrálu: Iba základné informácie, bez kontaktov, vedúceho a area manažéra */}
              {station.isHeadquarters ? (
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#131924] dark:to-[#171f2d] rounded-2xl border border-slate-200 dark:border-gray-800 space-y-3">
                  <div className="text-xs uppercase font-bold text-slate-500 dark:text-gray-400 flex items-center justify-between">
                    <span>Základné informácie o prevádzke:</span>
                    <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300">
                      {station.name}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {station.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      Areál Veľké Bierovce 266 (budova 604)
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-gray-800 space-y-1.5 text-xs text-slate-700 dark:text-gray-300">
                    <div>📍 <strong>Adresa:</strong> {station.street}, {station.zip || ''} {station.city || 'Veľké Bierovce'} (budova 604)</div>
                    <div>🕒 <strong>Prevádzková doba:</strong> {station.openingHours || '07:00 - 16:00'}</div>
                    {station.category && (
                      <div>🏢 <strong>Hlavná kategória:</strong> {station.category}</div>
                    )}
                    {station.web && (
                      <div>
                        🌐 <strong>Web:</strong>{' '}
                        <a href={station.web} target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 font-bold hover:underline">
                          {station.web}
                        </a>
                      </div>
                    )}
                    {station.services && (
                      <div className="pt-1 text-slate-600 dark:text-gray-400">
                        <strong>Doplnkové služby:</strong> {station.services}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Vedúci prevádzky Card */}
                  <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:to-transparent rounded-2xl border border-amber-300/60 dark:border-amber-500/30 space-y-3">
                    <div className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-amber-500" />
                        Vedúci prevádzky / stanice:
                      </span>
                      <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                        Lokalita {station.city || station.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{station.manager || 'Nezadaný'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                          Zodpovedná osoba za prevádzku, personál a koordináciu na ČS {station.name}
                        </p>
                        {station.services && (
                          <div className="mt-2 text-xs text-amber-800 dark:text-amber-300 font-medium">
                            <span className="font-bold">Doplnkové služby: </span>{station.services}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {station.managerPhone && (
                          <a
                            href={`tel:${station.managerPhone.replace(/\s+/g, '')}`}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs font-mono"
                            title="Volať vedúcemu stanice"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Vedúci: {station.managerPhone}</span>
                          </a>
                        )}
                        {station.phone && (
                          <a
                            href={`tel:${station.phone}`}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-300 dark:border-gray-700 font-mono"
                            title="Volať na pokladňu ČS"
                          >
                            <Phone className="w-3.5 h-3.5 text-amber-500" />
                            <span>Pokladňa: {station.phone}</span>
                          </a>
                        )}
                        {station.email && (
                          <a
                            href={`mailto:${station.email}`}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-300 dark:border-gray-700"
                            title="Email na stanicu"
                          >
                            <Mail className="w-3.5 h-3.5 text-sky-500" />
                            <span>{station.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Regional Area Manager Card */}
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-red-50/20 dark:from-[#131924] dark:to-[#171f2d] rounded-2xl border border-slate-200 dark:border-gray-800 space-y-3">
                    <div className="text-xs uppercase font-bold text-slate-500 dark:text-gray-400 flex items-center justify-between">
                      <span>Zodpovedný Area manažér:</span>
                      <span
                        className="px-2 py-0.5 rounded-full font-bold text-[11px]"
                        style={{
                          backgroundColor: `${region.color}20`,
                          color: region.color,
                        }}
                      >
                        Región {region.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {region.rep.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                          {region.rep.title || `Area manažér pre región ${region.shortName}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${region.rep.phoneRaw}`}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{region.rep.phone}</span>
                        </a>

                        <a
                          href={`mailto:${region.rep.email}`}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>E-mail</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Sekcia: Reálna návštevnosť a výdaj bločkov pokladne */}
              {station.monthlyVisitsCashier && (
                <div className="p-4 bg-gradient-to-br from-slate-50 via-red-50/15 to-transparent dark:from-[#131924] dark:to-[#171f2d] rounded-2xl border border-slate-200 dark:border-gray-800 space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-600/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                          Reálna návštevnosť pokladne (Audit bločkov 2026)
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">
                          Reálne pokladničné transakcie a výdaj dokladov na ČS {station.name}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
                      {station.monthlyVisitsCashier >= 17500
                        ? '🔥 Top Flagship ČS (1.35x)'
                        : station.monthlyVisitsCashier >= 14000
                        ? '⭐ Vysoká návštevnosť (1.20x)'
                        : station.monthlyVisitsCashier >= 12000
                        ? '📈 Nadpriemerná (1.10x)'
                        : station.monthlyVisitsCashier >= 9000
                        ? 'Štandardná (1.00x)'
                        : station.monthlyVisitsCashier >= 5500
                        ? 'Regionálna lokalita (0.85x)'
                        : 'Kompaktná lokalita (0.70x)'}
                    </span>
                  </div>

                  {/* 3 mini KPI tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-white dark:bg-black/25 rounded-xl border border-slate-200 dark:border-gray-800">
                      <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold uppercase">Priemer denne</div>
                      <div className="text-lg font-black font-mono text-red-600 dark:text-red-400 mt-0.5">
                        {(station.dailyVisitsCashier || Math.round(station.monthlyVisitsCashier / 30)).toLocaleString('sk-SK')}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        bločkov / deň ({station.monthlyVisitsCashier.toLocaleString('sk-SK')} / mesiac)
                      </div>
                    </div>

                    <div className="p-2.5 bg-white dark:bg-black/25 rounded-xl border border-slate-200 dark:border-gray-800">
                      <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold uppercase">Celkovo (Jan–Okt)</div>
                      <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
                        {station.receiptsHistory ? station.receiptsHistory.total.toLocaleString('sk-SK') : '–'}
                      </div>
                      <div className="text-[10px] text-slate-500">dokladov spolu</div>
                    </div>

                    <div className="p-2.5 bg-white dark:bg-black/25 rounded-xl border border-slate-200 dark:border-gray-800">
                      <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold uppercase">Najsilnejší mesiac</div>
                      <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                        {station.receiptsHistory?.peakMonth || '–'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {station.receiptsHistory?.peakValue
                          ? `~${Math.round(station.receiptsHistory.peakValue / 30).toLocaleString('sk-SK')} / deň (${station.receiptsHistory.peakValue.toLocaleString('sk-SK')} / m)`
                          : '–'}
                      </div>
                    </div>
                  </div>

                  {/* Monthly bar chart if monthly array exists */}
                  {station.receiptsHistory && station.receiptsHistory.monthly && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 flex justify-between">
                        <span>Mesačný vývoj transakcií (Január – Október):</span>
                        <span className="font-mono text-[9px] text-amber-600 dark:text-amber-400 font-bold">
                          ★ Vrchol v {station.receiptsHistory.peakMonth} (~{Math.round((station.receiptsHistory.peakValue || 0) / 30).toLocaleString('sk-SK')} bločkov/deň)
                        </span>
                      </div>
                      <div className="grid grid-cols-10 gap-1 items-end h-20 pt-2 bg-white dark:bg-black/25 p-2 rounded-xl border border-slate-200 dark:border-gray-800">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt'].map((monthName, idx) => {
                          const val = station.receiptsHistory!.monthly[idx] || 0;
                          const maxVal = Math.max(...station.receiptsHistory!.monthly, 1);
                          const heightPct = Math.max(Math.round((val / maxVal) * 100), 8);
                          const isPeak = val === station.receiptsHistory!.peakValue;
                          return (
                            <div key={monthName} className="flex flex-col items-center h-full justify-end group relative">
                              {/* Bar */}
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-sm transition-all ${
                                  isPeak
                                    ? 'bg-amber-500 dark:bg-amber-400 shadow-sm'
                                    : val > 0
                                    ? 'bg-red-500/80 dark:bg-red-600/80 group-hover:bg-red-500'
                                    : 'bg-slate-200 dark:bg-gray-800'
                                }`}
                                title={`${monthName}: ${val.toLocaleString('sk-SK')} bločkov (~${Math.round(val / 30).toLocaleString('sk-SK')} / deň)`}
                              />
                              {/* Label */}
                              <span className="text-[8px] font-mono text-slate-400 dark:text-gray-500 mt-1">
                                {monthName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Google Maps & Google Street View Official Integration Card */}
              <div className="p-4 bg-gradient-to-br from-sky-50/70 via-white to-amber-50/60 dark:from-[#121926] dark:via-[#10141d] dark:to-[#1a1820] rounded-2xl border border-sky-200/80 dark:border-sky-900/50 space-y-3 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Google Mapy & Street View 360°</span>
                        {station.isGoogleVerified ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Overené
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400">
                            GPS
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        Kód: <strong className="font-mono text-slate-700 dark:text-gray-200">{station.stationCode || station.storeCode || `DALIOIL_${String(station.id).padStart(3, '0')}`}</strong> • {station.companyName || `DALI OIL - ${station.name}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* Google Maps Item */}
                  <div className="p-3 bg-white dark:bg-[#151c28] rounded-xl border border-slate-200 dark:border-gray-800 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>Google Mapy odkaz</span>
                      </div>
                      <div className="text-xs font-mono text-slate-700 dark:text-gray-300 truncate font-semibold" title={station.googleMapsUrl}>
                        {station.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-gray-800/80">
                      <a
                        href={station.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>Otvoriť Google Mapy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyGoogleLink(station.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`, 'map')}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 transition cursor-pointer"
                        title="Kopírovať odkaz na Google Mapy"
                      >
                        {copiedGoogleLink === 'map' ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Google Street View Item */}
                  <div className="p-3 bg-white dark:bg-[#151c28] rounded-xl border border-slate-200 dark:border-gray-800 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1">
                        <Eye className="w-3 h-3" />
                        <span>Google Street View odkaz</span>
                      </div>
                      <div className="text-xs font-mono text-slate-700 dark:text-gray-300 truncate font-semibold" title={station.googleStreetViewUrl || 'Nie je k dispozícii'}>
                        {station.googleStreetViewUrl || 'Nie je k dispozícii'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-gray-800/80">
                      {station.googleStreetViewUrl ? (
                        <>
                          <a
                            href={station.googleStreetViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 px-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <span>Otvoriť Street View 360°</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyGoogleLink(station.googleStreetViewUrl!, 'street')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 transition cursor-pointer"
                            title="Kopírovať odkaz na Street View"
                          >
                            {copiedGoogleLink === 'street' ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-slate-400 italic py-1">
                          Pohľad Street View nie je zadaný
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Oficiálna intenzita premávky a dotknutá komunikácia (Slovenská správa ciest CSD) */}
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-transparent dark:from-emerald-950/30 dark:via-[#111722] dark:to-[#171f2d] rounded-2xl border border-emerald-300/80 dark:border-emerald-700/60 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Car className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Intenzita dopravy & Dotknutá komunikácia</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                          CSD 2022/2023
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {station.trafficSource || 'Slovenská správa ciest (CSD 2022/2023)'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Odhadovaný prejazd</span>
                    <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {station.trafficRange || (station.trafficIntensityAADT ? `${station.trafficIntensityAADT.toLocaleString('sk-SK')}` : '–')} voz./24h
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 bg-white dark:bg-[#151c28] rounded-xl border border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-red-500" />
                      Dotknutá komunikácia
                    </span>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      {station.affectedRoad || station.roadType || 'Cesta I. triedy'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Kategória: {station.roadType || 'Tranzit'}
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#151c28] rounded-xl border border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Car className="w-3 h-3 text-emerald-500" />
                      Rozsah dopravy (24h)
                    </span>
                    <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                      {station.trafficRange || '–'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Vozidiel za 24 hodín
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#151c28] rounded-xl border border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-sky-500" />
                      AADT priemer pre OOH
                    </span>
                    <div className="text-sm font-black font-mono text-sky-600 dark:text-sky-400 mt-1">
                      ~{station.trafficIntensityAADT ? station.trafficIntensityAADT.toLocaleString('sk-SK') : '–'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                      Denný základ výpočtu OTS / CPT
                    </div>
                  </div>
                </div>
              </div>

              {/* Station Hardware & Operational Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-[#131924] rounded-xl border border-slate-200 dark:border-gray-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Typ cestnej komunikácie</span>
                  <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-red-500" />
                    <span>{station.roadType || 'Hlavný ťah (Cesta I. triedy)'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#131924] rounded-xl border border-slate-200 dark:border-gray-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">GPS Súradnice</span>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{station.lat.toFixed(6)}, {station.lng.toFixed(6)}</span>
                    <a
                      href={station.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline text-[11px] font-sans font-bold flex items-center gap-0.5"
                    >
                      <span>Mapa</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#131924] rounded-xl border border-slate-200 dark:border-gray-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Otváracie hodiny ČS</span>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{station.openingHours || 'NONSTOP (24/7)'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#131924] rounded-xl border border-slate-200 dark:border-gray-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Dostupné služby na stanici</span>
                  <div className="text-xs text-slate-700 dark:text-gray-300 font-medium">
                    Palivá DALI OIL, Kaviareň, Shop, Kompresor, WC
                  </div>
                </div>
              </div>

              {/* Station Internal Note */}
              {station.note && (
                <div className="p-3 bg-slate-100 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-gray-800 text-xs text-slate-600 dark:text-gray-400">
                  <span className="font-bold text-slate-800 dark:text-gray-200">Poznámka k lokalite: </span>
                  {station.note}
                </div>
              )}

              {/* 2x LCD Screens Quick Banner (iba pre prevádzky s LCD obrazovkami) */}
              {hasStationLcdScreens(station) && (
                <div className="p-4 bg-gradient-to-r from-red-600/15 via-amber-500/10 to-slate-900/30 rounded-2xl border border-red-500/30 dark:border-red-500/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-md shadow-red-900/30 shrink-0">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          2× LCD Obrazovky (DOOH Živé vysielanie)
                        </h4>
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
                          <span>2× LIVE</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        LCD 1 (Pokladničná zóna, 149s) + LCD 2 (DALI Cafe, 150s) • Formát 1080p FHD
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('lcd')}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-red-500/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                  >
                    <Tv className="w-3.5 h-3.5 text-red-500" />
                    <span>Sledovať vysielanie</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Photo repository quick banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-transparent dark:from-emerald-950/40 dark:via-sky-950/30 rounded-2xl border border-emerald-500/20 dark:border-emerald-800/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">Fotobanka a archív 12 zón ČS</h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Všetky originálne zábery a Google Drive priečinky zberu fotiek
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('photos')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Prezrieť zóny</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tab: Zber dát nosičov & Terénny audit (PDF 2026) */}
          {activeTab === 'audit' && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-transparent dark:from-amber-950/40 dark:via-red-950/30 border border-amber-500/20 dark:border-amber-800/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-3 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 text-white shadow-md shadow-amber-900/20">
                      <Table className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-lg text-slate-900 dark:text-white">
                          Zber dát: Množstvo nosičov a formáty na ČS {station.name}
                        </h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
                          {station.stationCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                        Dáta z oficiálneho terénneho zberu nosičov, rozmerov a počtu stojanov PHM (prehlad_reklamnych_ploch_DALIOIL 2026)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenCarrierAudit && (
                      <button
                        type="button"
                        onClick={onOpenCarrierAudit}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition cursor-pointer"
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>Celosieťová matica (44 staníc)</span>
                      </button>
                    )}

                    <a
                      href={AUDIT_PDF_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Originál PDF</span>
                    </a>
                  </div>
                </div>

                {stationAudit ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    <div className="p-3 bg-white/80 dark:bg-[#151c28]/80 rounded-xl border border-amber-200/80 dark:border-amber-900/60 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block">Stojany PHM</span>
                      <strong className="text-xl font-black font-mono text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                        <Fuel className="w-4 h-4 text-amber-600" />
                        {stationAudit.fuelDispensers}
                      </strong>
                    </div>

                    <div className="p-3 bg-white/80 dark:bg-[#151c28]/80 rounded-xl border border-red-200/80 dark:border-red-900/60 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 block">Spolu nosičov v audite</span>
                      <strong className="text-xl font-black font-mono text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                        <Layers className="w-4 h-4 text-red-500" />
                        {stationAudit.totalCarriersCount} ks
                      </strong>
                    </div>

                    <div className="p-3 bg-white/80 dark:bg-[#151c28]/80 rounded-xl border border-slate-200 dark:border-gray-800 shadow-2xs col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Kľúčové formáty a nosiče</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stationAudit.primaryCarrierTypes.length > 0 ? (
                          stationAudit.primaryCarrierTypes.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700"
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">V audite bez zadaných nosičov</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                    Pre túto prevádzku ({station.name}) nebol v primárnom 44-stanicovom zbere dát evidovaný samostatný riadok (napr. veľkoobchodný terminál alebo nová lokalita).
                  </div>
                )}
              </div>

              {/* 12-Zone Detailed Audit Cards */}
              {stationAudit && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm uppercase tracking-wider text-slate-700 dark:text-gray-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span>Rozpis reklamných nosičov podľa 12 zón</span>
                    </h4>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                      Kliknutím na zónu okamžite zobrazíte fotografie zóny priamo v aplikácii
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ZONE_DEFINITIONS.map((zDef) => {
                      const zoneKey = `zone${zDef.zoneNumber}` as keyof typeof stationAudit.zones;
                      const zItem = stationAudit.zones[zoneKey];
                      const folderUrl = getDriveFolderForAdZone(station.stationCode, zDef.zoneNumber);
                      const hasData = zItem && zItem.hasData && zItem.count > 0;

                      return (
                        <div
                          key={zDef.zoneNumber}
                          className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 ${
                            hasData
                              ? 'bg-white dark:bg-[#151c28] border-slate-200 dark:border-gray-800 shadow-xs'
                              : 'bg-slate-50/60 dark:bg-[#10141d]/60 border-slate-200/60 dark:border-gray-800/50 opacity-75'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-gray-200 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-gray-700">
                                  {zDef.zoneNumber}
                                </span>
                                <div>
                                  <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                    {zDef.name}
                                  </h5>
                                  <span className="text-[11px] text-slate-500 dark:text-gray-400">
                                    {zDef.categoryLabel}
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-mono font-black border ${
                                  hasData
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                                    : 'bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500 border-slate-200 dark:border-gray-700'
                                }`}
                              >
                                {zItem?.count || 0} ks
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-gray-900/80 border border-slate-200/80 dark:border-gray-800 space-y-1">
                              <div className="text-[10px] uppercase font-bold text-slate-400">
                                Evidencia zberu dát:
                              </div>
                              <div className="font-semibold text-xs text-slate-800 dark:text-gray-100">
                                {zItem?.rawText && zItem.rawText !== '–' ? zItem.rawText : '– Bez evidovaných nosičov'}
                              </div>
                              {zItem?.formats && (
                                <div className="text-[11px] text-slate-500 dark:text-gray-400">
                                  Formáty: <strong className="font-mono text-slate-700 dark:text-gray-300">{zItem.formats}</strong>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-800/80 text-xs">
                            <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {zDef.typicalDimensions}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewZoneNumber(zDef.zoneNumber);
                                  setActiveTab('photos');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                                title={`Otvoriť In-App fotobanku pre Zónu ${zDef.zoneNumber}`}
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Fotky Z{zDef.zoneNumber}</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                              </button>

                              {onOpenZonePhotoBank && (
                                <button
                                  type="button"
                                  onClick={() => onOpenZonePhotoBank(station.stationCode, zDef.zoneNumber)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg transition cursor-pointer"
                                  title="Zväčšiť fotobanku do celého okna"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Fotobanka zón (Google Drive úložisko 12 zón) */}
          {activeTab === 'photos' && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-950/40 dark:via-teal-950/30 border border-emerald-500/20 dark:border-emerald-800/40 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <Camera className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Fotobanka a archív 12 zón</span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                          {station.stationCode}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-300">
                        Oficiálne cloudové úložisko originálnych fotografií roztriedených podľa 12 štandardných zón stanice.
                      </p>
                    </div>
                  </div>

                  {stationZoneFolders.some(f => f.folderUrl) && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        12 aktívnych priečinkov zón
                      </span>
                    </div>
                  )}
                </div>

                {/* Specific DALIOIL_010 Centrála callout */}
                {station.isHeadquarters && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Administratívna centrála (Veľké Bierovce 270)</strong>
                      <span>
                        Lokalita DALIOIL_010 slúži ako hlavné riaditeľstvo a sídlo spoločnosti bez vlastných výdajných stojanov pohonných hmôt. Fotodokumentácia výdajnej plochy a stojanov je zaradená pod susednou ČS <strong>DALIOIL_030 Veľké Bierovce</strong>.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Filters and search controls */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Hľadať zónu (napr. stojany, shop, kaviareň, terasa, WC, umyváreň)..."
                      value={photoSearchQuery}
                      onChange={(e) => setPhotoSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    {photoSearchQuery && (
                      <button
                        onClick={() => setPhotoSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setPhotoZoneFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                        photoZoneFilter === 'all'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:border-slate-300'
                      }`}
                    >
                      Všetky (12)
                    </button>
                    <button
                      onClick={() => setPhotoZoneFilter('exterior')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                        photoZoneFilter === 'exterior'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:border-slate-300'
                      }`}
                    >
                      Exteriér & Stojany
                    </button>
                    <button
                      onClick={() => setPhotoZoneFilter('interior')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                        photoZoneFilter === 'interior'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:border-slate-300'
                      }`}
                    >
                      Shop & Dali Cafe
                    </button>
                    <button
                      onClick={() => setPhotoZoneFilter('services')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                        photoZoneFilter === 'services'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:border-slate-300'
                      }`}
                    >
                      Služby & Ostatné
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive In-App Native Photo Viewer with Arrow Navigation */}
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-slate-900 text-white overflow-hidden shadow-xl">
                <NativeZonePhotoViewer
                  stationCode={station.stationCode}
                  initialZoneNumber={previewZoneNumber}
                  showZoneSelector={true}
                  showStationSelector={false}
                  className="min-h-[480px] border-0 rounded-none shadow-none"
                />
              </div>

              {/* 12 Zone Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredZoneFolders.map((zone, idx) => {
                  const ZoneIcon = getZoneIcon(zone.zoneNumber);
                  const isCopied = copiedZoneFolderUrl === zone.folderUrl;

                  // Find ad spaces belonging to this zone
                  const matchingAds = adSpaces.filter((ad) => ad.zoneNumber === zone.zoneNumber);

                  const zoneDef = getZoneDefinition(zone.zoneNumber);
                  const zonePhotos = getPhotosForZone(zone.stationCode, zone.zoneNumber);
                  const photoCount = zonePhotos.length;

                  return (
                    <div
                      key={`zone-card-${zone.stationCode}-${zone.zoneNumber}-${idx}`}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#141a26] border border-slate-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-2.5">
                        {/* Zone Header with gradient icon badge and info */}
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${zoneDef?.gradient || 'from-emerald-600 to-teal-600'} text-white shadow-md shadow-black/10 shrink-0`}>
                            <ZoneIcon className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300">
                                  Zóna {zone.zoneNumber}
                                </span>
                                {photoCount > 0 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                                    <Camera className="w-3 h-3" />
                                    {photoCount} {photoCount === 1 ? 'fotka' : photoCount < 5 ? 'fotky' : 'fotiek'}
                                  </span>
                                )}
                                {matchingAds.length > 0 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                                    {matchingAds.length} {matchingAds.length === 1 ? 'nosič' : 'nosiče'}
                                  </span>
                                )}
                              </div>

                              {zone.folderUrl ? (
                                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Dostupné
                                </span>
                              ) : (
                                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                                  Bez priečinka
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-1" title={zone.zoneName}>
                              {zone.zoneName}
                            </h4>
                          </div>
                        </div>

                        {/* Zone descriptive text */}
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2">
                          {zoneDef?.description || (
                            zone.zoneNumber === 1 ? 'Vjazdové totemy, príjazdové pásy, orientačné a smerové tabule od cesty.' :
                            zone.zoneNumber === 2 ? 'Výdajné stojany, čelné plochy stĺpov, prestrešenie, stojanové reklamné nosiče a pištole.' :
                            zone.zoneNumber === 3 ? 'Vchodové automatické dvere do shopu, vstupné citylighty, uvítacie sklá a výklady.' :
                            'Fotodokumentácia marketingovej zóny.'
                          )}
                        </p>
                      </div>

                      {/* Zone In-App Actions (No external redirects) */}
                      <div className="pt-2 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between gap-2">
                        {zone.folderUrl ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewZoneNumber(zone.zoneNumber);
                                setSelectedZoneFolder(zone);
                              }}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition cursor-pointer flex-1"
                              title="Zobraziť fotografie tejto zóny v aplikácii"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>{photoCount > 0 ? `Náhľad fotiek (${photoCount})` : 'Náhľad fotiek'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setPreviewZoneNumber(zone.zoneNumber)}
                              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 font-bold text-xs border border-slate-200 dark:border-gray-700 transition cursor-pointer shrink-0"
                              title="Prepnúť interaktívny inline prehliadač na túto zónu"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Zobraziť vyššie</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyZoneUrl(zone.folderUrl)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 transition cursor-pointer shrink-0"
                              title={isCopied ? 'Odkaz skopírovaný do schránky' : 'Kopírovať odkaz na zložku'}
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            <a
                              href={zone.folderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition cursor-pointer shrink-0 text-xs font-bold"
                              title="Otvoriť priečinok na Google Disku v novej karte"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline text-[11px]">Disk</span>
                            </a>
                          </>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">
                            Administratívne sídlo (bez zložky zóny)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredZoneFolders.length === 0 && (
                <div className="p-8 text-center bg-slate-50 dark:bg-[#131924] rounded-2xl border border-dashed border-slate-300 dark:border-gray-800 text-slate-500 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-bold text-sm text-slate-700 dark:text-gray-300">
                    Nenašli sa žiadne zóny vyhovujúce filtru &quot;{photoSearchQuery}&quot;
                  </p>
                  <button
                    onClick={() => {
                      setPhotoSearchQuery('');
                      setPhotoZoneFilter('all');
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                  >
                    Resetovať filtre a zobraziť všetkých 12 zón
                  </button>
                </div>
              )}

              {/* Informative footer */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#10141d] border border-slate-200 dark:border-gray-800 text-[11px] text-slate-500 dark:text-gray-400 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Synchronizované z oficiálneho archívu zberu fotiek DALIOIL (572 priečinkov v sieti).
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('ads')}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                >
                  Naspäť na ponukový list plôch &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Tab: 2x LCD Obrazovky (DOOH Live Broadcast) */}
          {activeTab === 'lcd' && (
            <div className="p-1 sm:p-2 space-y-4">
              <LcdScreensViewer station={station} defaultView="dual" />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#10141d] border-t border-slate-200 dark:border-gray-800 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <div>
            Lokalita: <strong className="text-slate-800 dark:text-white">{station.name}</strong> •{' '}
            {adSpaces.length} reklamných nosičov
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 rounded-xl font-bold transition cursor-pointer"
          >
            Zavrieť ponuku
          </button>
        </div>

        {/* Quick Inquiry Modal Overlay */}
        {inquiryAd && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-[#141a26] rounded-2xl border border-slate-200 dark:border-gray-700 p-5 shadow-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white">Rýchly dopyt na plochu</h4>
                  <p className="text-xs text-slate-500">{inquiryAd.id} • {inquiryAd.name}</p>
                </div>
                <button
                  onClick={() => setInquiryAd(null)}
                  className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {inquirySent ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Dopyt úspešne odoslaný!</p>
                  <p className="text-xs text-slate-500">
                    Area manažér {region.rep.name} vás bude kontaktovať s ponukou.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Názov klienta / firmy</label>
                    <input
                      type="text"
                      required
                      placeholder="napr. Martinus / O2"
                      value={inquiryClient}
                      onChange={(e) => setInquiryClient(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Telefón</label>
                      <input
                        type="tel"
                        required
                        placeholder="+421 9..."
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Počet mesiacov</label>
                      <select
                        value={inquiryMonths}
                        onChange={(e) => setInquiryMonths(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden"
                      >
                        <option value="1">1 mesiac</option>
                        <option value="3">3 mesiace</option>
                        <option value="6">6 mesiacov</option>
                        <option value="12">12 mesiacov</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryAd(null)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 rounded-xl text-xs font-bold"
                    >
                      Zrušiť
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md"
                    >
                      Odoslať dopyt
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        {/* In-App Google Drive Zone Photo Viewer Modal */}
        {selectedZoneFolder && (
          <div
            id="zone-photo-viewer-modal"
            className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setSelectedZoneFolder(null)}
          >
            <div
              className="relative w-full max-w-6xl h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Header with Close Button */}
              <div className="px-3 sm:px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-xs px-2.5 py-0.5 bg-emerald-600 text-white rounded-lg shadow-xs">
                    {station.stationCode}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {station.name} ({station.city}) • Fotobanka 12 marketingových zón
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedZoneFolder(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Zatvoriť prehliadač"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Native In-App Photo Viewer with arrows, 12-zone filmstrip, and full-screen Lightbox */}
              <div className="flex-1 overflow-hidden">
                <NativeZonePhotoViewer
                  stationCode={station.stationCode}
                  initialZoneNumber={selectedZoneFolder.zoneNumber}
                  showZoneSelector={true}
                  showStationSelector={false}
                  className="h-full border-0 rounded-none shadow-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
