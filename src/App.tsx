import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MapComponent } from './components/MapComponent';
import { StationDetailModal } from './components/StationDetailModal';
import { MarketingDashboardModal } from './components/MarketingDashboardModal';
import { ExportModal } from './components/ExportModal';
import { CampaignPlannerModal } from './components/CampaignPlannerModal';
import { IncidentManagementModal } from './components/IncidentManagementModal';
import { ReportIncidentModal } from './components/ReportIncidentModal';
import { ExternalSolutionsModal } from './components/ExternalSolutionsModal';
import { ZonePhotoBankModal } from './components/ZonePhotoBankModal';
import { CarrierDataAuditModal } from './components/CarrierDataAuditModal';
import { BranchExcelExportModal } from './components/BranchExcelExportModal';
import { PointColorCustomizerModal } from './components/PointColorCustomizerModal';
import { LcdNetworkModal } from './components/LcdNetworkModal';
import { MarketPricingModal } from './components/MarketPricingModal';
import { StandalonePrintView } from './components/StandalonePrintView';
import { STATIONS, REGIONS } from './data/stations';
import { getAllAdSummary, getStationAdSummary, getStationAdSpaces, AD_SPACES } from './data/adSpaces';
import { getIncidentsSummary } from './data/incidentsData';
import {
  RegionId,
  StationTypeFilter,
  AdStatusFilter,
  RoadTypeFilter,
  CampaignPlanItem,
  AdSpace,
  Station,
  MarkerColorMode,
  MarkerLabelMode,
  CurrentMapViewInfo,
  StationDetailTab,
} from './types';
import { normalizeText } from './utils/text';
import { getStoredColorTags, COLOR_TAGS_EVENT } from './utils/stationColorTags';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<'all' | RegionId>('all');
  const [selectedType, setSelectedType] = useState<StationTypeFilter>('all');
  const [selectedAdFilter, setSelectedAdFilter] = useState<AdStatusFilter>('all');
  const [selectedRoadType, setSelectedRoadType] = useState<RoadTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [selectedStationTrigger, setSelectedStationTrigger] = useState<number>(0);
  const [isolateSlovakia, setIsolateSlovakia] = useState<boolean>(true);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Dedicated Print Map Sheet View
  const [isPrintViewOpen, setIsPrintViewOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('print') === 'true';
    }
    return false;
  });

  // Global Ctrl+P keyboard shortcut to open print view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (!isPrintViewOpen) {
          e.preventDefault();
          setIsPrintViewOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrintViewOpen]);

  // Point Color Customizer Modal state
  const [isColorCustomizerOpen, setIsColorCustomizerOpen] = useState<boolean>(false);
  const [activeMarkerSize, setActiveMarkerSize] = useState<number>(34);
  const [activeMarkerColorMode, setActiveMarkerColorMode] = useState<MarkerColorMode>('region');
  const [activeMarkerLabelMode, setActiveMarkerLabelMode] = useState<MarkerLabelMode>('logo');
  const [activeMarkerCustomColor, setActiveMarkerCustomColor] = useState<string>('#E11D23');
  const [taggedStationsCount, setTaggedStationsCount] = useState<number>(() => Object.keys(getStoredColorTags()).length);

  // Free space indicator (green circle) badge on markers
  const [showAdBadge, setShowAdBadge] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const saved = localStorage.getItem('dalioil_show_ad_badge');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const handleToggleShowAdBadge = () => {
    setShowAdBadge((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dalioil_show_ad_badge', String(next));
      } catch {}
      return next;
    });
  };

  // Listen to color tags change
  useEffect(() => {
    const handleTagsChange = () => {
      setTaggedStationsCount(Object.keys(getStoredColorTags()).length);
    };
    window.addEventListener(COLOR_TAGS_EVENT, handleTagsChange);
    return () => window.removeEventListener(COLOR_TAGS_EVENT, handleTagsChange);
  }, []);

  // External Solutions & E-learning Modal
  const [isExternalSolutionsOpen, setIsExternalSolutionsOpen] = useState<boolean>(false);
  const [externalSolutionsCategory, setExternalSolutionsCategory] = useState<'all' | 'checklists' | 'reclamations' | 'elearning'>('all');

  const handleOpenExternalSolutions = (category: 'all' | 'checklists' | 'reclamations' | 'elearning' = 'all') => {
    setExternalSolutionsCategory(category);
    setIsExternalSolutionsOpen(true);
  };

  // Detail Modal / Drawer state
  const [detailStationId, setDetailStationId] = useState<number | null>(null);
  const [detailInitialTab, setDetailInitialTab] = useState<StationDetailTab>('photos');
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // LCD Screens Network Monitoring Modal state (2x LCD per point)
  const [isLcdNetworkModalOpen, setIsLcdNetworkModalOpen] = useState<boolean>(false);
  const [lcdNetworkStationId, setLcdNetworkStationId] = useState<number | null>(null);

  const handleOpenLcdScreens = (stationId?: number) => {
    if (typeof stationId === 'number' && !isNaN(stationId)) {
      setLcdNetworkStationId(stationId);
    } else {
      setLcdNetworkStationId(null);
    }
    setIsLcdNetworkModalOpen(true);
  };

  // Zone Photo Bank Modal state
  const [isZonePhotoBankOpen, setIsZonePhotoBankOpen] = useState<boolean>(false);
  const [selectedPhotoBankZoneNumber, setSelectedPhotoBankZoneNumber] = useState<number | null>(null);
  const [selectedPhotoBankStationCode, setSelectedPhotoBankStationCode] = useState<string>('DALIOIL_001');

  const handleOpenZonePhotoBank = (stationCode: string = 'DALIOIL_001', zoneNumber: number = 1) => {
    setSelectedPhotoBankStationCode(stationCode);
    setSelectedPhotoBankZoneNumber(zoneNumber);
    setIsZonePhotoBankOpen(true);
  };

  // Official Carrier & Fuel Dispenser Data Audit Modal state (PDF 2026)
  const [isCarrierAuditOpen, setIsCarrierAuditOpen] = useState<boolean>(false);

  // Marketing Tools Modals
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isBranchExportModalOpen, setIsBranchExportModalOpen] = useState<boolean>(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);
  const [isMarketPricingOpen, setIsMarketPricingOpen] = useState<boolean>(false);

  // Incidents & Service Modals
  const [isIncidentsManagementOpen, setIsIncidentsManagementOpen] = useState<boolean>(false);
  const [isReportIncidentOpen, setIsReportIncidentOpen] = useState<boolean>(false);
  const [reportIncidentStation, setReportIncidentStation] = useState<Station | null>(null);
  const [reportIncidentAdSpace, setReportIncidentAdSpace] = useState<AdSpace | null>(null);
  const [activeIncidentsCount, setActiveIncidentsCount] = useState<number>(() => getIncidentsSummary().active);

  // Campaign Mediaplan Items
  const [campaignPlanItems, setCampaignPlanItems] = useState<CampaignPlanItem[]>([]);

  // Reactively track incidents count
  useEffect(() => {
    const handleIncidentsChange = () => {
      setActiveIncidentsCount(getIncidentsSummary().active);
    };
    window.addEventListener('senior_ooh_incidents_changed', handleIncidentsChange);
    return () => window.removeEventListener('senior_ooh_incidents_changed', handleIncidentsChange);
  }, []);

  const campaignPlanItemIds = useMemo(() => {
    return new Set(campaignPlanItems.map((item) => item.adSpace.id));
  }, [campaignPlanItems]);

  const handleToggleCampaignPlanItem = (adSpace: AdSpace, station: Station) => {
    setCampaignPlanItems((prev) => {
      const exists = prev.some((item) => item.adSpace.id === adSpace.id);
      if (exists) {
        return prev.filter((item) => item.adSpace.id !== adSpace.id);
      } else {
        return [...prev, { adSpace, station, addedAt: Date.now() }];
      }
    });
  };

  const handleRemoveCampaignPlanItem = (adSpaceId: string) => {
    setCampaignPlanItems((prev) => prev.filter((item) => item.adSpace.id !== adSpaceId));
  };

  const handleClearCampaignPlan = () => {
    setCampaignPlanItems([]);
  };

  // Filter stations based on Region, Type, Ad Status, Road Type, and Search Query
  const filteredStations = useMemo(() => {
    const normQuery = normalizeText(searchQuery);

    return STATIONS.filter((station) => {
      // 1. Region filter
      if (selectedRegion !== 'all' && station.region !== selectedRegion) {
        return false;
      }

      // 2. Type filter (Stations vs Terminals)
      if (selectedType === 'stations' && station.isTerminal) {
        return false;
      }
      if (selectedType === 'terminals' && !station.isTerminal) {
        return false;
      }

      // 3. Ad status filter
      const adSummary = getStationAdSummary(station.id);
      if (selectedAdFilter === 'free' && adSummary.free === 0) {
        return false;
      }
      if (selectedAdFilter === 'expiring' && adSummary.expiring === 0 && adSummary.reserved === 0) {
        return false;
      }
      if (selectedAdFilter === 'occupied' && !adSummary.isFullyOccupied) {
        return false;
      }

      // 4. Road Type filter (D1/R1 vs Tranzit vs Mesto)
      if (selectedRoadType !== 'all' && station.roadType !== selectedRoadType) {
        return false;
      }

      // 5. Search query filter (matches name, note, number, region, rep, or ad spaces)
      if (normQuery !== '') {
        const reg = REGIONS[station.region];
        const matchName = normalizeText(station.name).includes(normQuery);
        const matchCompany = station.companyName ? normalizeText(station.companyName).includes(normQuery) : false;
        const matchNote = normalizeText(station.note).includes(normQuery);
        const matchNumber = normalizeText(station.number).includes(normQuery);
        const matchCode = station.stationCode ? normalizeText(station.stationCode).includes(normQuery) : false;
        const matchCity = station.city ? normalizeText(station.city).includes(normQuery) : false;
        const matchStreet = station.street ? normalizeText(station.street).includes(normQuery) : false;
        const matchRepName = normalizeText(reg.rep.name).includes(normQuery);
        const matchRegionName = normalizeText(reg.name).includes(normQuery);
        const matchManager = station.manager ? normalizeText(station.manager).includes(normQuery) : false;
        const matchManagerPhone = station.managerPhone ? normalizeText(station.managerPhone).includes(normQuery) : false;
        const matchEmail = station.email ? normalizeText(station.email).includes(normQuery) : false;
        const matchServices = station.services ? normalizeText(station.services).includes(normQuery) : false;
        const matchHQ =
          (normQuery.includes('central') || normQuery === 'hq' || normQuery === 'centrálna') &&
          Boolean(station.isHeadquarters || station.stationCode === 'DALIOIL_010');

        // Search also inside ad spaces for this station (client, campaign, ad type, zone, inspector)
        const stationAds = getStationAdSpaces(station.id);
        const matchAd = stationAds.some((ad) => {
          const clientMatch = ad.client ? normalizeText(ad.client).includes(normQuery) : false;
          const campMatch = ad.campaign ? normalizeText(ad.campaign).includes(normQuery) : false;
          const typeMatch = normalizeText(ad.type).includes(normQuery);
          const zoneMatch = ad.zone ? normalizeText(ad.zone).includes(normQuery) : false;
          const inspectorMatch = ad.inspector ? normalizeText(ad.inspector).includes(normQuery) : false;
          const idMatch = normalizeText(ad.id).includes(normQuery);
          return clientMatch || campMatch || typeMatch || zoneMatch || inspectorMatch || idMatch;
        });

        const matchNewKeyword =
          (normQuery === 'nove' || normQuery === 'novy' || normQuery === 'nova') && station.isNew;
        const matchTerminalKeyword =
          (normQuery === 'terminal' || normQuery === 'terminaly' || normQuery === 't') &&
          station.isTerminal;
        const matchGoogle =
          (normQuery.includes('google') || normQuery.includes('street') || normQuery.includes('360')) &&
          Boolean(station.googleMapsUrl || station.googleStreetViewUrl);

        if (
          !matchName &&
          !matchCompany &&
          !matchNote &&
          !matchNumber &&
          !matchCode &&
          !matchCity &&
          !matchStreet &&
          !matchRepName &&
          !matchRegionName &&
          !matchManager &&
          !matchManagerPhone &&
          !matchEmail &&
          !matchServices &&
          !matchHQ &&
          !matchAd &&
          !matchNewKeyword &&
          !matchTerminalKeyword &&
          !matchGoogle
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedRegion, selectedType, selectedAdFilter, selectedRoadType, searchQuery]);

  const handleSelectStation = (id: number | null) => {
    setSelectedStationId(id);
    setSelectedStationTrigger(Date.now());
  };

  const handleOpenStationDetail = (stationId: number, tab: StationDetailTab = 'photos') => {
    setSelectedStationId(stationId);
    setSelectedStationTrigger(Date.now());
    setDetailStationId(stationId);
    setDetailInitialTab(tab);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleResetAllFilters = () => {
    setSelectedRegion('all');
    setSelectedType('all');
    setSelectedAdFilter('all');
    setSelectedRoadType('all');
    setSearchQuery('');
  };

  const handleOpenReportFromStation = (st: Station, ad?: AdSpace) => {
    setReportIncidentStation(st);
    setReportIncidentAdSpace(ad || null);
    setIsReportIncidentOpen(true);
  };

  const stationCount = useMemo(() => STATIONS.filter((s) => !s.isTerminal).length, []);
  const terminalCount = useMemo(() => STATIONS.filter((s) => s.isTerminal).length, []);
  const totalCount = STATIONS.length;

  const globalAdSummary = useMemo(() => getAllAdSummary(), []);

  const activeDetailStation = useMemo(() => {
    if (!detailStationId) return null;
    return STATIONS.find((s) => s.id === detailStationId) || null;
  }, [detailStationId]);

  const activeDetailRegion = useMemo(() => {
    if (!activeDetailStation) return null;
    return REGIONS[activeDetailStation.region] || null;
  }, [activeDetailStation]);

  if (isPrintViewOpen) {
    return (
      <StandalonePrintView
        onBackToApp={() => setIsPrintViewOpen(false)}
        initialConfig={{
          orientation: 'landscape',
          markerSize: activeMarkerSize,
          colorMode: activeMarkerColorMode,
          customColor: activeMarkerCustomColor,
          labelMode: activeMarkerLabelMode,
          isolateSlovakia: isolateSlovakia,
          stations: filteredStations,
          allStations: STATIONS,
        }}
      />
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0b0e14] text-slate-900 dark:text-slate-100 h-screen w-screen overflow-hidden flex flex-col antialiased transition-colors duration-200">
      {/* Top Application Bar with Marketing Tools & Incidents */}
      <Header
        stationCount={stationCount}
        terminalCount={terminalCount}
        totalCount={totalCount}
        totalAdSpaces={globalAdSummary.total}
        freeAdSpaces={globalAdSummary.free}
        expiringAdSpaces={globalAdSummary.expiring}
        selectedAdFilter={selectedAdFilter}
        onSelectAdFilter={(f) => {
          setSelectedAdFilter(f);
        }}
        isolateSlovakia={isolateSlovakia}
        onToggleIsolation={() => setIsolateSlovakia(!isolateSlovakia)}
        onToggleSidebar={() => setIsOpenMobile(!isOpenMobile)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenBranchExport={() => setIsBranchExportModalOpen(true)}
        onOpenCampaignPlanner={() => setIsPlannerOpen(true)}
        campaignItemsCount={campaignPlanItems.length}
        onOpenIncidents={() => setIsIncidentsManagementOpen(true)}
        activeIncidentsCount={activeIncidentsCount}
        onOpenExternalSolutions={handleOpenExternalSolutions}
        onOpenZonePhotoBank={() => {
          setSelectedPhotoBankZoneNumber(null);
          setIsZonePhotoBankOpen(true);
        }}
        onOpenCarrierAudit={() => setIsCarrierAuditOpen(true)}
        onOpenLcdScreens={handleOpenLcdScreens}
        onOpenColorCustomizer={() => setIsColorCustomizerOpen(true)}
        taggedStationsCount={taggedStationsCount}
        onOpenMarketPricing={() => setIsMarketPricingOpen(true)}
        onOpenPrintView={() => setIsPrintViewOpen(true)}
      />

      {/* Main Map & Sidebar Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          stations={filteredStations}
          allStations={STATIONS}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
          }}
          selectedType={selectedType}
          onSelectType={(type) => {
            setSelectedType(type);
          }}
          selectedAdFilter={selectedAdFilter}
          onSelectAdFilter={(filter) => {
            setSelectedAdFilter(filter);
          }}
          selectedRoadType={selectedRoadType}
          onSelectRoadType={(rt) => {
            setSelectedRoadType(rt);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStationId={selectedStationId}
          onSelectStation={(id) => {
            handleSelectStation(id);
          }}
          onOpenStationDetail={handleOpenStationDetail}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          regions={REGIONS}
          onOpenExternalSolutions={handleOpenExternalSolutions}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenBranchExport={() => setIsBranchExportModalOpen(true)}
          onOpenCarrierAudit={() => setIsCarrierAuditOpen(true)}
          onOpenLcdScreens={handleOpenLcdScreens}
          onOpenColorCustomizer={() => setIsColorCustomizerOpen(true)}
          onOpenMarketPricing={() => setIsMarketPricingOpen(true)}
          onOpenPrintView={() => setIsPrintViewOpen(true)}
        />

        <MapComponent
          stations={filteredStations}
          allStations={STATIONS}
          regions={REGIONS}
          selectedStationId={selectedStationId}
          selectedStationTrigger={selectedStationTrigger}
          onSelectStation={handleSelectStation}
          onOpenStationDetail={handleOpenStationDetail}
          isolateSlovakia={isolateSlovakia}
          onToggleIsolation={() => setIsolateSlovakia(!isolateSlovakia)}
          onOpenSidebar={() => setIsOpenMobile(true)}
          onResetAllFilters={handleResetAllFilters}
          onOpenColorCustomizer={() => setIsColorCustomizerOpen(true)}
          onOpenPrintView={() => setIsPrintViewOpen(true)}
          activeMarkerSize={activeMarkerSize}
          activeMarkerColorMode={activeMarkerColorMode}
          activeMarkerLabelMode={activeMarkerLabelMode}
          activeCustomColor={activeMarkerCustomColor}
          showAdBadge={showAdBadge}
          onToggleShowAdBadge={handleToggleShowAdBadge}
        />

        {/* Station Detail Drawer / Modal with Pristine Offer & Incidents */}
        <StationDetailModal
          station={activeDetailStation}
          region={activeDetailRegion}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          initialTab={detailInitialTab}
          campaignPlanItemIds={campaignPlanItemIds}
          onToggleCampaignPlanItem={handleToggleCampaignPlanItem}
          onOpenReportIncident={handleOpenReportFromStation}
          onOpenCarrierAudit={() => {
            setIsDetailOpen(false);
            setIsCarrierAuditOpen(true);
          }}
          onOpenZonePhotoBank={handleOpenZonePhotoBank}
        />

        {/* Executive Marketing & Financial Dashboard Modal */}
        <MarketingDashboardModal
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          stations={STATIONS}
          adSpaces={AD_SPACES}
          regions={REGIONS}
          onSelectStationAndOpenDetail={(stId) => {
            handleOpenStationDetail(stId, 'ads');
          }}
          onOpenCarrierAudit={() => {
            setIsDashboardOpen(false);
            setIsCarrierAuditOpen(true);
          }}
        />

        {/* Data Export & Google Sheets Integration Modal */}
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          stations={filteredStations}
          allStations={STATIONS}
          adSpaces={AD_SPACES}
          onOpenAdvancedBranchExport={() => {
            setIsExportOpen(false);
            setIsBranchExportModalOpen(true);
          }}
          onOpenPrintMap={() => setIsPrintViewOpen(true)}
        />

        {/* Advanced Excel Export Modal with Column Selection */}
        <BranchExcelExportModal
          isOpen={isBranchExportModalOpen}
          onClose={() => setIsBranchExportModalOpen(false)}
          stations={filteredStations}
          allStations={STATIONS}
        />

        {/* OOH Campaign Planner / Mediaplán Modal */}
        <CampaignPlannerModal
          isOpen={isPlannerOpen}
          onClose={() => setIsPlannerOpen(false)}
          items={campaignPlanItems}
          onRemoveItem={handleRemoveCampaignPlanItem}
          onClearPlan={handleClearCampaignPlan}
          onOpenStationDetail={(stId) => {
            setIsPlannerOpen(false);
            handleOpenStationDetail(stId, 'ads');
          }}
        />

        {/* Central Incident Management Dashboard */}
        <IncidentManagementModal
          isOpen={isIncidentsManagementOpen}
          onClose={() => setIsIncidentsManagementOpen(false)}
          onOpenReportModal={() => {
            setReportIncidentStation(null);
            setReportIncidentAdSpace(null);
            setIsReportIncidentOpen(true);
          }}
          onNavigateToStation={(stId) => {
            handleOpenStationDetail(stId, 'incidents');
          }}
        />

        {/* Report New Incident Modal */}
        <ReportIncidentModal
          isOpen={isReportIncidentOpen}
          onClose={() => {
            setIsReportIncidentOpen(false);
            setReportIncidentStation(null);
            setReportIncidentAdSpace(null);
          }}
          preselectedStation={reportIncidentStation}
          preselectedAdSpace={reportIncidentAdSpace}
          onSuccess={() => {
            setActiveIncidentsCount(getIncidentsSummary().active);
          }}
        />

        {/* Dalioil External Solutions, Quality Checklists & E-learning Hub Modal */}
        <ExternalSolutionsModal
          isOpen={isExternalSolutionsOpen}
          onClose={() => setIsExternalSolutionsOpen(false)}
          initialCategory={externalSolutionsCategory}
        />

        {/* Global 12-Zone Photo Bank & In-App Lightbox Modal */}
        <ZonePhotoBankModal
          isOpen={isZonePhotoBankOpen}
          onClose={() => {
            setIsZonePhotoBankOpen(false);
            setSelectedPhotoBankZoneNumber(null);
          }}
          initialZoneNumber={selectedPhotoBankZoneNumber}
          initialStationCode={selectedPhotoBankStationCode}
          onSelectStation={(stId) => {
            setIsZonePhotoBankOpen(false);
            handleSelectStation(stId);
            handleOpenStationDetail(stId, 'photos');
          }}
        />

        {/* Official Advertising Carriers & Zone Audit Data Collection Modal (PDF 2026) */}
        <CarrierDataAuditModal
          isOpen={isCarrierAuditOpen}
          onClose={() => setIsCarrierAuditOpen(false)}
          onOpenStationDetail={(stId) => {
            setIsCarrierAuditOpen(false);
            handleOpenStationDetail(stId, 'audit');
          }}
          onOpenZonePhotoBank={handleOpenZonePhotoBank}
        />

        {/* Point Color Customizer & Tagging Modal */}
        <PointColorCustomizerModal
          isOpen={isColorCustomizerOpen}
          onClose={() => setIsColorCustomizerOpen(false)}
          stations={filteredStations}
          allStations={STATIONS}
          regions={REGIONS}
          activeSize={activeMarkerSize}
          activeColorMode={activeMarkerColorMode}
          activeLabelMode={activeMarkerLabelMode}
          activeCustomColor={activeMarkerCustomColor}
          showAdBadge={showAdBadge}
          onApply={(size, colorMode, labelMode, customColor, newShowAdBadge) => {
            setActiveMarkerSize(size);
            setActiveMarkerColorMode(colorMode);
            setActiveMarkerLabelMode(labelMode);
            setActiveMarkerCustomColor(customColor);
            if (newShowAdBadge !== undefined) {
              setShowAdBadge(newShowAdBadge);
              try {
                localStorage.setItem('dalioil_show_ad_badge', String(newShowAdBadge));
              } catch {}
            }
          }}
        />

        {/* Central 2x LCD Screens DOOH Network Monitoring Modal */}
        <LcdNetworkModal
          isOpen={isLcdNetworkModalOpen}
          onClose={() => setIsLcdNetworkModalOpen(false)}
          initialStationId={
            typeof lcdNetworkStationId === 'number'
              ? lcdNetworkStationId
              : typeof detailStationId === 'number'
              ? detailStationId
              : 1
          }
          onSelectStationInApp={(stId) => {
            handleSelectStation(stId);
            handleOpenStationDetail(stId, 'lcd');
          }}
        />

        {/* Realistic Competitive Slovak OOH Market Pricing Modal */}
        <MarketPricingModal
          isOpen={isMarketPricingOpen}
          onClose={() => setIsMarketPricingOpen(false)}
          stations={STATIONS}
          adSpaces={AD_SPACES}
          regions={REGIONS}
          onSelectStationAndOpenDetail={(stId) => {
            setIsMarketPricingOpen(false);
            handleOpenStationDetail(stId, 'ads');
          }}
          onToggleCampaignPlanItem={handleToggleCampaignPlanItem}
          campaignPlanItemIds={campaignPlanItemIds}
        />
      </div>
    </div>
  );
}
