/**
 * PROJECT ASTRONOVA: COMMAND STATION SYSTEM CONTROLLER
 * Final Version: Segmented Modality Pathway selector (with IR), static side panels, and clean dark cosmos.
 */

// 1. BACKEND INTEGRATION CONFIGURATION
const API_CONFIG = {
  ENABLED: false,                      
  BASE_URL: "http://127.0.0.1:5000/api", 
  ENDPOINTS: {
    RETRIEVE: "/retrieve"              
  }
};

// 2. SYSTEM STATE CONFIGURATION
const state = {
  modality: "S1-to-S2",   // S1-to-S2, S2-to-S1
  activeTarget: null,     // Currently active target (defaults to Tokyo first)
  isScanning: false,      // Active scan status
};

// Tactical coordinate directory records
const TARGET_DIRECTORY = {
  tokyo: {
    id: "ASTRONOVA-TOKYO-B12",
    lat: 35.6762,
    lon: 139.6503,
    clouds: 1.25,
    season: "Winter",
    sensor: "SENTINEL-1A",
    terrain: { forest: 5, urban: 85, desert: 0, water: 10, agriculture: 0 },
    desc: "Metropolitan dense area. High building double-bounce scatter coefficients.",
    results: [
      { id: "S2-TK-01", confidence: 98.4, lat: 35.69, lon: 139.75, seed: 12 },
      { id: "S2-TK-02", confidence: 95.1, lat: 35.62, lon: 139.68, seed: 14 },
      { id: "S2-TK-03", confidence: 89.7, lat: 35.75, lon: 139.55, seed: 17 },
      { id: "S2-TK-04", confidence: 84.2, lat: 35.58, lon: 139.80, seed: 21 },
      { id: "S2-TK-05", confidence: 79.5, lat: 35.70, lon: 139.42, seed: 29 }
    ]
  },
  amazon: {
    id: "ASTRONOVA-AMZN-K08",
    lat: -3.4653,
    lon: -62.2159,
    clouds: 72.80,
    season: "Summer",
    sensor: "SENTINEL-1A",
    terrain: { forest: 92, urban: 1, desert: 0, water: 5, agriculture: 2 },
    desc: "Tropical canopy return. High moisture attenuation on double-bounce scatter values.",
    results: [
      { id: "S2-AMZ-01", confidence: 96.8, lat: -3.41, lon: -62.15, seed: 51 },
      { id: "S2-AMZ-02", confidence: 93.4, lat: -3.55, lon: -62.30, seed: 54 },
      { id: "S2-AMZ-03", confidence: 88.2, lat: -3.32, lon: -62.05, seed: 58 },
      { id: "S2-AMZ-04", confidence: 81.9, lat: -3.68, lon: -62.45, seed: 62 },
      { id: "S2-AMZ-05", confidence: 76.4, lat: -3.45, lon: -62.50, seed: 67 }
    ]
  },
  sahara: {
    id: "ASTRONOVA-SAH-D09",
    lat: 23.4162,
    lon: 11.2359,
    clouds: 0.12,
    season: "Autumn",
    sensor: "SENTINEL-1A",
    terrain: { forest: 0, urban: 0, desert: 99, water: 0, agriculture: 1 },
    desc: "Dune formations. High surface roughness scatter, low vegetation interference index.",
    results: [
      { id: "S2-SAH-01", confidence: 99.1, lat: 23.45, lon: 11.30, seed: 80 },
      { id: "S2-SAH-02", confidence: 96.5, lat: 23.35, lon: 11.15, seed: 83 },
      { id: "S2-SAH-03", confidence: 91.2, lat: 23.50, lon: 11.42, seed: 85 },
      { id: "S2-SAH-04", confidence: 85.7, lat: 23.28, lon: 11.08, seed: 89 },
      { id: "S2-SAH-05", confidence: 80.3, lat: 23.58, lon: 11.55, seed: 93 }
    ]
  },
  himalayas: {
    id: "ASTRONOVA-HIM-G04",
    lat: 28.5983,
    lon: 83.9310,
    clouds: 15.40,
    season: "Spring",
    sensor: "SENTINEL-1A",
    terrain: { forest: 10, urban: 0, desert: 0, water: 70, agriculture: 20 },
    desc: "Glacial ice sheets. Snow surface reflectance. High relief geometric displacements.",
    results: [
      { id: "S2-HIM-01", confidence: 97.5, lat: 28.62, lon: 83.98, seed: 102 },
      { id: "S2-HIM-02", confidence: 92.9, lat: 28.52, lon: 83.85, seed: 105 },
      { id: "S2-HIM-03", confidence: 87.1, lat: 28.68, lon: 84.05, seed: 109 },
      { id: "S2-HIM-04", confidence: 82.4, lat: 28.45, lon: 83.78, seed: 114 },
      { id: "S2-HIM-05", confidence: 78.0, lat: 28.72, lon: 84.15, seed: 120 }
    ]
  },
  sydney: {
    id: "ASTRONOVA-SYD-C07",
    lat: -33.8688,
    lon: 151.2093,
    clouds: 8.50,
    season: "Autumn",
    sensor: "SENTINEL-1A",
    terrain: { forest: 15, urban: 60, desert: 0, water: 25, agriculture: 0 },
    desc: "Coastal grid boundary. Water/urban contrast scans. Complex shore dielectric constants.",
    results: [
      { id: "S2-SYD-01", confidence: 98.1, lat: -33.85, lon: 151.25, seed: 140 },
      { id: "S2-SYD-02", confidence: 94.6, lat: -33.88, lon: 151.18, seed: 144 },
      { id: "S2-SYD-03", confidence: 89.3, lat: -33.80, lon: 151.30, seed: 147 },
      { id: "S2-SYD-04", confidence: 83.5, lat: -33.92, lon: 151.12, seed: 152 },
      { id: "S2-SYD-05", confidence: 78.9, lat: -33.82, lon: 151.05, seed: 159 }
    ]
  }
};

// 3. ELEGANT COSMOS UNIVERSE BACKGROUND CANVAS (Dim Galaxies, Twinkling Stars & Shooting Stars)
const bgCanvas = document.getElementById("universe-canvas");
const bgCtx = bgCanvas.getContext("2d");

let stars = [];
let galaxies = [];
let shootingStars = [];

function initUniverse() {
  resizeUniverseCanvas();
  window.addEventListener("resize", () => {
    resizeUniverseCanvas();
    if (galaxies.length >= 2) {
      galaxies[0].x = bgCanvas.width * 0.25;
      galaxies[0].y = bgCanvas.height * 0.3;
      galaxies[1].x = bgCanvas.width * 0.75;
      galaxies[1].y = bgCanvas.height * 0.7;
    }
  });
  
  // Create stars: 250 stars with increased brightness and sparkling (twinkle) speeds
  stars = [];
  const starCount = 250; 
  for (let i = 0; i < starCount; i++) {
    const isForeground = Math.random() > 0.82;
    // Increased sizes: foreground stars up to 2.8px, background up to 1.1px
    const size = isForeground ? (Math.random() * 1.6 + 1.2) : (Math.random() * 0.7 + 0.4);
    const opacity = isForeground ? (Math.random() * 0.5 + 0.5) : (Math.random() * 0.5 + 0.1);
    
    stars.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      size: size,
      opacity: opacity,
      // Increased fadeSpeed (sparkle rate)
      fadeSpeed: (Math.random() * 0.024 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      speedX: (Math.random() * 0.02 - 0.01) * (isForeground ? 1.5 : 0.6), 
      speedY: (Math.random() * 0.02 - 0.01) * (isForeground ? 1.5 : 0.6),
      minOpacity: isForeground ? 0.15 : 0.05,
      maxOpacity: isForeground ? 1.0 : 0.75,
      isForeground: isForeground
    });
  }
  
  // Create 2 slowly rotating spiral galaxies (original blue/purple theme)
  galaxies = [
    {
      x: bgCanvas.width * 0.25,
      y: bgCanvas.height * 0.3,
      radius: Math.min(bgCanvas.width, bgCanvas.height) * 0.22,
      angle: 0,
      spinSpeed: 0.0003,
      colorCore: "rgba(100, 40, 180, 0.22)", // Vibrant purple core
      colorOuter: "rgba(20, 60, 160, 0.08)"   // Deep blue outer glow
    },
    {
      x: bgCanvas.width * 0.75,
      y: bgCanvas.height * 0.7,
      radius: Math.min(bgCanvas.width, bgCanvas.height) * 0.26,
      angle: Math.PI / 3,
      spinSpeed: -0.00015,
      colorCore: "rgba(20, 110, 180, 0.20)",  // Teal-cyan core
      colorOuter: "rgba(80, 20, 130, 0.06)"   // Dark violet outer glow
    }
  ];
  
  shootingStars = [];
  
  tickUniverse();
}

function resizeUniverseCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function drawGalaxy(g) {
  g.angle += g.spinSpeed;
  
  bgCtx.save();
  bgCtx.translate(g.x, g.y);
  bgCtx.rotate(g.angle);
  
  // 1. Draw volumetric gas glows along the spiral arms (adds smoke/nebula texture)
  bgCtx.save();
  const gasArms = 2;
  const gasSteps = 25;
  for (let arm = 0; arm < gasArms; arm++) {
    const baseAngle = arm * Math.PI;
    for (let j = 0; j < gasSteps; j++) {
      const factor = j / gasSteps;
      const theta = factor * Math.PI * 2.8;
      const r = factor * g.radius * 0.95;
      const angle = baseAngle + theta;
      const sx = Math.cos(angle) * r * 2.0;
      const sy = Math.sin(angle) * r * 0.85;
      
      const gasSize = (1 - factor) * g.radius * 0.28 + 6;
      const gasOpacity = (1 - factor) * 0.06;
      
      const gasGrad = bgCtx.createRadialGradient(sx, sy, 0, sx, sy, gasSize);
      // alternate purple/cyan arm color gas
      gasGrad.addColorStop(0, arm === 0 ? `rgba(130, 60, 220, ${gasOpacity})` : `rgba(40, 110, 220, ${gasOpacity})`);
      gasGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      bgCtx.fillStyle = gasGrad;
      bgCtx.beginPath();
      bgCtx.arc(sx, sy, gasSize, 0, Math.PI * 2);
      bgCtx.fill();
    }
  }
  bgCtx.restore();
  
  // 2. Draw soft glowing core backdrop with an extremely bright stellar nucleus
  bgCtx.save();
  bgCtx.scale(2.0, 0.85); // Elliptical tilt
  const grad = bgCtx.createRadialGradient(0, 0, 0, 0, 0, g.radius);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.85)");      // Stellar white center nucleus
  grad.addColorStop(0.06, "rgba(255, 235, 255, 0.65)");   // Core bulge glow
  grad.addColorStop(0.22, g.colorCore);                   // Core color (purple/teal)
  grad.addColorStop(0.6, g.colorOuter);                   // Outer arm color
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  
  bgCtx.fillStyle = grad;
  bgCtx.beginPath();
  bgCtx.arc(0, 0, g.radius, 0, Math.PI * 2);
  bgCtx.fill();
  bgCtx.restore();
  
  // 3. Draw 2 spiral arms of grainy stardust points
  const numArms = 2;
  const starsPerArm = 180; // High count for dense stardust noise look
  for (let arm = 0; arm < numArms; arm++) {
    const baseAngle = arm * Math.PI;
    for (let j = 0; j < starsPerArm; j++) {
      const factor = j / starsPerArm;
      const theta = factor * Math.PI * 2.8; // spiral wrap
      const r = factor * g.radius * 0.98;
      
      const jiggle = (Math.sin(j * 4) * 0.1) * (1 - factor); // natural noise
      const angle = baseAngle + theta + jiggle;
      const sx = Math.cos(angle) * r * 2.0;
      const sy = Math.sin(angle) * r * 0.85;
      
      // Grain sizing: specs of dust + unresolved stars
      const dotSize = Math.random() < 0.18 ? (Math.random() * 0.8 + 0.6) : (Math.random() * 0.4 + 0.2);
      const noiseOpacity = Math.random() * 0.65 + 0.15;
      const dotOpacity = (1 - factor) * noiseOpacity;
      
      // Muted cosmic color mix (purple/blue/white grains)
      let colorStr;
      const rand = Math.random();
      if (rand < 0.45) {
        colorStr = `rgba(255, 255, 255, ${dotOpacity})`;
      } else if (rand < 0.72) {
        colorStr = `rgba(160, 110, 255, ${dotOpacity * 0.95})`; // Muted purple
      } else {
        colorStr = `rgba(100, 200, 255, ${dotOpacity * 0.95})`; // Muted teal-blue
      }
      
      bgCtx.fillStyle = colorStr;
      bgCtx.beginPath();
      bgCtx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      bgCtx.fill();
    }
  }
  
  // 4. Draw grainy core cluster (resolved stellar core)
  const coreGrains = 60;
  for (let i = 0; i < coreGrains; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.pow(Math.random(), 1.8) * (g.radius * 0.22);
    const sx = Math.cos(angle) * r * 2.0;
    const sy = Math.sin(angle) * r * 0.85;
    
    const size = Math.random() * 1.3 + 0.3;
    const opacity = (1 - r / (g.radius * 0.22)) * (Math.random() * 0.65 + 0.15);
    
    bgCtx.fillStyle = Math.random() > 0.4 ? `rgba(255, 255, 255, ${opacity})` : `rgba(240, 220, 255, ${opacity})`;
    bgCtx.beginPath();
    bgCtx.arc(sx, sy, size, 0, Math.PI * 2);
    bgCtx.fill();
  }
  
  // 5. Draw dark dust lane overlays (Great Rift style absorption lanes cutting the arms)
  bgCtx.fillStyle = "rgba(0, 0, 0, 0.42)";
  for (let i = 0; i < 3; i++) {
    bgCtx.beginPath();
    const offsetAngle = i * (Math.PI * 0.65);
    const dx = Math.cos(offsetAngle) * (g.radius * 0.3);
    const dy = Math.sin(offsetAngle) * (g.radius * 0.12);
    bgCtx.ellipse(dx, dy, g.radius * 0.2, g.radius * 0.06, offsetAngle + Math.PI / 15, 0, Math.PI * 2);
    bgCtx.fill();
  }
  
  bgCtx.restore();
}

function updateShootingStars() {
  // Occasional random shooting star (faster, longer, and highly bright)
  if (Math.random() < 0.0022 && shootingStars.length < 2) {
    shootingStars.push({
      x: Math.random() * (bgCanvas.width * 0.8),
      y: Math.random() * (bgCanvas.height * 0.3),
      len: Math.random() * 110 + 60, // Elegant long tail
      speed: Math.random() * 9 + 8, // Very fast streak
      angle: Math.PI / 6 + Math.random() * (Math.PI / 18),
      opacity: 1.0, // Maximum initial brightness
      fadeSpeed: Math.random() * 0.025 + 0.015
    });
  }
  
  // Render and advance shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    bgCtx.save();
    
    // Gradient trail for the shooting star
    const dx = Math.cos(ss.angle) * ss.len;
    const dy = Math.sin(ss.angle) * ss.len;
    const grad = bgCtx.createLinearGradient(ss.x, ss.y, ss.x - dx, ss.y - dy);
    grad.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    bgCtx.strokeStyle = grad;
    bgCtx.lineWidth = 2.0; // Thicker, brighter trail
    bgCtx.beginPath();
    bgCtx.moveTo(ss.x, ss.y);
    bgCtx.lineTo(ss.x - dx, ss.y - dy);
    bgCtx.stroke();
    
    // Draw bright meteor head circle
    bgCtx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
    bgCtx.beginPath();
    bgCtx.arc(ss.x, ss.y, 1.8, 0, Math.PI * 2);
    bgCtx.fill();
    
    bgCtx.restore();
    
    // Physics update
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.opacity -= ss.fadeSpeed;
    
    if (ss.opacity <= 0 || ss.x > bgCanvas.width || ss.y > bgCanvas.height) {
      shootingStars.splice(i, 1);
    }
  }
}

function tickUniverse() {
  const w = bgCanvas.width;
  const h = bgCanvas.height;
  
  // Clear Canvas to strictly deep space black
  bgCtx.fillStyle = "#000000";
  bgCtx.fillRect(0, 0, w, h);
  
  // 1. Render dim, slow spinning galaxies
  galaxies.forEach(g => {
    drawGalaxy(g);
  });
  
  // 2. Render drifting, twinkling stars with slow random walk movement
  stars.forEach(star => {
    // Apply very minor velocity nudge (Brownian walk)
    star.speedX += (Math.random() * 0.001 - 0.0005);
    star.speedY += (Math.random() * 0.001 - 0.0005);
    
    // Clamp velocities to maintain a slow, seamless drift speed
    const maxSpeed = star.isForeground ? 0.055 : 0.025;
    star.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, star.speedX));
    star.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, star.speedY));
    
    star.x += star.speedX;
    star.y += star.speedY;
    star.opacity += star.fadeSpeed;
    
    // Check custom bounds
    if (star.opacity <= star.minOpacity || star.opacity >= star.maxOpacity) {
      star.fadeSpeed *= -1;
    }
    
    // Clamp values
    star.opacity = Math.max(star.minOpacity, Math.min(star.maxOpacity, star.opacity));
    
    if (star.x < 0) star.x = w;
    if (star.x > w) star.x = 0;
    if (star.y < 0) star.y = h;
    if (star.y > h) star.y = 0;
    
    bgCtx.beginPath();
    bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    bgCtx.fillStyle = "#ffffff";
    bgCtx.globalAlpha = star.opacity;
    bgCtx.fill();
  });
  bgCtx.globalAlpha = 1.0;
  
  // 3. Render and advance shooting stars
  updateShootingStars();
  
  requestAnimationFrame(tickUniverse);
}

// 4. PROCEDURAL HIGH-RESOLUTION SATELLITE IMAGE PAINTER (Canvas Rendering)
// Upgraded canvas resolution to 500x500 for crisp details
function drawProceduralImage(canvasId, type, terrainData, seed = 0) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  const w = canvas.width = 500;
  const h = canvas.height = 500;
  
  const urbanRatio = (terrainData.urban || 0) / 100;
  const forestRatio = (terrainData.forest || 0) / 100;
  const desertRatio = (terrainData.desert || 0) / 100;
  const waterRatio = (terrainData.water || 0) / 100;
  
  ctx.fillStyle = "#040815";
  ctx.fillRect(0, 0, w, h);
  
  const r = (val) => {
    const x = Math.sin(val + seed) * 10000;
    return x - Math.floor(x);
  };
  
  if (type === "S2-Optical") {
    // True Color Optical representation with high details
    const step = 4; 
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        let n = r(x * 0.015 + y * 0.009);
        
        if (n < waterRatio) {
          ctx.fillStyle = `rgb(${Math.floor(8 + n * 10)}, ${Math.floor(35 + n * 15)}, ${Math.floor(100 + n * 30)})`; // Deep Ocean
        } else if (n < waterRatio + forestRatio) {
          ctx.fillStyle = `rgb(${Math.floor(10 + n * 12)}, ${Math.floor(80 + n * 25)}, ${Math.floor(25 + n * 10)})`; // Dense Forest
        } else if (n < waterRatio + forestRatio + desertRatio) {
          ctx.fillStyle = `rgb(${Math.floor(205 + n * 20)}, ${Math.floor(165 + n * 20)}, ${Math.floor(115 + n * 15)})`; // Desert Sands
        } else {
          let blockColor = r(x + y * 1.5) > 0.55 ? 135 : 155;
          ctx.fillStyle = `rgb(${blockColor}, ${blockColor - 12}, ${blockColor - 8})`;
        }
        ctx.fillRect(x, y, step, step);
      }
    }
    
    // Fine-lined structural building streets overlays
    if (urbanRatio > 0.2) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1.5;
      const spacing = 40;
      for (let i = spacing; i < w; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, h);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i); ctx.lineTo(w, i);
        ctx.stroke();
      }
    }
    
  } else if (type === "IR-Infrared") {
    // False-Color Near-Infrared (NIR) representation
    // Vegetation reflects NIR intensely (shown in bright red/crimson), water absorbs it (dark indigo/black)
    const step = 4;
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        let n = r(x * 0.015 + y * 0.009);
        
        if (n < waterRatio) {
          ctx.fillStyle = `rgb(${Math.floor(10 + n * 5)}, ${Math.floor(15 + n * 8)}, ${Math.floor(55 + n * 12)})`; // Indigo-black water
        } else if (n < waterRatio + forestRatio) {
          // Foliage = Bright Crimson Red / Hot Pink
          ctx.fillStyle = `rgb(${Math.floor(200 + n * 40)}, ${Math.floor(10 + n * 15)}, ${Math.floor(65 + n * 20)})`; 
        } else if (n < waterRatio + forestRatio + desertRatio) {
          ctx.fillStyle = `rgb(${Math.floor(175 + n * 20)}, ${Math.floor(145 + n * 15)}, ${Math.floor(135 + n * 15)})`; // Desert/Arid dirt
        } else {
          // Urban areas = Cool Cyan/Gray metallic returns
          let blockColor = r(x + y * 1.5) > 0.55 ? 125 : 145;
          ctx.fillStyle = `rgb(${blockColor - 30}, ${blockColor}, ${blockColor + 25})`;
        }
        ctx.fillRect(x, y, step, step);
      }
    }
    
    // HUD circles overlay
    ctx.strokeStyle = "rgba(157, 78, 221, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w/2, h/2, w * 0.32, 0, Math.PI*2);
    ctx.stroke();
    
  } else {
    // SAR Radar Grayscale representation (Sentinel-1)
    const step = 3;
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        let n = r(x * 0.02 + y * 0.01);
        let val = 0;
        
        if (n < waterRatio) {
          val = 12 + r(x + y) * 8; 
        } else if (n < waterRatio + forestRatio) {
          val = 65 + r(x - y) * 35; 
        } else if (n < waterRatio + forestRatio + desertRatio) {
          val = 35 + r(x * y) * 25; 
        } else {
          val = r(x + y * 1.2) > 0.62 ? 225 + r(x) * 20 : 55 + r(y) * 30;
        }
        
        ctx.fillStyle = `rgb(${val * 0.82}, ${val * 0.98}, ${val * 0.98})`;
        ctx.fillRect(x, y, step, step);
      }
    }
    
    // HUD circles overlay
    ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w/2, h/2, w * 0.35, 0, Math.PI*2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(w/2, h/2, w * 0.15, 0, Math.PI*2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.stroke();
  }
}

// 5. TERMINAL LOG FEED
const logsContainer = document.getElementById("terminal-logs");

function addLog(text, type = "info") {
  const line = document.createElement("div");
  line.className = `log-entry ${type}`;
  line.innerText = text;
  logsContainer.appendChild(line);
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

function streamLog(text, type = "info", delay = 8) {
  return new Promise((resolve) => {
    const line = document.createElement("div");
    line.className = `log-entry ${type}`;
    line.innerText = "";
    logsContainer.appendChild(line);
    
    let index = 0;
    function typeChar() {
      if (index < text.length) {
        line.innerText += text.charAt(index);
        index++;
        setTimeout(typeChar, delay);
      } else {
        logsContainer.scrollTop = logsContainer.scrollHeight;
        resolve();
      }
    }
    typeChar();
  });
}

function clearLogs() {
  logsContainer.innerHTML = "";
  addLog("ASTRONOVA SATELLITE CORE SYSTEM TERMINAL CLEARED.", "info");
}

const terminalInput = document.getElementById("terminal-input");
terminalInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const cmd = terminalInput.value.trim();
    terminalInput.value = "";
    if (!cmd) return;
    
    addLog(`ASTRONOVA$ ${cmd}`, "cmd");
    
    const parts = cmd.split(" ");
    const commandName = parts[0].toLowerCase();
    
    switch (commandName) {
      case "/help":
        addLog("AVAILABLE COMMANDS:", "info");
        addLog("  /scan          - Trigger cross-modal retrieval scan", "info");
        addLog("  /clear         - Clear terminal console logs", "info");
        addLog("  /system-info   - Display core network attributes", "info");
        break;
      case "/scan":
        if (state.activeTarget) {
          triggerRetrievalPipeline(state.activeTarget);
        }
        break;
      case "/clear":
        clearLogs();
        break;
      case "/system-info":
        addLog("SYSTEM PARAMETERS:", "info");
        addLog(`  PATHWAY: ${state.modality}`, "info");
        addLog(`  MODEL  : AstroNova Cross-Modal ResNet-V4`, "info");
        addLog(`  IMG    : 500x500 HIGH-DPI SHARP INSPECTION`, "info");
        break;
      default:
        addLog(`COMMAND NOT RECOGNIZED. TYPE /help FOR LIST.`, "warn");
    }
  }
});

// Helper to map code to display text
function getModalityName(mod) {
  if (mod === "S1") return "SAR (S1)";
  if (mod === "S2") return "OPTICAL (S2)";
  if (mod === "IR") return "INFRARED (IR)";
  return mod;
}

// Helper to translate short modality terms to procedural renderer categories
function mapSensorToProceduralType(sensorCode) {
  if (sensorCode === "S1") return "S1-SAR";
  if (sensorCode === "S2") return "S2-Optical";
  if (sensorCode === "IR") return "IR-Infrared";
  return "S2-Optical";
}

// 6. PIPELINE CONTROLLER
async function triggerRetrievalPipeline(targetObj) {
  if (state.isScanning) return;
  state.isScanning = true;
  
  state.activeTarget = targetObj;
  
  // 1. Reset matches status
  const resultNodes = document.querySelectorAll(".result-node");
  resultNodes.forEach(node => {
    node.classList.add("disabled-node");
  });
  
  // 2. Clear terminal and log retrieval
  clearLogs();
  await streamLog(`// INITIATING CROSS-MODAL RETRIEVAL SEQUENCE`, "warn", 5);
  await streamLog(`[SYSTEM]: LOCKING MODALITY PATHWAY: ${state.modality}`, "info", 5);
  await streamLog(`[TENSOR]: COMPUTING HIGH-RESOLUTION ALIGNMENT GRIDS...`, "info", 5);
  
  // Update Horizontal Metadata bar
  const coordsText = `${Math.abs(targetObj.lat).toFixed(4)}° ${targetObj.lat >= 0 ? "N" : "S"}, ${Math.abs(targetObj.lon).toFixed(4)}° ${targetObj.lon >= 0 ? "E" : "W"}`;
  const cloudsText = `${targetObj.clouds.toFixed(2)}%`;
  const seasonText = targetObj.season.toUpperCase();
  
  const elCoords = document.getElementById("meta-coords");
  const elClouds = document.getElementById("meta-clouds");
  const elSeason = document.getElementById("meta-season");
  
  if (elCoords) elCoords.innerText = coordsText;
  if (elClouds) elClouds.innerText = cloudsText;
  if (elSeason) elSeason.innerText = seasonText;
  
  // Draw Central Query high-res image
  const [fromCode, toCode] = state.modality.split("-to-");
  const queryCanvasId = "canvas-query-image";
  const queryImageType = mapSensorToProceduralType(fromCode);
  drawProceduralImage(queryCanvasId, queryImageType, targetObj.terrain, 42);
  
  let retrievalResponse;
  const startTime = performance.now();
  
  if (API_CONFIG.ENABLED) {
    try {
      addLog(`[CONNECT]: CONTACTING LOCAL API LINK ENCODER...`, "info");
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RETRIEVE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: targetObj.id,
          modality: state.modality,
          coordinates: { lat: targetObj.lat, lon: targetObj.lon }
        })
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      retrievalResponse = await response.json();
    } catch (err) {
      addLog(`[BRIDGE FAILED]: LOADING LOCAL SIMULATION DATASETS...`, "warn");
      retrievalResponse = targetObj;
    }
  } else {
    await new Promise(r => setTimeout(r, 450));
    retrievalResponse = targetObj;
  }
  
  const endTime = performance.now();
  const latency = (endTime - startTime).toFixed(2);
  document.getElementById("latency-val").innerText = `LATENCY: ${latency} ms`;
  
  // Populate surrounding results
  await streamLog(`[NEIGHBORS]: INDEXING COSINE EMBEDDING SPACE MATCHES...`, "info", 5);
  
  for (let i = 0; i < 5; i++) {
    const res = retrievalResponse.results[i];
    const nodeIndex = i + 1;
    const nodeEl = document.getElementById(`node-result-${nodeIndex}`);
    
    // Draw matching procedural image
    const canvasId = `canvas-result-${nodeIndex}`;
    const resultImageType = mapSensorToProceduralType(toCode);
    drawProceduralImage(canvasId, resultImageType, retrievalResponse.terrain, res.seed);
    
    // Circle rings offset calculations
    const ringFill = document.getElementById(`ring-fill-${nodeIndex}`);
    const dashArray = 503; 
    const percentage = res.confidence / 100;
    const offset = dashArray - (dashArray * percentage);
    
    ringFill.style.strokeDashoffset = offset;
    document.getElementById(`val-conf-${nodeIndex}`).innerText = `${res.confidence}%`;
    
    nodeEl.classList.remove("disabled-node");
    await new Promise(r => setTimeout(r, 60)); 
  }
  
  await streamLog(`[SUCCESS]: RETRIEVAL PIPELINE SECURED. OUTPUT NODES ACTIVE.`, "info", 5);
  state.isScanning = false;
}

// 7. SENSOR MODALITY PATHWAY CONTROLLER (Static Side Layouts)
function triggerModalityChange(pathway) {
  if (state.isScanning) return;
  
  const shell = document.getElementById("system-shell");
  const glitch = document.getElementById("glitch-overlay");
  
  glitch.classList.add("glitch-active");
  
  setTimeout(() => {
    state.modality = pathway;
    
    // Swap accent theme triggers (S1/S2/IR styles)
    // Applying flipped modality styling values ONLY for colors, grid sides never swap!
    if (pathway.startsWith("S2") || pathway.startsWith("IR")) {
      shell.classList.add("flipped-layout");
    } else {
      shell.classList.remove("flipped-layout");
    }
    
    // Update headers text labels
    const [fromCode, toCode] = pathway.split("-to-");
    document.querySelector(".s1-tag").innerText = `MODALITY A: ${getModalityName(fromCode)}`;
    document.querySelector(".s2-tag").innerText = `MODALITY B: ${getModalityName(toCode)}`;
    document.getElementById("hex-grid-title").innerText = `RETRIEVAL NEIGHBORHOOD MAP (${getModalityName(toCode)} MATCH)`;
    
    // Re-run scan with active target
    if (state.activeTarget) {
      triggerRetrievalPipeline(state.activeTarget);
    }
    
  }, 400); 
  
  setTimeout(() => {
    glitch.classList.remove("glitch-active");
  }, 800);
}

// 8. IMAGE EXPAND LIGHTBOX COMPONENT
const lightbox = document.getElementById("image-lightbox");
const lightboxCanvas = document.getElementById("lightbox-canvas");
const lightboxCtx = lightboxCanvas.getContext("2d");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxLabel = document.getElementById("lightbox-label");
const lightboxMeta = document.getElementById("lightbox-metadata");

// Set modal canvas high resolution
lightboxCanvas.width = 500;
lightboxCanvas.height = 500;

function openImageInspection(sourceCanvas, labelText, targetData) {
  lightboxCtx.clearRect(0, 0, 500, 500);
  
  // Copy 500x500 high-res pixels directly from clicked canvas (retains razor sharpness)
  lightboxCtx.drawImage(sourceCanvas, 0, 0, 500, 500);
  
  lightboxLabel.innerText = labelText.toUpperCase() + " INSPECTION LOCK";
  const coordString = `${Math.abs(targetData.lat).toFixed(4)}° ${targetData.lat >= 0 ? "N" : "S"}, ${Math.abs(targetData.lon).toFixed(4)}° ${targetData.lon >= 0 ? "E" : "W"}`;
  lightboxMeta.innerText = `COORDINATES: ${coordString} | CLOUD COVER: ${targetData.clouds.toFixed(2)}% | SEASON: ${targetData.season.toUpperCase()}`;
  
  lightbox.classList.add("show");
}

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("show");
  }
});

// Bind click listener for central query hexagon node
document.getElementById("node-query").addEventListener("click", () => {
  if (state.activeTarget) {
    const [fromCode] = state.modality.split("-to-");
    const sensorLabel = `${getModalityName(fromCode)} INPUT SCAN`;
    openImageInspection(document.getElementById("canvas-query-image"), sensorLabel, state.activeTarget);
  }
});

// Bind click listeners for 5 surrounding circle match nodes
for (let i = 1; i <= 5; i++) {
  document.getElementById(`node-result-${i}`).addEventListener("click", () => {
    const nodeEl = document.getElementById(`node-result-${i}`);
    if (state.activeTarget && !nodeEl.classList.contains("disabled-node")) {
      const [_, toCode] = state.modality.split("-to-");
      const matchLabel = `MATCH 0${i} ${getModalityName(toCode)} OUTPUT`;
      openImageInspection(document.getElementById(`canvas-result-${i}`), matchLabel, state.activeTarget);
    }
  });
}

// 9. EVENTS REGISTRATION
document.getElementById("modality-selector").addEventListener("change", (e) => {
  const pathway = e.target.value;
  if (pathway) {
    triggerModalityChange(pathway);
  }
});

const btnUpload = document.getElementById("btn-upload-trigger");
const fileInput = document.getElementById("source-upload");

btnUpload.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  addLog(`[UPLOAD]: RECEIVED SOURCE FILE ${file.name.toUpperCase()}`, "info");
  
  // Custom mock file metadata loader
  const targetKeys = Object.keys(TARGET_DIRECTORY);
  const randomKey = targetKeys[Math.floor(Math.random() * targetKeys.length)];
  triggerRetrievalPipeline(TARGET_DIRECTORY[randomKey]);
});

// 10. INITIALIZATION
window.addEventListener("load", () => {
  initUniverse();
  addLog("ASTRONOVA SATELLITE CORE SYSTEM ONLINE.", "info");
  
  // Load Default Tokyo target initially
  triggerRetrievalPipeline(TARGET_DIRECTORY.tokyo);
});
