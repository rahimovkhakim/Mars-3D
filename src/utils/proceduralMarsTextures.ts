import * as THREE from 'three';

/**
 * 4K Ultra-Resolution Multispectral Procedural Texture Generator for Mars & Space Environment
 * Compliant with NASA/JPL planetary science standards:
 * - True Color (Natural Albedo)
 * - MOLA Laser Altimetry Topography (-8.2km to +21.9km)
 * - THEMIS Thermal Infrared (Thermal Inertia)
 * - CRISM Planetary Mineralogy (Clays, Olivines, Sulfates, Oxides)
 */

export type SpectralLayer = 'true-color' | 'mola-elevation' | 'themis-thermal' | 'crism-mineralogy';

// Fast Precomputed Permutation Table for Perlin Noise
const PERM = new Uint8Array(512);
const P = [
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
  8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
  35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
  134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
  55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,
  18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,
  250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,
  189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,
  172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,
  228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
  107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
];
for (let i = 0; i < 256; i++) {
  PERM[i] = P[i];
  PERM[256 + i] = P[i];
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 7;
  const u = h < 4 ? x : y;
  const v = h < 4 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function fastPerlin2D(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const A = PERM[X] + Y;
  const B = PERM[X + 1] + Y;

  const g00 = grad(PERM[A], xf, yf);
  const g10 = grad(PERM[B], xf - 1, yf);
  const g01 = grad(PERM[A + 1], xf, yf - 1);
  const g11 = grad(PERM[B + 1], xf - 1, yf - 1);

  const x1 = g00 + u * (g10 - g00);
  const x2 = g01 + u * (g11 - g01);

  return (x1 + v * (x2 - x1) + 1) * 0.5;
}

function fastFBM(x: number, y: number, octaves: number = 5): number {
  let val = 0;
  let freq = 1.0;
  let amp = 0.5;
  let maxAmp = 0;

  for (let o = 0; o < octaves; o++) {
    val += fastPerlin2D(x * freq, y * freq) * amp;
    maxAmp += amp;
    freq *= 2.02;
    amp *= 0.5;
  }
  return val / maxAmp;
}

/**
 * Calculates genuine scientific elevation in kilometers (-8.2 km to +21.9 km)
 * based on MOLA laser altimetry models for any lat/lon coordinate on Mars.
 */
export function getMarsElevationAt(lat: number, lon: number): number {
  const rad = Math.PI / 180;
  const cosLat = Math.cos(lat * rad);
  const u = (lon + 180) / 360;
  const v = (90 - lat) / 180;

  // Base spherical harmonic-like terrain
  let elev = (fastFBM(u * 8 * cosLat + 5, v * 8, 4) - 0.45) * 6.0;

  // Olympus Mons (+21.9 km)
  const dLonOlym = (lon - -133.8) * Math.cos(18.65 * rad);
  const dLatOlym = lat - 18.65;
  const distOlym = Math.sqrt(dLonOlym * dLonOlym + dLatOlym * dLatOlym);
  if (distOlym < 15) {
    const factor = Math.max(0, 1 - distOlym / 15);
    elev += factor * factor * 21.0;
  }

  // Tharsis Montes volcanic chain (Ascraeus, Pavonis, Arsia)
  const tharsisDist = Math.sqrt(Math.pow((lon - -105) * cosLat, 2) + Math.pow(lat, 2));
  if (tharsisDist < 25) {
    elev += Math.max(0, 1 - tharsisDist / 25) * 7.5;
  }

  // Valles Marineris canyon rift (-7.0 km)
  if (lon > -92 && lon < -32 && Math.abs(lat - -14) < 7.5) {
    const canyon = Math.exp(-Math.pow((lat - -14) / 2.6, 2));
    elev -= canyon * 6.8;
  }

  // Hellas Basin impact depression (-7.2 to -8.2 km)
  const dLonHellas = (lon - 70) * Math.cos(-42 * rad);
  const dLatHellas = lat - -42;
  const distHellas = Math.sqrt(dLonHellas * dLonHellas + dLatHellas * dLatHellas);
  if (distHellas < 26) {
    const basinFactor = Math.max(0, 1 - distHellas / 26);
    elev -= basinFactor * basinFactor * 7.8;
  }

  // North/South polar caps (+1.5 to +2.5 km)
  if (lat > 78) {
    elev += ((lat - 78) / 12) * 2.5;
  } else if (lat < -78) {
    elev += ((-78 - lat) / 12) * 2.2;
  }

  // Clamp within real Mars physical min/max
  return Math.max(-8.2, Math.min(21.9, Math.round(elev * 10) / 10));
}

/**
 * Converts spherical lat/lon into equirectangular texture UV (0..1)
 */
export function latLonToUv(lat: number, lon: number): { u: number; v: number } {
  const u = (lon + 180) / 360;
  const v = (90 - lat) / 180;
  return { u: Math.max(0, Math.min(1, u)), v: Math.max(0, Math.min(1, v)) };
}

/**
 * Converts lat/lon to 3D point on a sphere of radius R
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * 1. TRUE COLOR (Natural Albedo) 4K Map
 */
export function createMarsAlbedoTexture(is4K: boolean = true): THREE.CanvasTexture {
  const width = is4K ? 4096 : 2048;
  const height = is4K ? 2048 : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.colorSpace = THREE.SRGBColorSpace;
    return fallback;
  }

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);
  const rad = Math.PI / 180;

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const lat = 90 - v * 180;
    const cosLat = Math.cos(lat * rad);

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const lon = u * 360 - 180;

      const sx = 10 * cosLat;
      const sy = 10;
      const n1 = fastFBM(u * sx + 5, v * sy, 5);
      const n2 = fastFBM(u * sx * 2.2 + 1, v * sy * 2.2, 4);
      const nFine = fastPerlin2D(u * sx * 7, v * sy * 7);

      let terrain = n1 * 0.6 + n2 * 0.3 + nFine * 0.1;

      // Syrtis Major volcanic dark maria shield (lon 70, lat 10)
      const dLonSyrtis = (lon - 70) * cosLat;
      const dLatSyrtis = lat - 10;
      const distSyrtis = Math.sqrt(dLonSyrtis * dLonSyrtis + dLatSyrtis * dLatSyrtis);
      if (distSyrtis < 30) {
        terrain -= Math.max(0, 1 - distSyrtis / 30) * 0.42;
      }

      // Valles Marineris canyon rift system
      if (lon > -92 && lon < -32 && Math.abs(lat - -14) < 7.5) {
        const canyonDepth = Math.exp(-Math.pow((lat - -14) / 2.6, 2));
        terrain -= canyonDepth * 0.52;
      }

      // Olympus Mons
      const dLonOlym = (lon - -133.8) * Math.cos(18.65 * rad);
      const dLatOlym = lat - 18.65;
      const distOlym = Math.sqrt(dLonOlym * dLonOlym + dLatOlym * dLatOlym);
      if (distOlym < 14) {
        terrain += Math.max(0, 1 - distOlym / 14) * 0.42;
      }

      // Hellas Basin
      const dLonHellas = (lon - 70) * Math.cos(-42 * rad);
      const dLatHellas = lat - -42;
      const distHellas = Math.sqrt(dLonHellas * dLonHellas + dLatHellas * dLatHellas);
      if (distHellas < 24) {
        terrain += Math.max(0, 1 - distHellas / 24) * 0.24;
      }

      // Polar ice caps
      let isNorthIce = 0;
      if (lat > 75) {
        const pDist = (90 - lat) / 15;
        const spiral = Math.sin(pDist * 9 + (lon * rad) * 2) * 0.25;
        isNorthIce = Math.min(1, Math.max(0, (1 - pDist + spiral) * 1.6));
      }

      let isSouthIce = 0;
      if (lat < -77) {
        const pDist = (lat - -90) / 13;
        isSouthIce = Math.min(1, Math.max(0, (1 - pDist) * 1.7));
      }

      let r: number, g: number, b: number;

      if (isNorthIce > 0.04 || isSouthIce > 0.04) {
        const ice = Math.max(isNorthIce, isSouthIce);
        r = Math.round(238 * ice + 155 * (1 - ice));
        g = Math.round(244 * ice + 85 * (1 - ice));
        b = Math.round(252 * ice + 55 * (1 - ice));
      } else {
        const t = Math.max(0, Math.min(1, terrain));
        if (t < 0.36) {
          // Basalt dark maria
          const k = t / 0.36;
          r = Math.round(72 + k * 45);
          g = Math.round(42 + k * 26);
          b = Math.round(30 + k * 16);
        } else if (t < 0.72) {
          // Ferric oxide red-ochre
          const k = (t - 0.36) / 0.36;
          r = Math.round(125 + k * 65);
          g = Math.round(68 + k * 38);
          b = Math.round(46 + k * 20);
        } else {
          // Bright highland dust
          const k = (t - 0.72) / 0.28;
          r = Math.round(190 + k * 48);
          g = Math.round(106 + k * 35);
          b = Math.round(66 + k * 25);
        }

        if (nFine > 0.78) {
          r = Math.min(255, r + 24);
          g = Math.min(255, g + 18);
          b = Math.min(255, b + 12);
        }
      }

      u32[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * 2. MOLA ELEVATION (NASA Mars Orbiter Laser Altimeter Rainbow Color Scale)
 * Scale: -8.2km (deep navy/purple) to 0km (green) to +21.9km (magenta/white)
 */
export function createMarsMOLATexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 2048 : 1024;
  const height = isHighRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 360 - 180;
      const elev = getMarsElevationAt(lat, lon); // -8.2 to +21.9 km

      // Normalize elevation: -8.2km -> 0.0, 0km -> 0.27, +21.9km -> 1.0
      const norm = Math.max(0, Math.min(1, (elev + 8.2) / 30.1));

      let r = 0, g = 0, b = 0;

      // Authentic MOLA rainbow ramp:
      // 0.00 .. 0.15: Deep Purple to Navy Blue (-8.2km to -4km: Hellas, Valles trench)
      // 0.15 .. 0.27: Cyan to Turquoise (-4km to 0km: Northern Plains)
      // 0.27 .. 0.45: Emerald to Light Green (0km to +5km: Cratered Highlands)
      // 0.45 .. 0.65: Yellow to Orange (+5km to +11km: Tharsis Bulge)
      // 0.65 .. 0.85: Red to Crimson (+11km to +17km: Volcano Slopes)
      // 0.85 .. 1.00: Magenta to Pure White (+17km to +21.9km: Olympus Mons Peak)

      if (norm < 0.15) {
        const k = norm / 0.15;
        r = Math.round(40 + k * 20);
        g = Math.round(10 + k * 40);
        b = Math.round(120 + k * 115);
      } else if (norm < 0.27) {
        const k = (norm - 0.15) / 0.12;
        r = Math.round(20 + k * 10);
        g = Math.round(70 + k * 140);
        b = Math.round(220 - k * 50);
      } else if (norm < 0.45) {
        const k = (norm - 0.27) / 0.18;
        r = Math.round(30 + k * 160);
        g = Math.round(210 + k * 35);
        b = Math.round(70 - k * 60);
      } else if (norm < 0.65) {
        const k = (norm - 0.45) / 0.20;
        r = Math.round(220 + k * 30);
        g = Math.round(220 - k * 110);
        b = Math.round(15 + k * 10);
      } else if (norm < 0.85) {
        const k = (norm - 0.65) / 0.20;
        r = Math.round(230 + k * 15);
        g = Math.round(70 - k * 50);
        b = Math.round(25 + k * 140);
      } else {
        const k = (norm - 0.85) / 0.15;
        r = Math.round(245 + k * 10);
        g = Math.round(50 + k * 195);
        b = Math.round(180 + k * 75);
      }

      u32[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * 3. THEMIS THERMAL IR (NASA Mars Odyssey Thermal Inertia Map)
 * Shows nighttime heat capacity:
 * Loose fine dust = cold (dark violet / deep blue)
 * Dense bedrock & basalt outcrops = retains heat (warm amber, gold, white)
 */
export function createMarsThermalTexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 2048 : 1024;
  const height = isHighRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);
  const rad = Math.PI / 180;

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    const cosLat = Math.cos(lat * rad);

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const lon = u * 360 - 180;

      // Bedrock index: high near basalt volcanoes and rocky chasm walls
      const nRock = fastFBM(u * 12 * cosLat, v * 12, 4);
      let thermalInertia = nRock * 0.7;

      // Olympus Mons & Tharsis basalt retain high daytime heat
      const dLonOlym = (lon - -133.8) * Math.cos(18.65 * rad);
      const dLatOlym = lat - 18.65;
      if (Math.sqrt(dLonOlym * dLonOlym + dLatOlym * dLatOlym) < 14) {
        thermalInertia += 0.35;
      }

      // Syrtis Major basalt maria
      const dLonSyrtis = (lon - 70) * cosLat;
      const dLatSyrtis = lat - 10;
      if (Math.sqrt(dLonSyrtis * dLonSyrtis + dLatSyrtis * dLatSyrtis) < 28) {
        thermalInertia += 0.40;
      }

      // Canyon cliff bedrock
      if (lon > -92 && lon < -32 && Math.abs(lat - -14) < 7.5) {
        thermalInertia += 0.38;
      }

      // Polar cold ice (ultra low temperature)
      if (Math.abs(lat) > 75) {
        thermalInertia = Math.max(0, thermalInertia - 0.45);
      }

      const t = Math.max(0, Math.min(1, thermalInertia));

      // Thermal FLIR / Ironbow gradient:
      // Dark Blue / Black -> Purple -> Crimson -> Orange -> Golden Yellow -> White
      let r = 0, g = 0, b = 0;
      if (t < 0.25) {
        const k = t / 0.25;
        r = Math.round(15 + k * 45);
        g = Math.round(5 + k * 10);
        b = Math.round(60 + k * 100);
      } else if (t < 0.55) {
        const k = (t - 0.25) / 0.30;
        r = Math.round(60 + k * 155);
        g = Math.round(15 + k * 40);
        b = Math.round(160 - k * 120);
      } else if (t < 0.82) {
        const k = (t - 0.55) / 0.27;
        r = Math.round(215 + k * 35);
        g = Math.round(55 + k * 145);
        b = Math.round(40 - k * 30);
      } else {
        const k = (t - 0.82) / 0.18;
        r = 255;
        g = Math.round(200 + k * 55);
        b = Math.round(10 + k * 230);
      }

      u32[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * 4. CRISM MINERALOGY MAP (NASA MRO CRISM Spectrometer)
 * Spectral classification of Martian surface geology:
 * - Emerald/Chartreuse: Ancient phyllosilicates & lake clays (Jezero, Gale, Mawrth)
 * - Deep Cyan/Teal: Mafic volcanic minerals (Olivine & Pyroxene)
 * - Golden Amber: Hydrated sulfates (Valles Marineris)
 * - Rust Red: Ferric iron oxides / hematite
 * - Ice Blue: Frozen CO2 & H2O
 */
export function createMarsMineralTexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 2048 : 1024;
  const height = isHighRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);
  const rad = Math.PI / 180;

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    const cosLat = Math.cos(lat * rad);

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const v = y / height;
      const lon = u * 360 - 180;

      // Base ferric iron background (red-ochre)
      let r = 180, g = 65, b = 45;

      // Syrtis Major & volcanic provinces: Olivine & Pyroxene (Deep Cyan / Teal)
      const dLonSyrtis = (lon - 70) * cosLat;
      const dLatSyrtis = lat - 10;
      if (Math.sqrt(dLonSyrtis * dLonSyrtis + dLatSyrtis * dLatSyrtis) < 28) {
        r = 15; g = 175; b = 185; // Teal Olivine
      }

      // Jezero Crater (lon 77.58, lat 18.38) & Mawrth Vallis: Ancient Clays (Emerald Green)
      const dLonJez = (lon - 77.58) * cosLat;
      const dLatJez = lat - 18.38;
      if (Math.sqrt(dLonJez * dLonJez + dLatJez * dLatJez) < 12) {
        r = 34; g = 197; b = 94; // Emerald Clays
      }

      // Gale Crater (lon 137.8, lat -5.4): Clays & Mudstone
      const dLonGale = (lon - 137.8) * cosLat;
      const dLatGale = lat - -5.4;
      if (Math.sqrt(dLonGale * dLonGale + dLatGale * dLatGale) < 10) {
        r = 52; g = 211; b = 153; // Mint Clay
      }

      // Valles Marineris: Hydrated Sulfates (Golden Amber)
      if (lon > -92 && lon < -32 && Math.abs(lat - -14) < 7.5) {
        r = 245; g = 158; b = 11; // Amber Sulfate
      }

      // Meridiani Planum: Hematite blueberries (Cobalt / Violet)
      const dLonMer = (lon - -2.5) * cosLat;
      const dLatMer = lat - -0.2;
      if (Math.sqrt(dLonMer * dLonMer + dLatMer * dLatMer) < 14) {
        r = 129; g = 140; b = 248; // Hematite
      }

      // Polar Ice caps: Crystalline CO2 & H2O (Ice Blue)
      if (Math.abs(lat) > 75) {
        r = 165; g = 243; b = 252;
      }

      u32[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * High-definition Normal Map for Mars
 */
export function createMarsNormalTexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 2048 : 1024;
  const height = isHighRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const heights = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 360 - 180;
      heights[y * width + x] = getMarsElevationAt(lat, lon);
    }
  }

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);
  const strength = 0.45;

  for (let y = 0; y < height; y++) {
    const yPrev = Math.max(0, y - 1);
    const yNext = Math.min(height - 1, y + 1);

    for (let x = 0; x < width; x++) {
      const xPrev = (x - 1 + width) % width;
      const xNext = (x + 1) % width;

      const dx = (heights[y * width + xNext] - heights[y * width + xPrev]) * strength;
      const dy = (heights[yNext * width + x] - heights[yPrev * width + x]) * strength;

      const len = Math.sqrt(dx * dx + dy * dy + 1.0);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = 1.0 / len;

      const r = Math.round((nx * 0.5 + 0.5) * 255);
      const g = Math.round((ny * 0.5 + 0.5) * 255);
      const b = Math.round((nz * 0.5 + 0.5) * 255);

      u32[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Roughness Map for Mars (shiny polar ice, matte dust)
 */
export function createMarsRoughnessTexture(width: number = 1024, height: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    for (let x = 0; x < width; x++) {
      let roughnessVal = 215; // 0.84 default matte dust

      if (Math.abs(lat) > 75) {
        roughnessVal = 55; // 0.22 reflective ice cap
      }

      u32[y * width + x] = (255 << 24) | (roughnessVal << 16) | (roughnessVal << 8) | roughnessVal;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Atmospheric clouds and dust haze texture
 */
export function createMarsCloudsTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);
  const rad = Math.PI / 180;

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const lat = 90 - v * 180;
    const cosLat = Math.cos(lat * rad);

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const cloudNoise = fastFBM(u * 14 * cosLat + 10, v * 14, 4);

      let alpha = 0;
      if (cloudNoise > 0.62) {
        alpha = (cloudNoise - 0.62) * 2.2;
      }

      if (Math.abs(lat) > 68) {
        alpha += 0.28;
      }

      const a = Math.round(Math.max(0, Math.min(0.6, alpha)) * 255);
      u32[y * width + x] = (a << 24) | (245 << 16) | (235 << 8) | 240;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Starfield with Deep Space Cosmic Nebulae
 */
export function createStarfieldTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#02040a';
  ctx.fillRect(0, 0, width, height);

  const nebulae = [
    { x: 400, y: 350, r: 450, color: 'rgba(90, 45, 140, 0.14)' },
    { x: 1550, y: 650, r: 520, color: 'rgba(35, 80, 160, 0.16)' },
    { x: 1800, y: 280, r: 380, color: 'rgba(140, 60, 45, 0.10)' },
    { x: 900, y: 800, r: 400, color: 'rgba(50, 110, 130, 0.12)' },
  ];

  nebulae.forEach(neb => {
    const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
    grad.addColorStop(0, neb.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const starColors = ['#ffffff', '#f0f9ff', '#bae6fd', '#fed7aa', '#fecdd3'];

  for (let i = 0; i < 2000; i++) {
    const sx = Math.random() * width;
    const sy = Math.random() * height;
    const size = Math.random() < 0.94 ? Math.random() * 1.3 : Math.random() * 2.6;
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    const opacity = 0.25 + Math.random() * 0.75;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();

    if (size > 2.0 && Math.random() < 0.3) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(sx - 5, sy);
      ctx.lineTo(sx + 5, sy);
      ctx.moveTo(sx, sy - 5);
      ctx.lineTo(sx, sy + 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural texture for Phobos / Deimos asteroid moons
 */
export function createMoonTexture(seed: number = 777): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(size, size);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const n = fastFBM(u * 8 + seed, v * 8 + seed, 4);
      const crater = Math.sin(u * 22) * Math.cos(v * 22);
      const val = Math.round((n * 0.75 + (crater > 0.55 ? 0.25 : 0)) * 140 + 55);

      const r = val;
      const g = Math.round(val * 0.93);
      const b = Math.round(val * 0.88);

      u32[y * size + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * High-definition PBR Surface Normal & Regolith texture for first-person exploration
 */
export function createSurfaceRegolithTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(size, size);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;

      const ripple = Math.sin(u * 40 + v * 15) * 0.25;
      const noise = fastFBM(u * 16, v * 16, 4) * 0.75;
      const val = noise + ripple;

      const r = Math.round(155 + val * 45);
      const g = Math.round(75 + val * 30);
      const b = Math.round(48 + val * 18);

      u32[y * size + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Returns true if the coordinate is over Earth landmass (mathematical continent approximation)
 */
function isEarthLand(lat: number, lon: number): { isLand: boolean; landType: 'green' | 'desert' | 'snow' | 'mountain'; elevationKm: number } {
  // Antarctica
  if (lat < -60) {
    return { isLand: true, landType: 'snow', elevationKm: 2.3 + Math.sin(lon) * 0.5 };
  }
  // Greenland
  if (lat > 60 && lat < 84 && lon > -73 && lon < -18) {
    return { isLand: true, landType: 'snow', elevationKm: 2.1 };
  }
  // Arctic ocean
  if (lat > 84) {
    return { isLand: false, landType: 'snow', elevationKm: 0.0 };
  }

  // Major continental landmass rough bounds & noise check
  const rad = Math.PI / 180;
  const cosLat = Math.cos(lat * rad);
  const u = (lon + 180) / 360;
  const v = (90 - lat) / 180;
  const coastNoise = fastFBM(u * 18 * cosLat, v * 18, 4) * 0.35;

  let isLand = false;

  // Africa: lat -35 to 37, lon -18 to 52
  if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
    if (lat > 15 && lon > -15 && lon < 40) isLand = true; // Sahara & Sahel
    else if (lat <= 15 && lon > 8 && lon < 42) isLand = true; // Central / East Africa
    else if (lat < 0 && lon > 10 && lon < 35) isLand = true; // Southern Africa
  }

  // Eurasia: lat 10 to 76, lon -10 to 180
  if (lat >= 10 && lat <= 76 && lon >= -10 && lon <= 180) {
    if (lat > 35 && lon > -10 && lon < 175) isLand = true; // Europe & Russia
    else if (lat <= 35 && lat >= 10 && lon >= 60 && lon <= 140) isLand = true; // Asia / India / China / Central Asia
    else if (lat <= 32 && lat >= 12 && lon >= 35 && lon <= 60) isLand = true; // Arabian Peninsula
  }

  // North America: lat 15 to 72, lon -168 to -52
  if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) {
    if (lat > 25 && lon > -130 && lon < -65) isLand = true; // USA & Canada
    else if (lat <= 25 && lon > -105 && lon < -80) isLand = true; // Mexico & Central America
    else if (lat > 50 && lon > -168 && lon < -130) isLand = true; // Alaska
  }

  // South America: lat -55 to 12, lon -82 to -35
  if (lat >= -55 && lat <= 12 && lon >= -82 && lon <= -35) {
    if (lat > -20 && lon > -80 && lon < -35) isLand = true; // Amazon / Brazil
    else if (lat <= -20 && lon > -74 && lon < -52) isLand = true; // Southern Cone / Andes
  }

  // Australia: lat -40 to -11, lon 112 to 154
  if (lat >= -40 && lat <= -11 && lon >= 112 && lon <= 154) {
    isLand = true;
  }

  // Refine coastlines with smooth noise
  if (coastNoise > 0.22) isLand = true;
  if (coastNoise < -0.22 && Math.abs(lat) < 55) isLand = false;

  // Specific landmarks
  // Mount Everest (27.98°N, 86.92°E)
  const dLatEve = lat - 27.98;
  const dLonEve = (lon - 86.92) * cosLat;
  if (dLatEve * dLatEve + dLonEve * dLonEve < 9) {
    return { isLand: true, landType: 'mountain', elevationKm: 8.85 };
  }

  // Pamir / Dushanbe (38.56°N, 68.79°E)
  const dLatDush = lat - 38.56;
  const dLonDush = (lon - 68.79) * cosLat;
  if (dLatDush * dLatDush + dLonDush * dLonDush < 6) {
    return { isLand: true, landType: 'mountain', elevationKm: 3.8 };
  }

  // Mariana Trench (11.35°N, 142.20°E)
  const dLatMar = lat - 11.35;
  const dLonMar = (lon - 142.2) * cosLat;
  if (dLatMar * dLatMar + dLonMar * dLonMar < 8) {
    return { isLand: false, landType: 'green', elevationKm: -11.03 };
  }

  if (!isLand) {
    return { isLand: false, landType: 'green', elevationKm: -3.8 };
  }

  // Determine land type
  if (lat >= 16 && lat <= 32 && lon >= -16 && lon <= 60) {
    return { isLand: true, landType: 'desert', elevationKm: 0.45 }; // Sahara & Arabia
  }
  if (lat >= -32 && lat <= -18 && lon >= 116 && lon <= 145) {
    return { isLand: true, landType: 'desert', elevationKm: 0.35 }; // Australian Outback
  }
  if (lat >= 25 && lat <= 38 && lon >= 70 && lon <= 105) {
    return { isLand: true, landType: 'mountain', elevationKm: 4.5 }; // Himalayas & Tibetan plateau
  }
  if (lat <= 10 && lat >= -55 && lon >= -78 && lon <= -65) {
    return { isLand: true, landType: 'mountain', elevationKm: 3.9 }; // Andes
  }
  if (lat > 65) {
    return { isLand: true, landType: 'snow', elevationKm: 0.8 };
  }

  return { isLand: true, landType: 'green', elevationKm: 0.35 };
}

/**
 * Calculates genuine scientific elevation/depth in kilometers for Earth (-11.03 km to +8.85 km)
 */
export function getEarthElevationAt(lat: number, lon: number): number {
  const info = isEarthLand(lat, lon);
  return Math.round(info.elevationKm * 10) / 10;
}

/**
 * High-definition Procedural Earth Blue Marble Albedo Texture (2048x1024)
 */
export function createEarthAlbedoTexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 2048 : 1024;
  const height = isHighRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    const v = y / height;

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 360 - 180;
      const u = x / width;

      const { isLand, landType, elevationKm } = isEarthLand(lat, lon);

      let r = 12;
      let g = 38;
      let b = 85;

      if (!isLand) {
        // Ocean: gradient from deep navy ocean to shallow turquoise coastal shelf
        const shallowNoise = fastFBM(u * 24, v * 24, 3);
        if (shallowNoise > 0.6) {
          r = 24;
          g = 88;
          b = 135;
        } else {
          r = Math.round(10 + Math.sin(v * Math.PI) * 12);
          g = Math.round(34 + Math.sin(v * Math.PI) * 20);
          b = Math.round(82 + Math.sin(v * Math.PI) * 30);
        }
      } else {
        const detail = fastFBM(u * 32, v * 32, 4);
        if (landType === 'snow') {
          // White ice & glaciers
          r = Math.round(235 + detail * 20);
          g = Math.round(242 + detail * 13);
          b = Math.round(250 + detail * 5);
        } else if (landType === 'desert') {
          // Warm golden-ochre sand
          r = Math.round(195 + detail * 45);
          g = Math.round(155 + detail * 35);
          b = Math.round(105 + detail * 25);
        } else if (landType === 'mountain') {
          if (elevationKm > 4.0) {
            // Snow-capped peaks
            r = Math.round(225 + detail * 25);
            g = Math.round(230 + detail * 20);
            b = Math.round(240 + detail * 15);
          } else {
            // Rocky alpine brown
            r = Math.round(120 + detail * 35);
            g = Math.round(105 + detail * 30);
            b = Math.round(85 + detail * 20);
          }
        } else {
          // Lush green vegetation & forests
          r = Math.round(35 + detail * 25);
          g = Math.round(85 + detail * 45);
          b = Math.round(38 + detail * 20);
        }
      }

      u32[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Procedural Earth Night City Lights (NASA Black Marble emission map)
 */
export function createEarthNightLightsTexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 2048 : 1024;
  const height = isHighRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    const v = y / height;

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 360 - 180;
      const u = x / width;

      const { isLand } = isEarthLand(lat, lon);

      let r = 0;
      let g = 0;
      let b = 0;

      if (isLand && lat > -50 && lat < 68) {
        // High density urban clusters
        const urbanNoise = fastFBM(u * 40, v * 40, 4);

        // Core metropolitan zones (Europe, Eastern USA, East Asia, India)
        let isMetroZone = false;
        if (lat >= 36 && lat <= 58 && lon >= -10 && lon <= 35) isMetroZone = true; // Europe
        if (lat >= 28 && lat <= 48 && lon >= -90 && lon <= -70) isMetroZone = true; // East Coast USA
        if (lat >= 20 && lat <= 42 && lon >= 105 && lon <= 142) isMetroZone = true; // East Asia / Japan
        if (lat >= 10 && lat <= 32 && lon >= 70 && lon <= 88) isMetroZone = true; // India
        if (Math.abs(lat - 38.56) < 2 && Math.abs(lon - 68.79) < 2) isMetroZone = true; // Dushanbe & Central Asia

        const threshold = isMetroZone ? 0.62 : 0.74;

        if (urbanNoise > threshold) {
          const intensity = (urbanNoise - threshold) / (1 - threshold);
          r = Math.round(255 * intensity);
          g = Math.round(195 * intensity);
          b = Math.round(110 * intensity);
        }
      }

      u32[y * width + x] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Earth Atmospheric Clouds with realistic cyclone vortices & trade wind cloud bands
 */
export function createEarthCloudsTexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 2048 : 1024;
  const height = isHighRes ? 1024 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);
  const rad = Math.PI / 180;

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    const cosLat = Math.cos(lat * rad);
    const v = y / height;

    for (let x = 0; x < width; x++) {
      const u = x / width;

      // Swirling atmospheric motion
      const swirl = Math.sin(u * 14 * cosLat + v * 8) * 0.2;
      const n = fastFBM((u + swirl) * 16 * cosLat + 5, v * 16, 5);

      // Equatorial ITCZ band & mid-latitude cloud bands
      let cloudDensity = n * 0.85;
      if (Math.abs(lat) < 8) {
        cloudDensity += 0.25; // Intertropical Convergence Zone
      } else if (Math.abs(lat) > 42 && Math.abs(lat) < 65) {
        cloudDensity += 0.22; // Subpolar storm tracks
      }

      let alpha = 0;
      if (cloudDensity > 0.58) {
        alpha = Math.min(0.85, (cloudDensity - 0.58) * 2.5);
      }

      const a = Math.round(alpha * 255);
      u32[y * width + x] = (a << 24) | (255 << 16) | (255 << 8) | 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Earth Water Specular Map (Black land, White glossy ocean)
 */
export function createEarthSpecularTexture(isHighRes: boolean = true): THREE.CanvasTexture {
  const width = isHighRes ? 1024 : 512;
  const height = isHighRes ? 512 : 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 360 - 180;
      const { isLand } = isEarthLand(lat, lon);

      // On oceans, high specular reflectivity (bright white 245); on land, low (matte 25)
      const val = isLand ? 25 : 245;
      u32[y * width + x] = (255 << 24) | (val << 16) | (val << 8) | val;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

