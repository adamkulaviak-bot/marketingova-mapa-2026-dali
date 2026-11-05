import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  DollarSign,
  MapPin,
  Calendar,
  MessageSquare,
  Trash2,
  Printer,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AdIncident, IncidentStatus, IncidentSeverity, RegionId } from '../types';
import { REGIONS } from '../data/stations';
import {
  getStoredIncidents,
  updateIncidentStatus,
  addIncidentServiceNote,
  deleteIncident,
  INCIDENT_TYPE_LABELS,
  SEVERITY_CONFIG,
  STATUS_CONFIG,
} from '../data/incidentsData';

interface IncidentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal: () => void;
  onNavigateToStation?: (stationId: number) => void;
}

export const IncidentManagementModal: React.FC<IncidentManagementModalProps> = ({
  isOpen,
  onClose,
  onOpenReportModal,
  onNavigateToStation,
}) => {
  const [incidents, setIncidents] = useState<AdIncident[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | IncidentStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | IncidentSeverity>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | RegionId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState<{ [incidentId: string]: string }>({});
  const [noteAuthor, setNoteAuthor] = useState('');

  // Reload data
  const loadData = () => {
    setIncidents(getStoredIncidents());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Listen to external updates
  useEffect(() => {
    const handleUpdate = () => loadData();
    window.addEventListener('senior_ooh_incidents_changed', handleUpdate);
    return () => window.removeEventListener('senior_ooh_incidents_changed', handleUpdate);
  }, []);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
      if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
      if (regionFilter !== 'all' && inc.regionId !== regionFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = inc.title.toLowerCase().includes(q);
        const matchStation = inc.stationName.toLowerCase().includes(q) || inc.stationCode.toLowerCase().includes(q);
        const matchAd = inc.adSpaceId.toLowerCase().includes(q) || inc.adSpaceName.toLowerCase().includes(q);
        const matchDesc = inc.description.toLowerCase().includes(q);
        const matchReporter = inc.reportedBy.toLowerCase().includes(q);
        if (!matchTitle && !matchStation && !matchAd && !matchDesc && !matchReporter) {
          return false;
        }
      }

      return true;
    });
  }, [incidents, statusFilter, severityFilter, regionFilter, searchQuery]);

  // KPIs
  const stats = useMemo(() => {
    const total = incidents.length;
    const active = incidents.filter((i) => i.status !== 'resolved').length;
    const critical = incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length;
    const inProgress = incidents.filter((i) => i.status === 'in_progress' || i.status === 'waiting_parts').length;
    const resolved = incidents.filter((i) => i.status === 'resolved').length;
    const estimatedCost = incidents
      .filter((i) => i.status !== 'resolved')
      .reduce((acc, curr) => acc + (curr.estimatedCostEur || 0), 0);

    return { total, active, critical, inProgress, resolved, estimatedCost };
  }, [incidents]);

  if (!isOpen) return null;

  const handleStatusChange = (id: string, newStatus: IncidentStatus) => {
    updateIncidentStatus(id, newStatus);
    loadData();
  };

  const handleAddNote = (id: string) => {
    const text = newNoteText[id]?.trim();
    if (!text) return;
    addIncidentServiceNote(id, text, noteAuthor.trim() || 'Servisný technik');
    setNewNoteText((prev) => ({ ...prev, [id]: '' }));
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Naozaj chcete vymazať tento incident zo servisného zoznamu?')) {
      deleteIncident(id);
      loadData();
    }
  };

  const handlePrint = () => {
    let isInsideIframe = false;
    try {
      isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      isInsideIframe = true;
    }
    if (isInsideIframe) {
      const htmlContent = `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <title>DALIOIL - Servisný protokol a poruchy nosičov</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #0f172a; margin: 0; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 10px; margin-bottom: 20px; }
    .btn { background: #dc2626; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .header { border-bottom: 3px solid #dc2626; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11px; }
    th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #cbd5e1; }
    td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
    @media print { .toolbar { display: none !important; } body { padding: 0 !important; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <div><strong>DALIOIL Servisný protokol</strong> • ${incidents.length} záznamov</div>
    <div style="display: flex; gap: 8px;">
      <button class="btn" onclick="window.print()">🖨️ Vytlačiť (Ctrl + P)</button>
      <button class="btn" style="background: #475569;" onclick="window.close()">✕ Zavrieť</button>
    </div>
  </div>
  <div class="header">
    <div>
      <h1 style="margin:0 0 4px 0; font-size: 22px;">DALI<span style="color:#dc2626;">OIL</span> Servisný a reklamačný protokol</h1>
      <div style="font-size: 12px; color: #64748b;">Evidencia porúch a poškodení reklamných nosičov</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      <div>Dátum: ${new Date().toLocaleDateString('sk-SK')}</div>
      <div>Počet incidentov: ${incidents.length}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Kód</th>
        <th>Čerpacia stanica</th>
        <th>Nosič</th>
        <th>Typ incidentu</th>
        <th>Priorita</th>
        <th>Stav</th>
        <th>Dátum nahlásenia</th>
      </tr>
    </thead>
    <tbody>
      ${incidents.map(inc => `<tr>
        <td><strong>${inc.id}</strong></td>
        <td>${inc.stationName} (${inc.stationCode})</td>
        <td>${inc.adSpaceId} - ${inc.adSpaceType}</td>
        <td>${inc.title}</td>
        <td>${inc.severity.toUpperCase()}</td>
        <td>${inc.status}</td>
        <td>${new Date(inc.reportedAt).toLocaleDateString('sk-SK')}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;
      const win = window.open('', '_blank');
      if (win) {
        win.document.open();
        win.document.write(htmlContent);
        win.document.close();
      } else {
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DALIOIL_Servisny_Protokol_${new Date().toISOString().slice(0, 10)}.html`;
        a.click();
      }
      return;
    }
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="incident-management-modal"
        className="w-full max-w-6xl h-[94vh] bg-white dark:bg-[#10141d] rounded-2xl border border-slate-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Servis & Poškodené plochy OOH
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-black">
                  {stats.active} aktívnych závad
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centrálny register hlásení porúch, poškodení nosičov a servisných zásahov siete DALI OIL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              title="Tlačiť servisný hárok"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Tlačiť protokol</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-950/40 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nahlásiť poškodenie</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-4 bg-slate-50 dark:bg-[#0b0e14] border-b border-slate-200 dark:border-gray-800 shrink-0">
          <div className="p-3 bg-white dark:bg-[#141a26] rounded-xl border border-slate-200 dark:border-gray-800">
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">Všetky hlásenia</div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">{stats.total}</div>
            <div className="text-[10px] text-slate-400 dark:text-gray-500">v servisnej knihe</div>
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50">
            <div className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Kritické závady
            </div>
            <div className="text-xl font-black text-red-700 dark:text-red-400 font-mono mt-0.5">{stats.critical}</div>
            <div className="text-[10px] text-red-600/70 dark:text-red-400/60">urgentný zásah</div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">V servise / riešení</div>
            <div className="text-xl font-black text-amber-800 dark:text-amber-400 font-mono mt-0.5">
              {stats.inProgress}
            </div>
            <div className="text-[10px] text-amber-700/70 dark:text-amber-400/60">čaká na diely / opravu</div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
            <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Vyriešené</div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
              {stats.resolved}
            </div>
            <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60">100% opravené</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50">
            <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400">Odhad nákladov</div>
            <div className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono mt-0.5">
              {stats.estimatedCost} €
            </div>
            <div className="text-[10px] text-blue-600/70 dark:text-blue-400/60">na aktívne opravy</div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 bg-white dark:bg-[#121622] border-b border-slate-200 dark:border-gray-800 flex flex-wrap gap-3 items-center justify-between shrink-0">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: `Všetky (${incidents.length})` },
              { id: 'new', label: `Nové (${incidents.filter((i) => i.status === 'new').length})` },
              { id: 'in_progress', label: `V riešení (${incidents.filter((i) => i.status === 'in_progress').length})` },
              { id: 'waiting_parts', label: `Čaká na diel (${incidents.filter((i) => i.status === 'waiting_parts').length})` },
              { id: 'resolved', label: `Vyriešené (${incidents.filter((i) => i.status === 'resolved').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hľadať stanicu, nosič, závadu..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-gray-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-hidden w-48 sm:w-60 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Region select */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-gray-300 outline-hidden"
            >
              <option value="all">Všetky regióny</option>
              <option value="zapad">Západ</option>
              <option value="sever">Sever</option>
              <option value="stred">Stred</option>
              <option value="vychod">Východ</option>
            </select>

            {/* Severity select */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-gray-300 outline-hidden"
            >
              <option value="all">Všetky priority</option>
              <option value="critical">Kritická</option>
              <option value="high">Vysoká</option>
              <option value="medium">Stredná</option>
              <option value="low">Nízka</option>
            </select>
          </div>
        </div>

        {/* Incidents List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-[#0d1117]">
          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-gray-800 max-w-md mx-auto my-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Žiadne závady nezodpovedajú filtrom</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Všetky reklamné plochy vo zvolenom segmente sú v poriadku alebo nemajú evidovaný aktívny incident.
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const reg = REGIONS[incident.regionId];
              const sev = SEVERITY_CONFIG[incident.severity];
              const stat = STATUS_CONFIG[incident.status];
              const isExpanded = expandedIncidentId === incident.id;

              return (
                <div
                  key={incident.id}
                  id={`incident-card-${incident.id}`}
                  className="bg-white dark:bg-[#131924] rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {/* Top Bar of Card */}
                  <div className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-gray-800/80">
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-mono font-black text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-black/40 px-2 py-0.5 rounded border border-slate-200 dark:border-gray-700">
                          {incident.id}
                        </span>

                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                          style={{
                            backgroundColor: `${reg?.color}15`,
                            borderColor: `${reg?.color}40`,
                            color: reg?.color,
                          }}
                        >
                          {incident.stationCode} • {incident.stationName}
                        </span>

                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold font-mono text-[11px]">
                          {incident.adSpaceId}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${stat.badgeBg}`}>
                          {stat.icon} {stat.label}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sev.bg} ${sev.text} ${sev.border}`}>
                          {sev.label}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{incident.title}</span>
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                        {incident.description}
                      </p>
                    </div>

                    {/* Right side cost & actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Odhadované náklady</div>
                        <div className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                          {incident.estimatedCostEur || 0} €
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onNavigateToStation && (
                          <button
                            onClick={() => {
                              onNavigateToStation(incident.stationId);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Prejsť na túto čerpaciu stanicu na mape a otvoriť detail"
                          >
                            <MapPin className="w-3 h-3 text-red-500" />
                            <span>Stanica</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedIncidentId(isExpanded ? null : incident.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-sky-500" />
                          <span>Záznamy ({incident.serviceNotes?.length || 0})</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50 dark:bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-gray-400">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Nahlásil: <strong className="text-slate-700 dark:text-gray-300">{incident.reportedBy}</strong></span>
                        {incident.reporterContact && (
                          <span className="text-slate-400 font-mono">({incident.reporterContact})</span>
                        )}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dátum: <strong className="text-slate-700 dark:text-gray-300">{incident.reportedAt}</strong></span>
                      </span>

                      {incident.targetResolutionDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Termín opravy: <strong className="text-slate-700 dark:text-gray-300">{incident.targetResolutionDate}</strong></span>
                        </span>
                      )}

                      {incident.resolvedAt && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Opravené: {incident.resolvedAt}</span>
                        </span>
                      )}
                    </div>

                    {/* Quick Status Changers */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Zmeniť stav:</span>

                      {incident.status !== 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(incident.id, 'in_progress')}
                          className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-300 dark:border-amber-800 transition cursor-pointer"
                        >
                          Do servisu
                        </button>
                      )}

                      {incident.status !== 'waiting_parts' && (
                        <button
                          onClick={() => handleStatusChange(incident.id, 'waiting_parts')}
                          className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-800 dark:text-purple-300 text-[11px] font-bold border border-purple-300 dark:border-purple-800 transition cursor-pointer"
                        >
                          Čaká na diel
                        </button>
                      )}

                      {incident.status !== 'resolved' ? (
                        <button
                          onClick={() => handleStatusChange(incident.id, 'resolved')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black shadow-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Vyriešené</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(incident.id, 'in_progress')}
                          className="px-2 py-1 rounded bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 text-[11px] font-semibold hover:bg-slate-300 transition cursor-pointer"
                        >
                          Znovu otvoriť
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(incident.id)}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
                        title="Odstrániť incident"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Service Notes & Log */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-100/70 dark:bg-black/40 border-t border-slate-200 dark:border-gray-800 space-y-3 animate-in fade-in duration-150">
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-500" />
                        <span>Servisný denník a poznámky k oprave nosiča:</span>
                      </div>

                      {/* Notes list */}
                      <div className="space-y-2">
                        {incident.serviceNotes && incident.serviceNotes.length > 0 ? (
                          incident.serviceNotes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 bg-white dark:bg-[#18202d] rounded-xl border border-slate-200 dark:border-gray-800 text-xs space-y-1 shadow-2xs"
                            >
                              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-gray-400">
                                <span className="font-bold text-slate-800 dark:text-gray-200">{note.author}</span>
                                <span className="font-mono">{note.createdAt}</span>
                              </div>
                              <p className="text-slate-700 dark:text-gray-300">{note.text}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-gray-500 italic">
                            Zatiaľ neboli pridané žiadne servisné poznámky.
                          </p>
                        )}
                      </div>

                      {/* Add new note form */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Meno autora (napr. OZ / Technik)"
                          value={noteAuthor}
                          onChange={(e) => setNoteAuthor(e.target.value)}
                          className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-red-500"
                        />
                        <input
                          type="text"
                          placeholder="Pridať nový záznam do servisného denníka..."
                          value={newNoteText[incident.id] || ''}
                          onChange={(e) =>
                            setNewNoteText((prev) => ({ ...prev, [incident.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddNote(incident.id);
                          }}
                          className="flex-1 px-3 py-2 bg-white dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddNote(incident.id)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-slate-950 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                        >
                          Pridať záznam
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-[#10141d] border-t border-slate-200 dark:border-gray-800 flex justify-between items-center text-xs text-slate-500 dark:text-gray-400 shrink-0">
          <div>
            Zobrazených <strong className="text-slate-800 dark:text-white">{filteredIncidents.length}</strong> z{' '}
            {incidents.length} záznamov
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-xl font-bold transition cursor-pointer"
          >
            Zavrieť prehľad
          </button>
        </div>
      </div>
    </div>
  );
};
