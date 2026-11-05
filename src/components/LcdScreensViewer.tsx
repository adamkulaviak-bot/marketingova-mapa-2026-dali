import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Tv,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Radio,
  Layers,
  Sparkles,
  Info,
  Clock,
  Tag,
  Monitor,
  Flame,
  Coffee,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MapPin,
  Sliders,
  Settings2,
} from 'lucide-react';
import { Station } from '../types';
import {
  getStationLcdScreens,
  LcdScreenInfo,
  LcdSpotItem,
  getCurrentSpotAtTime,
} from '../data/lcdScreensData';

interface LcdScreensViewerProps {
  station: Station;
  defaultView?: 'dual' | 'lcd1' | 'lcd2';
  compact?: boolean;
}

export const LcdScreensViewer: React.FC<LcdScreensViewerProps> = ({
  station,
  defaultView = 'dual',
  compact = false,
}) => {
  const { lcd1, lcd2 } = getStationLcdScreens(station);

  const [activeView, setActiveView] = useState<'dual' | 'lcd1' | 'lcd2'>(defaultView);
  const [isPlaying1, setIsPlaying1] = useState<boolean>(true);
  const [isPlaying2, setIsPlaying2] = useState<boolean>(true);
  const [isMuted1, setIsMuted1] = useState<boolean>(true);
  const [isMuted2, setIsMuted2] = useState<boolean>(true);
  const [currentTime1, setCurrentTime1] = useState<number>(0);
  const [currentTime2, setCurrentTime2] = useState<number>(0);
  const [duration1, setDuration1] = useState<number>(149);
  const [duration2, setDuration2] = useState<number>(150);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedSpotTab1, setSelectedSpotTab1] = useState<string>('all');
  const [selectedSpotTab2, setSelectedSpotTab2] = useState<string>('all');

  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);

  // Synchronized initial play attempt (muted for browser auto-play policy)
  useEffect(() => {
    const playBoth = async () => {
      try {
        if (videoRef1.current) {
          videoRef1.current.muted = true;
          await videoRef1.current.play();
          setIsPlaying1(true);
        }
      } catch (e) {
        setIsPlaying1(false);
      }
      try {
        if (videoRef2.current) {
          videoRef2.current.muted = true;
          await videoRef2.current.play();
          setIsPlaying2(true);
        }
      } catch (e) {
        setIsPlaying2(false);
      }
    };
    playBoth();
  }, [station.id]);

  // Handle Playback rate change
  useEffect(() => {
    if (videoRef1.current) videoRef1.current.playbackRate = playbackSpeed;
    if (videoRef2.current) videoRef2.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const handleTogglePlay1 = () => {
    if (!videoRef1.current) return;
    if (isPlaying1) {
      videoRef1.current.pause();
      setIsPlaying1(false);
    } else {
      videoRef1.current.play();
      setIsPlaying1(true);
    }
  };

  const handleTogglePlay2 = () => {
    if (!videoRef2.current) return;
    if (isPlaying2) {
      videoRef2.current.pause();
      setIsPlaying2(false);
    } else {
      videoRef2.current.play();
      setIsPlaying2(true);
    }
  };

  const handleTogglePlayBoth = () => {
    const shouldPlay = !isPlaying1 || !isPlaying2;
    if (videoRef1.current) {
      if (shouldPlay) {
        videoRef1.current.play();
        setIsPlaying1(true);
      } else {
        videoRef1.current.pause();
        setIsPlaying1(false);
      }
    }
    if (videoRef2.current) {
      if (shouldPlay) {
        videoRef2.current.play();
        setIsPlaying2(true);
      } else {
        videoRef2.current.pause();
        setIsPlaying2(false);
      }
    }
  };

  const handleRestartBoth = () => {
    if (videoRef1.current) {
      videoRef1.current.currentTime = 0;
      videoRef1.current.play();
      setIsPlaying1(true);
    }
    if (videoRef2.current) {
      videoRef2.current.currentTime = 0;
      videoRef2.current.play();
      setIsPlaying2(true);
    }
  };

  const handleSeek1 = (timeSec: number) => {
    if (videoRef1.current) {
      videoRef1.current.currentTime = timeSec;
      setCurrentTime1(timeSec);
    }
  };

  const handleSeek2 = (timeSec: number) => {
    if (videoRef2.current) {
      videoRef2.current.currentTime = timeSec;
      setCurrentTime2(timeSec);
    }
  };

  const handleToggleMute1 = () => {
    if (!videoRef1.current) return;
    const nextMuted = !isMuted1;
    videoRef1.current.muted = nextMuted;
    setIsMuted1(nextMuted);
  };

  const handleToggleMute2 = () => {
    if (!videoRef2.current) return;
    const nextMuted = !isMuted2;
    videoRef2.current.muted = nextMuted;
    setIsMuted2(nextMuted);
  };

  const handleFullscreen = (elem: HTMLVideoElement | null) => {
    if (!elem) return;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSpot1 = getCurrentSpotAtTime(lcd1.spots, currentTime1);
  const currentSpot2 = getCurrentSpotAtTime(lcd2.spots, currentTime2);

  const monthlyVisits = station.monthlyVisitsCashier || 8500;
  const estimatedDailyImpressions = Math.round((monthlyVisits / 30) * 1.4);

  return (
    <div className="space-y-4">
      {/* Top DOOH Network Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-gray-900 to-slate-950 border border-slate-700/80 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
            <Tv className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                2× LCD Obrazovky DOOH – {station.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>2× LIVE VYSIELANIE</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                1920×1080 FHD
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Lokality: <strong className="text-slate-200">LCD 1 (Pokladničná zóna)</strong> a{' '}
              <strong className="text-slate-200">LCD 2 (DALI Cafe kaviareň)</strong> • Denný dosah:{' '}
              <span className="text-amber-400 font-bold font-mono">~{estimatedDailyImpressions.toLocaleString('sk-SK')}</span> videní/deň
            </p>
          </div>
        </div>

        {/* Global Controls & Layout Switcher */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Synchronized Playback Control */}
          <button
            type="button"
            onClick={handleTogglePlayBoth}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              isPlaying1 && isPlaying2
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Ovládať obe obrazovky súčasne"
          >
            {isPlaying1 && isPlaying2 ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pozastaviť obe</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Spustiť obe naraz</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRestartBoth}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Reštartovať obe slučky od začiatku (0:00)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed switcher */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-[11px] font-mono">
            {[1, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Rýchlosť prehrávania ${spd}x`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView('dual')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                activeView === 'dual'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2× Vedľa seba</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('lcd1')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                activeView === 'lcd1'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>LCD 1</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('lcd2')}
              className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                activeView === 'lcd2'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>LCD 2</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Screens Display Grid */}
      <div
        className={`grid gap-4 ${
          activeView === 'dual'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}
      >
        {/* ========================================================
            OBRAZOVKA 1 (LCD 1) – POKLADŇA / PULT
            ======================================================== */}
        {(activeView === 'dual' || activeView === 'lcd1') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Screen Header Bar */}
            <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5"></span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                      LCD 1: Pokladničná zóna
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Zóna 4
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    Slučka 01 • Dĺžka: 2:29 min • {lcd1.spots.length} spotov
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleMute1}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isMuted1
                      ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      : 'bg-emerald-600 text-white border-emerald-500'
                  }`}
                  title={isMuted1 ? 'Zapnúť zvuk pre LCD 1' : 'Stlmiť zvuk'}
                >
                  {isMuted1 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFullscreen(videoRef1.current)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  title="Celá obrazovka pre LCD 1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Video Player Container with Digital Signage Bezel */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden group">
              <video
                ref={videoRef1}
                src={lcd1.videoSrc}
                loop
                playsInline
                muted={isMuted1}
                onTimeUpdate={() => {
                  if (videoRef1.current) {
                    setCurrentTime1(videoRef1.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef1.current) {
                    setDuration1(videoRef1.current.duration || 149);
                  }
                }}
                className="w-full h-full object-contain cursor-pointer"
                onClick={handleTogglePlay1}
              />

              {/* Live On-Air Watermark Overlay */}
              <div className="absolute top-2.5 left-2.5 pointer-events-none flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-white text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>ON-AIR: LCD 1</span>
                <span className="text-slate-400 font-mono">1080p</span>
              </div>

              {/* Active Spot Badge in Corner */}
              {currentSpot1 && (
                <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none bg-gradient-to-r from-black/90 via-black/80 to-transparent backdrop-blur-md p-2 rounded-lg border border-white/15 text-white flex items-center justify-between gap-2 transition-all">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-black text-white shrink-0 bg-red-600">
                      SPRAVUJE SA
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-amber-300 truncate">
                        {currentSpot1.name}
                      </div>
                      <div className="text-[10px] text-slate-300 truncate">
                        {currentSpot1.highlightText}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 shrink-0">
                    {formatTime(currentTime1)} / {formatTime(duration1)}
                  </span>
                </div>
              )}

              {/* Pause overlay button if paused */}
              {!isPlaying1 && (
                <button
                  type="button"
                  onClick={handleTogglePlay1}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition cursor-pointer backdrop-blur-xs"
                >
                  <Play className="w-7 h-7 fill-current ml-0.5" />
                </button>
              )}
            </div>

            {/* Video Player Controls Bar */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                  title={isPlaying1 ? 'Pozastaviť' : 'Spustiť'}
                >
                  {isPlaying1 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>

                {/* Seek Bar */}
                <input
                  type="range"
                  min={0}
                  max={duration1 || 149}
                  step={0.5}
                  value={currentTime1}
                  onChange={(e) => handleSeek1(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                />

                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {formatTime(currentTime1)} / {formatTime(duration1)}
                </span>
              </div>

              {/* Spot Jumper Bar */}
              <div className="pt-1 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3 text-red-500" />
                    <span>Playlist spotov na LCD 1 (kliknutím preskočíte na spot):</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {lcd1.spots.length} položiek
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {lcd1.spots.map((spot, idx) => {
                    const isCurrent =
                      currentTime1 >= spot.startTime && currentTime1 < spot.endTime;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => handleSeek1(spot.startTime)}
                        className={`w-full text-left p-1.5 rounded-lg text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrent
                            ? 'bg-red-600/20 text-white border border-red-500/50 font-bold'
                            : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                              isCurrent
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-[11px] font-semibold truncate flex items-center gap-1.5">
                              <span>{spot.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-slate-950 font-black shrink-0">
                                  TERAZ
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {spot.highlightText}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 shrink-0 font-medium">
                          {formatTime(spot.startTime)} ({spot.duration}s)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            OBRAZOVKA 2 (LCD 2) – DALI CAFE & KAVIAREŇ
            ======================================================== */}
        {(activeView === 'dual' || activeView === 'lcd2') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Screen Header Bar */}
            <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5"></span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                      LCD 2: DALI Cafe & Kaviareň
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Zóna 6
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    Slučka 02 • Dĺžka: 2:30 min • {lcd2.spots.length} spotov
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleMute2}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isMuted2
                      ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      : 'bg-emerald-600 text-white border-emerald-500'
                  }`}
                  title={isMuted2 ? 'Zapnúť zvuk pre LCD 2' : 'Stlmiť zvuk'}
                >
                  {isMuted2 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleFullscreen(videoRef2.current)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  title="Celá obrazovka pre LCD 2"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Video Player Container with Digital Signage Bezel */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden group">
              <video
                ref={videoRef2}
                src={lcd2.videoSrc}
                loop
                playsInline
                muted={isMuted2}
                onTimeUpdate={() => {
                  if (videoRef2.current) {
                    setCurrentTime2(videoRef2.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef2.current) {
                    setDuration2(videoRef2.current.duration || 150);
                  }
                }}
                className="w-full h-full object-contain cursor-pointer"
                onClick={handleTogglePlay2}
              />

              {/* Live On-Air Watermark Overlay */}
              <div className="absolute top-2.5 left-2.5 pointer-events-none flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-white text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>ON-AIR: LCD 2</span>
                <span className="text-slate-400 font-mono">1080p</span>
              </div>

              {/* Active Spot Badge in Corner */}
              {currentSpot2 && (
                <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none bg-gradient-to-r from-black/90 via-black/80 to-transparent backdrop-blur-md p-2 rounded-lg border border-white/15 text-white flex items-center justify-between gap-2 transition-all">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-black text-white shrink-0 bg-emerald-600">
                      SPRAVUJE SA
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-amber-300 truncate">
                        {currentSpot2.name}
                      </div>
                      <div className="text-[10px] text-slate-300 truncate">
                        {currentSpot2.highlightText}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 shrink-0">
                    {formatTime(currentTime2)} / {formatTime(duration2)}
                  </span>
                </div>
              )}

              {/* Pause overlay button if paused */}
              {!isPlaying2 && (
                <button
                  type="button"
                  onClick={handleTogglePlay2}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition cursor-pointer backdrop-blur-xs"
                >
                  <Play className="w-7 h-7 fill-current ml-0.5" />
                </button>
              )}
            </div>

            {/* Video Player Controls Bar */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlay2}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                  title={isPlaying2 ? 'Pozastaviť' : 'Spustiť'}
                >
                  {isPlaying2 ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>

                {/* Seek Bar */}
                <input
                  type="range"
                  min={0}
                  max={duration2 || 150}
                  step={0.5}
                  value={currentTime2}
                  onChange={(e) => handleSeek2(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {formatTime(currentTime2)} / {formatTime(duration2)}
                </span>
              </div>

              {/* Spot Jumper Bar */}
              <div className="pt-1 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-bold flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-emerald-400" />
                    <span>Playlist spotov na LCD 2 (kliknutím preskočíte na spot):</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {lcd2.spots.length} položiek
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {lcd2.spots.map((spot, idx) => {
                    const isCurrent =
                      currentTime2 >= spot.startTime && currentTime2 < spot.endTime;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => handleSeek2(spot.startTime)}
                        className={`w-full text-left p-1.5 rounded-lg text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-600/20 text-white border border-emerald-500/50 font-bold'
                            : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-[11px] font-semibold truncate flex items-center gap-1.5">
                              <span>{spot.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-slate-950 font-black shrink-0">
                                  TERAZ
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {spot.highlightText}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 shrink-0 font-medium">
                          {formatTime(spot.startTime)} ({spot.duration}s)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hardware & Point Technical Specifications */}
      <div className="p-3 sm:p-4 rounded-xl bg-slate-100 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700/80 text-xs">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-600 dark:text-gray-300" />
            <span className="font-extrabold text-slate-900 dark:text-white">
              Technická špecifikácia digitálneho vysielania (DOOH) na prevádzke {station.stationCode || station.name}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400">
            Cloud Media Player CMS • Aktualizácia: Dnes 06:00
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-700 dark:text-gray-300">
          <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500">
              Displeje & Umiestnenie
            </div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              2× 55" Commercial LED
            </div>
            <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              1× Pokladňa (Zóna 4) + 1× DALI Cafe (Zóna 6)
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500">
              Rozlíšenie & Frekvencia
            </div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              1920 × 1080 Full HD (16:9)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              60 FPS plynulý broadcast, jas 500 nits
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500">
              Frekvencia rotácie slučky
            </div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              Cca 380× až 576× denne
            </div>
            <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              Slučka 1: 149 s • Slučka 2: 150 s
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500">
              Auditovaná návštevnosť
            </div>
            <div className="font-bold text-red-600 dark:text-red-400 mt-0.5">
              {station.monthlyVisitsCashier
                ? `${(station.dailyVisitsCashier || Math.round(station.monthlyVisitsCashier / 30)).toLocaleString('sk-SK')} bločkov/deň (${station.monthlyVisitsCashier.toLocaleString('sk-SK')}/mesiac)`
                : 'Štandardná sieťová prevádzka'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
              Garantovaný 100% zrakový kontakt pri pokladni
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
