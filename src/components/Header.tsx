import React from 'react';
import {
  Fuel,
  Factory,
  ShieldCheck,
  Eye,
  EyeOff,
  Clock,
  Menu,
  BarChart3,
  FileSpreadsheet,
  Briefcase,
  TrendingUp,
  Sun,
  Moon,
  Wrench,
  AlertTriangle,
  ClipboardCheck,
  ExternalLink,
  Camera,
  Table,
  Database,
  Palette,
  Box,
  Tv,
  Tag,
  Printer,
} from 'lucide-react';
import { AdStatusFilter } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ExternalToolsDropdown } from './ExternalToolsDropdown';

interface HeaderProps {
  stationCount: number;
  terminalCount: number;
  totalCount: number;
  totalAdSpaces: number;
  freeAdSpaces: number;
  expiringAdSpaces: number;
  selectedAdFilter: AdStatusFilter;
  onSelectAdFilter: (filter: AdStatusFilter) => void;
  isolateSlovakia: boolean;
  onToggleIsolation: () => void;
  onToggleSidebar: () => void;
  onOpenDashboard: () => void;
  onOpenExport: () => void;
  onOpenCampaignPlanner: () => void;
  campaignItemsCount: number;
  onOpenIncidents: () => void;
  activeIncidentsCount?: number;
  onOpenExternalSolutions: (category?: 'all' | 'checklists' | 'reclamations' | 'elearning') => void;
  onOpenZonePhotoBank: () => void;
  onOpenCarrierAudit: () => void;
  onOpenLcdScreens?: () => void;
  onOpenMarketPricing?: () => void;
  onOpenBranchExport?: () => void;
  onOpenColorCustomizer?: () => void;
  onOpenThreeDMapping?: () => void;
  onOpenPrintView?: () => void;
  taggedStationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  stationCount,
  terminalCount,
  totalCount,
  totalAdSpaces,
  freeAdSpaces,
  expiringAdSpaces,
  selectedAdFilter,
  onSelectAdFilter,
  isolateSlovakia,
  onToggleIsolation,
  onToggleSidebar,
  onOpenDashboard,
  onOpenExport,
  onOpenCampaignPlanner,
  campaignItemsCount,
  onOpenIncidents,
  activeIncidentsCount = 0,
  onOpenExternalSolutions,
  onOpenZonePhotoBank,
  onOpenCarrierAudit,
  onOpenLcdScreens,
  onOpenMarketPricing,
  onOpenBranchExport,
  onOpenColorCustomizer,
  onOpenThreeDMapping,
  onOpenPrintView,
  taggedStationsCount = 0,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      id="app-header"
      className="h-16 bg-white dark:bg-[#111622] border-b border-slate-200 dark:border-gray-800 px-3 md:px-5 flex items-center justify-between z-30 shrink-0 shadow-sm dark:shadow-lg gap-2 transition-colors"
    >
      {/* Brand & Title */}
      <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700/80 p-1 flex items-center justify-center shadow-md shadow-red-900/10 shrink-0 overflow-hidden">
          <img
            src="/logo dali2.jpg"
            alt="DALI OIL"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo-dali.png';
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-slate-900 dark:text-white">
              DALI<span className="text-red-500">OIL</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60 rounded-full uppercase tracking-wider">
              Marketing & OOH
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-gray-400 hidden sm:block">
            Senior OOH sieť: <strong className="text-slate-700 dark:text-gray-200">{totalCount} prevádzok</strong> ({stationCount} CS + {terminalCount} terminálov) • Fotobanka 12 zón Google Drive (576 zložiek)
          </p>
        </div>
      </div>

      {/* Center/Right Action Bar: Marketing Tools & Stats */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* External Solutions, Checklists, Complaints & E-learning Dropdown */}
        <ExternalToolsDropdown onOpenFullModal={() => onOpenExternalSolutions('all')} />

        {/* Quick Category Launchers on Extra Wide Displays */}
        <div className="hidden 2xl:flex items-center gap-1 border-r border-slate-200 dark:border-gray-800 pr-1.5">
          <button
            onClick={() => onOpenExternalSolutions('checklists')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition"
            title="Starbucks audity a Dalioil checklisty"
          >
            <span>📋 Checklisty</span>
          </button>
          <button
            onClick={() => onOpenExternalSolutions('reclamations')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-rose-700 dark:text-gray-300 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition"
            title="Reklamácie z QR kódov a centrálny dispečing"
          >
            <span>⚡ Reklamácie</span>
          </button>
          <button
            onClick={() => onOpenExternalSolutions('elearning')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-violet-700 dark:text-gray-300 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition"
            title="Google Drive priečinok, pokladne, štandardy a videonávody"
          >
            <span>🎓 E-learning</span>
          </button>
        </div>

        {/* Zone Photo Bank Button */}
        <button
          id="open-zone-photobank-btn"
          onClick={onOpenZonePhotoBank}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/20 dark:shadow-emerald-950/40 transition cursor-pointer"
          title="Otvoriť Fotobanku 12 marketingových zón siete DALIOIL"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Fotobanka zón</span>
          <span className="md:hidden">Fotobanka</span>
          <span className="hidden xl:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-emerald-100">
            12
          </span>
        </button>

        {/* 2x LCD Screens (DOOH Live) Button */}
        {onOpenLcdScreens && (
          <button
            id="open-lcd-screens-header-btn"
            onClick={() => onOpenLcdScreens()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-red-500/60 shadow-md shadow-red-950/20 transition cursor-pointer"
            title="Otvoriť živý monitoring 2x LCD obrazoviek na prevádzkach DALIOIL (DOOH)"
          >
            <Tv className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">2× LCD Obrazovky</span>
            <span className="sm:hidden">2× LCD</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE</span>
            </span>
          </button>
        )}

        {/* Carrier Data Audit Button (PDF Zber dát 2026) */}
        <button
          id="open-carrier-audit-btn"
          onClick={onOpenCarrierAudit}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/20 dark:shadow-amber-950/40 transition cursor-pointer"
          title="Otvoriť terénny zber dát nosičov a stojanov PHM (PDF audit 44 staníc)"
        >
          <Table className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Zber dát nosičov</span>
          <span className="md:hidden">Audit</span>
          <span className="hidden xl:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-amber-100">
            44 CS
          </span>
        </button>

        {/* Market Pricing Button */}
        {onOpenMarketPricing && (
          <button
            id="open-market-pricing-btn"
            onClick={onOpenMarketPricing}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/20 dark:shadow-emerald-950/40 transition cursor-pointer"
            title="Otvoriť trhové ceny reklamných nosičov (35 € – 290 € / mes.)"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Trhové ceny</span>
            <span className="md:hidden">Cenník</span>
            <span className="hidden xl:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-emerald-100">
              Cenník
            </span>
          </button>
        )}

        {/* Marketing Dashboard Button */}
        <button
          id="open-marketing-dashboard-btn"
          onClick={onOpenDashboard}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-950/20 dark:shadow-red-950/40 transition"
          title="Otvoriť Marketingový a Finančný Dashboard siete"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Dashboard & KPI</span>
          <span className="md:hidden">KPI</span>
        </button>

        {/* Mediaplanner Cart Button */}
        <button
          id="open-campaign-planner-btn"
          onClick={onOpenCampaignPlanner}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            campaignItemsCount > 0
              ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-950/30 ring-1 ring-sky-400'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-700 border'
          }`}
          title="Otvoriť Mediaplánovač kampane"
        >
          <Briefcase className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <span className="hidden lg:inline">Mediaplán</span>
          <span className="font-mono font-bold px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-black/40 text-xs">
            {campaignItemsCount}
          </span>
        </button>

        {/* Incidents & Maintenance Button */}
        <button
          id="open-incidents-btn"
          onClick={onOpenIncidents}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition border border-amber-300 dark:border-amber-700/60 bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-200 cursor-pointer shadow-xs"
          title="Prehľad a nahlasovanie poškodených plôch a servisných incidentov"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden md:inline">Servis & Poruchy</span>
          <span className="md:hidden">Servis</span>
          {activeIncidentsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse">
              {activeIncidentsCount}
            </span>
          )}
        </button>

        {/* Farebné označenie pointov Button */}
        {onOpenColorCustomizer && (
          <button
            id="open-color-customizer-header-btn"
            onClick={onOpenColorCustomizer}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-100 border border-slate-300 dark:border-gray-700 shadow-sm transition cursor-pointer"
            title="Farebné označenie pointov siete DALIOIL a správa tagov"
          >
            <Palette className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span className="hidden sm:inline">Farby pointov</span>
            <span className="sm:hidden">Farby</span>
            {taggedStationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white">
                {taggedStationsCount}
              </span>
            )}
          </button>
        )}

        {/* Vytlačiť mapu Button */}
        {onOpenPrintView && (
          <button
            id="open-print-map-header-btn"
            onClick={onOpenPrintView}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-100 border border-slate-300 dark:border-gray-700 shadow-sm transition cursor-pointer"
            title="Vytlačiť mapu siete DALIOIL (A4 tlačový hárok / PDF)"
          >
            <Printer className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span className="hidden sm:inline">Vytlačiť mapu</span>
            <span className="sm:hidden">Tlač</span>
          </button>
        )}

        {/* Excel Export Button */}
        <button
          id="open-branch-excel-export-btn"
          onClick={onOpenBranchExport || onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-md shadow-emerald-950/20 dark:shadow-emerald-950/40 transition cursor-pointer"
          title="Export do Excelu"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export do Excelu</span>
        </button>

        {/* Data Export & Tables Button */}
        <button
          id="open-data-export-btn"
          onClick={onOpenExport}
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-700 border transition"
          title="Otvoriť Google Tabuľky, CSV a integrácie"
        >
          <Database className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <span className="hidden xl:inline">Google & CSV</span>
          <span className="xl:hidden">Dáta</span>
        </button>

        {/* OOH Quick Status Filter Chips */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => onSelectAdFilter(selectedAdFilter === 'free' ? 'all' : 'free')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedAdFilter === 'free'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-gray-800'
            }`}
            title="Filtrovať stanice s voľnou plochou na predaj"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Voľné:</span>
            <strong className="font-mono font-bold">{freeAdSpaces}</strong>
          </button>

          <button
            onClick={() => onSelectAdFilter(selectedAdFilter === 'expiring' ? 'all' : 'expiring')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedAdFilter === 'expiring'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-gray-800'
            }`}
            title="Filtrovať stanice so zmluvou končiacou do 14 dní"
          >
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Končí:</span>
            <strong className="font-mono font-bold">{expiringAdSpaces}</strong>
          </button>
        </div>

        {/* Dark / Light Mode Switcher */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim'}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
          aria-label="Prepnúť tmavý / svetlý režim"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Svetlý</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Tmavý</span>
            </>
          )}
        </button>

        {/* Slovakia isolation toggle */}
        <button
          id="toggle-slovakia-isolation-btn"
          onClick={onToggleIsolation}
          title={
            isolateSlovakia
              ? 'Okolité krajiny sú skryté (kliknutím ich zobrazíte)'
              : 'Kliknutím skryjete okolité krajiny a ponecháte len územie SR'
          }
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm ${
            isolateSlovakia
              ? 'bg-red-50 dark:bg-red-950/70 hover:bg-red-100 dark:hover:bg-red-900/80 border-red-300 dark:border-red-700/80 text-red-700 dark:text-red-200 ring-1 ring-red-400/40'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-300'
          }`}
        >
          {isolateSlovakia ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span className="hidden md:inline">Okolité krajiny:</span>
              <span className="text-red-600 dark:text-red-400 font-bold">Skryté</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-gray-400" />
              <span className="hidden md:inline">Okolité krajiny:</span>
              <span className="text-slate-700 dark:text-gray-300 font-medium">Zobrazené</span>
            </>
          )}
        </button>

        {/* Mobile sidebar toggle button */}
        <button
          id="toggle-sidebar-btn"
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200 focus:outline-none transition shadow-sm"
          aria-label="Otvoriť menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
