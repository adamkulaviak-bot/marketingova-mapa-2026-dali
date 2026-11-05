import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FolderOpen,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Fuel,
  Navigation,
  LogIn,
  Receipt,
  Users,
  Coffee,
  Building,
  SquareParking,
  ArrowRight,
  ArrowLeft,
  Droplets,
  Umbrella,
  Folder,
  X,
  ExternalLink,
  ShieldCheck,
  Images,
} from 'lucide-react';
import { ZONE_DEFINITIONS, ZoneDefinition } from '../data/zoneGalleryData';
import { STATIONS } from '../data/stations';
import {
  getStationZoneFolder,
  getFolderIdFromUrl,
  StationZoneFolder,
} from '../data/stationPhotoFolders';
import { CARRIER_AUDIT_DATA, StationCarrierAudit } from '../data/adCarrierAuditData';
import {
  getPhotosForZone,
  getPhotosByFolderId,
  DrivePhotoFile,
} from '../data/drivePhotosManifest';

interface NativeZonePhotoViewerProps {
  stationCode?: string;
  initialZoneNumber?: number;
  onSelectStation?: (stationId: number) => void;
  showZoneSelector?: boolean;
  showStationSelector?: boolean;
  className?: string;
  onOpenDriveFolder?: (folderUrl: string) => void;
}

export const NativeZonePhotoViewer: React.FC<NativeZonePhotoViewerProps> = ({
  stationCode = 'DALIOIL_001',
  initialZoneNumber = 2,
  onSelectStation,
  showZoneSelector = true,
  showStationSelector = true,
  className = '',
}) => {
  const [selectedStationCode, setSelectedStationCode] = useState<string>(stationCode);
  const [selectedZoneNumber, setSelectedZoneNumber] = useState<number>(initialZoneNumber);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Sync props
  useEffect(() => {
    if (stationCode) {
      setSelectedStationCode(stationCode);
    }
  }, [stationCode]);

  useEffect(() => {
    if (initialZoneNumber) {
      setSelectedZoneNumber(initialZoneNumber);
    }
  }, [initialZoneNumber]);

  // Current station
  const currentStation = useMemo(() => {
    return STATIONS.find((s) => s.stationCode === selectedStationCode) || STATIONS[0];
  }, [selectedStationCode]);

  // Current zone definition
  const currentZone = useMemo<ZoneDefinition>(() => {
    return ZONE_DEFINITIONS.find((z) => z.zoneNumber === selectedZoneNumber) || ZONE_DEFINITIONS[1];
  }, [selectedZoneNumber]);

  // Google Drive folder reference for current station and zone
  const driveFolder = useMemo<StationZoneFolder | undefined>(() => {
    return getStationZoneFolder(selectedStationCode, selectedZoneNumber);
  }, [selectedStationCode, selectedZoneNumber]);

  const folderId = driveFolder?.folderUrl ? getFolderIdFromUrl(driveFolder.folderUrl) : undefined;
  const directDriveUrl = driveFolder?.folderUrl || (folderId ? `https://drive.google.com/drive/folders/${folderId}` : '');

  // Authentic photos from Google Drive for this zone
  const drivePhotos = useMemo<DrivePhotoFile[]>(() => {
    const byZone = getPhotosForZone(selectedStationCode, selectedZoneNumber);
    if (byZone && byZone.length > 0) {
      return byZone;
    }
    if (folderId) {
      const byFolder = getPhotosByFolderId(folderId);
      if (byFolder && byFolder.length > 0) {
        return byFolder;
      }
    }
    return [];
  }, [selectedStationCode, selectedZoneNumber, folderId]);

  // Reset photo index when station or zone changes
  useEffect(() => {
    setSelectedPhotoIndex(0);
    setImageLoaded(false);
    setImageError(false);
  }, [selectedStationCode, selectedZoneNumber]);

  // Safe current photo file
  const currentPhotoFile: DrivePhotoFile | undefined = drivePhotos[selectedPhotoIndex] || drivePhotos[0];
  const currentPhotoId = currentPhotoFile?.id;
  const currentPhotoName = currentPhotoFile?.name || `Zóna ${selectedZoneNumber}`;

  // Direct image source from Google usercontent CDN (pure <img> tag)
  const directImageUrl = currentPhotoId ? `https://lh3.googleusercontent.com/d/${currentPhotoId}` : '';

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentPhotoId]);

  // Station audit data
  const currentAudit = useMemo<StationCarrierAudit | undefined>(() => {
    return CARRIER_AUDIT_DATA.find((a) => a.stationCode === selectedStationCode);
  }, [selectedStationCode]);

  const auditZoneKey = `zone${selectedZoneNumber}` as keyof StationCarrierAudit['zones'];
  const auditZoneData = currentAudit?.zones ? currentAudit.zones[auditZoneKey] : undefined;

  // Fluid Photo Cycling handlers (< and >)
  const handlePrevPhoto = useCallback(() => {
    if (drivePhotos.length <= 1) return;
    setImageLoaded(false);
    setImageError(false);
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : drivePhotos.length - 1));
  }, [drivePhotos.length]);

  const handleNextPhoto = useCallback(() => {
    if (drivePhotos.length <= 1) return;
    setImageLoaded(false);
    setImageError(false);
    setSelectedPhotoIndex((prev) => (prev < drivePhotos.length - 1 ? prev + 1 : 0));
  }, [drivePhotos.length]);

  const handleSelectPhoto = useCallback((idx: number) => {
    if (idx !== selectedPhotoIndex) {
      setImageLoaded(false);
      setImageError(false);
      setSelectedPhotoIndex(idx);
    }
  }, [selectedPhotoIndex]);

  // Zone Navigation handlers
  const handlePrevZone = useCallback(() => {
    setSelectedZoneNumber((prev) => (prev > 1 ? prev - 1 : 12));
  }, []);

  const handleNextZone = useCallback(() => {
    setSelectedZoneNumber((prev) => (prev < 12 ? prev + 1 : 1));
  }, []);

  const handleSelectZone = useCallback((zoneNum: number) => {
    if (zoneNum !== selectedZoneNumber) {
      setSelectedZoneNumber(zoneNum);
    }
  }, [selectedZoneNumber]);

  // Keyboard navigation:
  // - ArrowLeft / ArrowRight cycles photos if zone has > 1 photo, otherwise switches zone
  // - PageUp / PageDown switches zones
  // - Escape closes lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (drivePhotos.length > 1) {
          handlePrevPhoto();
        } else {
          handlePrevZone();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (drivePhotos.length > 1) {
          handleNextPhoto();
        } else {
          handleNextZone();
        }
      } else if (e.key === 'PageUp' || e.key === '[') {
        e.preventDefault();
        handlePrevZone();
      } else if (e.key === 'PageDown' || e.key === ']') {
        e.preventDefault();
        handleNextZone();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        e.preventDefault();
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drivePhotos.length, handlePrevPhoto, handleNextPhoto, handlePrevZone, handleNextZone, isLightboxOpen]);

  // Copy Google Drive link
  const handleCopyLink = () => {
    if (!directDriveUrl) return;
    navigator.clipboard.writeText(directDriveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Helper for zone icons
  const renderZoneIcon = (zoneNum: number, cls = 'w-4 h-4') => {
    switch (zoneNum) {
      case 1:
        return <Navigation className={cls} />;
      case 2:
        return <Fuel className={cls} />;
      case 3:
        return <LogIn className={cls} />;
      case 4:
        return <Receipt className={cls} />;
      case 5:
        return <Users className={cls} />;
      case 6:
        return <Coffee className={cls} />;
      case 7:
        return <Building className={cls} />;
      case 8:
        return <SquareParking className={cls} />;
      case 9:
        return <ArrowRight className={cls} />;
      case 10:
        return <Droplets className={cls} />;
      case 11:
        return <Umbrella className={cls} />;
      case 12:
      default:
        return <Folder className={cls} />;
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}
    >
      {/* ========================================================
          TOP CONTROLS BAR: STATION SELECTOR & ZONE SWITCHER
          ======================================================== */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        {/* Left: Station & Zone Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm shadow-emerald-950/40">
            {renderZoneIcon(currentZone.zoneNumber, 'w-4 h-4')}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-700 text-white">
                Zóna {currentZone.zoneNumber} / 12
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white truncate">
                {currentZone.name}
              </h3>
              {drivePhotos.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
                  <Images className="w-3 h-3" />
                  {drivePhotos.length} {drivePhotos.length === 1 ? 'fotka' : drivePhotos.length < 5 ? 'fotky' : 'fotiek'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span className="font-bold text-slate-200">{currentStation.name}</span>
              <span className="text-slate-500">
                ({currentStation.stationCode} • {currentStation.city})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Station Selector & Controls */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {showStationSelector && (
            <div className="flex items-center gap-1 bg-slate-800/90 rounded-xl px-2 py-1 border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 hidden sm:inline">
                ČS:
              </span>
              <select
                value={selectedStationCode}
                onChange={(e) => {
                  setSelectedStationCode(e.target.value);
                }}
                className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer max-w-[170px] sm:max-w-[220px] truncate"
              >
                {STATIONS.map((st) => (
                  <option key={st.id} value={st.stationCode} className="bg-slate-900 text-white">
                    {st.stationCode} – {st.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* DEDICATED BUTTON: Otvoriť na Google Disku (Otvorí originálny priečinok na novej karte) */}
          {directDriveUrl && (
            <a
              href={directDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition hover:scale-102 cursor-pointer border border-blue-500/50"
              title="Otvoriť originálny priečinok na Google Disku v novej karte prehliadača"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Otvoriť na Google Disku</span>
              <span className="sm:hidden">Disk ↗</span>
            </a>
          )}

          {/* Lightbox / Fullscreen Modal Button (100% In-App) */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5 cursor-pointer font-bold text-xs shadow-xs"
            title="Zväčšiť náhľad do interaktívneho modálneho okna (Lightbox)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Zväčšiť náhľad</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          HORIZONTAL ZONE SWITCHER STRIP (Z1 - Z12)
          ======================================================== */}
      {showZoneSelector && (
        <div className="bg-slate-950/70 px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto scrollbar-thin shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 mr-1 hidden lg:inline">
              12 Zón:
            </span>
            {ZONE_DEFINITIONS.map((z) => {
              const isSelected = z.zoneNumber === selectedZoneNumber;
              const zKey = `zone${z.zoneNumber}` as keyof StationCarrierAudit['zones'];
              const auditZ = currentAudit?.zones ? currentAudit.zones[zKey] : undefined;
              const hasCarriers = auditZ && auditZ.hasData && auditZ.count > 0;
              const zonePhotoList = getPhotosForZone(selectedStationCode, z.zoneNumber);
              const photoCount = zonePhotoList.length;

              return (
                <button
                  key={`viewer-zone-${z.zoneNumber}`}
                  type="button"
                  onClick={() => handleSelectZone(z.zoneNumber)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`${z.name}${photoCount > 0 ? ` (${photoCount} ${photoCount === 1 ? 'fotka' : 'fotiek'})` : ''}`}
                >
                  {renderZoneIcon(z.zoneNumber, 'w-3 h-3')}
                  <span>Z{z.zoneNumber}</span>
                  <span className="hidden xl:inline text-[11px] opacity-85 font-normal">
                    {z.shortName}
                  </span>
                  {photoCount > 0 ? (
                    <span
                      className={`text-[9px] font-mono px-1 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-emerald-400/20 text-emerald-300 font-bold'
                      }`}
                    >
                      {photoCount}
                    </span>
                  ) : hasCarriers ? (
                    <span
                      className={`text-[9px] font-mono px-1 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-400/20 text-amber-300 font-bold'
                      }`}
                    >
                      {auditZ.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Quick Zone Arrows */}
          <div className="flex items-center gap-1 shrink-0 pl-2">
            <button
              type="button"
              onClick={handlePrevZone}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 flex items-center cursor-pointer"
              title="Predchádzajúca zóna"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextZone}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 flex items-center cursor-pointer"
              title="Nasledujúca zóna"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN PHOTO STAGE: 100% IN-APP DIRECT <img> RENDERING
          - Žiadne href odkazy ani window.open na náhľade
          - Čistý JavaScript event listener na kliknutie
          - Výhradne tag <img> s priamym zdrojom https://lh3.googleusercontent.com/d/[ID]
          ======================================================== */}
      <div
        className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-[380px] select-none group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
        title="Kliknite pre otvorenie interaktívneho modálneho okna (Lightbox)"
      >
        {/* Loading Spinner */}
        {!imageLoaded && !imageError && directImageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 z-10 pointer-events-none">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold text-slate-200">
              Načítavam fotografiu {drivePhotos.length > 1 ? `(${selectedPhotoIndex + 1} / ${drivePhotos.length})` : ''} Zóny {selectedZoneNumber}...
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              Google Drive ID: {currentPhotoId}
            </p>
          </div>
        )}

        {/* Real HTML <img> Tag with direct lh3.googleusercontent.com URL */}
        {directImageUrl && !imageError ? (
          <img
            key={`main-img-${selectedStationCode}-${selectedZoneNumber}-${currentPhotoId}`}
            src={directImageUrl}
            alt={`${currentStation.name} – Zóna ${selectedZoneNumber}: ${currentZone.name} (${currentPhotoName})`}
            className="w-full h-full max-h-[520px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-6 text-center space-y-3">
            <FolderOpen className="w-12 h-12 text-slate-600" />
            <p className="text-sm font-bold text-slate-200">
              Fotodokumentácia pre Zónu {selectedZoneNumber} ({currentZone.name})
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Stanica: {currentStation.name} ({currentStation.stationCode})
            </p>
            {directDriveUrl && (
              <p className="text-xs text-slate-500 max-w-sm">
                V archíve Google Drive pre túto zónu sa pripravujú fotografie. Priečinok môžete otvoriť kliknutím na modré tlačidlo vyššie.
              </p>
            )}
            {folderId && (
              <span className="font-mono text-[11px] text-emerald-400 px-2 py-1 rounded bg-emerald-950/50 border border-emerald-800">
                Priečinok: {folderId}
              </span>
            )}
          </div>
        )}

        {/* ========================================================
            SMOOTH FLUID ARROWS (< and >) DIRECTLY OVER VIEWER
            Cycles smoothly through photos when there are multiple photos,
            or through zones when there is only 1 photo.
            ======================================================== */}
        {drivePhotos.length > 1 ? (
          <>
            {/* Left Arrow: Previous Photo in Zone */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl cursor-pointer z-20 group/btn"
              title={`Predchádzajúca fotografia (${selectedPhotoIndex === 0 ? drivePhotos.length : selectedPhotoIndex} / ${drivePhotos.length}) • Šípka doľava ←`}
            >
              <ChevronLeft className="w-6 h-6 transition-transform group-hover/btn:-translate-x-0.5" />
            </button>

            {/* Right Arrow: Next Photo in Zone */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl cursor-pointer z-20 group/btn"
              title={`Nasledujúca fotografia (${selectedPhotoIndex + 2 > drivePhotos.length ? 1 : selectedPhotoIndex + 2} / ${drivePhotos.length}) • Šípka doprava →`}
            >
              <ChevronRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </>
        ) : (
          <>
            {/* Left Arrow: Previous Zone */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevZone();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl cursor-pointer z-20 group/btn"
              title={`Predchádzajúca zóna (Zóna ${selectedZoneNumber > 1 ? selectedZoneNumber - 1 : 12}) • Šípka doľava ←`}
            >
              <ChevronLeft className="w-6 h-6 transition-transform group-hover/btn:-translate-x-0.5" />
            </button>

            {/* Right Arrow: Next Zone */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextZone();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl cursor-pointer z-20 group/btn"
              title={`Nasledujúca zóna (Zóna ${selectedZoneNumber < 12 ? selectedZoneNumber + 1 : 1}) • Šípka doprava →`}
            >
              <ChevronRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </>
        )}

        {/* Hover Center Action: Click to Open Lightbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 px-4 py-2 rounded-2xl bg-black/85 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/30 text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer pointer-events-auto"
          title="Zväčšiť náhľad do interaktívneho modálneho okna (Lightbox)"
        >
          <Maximize2 className="w-4 h-4 text-emerald-400 group-hover:text-white" />
          <span>Zväčšiť náhľad</span>
        </button>

        {/* Floating Top Badge: Authentic Drive Archive ID & Zone Format */}
        <div
          className="absolute top-3 left-3 flex items-center gap-2 z-20 pointer-events-auto flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-emerald-400 shadow-md flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zóna {selectedZoneNumber} / 12</span>
          </span>

          {drivePhotos.length > 1 && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-md text-xs font-bold font-mono">
              Fotka {selectedPhotoIndex + 1} z {drivePhotos.length}
            </span>
          )}

          {currentPhotoId && (
            <span className="px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-slate-300 shadow-md hidden sm:inline truncate max-w-[200px]">
              {currentPhotoName}
            </span>
          )}
        </div>

        {/* Floating Top Right: Click to Expand / Open Lightbox */}
        <div
          className="absolute top-3 right-3 flex items-center gap-2 z-20 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer hover:scale-105"
            title="Zväčšiť náhľad do interaktívneho modálneho okna (Lightbox)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zväčšiť náhľad</span>
          </button>
        </div>

        {/* Floating Bottom Overlay on Image: Photo Caption & Details */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 sm:p-4 text-xs text-white z-10 pointer-events-none">
          <div className="max-w-4xl pointer-events-auto flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black text-sm text-white drop-shadow-md">
                  {currentStation.name} – Zóna {currentZone.zoneNumber}: {currentZone.name}
                </h4>
                {drivePhotos.length > 1 && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-mono text-[11px] font-bold">
                    Foto {selectedPhotoIndex + 1} / {drivePhotos.length} ({currentPhotoName})
                  </span>
                )}
                {auditZoneData && auditZoneData.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[11px] font-bold">
                    {auditZoneData.count} ks nosičov
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-xs line-clamp-1 mt-0.5 drop-shadow-sm font-medium">
                {auditZoneData?.rawText && auditZoneData.rawText !== '–'
                  ? `Zber dát: ${auditZoneData.rawText}`
                  : currentZone.description}
              </p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap text-[11px] text-slate-300">
                <span className="font-bold text-emerald-400">
                  Rozmer: <strong className="text-white font-mono">{auditZoneData?.formats || currentZone.typicalDimensions}</strong>
                </span>
                <span>•</span>
                <span className="font-bold text-sky-400">
                  Osvetlenie: <strong className="text-white">{currentZone.illuminationType}</strong>
                </span>
              </div>
            </div>

            {/* Special Button: Otvoriť na Google Disku (The ONLY place where target="_blank" is used) */}
            {directDriveUrl && (
              <a
                href={directDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0 border border-blue-400/40 pointer-events-auto"
                title="Otvoriť originálny priečinok na Google Disku v novej karte"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Otvoriť na Google Disku</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          ZONE PHOTO MINI-FILMSTRIP (Ak má zóna viac fotografií)
          Čisté JavaScript tlačidlá na kliknutie bez akýchkoľvek href/window.open!
          ======================================================== */}
      {drivePhotos.length > 1 && (
        <div className="bg-slate-950 px-3 py-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-thin shrink-0 select-none">
          <span className="text-[10px] font-black uppercase text-emerald-400 shrink-0 flex items-center gap-1">
            <Images className="w-3.5 h-3.5" />
            <span>{drivePhotos.length} fotiek v zóne:</span>
          </span>
          <div className="flex items-center gap-2">
            {drivePhotos.map((photo, pIdx) => {
              const isCurrent = pIdx === selectedPhotoIndex;
              return (
                <button
                  key={`inline-thumb-${photo.id}-${pIdx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPhoto(pIdx);
                  }}
                  className={`group relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-black ${
                    isCurrent
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                  title={`${photo.name} (Fotografia ${pIdx + 1} z ${drivePhotos.length})`}
                >
                  <img
                    src={`https://lh3.googleusercontent.com/d/${photo.id}`}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-mono font-bold text-center text-white py-0.5 truncate px-0.5">
                    #{pIdx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          THUMBNAIL FILMSTRIP STRIP (12 Zón s čistými JS buttonmi)
          Úplne odstránené href odkazy z náhľadov a miniatúr!
          ======================================================== */}
      <div className="bg-slate-950 px-3 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0 select-none">
        <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 mr-1">
          Zóny:
        </span>
        {ZONE_DEFINITIONS.map((z) => {
          const isActive = z.zoneNumber === selectedZoneNumber;
          const zKey = `zone${z.zoneNumber}` as keyof StationCarrierAudit['zones'];
          const auditZ = currentAudit?.zones ? currentAudit.zones[zKey] : undefined;
          const zonePhotoList = getPhotosForZone(selectedStationCode, z.zoneNumber);
          const photoCount = zonePhotoList.length;

          return (
            <button
              key={`strip-zone-${z.zoneNumber}`}
              type="button"
              onClick={() => handleSelectZone(z.zoneNumber)}
              className={`relative px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer border text-xs font-bold flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
              title={`${z.zoneNumber}. ${z.name}${photoCount > 0 ? ` (${photoCount} ${photoCount === 1 ? 'fotka' : 'fotiek'})` : ''}`}
            >
              {renderZoneIcon(z.zoneNumber, 'w-3 h-3')}
              <span>Z{z.zoneNumber}</span>
              <span className="hidden md:inline font-normal opacity-85 text-[11px] truncate max-w-[90px]">
                {z.shortName}
              </span>
              {photoCount > 0 ? (
                <span className="font-mono text-[9px] px-1 bg-black/40 rounded text-emerald-300">
                  {photoCount}
                </span>
              ) : auditZ && auditZ.count > 0 ? (
                <span className="font-mono text-[9px] px-1 bg-black/40 rounded text-amber-300">
                  {auditZ.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ========================================================
          BOTTOM METADATA & ACTIONS FOOTER
          ======================================================== */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">
            Priamy náhľad fotografie • Kliknite na fotku pre zväčšenie alebo použite šípky <strong>←</strong> a <strong>→</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {/* Copy direct link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1 cursor-pointer"
            title="Kopírovať odkaz na Google Drive priečinok do schránky"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skopírované!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Kopírovať odkaz</span>
              </>
            )}
          </button>

          {/* Dedicated Open on Google Drive Button */}
          {directDriveUrl && (
            <a
              href={directDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Otvoriť originálny súbor/priečinok na Google Disku v novej karte"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Otvoriť na Google Disku</span>
            </a>
          )}

          {/* Optional: Open Station on Map */}
          {onSelectStation && currentStation && (
            <button
              type="button"
              onClick={() => onSelectStation(currentStation.id)}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Mapa stanice</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          INTERNAL HTML MODAL (LIGHTBOX)
          - div prekrytie cez celú obrazovku s z-index: 9999
          - Obrázok sa načíta výhradne pomocou tagu <img> s priamym
            zdrojom https://lh3.googleusercontent.com/d/[ID_SÚBORU]
          - Krížik na zatvorenie
          - Špeciálne tlačidlo 'Otvoriť na Google Disku' (jediné target="_blank")
          ======================================================== */}
      {isLightboxOpen &&
        createPortal(
          <div
            id="internal-photo-lightbox-modal"
            style={{ zIndex: 9999 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col p-2 sm:p-5 select-none animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Modal Top Header Bar */}
            <div
              className="flex items-center justify-between text-white pb-3 shrink-0 flex-wrap gap-2.5 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Station & Zone Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md">
                  {renderZoneIcon(currentZone.zoneNumber, 'w-5 h-5')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                      Zóna {currentZone.zoneNumber} / 12
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white truncate">
                      {currentZone.name}
                    </h3>
                    {drivePhotos.length > 1 && (
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700">
                        Fotografia {selectedPhotoIndex + 1} z {drivePhotos.length}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 truncate mt-0.5">
                    <span className="font-semibold text-slate-200">
                      {currentStation.name}
                    </span>
                    <span className="font-mono text-slate-400">
                      ({currentStation.stationCode} • {currentStation.city})
                    </span>
                    {currentPhotoName && (
                      <span className="font-mono text-slate-400 hidden md:inline">
                        • Súbor: {currentPhotoName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions, Drive Link & Close Button */}
              <div className="flex items-center gap-2.5 ml-auto">
                {/* ŠPECIÁLNE TLAČIDLO: Otvoriť na Google Disku (Jediné miesto s target="_blank") */}
                {directDriveUrl && (
                  <a
                    href={directDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer border border-blue-400/40"
                    title="Otvoriť originálny priečinok na Google Disku v novej karte prehliadača"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Otvoriť na Google Disku</span>
                    <span className="sm:hidden">Disk ↗</span>
                  </a>
                )}

                {/* Krížik na zatvorenie */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-red-600 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                  title="Zatvoriť zväčšený náhľad (Esc)"
                  aria-label="Zatvoriť zväčšený náhľad"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Main Stage: Obrázok načítaný výhradne pomocou tagu <img> */}
            <div
              className="flex-1 relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Direct <img> Tag */}
              {directImageUrl && !imageError ? (
                <img
                  key={`lightbox-img-${selectedStationCode}-${selectedZoneNumber}-${currentPhotoId}`}
                  src={directImageUrl}
                  alt={`${currentStation.name} – Zóna ${selectedZoneNumber}: ${currentZone.name} (${currentPhotoName})`}
                  className="max-h-[76vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-all select-none"
                  loading="eager"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-8 space-y-3">
                  <FolderOpen className="w-16 h-16 text-slate-600" />
                  <p className="font-bold text-base text-slate-200">
                    Pre túto zónu nie je v archíve Google Drive dostupná žiadna fotografia
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Stanica: {currentStation.name} • Zóna {selectedZoneNumber} • {currentZone.name}
                  </p>
                  {directDriveUrl && (
                    <a
                      href={directDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Otvoriť priečinok na Google Disku</span>
                    </a>
                  )}
                </div>
              )}

              {/* Large Left and Right Arrows for fluid cycling between photos (or zones) */}
              {drivePhotos.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevPhoto();
                    }}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/85 hover:bg-emerald-600 text-white border-2 border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer z-30 group/arrow"
                    title={`Predchádzajúca fotografia (${selectedPhotoIndex === 0 ? drivePhotos.length : selectedPhotoIndex} / ${drivePhotos.length}) • Šípka doľava ←`}
                    aria-label="Predchádzajúca fotografia"
                  >
                    <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 transition-transform group-hover/arrow:-translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhoto();
                    }}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/85 hover:bg-emerald-600 text-white border-2 border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer z-30 group/arrow"
                    title={`Nasledujúca fotografia (${selectedPhotoIndex + 2 > drivePhotos.length ? 1 : selectedPhotoIndex + 2} / ${drivePhotos.length}) • Šípka doprava →`}
                    aria-label="Nasledujúca fotografia"
                  >
                    <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 transition-transform group-hover/arrow:translate-x-0.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevZone();
                    }}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/85 hover:bg-emerald-600 text-white border-2 border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer z-30 group/arrow"
                    title={`Predchádzajúca zóna (Zóna ${selectedZoneNumber > 1 ? selectedZoneNumber - 1 : 12}) • Šípka doľava ←`}
                    aria-label="Predchádzajúca zóna"
                  >
                    <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 transition-transform group-hover/arrow:-translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextZone();
                    }}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/85 hover:bg-emerald-600 text-white border-2 border-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl cursor-pointer z-30 group/arrow"
                    title={`Nasledujúca zóna (Zóna ${selectedZoneNumber < 12 ? selectedZoneNumber + 1 : 1}) • Šípka doprava →`}
                    aria-label="Nasledujúca zóna"
                  >
                    <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 transition-transform group-hover/arrow:translate-x-0.5" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Multiple Photos Mini-Filmstrip */}
            {drivePhotos.length > 1 && (
              <div
                className="pt-2 pb-1 flex items-center justify-center gap-2 overflow-x-auto scrollbar-thin shrink-0 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {drivePhotos.map((photo, pIdx) => {
                  const isCurrent = pIdx === selectedPhotoIndex;
                  return (
                    <button
                      key={`lightbox-thumb-${photo.id}-${pIdx}`}
                      type="button"
                      onClick={() => handleSelectPhoto(pIdx)}
                      className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-black ${
                        isCurrent
                          ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-105'
                          : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                      }`}
                      title={`${photo.name} (${pIdx + 1} z ${drivePhotos.length})`}
                    >
                      <img
                        src={`https://lh3.googleusercontent.com/d/${photo.id}`}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] font-mono font-bold text-center text-white py-0.5 truncate px-0.5">
                        #{pIdx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick 12-Zone Filmstrip inside the Lightbox */}
            <div
              className="pt-1.5 pb-1 flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {ZONE_DEFINITIONS.map((z) => {
                const isActive = z.zoneNumber === selectedZoneNumber;
                const zonePhotoList = getPhotosForZone(selectedStationCode, z.zoneNumber);
                const pCount = zonePhotoList.length;

                return (
                  <button
                    key={`lightbox-strip-${z.zoneNumber}`}
                    type="button"
                    onClick={() => handleSelectZone(z.zoneNumber)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/50'
                        : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20 hover:text-white'
                    }`}
                    title={`${z.zoneNumber}. ${z.name}${pCount > 0 ? ` (${pCount} ${pCount === 1 ? 'fotka' : 'fotiek'})` : ''}`}
                  >
                    {renderZoneIcon(z.zoneNumber, 'w-3 h-3')}
                    <span>Z{z.zoneNumber}</span>
                    <span className="hidden lg:inline text-[10px] font-normal opacity-85">
                      {z.shortName}
                    </span>
                    {pCount > 0 && (
                      <span className="font-mono text-[9px] px-1 bg-black/40 rounded text-emerald-300">
                        {pCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Lightbox Caption & Details Footer */}
            <div
              className="pt-1 text-center max-w-4xl mx-auto shrink-0 flex flex-col items-center gap-0.5 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-3 text-xs text-slate-300 flex-wrap">
                <span className="font-mono text-emerald-400 font-bold">
                  Rozmer: {auditZoneData?.formats || currentZone.typicalDimensions}
                </span>
                <span>•</span>
                <span className="text-sky-300">Osvetlenie: {currentZone.illuminationType}</span>
                {auditZoneData && auditZoneData.count > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">
                      Nosiče: {auditZoneData.count} ks
                    </span>
                  </>
                )}
                {currentPhotoId && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Súbor ID: {currentPhotoId}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Tip: Použite šípky <strong>←</strong> a <strong>→</strong> na klávesnici pre posun fotiek, alebo klávesu <strong>Esc</strong> pre zatvorenie okna.
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
