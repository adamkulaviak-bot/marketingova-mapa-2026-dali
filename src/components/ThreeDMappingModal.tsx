import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Box,
  Copy,
  Check,
  ShieldAlert,
  Wifi,
  Sparkles,
  MapPin,
  Maximize2,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Station } from '../types';

interface ThreeDMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStation?: Station | null;
}

export const THREE_D_MAPPING_URL = 'http://10.7.0.230/pumpy/';

export const ThreeDMappingModal: React.FC<ThreeDMappingModalProps> = ({
  isOpen,
  onClose,
  selectedStation,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(THREE_D_MAPPING_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDirect = () => {
    window.open(THREE_D_MAPPING_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="three-d-mapping-modal"
        className="w-full max-w-xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-slate-900 dark:text-white"
      >
        {/* Header with decorative 3D gradient */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-sky-700 text-white overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg text-white">
                <Box className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                    3D Digital Twin
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/60 text-purple-200 border border-purple-400/40 font-mono">
                    DALIOIL Intranet
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                  3D Mapovanie prevádzok
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
              title="Zavrieť okno"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-purple-100/90 mt-2 max-w-md relative z-10">
            Priestorové trojrozmerné modely a digitálne dvojičky čerpacích staníc a výdajných stojanov siete DALIOIL.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Selected Station banner (if opened with a station) */}
          {selectedStation && (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#181f2c] border border-slate-200 dark:border-gray-700/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold uppercase">
                    Aktuálne zvolená prevádzka
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {selectedStation.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                    {selectedStation.stationCode || selectedStation.storeCode} • {selectedStation.city || selectedStation.okres}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 font-bold text-[10px] border border-purple-200 dark:border-purple-800 shrink-0">
                Lokalita pripravená
              </span>
            </div>
          )}

          {/* URL Box & Action */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950 dark:text-purple-200 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Priama webová adresa 3D portálu
              </span>
              <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 font-semibold">
                HTTP / Intranet
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white dark:bg-[#0c0f17] border border-purple-300 dark:border-purple-700/80 rounded-xl px-3.5 py-2 font-mono text-xs text-purple-900 dark:text-purple-200 select-all font-bold overflow-x-auto shadow-inner">
                {THREE_D_MAPPING_URL}
              </div>
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 border-slate-300 dark:border-gray-600 shadow-xs'
                }`}
                title="Skopírovať odkaz do schránky"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Skopírované!' : 'Kopírovať'}</span>
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <a
            href={THREE_D_MAPPING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:via-indigo-500 hover:to-sky-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Box className="w-4 h-4" />
            <span>Otvoriť 3D Mapovanie prevádzok</span>
            <ExternalLink className="w-4 h-4 opacity-90" />
          </a>

          {/* Network Notice / Info box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <Wifi className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-amber-900 dark:text-amber-200 font-bold block">
                Upozornenie k sieti (Interný IP server 10.7.0.230):
              </strong>
              <p>
                Odkaz smeruje na privátnu sieť DALIOIL. Pre načítanie 3D modelov je potrebné byť pripojený na <strong>firemnú lokálnu sieť LAN / Wi-Fi</strong> na čerpacej stanici, centrále, alebo cez <strong>DALIOIL VPN</strong>.
              </p>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500 shrink-0" />
              <span>3D priestorové modely staníc & terénu</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-800 flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Zameranie výdajných stojanov & totemu</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#151b26] border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Integrácia DALIOIL 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 font-bold transition cursor-pointer"
          >
            Zavrieť
          </button>
        </div>
      </div>
    </div>
  );
};
