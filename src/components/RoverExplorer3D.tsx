import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ROVER_COMPONENTS } from '../data/marsData';
import { RoverComponent } from '../types/mars';
import { marsAudio } from '../utils/marsAudio';
import { Camera, Compass, Plane, Wrench, Wind, Zap, Play, RotateCcw } from 'lucide-react';

interface RoverExplorer3DProps {
  onInteractTool?: (toolId: string) => void;
}

export const RoverExplorer3D: React.FC<RoverExplorer3DProps> = ({ onInteractTool }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<RoverComponent>(ROVER_COMPONENTS[0]);
  const [isFiringLaser, setIsFiringLaser] = useState(false);
  const [isHelicopterFlying, setIsHelicopterFlying] = useState(false);

  // References for animation
  const mastHeadRef = useRef<THREE.Group | null>(null);
  const armRef = useRef<THREE.Group | null>(null);
  const heliGroupRef = useRef<THREE.Group | null>(null);
  const heliRotorsRef = useRef<THREE.Mesh[]>([]);
  const laserBeamRef = useRef<THREE.Line | null>(null);
  const targetRockRef = useRef<THREE.Mesh | null>(null);

  const handleSelectTool = (tool: RoverComponent) => {
    setSelectedTool(tool);
    marsAudio.playTelemetryPing();
    if (onInteractTool) onInteractTool(tool.id);
  };

  const triggerLaserShot = () => {
    if (isFiringLaser) return;
    setIsFiringLaser(true);
    marsAudio.playLaserScan();
    if (laserBeamRef.current) laserBeamRef.current.visible = true;

    if (onInteractTool) onInteractTool('mastcam-z');

    setTimeout(() => {
      if (laserBeamRef.current) laserBeamRef.current.visible = false;
      setIsFiringLaser(false);
    }, 450);
  };

  const toggleHelicopterFlight = () => {
    setIsHelicopterFlying(prev => !prev);
    marsAudio.playTelemetryPing();
    if (onInteractTool) onInteractTool('ingenuity');
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c14);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.2, 2.2, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = !isSoftwareGl;
    container.appendChild(renderer.domElement);

    // Studio lighting environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const sun = new THREE.DirectionalLight(0xfff0dd, 2.5);
    sun.position.set(5, 8, 4);
    sun.castShadow = !isSoftwareGl;
    scene.add(sun);

    const fillLight = new THREE.HemisphereLight(0xff7744, 0x1a2035, 0.7);
    scene.add(fillLight);

    // Ground: Martian soil platform
    const groundGeo = new THREE.CylinderGeometry(3.5, 3.6, 0.2, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x9b4528,
      roughness: 0.95,
      metalness: 0.05,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.1;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Target rock for laser
    const rockGeo = new THREE.DodecahedronGeometry(0.25, 1);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x4a2e22, roughness: 0.9 });
    const targetRock = new THREE.Mesh(rockGeo, rockMat);
    targetRock.position.set(1.5, 0.12, 1.2);
    targetRock.scale.set(1.4, 0.8, 1.1);
    scene.add(targetRock);
    targetRockRef.current = targetRock;

    // Build Rover (Composite Procedural Group)
    const rover = new THREE.Group();
    scene.add(rover);

    // 1. Main Chassis Body
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.45, 0.85);
    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: 0xcc9933, // Kapton gold foil look
      metalness: 0.85,
      roughness: 0.3,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, goldFoilMat);
    bodyMesh.position.set(0, 0.55, 0);
    bodyMesh.castShadow = !isSoftwareGl;
    rover.add(bodyMesh);

    // Top deck cover (aluminum & solar / instrument deck)
    const deckGeo = new THREE.BoxGeometry(1.24, 0.06, 0.88);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.7, roughness: 0.4 });
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, 0.8, 0);
    rover.add(deckMesh);

    // 2. MMRTG (Nuclear Generator at rear)
    const mmrtgGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 16);
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.35 });
    const mmrtgMesh = new THREE.Mesh(mmrtgGeo, darkMetalMat);
    mmrtgMesh.rotation.z = Math.PI / 2.3;
    mmrtgMesh.position.set(-0.75, 0.65, 0);
    rover.add(mmrtgMesh);

    // 3. High Gain Dish Antenna
    const dishGeo = new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.5, roughness: 0.2, side: THREE.DoubleSide });
    const dishMesh = new THREE.Mesh(dishGeo, dishMat);
    dishMesh.position.set(-0.35, 1.0, 0.25);
    dishMesh.rotation.x = -Math.PI / 2.8;
    rover.add(dishMesh);

    // 4. Remote Sensing Mast & Mastcam head
    const mastPoleGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.75, 12);
    const mastPoleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const mastPole = new THREE.Mesh(mastPoleGeo, mastPoleMat);
    mastPole.position.set(0.45, 1.15, 0.22);
    rover.add(mastPole);

    const mastHead = new THREE.Group();
    mastHead.position.set(0.45, 1.55, 0.22);
    rover.add(mastHead);
    mastHeadRef.current = mastHead;

    // Mastcam camera housing
    const cameraBoxGeo = new THREE.BoxGeometry(0.25, 0.16, 0.18);
    const cameraBoxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 });
    const cameraBox = new THREE.Mesh(cameraBoxGeo, cameraBoxMat);
    mastHead.add(cameraBox);

    // Dual stereo eyes (Mastcam-Z)
    const eyeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const leftEye = new THREE.Mesh(eyeGeo, lensMat);
    leftEye.rotation.x = Math.PI / 2;
    leftEye.position.set(0.07, 0, 0.1);
    cameraBox.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.set(-0.07, 0, 0.1);
    cameraBox.add(rightEye);

    // Laser emitter (SuperCam)
    const laserAperture = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12),
      new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    laserAperture.rotation.x = Math.PI / 2;
    laserAperture.position.set(0, 0.05, 0.1);
    cameraBox.add(laserAperture);

    // Laser line beam
    const laserMat = new THREE.LineBasicMaterial({ color: 0xff1144, linewidth: 3 });
    const laserPoints = [
      new THREE.Vector3(0.45, 1.6, 0.32),
      targetRock.position.clone().add(new THREE.Vector3(0, 0.15, 0)),
    ];
    const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints);
    const laserLine = new THREE.Line(laserGeo, laserMat);
    laserLine.visible = false;
    scene.add(laserLine);
    laserBeamRef.current = laserLine;

    // 5. Robotic Arm
    const arm = new THREE.Group();
    arm.position.set(0.5, 0.65, -0.28);
    rover.add(arm);
    armRef.current = arm;

    const armSegment1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.45, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
    );
    armSegment1.rotation.z = -Math.PI / 3;
    armSegment1.position.set(0.18, -0.05, 0);
    arm.add(armSegment1);

    const armSegment2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
    );
    armSegment2.rotation.z = Math.PI / 4;
    armSegment2.position.set(0.42, -0.22, 0);
    arm.add(armSegment2);

    // Coring Drill Turret at arm end
    const drillTurret = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.18, 12),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
    );
    drillTurret.position.set(0.56, -0.38, 0);
    drillTurret.rotation.x = Math.PI / 2;
    arm.add(drillTurret);

    // 6. Rocker-Bogie Suspension & 6 Wheels
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.9,
      roughness: 0.4,
    });
    const wheelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 24);

    const wheelPositions = [
      [0.65, 0.16, 0.58],  // Front Left
      [0.65, 0.16, -0.58], // Front Right
      [0.0, 0.16, 0.62],   // Middle Left
      [0.0, 0.16, -0.62],  // Middle Right
      [-0.65, 0.16, 0.58], // Rear Left
      [-0.65, 0.16, -0.58] // Rear Right
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = !isSoftwareGl;
      rover.add(wheel);

      // Wheel hubcap
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 })
      );
      cap.rotation.x = Math.PI / 2;
      cap.position.set(pos[0], pos[1], pos[2]);
      rover.add(cap);
    });

    // 7. Ingenuity Mars Helicopter parked on the ground
    const heliGroup = new THREE.Group();
    heliGroup.position.set(1.2, 0.0, -1.0);
    scene.add(heliGroup);
    heliGroupRef.current = heliGroup;

    // Helicopter fuselage box
    const heliBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.18, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 })
    );
    heliBody.position.y = 0.22;
    heliGroup.add(heliBody);

    // 4 carbon legs
    const legMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const legGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.32, 6);
    const legOffsets = [
      [0.1, -0.1],
      [-0.1, -0.1],
      [0.1, 0.1],
      [-0.1, 0.1]
    ];
    legOffsets.forEach(([ox, oz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(ox * 1.3, 0.12, oz * 1.3);
      leg.rotation.z = ox > 0 ? -0.4 : 0.4;
      leg.rotation.x = oz > 0 ? 0.4 : -0.4;
      heliGroup.add(leg);
    });

    // Solar panel top plate
    const solarPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.02, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.9, roughness: 0.1 })
    );
    solarPlate.position.y = 0.52;
    heliGroup.add(solarPlate);

    // Rotor blades (Counter-rotating dual carbon blades)
    const rotorGeo = new THREE.BoxGeometry(0.85, 0.008, 0.06);
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });

    const rotor1 = new THREE.Mesh(rotorGeo, rotorMat);
    rotor1.position.y = 0.42;
    heliGroup.add(rotor1);

    const rotor2 = new THREE.Mesh(rotorGeo, rotorMat);
    rotor2.position.y = 0.47;
    heliGroup.add(rotor2);

    heliRotorsRef.current = [rotor1, rotor2];

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Keep above ground
    controls.target.set(0.2, 0.6, 0);

    // Animation Loop
    let animId: number;
    let heliAltitude = 0;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();
      controls.update();

      // Masthead subtle tracking movement
      if (mastHeadRef.current) {
        mastHeadRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.35;
      }

      // Helicopter flight animation
      if (heliGroupRef.current) {
        if (isHelicopterFlying) {
          heliAltitude = THREE.MathUtils.damp(heliAltitude, 1.4, 3, delta);
          heliRotorsRef.current[0].rotation.y += delta * 35;
          heliRotorsRef.current[1].rotation.y -= delta * 35;
          heliGroupRef.current.position.y = heliAltitude + Math.sin(clock.getElapsedTime() * 3) * 0.05;
          heliGroupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 2) * 0.08;
        } else {
          heliAltitude = THREE.MathUtils.damp(heliAltitude, 0, 4, delta);
          heliGroupRef.current.position.y = heliAltitude;
          heliGroupRef.current.rotation.z = THREE.MathUtils.damp(heliGroupRef.current.rotation.z, 0, 4, delta);
          if (heliAltitude > 0.02) {
            heliRotorsRef.current[0].rotation.y += delta * 15;
            heliRotorsRef.current[1].rotation.y -= delta * 15;
          }
        }
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isHelicopterFlying]);

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row bg-slate-950/90 text-white overflow-hidden rounded-xl border border-slate-800">
      {/* 3D Canvas Viewport */}
      <div className="relative flex-1 h-[320px] md:h-full">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Viewport Action Buttons */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <button
            onClick={triggerLaserShot}
            disabled={isFiringLaser}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg ${
              isFiringLaser
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-red-600/80 hover:bg-red-500 text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isFiringLaser ? 'Выстрел лазером SuperCam!' : 'Выстрелить лазером по камню'}
          </button>

          <button
            onClick={toggleHelicopterFlight}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg ${
              isHelicopterFlying
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-sky-600/80 hover:bg-sky-500 text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            {isHelicopterFlying ? 'Посадить Ingenuity' : 'Запустить вертолёт Ingenuity'}
          </button>
        </div>

        <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-700/50">
          💡 Вращай марсоход мышкой или пальцем, приближай колесом
        </div>
      </div>

      {/* Interactive Tool Sidebar */}
      <div className="w-full md:w-80 md:h-full bg-slate-900/95 border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col overflow-y-auto">
        <div className="mb-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
            NASA Jet Propulsion Laboratory
          </span>
          <h3 className="text-base font-bold text-white mt-1">Инструменты Perseverance</h3>
          <p className="text-xs text-slate-400">Нажимай на детали, чтобы узнать их назначение</p>
        </div>

        {/* Component Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 mb-4">
          {ROVER_COMPONENTS.map(tool => {
            const isSelected = selectedTool.id === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => handleSelectTool(tool)}
                className={`text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between border ${
                  isSelected
                    ? 'bg-red-950/70 border-red-500 text-white font-semibold'
                    : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`p-1 rounded ${isSelected ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {tool.id === 'mastcam-z' && <Camera className="w-3 h-3" />}
                    {tool.id === 'rocker-bogie' && <Compass className="w-3 h-3" />}
                    {tool.id === 'robotic-arm' && <Wrench className="w-3 h-3" />}
                    {tool.id === 'moxie' && <Wind className="w-3 h-3" />}
                    {tool.id === 'ingenuity' && <Plane className="w-3 h-3" />}
                    {tool.id === 'mmrtg' && <Zap className="w-3 h-3" />}
                  </span>
                  <span className="truncate">{tool.nameRu.split('(')[0]}</span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-400 ml-1 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Selected Tool Details Card */}
        <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-700/60 space-y-2.5 mt-auto">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-amber-300">{selectedTool.nameRu}</h4>
            <span className="text-[10px] text-slate-400">{selectedTool.nameEn}</span>
          </div>

          <div className="text-xs text-sky-400 font-medium">
            🎯 {selectedTool.roleRu}
          </div>

          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Простыми словами для юных исследователей:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedTool.kidExplanationRu}
            </p>
          </div>

          <div className="text-[11px] text-slate-400">
            <strong className="text-slate-300">Инженерный факт:</strong> {selectedTool.nasaDetailsRu}
          </div>

          <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800">
            📊 Характеристика: {selectedTool.specMetric}
          </div>
        </div>
      </div>
    </div>
  );
};
