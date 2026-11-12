import * as THREE from 'three';

/**
 * Photorealistic Procedural Earth Texture Engine
 * Generates high-fidelity 4K-ready textures:
 * 1. Earth Albedo with recognizable real-world continental landmasses, biomes, and ocean bathymetry.
 * 2. Specular Water Mask (mirror reflections on oceans, matte continents).
 * 3. NASA Black Marble Night City Lights (golden metropolitan electric grids on the nightside).
 * 4. Multi-layer swirling Atmospheric Clouds with cyclone vortices.
 */

// Permutation table for seamless procedural noise
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
    freq *= 2.04;
    amp *= 0.5;
  }
  return val / maxAmp;
}

/**
 * Coordinate mapping: converts spherical lat/lon into canvas pixels (Equirectangular)
 */
function toCanvasCoords(lat: number, lon: number, width: number, height: number): [number, number] {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

/**
 * Draw accurate continental paths
 */
function drawContinents(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const poly = (coords: [number, number][]) => {
    ctx.beginPath();
    coords.forEach(([lat, lon], idx) => {
      const [x, y] = toCanvasCoords(lat, lon, width, height);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  };

  ctx.fillStyle = '#ffffff';

  // 1. AFRICA
  poly([
    [37, -10], [36, 10], [32, 25], [31, 32], [28, 34], [22, 37], [12, 44],
    [11, 51], [2, 45], [-11, 40], [-26, 33], [-34, 26], [-34, 18], [-18, 12],
    [-6, 12], [4, 9], [5, 1], [4, -8], [11, -16], [15, -17], [28, -13], [36, -6]
  ]);

  // Madagascar
  poly([
    [-12, 49], [-16, 50], [-25, 47], [-25, 44], [-16, 44], [-12, 49]
  ]);

  // 2. EURASIA (Europe, Russia, Asia, Arabia, India, Indochina, China)
  poly([
    [36, -6], [36, 2], [43, 3], [44, -1], [48, -4], [50, 2], [54, 5],
    [58, 8], [63, 6], [71, 28], [68, 44], [70, 60], [73, 72], [76, 96],
    [77, 105], [74, 136], [70, 160], [66, 170], [60, 163], [58, 140],
    [53, 142], [43, 132], [38, 120], [35, 129], [30, 122], [22, 114],
    [21, 108], [10, 104], [1, 104], [8, 98], [22, 90], [21, 88],
    [10, 80], [8, 77], [20, 73], [24, 69], [25, 62], [25, 57],
    [13, 45], [12, 44], [28, 34], [31, 35], [37, 36], [41, 29],
    [40, 23], [37, 22], [41, 15], [44, 12], [46, 14], [43, 7],
    [38, 0], [36, -6]
  ]);

  // British Isles
  poly([
    [50, -5], [54, 0], [58, -2], [58, -5], [54, -4], [50, -5]
  ]);
  poly([
    [51, -10], [55, -6], [54, -10], [51, -10]
  ]);

  // Scandinavia
  poly([
    [58, 8], [64, 12], [70, 20], [71, 28], [65, 23], [60, 18], [56, 12]
  ]);

  // Japan
  poly([
    [31, 131], [35, 136], [40, 140], [45, 142], [43, 145], [36, 139], [31, 131]
  ]);

  // Indonesia & Philippines
  poly([[-6, 106], [-8, 115], [-6, 114], [-6, 106]]);
  poly([[14, 121], [18, 121], [14, 124], [7, 126], [7, 122]]);

  // 3. NORTH AMERICA
  poly([
    [15, -93], [19, -96], [21, -97], [29, -95], [30, -89], [25, -81],
    [29, -81], [35, -75], [41, -70], [44, -66], [47, -53], [52, -56],
    [58, -63], [62, -65], [62, -80], [55, -82], [51, -80], [58, -94],
    [64, -86], [70, -95], [72, -125], [71, -156], [65, -168], [60, -165],
    [58, -158], [55, -162], [54, -133], [49, -124], [40, -124], [34, -120],
    [30, -114], [23, -110], [20, -105], [16, -98], [15, -93]
  ]);

  // Greenland
  poly([
    [60, -44], [65, -38], [72, -22], [81, -18], [83, -33], [81, -60],
    [76, -68], [68, -54], [60, -44]
  ]);

  // 4. SOUTH AMERICA
  poly([
    [12, -72], [10, -62], [7, -58], [0, -50], [-5, -35], [-13, -39],
    [-22, -41], [-30, -50], [-38, -57], [-46, -66], [-54, -68], [-55, -73],
    [-52, -75], [-40, -74], [-30, -71], [-18, -70], [-5, -81], [4, -77],
    [9, -79], [12, -72]
  ]);

  // 5. AUSTRALIA & NEW ZEALAND
  poly([
    [-11, 142], [-15, 145], [-23, 151], [-32, 152], [-38, 147], [-38, 140],
    [-34, 135], [-32, 125], [-35, 118], [-33, 115], [-22, 114], [-17, 123],
    [-14, 129], [-12, 136], [-11, 142]
  ]);

  // New Zealand
  poly([
    [-35, 173], [-38, 178], [-41, 175], [-46, 168], [-44, 169], [-35, 173]
  ]);

  // 6. ANTARCTICA
  poly([
    [-64, -60], [-66, -40], [-68, 0], [-66, 40], [-65, 80], [-66, 120],
    [-65, 160], [-72, 170], [-78, 160], [-78, -160], [-72, -130], [-70, -90],
    [-64, -60]
  ]);
}

/**
 * Real-world geographic city lights cluster positions [lat, lon, brightness, radius]
 */
const WORLD_METRO_CLUSTERS: [number, number, number, number][] = [
  // Central Asia & Dushanbe (Pamir beacon)
  [38.56, 68.79, 1.0, 3], // Dushanbe!
  [41.31, 69.24, 0.95, 4], // Tashkent
  [43.24, 76.91, 0.9, 4], // Almaty
  [51.16, 71.47, 0.85, 3], // Astana
  [42.87, 74.59, 0.8, 3], // Bishkek
  [37.95, 58.38, 0.8, 3], // Ashgabat
  [34.55, 69.20, 0.75, 3], // Kabul
  // Europe
  [51.50, -0.12, 1.0, 7], // London
  [48.85, 2.35, 1.0, 7], // Paris
  [52.52, 13.40, 0.95, 6], // Berlin
  [41.90, 12.49, 0.9, 5], // Rome
  [40.41, -3.70, 0.9, 6], // Madrid
  [55.75, 37.61, 1.0, 8], // Moscow
  [59.93, 30.33, 0.9, 5], // Saint Petersburg
  [50.45, 30.52, 0.85, 4], // Kyiv
  // Middle East
  [25.20, 55.27, 1.0, 6], // Dubai
  [24.71, 46.67, 0.9, 5], // Riyadh
  [30.04, 31.23, 1.0, 7], // Cairo (Nile lights!)
  [35.68, 51.38, 0.9, 6], // Tehran
  [32.08, 34.78, 0.9, 4], // Tel Aviv
  // North America
  [40.71, -74.00, 1.0, 9], // New York (Megalopolis)
  [42.36, -71.05, 0.95, 6], // Boston
  [38.90, -77.03, 0.95, 6], // Washington DC
  [41.87, -87.62, 0.95, 7], // Chicago
  [34.05, -118.24, 1.0, 9], // Los Angeles
  [37.77, -122.41, 0.95, 7], // San Francisco
  [29.76, -95.36, 0.9, 6], // Houston
  [25.76, -80.19, 0.9, 5], // Miami
  [19.43, -99.13, 1.0, 8], // Mexico City
  // South America
  [-23.55, -46.63, 1.0, 8], // Sao Paulo
  [-22.90, -43.17, 0.95, 6], // Rio de Janeiro
  [-34.60, -58.38, 0.95, 7], // Buenos Aires
  [-12.04, -77.04, 0.85, 5], // Lima
  [4.71, -74.07, 0.85, 5], // Bogota
  // Asia
  [35.67, 139.65, 1.0, 9], // Tokyo (Largest urban light in world)
  [37.56, 126.97, 1.0, 8], // Seoul
  [31.23, 121.47, 1.0, 9], // Shanghai
  [39.90, 116.40, 1.0, 8], // Beijing
  [22.31, 114.16, 1.0, 7], // Hong Kong / Shenzhen
  [1.35, 103.81, 0.95, 5], // Singapore
  [13.75, 100.50, 0.95, 6], // Bangkok
  [28.61, 77.20, 1.0, 8], // Delhi
  [19.07, 72.87, 1.0, 8], // Mumbai
  // Australia & Africa
  [-33.86, 151.20, 0.95, 6], // Sydney
  [-37.81, 144.96, 0.9, 5], // Melbourne
  [-26.20, 28.04, 0.9, 6], // Johannesburg
  [6.52, 3.37, 0.85, 5], // Lagos
];

/**
 * Creates 4K-quality Earth Albedo Texture
 */
export function createRealisticEarthAlbedoTexture(width: number = 2048, height: number = 1024): THREE.CanvasTexture {
  // Pass 1: Vector Silhouette Raster
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const mCtx = maskCanvas.getContext('2d');
  if (mCtx) {
    mCtx.fillStyle = '#000000';
    mCtx.fillRect(0, 0, width, height);
    drawContinents(mCtx, width, height);
  }

  // Pass 2: High-Resolution Biome Synthesis
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx || !mCtx) return new THREE.CanvasTexture(canvas);

  const maskData = mCtx.getImageData(0, 0, width, height).data;
  const imgData = ctx.createImageData(width, height);
  const u32 = new Uint32Array(imgData.data.buffer);

  for (let y = 0; y < height; y++) {
    const lat = 90 - (y / height) * 180;
    const v = y / height;

    for (let x = 0; x < width; x++) {
      const lon = (x / width) * 360 - 180;
      const u = x / width;
      const idx = (y * width + x) * 4;

      // Base vector continent mask
      const isVectorLand = maskData[idx] > 128;

      // Add fractal sub-kilometer coastline detail
      const fractalNoise = fastFBM(u * 32, v * 32, 4) - 0.5;
      const isLand = isVectorLand ? fractalNoise > -0.38 : fractalNoise > 0.42 && Math.abs(lat) < 70;

      let r = 8;
      let g = 28;
      let b = 65;

      if (!isLand) {
        // Deep ocean vs coastal shallow shelf
        const shelfDist = isVectorLand ? 0.35 : Math.abs(fractalNoise);
        if (shelfDist < 0.15) {
          // Turquoise coastal shelf (Bahamas, Great Barrier Reef, shores)
          r = 22;
          g = 95;
          b = 135;
        } else {
          // Deep abyssal navy blue
          r = Math.round(6 + Math.sin(v * Math.PI) * 8);
          g = Math.round(22 + Math.sin(v * Math.PI) * 14);
          b = Math.round(55 + Math.sin(v * Math.PI) * 22);
        }
      } else {
        // Biome categorization by latitude & geographical region
        const elevationNoise = fastFBM(u * 28 + 10, v * 28 + 10, 4);

        if (lat < -60 || lat > 72 || (lat > 60 && lon > -70 && lon < -20)) {
          // Polar ice sheets (Antarctica, Greenland, Arctic)
          r = 245;
          g = 250;
          b = 255;
        } else if (
          (lat >= 14 && lat <= 32 && lon >= -18 && lon <= 58) || // Sahara & Arabia
          (lat >= -32 && lat <= -18 && lon >= 115 && lon <= 145) || // Australian Outback
          (lat >= 35 && lat <= 48 && lon >= 75 && lon <= 105) // Gobi & Taklamakan
        ) {
          // Deserts: warm golden-ochre and reddish sand
          r = Math.round(195 + elevationNoise * 40);
          g = Math.round(152 + elevationNoise * 30);
          b = Math.round(98 + elevationNoise * 20);
        } else if (
          (lat >= 26 && lat <= 38 && lon >= 68 && lon <= 104) || // Pamir, Himalayas, Tibet
          (lat <= 10 && lat >= -55 && lon >= -78 && lon <= -65) || // Andes
          (lat >= 35 && lat <= 62 && lon >= -125 && lon <= -105) // Rocky Mountains
        ) {
          if (elevationNoise > 0.55) {
            // Snow-capped alpine summits
            r = 238;
            g = 244;
            b = 252;
          } else {
            // Rocky mountain stone
            r = Math.round(125 + elevationNoise * 30);
            g = Math.round(112 + elevationNoise * 25);
            b = Math.round(92 + elevationNoise * 20);
          }
        } else if (Math.abs(lat) < 12 && ((lon > -80 && lon < -40) || (lon > 10 && lon < 35) || (lon > 95 && lon < 135))) {
          // Lush equatorial tropical rainforests (Amazon, Congo, Indonesia)
          r = Math.round(20 + elevationNoise * 15);
          g = Math.round(68 + elevationNoise * 25);
          b = Math.round(24 + elevationNoise * 12);
        } else {
          // Temperate forests and fertile plains
          r = Math.round(38 + elevationNoise * 25);
          g = Math.round(92 + elevationNoise * 35);
          b = Math.round(42 + elevationNoise * 20);
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
 * Creates Ocean Specular Gloss Map (Black land, White mirror ocean)
 */
export function createRealisticEarthSpecularTexture(width: number = 1024, height: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Fill black for land
  ctx.fillStyle = '#101010';
  ctx.fillRect(0, 0, width, height);

  // Draw land as black on ocean
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const mCtx = maskCanvas.getContext('2d');
  if (mCtx) {
    mCtx.fillStyle = '#000000';
    mCtx.fillRect(0, 0, width, height);
    drawContinents(mCtx, width, height);
    const mData = mCtx.getImageData(0, 0, width, height).data;

    const imgData = ctx.createImageData(width, height);
    const u32 = new Uint32Array(imgData.data.buffer);

    for (let i = 0; i < width * height; i++) {
      const isLand = mData[i * 4] > 128;
      const val = isLand ? 15 : 245; // Oceans reflect specular light
      u32[i] = (255 << 24) | (val << 16) | (val << 8) | val;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Creates NASA Black Marble Night Lights Emission Map
 */
export function createRealisticEarthNightLightsTexture(width: number = 2048, height: number = 1024): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pitch black deep space night background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Draw glowing urban metropolitan hubs
  WORLD_METRO_CLUSTERS.forEach(([lat, lon, brightness, radius]) => {
    const [cx, cy] = toCanvasCoords(lat, lon, width, height);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3.5);
    grad.addColorStop(0, `rgba(255, 230, 140, ${brightness})`);
    grad.addColorStop(0.35, `rgba(255, 175, 70, ${brightness * 0.7})`);
    grad.addColorStop(0.7, `rgba(220, 110, 30, ${brightness * 0.25})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Nile River line lights in Egypt
  ctx.strokeStyle = 'rgba(255, 210, 110, 0.7)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  const nileStart = toCanvasCoords(24.0, 32.8, width, height);
  const nileMid = toCanvasCoords(27.0, 31.0, width, height);
  const nileDelta = toCanvasCoords(30.0, 31.2, width, height);
  ctx.moveTo(nileStart[0], nileStart[1]);
  ctx.lineTo(nileMid[0], nileMid[1]);
  ctx.lineTo(nileDelta[0], nileDelta[1]);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Creates Multi-Layer Dynamic Swirling Atmospheric Clouds
 */
export function createRealisticEarthCloudsTexture(width: number = 2048, height: number = 1024): THREE.CanvasTexture {
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

      // Realistic meteorological cyclonic swirls
      const swirl = Math.sin(u * 12 * cosLat + v * 9) * 0.22;
      const n1 = fastFBM((u + swirl) * 14 * cosLat + 3, v * 14, 5);
      const n2 = fastFBM((u - swirl * 0.5) * 28 * cosLat, v * 28, 3) * 0.35;
      const density = n1 + n2;

      let cloudAlpha = 0;

      // Equatorial Intertropical Convergence Zone (ITCZ)
      if (Math.abs(lat) < 7) {
        if (density > 0.48) cloudAlpha = Math.min(0.9, (density - 0.48) * 2.8);
      }
      // Mid-latitude cyclone storm belts
      else if (Math.abs(lat) > 38 && Math.abs(lat) < 64) {
        if (density > 0.52) cloudAlpha = Math.min(0.85, (density - 0.52) * 2.5);
      }
      // General atmospheric wisps
      else if (density > 0.58) {
        cloudAlpha = Math.min(0.75, (density - 0.58) * 2.2);
      }

      const a = Math.round(cloudAlpha * 255);
      // Soft white cloud with subtle atmospheric tint
      u32[y * width + x] = (a << 24) | (255 << 16) | (252 << 8) | 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}
