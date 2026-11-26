import * as THREE from 'three';
import type {
  CameraPresetId,
  CirculatoryNodeId,
  InspectableAnatomyId,
} from '../../utils/circulatory3dGameLogic';

export interface ValveRig {
  id: 'tricuspid_valve' | 'pulmonary_valve' | 'mitral_valve' | 'aortic_valve';
  group: THREE.Group;
  leaflets: THREE.Mesh[];
  phaseType: 'av' | 'semilunar';
  ringMat: THREE.MeshStandardMaterial;
}

export interface JunctionBeaconRig {
  slotIndex: 0 | 1 | 2;
  group: THREE.Group;
  hitMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;
  coreMat: THREE.MeshStandardMaterial;
}

export interface CirculatorySceneHandle {
  scene: THREE.Scene;
  heartGroup: THREE.Group;
  rightAtriumGroup: THREE.Group;
  rightVentricleGroup: THREE.Group;
  leftAtriumGroup: THREE.Group;
  leftVentricleGroup: THREE.Group;
  lungGroup: THREE.Group;
  alveoliMeshes: THREE.Mesh[];
  valves: ValveRig[];
  circulationCurve: THREE.CatmullRomCurve3;
  rbcInstanced: THREE.InstancedMesh;
  rbcOffsets: Float32Array;
  rbcRadialJitter: Float32Array;
  rbcRollSpeed: Float32Array;
  o2Instanced: THREE.InstancedMesh;
  co2Instanced: THREE.InstancedMesh;
  regurgInstanced: THREE.InstancedMesh;
  heroPodGroup: THREE.Group;
  heroBodyMat: THREE.MeshPhysicalMaterial;
  heroO2Orbs: THREE.Mesh[];
  heroCo2Orbs: THREE.Mesh[];
  junctionBeacons: JunctionBeaconRig[];
  interactables: THREE.Object3D[];
  inspectHighlightRing: THREE.Mesh;
  nodeWorldPositions: Record<CirculatoryNodeId, THREE.Vector3>;
  anatomyWorldPositions: Record<InspectableAnatomyId, THREE.Vector3>;
  getCameraPoseForPreset: (
    preset: CameraPresetId,
    heroWorldPos: THREE.Vector3,
    heroTangent: THREE.Vector3
  ) => { position: THREE.Vector3; target: THREE.Vector3 };
  dispose: () => void;
}

const RBC_COUNT = 140;
const O2_PARTICLE_COUNT = 36;
const CO2_PARTICLE_COUNT = 28;
const REGURG_PARTICLE_COUNT = 22;

/**
 * Generates a tileable procedural cellular/myocardial micro-relief bump & roughness map
 * completely in code (zero external image requests).
 */
function createOrganicTissueBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Striated myocardial muscle fiber waves
    for (let y = 0; y < 256; y += 4) {
      const shade = 116 + Math.round(Math.sin((y / 256) * Math.PI * 14) * 18);
      ctx.strokeStyle = `rgb(${shade},${shade},${shade})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= 256; x += 16) {
        const wy = y + Math.sin((x / 256) * Math.PI * 4 + y * 0.05) * 3;
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }

    // Subtle endothelial cellular highlights
    for (let i = 0; i < 180; i++) {
      const cx = ((i * 73) % 256);
      const cy = ((i * 137) % 256);
      const r = 4 + (i % 7);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(215,215,215,0.22)');
      g.addColorStop(1, 'rgba(128,128,128,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Creates a true mammalian biconcave Red Blood Cell geometry via LatheGeometry
 * (rounded outer torus rim + dimpled thin center for rapid O2 diffusion).
 */
function createBiconcaveRbcGeometry(scale = 1): THREE.LatheGeometry {
  const profile: THREE.Vector2[] = [];
  const steps = 14;
  // Upper half from center (r=0) to outer rim (r=1) and back to bottom center (r=0)
  for (let i = 0; i <= steps; i++) {
    const u = i / steps; // 0..1
    const r = Math.sin(u * Math.PI) * 0.34 * scale;
    // Biconcave thickness formula
    const rn = r / (0.34 * scale || 1);
    const halfThick =
      0.095 *
      scale *
      Math.sqrt(Math.max(0.001, 1 - rn * rn)) *
      (0.36 + 1.38 * rn * rn - 0.72 * Math.pow(rn, 4));
    const y = (u <= 0.5 ? 1 : -1) * halfThick;
    profile.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  const geom = new THREE.LatheGeometry(profile, 20);
  geom.computeVertexNormals();
  return geom;
}

export function buildCirculatory3DScene(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): CirculatorySceneHandle {
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(res: T): T => {
    disposables.push(res);
    return res;
  };

  const scene = new THREE.Scene();
  const bgHex = 0x090712;
  scene.background = new THREE.Color(bgHex);
  scene.fog = new THREE.FogExp2(bgHex, 0.026);

  // Warm/Cool anatomical studio lighting rig
  const hemiLight = new THREE.HemisphereLight(0x9bd2ff, 0x3a0f1e, 1.05);
  hemiLight.position.set(0, 12, 0);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff0dd, 2.2);
  keyLight.position.set(6.5, 9.5, 8.5);
  if (!isSoftwareGl) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 28;
    const d = 8.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
  }
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.35);
  rimLight.position.set(-7.5, 4.5, -6.5);
  scene.add(rimLight);

  const heartInnerGlow = new THREE.PointLight(0xff3b5c, 1.8, 11, 1.8);
  heartInnerGlow.position.set(0.2, 0.1, 1.2);
  scene.add(heartInnerGlow);

  const lungGlow = new THREE.PointLight(0x38e8ff, 1.6, 10, 1.8);
  lungGlow.position.set(5.4, 1.5, 0.4);
  scene.add(lungGlow);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const tissueBump = track(createOrganicTissueBumpTexture(maxAniso));

  // Shared PBR Materials across silhouette scales (varied roughness/metalness)
  const rightMyocardiumMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x7a1f3d,
      roughness: 0.34,
      metalness: 0.06,
      clearcoat: 0.86,
      clearcoatRoughness: 0.18,
      bumpMap: tissueBump,
      bumpScale: 0.04,
      transparent: true,
      opacity: 0.84,
      depthWrite: false,
    })
  );

  const leftMyocardiumMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xb91c32,
      roughness: 0.26,
      metalness: 0.08,
      clearcoat: 0.92,
      clearcoatRoughness: 0.14,
      bumpMap: tissueBump,
      bumpScale: 0.055,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
    })
  );

  const septumMuscleMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x8f1d35,
      roughness: 0.58,
      metalness: 0.05,
      bumpMap: tissueBump,
      bumpScale: 0.05,
    })
  );

  const venousVesselMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x3b2c6e,
      roughness: 0.48,
      metalness: 0.08,
      clearcoat: 0.65,
      bumpMap: tissueBump,
      bumpScale: 0.025,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    })
  );

  const pulmonaryArteryMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x56296e,
      roughness: 0.44,
      metalness: 0.08,
      clearcoat: 0.7,
      bumpMap: tissueBump,
      bumpScale: 0.025,
      transparent: true,
      opacity: 0.74,
      depthWrite: false,
    })
  );

  const arterialVesselMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xdc2638,
      roughness: 0.36,
      metalness: 0.08,
      clearcoat: 0.82,
      bumpMap: tissueBump,
      bumpScale: 0.03,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
    })
  );

  const coronaryMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x4c0519,
      emissiveIntensity: 0.45,
      roughness: 0.32,
      metalness: 0.12,
    })
  );

  // =========================================================================
  // 1. THORACIC CAVITY PERIMETER & GROUNDING CONTACT SHADOW
  // =========================================================================
  const thoracicGroup = new THREE.Group();
  const ribMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x26233a,
      roughness: 0.75,
      metalness: 0.12,
    })
  );
  for (let i = 0; i < 5; i++) {
    const y = -2.6 + i * 1.55;
    const widthScale = 1 - Math.abs(i - 2) * 0.08;
    for (const side of [-1, 1]) {
      const ribCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, y + 0.25, -5.8),
        new THREE.Vector3(side * 5.6 * widthScale, y, -4.2),
        new THREE.Vector3(side * 8.4 * widthScale, y - 0.2, -0.5),
        new THREE.Vector3(side * 5.8 * widthScale, y - 0.45, 3.2),
      ]);
      const ribGeom = track(new THREE.TubeGeometry(ribCurve, 20, 0.14, 8, false));
      const ribMesh = new THREE.Mesh(ribGeom, ribMat);
      thoracicGroup.add(ribMesh);
    }
  }
  scene.add(thoracicGroup);

  // Soft radial contact shadow plane beneath heart & systemic bed (zero Z-fight)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const grad = sCtx.createRadialGradient(64, 64, 4, 64, 64, 62);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
  }
  const shadowTex = track(new THREE.CanvasTexture(shadowCanvas));
  const contactShadowMesh = new THREE.Mesh(
    track(new THREE.CircleGeometry(6.8, 32)),
    track(
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
      })
    )
  );
  contactShadowMesh.rotation.x = -Math.PI / 2;
  contactShadowMesh.position.set(1.2, -4.35, 0);
  scene.add(contactShadowMesh);

  // =========================================================================
  // 2. COMPOSITE MULTI-PART BEATING 3D HUMAN HEART + 4 ANIMATED VALVES
  // =========================================================================
  const heartGroup = new THREE.Group();
  scene.add(heartGroup);

  const interactables: THREE.Object3D[] = [];
  const registerHitProxy = (
    id: InspectableAnatomyId,
    pos: THREE.Vector3,
    radius: number,
    parent: THREE.Object3D = scene
  ) => {
    const proxy = new THREE.Mesh(
      track(new THREE.SphereGeometry(radius, 12, 10)),
      track(
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      )
    );
    proxy.position.copy(pos);
    proxy.userData.inspectId = id;
    parent.add(proxy);
    interactables.push(proxy);
    return proxy;
  };

  // Chamber 1: Right Atrium (viewer's left-upper)
  const rightAtriumGroup = new THREE.Group();
  rightAtriumGroup.position.set(-1.55, 1.15, 0.15);
  const raMesh = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.95, 24, 20)),
    rightMyocardiumMat
  );
  raMesh.scale.set(0.95, 1.05, 0.92);
  raMesh.renderOrder = 3;
  rightAtriumGroup.add(raMesh);
  // Auricle ear-flap accent detail
  const raAuricle = new THREE.Mesh(
    track(new THREE.ConeGeometry(0.42, 0.75, 14)),
    septumMuscleMat
  );
  raAuricle.position.set(-0.55, 0.55, 0.42);
  raAuricle.rotation.set(0.3, 0.2, 0.85);
  rightAtriumGroup.add(raAuricle);
  heartGroup.add(rightAtriumGroup);
  registerHitProxy('right_atrium', new THREE.Vector3(0, 0, 0), 1.05, rightAtriumGroup);

  // Chamber 2: Right Ventricle (viewer's left-lower, thinner wall than left)
  const rightVentricleGroup = new THREE.Group();
  rightVentricleGroup.position.set(-0.95, -0.78, 0.35);
  const rvPoints = [
    new THREE.Vector2(0.01, -1.25),
    new THREE.Vector2(0.58, -0.95),
    new THREE.Vector2(0.96, -0.25),
    new THREE.Vector2(0.98, 0.55),
    new THREE.Vector2(0.68, 1.05),
    new THREE.Vector2(0.01, 1.12),
  ];
  const rvMesh = new THREE.Mesh(
    track(new THREE.LatheGeometry(rvPoints, 24)),
    rightMyocardiumMat
  );
  rvMesh.rotation.z = -0.24;
  rvMesh.scale.set(1.0, 1.05, 0.88);
  rvMesh.renderOrder = 3;
  rightVentricleGroup.add(rvMesh);
  heartGroup.add(rightVentricleGroup);
  registerHitProxy('right_ventricle', new THREE.Vector3(0, 0, 0), 1.15, rightVentricleGroup);

  // Chamber 3: Left Atrium (viewer's right-upper)
  const leftAtriumGroup = new THREE.Group();
  leftAtriumGroup.position.set(1.38, 1.22, -0.15);
  const laMesh = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.92, 24, 20)),
    leftMyocardiumMat
  );
  laMesh.scale.set(1.02, 0.96, 0.92);
  laMesh.renderOrder = 3;
  leftAtriumGroup.add(laMesh);
  heartGroup.add(leftAtriumGroup);
  registerHitProxy('left_atrium', new THREE.Vector3(0, 0, 0), 1.0, leftAtriumGroup);

  // Chamber 4: Thick-Walled Left Ventricle (viewer's right-lower, muscular apex!)
  const leftVentricleGroup = new THREE.Group();
  leftVentricleGroup.position.set(1.05, -0.92, 0.18);
  const lvPoints = [
    new THREE.Vector2(0.01, -1.68), // Pronounced cardiac apex
    new THREE.Vector2(0.68, -1.25),
    new THREE.Vector2(1.22, -0.35), // Noticeably thicker muscular profile (3x wall)
    new THREE.Vector2(1.26, 0.58),
    new THREE.Vector2(0.86, 1.15),
    new THREE.Vector2(0.01, 1.22),
  ];
  const lvOuterMesh = new THREE.Mesh(
    track(new THREE.LatheGeometry(lvPoints, 28)),
    leftMyocardiumMat
  );
  lvOuterMesh.rotation.z = 0.28;
  lvOuterMesh.renderOrder = 3;
  leftVentricleGroup.add(lvOuterMesh);

  // Thick muscular wall cross-section rim so students visually see why Left Ventricle is 3x thicker!
  const lvMuscularRim = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.92, 0.22, 14, 28, Math.PI * 1.35)),
    septumMuscleMat
  );
  lvMuscularRim.rotation.set(0.25, 0.15, -0.8);
  lvMuscularRim.position.set(0.18, -0.25, 0.45);
  leftVentricleGroup.add(lvMuscularRim);
  heartGroup.add(leftVentricleGroup);
  registerHitProxy('left_ventricle', new THREE.Vector3(0.1, -0.1, 0), 1.3, leftVentricleGroup);

  // Interventricular Septum & Epicardial Coronary Arteries (Secondary & Accent scale)
  const septumCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, 0.95, 0.22),
    new THREE.Vector3(0.05, -0.35, 0.32),
    new THREE.Vector3(0.42, -1.85, 0.25),
  ]);
  const septumMesh = new THREE.Mesh(
    track(new THREE.TubeGeometry(septumCurve, 20, 0.24, 12, false)),
    septumMuscleMat
  );
  heartGroup.add(septumMesh);

  const ladCoronaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.35, 1.15, 0.65),
    new THREE.Vector3(0.12, 0.15, 1.08),
    new THREE.Vector3(0.32, -0.95, 1.02),
    new THREE.Vector3(0.75, -1.95, 0.65),
  ]);
  const ladMesh = new THREE.Mesh(
    track(new THREE.TubeGeometry(ladCoronaryCurve, 24, 0.065, 8, false)),
    coronaryMat
  );
  heartGroup.add(ladMesh);

  const rcaCoronaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.15, 1.1, 0.62),
    new THREE.Vector3(-0.85, 0.35, 1.02),
    new THREE.Vector3(-1.25, -0.65, 0.88),
  ]);
  const rcaMesh = new THREE.Mesh(
    track(new THREE.TubeGeometry(rcaCoronaryCurve, 18, 0.055, 8, false)),
    coronaryMat
  );
  heartGroup.add(rcaMesh);

  // Helper to construct a multi-leaflet 3D Heart Valve
  const valves: ValveRig[] = [];
  const createValveRig = (
    id: ValveRig['id'],
    pos: THREE.Vector3,
    euler: THREE.Euler,
    leafletCount: 2 | 3,
    phaseType: 'av' | 'semilunar',
    accentColor: number
  ) => {
    const group = new THREE.Group();
    group.position.copy(pos);
    group.rotation.copy(euler);

    const ringMat = track(
      new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.28,
        roughness: 0.35,
        metalness: 0.2,
      })
    );
    const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.36, 0.055, 10, 24)), ringMat);
    group.add(ring);

    const leafletMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfff1f2,
        roughness: 0.32,
        metalness: 0.05,
        side: THREE.DoubleSide,
      })
    );
    const leafletGeom = track(
      new THREE.CircleGeometry(0.33, 12, 0, (Math.PI * 1.85) / leafletCount)
    );
    const leaflets: THREE.Mesh[] = [];

    for (let i = 0; i < leafletCount; i++) {
      const pivot = new THREE.Group();
      const angle = (i / leafletCount) * Math.PI * 2;
      pivot.rotation.z = angle;
      pivot.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0);

      const flap = new THREE.Mesh(leafletGeom, leafletMat);
      flap.rotation.z = Math.PI;
      pivot.add(flap);
      group.add(pivot);
      leaflets.push(flap);
    }

    heartGroup.add(group);
    registerHitProxy(id, pos, 0.58, heartGroup);
    valves.push({ id, group, leaflets, phaseType, ringMat });
  };

  createValveRig(
    'tricuspid_valve',
    new THREE.Vector3(-1.32, 0.28, 0.28),
    new THREE.Euler(Math.PI / 2 - 0.2, 0.15, 0),
    3,
    'av',
    0xa78bfa
  );
  createValveRig(
    'pulmonary_valve',
    new THREE.Vector3(-0.42, 0.62, 0.48),
    new THREE.Euler(-Math.PI / 2 + 0.35, -0.35, 0),
    3,
    'semilunar',
    0x38bdf8
  );
  createValveRig(
    'mitral_valve',
    new THREE.Vector3(1.22, 0.32, 0.06),
    new THREE.Euler(Math.PI / 2 - 0.15, -0.15, 0),
    2,
    'av',
    0xfda4af
  );
  createValveRig(
    'aortic_valve',
    new THREE.Vector3(0.45, 0.68, 0.18),
    new THREE.Euler(-Math.PI / 2 + 0.2, 0.2, 0),
    3,
    'semilunar',
    0xfbbf24
  );

  // =========================================================================
  // 3. GREAT VESSELS & EXPLORABLE ALVEOLAR LUNG ENVIRONMENT
  // =========================================================================
  // Superior & Inferior Vena Cava
  const svcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.85, 3.85, -0.1),
    new THREE.Vector3(-1.75, 2.55, 0.05),
    new THREE.Vector3(-1.62, 1.65, 0.12),
  ]);
  scene.add(new THREE.Mesh(track(new THREE.TubeGeometry(svcCurve, 18, 0.36, 14, false)), venousVesselMat));

  const ivcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.55, -3.35, -0.25),
    new THREE.Vector3(-2.35, -1.45, -0.15),
    new THREE.Vector3(-1.85, 0.55, 0.08),
  ]);
  scene.add(new THREE.Mesh(track(new THREE.TubeGeometry(ivcCurve, 22, 0.38, 14, false)), venousVesselMat));
  registerHitProxy('vena_cava', new THREE.Vector3(-1.8, 2.45, 0.05), 0.85);

  // Pulmonary Artery arching from Right Ventricle to Alveolar Lung Cluster
  const paCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.42, 0.62, 0.48),
    new THREE.Vector3(-0.15, 2.15, 0.42),
    new THREE.Vector3(1.65, 2.65, 0.15),
    new THREE.Vector3(3.85, 2.35, -0.15),
    new THREE.Vector3(5.25, 1.85, -0.25),
  ]);
  scene.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(paCurve, 28, 0.34, 14, false)), pulmonaryArteryMat)
  );
  registerHitProxy('pulmonary_artery', new THREE.Vector3(1.85, 2.58, 0.15), 0.85);

  // Pulmonary Vein returning oxygenated blood from Lungs to Left Atrium
  const pvCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(5.2, 0.95, -0.2),
    new THREE.Vector3(3.65, 0.88, -0.25),
    new THREE.Vector3(2.25, 1.15, -0.2),
    new THREE.Vector3(1.45, 1.22, -0.15),
  ]);
  scene.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(pvCurve, 24, 0.32, 14, false)), arterialVesselMat)
  );
  registerHitProxy('pulmonary_vein', new THREE.Vector3(3.45, 0.95, -0.22), 0.8);

  // Majestic Aortic Arch + 3 Superior Carotid/Subclavian Branches + Descending Aorta
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, 0.68, 0.18),
    new THREE.Vector3(0.38, 2.55, 0.12),
    new THREE.Vector3(0.95, 3.52, -0.15),
    new THREE.Vector3(1.95, 3.15, -0.55),
    new THREE.Vector3(2.15, 0.85, -0.85),
    new THREE.Vector3(1.65, -2.15, -0.65),
    new THREE.Vector3(0.65, -3.45, -0.25),
  ]);
  scene.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(aortaCurve, 36, 0.42, 16, false)), arterialVesselMat)
  );
  registerHitProxy('aorta', new THREE.Vector3(0.95, 3.45, -0.15), 0.95);

  // 3 Brachiocephalic / Carotid / Subclavian branches atop the Aortic Arch
  const archBranchOffsets = [
    new THREE.Vector3(0.58, 3.35, -0.05),
    new THREE.Vector3(0.98, 3.52, -0.15),
    new THREE.Vector3(1.38, 3.42, -0.28),
  ];
  for (let b = 0; b < archBranchOffsets.length; b++) {
    const start = archBranchOffsets[b];
    const brCurve = new THREE.CatmullRomCurve3([
      start,
      new THREE.Vector3(start.x + (b - 1) * 0.18, start.y + 0.75, start.z),
      new THREE.Vector3(start.x + (b - 1) * 0.32, start.y + 1.45, start.z - 0.08),
    ]);
    scene.add(
      new THREE.Mesh(track(new THREE.TubeGeometry(brCurve, 10, 0.13, 10, false)), arterialVesselMat)
    );
  }

  // Systemic Tissue Capillary Bed (bottom loop connecting Aorta -> Vena Cava)
  const tissueGroup = new THREE.Group();
  const capillaryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.65, -3.45, -0.25),
    new THREE.Vector3(-0.15, -3.72, 0.15),
    new THREE.Vector3(-0.95, -3.65, 0.05),
    new THREE.Vector3(-1.55, -3.35, -0.25),
  ]);
  tissueGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(capillaryCurve, 22, 0.24, 12, false)), coronaryMat)
  );
  const tissueCellMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.35,
      roughness: 0.52,
      metalness: 0.08,
    })
  );
  const tissueCellGeom = track(new THREE.DodecahedronGeometry(0.28, 1));
  for (let c = 0; c < 9; c++) {
    const angle = (c / 9) * Math.PI * 2;
    const cell = new THREE.Mesh(tissueCellGeom, tissueCellMat);
    cell.position.set(-0.45 + Math.cos(angle) * 1.15, -3.68 + (c % 2) * 0.22, Math.sin(angle) * 0.58);
    cell.scale.setScalar(0.85 + (c % 3) * 0.15);
    tissueGroup.add(cell);
  }
  scene.add(tissueGroup);
  registerHitProxy('body_capillaries', new THREE.Vector3(-0.45, -3.62, 0.05), 1.05);

  // Explorable Alveolar Lung Cluster (Bronchiole + 14 Alveolar Sacs + Capillary Web)
  const lungGroup = new THREE.Group();
  lungGroup.position.set(5.55, 1.45, -0.25);
  scene.add(lungGroup);

  const bronchioleMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.45,
      metalness: 0.1,
    })
  );
  const bronchioleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.35, 2.45, 0),
    new THREE.Vector3(0.15, 1.35, 0),
    new THREE.Vector3(0, 0.35, 0),
  ]);
  lungGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(bronchioleCurve, 16, 0.24, 12, false)), bronchioleMat)
  );
  // Cartilage rings on bronchiole
  for (let r = 0; r < 5; r++) {
    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.26, 0.035, 8, 18)),
      bronchioleMat
    );
    ring.position.set(0.08 + r * 0.06, 0.65 + r * 0.38, 0);
    ring.rotation.x = Math.PI / 2;
    lungGroup.add(ring);
  }

  const alveolusMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xfda4af,
      emissive: 0x4c0519,
      emissiveIntensity: 0.25,
      roughness: 0.22,
      metalness: 0.02,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    })
  );
  const alveolusGeom = track(new THREE.SphereGeometry(0.46, 18, 16));
  const alveoliMeshes: THREE.Mesh[] = [];
  const sacOffsets: [number, number, number, number][] = [
    [0, 0, 0.42, 1.12],
    [0.52, 0.22, 0.25, 0.96],
    [-0.48, 0.24, 0.28, 0.98],
    [0.45, -0.36, 0.28, 1.02],
    [-0.45, -0.34, 0.26, 0.95],
    [0.05, -0.56, 0.15, 1.05],
    [0.68, -0.08, -0.22, 0.92],
    [-0.62, -0.06, -0.24, 0.9],
    [0.24, 0.46, -0.28, 0.88],
    [-0.25, 0.42, -0.3, 0.86],
    [0.28, -0.45, -0.35, 0.94],
    [-0.28, -0.42, -0.35, 0.91],
  ];
  for (const [sx, sy, sz, sc] of sacOffsets) {
    const sac = new THREE.Mesh(alveolusGeom, alveolusMat);
    sac.position.set(sx, sy, sz);
    sac.scale.setScalar(sc);
    sac.renderOrder = 4;
    lungGroup.add(sac);
    alveoliMeshes.push(sac);
  }

  // Fine alveolar capillary web wrapping around the sacs
  const lungCapCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.42, 0.05),
    new THREE.Vector3(0.25, 0.55, 0.48),
    new THREE.Vector3(0.68, -0.05, 0.42),
    new THREE.Vector3(0.18, -0.58, 0.35),
    new THREE.Vector3(-0.42, -0.48, 0.05),
  ]);
  lungGroup.add(
    new THREE.Mesh(track(new THREE.TubeGeometry(lungCapCurve, 24, 0.09, 8, false)), coronaryMat)
  );
  registerHitProxy('alveoli_lungs', new THREE.Vector3(0, 0, 0.1), 1.35, lungGroup);

  // =========================================================================
  // 4. CLOSED DOUBLE-CIRCULATION SPLINE & 140 BICONCAVE RED BLOOD CELLS
  // =========================================================================
  const circulationWaypoints = [
    new THREE.Vector3(-1.82, 2.85, 0.02), // 0.00 Superior Vena Cava entry
    new THREE.Vector3(-1.62, 1.35, 0.15), // ~0.11 Right Atrium
    new THREE.Vector3(-1.32, 0.28, 0.28), // Tricuspid Valve
    new THREE.Vector3(-0.98, -0.82, 0.38), // ~0.20 Right Ventricle
    new THREE.Vector3(-0.42, 0.62, 0.48), // Pulmonary Valve
    new THREE.Vector3(1.65, 2.62, 0.15), // ~0.31 Pulmonary Artery
    new THREE.Vector3(4.55, 2.05, -0.18), // Entering Lung Capillary
    new THREE.Vector3(5.68, 1.42, 0.22), // ~0.46 Alveolar Gas Exchange Surface
    new THREE.Vector3(4.65, 0.92, -0.2), // Leaving Lung
    new THREE.Vector3(2.95, 1.02, -0.22), // ~0.59 Pulmonary Vein
    new THREE.Vector3(1.38, 1.22, -0.15), // ~0.68 Left Atrium
    new THREE.Vector3(1.22, 0.32, 0.06), // Mitral Valve
    new THREE.Vector3(1.05, -0.95, 0.22), // ~0.77 Left Ventricle
    new THREE.Vector3(0.45, 0.68, 0.18), // Aortic Valve
    new THREE.Vector3(0.95, 3.45, -0.15), // ~0.87 Aortic Arch
    new THREE.Vector3(2.05, 0.65, -0.82), // Descending Aorta
    new THREE.Vector3(-0.35, -3.65, 0.08), // ~0.96 Systemic Body Capillaries
    new THREE.Vector3(-2.25, -1.25, -0.15), // Venous return loop
  ];
  const circulationCurve = new THREE.CatmullRomCurve3(circulationWaypoints, true, 'catmullrom', 0.45);

  const rbcGeom = track(createBiconcaveRbcGeometry(0.82));
  const rbcMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff, // Tinted per-instance via setColorAt
      roughness: 0.34,
      metalness: 0.06,
    })
  );
  const rbcInstanced = new THREE.InstancedMesh(rbcGeom, rbcMat, RBC_COUNT);
  rbcInstanced.frustumCulled = false;
  scene.add(rbcInstanced);

  const rbcOffsets = new Float32Array(RBC_COUNT);
  const rbcRadialJitter = new Float32Array(RBC_COUNT * 2);
  const rbcRollSpeed = new Float32Array(RBC_COUNT);
  for (let i = 0; i < RBC_COUNT; i++) {
    rbcOffsets[i] = i / RBC_COUNT;
    const angle = (i * 2.39996) % (Math.PI * 2);
    const radius = 0.04 + (i % 5) * 0.032;
    rbcRadialJitter[i * 2] = Math.cos(angle) * radius;
    rbcRadialJitter[i * 2 + 1] = Math.sin(angle) * radius;
    rbcRollSpeed[i] = 0.8 + (i % 7) * 0.25;
  }

  // O2 (Sky-Cyan Glowing) & CO2 (Violet-Slate) Pooled Gas Exchange InstancedMeshes
  const gasSphereGeom = track(new THREE.SphereGeometry(0.075, 10, 8));
  const o2Mat = track(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })
  );
  const o2Instanced = new THREE.InstancedMesh(gasSphereGeom, o2Mat, O2_PARTICLE_COUNT);
  o2Instanced.frustumCulled = false;
  lungGroup.add(o2Instanced);

  const co2Mat = track(
    new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x581c87,
      emissiveIntensity: 0.55,
      roughness: 0.45,
    })
  );
  const co2Instanced = new THREE.InstancedMesh(gasSphereGeom, co2Mat, CO2_PARTICLE_COUNT);
  co2Instanced.frustumCulled = false;
  lungGroup.add(co2Instanced);

  // Regurgitation Backflow Particle Pool (visible when Mitral Valve Leak > 0%)
  const regurgMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      emissive: 0xe11d48,
      emissiveIntensity: 0.85,
      roughness: 0.25,
    })
  );
  const regurgInstanced = new THREE.InstancedMesh(gasSphereGeom, regurgMat, REGURG_PARTICLE_COUNT);
  regurgInstanced.frustumCulled = false;
  heartGroup.add(regurgInstanced);

  // =========================================================================
  // 5. PLAYER'S HERO RED BLOOD CELL BIO-POD & 3D JUNCTION BEACONS
  // =========================================================================
  const heroPodGroup = new THREE.Group();
  const heroBodyMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0x6b1d4a,
      emissive: 0x2a071d,
      emissiveIntensity: 0.45,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.95,
    })
  );
  const heroDisc = new THREE.Mesh(track(createBiconcaveRbcGeometry(1.55)), heroBodyMat);
  heroPodGroup.add(heroDisc);

  // Golden navigation halo around player's Hero RBC so gaze finds it in <100ms
  const heroHalo = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.64, 0.032, 10, 32)),
    track(
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
      })
    )
  );
  heroHalo.rotation.x = Math.PI / 2;
  heroPodGroup.add(heroHalo);

  // 4 Haemoglobin O2 / CO2 Binding Sockets orbiting the Hero RBC
  const heroO2Orbs: THREE.Mesh[] = [];
  const heroCo2Orbs: THREE.Mesh[] = [];
  const boundO2Mat = track(
    new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.1,
      roughness: 0.15,
    })
  );
  const boundCo2Mat = track(
    new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.7,
      roughness: 0.35,
    })
  );
  const orbGeom = track(new THREE.SphereGeometry(0.105, 12, 10));
  for (let k = 0; k < 4; k++) {
    const ang = (k / 4) * Math.PI * 2;
    const o2Orb = new THREE.Mesh(orbGeom, boundO2Mat);
    o2Orb.position.set(Math.cos(ang) * 0.44, 0.14, Math.sin(ang) * 0.44);
    heroPodGroup.add(o2Orb);
    heroO2Orbs.push(o2Orb);

    const co2Orb = new THREE.Mesh(orbGeom, boundCo2Mat);
    co2Orb.position.set(Math.cos(ang + 0.4) * 0.44, -0.14, Math.sin(ang + 0.4) * 0.44);
    heroPodGroup.add(co2Orb);
    heroCo2Orbs.push(co2Orb);
  }
  scene.add(heroPodGroup);

  // 3 Clickable In-World 3D Vessel Route Beacons for Active Junction Decisions
  const junctionBeacons: JunctionBeaconRig[] = [];
  const beaconGeom = track(new THREE.OctahedronGeometry(0.24, 0));
  const beaconRingGeom = track(new THREE.TorusGeometry(0.38, 0.035, 8, 24));
  for (const slotIndex of [0, 1, 2] as const) {
    const group = new THREE.Group();
    group.visible = false;
    const coreMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.85,
        roughness: 0.25,
      })
    );
    const core = new THREE.Mesh(beaconGeom, coreMat);
    const ringMesh = new THREE.Mesh(
      beaconRingGeom,
      track(new THREE.MeshBasicMaterial({ color: 0xfef08a }))
    );
    group.add(core);
    group.add(ringMesh);

    const hitMesh = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.55, 10, 8)),
      track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
    );
    hitMesh.userData.junctionSlotIndex = slotIndex;
    group.add(hitMesh);
    interactables.push(hitMesh);

    scene.add(group);
    junctionBeacons.push({ slotIndex, group, hitMesh, ringMesh, coreMat });
  }

  // Highlight ring when student clicks to inspect any chamber, valve, or vessel
  const inspectHighlightRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.75, 0.04, 10, 32)),
    track(
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.88,
      })
    )
  );
  inspectHighlightRing.visible = false;
  scene.add(inspectHighlightRing);

  // Precompute exact world anchors for every node & inspectable anatomy structure
  const nodeWorldPositions: Record<CirculatoryNodeId, THREE.Vector3> = {
    vena_cava: circulationCurve.getPointAt(0.03),
    right_atrium: circulationCurve.getPointAt(0.11),
    right_ventricle: circulationCurve.getPointAt(0.20),
    pulmonary_artery: circulationCurve.getPointAt(0.31),
    alveoli_lungs: circulationCurve.getPointAt(0.46),
    pulmonary_vein: circulationCurve.getPointAt(0.59),
    left_atrium: circulationCurve.getPointAt(0.68),
    left_ventricle: circulationCurve.getPointAt(0.77),
    aorta: circulationCurve.getPointAt(0.87),
    body_capillaries: circulationCurve.getPointAt(0.96),
  };

  const anatomyWorldPositions: Record<InspectableAnatomyId, THREE.Vector3> = {
    ...nodeWorldPositions,
    tricuspid_valve: new THREE.Vector3(-1.32, 0.28, 0.28),
    pulmonary_valve: new THREE.Vector3(-0.42, 0.62, 0.48),
    mitral_valve: new THREE.Vector3(1.22, 0.32, 0.06),
    aortic_valve: new THREE.Vector3(0.45, 0.68, 0.18),
  };

  const _camPos = new THREE.Vector3();
  const _camTarget = new THREE.Vector3();

  const getCameraPoseForPreset = (
    preset: CameraPresetId,
    heroWorldPos: THREE.Vector3,
    heroTangent: THREE.Vector3
  ) => {
    if (preset === 'follow') {
      _camPos
        .copy(heroWorldPos)
        .addScaledVector(heroTangent, -2.4)
        .add(new THREE.Vector3(0, 1.35, 4.35));
      _camTarget.copy(heroWorldPos).add(new THREE.Vector3(0, 0.15, 0));
      return { position: _camPos, target: _camTarget };
    }
    if (preset === 'heart_interior') {
      _camPos.set(0.05, 0.55, 6.2);
      _camTarget.set(0.05, -0.05, 0.15);
      return { position: _camPos, target: _camTarget };
    }
    if (preset === 'lungs') {
      _camPos.set(5.45, 1.75, 4.85);
      _camTarget.set(5.55, 1.45, -0.2);
      return { position: _camPos, target: _camTarget };
    }
    if (preset === 'aortic_arch') {
      _camPos.set(1.25, 2.85, 6.45);
      _camTarget.set(0.95, 1.65, -0.15);
      return { position: _camPos, target: _camTarget };
    }
    // Default 'overview': frames both the Beating 4-Chamber Heart & Explorable Alveolar Lungs
    _camPos.set(1.75, 0.85, 9.8);
    _camTarget.set(1.65, 0.25, 0);
    return { position: _camPos, target: _camTarget };
  };

  return {
    scene,
    heartGroup,
    rightAtriumGroup,
    rightVentricleGroup,
    leftAtriumGroup,
    leftVentricleGroup,
    lungGroup,
    alveoliMeshes,
    valves,
    circulationCurve,
    rbcInstanced,
    rbcOffsets,
    rbcRadialJitter,
    rbcRollSpeed,
    o2Instanced,
    co2Instanced,
    regurgInstanced,
    heroPodGroup,
    heroBodyMat,
    heroO2Orbs,
    heroCo2Orbs,
    junctionBeacons,
    interactables,
    inspectHighlightRing,
    nodeWorldPositions,
    anatomyWorldPositions,
    getCameraPoseForPreset,
    dispose: () => {
      for (const d of disposables) {
        try {
          d.dispose();
        } catch {
          /* ignore */
        }
      }
    },
  };
}
