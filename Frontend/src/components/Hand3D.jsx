import { useEffect, useRef, useState } from "react";

// 3D coordinates for a left hand skeleton model
const initialJoints = {
  // Wrist / Carpals
  wrist: { x: 0, y: -130, z: 0 },
  carpalL: { x: -25, y: -110, z: -10 },
  carpalR: { x: 25, y: -110, z: 10 },
  carpalM: { x: 0, y: -95, z: 0 },

  // Metacarpals (knuckle bases)
  m1: { x: -50, y: -70, z: -20 }, // Thumb base
  m2: { x: -25, y: -50, z: -5 },  // Index base
  m3: { x: 0, y: -45, z: 5 },     // Middle base
  m4: { x: 25, y: -50, z: -5 },   // Ring base
  m5: { x: 48, y: -65, z: -20 },  // Pinky base

  // Knuckles (MCP joints) - Epiphyses
  mcp1: { x: -75, y: -30, z: -25 }, // Thumb MCP
  mcp2: { x: -35, y: 15, z: -5 },   // Index MCP
  mcp3: { x: -5, y: 28, z: 8 },     // Middle MCP
  mcp4: { x: 25, y: 20, z: -2 },    // Ring MCP
  mcp5: { x: 52, y: 2, z: -12 },    // Pinky MCP

  // Thumb joints
  ip1: { x: -90, y: 0, z: -28 },    // Thumb IP
  tip1: { x: -105, y: 22, z: -32 },  // Thumb Tip

  // Index joints
  pip2: { x: -45, y: 60, z: -5 },   // Index PIP
  dip2: { x: -50, y: 95, z: -5 },   // Index DIP
  tip2: { x: -53, y: 120, z: -5 },  // Index Tip

  // Middle joints
  pip3: { x: -5, y: 78, z: 10 },    // Middle PIP
  dip3: { x: -5, y: 120, z: 10 },   // Middle DIP
  tip3: { x: -5, y: 148, z: 10 },   // Middle Tip

  // Ring joints
  pip4: { x: 30, y: 65, z: -2 },    // Ring PIP
  dip4: { x: 32, y: 105, z: -2 },    // Ring DIP
  tip4: { x: 33, y: 130, z: -2 },   // Ring Tip

  // Pinky joints
  pip5: { x: 65, y: 40, z: -12 },   // Pinky PIP
  dip5: { x: 72, y: 72, z: -15 },   // Pinky DIP
  tip5: { x: 76, y: 96, z: -18 },   // Pinky Tip
};

const bones = [
  // Carpal cluster
  ["wrist", "carpalL"], ["wrist", "carpalR"],
  ["carpalL", "carpalM"], ["carpalR", "carpalM"],
  ["carpalL", "m1"], ["carpalM", "m2"], ["carpalM", "m3"],
  ["carpalM", "m4"], ["carpalR", "m5"],

  // Metacarpals
  ["m1", "mcp1"], ["m2", "mcp2"], ["m3", "mcp3"], ["m4", "mcp4"], ["m5", "mcp5"],

  // Thumb
  ["mcp1", "ip1"], ["ip1", "tip1"],

  // Index
  ["mcp2", "pip2"], ["pip2", "dip2"], ["dip2", "tip2"],

  // Middle
  ["mcp3", "pip3"], ["pip3", "dip3"], ["dip3", "tip3"],

  // Ring
  ["mcp4", "pip4"], ["pip4", "dip4"], ["dip4", "tip4"],

  // Pinky
  ["mcp5", "pip5"], ["pip5", "dip5"], ["dip5", "tip5"],
];

// Identify growth plate / epiphyseal joint locations to highlight
const growthPlates = [
  { joint: "mcp2", label: "MCP-2 Epiphysis" },
  { joint: "mcp3", label: "MCP-3 Epiphysis" },
  { joint: "mcp4", label: "MCP-4 Epiphysis" },
  { joint: "pip2", label: "PIP-2 Epiphysis" },
  { joint: "pip3", label: "PIP-3 Epiphysis" },
  { joint: "pip4", label: "PIP-4 Epiphysis" },
  { joint: "dip3", label: "DIP-3 Epiphysis" },
  { joint: "wrist", label: "Distal Radius" },
];

export default function Hand3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, px: 0.5, py: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let time = 0;
    let baseAngleY = 0;
    let angleX = 0.2; // slight tilt
    let angleY = 0;
    let currentScale = 1.3;

    // Create background floating dust particles
    const particleCount = 35;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 200,
        speedY: 0.2 + Math.random() * 0.4,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.4,
      });
    }

    // Feature-activation pulses traveling along bones (ML inference visualization)
    const activationPulses = bones.slice(0, 12).map((bone, i) => ({
      bone,
      progress: (i * 0.08) % 1,
      speed: 0.004 + (i % 4) * 0.0015,
    }));

    // Convolution kernel sweep position (EfficientNet feature map scan)
    let convScanY = -0.15;
    let convScanDir = 1;

    // Gender-fusion node pulse phase
    let fusionPhase = 0;

    // Active growth plate index for HUD targeting indicator
    let hudTargetIdx = 1;
    let hudTargetTimer = 0;

    // Rotation helper matrices
    const rotateY = (x, y, z, theta) => {
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      return [x * cos - z * sin, y, x * sin + z * cos];
    };

    const rotateX = (x, y, z, phi) => {
      const cos = Math.cos(phi);
      const sin = Math.sin(phi);
      return [x, y * cos - z * sin, y * sin + z * cos];
    };

    const rotateZ = (x, y, z, psi) => {
      const cos = Math.cos(psi);
      const sin = Math.sin(psi);
      return [x * cos - y * sin, x * sin + y * cos, z];
    };

    const project = (x, y, z, width, height, floatOffset) => {
      const fov = 420;
      const depthBoost = 1 + mouseRef.current.x * 0.06;
      const projectedY = y + floatOffset;
      const factor = (fov * depthBoost) / (fov + z);
      const px = (x * factor * currentScale) + width / 2;
      const py = (-projectedY * factor * currentScale) + height / 2;
      return [px, py, factor];
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Update angles
      time += 0.02;
      fusionPhase += 0.03;
      hudTargetTimer += 1;
      if (hudTargetTimer > 180) {
        hudTargetIdx = (hudTargetIdx + 1) % growthPlates.length;
        hudTargetTimer = 0;
      }

      // Convolution kernel vertical sweep
      convScanY += 0.003 * convScanDir;
      if (convScanY > 1.15) convScanDir = -1;
      if (convScanY < -0.15) convScanDir = 1;

      // Advance feature-activation pulses along bones
      activationPulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;
      });

      // Smoothly update mouse coordinates (higher responsiveness)
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.12;

      // Base rotation + strong mouse-driven 3D parallax (pitch, yaw, roll)
      baseAngleY += hovered ? 0.003 : 0.007;
      angleY = baseAngleY + mouseRef.current.x * 2.2;
      angleX = 0.2 + mouseRef.current.y * 1.8;
      const angleZ = mouseRef.current.x * 0.65;
      currentScale = 1.3 + Math.abs(mouseRef.current.x) * 0.06 + Math.abs(mouseRef.current.y) * 0.04;

      // Sine wave for floating effect
      const floatOffset = Math.sin(time * 1.5) * 12;

      // Clear with dark tech radial gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 350);
      bgGrad.addColorStop(0, "#0b1528");
      bgGrad.addColorStop(1, "#070c16");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw digital scanner Grid lines (background)
      ctx.strokeStyle = "rgba(13, 148, 136, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw tech circle overlay on background
      ctx.strokeStyle = "rgba(13, 148, 136, 0.06)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 220, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(13, 148, 136, 0.03)";
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 240, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Mouse-following X-ray spotlight (depth-aware illumination)
      const spotX = mouseRef.current.px * width;
      const spotY = mouseRef.current.py * height;
      const spotGrad = ctx.createRadialGradient(spotX, spotY, 20, spotX, spotY, 220);
      spotGrad.addColorStop(0, "rgba(45, 212, 191, 0.14)");
      spotGrad.addColorStop(0.45, "rgba(13, 148, 136, 0.06)");
      spotGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Update and Draw Background Particles
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y > 220) p.y = -220; // reset to bottom

        // Rotate particle
        let [rx, ry, rz] = rotateY(p.x, p.y, p.z, angleY);
        [rx, ry, rz] = rotateX(rx, ry, rz, angleX);
        [rx, ry, rz] = rotateZ(rx, ry, rz, angleZ);

        const [px, py] = project(rx, ry, rz, width, height, floatOffset);

        ctx.fillStyle = `rgba(45, 212, 191, ${p.opacity * (1 - rz / 300)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (1 - rz / 400), 0, Math.PI * 2);
        ctx.fill();
      });

      // Transform all joints into projected 2D coordinates
      const projected = {};
      Object.keys(initialJoints).forEach((key) => {
        const j = initialJoints[key];
        // Rotate around Y (yaw)
        let [rx, ry, rz] = rotateY(j.x, j.y, j.z, angleY);
        // Rotate around X (pitch)
        [rx, ry, rz] = rotateX(rx, ry, rz, angleX);
        // Rotate around Z (roll)
        [rx, ry, rz] = rotateZ(rx, ry, rz, angleZ);
        // Project
        const [px, py, scale] = project(rx, ry, rz, width, height, floatOffset);
        projected[key] = { x: px, y: py, z: rz, scale };
      });

      // Ground shadow for 3D depth anchoring
      const wristPt = projected.wrist;
      if (wristPt) {
        const shadowGrad = ctx.createRadialGradient(
          wristPt.x, height / 2 + 90, 0,
          wristPt.x, height / 2 + 90, 140,
        );
        shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.35)");
        shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(wristPt.x, height / 2 + 90, 130, 28, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Depth-sorted bones for correct 3D overlap
      const sortedBones = [...bones]
        .map(([jointA, jointB]) => {
          const ptA = projected[jointA];
          const ptB = projected[jointB];
          const avgZ = ptA && ptB ? (ptA.z + ptB.z) / 2 : 0;
          return { jointA, jointB, avgZ };
        })
        .sort((a, b) => b.avgZ - a.avgZ);

      // 2. Draw Tapered 3D bones (skeleton hand structure)
      sortedBones.forEach(({ jointA, jointB }) => {
        const ptA = projected[jointA];
        const ptB = projected[jointB];
        if (!ptA || !ptB) return;

        const dx = ptB.x - ptA.x;
        const dy = ptB.y - ptA.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;

        const ux = -dy / len;
        const uy = dx / len;

        // Bone widths tapered in the middle and scaled by depth perspective
        const wA = 9.5 * ptA.scale;
        const wB = 9.5 * ptB.scale;
        const wM = 4.2 * ((ptA.scale + ptB.scale) / 2);

        const midX = (ptA.x + ptB.x) / 2;
        const midY = (ptA.y + ptB.y) / 2;

        const p1x = ptA.x + ux * wA;
        const p1y = ptA.y + uy * wA;
        const p2x = midX + ux * wM;
        const p2y = midY + uy * wM;
        const p3x = ptB.x + ux * wB;
        const p3y = ptB.y + uy * wB;
        const p4x = ptB.x - ux * wB;
        const p4y = ptB.y - uy * wB;
        const p5x = midX - ux * wM;
        const p5y = midY - uy * wM;
        const p6x = ptA.x - ux * wA;
        const p6y = ptA.y - uy * wA;

        const avgZ = (ptA.z + ptB.z) / 2;
        const depthOpacity = Math.max(0.18, 1 - avgZ / 260);

        // Draw bone outline glow
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.quadraticCurveTo(p2x, p2y, p3x, p3y);
        ctx.lineTo(p4x, p4y);
        ctx.quadraticCurveTo(p5x, p5y, p6x, p6y);
        ctx.closePath();
        ctx.strokeStyle = `rgba(13, 148, 136, ${0.15 * depthOpacity})`;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Create realistic X-ray 3D cylindrical density gradient (dense cortex edge, translucent medulla marrow)
        const boneGrad = ctx.createLinearGradient(p5x, p5y, p2x, p2y);
        boneGrad.addColorStop(0, `rgba(45, 212, 191, ${0.45 * depthOpacity})`); // Dense edge
        boneGrad.addColorStop(0.18, `rgba(255, 255, 255, ${0.68 * depthOpacity})`); // Core cortex boundary
        boneGrad.addColorStop(0.5, `rgba(45, 212, 191, ${0.12 * depthOpacity})`); // Translucent center
        boneGrad.addColorStop(0.82, `rgba(255, 255, 255, ${0.68 * depthOpacity})`); // Core cortex boundary
        boneGrad.addColorStop(1, `rgba(45, 212, 191, ${0.45 * depthOpacity})`); // Dense edge

        ctx.fillStyle = boneGrad;
        ctx.fill();

        ctx.strokeStyle = `rgba(45, 212, 191, ${0.35 * depthOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Overlay joint caps for realism
        const drawJointCap = (pt, widthVal) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, widthVal, 0, Math.PI * 2);
          const capGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, widthVal);
          capGrad.addColorStop(0, `rgba(255, 255, 255, ${0.35 * depthOpacity})`);
          capGrad.addColorStop(0.6, `rgba(45, 212, 191, ${0.25 * depthOpacity})`);
          capGrad.addColorStop(1, `rgba(45, 212, 191, 0.02)`);
          ctx.fillStyle = capGrad;
          ctx.fill();
        };

        drawJointCap(ptA, wA);
        drawJointCap(ptB, wB);
      });

      // 2b. Feature-activation pulses (neural signal along bone segments)
      activationPulses.forEach(({ bone: [jointA, jointB], progress }) => {
        const ptA = projected[jointA];
        const ptB = projected[jointB];
        if (!ptA || !ptB) return;

        const px = ptA.x + (ptB.x - ptA.x) * progress;
        const py = ptA.y + (ptB.y - ptA.y) * progress;
        const avgZ = (ptA.z + ptB.z) / 2;
        const depthOpacity = Math.max(0.3, 1 - avgZ / 260);
        const pulseSize = 5 + Math.sin(time * 8 + progress * 10) * 2;

        const pulseGrad = ctx.createRadialGradient(px, py, 0, px, py, pulseSize * 2.5);
        pulseGrad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * depthOpacity})`);
        pulseGrad.addColorStop(0.4, `rgba(45, 212, 191, ${0.55 * depthOpacity})`);
        pulseGrad.addColorStop(1, "rgba(45, 212, 191, 0)");
        ctx.fillStyle = pulseGrad;
        ctx.beginPath();
        ctx.arc(px, py, pulseSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2c. EfficientNet convolution kernel sweep overlay
      const kernelH = 72;
      const kernelY = convScanY * (height + kernelH) - kernelH / 2;
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
      ctx.fillStyle = "rgba(6, 182, 212, 0.04)";
      ctx.lineWidth = 1;
      ctx.fillRect(width * 0.18, kernelY, width * 0.64, kernelH);
      ctx.strokeRect(width * 0.18, kernelY, width * 0.64, kernelH);
      const cell = 12;
      for (let gx = width * 0.18; gx < width * 0.82; gx += cell) {
        for (let gy = kernelY; gy < kernelY + kernelH; gy += cell) {
          ctx.strokeRect(gx, gy, cell, cell);
        }
      }
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(6, 182, 212, 0.7)";
      ctx.textAlign = "left";
      ctx.fillText("CONV-BLOCK SCAN", width * 0.2, kernelY + 14);
      ctx.restore();

      // 3. Draw Joint Nodes and Growth Plates (Epiphyses)
      Object.keys(projected).forEach((key) => {
        const pt = projected[key];
        const depthOpacity = Math.max(0.25, 1 - pt.z / 250);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5 * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * depthOpacity})`;
        ctx.shadowColor = "#2dd4bf";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // 4. Render Growth Plates with attention heatmap (mouse-proximity boost)
      growthPlates.forEach(({ joint, label }) => {
        const pt = projected[joint];
        if (!pt) return;

        const depthOpacity = Math.max(0.3, 1 - pt.z / 250);

        // Attention heatmap — brighter when cursor is near the joint
        const dx = pt.x - spotX;
        const dy = pt.y - spotY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const attention = Math.max(0, 1 - dist / 120);

        if (attention > 0.05) {
          const heatGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 28 + attention * 18);
          heatGrad.addColorStop(0, `rgba(245, 158, 11, ${0.35 * attention})`);
          heatGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.fillStyle = heatGrad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 28 + attention * 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Find direction of bone segment to draw growth plate perpendicular
        // We find connected bone to calculate orientation
        const bone = bones.find((b) => b[1] === joint || b[0] === joint);
        let angle = 0;
        if (bone) {
          const sibling = projected[bone[0] === joint ? bone[1] : bone[0]];
          if (sibling) {
            angle = Math.atan2(pt.y - sibling.y, pt.x - sibling.x);
          }
        }

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle + Math.PI / 2); // perpendicular angle

        // A. Translucent gold/amber background capsule
        ctx.beginPath();
        ctx.ellipse(0, 0, 10 * pt.scale, 3.2 * pt.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${0.65 * depthOpacity})`;
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.fill();

        // B. White core line
        ctx.beginPath();
        ctx.moveTo(-8 * pt.scale, 0);
        ctx.lineTo(8 * pt.scale, 0);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * depthOpacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
        ctx.shadowBlur = 0;
      });

      // 4b. Gender-fusion node (ML branch indicator)
      const fusionX = width * 0.82;
      const fusionY = height * 0.18;
      const fusionPulse = 0.5 + Math.sin(fusionPhase) * 0.5;
      ctx.beginPath();
      ctx.arc(fusionX, fusionY, 14 + fusionPulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.35 + fusionPulse * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fusionX, fusionY, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192, 132, 252, ${0.6 + fusionPulse * 0.3})`;
      ctx.fill();
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "rgba(192, 132, 252, 0.85)";
      ctx.textAlign = "center";
      ctx.fillText("GENDER", fusionX, fusionY + 22);
      ctx.fillText("FUSION 32D", fusionX, fusionY + 31);

      // Connector from fusion node toward hand centroid
      const cx = width / 2 + mouseRef.current.x * 30;
      const cy = height / 2 + mouseRef.current.y * 20;
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 + fusionPulse * 0.15})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(fusionX - 10, fusionY + 5);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Draw active Target HUD scanner overlay on the selected growth plate
      const activePlate = growthPlates[hudTargetIdx];
      const targetPt = projected[activePlate.joint];
      if (targetPt) {
        // Rotating reticle ring
        ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(targetPt.x, targetPt.y, 20, time * 2, time * 2 + Math.PI * 0.4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(targetPt.x, targetPt.y, 20, time * 2 + Math.PI, time * 2 + Math.PI * 1.4);
        ctx.stroke();

        // Static bounds box corners
        const boxSize = 14;
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 1;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(targetPt.x - boxSize, targetPt.y - boxSize + 4);
        ctx.lineTo(targetPt.x - boxSize, targetPt.y - boxSize);
        ctx.lineTo(targetPt.x - boxSize + 4, targetPt.y - boxSize);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(targetPt.x + boxSize, targetPt.y - boxSize + 4);
        ctx.lineTo(targetPt.x + boxSize, targetPt.y - boxSize);
        ctx.lineTo(targetPt.x + boxSize - 4, targetPt.y - boxSize);
        ctx.stroke();
        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(targetPt.x - boxSize, targetPt.y + boxSize - 4);
        ctx.lineTo(targetPt.x - boxSize, targetPt.y + boxSize);
        ctx.lineTo(targetPt.x - boxSize + 4, targetPt.y + boxSize);
        ctx.stroke();
        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(targetPt.x + boxSize, targetPt.y + boxSize - 4);
        ctx.lineTo(targetPt.x + boxSize, targetPt.y + boxSize);
        ctx.lineTo(targetPt.x + boxSize - 4, targetPt.y + boxSize);
        ctx.stroke();

        // Connector line to text HUD panel
        const hudX = targetPt.x + (targetPt.x > width / 2 ? -180 : 80);
        const hudY = targetPt.y - 50;

        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(targetPt.x + (targetPt.x > width / 2 ? -20 : 20), targetPt.y);
        ctx.lineTo(hudX, hudY);
        ctx.lineTo(hudX + (targetPt.x > width / 2 ? -60 : 60), hudY);
        ctx.stroke();

        // Draw HUD details
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "#2dd4bf";
        const align = targetPt.x > width / 2 ? "right" : "left";
        ctx.textAlign = align;
        ctx.fillText("EFFICIENTNET-B3 ROI", hudX, hudY - 14);

        ctx.font = "11px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(activePlate.label.toUpperCase(), hudX, hudY - 3);

        ctx.font = "9px monospace";
        ctx.fillStyle = "#fbbf24";
        const fusionPercent = Math.round(62 + Math.sin(time + hudTargetIdx) * 25);
        ctx.fillText(`MATURATION IDX: ${fusionPercent}%`, hudX, hudY + 11);
        ctx.fillStyle = "#c084fc";
        ctx.fillText(`1536D + 32D → 1568D`, hudX, hudY + 23);
      }

      // 6. Draw HUD Border/Frame around the entire canvas view screen
      ctx.textAlign = "left";
      ctx.strokeStyle = "rgba(13, 148, 136, 0.25)";
      ctx.lineWidth = 1.5;
      const pad = 15;
      // Top-Left corner
      ctx.beginPath();
      ctx.moveTo(pad + 20, pad); ctx.lineTo(pad, pad); ctx.lineTo(pad, pad + 20); ctx.stroke();
      // Top-Right corner
      ctx.beginPath();
      ctx.moveTo(width - pad - 20, pad); ctx.lineTo(width - pad, pad); ctx.lineTo(width - pad, pad + 20); ctx.stroke();
      // Bottom-Left corner
      ctx.beginPath();
      ctx.moveTo(pad + 20, height - pad); ctx.lineTo(pad, height - pad); ctx.lineTo(pad, height - pad + 20); ctx.stroke();
      // Bottom-Right corner
      ctx.beginPath();
      ctx.moveTo(width - pad - 20, height - pad); ctx.lineTo(width - pad, height - pad); ctx.lineTo(width - pad, height - pad + 20); ctx.stroke();

      // Top Scan line status text
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "rgba(45, 212, 191, 0.6)";
      ctx.fillText("BONEAGENET.INFER", pad + 15, pad + 15);
      ctx.textAlign = "right";
      ctx.fillText("TTA · AMP · ON", width - pad - 15, pad + 15);

      // Bottom dynamic system data
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText(`PITCH: ${angleX.toFixed(2)} · YAW: ${(angleY % (Math.PI * 2)).toFixed(2)}`, pad + 15, height - pad - 12);
      ctx.textAlign = "right";
      ctx.fillText(`EFFICIENTNET-B3 · MAE 8.01mo`, width - pad - 15, height - pad - 12);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hovered]);

  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseRef.current.tx = x - 0.5;
    mouseRef.current.ty = y - 0.5;
    mouseRef.current.px = x;
    mouseRef.current.py = y;

    setTilt({
      rotateX: (y - 0.5) * -14,
      rotateY: (x - 0.5) * 14,
    });
  };

  const handlePointerEnter = () => {
    setHovered(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    mouseRef.current.tx = 0;
    mouseRef.current.ty = 0;
    mouseRef.current.px = 0.5;
    mouseRef.current.py = 0.5;
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl border border-teal-500/25 bg-slate-950 p-1 shadow-2xl shadow-teal-500/10 transition-[border-color,box-shadow] duration-300 hover:border-teal-500/40 hover:shadow-teal-500/20"
      style={{
        perspective: "1100px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="h-full w-full transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
        }}
      >
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="h-full w-full cursor-crosshair rounded-xl object-cover"
        aria-label="3D interactive pediatric hand X-ray simulation with EfficientNet feature extraction, gender fusion, and epiphyseal growth plate analysis"
      />
      </div>
      {/* Decorative pulse glow background */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient-to-tr from-teal-500/5 via-transparent to-transparent opacity-60" />
    </div>
  );
}
