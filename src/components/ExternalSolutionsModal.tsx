import React, { useState, useMemo } from 'react';
import {
  X,
  ExternalLink,
  ClipboardCheck,
  Coffee,
  Sparkles,
  Store,
  QrCode,
  LayoutDashboard,
  GraduationCap,
  Monitor,
  Video,
  Copy,
  Check,
  Search,
  Users,
  Clock,
  Layers,
  FileCheck2,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Laptop,
  Database,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Eye,
  Info,
  Calendar,
  Send,
  Zap,
  Box,
} from 'lucide-react';
import {
  EXTERNAL_TOOLS,
  ExternalToolItem,
  TOOL_CATEGORIES,
  TOOL_SUBGROUPS,
  SubGroupMeta,
  ToolModuleItem,
} from '../data/externalTools';

interface ExternalSolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'all' | 'checklists' | 'reclamations' | 'elearning';
}

export const ExternalSolutionsModal: React.FC<ExternalSolutionsModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'checklists' | 'reclamations' | 'elearning'>(
    initialCategory
  );
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<'all' | 'staff' | 'manager' | 'inspector' | 'dispatcher'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Per-card expanded tabs: 'highlights' | 'modules'
  const [cardTab, setCardTab] = useState<Record<string, 'highlights' | 'modules'>>({});
  // Per-card QR code toggle
  const [expandedQr, setExpandedQr] = useState<Record<string, boolean>>({});

  // Reset sub-filter when top category changes
  const handleCategoryChange = (cat: 'all' | 'checklists' | 'reclamations' | 'elearning') => {
    setSelectedCategory(cat);
    setSelectedSubGroup('all');
  };

  const handleCopyLink = (item: ExternalToolItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const toggleCardTab = (toolId: string, tab: 'highlights' | 'modules') => {
    setCardTab((prev) => ({ ...prev, [toolId]: tab }));
  };

  const toggleQr = (toolId: string) => {
    setExpandedQr((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  // Filtered tools
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return EXTERNAL_TOOLS.filter((tool) => {
      // 1. Top category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // 2. SubGroup filter
      if (selectedSubGroup !== 'all' && tool.group !== selectedSubGroup) {
        return false;
      }

      // 3. Role filter
      if (selectedRole !== 'all') {
        if (tool.targetRole !== 'all' && tool.targetRole !== selectedRole) {
          return false;
        }
      }

      // 4. Search query
      if (q) {
        const inTitle = tool.title.toLowerCase().includes(q);
        const inSubtitle = tool.subtitle.toLowerCase().includes(q);
        const inDesc = tool.description.toLowerCase().includes(q);
        const inGroup = tool.group.toLowerCase().includes(q);
        const inHighlights = tool.highlights.some((h) => h.toLowerCase().includes(q));
        const inModules = tool.modules?.some((m) => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
        const inAudience = tool.targetAudience?.toLowerCase().includes(q);

        if (!inTitle && !inSubtitle && !inDesc && !inGroup && !inHighlights && !inModules && !inAudience) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedSubGroup, selectedRole, searchQuery]);

  // Group filtered tools by logical group
  const groupedTools = useMemo(() => {
    const map = new Map<string, ExternalToolItem[]>();
    filteredTools.forEach((tool) => {
      const g = tool.group;
      if (!map.has(g)) {
        map.set(g, []);
      }
      map.get(g)!.push(tool);
    });
    return Array.from(map.entries());
  }, [filteredTools]);

  // Available subgroups for the current category
  const availableSubgroups = useMemo(() => {
    if (selectedCategory === 'all') {
      return Array.from(new Set(EXTERNAL_TOOLS.map((t) => t.group)));
    }
    return Array.from(new Set(EXTERNAL_TOOLS.filter((t) => t.category === selectedCategory).map((t) => t.group)));
  }, [selectedCategory]);

  const getToolIcon = (iconType: ExternalToolItem['iconType'], className = 'w-5 h-5') => {
    switch (iconType) {
      case 'coffee':
        return <Coffee className={className} />;
      case 'clipboard-check':
        return <ClipboardCheck className={className} />;
      case 'store':
        return <Store className={className} />;
      case 'qr-code':
        return <QrCode className={className} />;
      case 'layout-dashboard':
        return <LayoutDashboard className={className} />;
      case 'graduation-cap':
        return <GraduationCap className={className} />;
      case 'video':
        return <Video className={className} />;
      case 'monitor':
        return <Monitor className={className} />;
      case 'box':
        return <Box className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const getSubGroupMeta = (groupName: string): SubGroupMeta | undefined => {
    return TOOL_SUBGROUPS.find((sg) => sg.name.toLowerCase() === groupName.toLowerCase());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#10141f] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-800 flex flex-col max-h-[92vh] overflow-hidden z-10 transition-colors">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-gray-800 bg-gradient-to-r from-slate-50 via-white to-red-50/30 dark:from-[#131826] dark:via-[#111624] dark:to-[#1a1524] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-red-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
              <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Centrum kontrolných riešení & E-learningu
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 uppercase tracking-wider">
                  DALIOIL Sieť
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Cloud Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                Prehľadne roztriedené inšpekcie, Starbucks audity, školiace videá, prezentácie a reklamačný systém
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition"
            aria-label="Zatvoriť"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Filter Tabs Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-gray-800 bg-slate-50/80 dark:bg-[#141824] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          {/* Main 4 Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700/60'
              }`}
            >
              <span>Všetky riešenia</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-200 font-extrabold">
                {EXTERNAL_TOOLS.length}
              </span>
            </button>

            <button
              onClick={() => handleCategoryChange('checklists')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'checklists'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700/60'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Checklisty & Kontroly</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">
                4
              </span>
            </button>

            <button
              onClick={() => handleCategoryChange('elearning')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'elearning'
                  ? 'bg-violet-600 text-white shadow-sm ring-2 ring-violet-500/20'
                  : 'bg-white dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
              <span>E-learning & Školenia</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 font-extrabold">
                4
              </span>
            </button>

            <button
              onClick={() => handleCategoryChange('reclamations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'reclamations'
                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20'
                  : 'bg-white dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700/60'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-rose-500" />
              <span>Reklamácie & QR</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold">
                2
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px] sm:min-w-[280px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hľadať otázku, modul, rolu, kávu..."
              className="w-full bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-gray-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Secondary Subcategory & Role Filter Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111520] flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          {/* Sub-groups pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-red-500" />
              <span>Okruh:</span>
            </span>

            <button
              onClick={() => setSelectedSubGroup('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                selectedSubGroup === 'all'
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
              }`}
            >
              Všetky okruhy
            </button>

            {availableSubgroups.map((group) => {
              const meta = getSubGroupMeta(group);
              const isSelected = selectedSubGroup === group;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedSubGroup(isSelected ? 'all' : group)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-gray-800/80 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {meta && <span>{meta.badge}</span>}
                  {!meta && <span>{group}</span>}
                </button>
              );
            })}
          </div>

          {/* Target Role Selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              <span>Pre koho:</span>
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-200 text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="all">Všetky roly v sieti</option>
              <option value="staff">Obsluha / Personál ČS</option>
              <option value="manager">Vedúci stanice & Projekt</option>
              <option value="inspector">Inšpektori & Audítori</option>
              <option value="dispatcher">Dispečeri & Technici</option>
            </select>
          </div>
        </div>

        {/* Content Body: Grouped Sections with Visual Rich Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Quick Notice Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-snug">
                <strong className="font-bold block text-emerald-950 dark:text-emerald-100">Centrálny Google Sheets zápis</strong>
                Všetky kontroly a audity sa ihneď synchronizujú do spoločných tabuliek pre vedenie Dalioil.
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                <strong className="font-bold block text-amber-950 dark:text-amber-100">Fotodôkaz z mobilu v teréne</strong>
                Možnosť odfotiť nedostatok alebo účtenku priamo z kamery telefónu a odoslať v reálnom čase.
              </div>
            </div>

            <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-3 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div className="text-[11px] text-violet-900 dark:text-violet-200 leading-snug">
                <strong className="font-bold block text-violet-950 dark:text-violet-100">Kompletné školenia v cloude</strong>
                Prezentácie s videami (.pptx) a štandardy servisu dostupné pre personál 24/7 na Google Drive.
              </div>
            </div>
          </div>

          {/* No results notice */}
          {groupedTools.length === 0 && (
            <div className="p-12 text-center bg-slate-50 dark:bg-gray-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-gray-800">
              <ClipboardCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Žiadne nástroje nezodpovedajú filtrom</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Skúste upraviť hľadaný výraz alebo vybrať &quot;Všetky okruhy&quot; a &quot;Všetky roly&quot;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubGroup('all');
                  setSelectedRole('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs"
              >
                Resetovať všetky filtre
              </button>
            </div>
          )}

          {/* Grouped sections */}
          {groupedTools.map(([groupName, tools]) => {
            const meta = getSubGroupMeta(groupName);

            // Determine border & header theme based on group
            const isStarbucks = groupName.toLowerCase().includes('starbucks');
            const isDalioilOps = groupName.toLowerCase().includes('prevádzkové kontroly') || groupName.toLowerCase().includes('dalioil');
            const isElearningOnboard = groupName.toLowerCase().includes('onboarding') || groupName.toLowerCase().includes('zaškolenie');
            const isElearningAI = groupName.toLowerCase().includes('digitálne') || groupName.toLowerCase().includes('ai');
            const isDriveArchive = groupName.toLowerCase().includes('knižnica') || groupName.toLowerCase().includes('archív');
            const isCustomerQr = groupName.toLowerCase().includes('spätná väzba');

            let headerBg = 'bg-slate-100/80 dark:bg-gray-800/60 border-slate-200 dark:border-gray-800';
            let headerText = 'text-slate-900 dark:text-white';
            let iconColor = 'text-slate-600 dark:text-gray-300';

            if (isStarbucks) {
              headerBg = 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30';
              headerText = 'text-emerald-900 dark:text-emerald-300';
              iconColor = 'text-emerald-600 dark:text-emerald-400';
            } else if (isDalioilOps) {
              headerBg = 'bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border-red-500/30';
              headerText = 'text-red-900 dark:text-red-300';
              iconColor = 'text-red-600 dark:text-red-400';
            } else if (isElearningOnboard) {
              headerBg = 'bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border-indigo-500/30';
              headerText = 'text-indigo-900 dark:text-indigo-300';
              iconColor = 'text-indigo-600 dark:text-indigo-400';
            } else if (isElearningAI) {
              headerBg = 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30';
              headerText = 'text-amber-900 dark:text-amber-300';
              iconColor = 'text-amber-600 dark:text-amber-400';
            } else if (isDriveArchive) {
              headerBg = 'bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent border-violet-500/30';
              headerText = 'text-violet-900 dark:text-violet-300';
              iconColor = 'text-violet-600 dark:text-violet-400';
            } else if (isCustomerQr) {
              headerBg = 'bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/30';
              headerText = 'text-rose-900 dark:text-rose-300';
              iconColor = 'text-rose-600 dark:text-rose-400';
            }

            return (
              <div key={groupName} className="space-y-3">
                {/* Section Header */}
                <div
                  className={`p-3 sm:p-3.5 rounded-2xl border ${headerBg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl bg-white dark:bg-gray-800 shadow-2xs ${iconColor}`}>
                      {isStarbucks && <Coffee className="w-5 h-5" />}
                      {isDalioilOps && <Store className="w-5 h-5" />}
                      {isElearningOnboard && <GraduationCap className="w-5 h-5" />}
                      {isElearningAI && <Sparkles className="w-5 h-5" />}
                      {isDriveArchive && <FolderOpen className="w-5 h-5" />}
                      {isCustomerQr && <QrCode className="w-5 h-5" />}
                      {!isStarbucks && !isDalioilOps && !isElearningOnboard && !isElearningAI && !isDriveArchive && !isCustomerQr && (
                        <ClipboardCheck className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm sm:text-base font-extrabold ${headerText}`}>
                          {groupName}
                        </h3>
                        {meta && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/80 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300">
                            {meta.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-gray-400 mt-0.5">
                        {meta?.description || 'Nástroje a moduly pre túto oblasť prevádzky'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 shrink-0 self-end sm:self-auto">
                    {tools.length} {tools.length === 1 ? 'nástroj' : tools.length < 5 ? 'nástroje' : 'nástrojov'}
                  </span>
                </div>

                {/* Cards Grid for this group */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {tools.map((tool) => {
                    const activeCardTab = cardTab[tool.id] || 'highlights';
                    const isQrOpen = !!expandedQr[tool.id];
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(tool.url)}`;

                    return (
                      <div
                        key={tool.id}
                        className="bg-slate-50/90 dark:bg-[#141926] border border-slate-200 dark:border-gray-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 dark:hover:border-gray-700 transition duration-200 group relative overflow-hidden"
                      >
                        {/* Top decorative accent bar */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1.5 ${
                            tool.category === 'checklists'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : tool.category === 'elearning'
                              ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
                              : 'bg-gradient-to-r from-rose-500 to-amber-500'
                          }`}
                        />

                        <div>
                          {/* Card Title & Icon Header */}
                          <div className="flex items-start justify-between gap-2 mb-2.5">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                                {getToolIcon(tool.iconType, 'w-5 h-5 text-red-500 dark:text-red-400')}
                              </div>
                              <div>
                                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                                  {tool.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">{tool.subtitle}</p>
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 text-center ${tool.badgeColor}`}
                            >
                              {tool.badgeText}
                            </span>
                          </div>

                          {/* Concise Description */}
                          <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                            {tool.description}
                          </p>

                          {/* Metadata Pills Matrix */}
                          <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-gray-800/80 grid grid-cols-2 gap-2 text-[11px]">
                            {/* Estimated time */}
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/50 p-1.5 rounded-xl border border-slate-200/60 dark:border-gray-800">
                              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">
                                <strong>Čas:</strong> {tool.estimatedTime}
                              </span>
                            </div>

                            {/* Device */}
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/50 p-1.5 rounded-xl border border-slate-200/60 dark:border-gray-800">
                              <Smartphone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate">
                                <strong>Zariadenie:</strong> {tool.device}
                              </span>
                            </div>

                            {/* Target Audience */}
                            <div className="col-span-2 flex items-center gap-1.5 text-slate-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/50 p-1.5 rounded-xl border border-slate-200/60 dark:border-gray-800">
                              <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                              <span className="truncate">
                                <strong>Rola:</strong> {tool.targetRoleLabel}
                              </span>
                            </div>

                            {/* Storage target */}
                            <div className="col-span-2 flex items-center gap-1.5 text-slate-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800/50 p-1.5 rounded-xl border border-slate-200/60 dark:border-gray-800">
                              <Database className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">
                                <strong>Ukladanie:</strong> {tool.outputTarget}
                              </span>
                            </div>
                          </div>

                          {/* Interactive Detail Switcher: Highlights vs Modules */}
                          <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-gray-800/80">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-gray-800 p-0.5 rounded-lg text-[10px] font-bold">
                                <button
                                  onClick={() => toggleCardTab(tool.id, 'highlights')}
                                  className={`px-2 py-0.5 rounded-md transition ${
                                    activeCardTab === 'highlights'
                                      ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-2xs'
                                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                                  }`}
                                >
                                  Kľúčové funkcie ({tool.highlights.length})
                                </button>
                                {tool.modules && tool.modules.length > 0 && (
                                  <button
                                    onClick={() => toggleCardTab(tool.id, 'modules')}
                                    className={`px-2 py-0.5 rounded-md transition flex items-center gap-1 ${
                                      activeCardTab === 'modules'
                                        ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-2xs'
                                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                                    }`}
                                  >
                                    <span>Osnova modulov</span>
                                    <span className="px-1 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-extrabold text-[9px]">
                                      {tool.modules.length}
                                    </span>
                                  </button>
                                )}
                              </div>

                              {/* Toggle QR code button */}
                              <button
                                onClick={() => toggleQr(tool.id)}
                                className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg transition border ${
                                  isQrOpen
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                                    : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title="Zobraziť QR kód pre otvorenie priamo na mobile"
                              >
                                <QrCode className="w-3 h-3 text-red-500" />
                                <span>{isQrOpen ? 'Skryť QR' : 'QR do mobilu'}</span>
                              </button>
                            </div>

                            {/* View 1: Highlights bullet points */}
                            {activeCardTab === 'highlights' && (
                              <ul className="space-y-1.5">
                                {tool.highlights.map((highlight, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-gray-300 leading-snug"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* View 2: Modules breakdown */}
                            {activeCardTab === 'modules' && tool.modules && (
                              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                                {tool.modules.map((mod: ToolModuleItem, mIdx: number) => (
                                  <div
                                    key={mIdx}
                                    className="p-2 rounded-xl bg-white dark:bg-gray-800/80 border border-slate-200/80 dark:border-gray-700/60 flex items-start justify-between gap-2 text-[11px]"
                                  >
                                    <div>
                                      <h6 className="font-bold text-slate-900 dark:text-white leading-tight">
                                        {mod.name}
                                      </h6>
                                      <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                                        {mod.desc}
                                      </p>
                                    </div>
                                    {mod.count && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 shrink-0 whitespace-nowrap">
                                        {mod.count}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* View 3: QR Code expanded panel */}
                            {isQrOpen && (
                              <div className="mt-2.5 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700/80 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-150">
                                <div className="p-1 bg-white rounded-xl shadow-xs border border-gray-200 shrink-0">
                                  <img
                                    src={qrUrl}
                                    alt={`QR kód pre ${tool.title}`}
                                    className="w-24 h-24 object-contain"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="text-center sm:text-left text-[11px]">
                                  <strong className="font-bold text-slate-900 dark:text-white block">
                                    Otvoriť priamo v mobile
                                  </strong>
                                  <p className="text-slate-600 dark:text-gray-400 mt-0.5">
                                    Naskenujte fotoaparátom telefónu. Vhodné priamo pri obhliadke čerpacej stanice.
                                  </p>
                                  <span className="inline-block mt-1 text-[10px] font-mono text-red-600 dark:text-red-400 break-all select-all">
                                    {tool.url}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Bottom: Direct Action CTA */}
                        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-gray-800/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleCopyLink(tool)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-gray-800 transition"
                            title="Skopírovať odkaz na nástroj"
                          >
                            {copiedId === tool.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Skopírované!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Kopírovať odkaz</span>
                              </>
                            )}
                          </button>

                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-md shadow-red-950/20 hover:shadow-lg transition hover:scale-101"
                          >
                            <span>{tool.actionLabel}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Master Google Drive Folder Card (Always visible or in E-learning) */}
          <div className="bg-gradient-to-r from-violet-900/10 via-indigo-900/10 to-slate-900/10 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-slate-950/40 border border-violet-300 dark:border-violet-800/60 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    Kompletný cloudový priečinok vzdelávacích materiálov Dalioil
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-800 uppercase">
                    Google Drive
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 leading-relaxed">
                  Obsahuje všetky prezentácie s vnorenými videami (.pptx), kompletné štandardy servisu a videonávody k AI dashboardom a checklistom.
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap text-[11px] text-violet-700 dark:text-violet-300 font-semibold">
                  <span>📁 Pokladňa (.pptx)</span>
                  <span>•</span>
                  <span>🎥 Štandardy obsluhy</span>
                  <span>•</span>
                  <span>🤖 AI manuály</span>
                  <span>•</span>
                  <span>☕ Starbucks receptúry</span>
                </div>
              </div>
            </div>

            <a
              href="https://drive.google.com/drive/folders/1QL0Y6lRIf7-VN-4LLe9H-dyKZ1-GLR2q?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs shrink-0 shadow-lg shadow-violet-950/30 transition hover:scale-102 self-stretch md:self-auto justify-center"
            >
              <span>Otvoriť Google Drive archív</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#131826] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Certifikované systémy DALIOIL • Určené pre personál, vedúcich staníc, kontrolórov a dispečing.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-200 text-xs font-bold transition"
          >
            Zatvoriť prehľad
          </button>
        </div>
      </div>
    </div>
  );
};
