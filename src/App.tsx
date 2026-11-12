/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlanetaryCanvas, CursorTelemetry } from './components/PlanetaryCanvas';
import { ModernBottomDeck, AppMode } from './components/ModernBottomDeck';
import { ModernFlightHUD } from './components/ModernFlightHUD';
import { PlanetaryInspectorModal } from './components/PlanetaryInspectorModal';
import { PlanetComparisonLab } from './components/PlanetComparisonLab';
import { ISSStationModal } from './components/ISSStationModal';
import { RoverExplorer3D } from './components/RoverExplorer3D';
import { MarsAtmosphereLab } from './components/MarsAtmosphereLab';
import { MissionsTimeline } from './components/MissionsTimeline';
import { MarsQuiz } from './components/MarsQuiz';
import { ExplorerLogbook } from './components/ExplorerLogbook';
import { AmericanSpaceModal } from './components/AmericanSpaceModal';
import { MarsSurfaceFirstPerson } from './components/MarsSurfaceFirstPerson';
import { LandingDescentOverlay } from './components/LandingDescentOverlay';
import { HohmannFlightSimulator } from './components/HohmannFlightSimulator';
import { SpaceArchiveViewer } from './components/SpaceArchiveViewer';
import { MARS_POIS } from './data/marsData';
import { EARTH_POIS } from './data/earthData';
import { MarsPOI } from './types/mars';
import { PlanetType } from './types/planetary';
import { SpectralLayer } from './utils/proceduralMarsTextures';
import { marsAudio } from './utils/marsAudio';

export default function App() {
  const [currentPlanet, setCurrentPlanet] = useState<PlanetType>('mars');
  const [currentMode, setCurrentMode] = useState<AppMode>('globe');
  const [selectedPOI, setSelectedPOI] = useState<MarsPOI | null>(null);
  const [inspectingPOI, setInspectingPOI] = useState<MarsPOI | null>(null);
  const [isISSModalOpen, setIsISSModalOpen] = useState<boolean>(false);

  // Gamified Exploration Progress Tracking
  const [exploredPOIIds, setExploredPOIIds] = useState<Set<string>>(() => {
    return new Set(['olympus-mons', 'american-space-dushanbe']);
  });
  const [testedTools, setTestedTools] = useState<Set<string>>(new Set());
  const [testedPhysics, setTestedPhysics] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // 3D Visual & Planetary Simulation Controls
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showAtmosphere, setShowAtmosphere] = useState<boolean>(true);
  const [showMoons, setShowMoons] = useState<boolean>(true);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [spectralLayer, setSpectralLayer] = useState<SpectralLayer>('true-color');
  const [sunAngle, setSunAngle] = useState<number>(45);
  const [isCinematicFlying, setIsCinematicFlying] = useState<boolean>(false);
  const [cursorTelemetry, setCursorTelemetry] = useState<CursorTelemetry | undefined>(undefined);

  // Sound & Presentation States
  const [isWindPlaying, setIsWindPlaying] = useState<boolean>(false);
  const [isAmericanSpaceModalOpen, setIsAmericanSpaceModalOpen] = useState<boolean>(false);
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  // Surface First-Person Landing State
  const [landingTargetPOI, setLandingTargetPOI] = useState<MarsPOI>(MARS_POIS[2]); // Default Jezero
  const [isLandingDescentActive, setIsLandingDescentActive] = useState<boolean>(false);

  const tourTimeoutRef = useRef<number | null>(null);

  // Calculate overall mastery
  const poiPoints = Math.min(50, exploredPOIIds.size * 4);
  const toolPoints = Math.min(20, testedTools.size * 3.5);
  const physicsPoints = testedPhysics ? 15 : 0;
  const quizPoints = Math.min(15, Math.round((quizScore / 8) * 15));
  const totalMastery = Math.min(100, Math.round(poiPoints + toolPoints + physicsPoints + quizPoints));

  // Selection handlers
  const handleSelectPOI = (poi: MarsPOI) => {
    setSelectedPOI(poi);
    setInspectingPOI(poi);
    setAutoRotate(false);
    setIsCinematicFlying(false);
    markPOIAsExplored(poi.id);
  };

  const markPOIAsExplored = (poiId: string) => {
    setExploredPOIIds(prev => {
      const next = new Set(prev);
      next.add(poiId);
      return next;
    });
  };

  const handleToolInteraction = (toolId: string) => {
    setTestedTools(prev => {
      const next = new Set(prev);
      next.add(toolId);
      return next;
    });
  };

  const handlePhysicsInteraction = () => {
    setTestedPhysics(true);
  };

  const handleQuizCompleted = (score: number) => {
    setQuizScore(score);
  };

  const handleToggleWind = () => {
    const newState = marsAudio.toggleWind();
    setIsWindPlaying(newState);
  };

  const handleResetView = () => {
    setSelectedPOI(null);
    setInspectingPOI(null);
    setAutoRotate(true);
    setIsCinematicFlying(false);
    marsAudio.playTelemetryPing();
  };

  const handleChangePlanet = (planet: PlanetType) => {
    if (planet === currentPlanet) return;
    setCurrentPlanet(planet);
    setSelectedPOI(null);
    setInspectingPOI(null);
    setCurrentMode('globe');
    setSpectralLayer('true-color');
    marsAudio.playInterplanetaryWarp();
  };

  // Surface landing triggers (on Mars)
  const handleStartLanding = (target?: MarsPOI) => {
    const poiToLand = target || selectedPOI || MARS_POIS[2];
    setLandingTargetPOI(poiToLand);
    setSelectedPOI(poiToLand);
    setInspectingPOI(null);
    setIsCinematicFlying(false);
    setIsLandingDescentActive(true);
  };

  const handleLandingComplete = () => {
    setIsLandingDescentActive(false);
    setCurrentMode('surface');
    markPOIAsExplored(landingTargetPOI.id);
  };

  const handleReturnToOrbit = () => {
    setCurrentMode('globe');
  };

  // Automated Tour for Live Presentations
  const marsTourStops: MarsPOI[] = [
    MARS_POIS[0], // Olympus Mons
    MARS_POIS[1], // Valles Marineris
    MARS_POIS[2], // Jezero Crater
    MARS_POIS[3], // Gale Crater
    MARS_POIS[4], // North Polar Ice Cap
  ];

  const earthTourStops: MarsPOI[] = [
    EARTH_POIS[0], // American Space Dushanbe
    EARTH_POIS[1], // Baikonur Cosmodrome
    EARTH_POIS[2], // Kennedy Space Center
    EARTH_POIS[4], // Mount Everest
    EARTH_POIS[5], // Mariana Trench
  ];

  const activeTourStops = currentPlanet === 'mars' ? marsTourStops : earthTourStops;

  const startAutoTour = () => {
    setCurrentMode('globe');
    setIsAutoTouring(true);
    setTourStep(0);
    setInspectingPOI(null);
    setAutoRotate(false);
    setIsCinematicFlying(false);
    marsAudio.playTelemetryPing();

    const runStep = (step: number) => {
      if (step >= activeTourStops.length) {
        setIsAutoTouring(false);
        return;
      }
      const targetPoi = activeTourStops[step];
      setSelectedPOI(targetPoi);
      markPOIAsExplored(targetPoi.id);
      setTourStep(step);

      tourTimeoutRef.current = window.setTimeout(() => {
        runStep(step + 1);
      }, 7000);
    };

    runStep(0);
  };

  const stopAutoTour = () => {
    if (tourTimeoutRef.current) {
      clearTimeout(tourTimeoutRef.current);
    }
    setIsAutoTouring(false);
  };

  useEffect(() => {
    return () => {
      if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none font-sans text-slate-100">
      {/* Top Flight HUD (Shown in globe, orbit & lab modes) */}
      {currentMode !== 'surface' && (
        <ModernFlightHUD
          currentPlanet={currentPlanet}
          onChangePlanet={handleChangePlanet}
          onStartAutoTour={isAutoTouring ? stopAutoTour : startAutoTour}
          isAutoTouring={isAutoTouring}
          onOpenAmericanSpaceModal={() => setIsAmericanSpaceModalOpen(true)}
          isWindPlaying={isWindPlaying}
          onToggleWind={handleToggleWind}
          totalMastery={totalMastery}
          onOpenLogbook={() => setCurrentMode('logbook')}
          cursorTelemetry={cursorTelemetry}
        />
      )}

      {/* Main View Area */}
      <main className="w-full h-full relative">
        {/* Mode 1: 3D Interactive Planetary Globe (Earth or Mars) */}
        {currentMode === 'globe' && (
          <div className="w-full h-full relative">
            <PlanetaryCanvas
              currentPlanet={currentPlanet}
              selectedPOI={selectedPOI}
              onSelectPOI={handleSelectPOI}
              onSelectISS={() => setIsISSModalOpen(true)}
              autoRotate={autoRotate}
              showAtmosphere={showAtmosphere}
              showMoons={showMoons}
              showPins={showPins}
              spectralLayer={spectralLayer}
              sunAngle={sunAngle}
              isCinematicFlying={isCinematicFlying}
              onCursorTelemetry={setCursorTelemetry}
            />

            {/* Auto-Tour Live Presentation Subtitle Card */}
            {isAutoTouring && activeTourStops[tourStep] && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[90%] bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-amber-500 shadow-2xl text-center">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                  <span>🎬 ДЕМО-ТУР: Остановка {tourStep + 1} из {activeTourStops.length}</span>
                  <button
                    onClick={stopAutoTour}
                    className="text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded text-[10px]"
                  >
                    Остановить
                  </button>
                </div>
                <h3 className="text-lg font-black text-white">{activeTourStops[tourStep].nameRu}</h3>
                <p className="text-xs text-slate-200 mt-1">{activeTourStops[tourStep].highlightFactRu}</p>
                <div className="text-[11px] text-sky-400 mt-2 font-mono">
                  {activeTourStops[tourStep].badge}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode: Hohmann Interplanetary Flight Simulator (Earth -> Mars) */}
        {currentMode === 'hohmann' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8 overflow-y-auto">
            <HohmannFlightSimulator
              onReturnToOrbit={() => setCurrentMode('globe')}
              onExploreMars={() => {
                handleChangePlanet('mars');
                setCurrentMode('globe');
              }}
            />
          </div>
        )}

        {/* Mode: Mega NASA & ESA High-Res Photographic Archive */}
        {currentMode === 'archive' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8 overflow-y-auto">
            <SpaceArchiveViewer
              onBackToPlanet={() => setCurrentMode('globe')}
              onExploreLocation={target => {
                handleChangePlanet(target);
                setCurrentMode('globe');
              }}
            />
          </div>
        )}

        {/* Mode 2: Comparative Planetary Science Lab (Earth vs Mars) */}
        {currentMode === 'comparison' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8 overflow-y-auto">
            <PlanetComparisonLab
              onBackToGlobe={() => setCurrentMode('globe')}
              onExplorePlanet={planet => {
                handleChangePlanet(planet);
                setCurrentMode('globe');
              }}
            />
          </div>
        )}

        {/* Mode 3: Full 3D First-Person Surface Immersion (Mars) */}
        {currentMode === 'surface' && (
          <div className="w-full h-full relative">
            <MarsSurfaceFirstPerson
              poi={landingTargetPOI}
              onReturnToOrbit={handleReturnToOrbit}
              onScannedObject={id => markPOIAsExplored(id)}
            />
          </div>
        )}

        {/* Mode 4: 3D NASA Rover Perseverance & Ingenuity */}
        {currentMode === 'rover' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8">
            <RoverExplorer3D onInteractTool={handleToolInteraction} />
          </div>
        )}

        {/* Mode 5: Mars Physics, Gravity Jump & Sound Lab */}
        {currentMode === 'atmosphere' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8">
            <MarsAtmosphereLab onInteractLab={handlePhysicsInteraction} />
          </div>
        )}

        {/* Mode 6: NASA Historical Missions Timeline */}
        {currentMode === 'timeline' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8">
            <MissionsTimeline />
          </div>
        )}

        {/* Mode 7: Kid-Friendly Space & Mars Quiz */}
        {currentMode === 'quiz' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8 flex items-center justify-center">
            <MarsQuiz onQuizCompleted={handleQuizCompleted} />
          </div>
        )}

        {/* Mode 8: Explorer Logbook & Certificate */}
        {currentMode === 'logbook' && (
          <div className="w-full h-full pt-16 pb-24 px-4 md:px-8">
            <ExplorerLogbook
              exploredPOIIds={exploredPOIIds}
              testedTools={testedTools}
              testedPhysics={testedPhysics}
              quizScore={quizScore}
              onSelectPOI={poi => {
                setCurrentMode('globe');
                handleSelectPOI(poi);
              }}
            />
          </div>
        )}
      </main>

      {/* Atmospheric Descent Overlay Animation (Mars only) */}
      {isLandingDescentActive && (
        <LandingDescentOverlay
          poi={landingTargetPOI}
          onLandingComplete={handleLandingComplete}
        />
      )}

      {/* Planetary POI Detailed Inspection Dossier with NASA Photo Gallery */}
      {inspectingPOI && (
        <PlanetaryInspectorModal
          poi={inspectingPOI}
          currentPlanet={currentPlanet}
          onClose={() => setInspectingPOI(null)}
          onSelectPOI={handleSelectPOI}
          isExplored={exploredPOIIds.has(inspectingPOI.id)}
          onMarkExplored={markPOIAsExplored}
          onLandOnSurface={currentPlanet === 'mars' ? poi => handleStartLanding(poi) : undefined}
        />
      )}

      {/* ISS Space Station Telemetry & Modules Modal */}
      <ISSStationModal
        isOpen={isISSModalOpen || currentMode === 'iss'}
        onClose={() => {
          setIsISSModalOpen(false);
          if (currentMode === 'iss') setCurrentMode('globe');
        }}
        onFocusEarth={() => {
          setIsISSModalOpen(false);
          handleChangePlanet('earth');
          setCurrentMode('globe');
        }}
      />

      {/* American Space Dushanbe Mission Modal */}
      <AmericanSpaceModal
        isOpen={isAmericanSpaceModalOpen}
        onClose={() => setIsAmericanSpaceModalOpen(false)}
        onStartAutoTour={startAutoTour}
      />

      {/* Sleek Cockpit Bottom Command Deck */}
      <ModernBottomDeck
        currentPlanet={currentPlanet}
        currentMode={currentMode}
        onChangeMode={mode => {
          if (mode === 'iss') {
            handleChangePlanet('earth');
            setIsISSModalOpen(true);
          } else {
            setCurrentMode(mode);
          }
        }}
        selectedPOI={selectedPOI}
        onSelectPOI={handleSelectPOI}
        onLandOnSurface={() => handleStartLanding(selectedPOI || undefined)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(prev => !prev)}
        showMoons={showMoons}
        onToggleMoons={() => setShowMoons(prev => !prev)}
        showAtmosphere={showAtmosphere}
        onToggleAtmosphere={() => setShowAtmosphere(prev => !prev)}
        onResetView={handleResetView}
        totalMastery={totalMastery}
        onOpenAmericanSpaceModal={() => setIsAmericanSpaceModalOpen(true)}
        spectralLayer={spectralLayer}
        onChangeSpectralLayer={setSpectralLayer}
        sunAngle={sunAngle}
        onChangeSunAngle={setSunAngle}
        isCinematicFlying={isCinematicFlying}
        onToggleCinematicFlying={() => setIsCinematicFlying(prev => !prev)}
      />
    </div>
  );
}
