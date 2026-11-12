import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MarsPOI } from '../types/mars';
import { marsAudio } from '../utils/marsAudio';
import {
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Scan,
  Maximize2,
  Volume2,
  VolumeX,
  Rocket,
  Shield,
  Eye,
  Crosshair,
  Sparkles,
  Info,
  Camera
} from 'lucide-react';
import { createSurfaceRegolithTexture } from '../utils/proceduralMarsTextures';

interface MarsSurfaceFirstPersonProps {
  poi: MarsPOI;
  onReturnToOrbit: () => void;
  onScannedObject?: (objectId: string) => void;
}

interface ScanTarget {
  id: string;
  nameRu: string;
  nameEn: string;
  category: string;
  distance: number;
  position: THREE.Vector3;
  analysisRu: string;
  composition: string;
}

export const MarsSurfaceFirstPerson: React.FC<MarsSurfaceFirstPersonProps> = ({
  poi,
  onReturnToOrbit,
  onScannedObject,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // HUD states
  const [hudMode, setHudMode] = useState<'astronaut' | 'rover'>('astronaut');
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [activeScanTarget, setActiveScanTarget] = useState<ScanTarget | null>(null);
  const [scannedResult, setScannedResult] = useState<ScanTarget | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isWindActive, setIsWindActive] = useState<boolean>(true);

  // Movement input references
  const keys = useRef<{ [key: string]: boolean }>({});
  const touchMovement = useRef<{ forward: number; strafe: number }>({ forward: 0, strafe: 0 });

  // Camera, Renderer & Physics variables
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [photoFlash, setPhotoFlash] = useState<boolean>(false);

  const playerPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.7, 0)); // 1.7m eye level
  const playerVel = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef<boolean>(true);
  const cameraEuler = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0, 'YXZ'));
  const footstepTimer = useRef<number>(0);

  // Scan targets list in the scene
  const scanTargetsRef = useRef<ScanTarget[]>([]);

  // Toggle wind
  const toggleWind = () => {
    const state = marsAudio.toggleWind();
    setIsWindActive(state);
  };

  // Photo snapshot on Mars with commemorative American Space Dushanbe frame
  const takePhoto = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    setPhotoFlash(true);
    marsAudio.playTelemetryPing();

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const canvas = rendererRef.current.domElement;

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = canvas.width;
    snapCanvas.height = canvas.height;
    const sctx = snapCanvas.getContext('2d');
    if (sctx) {
      sctx.drawImage(canvas, 0, 0);

      // Bottom banner overlay
      sctx.fillStyle = 'rgba(8, 12, 22, 0.82)';
      sctx.fillRect(0, snapCanvas.height - 76, snapCanvas.width, 76);

      sctx.font = 'bold 22px "Space Grotesk", sans-serif';
      sctx.fillStyle = '#ef4444';
      sctx.fillText('MARS 3D EXPEDITION', 26, snapCanvas.height - 44);

      sctx.font = '15px sans-serif';
      sctx.fillStyle = '#f59e0b';
      sctx.fillText(`${poi.nameRu} • American Space Dushanbe`, 26, snapCanvas.height - 18);

      sctx.fillStyle = '#94a3b8';
      sctx.textAlign = 'right';
      sctx.fillText(`g: 0.38 | P: 6.1 мбар | NASA Mission Data`, snapCanvas.width - 26, snapCanvas.height - 28);

      const link = document.createElement('a');
      link.download = `Mars_${poi.id}_AmericanSpaceDushanbe.png`;
      link.href = snapCanvas.toDataURL('image/png');
      link.click();
    }

    setTimeout(() => setPhotoFlash(false), 350);
  };

  // Perform scanner action on the nearest target in view
  const triggerScan = () => {
    if (!activeScanTarget || isScanning) return;
    setIsScanning(true);
    marsAudio.playScanner();

    setTimeout(() => {
      setScannedResult(activeScanTarget);
      setIsScanning(false);
      marsAudio.playSuccessChime();
      if (onScannedObject) onScannedObject(activeScanTarget.id);
    }, 600);
  };

  // Player Jump in 0.38g
  const triggerJump = () => {
    if (!isGrounded.current) return;
    isGrounded.current = false;
    setIsJumping(true);
    playerVel.current.y = 5.8; // Low Mars gravity jump velocity
    marsAudio.playJump();
  };

  // 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Start ambient Martian wind on landing
    marsAudio.toggleWind(true);
    setIsWindActive(true);

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
    sceneRef.current = scene;

    // Atmosphere color matching location
    let skyColor = 0xc97a52; // Butterscotch / salmon
    let groundColor = 0xb34d28; // Martian red rust
    let fogDensity = 0.007;

    if (poi.category === 'pole') {
      skyColor = 0xa88e80;
      groundColor = 0xd5dfe5; // Polar ice / frost
      fogDensity = 0.009;
    } else if (poi.id === 'olympus-mons') {
      skyColor = 0x5a2d1d; // Darker rarefied atmosphere at 22km altitude!
      groundColor = 0x4a2e22; // Volcanic basalt
      fogDensity = 0.003;
    } else if (poi.id === 'valles-marineris') {
      skyColor = 0xb86844;
      fogDensity = 0.01;
    }

    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(skyColor, fogDensity);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 500);
    camera.position.set(0, 1.7, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // Needed for screenshot capture
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Sun & Ambient Lighting
    const sunLight = new THREE.DirectionalLight(0xffeedd, 3.2);
    sunLight.position.set(60, 45, 50);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.shadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 150;
      sunLight.shadow.camera.left = -40;
      sunLight.shadow.camera.right = 40;
      sunLight.shadow.camera.top = 40;
      sunLight.shadow.camera.bottom = -40;
    }
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(skyColor, 0x22110c, 0.85);
    scene.add(hemiLight);

    // Distant Martian Sun Sphere in Sky
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sunMesh.position.set(180, 135, 150);
    scene.add(sunMesh);

    // Sun glow ring
    const sunGlow = new THREE.Mesh(
      new THREE.RingGeometry(4, 18, 32),
      new THREE.MeshBasicMaterial({
        color: 0x88ccff, // Blue Martian sunset glow around sun!
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    sunGlow.position.copy(sunMesh.position);
    sunGlow.lookAt(0, 0, 0);
    scene.add(sunGlow);

    // Phobos visible in daytime sky
    const phobosInSky = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.8, 1),
      new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })
    );
    phobosInSky.position.set(-120, 80, -90);
    scene.add(phobosInSky);

    // 1. Procedural 3D Martian Surface Terrain with Craters & Dunes
    const terrainSize = 200;
    const terrainSegments = 120;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);

      // Multi-frequency hill and crater elevation
      const d = Math.sqrt(vx * vx + vz * vz);
      let y = Math.sin(vx * 0.05) * Math.cos(vz * 0.05) * 1.8;
      y += Math.sin(vx * 0.12 + vz * 0.08) * 0.6;
      y += Math.sin(vx * 0.25) * 0.2;

      // Location specific terrain features:
      if (poi.id === 'olympus-mons') {
        // High volcanic caldera slopes
        y += (vx * 0.08 + vz * 0.04);
      } else if (poi.id === 'valles-marineris') {
        // Colossal canyon walls flanking the valley floor
        if (Math.abs(vx) > 35) {
          y += Math.pow((Math.abs(vx) - 35) * 0.45, 1.7);
        }
      } else if (poi.id === 'jezero-crater') {
        // Ancient dried river delta bluffs
        if (vz < -30) {
          y += Math.sin(vx * 0.08) * 2.5 + 4.5;
        }
      }

      // Smooth central landing zone around (0, 0)
      if (d < 16) {
        y *= (d / 16);
      }

      posAttr.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    // High-definition PBR Surface Regolith or Polar Ice Texture
    let groundTex: THREE.CanvasTexture;
    if (poi.category === 'pole') {
      const iceCanvas = document.createElement('canvas');
      iceCanvas.width = 512;
      iceCanvas.height = 512;
      const ictx = iceCanvas.getContext('2d')!;
      ictx.fillStyle = '#e2e8f0';
      ictx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2500; i++) {
        ictx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.5)' : 'rgba(186,215,245,0.35)';
        ictx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 3, Math.random() * 3);
      }
      groundTex = new THREE.CanvasTexture(iceCanvas);
    } else {
      groundTex = createSurfaceRegolithTexture();
    }
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(32, 32);

    const terrainMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: poi.category === 'pole' ? 0.35 : 0.94,
      metalness: poi.category === 'pole' ? 0.2 : 0.05,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);

    // 2. Optimized InstancedMesh for 220 Basalt Boulders & Stones (Single Draw Call)
    const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);
    const rpos = rockGeo.attributes.position;
    for (let j = 0; j < rpos.count; j++) {
      const factor = 1.0 + Math.sin(j * 4.2) * 0.25;
      rpos.setXYZ(j, rpos.getX(j) * factor, rpos.getY(j) * factor * 0.7, rpos.getZ(j) * factor);
    }
    rockGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: poi.category === 'pole' ? 0x94a3b8 : (poi.id === 'olympus-mons' ? 0x221a15 : 0x5c2b18),
      roughness: 0.92,
      metalness: 0.08,
    });

    const rocksCount = 220;
    const instancedRocks = new THREE.InstancedMesh(rockGeo, rockMat, rocksCount);
    instancedRocks.castShadow = !isSoftwareGl;
    instancedRocks.receiveShadow = !isSoftwareGl;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < rocksCount; i++) {
      const angle = (i / rocksCount) * Math.PI * 2 + Math.sin(i * 12.3) * 0.5;
      const dist = 5.5 + (i * 0.36) + Math.sin(i * 4.7) * 3.5;
      const rx = Math.cos(angle) * dist;
      const rz = Math.sin(angle) * dist;
      const scale = 0.25 + Math.abs(Math.sin(i * 7.9)) * 1.5;

      dummy.position.set(rx, scale * 0.38, rz);
      dummy.rotation.set(i * 0.6, i * 1.3, i * 0.7);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      instancedRocks.setMatrixAt(i, dummy.matrix);
    }
    instancedRocks.computeBoundingSphere();
    scene.add(instancedRocks);

    // 3. Special Location Hero Props (Rover, Lander, or Outcrop)
    const scanTargets: ScanTarget[] = [];

    // Main landing feature based on location:
    if (poi.category === 'rover' || poi.id === 'jezero-crater') {
      // 3D Perseverance Rover Prop parked nearby
      const roverGroup = new THREE.Group();
      roverGroup.position.set(10, 0, -8);
      roverGroup.rotation.y = Math.PI / 4;
      scene.add(roverGroup);

      // Chassis
      const roverBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.8, 1.5),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 })
      );
      roverBody.position.y = 1.0;
      roverGroup.add(roverBody);

      // Mast
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 })
      );
      mast.position.set(0.8, 2.0, 0.3);
      roverGroup.add(mast);

      // 6 Wheels
      for (let wx = -0.9; wx <= 0.9; wx += 0.9) {
        for (let wz of [-0.9, 0.9]) {
          const wheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.25, 16),
            new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9 })
          );
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(wx, 0.3, wz);
          roverGroup.add(wheel);
        }
      }

      // Ingenuity Helicopter on a rock mound
      const heli = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.4, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
      );
      heli.position.set(16, 0.3, -4);
      scene.add(heli);

      // Add Rover to Scan Targets
      scanTargets.push({
        id: 'perseverance-rover',
        nameRu: 'Марсоход NASA Perseverance',
        nameEn: 'Perseverance Rover Unit',
        category: 'Аппарат NASA',
        distance: 12,
        position: roverGroup.position.clone(),
        analysisRu: 'Шестиколесный робот NASA исследует дельту кратера Езеро. На борту 43 титановые трубки для забора грунта.',
        composition: 'Алюминий 7075, титан, углепластик, РИТЭГ на плутонии-238'
      });

      scanTargets.push({
        id: 'sample-tube',
        nameRu: 'Титановая капсула с керном породы',
        nameEn: 'Sample Return Titanium Tube',
        category: 'Научный образец',
        distance: 5,
        position: new THREE.Vector3(4, 0.1, -3),
        analysisRu: 'Запечатанный герметичный контейнер с керном речной глины древней дельты реки Неретва. Ждет возврата на Землю!',
        composition: 'Сверхчистый медицинский титан, минералы смектитовой глины'
      });

      // Render physical sample tube on the ground
      const tubeMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.1 })
      );
      tubeMesh.rotation.z = Math.PI / 2;
      tubeMesh.position.set(4, 0.05, -3);
      scene.add(tubeMesh);
    }

    if (poi.id === 'chryse-planitia') {
      // Viking 1 Lander monument
      const vLander = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.4, 0.9, 6),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85 })
      );
      vLander.position.set(0, 0.6, -10);
      scene.add(vLander);

      scanTargets.push({
        id: 'viking-lander',
        nameRu: 'Спускаемый аппарат Viking 1 (1976)',
        nameEn: 'NASA Viking 1 Lander',
        category: 'Исторический модуль',
        distance: 10,
        position: vLander.position.clone(),
        analysisRu: 'Первая успешная станция на поверхности Марса. Передала человечеству первые цветные фото марсианского неба.',
        composition: 'Алюминиево-титановый каркас, ковш-манипулятор, радиоизотопный генератор SNAP-19'
      });
    }

    // Generic Geological scan targets around the landing point
    scanTargets.push({
      id: 'basalt-boulder',
      nameRu: 'Базальтовый валун с оливином',
      nameEn: 'Vesicular Basalt with Olivine',
      category: 'Марсианский минерал',
      distance: 6,
      position: new THREE.Vector3(-5, 0.6, -4),
      analysisRu: 'Пористая вулканическая порода, выброшенная миллиарды лет назад. Содержит зеленоватые кристаллы оливина.',
      composition: 'SiO2 (46%), FeO (18%), Al2O3 (11%), оливин (Mg,Fe)2SiO4'
    });

    scanTargets.push({
      id: 'ferric-regolith',
      nameRu: 'Ржавый реголит (Оксид железа)',
      nameEn: 'Ferric Oxide Dust Layer',
      category: 'Марсианский песок',
      distance: 3,
      position: new THREE.Vector3(2, 0.1, 3),
      analysisRu: 'Тончайшая ржавая пыль, покрывающая весь Марс. Именно она придает планете ярко-красный цвет на земном небе!',
      composition: 'Оксид железа Fe2O3 (магнетит, гематит), сульфаты, перхлораты'
    });

    if (poi.category === 'pole') {
      scanTargets.push({
        id: 'polar-ice',
        nameRu: 'Пласт полярного льда (H2O + CO2)',
        nameEn: 'Polar Water & Dry Ice Slab',
        category: 'Полярный ледник',
        distance: 4,
        position: new THREE.Vector3(-3, 0.2, 5),
        analysisRu: 'Слоистый щит из водяного льда, покрытый сезонной коркой углекислотного инея (сухого льда). Главный источник воды!',
        composition: '90% Водяной лёд (H2O), 10% замерзший CO2'
      });
    }

    scanTargetsRef.current = scanTargets;

    // Place visual marker glow on scan targets
    scanTargets.forEach(target => {
      const marker = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.22, 16),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      marker.rotation.x = -Math.PI / 2;
      marker.position.copy(target.position);
      marker.position.y += 0.05;
      scene.add(marker);
    });

    // 4. Drifting Dust Particles (Martian wind atmospheric effect)
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 80;
      dustPositions[i * 3 + 1] = Math.random() * 14;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xdd7744,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 5. User Input Listeners (Keyboard & Mouse Drag Look)
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        triggerJump();
      }
      if (e.code === 'KeyE') {
        triggerScan();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse / Touch Look Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Don't drag look if clicking on UI button or control
      if ((e.target as HTMLElement).closest('button, input, a')) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      const sensitivity = 0.003;
      cameraEuler.current.y -= dx * sensitivity;
      cameraEuler.current.x -= dy * sensitivity;
      // Clamp pitch to avoid neck snapping
      cameraEuler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, cameraEuler.current.x));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleBlur = () => {
      keys.current = {};
      touchMovement.current = { forward: 0, strafe: 0 };
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('blur', handleBlur);

    // 6. Main Physics & Rendering Loop
    let animId: number;
    const clock = new THREE.Clock();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Orientation update
      camera.quaternion.setFromEuler(cameraEuler.current);

      // Compass calculation
      const headingDeg = Math.round((-cameraEuler.current.y * 180) / Math.PI) % 360;
      setCompassHeading(headingDeg < 0 ? headingDeg + 360 : headingDeg);

      // Movement vectors
      const forwardDir = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, cameraEuler.current.y, 0));
      const rightDir = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, cameraEuler.current.y, 0));

      const moveVec = new THREE.Vector3();
      const moveSpeed = 4.2; // Walking speed

      if (keys.current['KeyW'] || keys.current['ArrowUp']) moveVec.add(forwardDir);
      if (keys.current['KeyS'] || keys.current['ArrowDown']) moveVec.sub(forwardDir);
      if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveVec.sub(rightDir);
      if (keys.current['KeyD'] || keys.current['ArrowRight']) moveVec.add(rightDir);

      // Virtual D-pad touch movement
      if (touchMovement.current.forward !== 0) {
        moveVec.add(forwardDir.clone().multiplyScalar(touchMovement.current.forward));
      }
      if (touchMovement.current.strafe !== 0) {
        moveVec.add(rightDir.clone().multiplyScalar(touchMovement.current.strafe));
      }

      if (moveVec.lengthSq() > 0) {
        moveVec.normalize();
        playerPos.current.x += moveVec.x * moveSpeed * delta;
        playerPos.current.z += moveVec.z * moveSpeed * delta;

        // Periodic footstep audio
        if (isGrounded.current) {
          footstepTimer.current += delta;
          if (footstepTimer.current > 0.45) {
            marsAudio.playFootstep();
            footstepTimer.current = 0;
          }
        }
      }

      // Vertical Gravity Physics (Mars g = 3.72 m/s²)
      const marsGravity = 9.8 * 0.38; // 3.72
      if (!isGrounded.current) {
        playerVel.current.y -= marsGravity * delta;
        playerPos.current.y += playerVel.current.y * delta;

        // Ground collision floor at 1.7m eye level
        if (playerPos.current.y <= 1.7) {
          playerPos.current.y = 1.7;
          playerVel.current.y = 0;
          isGrounded.current = true;
          setIsJumping(false);
          marsAudio.playLanding();
        }
      }

      camera.position.copy(playerPos.current);

      // Drifting Dust Animation
      const dpos = dustParticles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        let x = dpos.getX(i) + delta * 2.5; // Wind blowing east
        let y = dpos.getY(i) - delta * 0.4;
        let z = dpos.getZ(i) + Math.sin(x * 0.1) * 0.05;

        if (x > 40) x = -40;
        if (y < 0) y = 14;

        dpos.setXYZ(i, x, y, z);
      }
      dpos.needsUpdate = true;

      // Check nearest scan target facing player camera
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);

      let closestTarget: ScanTarget | null = null;
      let minDistance = 15; // Max scan reach

      scanTargetsRef.current.forEach(target => {
        const toTarget = target.position.clone().sub(playerPos.current);
        const dist = toTarget.length();
        toTarget.normalize();
        const dot = cameraDir.dot(toTarget);

        // Within 12m and in front of crosshair (dot > 0.85)
        if (dist < minDistance && dot > 0.82) {
          closestTarget = { ...target, distance: Math.round(dist * 10) / 10 };
          minDistance = dist;
        }
      });

      setActiveScanTarget(closestTarget);

      renderer.render(scene, camera);
    };

    loop();

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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [poi]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none text-white bg-black">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Crosshair in Center of Screen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
        <div className={`transition-all duration-200 ${activeScanTarget ? 'scale-125 text-sky-400' : 'text-white/40'}`}>
          <Crosshair className="w-8 h-8 stroke-[1.5]" />
        </div>
        {activeScanTarget && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-sky-950/90 border border-sky-400/80 px-2 py-0.5 rounded text-[10px] font-mono text-sky-300 whitespace-nowrap shadow-lg">
            [E] Сканировать: {activeScanTarget.nameRu.split('(')[0]} ({activeScanTarget.distance}м)
          </div>
        )}
      </div>

      {/* Astronaut Visor Curve Graphic Layer (Optional aesthetic framing) */}
      {hudMode === 'astronaut' && (
        <div className="absolute inset-0 pointer-events-none border-[12px] md:border-[24px] border-black/40 rounded-[3rem] shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] z-10" />
      )}

      {/* Top HUD: Location Info, Compass & Telemetry */}
      <div className="absolute top-4 inset-x-4 md:inset-x-8 z-30 flex items-start justify-between pointer-events-none">
        {/* Left: Location Banner */}
        <div className="bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-red-500/40 pointer-events-auto shadow-2xl max-w-xs md:max-w-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
              Поверхность Марса • {poi.badge}
            </span>
          </div>
          <h2 className="text-base font-black text-white">{poi.nameRu}</h2>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{poi.highlightFactRu}</p>
        </div>

        {/* Center: Compass Heading */}
        <div className="bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/80 pointer-events-auto shadow-xl hidden sm:flex items-center gap-2 text-xs font-mono">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white">
            {compassHeading}°{' '}
            {compassHeading >= 315 || compassHeading < 45
              ? 'N (С)'
              : compassHeading >= 45 && compassHeading < 135
              ? 'E (В)'
              : compassHeading >= 135 && compassHeading < 225
              ? 'S (Ю)'
              : 'W (З)'}
          </span>
          <span className="text-slate-500">| g: 0.38</span>
        </div>

        {/* Right: Return to Orbit Button & HUD mode */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setHudMode(prev => (prev === 'astronaut' ? 'rover' : 'astronaut'))}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            title="Сменить режим шлема (Скафандр / Марсоход)"
          >
            {hudMode === 'astronaut' ? <Shield className="w-4 h-4 text-sky-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
            <span className="hidden md:inline">{hudMode === 'astronaut' ? 'Визор скафандра' : 'Камера ровера'}</span>
          </button>

          <button
            onClick={toggleWind}
            className={`p-2 rounded-xl border transition-all ${
              isWindActive ? 'bg-red-950/80 border-red-500 text-red-300' : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title="Звук ветра на Марсе"
          >
            {isWindActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={takePhoto}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-emerald-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg"
            title="Сделать снимок на память (American Space Dushanbe)"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline text-slate-200">Снимок</span>
          </button>

          <button
            onClick={() => {
              marsAudio.playThruster();
              onReturnToOrbit();
            }}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <Rocket className="w-4 h-4" />
            <span>Взлёт на орбиту 🚀</span>
          </button>
        </div>
      </div>

      {/* Photo Flash Overlay */}
      {photoFlash && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300" />
      )}

      {/* Geological Scan Result Modal Popup */}
      {scannedResult && (
        <div className="absolute top-20 right-4 md:right-8 z-40 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border-2 border-sky-400 shadow-2xl text-slate-100 animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              {scannedResult.category}
            </span>
            <button
              onClick={() => setScannedResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <h3 className="text-base font-bold text-white mb-0.5">{scannedResult.nameRu}</h3>
          <span className="text-[11px] text-slate-400 font-mono block mb-2">{scannedResult.nameEn}</span>

          <p className="text-xs text-slate-200 leading-relaxed mb-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            {scannedResult.analysisRu}
          </p>

          <div className="text-[11px] font-mono text-amber-300 bg-slate-950/60 p-2 rounded border border-slate-800">
            🔬 Химический состав: <br />
            <span className="text-slate-300">{scannedResult.composition}</span>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setScannedResult(null)}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg"
            >
              Принято (+5% к журналу)
            </button>
          </div>
        </div>
      )}

      {/* Bottom HUD: Telemetry Gauges & Mobile On-Screen Movement Controls */}
      <div className="absolute bottom-4 inset-x-4 md:inset-x-8 z-30 flex items-end justify-between pointer-events-none">
        {/* Left: Life Support & Environment Telemetry */}
        <div className="bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 pointer-events-auto shadow-2xl flex items-center gap-3 text-xs font-mono">
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Давление</span>
            <span className="text-amber-400 font-bold">6.1 мбар</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Температура</span>
            <span className="text-sky-300 font-bold">-58°C</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Кислород О2</span>
            <span className="text-emerald-400 font-bold">98% (Скафандр)</span>
          </div>
        </div>

        {/* Center: Interactive Action Buttons (Scan, Jump) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {activeScanTarget && (
            <button
              onClick={triggerScan}
              disabled={isScanning}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl transition-all flex items-center gap-1.5 ${
                isScanning ? 'bg-sky-400 text-slate-950 animate-pulse' : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>{isScanning ? 'Сканирование породы...' : 'Сканировать образец (E)'}</span>
            </button>
          )}

          <button
            onClick={triggerJump}
            disabled={!isGrounded.current}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <ArrowUp className="w-4 h-4" />
            <span>{isJumping ? 'Прыжок 0.38g...' : 'Прыжок (Пробел)'}</span>
          </button>
        </div>

        {/* Right: Mobile On-Screen Virtual Directional Controls */}
        <div className="bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 pointer-events-auto shadow-2xl flex flex-col items-center gap-1">
          <button
            onPointerDown={() => (touchMovement.current.forward = 1)}
            onPointerUp={() => (touchMovement.current.forward = 0)}
            onPointerLeave={() => (touchMovement.current.forward = 0)}
            className="w-8 h-8 rounded-lg bg-slate-800 active:bg-red-600 flex items-center justify-center text-slate-200"
            title="Вперед (W)"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            <button
              onPointerDown={() => (touchMovement.current.strafe = -1)}
              onPointerUp={() => (touchMovement.current.strafe = 0)}
              onPointerLeave={() => (touchMovement.current.strafe = 0)}
              className="w-8 h-8 rounded-lg bg-slate-800 active:bg-red-600 flex items-center justify-center text-slate-200"
              title="Влево (A)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onPointerDown={() => (touchMovement.current.forward = -1)}
              onPointerUp={() => (touchMovement.current.forward = 0)}
              onPointerLeave={() => (touchMovement.current.forward = 0)}
              className="w-8 h-8 rounded-lg bg-slate-800 active:bg-red-600 flex items-center justify-center text-slate-200"
              title="Назад (S)"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onPointerDown={() => (touchMovement.current.strafe = 1)}
              onPointerUp={() => (touchMovement.current.strafe = 0)}
              onPointerLeave={() => (touchMovement.current.strafe = 0)}
              className="w-8 h-8 rounded-lg bg-slate-800 active:bg-red-600 flex items-center justify-center text-slate-200"
              title="Вправо (D)"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Hint banner for Desktop users */}
      <div className="absolute top-20 left-4 z-20 pointer-events-none text-[11px] text-slate-400 bg-slate-950/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 hidden md:block">
        🕹️ Управление: <strong>W, A, S, D</strong> — шаг, <strong>Мышь / Палец</strong> — вращение головой на 360°, <strong>Пробел</strong> — прыжок
      </div>
    </div>
  );
};
