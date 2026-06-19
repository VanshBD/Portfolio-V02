// All GLSL shaders for THE ORGANISM.
// Exported as strings — used in
// THREE.ShaderMaterial and custom materials.

// ─── ORGANISM BODY SHADERS ─────────────────

export const ORGANISM_VERTEX = `
#ifdef GL_ES
precision mediump float;
#endif

// Uniforms from application:
uniform float uTime;          // elapsed time (seconds)
uniform float uBreathPhase;   // 0-1 breath cycle
uniform vec2  uMouse;         // mouse position (-1 to 1)
uniform float uPulseIntensity;// 0-1 pulse flash

// Varyings passed to fragment shader:
varying vec3  vNormal;        // world normal
varying vec3  vWorldPos;      // world position
varying vec2  vUv;            // UV coordinates
varying float vFresnel;       // edge detection
varying float vNoise;         // surface variation
varying float vThermal;       // cursor heat proximity

// ── SIMPLEX NOISE (2D) ───────────────────
// Embedded 2D simplex noise for vertex displacement.
// This avoids needing a texture for noise.

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  // (3.0-sqrt(3.0))/6.0
    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439   // 1.0/41.0
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ?
    vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ), 0.0
  );
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 -
    0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vUv = uv;
  // WORLD-SPACE normal (consistent with worldPos).
  // Note: transpose()/inverse() are GLSL ES 3.00 only and
  // THREE.ShaderMaterial emits GLSL ES 1.00, so we use
  // mat3(modelMatrix) — correct for the organism's uniform
  // scale (normalize() absorbs the scale factor).
  vec3 worldNormal = normalize(
    mat3(modelMatrix) * normal
  );
  vNormal = worldNormal; // now world-space

  // ── SURFACE NOISE DISPLACEMENT ──────────
  // Displace vertices using simplex noise
  // for organic, non-uniform surface:
  float noiseVal = snoise(
    normal.xy * 0.8 + uTime * 0.04
  );
  // Secondary noise layer for fine detail:
  float noiseDetail = snoise(
    normal.xy * 2.2 + uTime * 0.08
  ) * 0.4;
  float combinedNoise = noiseVal + noiseDetail;
  vNoise = combinedNoise;

  // ── BREATH DISPLACEMENT ─────────────────
  // Scale organism based on breath phase:
  // smoothstep makes breathing feel biological
  float breathScale = 1.0 +
    smoothstep(0.0, 1.0, uBreathPhase) * 0.03;

  // ── VERTEX DISPLACEMENT ─────────────────
  // Displace each vertex outward along normal:
  // noise: organic surface variation (kept gentle so the
  //   surface stays a smooth living blob, not a shattered shell)
  // breath: scale breathing
  vec3 displaced = position
    + normal * combinedNoise * 0.05  // noise
    + normal * breathScale * 0.005;  // breath nudge

  // ── WORLD POSITION ─────────────────────
  vec4 worldPos4 = modelMatrix *
    vec4(displaced, 1.0);
  vWorldPos = worldPos4.xyz;

  // ── FRESNEL (EDGE GLOW) ─────────────────
  // How much does this vertex face away from camera?
  // High fresnel = edge = glows brighter
  vec3 viewDir = normalize(
    cameraPosition - worldPos4.xyz
  );
  // Both worldNormal and viewDir are now world-space
  vFresnel = 1.0 - max(dot(worldNormal, viewDir), 0.0);
  // Power 2 sharpens the edge effect:
  vFresnel = pow(vFresnel, 2.0);

  // ── THERMAL CURSOR ─────────────────────
  // Distance from vertex to mouse position.
  // uMouse is in normalized device coords (-1 to 1)
  // Convert world pos to comparable coords:
  vec2 worldXY = worldPos4.xy;
  vec2 mouseWorld = uMouse * 1.5;
  // Rough scale: mouse at 1.0 = ~1.5 world units
  float mouseDist = length(worldXY - mouseWorld);
  // Thermal falloff: smooth within 0.4 world units:
  vThermal = smoothstep(0.4, 0.0, mouseDist);

  gl_Position = projectionMatrix *
    modelViewMatrix * vec4(displaced, 1.0);
}
`

export const ORGANISM_FRAGMENT = `
#ifdef GL_ES
precision mediump float;
#endif

// Uniforms:
uniform float uPulseIntensity; // 0-1
uniform float uBreathPhase;    // 0-1
uniform float uSaturation;     // 0-1, for era scrubber
uniform float uTime;           // seconds

// Varyings from vertex shader:
varying vec3  vNormal;
varying vec3  vWorldPos;
varying vec2  vUv;
varying float vFresnel;
varying float vNoise;
varying float vThermal;

// ── HELPER: APPLY SATURATION ─────────────
vec3 applySaturation(vec3 color, float sat) {
  // Luminance weights (perceptual):
  float luminance = dot(color,
    vec3(0.299, 0.587, 0.114));
  return mix(vec3(luminance), color, sat);
}

void main() {
  // ── BASE TISSUE COLOR ───────────────────
  // MEMBRANE: #0A1628 = vec3(0.039, 0.086, 0.157)
  vec3 baseColor = vec3(0.039, 0.086, 0.157);

  // ── SUBSURFACE SCATTERING APPROXIMATION ─
  // Tissue lit from inside:
  // areas where normal faces camera
  // (low fresnel) appear slightly lighter,
  // simulating light passing through tissue.
  // This gives the biological translucency feel.
  float sss = (1.0 - vFresnel) * 0.18;
  vec3 sssColor = vec3(0.0, 0.28, 0.5);
  // Slightly blue interior light
  vec3 tissueColor = baseColor + sssColor * sss;

  // ── SURFACE NOISE VARIATION ─────────────
  // Subtle grain on tissue surface:
  float grain = (vNoise * 0.5 + 0.5) * 0.06;
  tissueColor += vec3(grain * 0.3, grain * 0.5,
                      grain * 0.8);

  // ── FRESNEL EDGE GLOW ───────────────────
  // Edges glow NEURAL_CYAN:
  // #00C8FF = vec3(0.0, 0.784, 1.0)
  vec3 edgeColor = vec3(0.0, 0.784, 1.0);
  float edgeGlow = vFresnel * 0.6;
  vec3 withEdge = mix(tissueColor, edgeColor,
                      edgeGlow);

  // ── THERMAL CURSOR BRIGHTENING ──────────
  // Where cursor is close: brighten tissue.
  // Brightened tissue color: #1A3A5C
  // = vec3(0.102, 0.227, 0.361)
  vec3 thermalColor = vec3(0.102, 0.227, 0.361);
  vec3 withThermal = mix(withEdge, thermalColor,
                         vThermal * 0.7);

  // ── PULSE FLASH ─────────────────────────
  // When pulse fires (uPulseIntensity 0->1):
  // Flash from tissue color to GROWTH green.
  // GROWTH: #00E87A = vec3(0.0, 0.91, 0.478)
  vec3 pulseColor = vec3(0.0, 0.91, 0.478);
  vec3 withPulse = mix(withThermal, pulseColor,
                       uPulseIntensity * 0.6);

  // ── ERA SATURATION ──────────────────────
  // When Growth Axis scrubber is used:
  // past eras desaturate the organism
  vec3 finalColor = applySaturation(
    withPulse, uSaturation);

  // ── ALPHA ───────────────────────────────
  // Organism is NOT fully opaque —
  // slight translucency at edges:
  float alpha = 0.88 +
    (1.0 - vFresnel) * 0.12; // core = 1.0, edges = 0.88

  gl_FragColor = vec4(finalColor, alpha);
}
`

// ─── SPINE TRAVELING HIGHLIGHT SHADER ──────

export const SPINE_VERTEX = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float uProgress; // 0-1, highlight position

// vT: parametric position along tube (0=start, 1=end)
// We derive it from UV.x since TubeGeometry maps
// UV.x to parametric position along the curve:
varying float vT;
varying float vHighlight;

void main() {
  vT = uv.x;
  // UV.x goes 0->1 along tube length

  // How close is this vertex to the highlight point?
  float dist = abs(vT - uProgress);
  // Smoothstep:
  // within 0.05 of highlight = fully bright
  // beyond 0.08 = no highlight
  vHighlight = smoothstep(0.08, 0.0, dist);

  gl_Position = projectionMatrix *
    modelViewMatrix * vec4(position, 1.0);
}
`

export const SPINE_FRAGMENT = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  uBaseColor; // spine color
uniform float uOpacity;   // overall opacity

varying float vT;
varying float vHighlight;

void main() {
  // Fade at top (spine extends beyond organism):
  // Fading section: vT > 0.7
  float fadeFactor = 1.0;
  if (vT > 0.7) {
    fadeFactor = 1.0 - ((vT - 0.7) / 0.3);
    fadeFactor = max(fadeFactor, 0.0);
  }

  // Mix base color with white highlight:
  vec3 highlightColor = vec3(1.0, 1.0, 1.0);
  vec3 finalColor = mix(uBaseColor, highlightColor,
                        vHighlight * 0.85);

  gl_FragColor = vec4(
    finalColor,
    uOpacity * fadeFactor
  );
}
`

// ─── IRIDESCENT AI PATHWAY SHADER ──────────

export const IRIDESCENT_VERTEX = `
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix *
    modelViewMatrix * vec4(position, 1.0);
}
`

export const IRIDESCENT_FRAGMENT = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
varying vec2 vUv;

void main() {
  // Cycle between NEURAL_CYAN and BIOLUMEN:
  // #00C8FF = vec3(0.0, 0.784, 1.0)
  // #6B2FEE = vec3(0.416, 0.184, 0.933)
  vec3 colorA = vec3(0.0, 0.784, 1.0);
  vec3 colorB = vec3(0.416, 0.184, 0.933);

  // Oscillate along UV.x (path direction)
  // and time:
  float wave = sin(
    vUv.x * 6.28 - uTime * 2.0
  ) * 0.5 + 0.5;

  vec3 color = mix(colorA, colorB, wave);
  float alpha = 0.7 + wave * 0.3;

  gl_FragColor = vec4(color, alpha);
}
`

// ─── MEMBRANE CONSENSUS SHADER ─────────────

export const MEMBRANE_VERTEX = `
#ifdef GL_ES
precision mediump float;
#endif

// Per-vertex opacity attribute
// (updated per frame for consensus animation):
attribute float aOpacity;
varying float vOpacity;

void main() {
  vOpacity = aOpacity;
  gl_Position = projectionMatrix *
    modelViewMatrix * vec4(position, 1.0);
}
`

export const MEMBRANE_FRAGMENT = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  uColor;          // base color
uniform float uGlobalOpacity;  // overall membrane opacity
uniform vec3  uConsensusColor; // flash color for consensus
uniform float uConsensusFlash; // 0-1 flash intensity

varying float vOpacity;

void main() {
  // Mix base color with consensus flash:
  vec3 finalColor = mix(
    uColor,
    uConsensusColor,
    uConsensusFlash
  );

  gl_FragColor = vec4(
    finalColor,
    vOpacity * uGlobalOpacity
  );
}
`
