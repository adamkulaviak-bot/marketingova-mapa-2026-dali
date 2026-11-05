import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Send,
  Building2,
  CheckCircle2,
  DollarSign,
  Calendar,
  User,
  Phone,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Station, AdSpace, IncidentType, IncidentSeverity } from '../types';
import { STATIONS } from '../data/stations';
import { AD_SPACES } from '../data/adSpaces';
import {
  INCIDENT_TYPE_LABELS,
  SEVERITY_CONFIG,
  createNewIncident,
} from '../data/incidentsData';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStation?: Station | null;
  preselectedAdSpace?: AdSpace | null;
  onSuccess?: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  preselectedStation,
  preselectedAdSpace,
  onSuccess,
}) => {
  const [stationId, setStationId] = useState<number>(preselectedStation?.id || STATIONS[0]?.id || 1);
  const [adSpaceId, setAdSpaceId] = useState<string>(preselectedAdSpace?.id || '');
  const [type, setType] = useState<IncidentType>('broken_lighting');
  const [severity, setSeverity] = useState<IncidentSeverity>('high');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number>(120);
  const [targetDate, setTargetDate] = useState<string>('');
  const [initialNote, setInitialNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Synchronize when preselected props change
  useEffect(() => {
    if (preselectedStation) {
      setStationId(preselectedStation.id);
      if (preselectedStation.manager) {
        setReportedBy(`${preselectedStation.manager} (Vedúci ČS)`);
      }
    }
    if (preselectedAdSpace) {
      setAdSpaceId(preselectedAdSpace.id);
    }
  }, [preselectedStation, preselectedAdSpace]);

  // Default target date (+5 days from today)
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    setTargetDate(d.toISOString().split('T')[0]);
  }, []);

  // Update default cost when type changes
  useEffect(() => {
    setEstimatedCost(INCIDENT_TYPE_LABELS[type]?.defaultCost || 100);
  }, [type]);

  if (!isOpen) return null;

  const currentStation = STATIONS.find((s) => s.id === stationId);
  const stationAdSpaces = AD_SPACES.filter((a) => a.stationId === stationId);

  // If currently selected adSpace is not in this station's spaces, reset it
  const validAdSpace = stationAdSpaces.find((a) => a.id === adSpaceId) || stationAdSpaces[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentStation || !validAdSpace) return;

    const typeConfig = INCIDENT_TYPE_LABELS[type];

    createNewIncident({
      adSpaceId: validAdSpace.id,
      adSpaceName: validAdSpace.name,
      adSpaceType: validAdSpace.type,
      stationId: currentStation.id,
      stationName: currentStation.name,
      stationCode: currentStation.stationCode || `CS-${String(currentStation.id).padStart(3, '0')}`,
      regionId: currentStation.region,
      type,
      typeLabel: typeConfig.label,
      severity,
      status: 'new',
      title: title.trim() || `${typeConfig.label} na nosiči ${validAdSpace.id}`,
      description: description.trim(),
      reportedBy: reportedBy.trim() || 'Servisný technik',
      reporterContact: reporterContact.trim(),
      targetResolutionDate: targetDate,
      estimatedCostEur: Number(estimatedCost) || 0,
      initialNote: initialNote.trim(),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onSuccess?.();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="report-incident-modal"
        className="w-full max-w-2xl bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Nahlásiť poškodenie / incident plochy</h3>
              <p className="text-xs text-white/80">Evidencia servisného zásahu pre OOH sieť DALI OIL</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">Incident úspešne zaevidovaný!</h4>
            <p className="text-sm text-slate-600 dark:text-gray-400 max-w-md">
              Závada bola zapísaná do servisnej knihy OOH siete a priradená na riešenie zodpovednému manažérovi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Row 1: Station & Ad Space Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                  1. Čerpacia stanica / Lokalita
                </label>
                <select
                  value={stationId}
                  onChange={(e) => {
                    const newId = Number(e.target.value);
                    setStationId(newId);
                    const spaces = AD_SPACES.filter((a) => a.stationId === newId);
                    if (spaces.length > 0) {
                      setAdSpaceId(spaces[0].id);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
                >
                  {STATIONS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.stationCode || `CS-${String(s.id).padStart(3, '0')}`} – {s.name} ({s.city || s.okres})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                  2. Reklamný nosič
                </label>
                <select
                  value={validAdSpace?.id || ''}
                  onChange={(e) => setAdSpaceId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
                >
                  {stationAdSpaces.length === 0 ? (
                    <option value="">Žiadne nosiče na tejto stanici</option>
                  ) : (
                    stationAdSpaces.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id} • {a.name} ({a.type})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Row 2: Incident Type and Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                  3. Typ poruchy / poškodenia
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as IncidentType)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
                >
                  {Object.entries(INCIDENT_TYPE_LABELS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.icon} {val.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                  4. Závažnosť & Priorita
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['critical', 'high', 'medium', 'low'] as IncidentSeverity[]).map((sev) => {
                    const isSelected = severity === sev;
                    const conf = SEVERITY_CONFIG[sev];
                    return (
                      <button
                        type="button"
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? `${conf.bg} ${conf.border} ${conf.text} ring-2 ring-red-500 shadow-xs`
                            : 'bg-slate-50 dark:bg-gray-800/60 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400'
                        }`}
                      >
                        <span>{conf.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 3: Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                5. Stručný názov závady
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="napr. Nesvieti spodný reflektor / Natrhnutý banner po vetre"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>

            {/* Row 4: Detailed Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                6. Podrobný popis stavu a okolností
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Popíšte rozsah poškodenia, či je ohrozená bezpečnosť, prípadne aké dočasné opatrenia boli vykonané..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>

            {/* Row 5: Reporter Details, Estimated Cost & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-1">
                  Nahlásil (Meno / Rola)
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={reportedBy}
                    onChange={(e) => setReportedBy(e.target.value)}
                    placeholder="napr. Vedúci ČS / OZ"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-1">
                  Odhad nákladov (€)
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-1">
                  Požadovaný termín opravy
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Row 6: Initial Service Note */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-1">
                Servisná poznámka k zásahu (voliteľné)
              </label>
              <input
                type="text"
                value={initialNote}
                onChange={(e) => setInitialNote(e.target.value)}
                placeholder="napr. Servisná firma kontaktovaná telefonicky, prídu zajtra o 10:00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1a2130] border border-slate-300 dark:border-gray-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-hidden"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 font-bold text-xs transition cursor-pointer"
              >
                Zrušiť
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs transition flex items-center gap-2 shadow-lg shadow-red-950/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Zaevidovať incident do servisu</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
