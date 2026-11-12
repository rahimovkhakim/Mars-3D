import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MARS_POIS } from '../data/marsData';
import { EARTH_POIS } from '../data/earthData';
import { MarsPOI } from '../types/mars';
import { PlanetType } from '../types/planetary';
import { marsAudio } from '../utils/marsAudio';
import {
  SpectralLayer,
  createMarsAlbedoTexture,
  createMarsMOLATexture,
  createMarsThermalTexture,
  createMarsMineralTexture,
  createMarsNormalTexture,
  createMarsRoughnessTexture,
  createMarsCloudsTexture,
  createMoonTexture,
  createStarfieldTexture,
  getMarsElevationAt,
  getEarthElevationAt,
  latLonToVector3
} from '../utils/proceduralMarsTextures';
import {
  createRealisticEarthAlbedoTexture,
  createRealisticEarthSpecularTexture,
  createRealisticEarthNightLightsTexture,
  createRealisticEarthCloudsTexture
} from '../utils/earthTextureGenerator';

export interface CursorTelemetry {
  lat: number;
  lon: number;
  elevationKm: number;
  isHovering: boolean;
  planet: PlanetType;
}

interface PlanetaryCanvasProps {
  currentPlanet: PlanetType;
  selectedPOI: MarsPOI | null;
  onSelectPOI: (poi: MarsPOI) => void;
  onSelectISS?: () => void;
  autoRotate: boolean;
  showAtmosphere: boolean;
  showMoons: boolean;
  showPins: boolean;
  spectralLayer: SpectralLayer;
  sunAngle: number;
  isCinematicFlying: boolean;
  onCursorTelemetry?: (telemetry: CursorTelemetry) => void;
}

export const PlanetaryCanvas: React.FC<PlanetaryCanvasProps> = ({
  currentPlanet,
  selectedPOI,
  onSelectPOI,
  onSelectISS,
  autoRotate,
  showAtmosphere,
  showMoons,
  showPins,
  spectralLayer,
  sunAngle,
  isCinematicFlying,
  onCursorTelemetry,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Groups
  const marsGroupRef = useRef<THREE.Group | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Mesh & Material refs
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const marsMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const marsCloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const marsAtmoRef = useRef<THREE.Mesh | null>(null);
  const marsMoonsRef = useRef<THREE.Group | null>(null);
  const marsPinsGroupRef = useRef<THREE.Group | null>(null);

  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const earthCloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const earthAtmoRef = useRef<THREE.Mesh | null>(null);
  const earthMoonRef = useRef<THREE.Group | null>(null);
  const earthPinsGroupRef = useRef<THREE.Group | null>(null);
  const issMeshRef = useRef<THREE.Group | null>(null);

  // Cached textures
  const marsTexturesRef = useRef<Record<SpectralLayer, THREE.CanvasTexture> | null>(null);

  // Camera animation
  const cameraTargetPos = useRef<THREE.Vector3 | null>(null);
  const controlsTargetPos = useRef<THREE.Vector3 | null>(null);
  const isTransitioning = useRef<boolean>(false);

  // Callbacks
  const onSelectPOIRef = useRef(onSelectPOI);
  useEffect(() => {
    onSelectPOIRef.current = onSelectPOI;
  }, [onSelectPOI]);

  const onSelectISSRef = useRef(onSelectISS);
  useEffect(() => {
    onSelectISSRef.current = onSelectISS;
  }, [onSelectISS]);

  const onCursorTelemetryRef = useRef(onCursorTelemetry);
  useEffect(() => {
    onCursorTelemetryRef.current = onCursorTelemetry;
  }, [onCursorTelemetry]);

  // Planet Switch Camera Transition
  useEffect(() => {
    if (!marsGroupRef.current || !earthGroupRef.current || !cameraRef.current || !controlsRef.current) return;

    marsAudio.playInterplanetaryWarp();

    if (currentPlanet === 'mars') {
      marsGroupRef.current.visible = true;
      earthGroupRef.current.visible = false;
    } else {
      marsGroupRef.current.visible = false;
      earthGroupRef.current.visible = true;
    }

    // Reset camera to grand overview
    cameraTargetPos.current = new THREE.Vector3(0, 1.8, 8.8);
    controlsTargetPos.current = new THREE.Vector3(0, 0, 0);
    isTransitioning.current = true;
  }, [currentPlanet]);

  // Focus on selected POI
  useEffect(() => {
    if (!selectedPOI || !cameraRef.current || !controlsRef.current) return;

    const surfacePos = latLonToVector3(selectedPOI.lat, selectedPOI.lon, 3.0);
    const dir = surfacePos.clone().normalize();
    const targetCam = dir.clone().multiplyScalar(5.2);

    cameraTargetPos.current = targetCam;
    controlsTargetPos.current = surfacePos.clone().multiplyScalar(0.4);
    isTransitioning.current = true;
  }, [selectedPOI]);

  // Controls Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate && !isCinematicFlying;
      controlsRef.current.autoRotateSpeed = 0.5;
    }
  }, [autoRotate, isCinematicFlying]);

  // Atmosphere Visibility
  useEffect(() => {
    if (marsCloudsMeshRef.current && marsAtmoRef.current) {
      marsCloudsMeshRef.current.visible = showAtmosphere;
      marsAtmoRef.current.visible = showAtmosphere;
    }
    if (earthCloudsMeshRef.current && earthAtmoRef.current) {
      earthCloudsMeshRef.current.visible = showAtmosphere;
      earthAtmoRef.current.visible = showAtmosphere;
    }
  }, [showAtmosphere]);

  // Moons & Satellites Visibility
  useEffect(() => {
    if (marsMoonsRef.current) {
      marsMoonsRef.current.visible = showMoons;
    }
    if (earthMoonRef.current) {
      earthMoonRef.current.visible = showMoons;
    }
    if (issMeshRef.current) {
      issMeshRef.current.visible = showMoons;
    }
  }, [showMoons]);

  // Pins Visibility
  useEffect(() => {
    if (marsPinsGroupRef.current) {
      marsPinsGroupRef.current.visible = showPins;
    }
    if (earthPinsGroupRef.current) {
      earthPinsGroupRef.current.visible = showPins;
    }
  }, [showPins]);

  // Sun Lighting Angle
  useEffect(() => {
    if (!sunLightRef.current) return;
    const rad = (sunAngle * Math.PI) / 180;
    const dist = 32;
    sunLightRef.current.position.set(Math.cos(rad) * dist, 10, Math.sin(rad) * dist);
  }, [sunAngle]);

  // Switch Spectral Layer Material Map (for Mars)
  useEffect(() => {
    if (!marsMatRef.current || !marsTexturesRef.current) return;
    const newMap = marsTexturesRef.current[spectralLayer];
    if (newMap) {
      marsMatRef.current.map = newMap;
      if (spectralLayer === 'mola-elevation' || spectralLayer === 'themis-thermal' || spectralLayer === 'crism-mineralogy') {
        marsMatRef.current.emissive = new THREE.Color(0x33333e);
        marsMatRef.current.emissiveMap = newMap;
        marsMatRef.current.emissiveIntensity = 0.4;
      } else {
        marsMatRef.current.emissive = new THREE.Color(0x000000);
        marsMatRef.current.emissiveMap = null;
        marsMatRef.current.emissiveIntensity = 0.0;
      }
      marsMatRef.current.needsUpdate = true;
    }
  }, [spectralLayer]);

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

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 8.8);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = roomEnv;
    pmremGenerator.dispose();

    // 4. Cosmic Starfield Background
    const starfieldTexture = createStarfieldTexture();
    const starfieldGeo = new THREE.SphereGeometry(120, 32, 32);
    const starfieldMat = new THREE.MeshBasicMaterial({
      map: starfieldTexture,
      side: THREE.BackSide,
    });
    const starfieldMesh = new THREE.Mesh(starfieldGeo, starfieldMat);
    scene.add(starfieldMesh);

    // 5. Directional Sun Key Light + Ambient Light
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 3.0);
    const rad = (sunAngle * Math.PI) / 180;
    sunLight.position.set(Math.cos(rad) * 32, 10, Math.sin(rad) * 32);
    sunLight.castShadow = !isSoftwareGl;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const hemiLight = new THREE.HemisphereLight(0xffeedd, 0x11162b, 0.55);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x4466aa, 0.65);
    rimLight.position.set(-14, -6, -10);
    scene.add(rimLight);

    // ==========================================
    // 6. PLANET MARS GROUP
    // ==========================================
    const marsGroup = new THREE.Group();
    scene.add(marsGroup);
    marsGroupRef.current = marsGroup;

    // Cache Mars spectral textures
    const marsAlbedoTex = createMarsAlbedoTexture(true);
    const marsMolaTex = createMarsMOLATexture(true);
    const marsThermalTex = createMarsThermalTexture(true);
    const marsMineralTex = createMarsMineralTexture(true);
    marsTexturesRef.current = {
      'true-color': marsAlbedoTex,
      'mola-elevation': marsMolaTex,
      'themis-thermal': marsThermalTex,
      'crism-mineralogy': marsMineralTex,
    };

    const marsNormalTex = createMarsNormalTexture(true);
    const marsRoughnessTex = createMarsRoughnessTexture();

    const marsGeo = new THREE.SphereGeometry(3.0, 128, 128);
    const marsMat = new THREE.MeshStandardMaterial({
      map: marsTexturesRef.current[spectralLayer] || marsAlbedoTex,
      normalMap: marsNormalTex,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: marsRoughnessTex,
      roughness: 0.85,
      metalness: 0.06,
    });
    marsMatRef.current = marsMat;

    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    marsGroup.add(marsMesh);
    marsMeshRef.current = marsMesh;

    // Mars Clouds
    const marsCloudsTex = createMarsCloudsTexture();
    const marsCloudsGeo = new THREE.SphereGeometry(3.028, 96, 96);
    const marsCloudsMat = new THREE.MeshStandardMaterial({
      map: marsCloudsTex,
      transparent: true,
      opacity: 0.38,
      blending: THREE.NormalBlending,
      roughness: 1.0,
      depthWrite: false,
    });
    const marsCloudsMesh = new THREE.Mesh(marsCloudsGeo, marsCloudsMat);
    marsGroup.add(marsCloudsMesh);
    marsCloudsMeshRef.current = marsCloudsMesh;

    // Mars Atmosphere Glow Shell (Peach/Cyan)
    const marsAtmoGeo = new THREE.SphereGeometry(3.12, 64, 64);
    const marsAtmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
          float intensity = pow(fresnel, 3.2) * 0.95;
          vec3 innerColor = vec3(0.96, 0.54, 0.35);
          vec3 outerColor = vec3(0.38, 0.65, 0.95);
          vec3 atmoColor = mix(innerColor, outerColor, pow(fresnel, 2.2));
          gl_FragColor = vec4(atmoColor, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const marsAtmoMesh = new THREE.Mesh(marsAtmoGeo, marsAtmoMat);
    marsGroup.add(marsAtmoMesh);
    marsAtmoRef.current = marsAtmoMesh;

    // Mars Moons (Phobos & Deimos)
    const marsMoonsGroup = new THREE.Group();
    marsGroup.add(marsMoonsGroup);
    marsMoonsRef.current = marsMoonsGroup;

    const phobosTex = createMoonTexture(101);
    const phobosGeo = new THREE.DodecahedronGeometry(0.12, 2);
    const phobosPos = phobosGeo.attributes.position;
    for (let i = 0; i < phobosPos.count; i++) {
      const vx = phobosPos.getX(i);
      const vy = phobosPos.getY(i);
      const vz = phobosPos.getZ(i);
      const deform = 1.0 + Math.sin(vx * 15 + vy * 12) * 0.15;
      phobosPos.setXYZ(i, vx * deform, vy * 0.85 * deform, vz * deform);
    }
    phobosGeo.computeVertexNormals();

    const phobosMesh = new THREE.Mesh(phobosGeo, new THREE.MeshStandardMaterial({ map: phobosTex, roughness: 0.95 }));
    marsMoonsGroup.add(phobosMesh);

    const deimosTex = createMoonTexture(202);
    const deimosGeo = new THREE.DodecahedronGeometry(0.07, 2);
    const deimosMesh = new THREE.Mesh(deimosGeo, new THREE.MeshStandardMaterial({ map: deimosTex, roughness: 0.95 }));
    marsMoonsGroup.add(deimosMesh);

    // Mars POI Pins
    const marsPinsGroup = new THREE.Group();
    marsGroup.add(marsPinsGroup);
    marsPinsGroupRef.current = marsPinsGroup;

    const pinShaftGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8);
    const pinHeadGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const pinRingGeo = new THREE.RingGeometry(0.045, 0.065, 24);

    const marsPinMeshes: THREE.Group[] = [];

    MARS_POIS.forEach(poi => {
      const pinObj = new THREE.Group();
      pinObj.userData = { poiId: poi.id, poi };

      const surfacePoint = latLonToVector3(poi.lat, poi.lon, 3.0);
      pinObj.position.copy(surfacePoint);
      pinObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfacePoint.clone().normalize());

      let pinColor = 0xffffff;
      if (poi.category === 'rover') pinColor = 0x38bdf8;
      else if (poi.category === 'volcano') pinColor = 0xf97316;
      else if (poi.category === 'canyon') pinColor = 0xeab308;
      else if (poi.category === 'pole') pinColor = 0xa5f3fc;
      else if (poi.category === 'crater') pinColor = 0xec4899;

      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const glowMat = new THREE.MeshBasicMaterial({ color: pinColor, transparent: true, opacity: 0.8, side: THREE.DoubleSide });

      const stem = new THREE.Mesh(pinShaftGeo, pinMat);
      stem.position.y = 0.09;
      pinObj.add(stem);

      const head = new THREE.Mesh(pinHeadGeo, pinMat);
      head.position.y = 0.19;
      pinObj.add(head);

      const ring = new THREE.Mesh(pinRingGeo, glowMat);
      ring.position.y = 0.2;
      ring.rotation.x = Math.PI / 2;
      pinObj.add(ring);

      marsPinsGroup.add(pinObj);
      marsPinMeshes.push(pinObj);
    });

    // ==========================================
    // 7. PLANET EARTH GROUP
    // ==========================================
    const earthGroup = new THREE.Group();
    earthGroup.visible = false; // Initially hidden if Mars is active
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // Earth Textures: High-Fidelity 4K Blue Marble Albedo, Night Lights, Clouds, Specular
    const earthAlbedoTex = createRealisticEarthAlbedoTexture(2048, 1024);
    const earthNightTex = createRealisticEarthNightLightsTexture(2048, 1024);
    const earthCloudsTex = createRealisticEarthCloudsTexture(2048, 1024);
    const earthSpecularTex = createRealisticEarthSpecularTexture(1024, 512);

    const earthGeo = new THREE.SphereGeometry(3.0, 128, 128);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthAlbedoTex,
      roughnessMap: earthSpecularTex,
      roughness: 0.72,
      metalness: 0.08,
      emissive: new THREE.Color(0xffe288),
      emissiveMap: earthNightTex,
      emissiveIntensity: 0.82,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Earth Dynamic Cloud Layer (swirling storm fronts and trade winds)
    const earthCloudsGeo = new THREE.SphereGeometry(3.028, 96, 96);
    const earthCloudsMat = new THREE.MeshStandardMaterial({
      map: earthCloudsTex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
      roughness: 0.95,
      depthWrite: false,
    });
    const earthCloudsMesh = new THREE.Mesh(earthCloudsGeo, earthCloudsMat);
    earthGroup.add(earthCloudsMesh);
    earthCloudsMeshRef.current = earthCloudsMesh;

    // Earth Atmosphere Glow Shell: Photorealistic Rayleigh scattering (azure inner limb to electric cyan space halo)
    const earthAtmoGeo = new THREE.SphereGeometry(3.14, 64, 64);
    const earthAtmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
          float intensity = pow(fresnel, 3.4) * 1.25;
          // Inner azure sea limb transitioning to electric blue space boundary
          vec3 innerColor = vec3(0.18, 0.58, 1.0);
          vec3 outerColor = vec3(0.65, 0.88, 1.0);
          vec3 atmoColor = mix(innerColor, outerColor, pow(fresnel, 2.0));
          gl_FragColor = vec4(atmoColor, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const earthAtmoMesh = new THREE.Mesh(earthAtmoGeo, earthAtmoMat);
    earthGroup.add(earthAtmoMesh);
    earthAtmoRef.current = earthAtmoMesh;

    // Earth Moon
    const earthMoonGroup = new THREE.Group();
    earthGroup.add(earthMoonGroup);
    earthMoonRef.current = earthMoonGroup;

    const lunarTex = createMoonTexture(303);
    const lunarGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const lunarMesh = new THREE.Mesh(lunarGeo, new THREE.MeshStandardMaterial({ map: lunarTex, roughness: 0.95 }));
    earthMoonGroup.add(lunarMesh);

    // ==========================================
    // 8. ISS (International Space Station) in Low Earth Orbit
    // ==========================================
    const issGroup = new THREE.Group();
    issGroup.userData = { isISS: true };
    earthGroup.add(issGroup);
    issMeshRef.current = issGroup;

    // Central pressurized habitat cylinders
    const moduleMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.8, roughness: 0.2 });
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.3 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.3, roughness: 0.4, emissive: 0xb45309, emissiveIntensity: 0.25 });

    const centerModule = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 12), moduleMat);
    centerModule.rotation.z = Math.PI / 2;
    issGroup.add(centerModule);

    // Main integrated truss structure
    const truss = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.02, 0.02), trussMat);
    issGroup.add(truss);

    // 4 Dual Solar Array Wings (Bronze / Gold)
    const wingGeo = new THREE.BoxGeometry(0.12, 0.28, 0.005);
    [-0.24, -0.15, 0.15, 0.24].forEach(xOffset => {
      const wingTop = new THREE.Mesh(wingGeo, solarMat);
      wingTop.position.set(xOffset, 0.16, 0);
      issGroup.add(wingTop);

      const wingBottom = new THREE.Mesh(wingGeo, solarMat);
      wingBottom.position.set(xOffset, -0.16, 0);
      issGroup.add(wingBottom);
    });

    // ISS Radar Beacon Sphere
    const beaconGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    issGroup.add(beacon);

    // Earth POI Pins (American Space Dushanbe, Baikonur, KSC, Everest, Mariana Trench, etc.)
    const earthPinsGroup = new THREE.Group();
    earthGroup.add(earthPinsGroup);
    earthPinsGroupRef.current = earthPinsGroup;

    const earthPinMeshes: THREE.Group[] = [];

    EARTH_POIS.forEach(poi => {
      const pinObj = new THREE.Group();
      pinObj.userData = { poiId: poi.id, poi };

      const surfacePoint = latLonToVector3(poi.lat, poi.lon, 3.0);
      pinObj.position.copy(surfacePoint);
      pinObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfacePoint.clone().normalize());

      let pinColor = 0x38bdf8;
      if (poi.category === 'spaceport') pinColor = 0xf59e0b; // Amber
      else if (poi.category === 'observatory') pinColor = 0x10b981; // Emerald
      else if (poi.category === 'mountain') pinColor = 0xec4899; // Pink
      else if (poi.category === 'ocean') pinColor = 0x06b6d4; // Cyan

      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const glowMat = new THREE.MeshBasicMaterial({ color: pinColor, transparent: true, opacity: 0.85, side: THREE.DoubleSide });

      const stem = new THREE.Mesh(pinShaftGeo, pinMat);
      stem.position.y = 0.09;
      pinObj.add(stem);

      const head = new THREE.Mesh(pinHeadGeo, pinMat);
      head.position.y = 0.19;
      pinObj.add(head);

      const ring = new THREE.Mesh(pinRingGeo, glowMat);
      ring.position.y = 0.2;
      ring.rotation.x = Math.PI / 2;
      pinObj.add(ring);

      earthPinsGroup.add(pinObj);
      earthPinMeshes.push(pinObj);
    });

    // Initial Planet Visibility
    marsGroup.visible = currentPlanet === 'mars';
    earthGroup.visible = currentPlanet === 'earth';

    // 9. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.6;
    controls.maxDistance = 25.0;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isTransitioning.current = false;
      cameraTargetPos.current = null;
      controlsTargetPos.current = null;
    });

    // 10. Pointer Interaction & Raycasting (Pins + ISS + Sub-cursor Telemetry)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStartX = 0;
    let pointerStartY = 0;

    const handlePointerDown = (event: PointerEvent) => {
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
    };

    const handlePointerUp = (event: PointerEvent) => {
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;
      if (Math.hypot(dx, dy) > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      // Check ISS click
      if (earthGroup.visible && issGroup) {
        const issHits = raycaster.intersectObjects(issGroup.children, true);
        if (issHits.length > 0) {
          marsAudio.playTelemetryPing();
          onSelectISSRef.current?.();
          return;
        }
      }

      // Check Pins click
      const activePins = currentPlanet === 'mars' ? marsPinMeshes : earthPinMeshes;
      const pinHits = raycaster.intersectObjects(activePins, true);
      if (pinHits.length > 0) {
        let curr: THREE.Object3D | null = pinHits[0].object;
        while (curr && !curr.userData.poi) {
          curr = curr.parent;
        }
        if (curr && curr.userData.poi) {
          marsAudio.playTelemetryPing();
          onSelectPOIRef.current(curr.userData.poi);
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const targetMesh = currentPlanet === 'mars' ? marsMesh : earthMesh;
      const hits = raycaster.intersectObject(targetMesh);

      if (hits.length > 0) {
        const localPt = targetMesh.worldToLocal(hits[0].point.clone());
        const r = localPt.length();
        const latRad = Math.asin(Math.max(-1, Math.min(1, localPt.y / r)));
        const lat = latRad * (180 / Math.PI);
        const theta = Math.atan2(localPt.z, -localPt.x);
        let lon = theta * (180 / Math.PI) - 180;
        if (lon < -180) lon += 360;
        if (lon > 180) lon -= 360;

        const elevKm = currentPlanet === 'mars' ? getMarsElevationAt(lat, lon) : getEarthElevationAt(lat, lon);

        onCursorTelemetryRef.current?.({
          lat: Math.round(lat * 10) / 10,
          lon: Math.round(lon * 10) / 10,
          elevationKm: elevKm,
          isHovering: true,
          planet: currentPlanet,
        });
      } else {
        onCursorTelemetryRef.current?.({
          lat: 0,
          lon: 0,
          elevationKm: 0,
          isHovering: false,
          planet: currentPlanet,
        });
      }
    };

    const handlePointerLeave = () => {
      onCursorTelemetryRef.current?.({
        lat: 0,
        lon: 0,
        elevationKm: 0,
        isHovering: false,
        planet: currentPlanet,
      });
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);

    // 11. Render Loop
    let animationFrameId: number;
    let phobosAngle = 0;
    let deimosAngle = Math.PI / 3;
    let lunarAngle = 0;
    let issAngle = 0;
    let pulseTime = 0;

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Atmospheric Clouds Rotation
      if (marsCloudsMesh) marsCloudsMesh.rotation.y += 0.0004;
      if (earthCloudsMesh) earthCloudsMesh.rotation.y += 0.0006;

      // Mars Moons orbits
      phobosAngle += delta * 0.45;
      deimosAngle += delta * 0.18;

      phobosMesh.position.set(Math.cos(phobosAngle) * 5.2, Math.sin(phobosAngle * 0.3) * 0.6, Math.sin(phobosAngle) * 5.2);
      phobosMesh.rotation.y += delta * 0.5;

      deimosMesh.position.set(Math.cos(deimosAngle) * 8.4, Math.cos(deimosAngle * 0.2) * 1.1, Math.sin(deimosAngle) * 8.4);
      deimosMesh.rotation.y += delta * 0.3;

      // Earth Moon orbit
      lunarAngle += delta * 0.12;
      lunarMesh.position.set(Math.cos(lunarAngle) * 7.2, Math.sin(lunarAngle * 0.25) * 1.4, Math.sin(lunarAngle) * 7.2);
      lunarMesh.rotation.y += delta * 0.15;

      // ISS Space Station Low Earth Orbit (~90 min period)
      issAngle += delta * 0.48;
      const issDist = 3.42;
      const issInclination = 51.6 * (Math.PI / 180); // Real ISS 51.6° orbital inclination!
      issGroup.position.set(
        Math.cos(issAngle) * issDist,
        Math.sin(issAngle) * Math.sin(issInclination) * issDist,
        Math.sin(issAngle) * Math.cos(issInclination) * issDist
      );
      issGroup.lookAt(0, 0, 0); // ISS keeps bottom oriented toward Earth (nadir)

      // Pulse pin beacons
      pulseTime += delta * 4;
      const activePins = currentPlanet === 'mars' ? marsPinMeshes : earthPinMeshes;
      activePins.forEach((pin, i) => {
        const ring = pin.children[2] as THREE.Mesh;
        if (ring) {
          const s = 1.0 + Math.sin(pulseTime + i * 0.8) * 0.25;
          ring.scale.set(s, s, 1);
        }
      });

      // Cinematic Camera Fly-over
      if (isCinematicFlying) {
        const speed = 0.18;
        const radius = selectedPOI ? 5.6 : 8.8;
        const targetLook = selectedPOI
          ? latLonToVector3(selectedPOI.lat, selectedPOI.lon, 3.0).multiplyScalar(0.4)
          : new THREE.Vector3(0, 0, 0);

        const camX = Math.cos(elapsed * speed) * radius;
        const camZ = Math.sin(elapsed * speed) * radius;
        const camY = Math.sin(elapsed * speed * 0.6) * 1.8 + 1.2;

        camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 2.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 2.2, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 2.2, delta);
        controls.target.lerp(targetLook, 0.05);
      } else {
        controls.update();

        // Standard smooth camera transitions
        if (isTransitioning.current && cameraTargetPos.current && controlsTargetPos.current) {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraTargetPos.current.x, 3.2, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraTargetPos.current.y, 3.2, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTargetPos.current.z, 3.2, delta);

          controls.target.x = THREE.MathUtils.damp(controls.target.x, controlsTargetPos.current.x, 3.2, delta);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, controlsTargetPos.current.y, 3.2, delta);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, controlsTargetPos.current.z, 3.2, delta);

          if (camera.position.distanceTo(cameraTargetPos.current) < 0.05) {
            isTransitioning.current = false;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Responsive Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);

      controls.dispose();
      renderer.dispose();

      // Dispose geometries & textures
      marsGeo.dispose();
      marsMat.dispose();
      marsAlbedoTex.dispose();
      marsMolaTex.dispose();
      marsThermalTex.dispose();
      marsMineralTex.dispose();
      marsNormalTex.dispose();
      marsRoughnessTex.dispose();
      marsCloudsTex.dispose();
      marsCloudsGeo.dispose();
      marsCloudsMat.dispose();
      marsAtmoGeo.dispose();
      marsAtmoMat.dispose();

      earthGeo.dispose();
      earthMat.dispose();
      earthAlbedoTex.dispose();
      earthNightTex.dispose();
      earthCloudsTex.dispose();
      earthSpecularTex.dispose();
      earthCloudsGeo.dispose();
      earthCloudsMat.dispose();
      earthAtmoGeo.dispose();
      earthAtmoMat.dispose();

      starfieldGeo.dispose();
      starfieldMat.dispose();
      starfieldTexture.dispose();

      phobosGeo.dispose();
      deimosGeo.dispose();
      lunarGeo.dispose();

      pinShaftGeo.dispose();
      pinHeadGeo.dispose();
      pinRingGeo.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />;
};
