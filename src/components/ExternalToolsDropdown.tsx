import React, { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  ChevronDown,
  ClipboardCheck,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Coffee,
  Store,
  QrCode,
  LayoutDashboard,
  Video,
  Monitor,
  Copy,
  Check,
  Search,
  Maximize2,
  Info,
  Clock,
  Users,
  Box,
} from 'lucide-react';
import { EXTERNAL_TOOLS, ExternalToolItem } from '../data/externalTools';

interface ExternalToolsDropdownProps {
  onOpenFullModal: () => void;
  defaultCategory?: 'all' | 'checklists' | 'reclamations' | 'elearning';
}

export const ExternalToolsDropdown: React.FC<ExternalToolsDropdownProps> = ({
  onOpenFullModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'checklists' | 'reclamations' | 'elearning'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyLink = (e: React.MouseEvent, item: ExternalToolItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredTools = EXTERNAL_TOOLS.filter((tool) => {
    const matchesTab = activeTab === 'all' || tool.category === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getToolIcon = (iconType: ExternalToolItem['iconType'], className = 'w-4 h-4') => {
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Top Bar Trigger Button */}
      <button
        id="external-solutions-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm border ${
          isOpen
            ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700 ring-2 ring-red-500/20'
            : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700 hover:from-slate-800 hover:to-slate-700 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 shadow-md shadow-black/10'
        }`}
        title="Checklisty, kontrolné audity, reklamácie a e-learningy"
      >
        <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline font-bold">Checklisty & E-learning</span>
        <span className="sm:hidden font-bold">Systémy</span>
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-500 text-white">
          {EXTERNAL_TOOLS.length}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[480px] md:w-[580px] max-h-[85vh] bg-white dark:bg-[#121620] border border-slate-200 dark:border-gray-700/80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-[#161c28] border-b border-slate-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    Kontrolné riešenia & E-learning Dalioil
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    Rýchle externé linky na checklisty, reklamácie a školenia
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullModal();
                }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition"
                title="Zobraziť detailný prehľad všetkých systémov s popisom"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Celý prehľad</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                Všetko ({EXTERNAL_TOOLS.length})
              </button>
              <button
                onClick={() => setActiveTab('checklists')}
                className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1 ${
                  activeTab === 'checklists'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>📋 Checklisty</span>
                <span className="text-[10px] opacity-80">(4)</span>
              </button>
              <button
                onClick={() => setActiveTab('reclamations')}
                className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1 ${
                  activeTab === 'reclamations'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>⚡ Reklamácie</span>
                <span className="text-[10px] opacity-80">(2)</span>
              </button>
              <button
                onClick={() => setActiveTab('elearning')}
                className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1 ${
                  activeTab === 'elearning'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>🎓 E-learning</span>
                <span className="text-[10px] opacity-80">(4)</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative mt-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rýchle vyhľadávanie v systémoch a kurzoch..."
                className="w-full bg-white dark:bg-[#0e121a] border border-slate-200 dark:border-gray-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Tools List - Grouped & Categorized */}
          <div className="overflow-y-auto p-2 sm:p-3 max-h-[52vh] space-y-3">
            {filteredTools.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-gray-500">
                Žiadne výsledky pre zadané vyhľadávanie.
              </div>
            ) : (
              // Group tools by group name
              (() => {
                const groupMap = new Map<string, ExternalToolItem[]>();
                filteredTools.forEach((tool) => {
                  if (!groupMap.has(tool.group)) {
                    groupMap.set(tool.group, []);
                  }
                  groupMap.get(tool.group)!.push(tool);
                });

                return Array.from(groupMap.entries()).map(([groupName, items]) => (
                  <div key={groupName} className="space-y-1.5">
                    {/* Sub-group header in dropdown */}
                    <div className="px-2 py-1 bg-slate-100/80 dark:bg-gray-800/60 rounded-lg flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {groupName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 font-semibold">
                        {items.length} {items.length === 1 ? 'položka' : 'položky'}
                      </span>
                    </div>

                    {/* Items within this subgroup */}
                    <div className="divide-y divide-slate-100 dark:divide-gray-800/50">
                      {items.map((tool) => (
                        <div
                          key={tool.id}
                          className="pt-2 pb-2 first:pt-1 last:pb-1 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform shadow-2xs">
                                {getToolIcon(tool.iconType, 'w-4 h-4 text-red-500')}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                    {tool.title}
                                  </h4>
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${tool.badgeColor}`}
                                  >
                                    {tool.badgeText}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-0.5 line-clamp-2 leading-relaxed">
                                  {tool.description}
                                </p>

                                {/* Extra metadata chips */}
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px] text-slate-500 dark:text-gray-400">
                                  {tool.frequencyOrFormat && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-500" />
                                      {tool.frequencyOrFormat}
                                    </span>
                                  )}
                                  {tool.targetAudience && (
                                    <span className="flex items-center gap-1 truncate max-w-[280px]">
                                      <Users className="w-3 h-3 text-purple-400 shrink-0" />
                                      <span className="truncate">{tool.targetAudience}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0 pt-0.5">
                              <button
                                onClick={(e) => handleCopyLink(e, tool)}
                                title="Skopírovať odkaz"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 hover:bg-slate-200 dark:hover:bg-gray-700 transition"
                              >
                                {copiedId === tool.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition hover:shadow-md"
                                title={`Otvoriť ${tool.title} v novom okne`}
                              >
                                <span>Otvoriť</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()
            )}
          </div>

          {/* Footer with Google Drive shortcut & info */}
          <div className="p-3 bg-slate-50 dark:bg-[#161c28] border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-[11px]">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              <span>Dáta sa ukladajú automaticky do spoločných hárkov</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenFullModal();
              }}
              className="text-red-600 dark:text-red-400 hover:underline font-bold text-[11px]"
            >
              Podrobné popisy riešení &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
