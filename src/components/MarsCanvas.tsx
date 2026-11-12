import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MARS_POIS } from '../data/marsData';
import { MarsPOI } from '../types/mars';
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
  latLonToVector3
} from '../utils/proceduralMarsTextures';

export interface CursorTelemetry {
  lat: number;
  lon: number;
  elevationKm: number;
  isHovering: boolean;
}

interface MarsCanvasProps {
  selectedPOI: MarsPOI | null;
  onSelectPOI: (poi: MarsPOI) => void;
  autoRotate: boolean;
  showAtmosphere: boolean;
  showMoons: boolean;
  showPins: boolean;
  spectralLayer: SpectralLayer;
  sunAngle: number;
  isCinematicFlying: boolean;
  onCursorTelemetry?: (telemetry: CursorTelemetry) => void;
}

export const MarsCanvas: React.FC<MarsCanvasProps> = ({
  selectedPOI,
  onSelectPOI,
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

  // Store mutable references
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const marsMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const moonsGroupRef = useRef<THREE.Group | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Cached multispectral textures
  const texturesRef = useRef<Record<SpectralLayer, THREE.CanvasTexture> | null>(null);

  // Camera animation targets
  const cameraTargetPos = useRef<THREE.Vector3 | null>(null);
  const controlsTargetPos = useRef<THREE.Vector3 | null>(null);
  const isTransitioning = useRef<boolean>(false);

  // Callbacks ref to avoid stale closures
  const onSelectPOIRef = useRef(onSelectPOI);
  useEffect(() => {
    onSelectPOIRef.current = onSelectPOI;
  }, [onSelectPOI]);

  const onCursorTelemetryRef = useRef(onCursorTelemetry);
  useEffect(() => {
    onCursorTelemetryRef.current = onCursorTelemetry;
  }, [onCursorTelemetry]);

  // Handle selectedPOI camera fly-to transition
  useEffect(() => {
    if (!selectedPOI || !cameraRef.current || !controlsRef.current) return;

    const surfacePos = latLonToVector3(selectedPOI.lat, selectedPOI.lon, 3.0);
    const dir = surfacePos.clone().normalize();
    const targetCam = dir.clone().multiplyScalar(5.2);

    cameraTargetPos.current = targetCam;
    controlsTargetPos.current = surfacePos.clone().multiplyScalar(0.4);
    isTransitioning.current = true;
  }, [selectedPOI]);

  // Update visual flags
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate && !isCinematicFlying;
      controlsRef.current.autoRotateSpeed = 0.5;
    }
  }, [autoRotate, isCinematicFlying]);

  useEffect(() => {
    if (cloudsMeshRef.current && atmosphereRef.current) {
      cloudsMeshRef.current.visible = showAtmosphere;
      atmosphereRef.current.visible = showAtmosphere;
    }
  }, [showAtmosphere]);

  useEffect(() => {
    if (moonsGroupRef.current) {
      moonsGroupRef.current.visible = showMoons;
    }
  }, [showMoons]);

  useEffect(() => {
    if (pinsGroupRef.current) {
      pinsGroupRef.current.visible = showPins;
    }
  }, [showPins]);

  // Update Sun Directional Light Position from sunAngle
  useEffect(() => {
    if (!sunLightRef.current) return;
    const rad = (sunAngle * Math.PI) / 180;
    const dist = 30;
    sunLightRef.current.position.set(Math.cos(rad) * dist, 10, Math.sin(rad) * dist);
  }, [sunAngle]);

  // Switch Spectral Layer Material Map
  useEffect(() => {
    if (!marsMatRef.current || !texturesRef.current) return;
    const newMap = texturesRef.current[spectralLayer];
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

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 9.0);
    cameraRef.current = camera;

    // 2. WebGL Renderer with preserveDrawingBuffer for high-res screenshots
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
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = roomEnv;
    pmremGenerator.dispose();

    // 4. Starfield Cosmic Skybox
    const starfieldTexture = createStarfieldTexture();
    const starfieldGeo = new THREE.SphereGeometry(120, 32, 32);
    const starfieldMat = new THREE.MeshBasicMaterial({
      map: starfieldTexture,
      side: THREE.BackSide,
    });
    const starfieldMesh = new THREE.Mesh(starfieldGeo, starfieldMat);
    scene.add(starfieldMesh);

    // 5. Lighting: Dynamic Sun Key Light + Ambient Hemisphere
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.85);
    const rad = (sunAngle * Math.PI) / 180;
    sunLight.position.set(Math.cos(rad) * 30, 10, Math.sin(rad) * 30);
    sunLight.castShadow = !isSoftwareGl;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const hemiLight = new THREE.HemisphereLight(0xff8855, 0x11162b, 0.6);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x4466aa, 0.7);
    rimLight.position.set(-14, -6, -10);
    scene.add(rimLight);

    // 6. Preload and Cache all 4 Multispectral Textures
    const albedoTex = createMarsAlbedoTexture(true); // 4K Albedo
    const molaTex = createMarsMOLATexture(true); // NASA Laser Altimeter scale
    const thermalTex = createMarsThermalTexture(true); // THEMIS Thermal Inertia
    const mineralTex = createMarsMineralTexture(true); // CRISM Spectral Mineralogy

    texturesRef.current = {
      'true-color': albedoTex,
      'mola-elevation': molaTex,
      'themis-thermal': thermalTex,
      'crism-mineralogy': mineralTex,
    };

    const normalTex = createMarsNormalTexture(true);
    const roughnessTex = createMarsRoughnessTexture();

    // 7. Mars Mesh with High-Detail 128x128 Geometry
    const marsGeo = new THREE.SphereGeometry(3.0, 128, 128);
    const marsMat = new THREE.MeshStandardMaterial({
      map: texturesRef.current[spectralLayer] || albedoTex,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: roughnessTex,
      roughness: 0.85,
      metalness: 0.06,
    });
    marsMatRef.current = marsMat;

    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    scene.add(marsMesh);
    marsMeshRef.current = marsMesh;

    // 8. Atmospheric clouds and dust haze layer
    const cloudsTex = createMarsCloudsTexture();
    const cloudsGeo = new THREE.SphereGeometry(3.028, 96, 96);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.38,
      blending: THREE.NormalBlending,
      roughness: 1.0,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 9. Rayleigh limb scattering atmospheric glow shell
    const atmoGeo = new THREE.SphereGeometry(3.12, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
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
    const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosphereMesh);
    atmosphereRef.current = atmosphereMesh;

    // 10. Moons: Phobos & Deimos
    const moonsGroup = new THREE.Group();
    scene.add(moonsGroup);
    moonsGroupRef.current = moonsGroup;

    // Phobos (craggy potato asteroid)
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

    const phobosMat = new THREE.MeshStandardMaterial({
      map: phobosTex,
      roughness: 0.95,
      metalness: 0.05,
    });
    const phobosMesh = new THREE.Mesh(phobosGeo, phobosMat);
    moonsGroup.add(phobosMesh);

    // Deimos
    const deimosTex = createMoonTexture(202);
    const deimosGeo = new THREE.DodecahedronGeometry(0.07, 2);
    const deimosMat = new THREE.MeshStandardMaterial({
      map: deimosTex,
      roughness: 0.95,
      metalness: 0.05,
    });
    const deimosMesh = new THREE.Mesh(deimosGeo, deimosMat);
    moonsGroup.add(deimosMesh);

    // 11. 3D Interactive POI Pins
    const pinsGroup = new THREE.Group();
    scene.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    const pinShaftGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8);
    const pinHeadGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const pinRingGeo = new THREE.RingGeometry(0.045, 0.065, 24);

    const pinMeshes: THREE.Group[] = [];

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
      const glowMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });

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

      pinsGroup.add(pinObj);
      pinMeshes.push(pinObj);
    });

    // 12. OrbitControls
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

    // 13. Raycasting for Pins & Sub-Cursor Real-Time Telemetry
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

      const intersects = raycaster.intersectObjects(pinMeshes, true);
      if (intersects.length > 0) {
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && !curr.userData.poi) {
          curr = curr.parent;
        }
        if (curr && curr.userData.poi) {
          marsAudio.playTelemetryPing();
          onSelectPOIRef.current(curr.userData.poi);
        }
      }
    };

    // Sub-cursor hover telemetry tracking
    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(marsMesh);

      if (hits.length > 0) {
        const localPt = marsMesh.worldToLocal(hits[0].point.clone());
        const r = localPt.length();
        const latRad = Math.asin(Math.max(-1, Math.min(1, localPt.y / r)));
        const lat = latRad * (180 / Math.PI);
        const theta = Math.atan2(localPt.z, -localPt.x);
        let lon = theta * (180 / Math.PI) - 180;
        if (lon < -180) lon += 360;
        if (lon > 180) lon -= 360;

        const elevKm = getMarsElevationAt(lat, lon);
        onCursorTelemetryRef.current?.({
          lat: Math.round(lat * 10) / 10,
          lon: Math.round(lon * 10) / 10,
          elevationKm: elevKm,
          isHovering: true,
        });
      } else {
        onCursorTelemetryRef.current?.({
          lat: 0,
          lon: 0,
          elevationKm: 0,
          isHovering: false,
        });
      }
    };

    const handlePointerLeave = () => {
      onCursorTelemetryRef.current?.({
        lat: 0,
        lon: 0,
        elevationKm: 0,
        isHovering: false,
      });
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);

    // 14. High-Performance Render Loop
    let animationFrameId: number;
    let phobosAngle = 0;
    let deimosAngle = Math.PI / 3;
    let pulseTime = 0;

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Atmospheric clouds slow drift
      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.0004;
      }

      // Moon orbits
      phobosAngle += delta * 0.45;
      deimosAngle += delta * 0.18;

      const phobosDist = 5.2;
      phobosMesh.position.set(
        Math.cos(phobosAngle) * phobosDist,
        Math.sin(phobosAngle * 0.3) * 0.6,
        Math.sin(phobosAngle) * phobosDist
      );
      phobosMesh.rotation.y += delta * 0.5;

      const deimosDist = 8.4;
      deimosMesh.position.set(
        Math.cos(deimosAngle) * deimosDist,
        Math.cos(deimosAngle * 0.2) * 1.1,
        Math.sin(deimosAngle) * deimosDist
      );
      deimosMesh.rotation.y += delta * 0.3;

      // Pulse pin beacons
      pulseTime += delta * 4;
      pinMeshes.forEach((pin, i) => {
        const ring = pin.children[2] as THREE.Mesh;
        if (ring) {
          const s = 1.0 + Math.sin(pulseTime + i * 0.8) * 0.25;
          ring.scale.set(s, s, 1);
        }
      });

      // Cinematic Camera Fly-Over Mode
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

        // Standard smooth camera transition when focusing on POI
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

    // 15. Responsive Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);

      controls.dispose();
      renderer.dispose();
      marsGeo.dispose();
      marsMat.dispose();
      albedoTex.dispose();
      molaTex.dispose();
      thermalTex.dispose();
      mineralTex.dispose();
      normalTex.dispose();
      roughnessTex.dispose();
      cloudsTex.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      starfieldGeo.dispose();
      starfieldMat.dispose();
      starfieldTexture.dispose();
      phobosGeo.dispose();
      phobosMat.dispose();
      phobosTex.dispose();
      deimosGeo.dispose();
      deimosMat.dispose();
      deimosTex.dispose();
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
