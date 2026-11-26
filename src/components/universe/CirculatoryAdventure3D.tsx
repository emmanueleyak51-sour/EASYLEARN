import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ANATOMY_INSPECTABLES,
  CIRCULATORY_NODES,
  SPRINT_TARGET_CO_L_MIN,
  SPRINT_TARGET_SPO2_PCT,
  advanceLinearVesselStep,
  applyExperimentUpdate,
  calculateCirculatoryAdventureReward,
  computePhysiologyExperiment,
  createInitialCirculatoryState,
  evaluateJunctionChoice,
  getDeterministicCompanionGuidance,
  getMissionBannerSpec,
  performAlveolarGasExchange,
  type CameraPresetId,
  type CirculatoryAdventureState,
  type InspectableAnatomyId,
} from '../../utils/circulatory3dGameLogic';
import { circulatoryAudio } from '../../utils/circulatoryAudio';
import { buildCirculatory3DScene, type CirculatorySceneHandle } from './CirculatorySceneBuilder';

type GameShellState = 'title' | 'playing' | 'paused' | 'gameover';
type DockTab = 'pilot' | 'experiment';

// Pre-allocated scratch math helpers at module scope (zero GC allocations inside tick)
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _worldUp = new THREE.Vector3(0, 1, 0);
const _sideAxis = new THREE.Vector3();
const _orthoUp = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _rotMat = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _scale = new THREE.Vector3(1, 1, 1);
const _color = new THREE.Color();
const _venousColor = new THREE.Color(0x5b1946);
const _arterialColor = new THREE.Color(0xf72539);
const _pointerNdc = new THREE.Vector2();

const JUNCTION_WORLD_COORDS: Record<
  'right_ventricle' | 'alveoli_lungs' | 'left_ventricle',
  [THREE.Vector3, THREE.Vector3, THREE.Vector3]
> = {
  right_ventricle: [
    new THREE.Vector3(-0.35, 1.05, 0.55), // [1] Pulmonary Artery (Correct)
    new THREE.Vector3(0.45, 0.25, 0.55), // [2] Across Septum to Aorta (Wrong)
    new THREE.Vector3(-1.42, 0.52, 0.45), // [3] Backflow into Right Atrium (Wrong)
  ],
  alveoli_lungs: [
    new THREE.Vector3(4.35, 0.95, 0.12), // [1] Pulmonary Vein to Left Atrium (Correct)
    new THREE.Vector3(5.65, -0.35, 0.35), // [2] Skip Heart to Body (Wrong - stalls)
    new THREE.Vector3(4.45, 2.15, 0.12), // [3] Reverse into Pulmonary Artery (Wrong)
  ],
  left_ventricle: [
    new THREE.Vector3(0.48, 1.15, 0.35), // [1] Aorta High-Pressure Arch (Correct)
    new THREE.Vector3(1.32, 0.55, 0.32), // [2] Backflow through Mitral Valve (Wrong)
    new THREE.Vector3(-0.25, 0.35, 0.48), // [3] Across Septum to Pulmonary Artery (Wrong)
  ],
};

export interface CirculatoryAdventure3DProps {
  autostart?: boolean;
  initialMuted?: boolean;
  studentName?: string;
  onCompleteAdventure: (xpEarned: number, masteryAccuracyPct: number, rankTitle: string) => void;
  onOpenSyllabusNotes?: () => void;
  onExit: () => void;
}

export function CirculatoryAdventure3D({
  autostart = false,
  initialMuted = false,
  onCompleteAdventure,
  onOpenSyllabusNotes,
  onExit,
}: CirculatoryAdventure3DProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [shellState, setShellState] = useState<GameShellState>(() =>
    autostart ? 'playing' : 'title'
  );
  const [gameState, setGameState] = useState<CirculatoryAdventureState>(() =>
    createInitialCirculatoryState()
  );
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('overview');
  const [dockTab, setDockTab] = useState<DockTab>('pilot');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [muted, setMuted] = useState<boolean>(initialMuted);
  const [selectedInspectId, setSelectedInspectId] = useState<InspectableAnatomyId | null>(null);
  const [companionCard, setCompanionCard] = useState<{
    message: string;
    principle: string;
    tone: 'guide' | 'mistake' | 'success';
  } | null>(() => ({
    message:
      'Welcome inside the living thorax! Click any 3D chamber or valve to inspect it, or pulse forward into the Right Atrium.',
    principle: 'Double Circulation Expedition',
    tone: 'guide',
  }));
  const [isAskingCompanion, setIsAskingCompanion] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [victorySnapshot, setVictorySnapshot] = useState<{
    xpEarned: number;
    masteryAccuracyPct: number;
    rankUnlocked: string;
    cardiacOutputLMin: number;
    spO2Pct: number;
  } | null>(null);

  // Mutable simulation refs shared with the Three.js loop without causing canvas re-mounts
  const shellRef = useRef<GameShellState>(shellState);
  const gameStateRef = useRef<CirculatoryAdventureState>(gameState);
  const cameraPresetRef = useRef<CameraPresetId>(cameraPreset);
  const mutedRef = useRef<boolean>(muted);
  const selectedInspectRef = useRef<InspectableAnatomyId | null>(selectedInspectId);
  const rewardCommittedRef = useRef<boolean>(false);

  const simMotionRef = useRef({
    heroCurveT: CIRCULATORY_NODES.vena_cava.curveProgress,
    targetCurveT: CIRCULATORY_NODES.vena_cava.curveProgress,
    oxygenFlashTimer: 0,
    recoilTimer: 0,
    recoilTargetWorld: new THREE.Vector3(),
    cameraTrauma: 0,
    manualOrbitHoldSec: 0,
    beatPhase: 0,
  });

  useEffect(() => {
    shellRef.current = shellState;
    if (typeof document !== 'undefined') {
      document.body.dataset.state = shellState;
    }
  }, [shellState]);

  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        delete document.body.dataset.state;
      }
    };
  }, []);

  useEffect(() => {
    gameStateRef.current = gameState;
    simMotionRef.current.targetCurveT = CIRCULATORY_NODES[gameState.currentNode].curveProgress;
  }, [gameState]);

  useEffect(() => {
    cameraPresetRef.current = cameraPreset;
    simMotionRef.current.manualOrbitHoldSec = 0;
  }, [cameraPreset]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    selectedInspectRef.current = selectedInspectId;
  }, [selectedInspectId]);

  const metrics = computePhysiologyExperiment(gameState.experiment);
  const missionBanner = getMissionBannerSpec(gameState);
  const currentNodeSpec = CIRCULATORY_NODES[gameState.currentNode];

  const triggerStartAdventure = useCallback(() => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    rewardCommittedRef.current = false;
    setVictorySnapshot(null);
    const fresh = createInitialCirculatoryState();
    setGameState(fresh);
    gameStateRef.current = fresh;
    simMotionRef.current.heroCurveT = CIRCULATORY_NODES.vena_cava.curveProgress;
    simMotionRef.current.targetCurveT = CIRCULATORY_NODES.vena_cava.curveProgress;
    setDockTab('pilot');
    setSelectedInspectId(null);
    setCompanionCard({
      message:
        'Welcome inside the living thorax! Click any 3D chamber or valve to inspect it, or pulse forward into the Right Atrium.',
      principle: 'Double Circulation Expedition',
      tone: 'guide',
    });
    setCameraPreset('overview');
    setShellState('playing');
    circulatoryAudio.playVesselSurge(false, mutedRef.current);
  }, []);

  const finishExpeditionWithVictory = useCallback(
    (finalState: CirculatoryAdventureState) => {
      if (rewardCommittedRef.current) return;
      rewardCommittedRef.current = true;
      const finalMetrics = computePhysiologyExperiment(finalState.experiment);
      const reward = calculateCirculatoryAdventureReward(finalState);
      circulatoryAudio.playMissionFanfare(mutedRef.current);
      setVictorySnapshot({
        xpEarned: reward.xpEarned,
        masteryAccuracyPct: reward.masteryAccuracyPct,
        rankUnlocked: reward.rankUnlocked,
        cardiacOutputLMin: finalMetrics.cardiacOutputLMin,
        spO2Pct: finalMetrics.arterialSpO2Pct,
      });
      setShellState('gameover');
      onCompleteAdventure(reward.xpEarned, reward.masteryAccuracyPct, reward.rankUnlocked);
    },
    [onCompleteAdventure]
  );

  const handleAdvanceStep = useCallback(() => {
    if (shellRef.current !== 'playing') return;
    const cur = gameStateRef.current;

    if (cur.currentNode === 'alveoli_lungs' && !cur.gasExchangeCompleted) {
      const exchanged = performAlveolarGasExchange(cur);
      setGameState(exchanged);
      simMotionRef.current.oxygenFlashTimer = 1.4;
      setCameraPreset('lungs');
      circulatoryAudio.playOxygenExchangeChime(mutedRef.current);
      setCompanionCard({
        message:
          'CO₂ diffused into the alveolar air sac and 4 O₂ molecules bound to haemoglobin—watch your cell glow bright arterial scarlet! Now choose the return vessel.',
        principle: 'Hb + 4O₂ ⇌ Oxyhaemoglobin',
        tone: 'success',
      });
      return;
    }

    const outcome = advanceLinearVesselStep(cur);
    setGameState(outcome.nextState);

    if (outcome.moved) {
      const isOx = CIRCULATORY_NODES[outcome.nextState.currentNode].bloodState === 'oxygenated';
      circulatoryAudio.playVesselSurge(isOx, mutedRef.current);

      if (outcome.nextState.currentNode === 'alveoli_lungs') {
        setCameraPreset('lungs');
      } else if (
        outcome.nextState.currentNode === 'right_ventricle' ||
        outcome.nextState.currentNode === 'left_ventricle'
      ) {
        setCameraPreset('heart_interior');
      } else if (outcome.nextState.currentNode === 'aorta') {
        setCameraPreset('aortic_arch');
      } else if (outcome.phaseJustAdvancedTo === 4) {
        setCameraPreset('overview');
        setDockTab('experiment');
      }

      setCompanionCard({
        message: outcome.feedbackMessage,
        principle: outcome.principleTag,
        tone: 'guide',
      });
    } else {
      setCompanionCard({
        message: outcome.feedbackMessage,
        principle: outcome.principleTag,
        tone: 'mistake',
      });
    }
  }, []);

  const handleJunctionSelect = useCallback((slotIdx: 0 | 1 | 2) => {
    if (shellRef.current !== 'playing') return;
    const cur = gameStateRef.current;
    const nodeSpec = CIRCULATORY_NODES[cur.currentNode];
    const opt = nodeSpec.junctionOptions?.[slotIdx];
    if (!opt) return;

    const outcome = evaluateJunctionChoice(cur, opt.id);
    setGameState(outcome.nextState);

    if (outcome.moved) {
      const isOx = CIRCULATORY_NODES[outcome.nextState.currentNode].bloodState === 'oxygenated';
      circulatoryAudio.playVesselSurge(isOx, mutedRef.current);
      if (outcome.nextState.currentNode === 'pulmonary_artery') {
        setCameraPreset('overview');
      } else if (outcome.nextState.currentNode === 'pulmonary_vein') {
        setCameraPreset('overview');
      } else if (outcome.nextState.currentNode === 'aorta') {
        setCameraPreset('aortic_arch');
      }
      setCompanionCard({
        message: outcome.feedbackMessage,
        principle: outcome.principleTag,
        tone: 'success',
      });
    } else {
      // Animate physical septum/valve rebound toward the blocked branch!
      circulatoryAudio.playValveRebound(mutedRef.current);
      const coords =
        cur.currentNode === 'right_ventricle' ||
        cur.currentNode === 'alveoli_lungs' ||
        cur.currentNode === 'left_ventricle'
          ? JUNCTION_WORLD_COORDS[cur.currentNode][slotIdx]
          : null;
      if (coords) {
        simMotionRef.current.recoilTargetWorld.copy(coords);
        simMotionRef.current.recoilTimer = 0.55;
      }
      simMotionRef.current.cameraTrauma = Math.min(1, simMotionRef.current.cameraTrauma + 0.45);
      setCompanionCard({
        message: outcome.feedbackMessage,
        principle: outcome.principleTag,
        tone: 'mistake',
      });
    }
  }, []);

  const handleExperimentChange = useCallback(
    (patch: Partial<CirculatoryAdventureState['experiment']>) => {
      const cur = gameStateRef.current;
      const { nextState, metrics: nextMetrics, justSolvedSprint } = applyExperimentUpdate(cur, patch);
      setGameState(nextState);
      gameStateRef.current = nextState;

      if (justSolvedSprint) {
        setCompanionCard({
          message:
            'Sprint demand stabilised! High heart rate, 0% valve backflow, and rich alveolar O₂ are delivering peak systemic oxygen!',
          principle: 'Cardiovascular Homeostasis',
          tone: 'success',
        });
        window.setTimeout(() => {
          finishExpeditionWithVictory(nextState);
        }, 650);
      } else if (patch.valveRegurgitationPct !== undefined && patch.valveRegurgitationPct > 0) {
        setCameraPreset('heart_interior');
        setCompanionCard({
          message: nextMetrics.diagnosticNote,
          principle: 'Valve Regurgitation Physics',
          tone: 'mistake',
        });
      }
    },
    [finishExpeditionWithVictory]
  );

  const handleInspectStructure = useCallback((inspectId: InspectableAnatomyId) => {
    setSelectedInspectId(inspectId);
    const card = ANATOMY_INSPECTABLES[inspectId];
    if (card) {
      setGameState((prev) => ({
        ...prev,
        inspectedIds: prev.inspectedIds.includes(inspectId)
          ? prev.inspectedIds
          : [...prev.inspectedIds, inspectId],
      }));
      if (inspectId === 'alveoli_lungs') {
        setCameraPreset('lungs');
      } else if (
        inspectId === 'tricuspid_valve' ||
        inspectId === 'pulmonary_valve' ||
        inspectId === 'mitral_valve' ||
        inspectId === 'aortic_valve'
      ) {
        setCameraPreset('heart_interior');
      }
    }
  }, []);

  const handleAskDrAmaka = useCallback(async () => {
    if (isAskingCompanion) return;
    setIsAskingCompanion(true);
    const cur = gameStateRef.current;
    const curMetrics = computePhysiologyExperiment(cur.experiment);
    const banner = getMissionBannerSpec(cur);

    try {
      const resp = await fetch('/api/universe/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentZone: CIRCULATORY_NODES[cur.currentNode].name,
          missionPhase: banner.phaseTitle,
          heartRateBpm: curMetrics.heartRateBpm,
          oxygenSatPct:
            CIRCULATORY_NODES[cur.currentNode].bloodState === 'deoxygenated'
              ? curMetrics.venousReturnSpO2Pct
              : curMetrics.arterialSpO2Pct,
          valveLeakActive: curMetrics.hasMurmurBackflow,
        }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as {
          guidance?: string;
          scientificPrinciple?: string;
        };
        if (data.guidance) {
          setCompanionCard({
            message: data.guidance,
            principle: data.scientificPrinciple || 'Bio-Vessel Guidance',
            tone: 'guide',
          });
          setIsAskingCompanion(false);
          return;
        }
      }
    } catch {
      /* fall through to deterministic physiological clue */
    }

    const fallback = getDeterministicCompanionGuidance(cur);
    setCompanionCard({
      message: fallback.guidance,
      principle: fallback.scientificPrinciple,
      tone: 'guide',
    });
    setIsAskingCompanion(false);
  }, [isAskingCompanion]);

  // Global Keyboard Controls (Enter/Space on Title, 1-3 Junctions, Space Advance/Exchange, C Camera, H Hide Dock, M Mute, P/Esc Pause)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;
      if (shellRef.current === 'title') {
        if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          triggerStartAdventure();
        } else if (key === 'Escape') {
          onExit();
        }
        return;
      }

      if (key === 'p' || key === 'P' || key === 'Escape') {
        e.preventDefault();
        setShellState((prev) =>
          prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev
        );
        return;
      }

      if (shellRef.current !== 'playing') {
        if ((key === 'Enter' || key === ' ') && shellRef.current === 'gameover') {
          e.preventDefault();
          triggerStartAdventure();
        }
        return;
      }

      if (key === 'h' || key === 'H') {
        e.preventDefault();
        setDockCollapsed((c) => !c);
      } else if (key === 'm' || key === 'M') {
        e.preventDefault();
        setMuted((m) => !m);
      } else if (key === 'c' || key === 'C') {
        e.preventDefault();
        const order: CameraPresetId[] = [
          'overview',
          'follow',
          'heart_interior',
          'lungs',
          'aortic_arch',
        ];
        setCameraPreset((cur) => order[(order.indexOf(cur) + 1) % order.length]);
      } else if (key === '1') {
        e.preventDefault();
        handleJunctionSelect(0);
      } else if (key === '2') {
        e.preventDefault();
        handleJunctionSelect(1);
      } else if (key === '3') {
        e.preventDefault();
        handleJunctionSelect(2);
      } else if (key === ' ' || key === 'ArrowRight' || key === 'w' || key === 'W') {
        e.preventDefault();
        handleAdvanceStep();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAdvanceStep, handleJunctionSelect, onExit, triggerStartAdventure]);

  // ===========================================================================
  // THREE.JS INITIALIZATION & PACED ANIMATION LOOP (MOUNTED ONCE)
  // ===========================================================================
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: isSoftwareGl,
      });
    } catch {
      setWebglError('3D graphics context could not be initialized on this device.');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initRect = mountEl.getBoundingClientRect();
    const initW = Math.max(320, initRect.width || window.innerWidth);
    const initH = Math.max(320, initRect.height || window.innerHeight);
    renderer.setSize(initW, initH);
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(46, initW / initH, 0.1, 80);
    camera.position.set(1.75, 0.85, 9.8);

    // Mandatory studio environment reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const sceneHandle: CirculatorySceneHandle = buildCirculatory3DScene(renderer, isSoftwareGl);
    sceneHandle.scene.environment = envTex;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3.2;
    controls.maxDistance = 16.5;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.target.set(1.65, 0.25, 0);

    const onControlStart = () => {
      simMotionRef.current.manualOrbitHoldSec = 5.0;
    };
    controls.addEventListener('start', onControlStart);

    if (!isSoftwareGl) {
      renderer.compile(sceneHandle.scene, camera);
    }

    // Raycasting strictly against dedicated interactables array (chambers, valves, vessels, junction beacons)
    const raycaster = new THREE.Raycaster();
    let pointerDownX = 0;
    let pointerDownY = 0;

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownX = ev.clientX;
      pointerDownY = ev.clientY;
    };

    const onPointerUp = (ev: PointerEvent) => {
      const dx = ev.clientX - pointerDownX;
      const dy = ev.clientY - pointerDownY;
      if (dx * dx + dy * dy > 36) return; // Dragged camera rather than clicked

      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      _pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(sceneHandle.interactables, false);
      if (hits.length === 0) return;

      for (const hit of hits) {
        if (!hit.object.parent?.visible && hit.object.userData.junctionSlotIndex !== undefined) {
          continue;
        }
        if (hit.object.userData.junctionSlotIndex !== undefined) {
          handleJunctionSelect(hit.object.userData.junctionSlotIndex as 0 | 1 | 2);
          return;
        }
        if (hit.object.userData.inspectId) {
          handleInspectStructure(hit.object.userData.inspectId as InspectableAnatomyId);
          return;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('Graphics context paused — restoring scene...');
    };
    const onContextRestored = () => {
      setWebglError(null);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(240, entry.contentRect.width);
      const h = Math.max(240, entry.contentRect.height);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(mountEl);

    let frameId = 0;
    let disposed = false;
    let lastTimeMs = performance.now();
    let elapsedTotal = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const nowMs = performance.now();
      const rawDt = (nowMs - lastTimeMs) / 1000;
      lastTimeMs = nowMs;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);

      const activeShell = shellRef.current;
      const isPaused = activeShell === 'paused';
      const simDt = isPaused ? 0 : dt;
      elapsedTotal += simDt;

      const curState = gameStateRef.current;
      const curMetrics = computePhysiologyExperiment(curState.experiment);
      const motion = simMotionRef.current;

      // 1. Advance physiological cardiac beat phase & trigger synced Lub-Dub Web Audio
      const beatsPerSec = curMetrics.heartRateBpm / 60;
      const prevBeatPhase = motion.beatPhase;
      motion.beatPhase = (motion.beatPhase + simDt * beatsPerSec) % 1;
      if (!isPaused && activeShell === 'playing' && motion.beatPhase < prevBeatPhase) {
        circulatoryAudio.playHeartbeatCycle(
          curMetrics.heartRateBpm,
          curMetrics.hasMurmurBackflow,
          mutedRef.current
        );
      }

      const bp = motion.beatPhase;
      // Atrial contraction happens at end of diastole [0.80..1.0]; ventricular systole at [0.0..0.34]
      const atrialWave = bp >= 0.8 ? Math.sin(((bp - 0.8) / 0.2) * Math.PI) : 0;
      const ventSystoleWave = bp <= 0.34 ? Math.sin((bp / 0.34) * Math.PI) : 0;

      // Animate 4 Heart Chambers in true physiological sequence
      const atriaScale = 1 - atrialWave * 0.13;
      sceneHandle.rightAtriumGroup.scale.set(atriaScale, 1 + atrialWave * 0.05, atriaScale);
      sceneHandle.leftAtriumGroup.scale.set(atriaScale, 1 + atrialWave * 0.05, atriaScale);

      const rvSqueeze = 1 - ventSystoleWave * 0.14;
      sceneHandle.rightVentricleGroup.scale.set(
        rvSqueeze,
        1 - ventSystoleWave * 0.08,
        rvSqueeze
      );
      // Thick Left Ventricle visibly contracts with greater muscular heave
      const lvSqueeze = 1 - ventSystoleWave * 0.19;
      sceneHandle.leftVentricleGroup.scale.set(
        lvSqueeze,
        1 - ventSystoleWave * 0.1,
        lvSqueeze
      );
      sceneHandle.heartGroup.rotation.y = Math.sin(bp * Math.PI * 2) * 0.035;

      // 2. Animate 4 Multi-Leaflet Heart Valves (AV open in diastole; Semilunar open in systole)
      for (const valve of sceneHandle.valves) {
        let openAmount = 0;
        if (valve.phaseType === 'av') {
          openAmount = bp > 0.38 ? 0.72 : 0.03;
          // Demonstrate leaky mitral regurgitation in 3D when experiment leak > 0%!
          if (valve.id === 'mitral_valve' && curMetrics.hasMurmurBackflow && bp <= 0.34) {
            openAmount = 0.44;
          }
        } else {
          openAmount = bp <= 0.34 ? 0.78 * ventSystoleWave : 0.02;
        }
        for (let l = 0; l < valve.leaflets.length; l++) {
          valve.leaflets[l].rotation.y = -openAmount;
        }
        const isSelected = selectedInspectRef.current === valve.id;
        valve.ringMat.emissiveIntensity = isSelected ? 1.15 : 0.28 + openAmount * 0.4;
      }

      // 3. Alveolar Lung Breathing & Gas Exchange Particle Pools
      const breathWave = Math.sin(elapsedTotal * 1.65) * 0.065;
      for (let a = 0; a < sceneHandle.alveoliMeshes.length; a++) {
        const baseScale = 0.92 + (a % 4) * 0.05;
        sceneHandle.alveoliMeshes[a].scale.setScalar(baseScale + breathWave);
      }

      if (motion.oxygenFlashTimer > 0) {
        motion.oxygenFlashTimer = Math.max(0, motion.oxygenFlashTimer - simDt);
      }
      const o2Boost = 1 + motion.oxygenFlashTimer * 1.8;

      // Update 36 O2 molecules diffusing from alveoli into lung capillaries
      const o2Count = sceneHandle.o2Instanced.count;
      const activeO2Ratio = curState.experiment.inspiredOxygenPct / 100;
      for (let i = 0; i < o2Count; i++) {
        const u = ((elapsedTotal * 0.55 * o2Boost + i / o2Count) % 1);
        const angle = i * 1.7 + elapsedTotal * 0.6;
        const visibleScale = i / o2Count <= activeO2Ratio ? 1 - u * 0.25 : 0.001;
        _vec3A.set(
          Math.cos(angle) * (0.18 + u * 0.55),
          1.45 - u * 1.55,
          Math.sin(angle) * (0.18 + u * 0.45)
        );
        _scale.setScalar(visibleScale);
        _mat4.compose(_vec3A, _quat.identity(), _scale);
        sceneHandle.o2Instanced.setMatrixAt(i, _mat4);
      }
      sceneHandle.o2Instanced.instanceMatrix.needsUpdate = true;

      // Update 28 CO2 molecules diffusing OUT of blood up the bronchiole
      const co2Count = sceneHandle.co2Instanced.count;
      for (let i = 0; i < co2Count; i++) {
        const u = ((elapsedTotal * 0.48 * o2Boost + i / co2Count) % 1);
        const angle = i * 2.1 - elapsedTotal * 0.5;
        _vec3A.set(
          Math.cos(angle) * (0.48 * (1 - u * 0.65)),
          -0.35 + u * 2.25,
          Math.sin(angle) * (0.42 * (1 - u * 0.65))
        );
        _scale.setScalar(0.85);
        _mat4.compose(_vec3A, _quat.identity(), _scale);
        sceneHandle.co2Instanced.setMatrixAt(i, _mat4);
      }
      sceneHandle.co2Instanced.instanceMatrix.needsUpdate = true;

      // Update Mitral Valve Regurgitation Backflow Particles (only visible when leak > 0)
      const regCount = sceneHandle.regurgInstanced.count;
      for (let i = 0; i < regCount; i++) {
        if (!curMetrics.hasMurmurBackflow) {
          _scale.setScalar(0.0001);
          _vec3A.set(0, -10, 0);
        } else {
          const u = ((elapsedTotal * 1.9 + i / regCount) % 1);
          const spread = (i % 5 - 2) * 0.08;
          _vec3A.set(1.18 + spread * u, -0.35 + u * 1.48, 0.08 + spread);
          _scale.setScalar(bp <= 0.42 ? 0.95 * (1 - u * 0.4) : 0.25);
        }
        _mat4.compose(_vec3A, _quat.identity(), _scale);
        sceneHandle.regurgInstanced.setMatrixAt(i, _mat4);
      }
      sceneHandle.regurgInstanced.instanceMatrix.needsUpdate = true;

      // 4. Advance 140 Biconcave Red Blood Cells along Double-Circulation Spline
      const pulsatileSpeed =
        (0.038 + ventSystoleWave * 0.055) * curMetrics.flowSpeedMultiplier;
      const rbcCount = sceneHandle.rbcInstanced.count;
      const arterialSatFactor = Math.max(0.25, (curMetrics.arterialSpO2Pct - 50) / 49);

      for (let i = 0; i < rbcCount; i++) {
        let t = (sceneHandle.rbcOffsets[i] + simDt * pulsatileSpeed) % 1;
        if (t < 0) t += 1;
        sceneHandle.rbcOffsets[i] = t;

        sceneHandle.circulationCurve.getPointAt(t, _vec3A);
        sceneHandle.circulationCurve.getTangentAt(t, _tangent);

        _sideAxis.crossVectors(_tangent, _worldUp).normalize();
        _orthoUp.crossVectors(_sideAxis, _tangent).normalize();

        const jx = sceneHandle.rbcRadialJitter[i * 2];
        const jy = sceneHandle.rbcRadialJitter[i * 2 + 1];
        _vec3A.addScaledVector(_sideAxis, jx).addScaledVector(_orthoUp, jy);

        _euler.set(
          elapsedTotal * sceneHandle.rbcRollSpeed[i],
          Math.atan2(_tangent.x, _tangent.z),
          elapsedTotal * 0.7 + i
        );
        _quat.setFromEuler(_euler);
        const cellScale = 0.88 + (i % 4) * 0.08;
        _scale.setScalar(cellScale);
        _mat4.compose(_vec3A, _quat, _scale);
        sceneHandle.rbcInstanced.setMatrixAt(i, _mat4);

        // Smoothly transition blood color: Venous Deoxygenated [0..0.41] -> Alveolar Exchange [0.41..0.50] -> Arterial Oxygenated [0.50..0.93] -> Tissue Unloading [0.93..1.0]
        let oxyBlend = 0;
        if (t >= 0.41 && t < 0.5) {
          oxyBlend = ((t - 0.41) / 0.09) * arterialSatFactor;
        } else if (t >= 0.5 && t < 0.93) {
          oxyBlend = arterialSatFactor;
        } else if (t >= 0.93) {
          oxyBlend = arterialSatFactor * (1 - (t - 0.93) / 0.07);
        }
        _color.copy(_venousColor).lerp(_arterialColor, oxyBlend);
        sceneHandle.rbcInstanced.setColorAt(i, _color);
      }
      sceneHandle.rbcInstanced.instanceMatrix.needsUpdate = true;
      if (sceneHandle.rbcInstanced.instanceColor) {
        sceneHandle.rbcInstanced.instanceColor.needsUpdate = true;
      }

      // 5. Update Player's Hero Red Blood Cell Bio-Pod & Bound O2/CO2 Orbs
      let deltaT = motion.targetCurveT - motion.heroCurveT;
      if (deltaT < -0.5) deltaT += 1;
      if (deltaT > 0.5) deltaT -= 1;
      motion.heroCurveT = (motion.heroCurveT + deltaT * (1 - Math.exp(-5.5 * dt)) + 1) % 1;

      sceneHandle.circulationCurve.getPointAt(motion.heroCurveT, _vec3A);
      sceneHandle.circulationCurve.getTangentAt(motion.heroCurveT, _tangent);

      if (motion.recoilTimer > 0) {
        motion.recoilTimer = Math.max(0, motion.recoilTimer - dt);
        const lunge = Math.sin((motion.recoilTimer / 0.55) * Math.PI) * 0.62;
        _vec3A.lerp(motion.recoilTargetWorld, lunge);
      }

      sceneHandle.heroPodGroup.position.copy(_vec3A);
      _rotMat.lookAt(_vec3A, _vec3B.copy(_vec3A).add(_tangent), _worldUp);
      _quat.setFromRotationMatrix(_rotMat);
      sceneHandle.heroPodGroup.quaternion.slerp(_quat, 1 - Math.exp(-8 * dt));
      sceneHandle.heroPodGroup.position.y += Math.sin(elapsedTotal * 3.2) * 0.04;

      const heroIsOxygenated = curState.oxygenBoundMolecules >= 4;
      sceneHandle.heroBodyMat.color.lerp(
        heroIsOxygenated ? _arterialColor : _venousColor,
        1 - Math.exp(-6 * dt)
      );
      for (let k = 0; k < 4; k++) {
        sceneHandle.heroO2Orbs[k].visible = k < curState.oxygenBoundMolecules;
        sceneHandle.heroCo2Orbs[k].visible = k < curState.co2LoadMolecules;
      }

      // 6. Position 3D Clickable Junction Route Beacons at Active Decision Nodes
      const showBeacons =
        activeShell === 'playing' &&
        (curState.currentNode === 'right_ventricle' ||
          (curState.currentNode === 'alveoli_lungs' && curState.gasExchangeCompleted) ||
          curState.currentNode === 'left_ventricle');

      for (const beacon of sceneHandle.junctionBeacons) {
        beacon.group.visible = showBeacons;
        if (showBeacons) {
          const jNode = curState.currentNode as
            | 'right_ventricle'
            | 'alveoli_lungs'
            | 'left_ventricle';
          const bPos = JUNCTION_WORLD_COORDS[jNode][beacon.slotIndex];
          beacon.group.position.copy(bPos);
          beacon.group.rotation.y = elapsedTotal * 1.8 + beacon.slotIndex;
          beacon.ringMesh.lookAt(camera.position);
        }
      }

      // Update Inspect Highlight Ring
      const inspectId = selectedInspectRef.current;
      if (inspectId && sceneHandle.anatomyWorldPositions[inspectId]) {
        sceneHandle.inspectHighlightRing.visible = true;
        sceneHandle.inspectHighlightRing.position.copy(
          sceneHandle.anatomyWorldPositions[inspectId]
        );
        sceneHandle.inspectHighlightRing.lookAt(camera.position);
      } else {
        sceneHandle.inspectHighlightRing.visible = false;
      }

      // 7. Smooth Exponential Camera Damping (Title Tour vs Gameplay Presets vs Free Orbit)
      if (motion.cameraTrauma > 0) {
        motion.cameraTrauma = Math.max(0, motion.cameraTrauma - dt * 1.8);
      }

      if (activeShell === 'title') {
        const tourAngle = elapsedTotal * 0.22;
        const desiredX = 1.9 + Math.sin(tourAngle) * 2.2;
        const desiredY = 1.05 + Math.cos(tourAngle * 0.8) * 0.45;
        const desiredZ = 9.2 + Math.cos(tourAngle) * 0.8;
        camera.position.lerp(_vec3B.set(desiredX, desiredY, desiredZ), 1 - Math.exp(-3 * dt));
        controls.target.lerp(_vec3A.set(0.65, 0.2, 0), 1 - Math.exp(-3 * dt));
      } else if (motion.manualOrbitHoldSec > 0) {
        motion.manualOrbitHoldSec = Math.max(0, motion.manualOrbitHoldSec - dt);
      } else {
        const pose = sceneHandle.getCameraPoseForPreset(
          cameraPresetRef.current,
          sceneHandle.heroPodGroup.position,
          _tangent
        );
        const dampAlpha = 1 - Math.exp(-3.8 * dt);
        camera.position.lerp(pose.position, dampAlpha);
        controls.target.lerp(pose.target, dampAlpha);
      }

      if (motion.cameraTrauma > 0.01) {
        const shake = motion.cameraTrauma * motion.cameraTrauma * 0.18;
        camera.position.x += Math.sin(elapsedTotal * 47) * shake;
        camera.position.y += Math.cos(elapsedTotal * 53) * shake;
      }

      controls.update();
      renderer.render(sceneHandle.scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      envTex.dispose();
      sceneHandle.dispose();
      renderer.dispose();
    };
  }, [handleInspectStructure, handleJunctionSelect]);

  const activeInspectCard = selectedInspectId ? ANATOMY_INSPECTABLES[selectedInspectId] : null;
  const junctionOptions =
    currentNodeSpec.junctionOptions &&
    (!currentNodeSpec.requiresGasExchange || gameState.gasExchangeCompleted)
      ? currentNodeSpec.junctionOptions
      : null;

  const stageContent = (
    <div
      data-testid="circulatory-3d-stage"
      className="fixed inset-0 z-[9999] w-screen h-screen bg-[#090712] text-slate-100 overflow-hidden select-none"
    >
      {/* ISOLATED 3D WEBGL MOUNT (NEVER RE-MOUNTED ON REACT HUD UPDATES) */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D Human Circulatory System Environment"
      />

      {webglError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#090712]/95 p-6">
          <div className="max-w-md rounded-2xl bg-[#131122] border border-rose-500/30 p-6 text-center flex flex-col gap-4">
            <h2 className="font-[var(--display)] text-xl font-bold text-white">{webglError}</h2>
            <button
              type="button"
              onClick={onExit}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm cursor-pointer"
            >
              Return to Biology World
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          1. DIEGETIC TITLE / IN-WORLD AWAKENING OVERLAY (LEFT-THIRD NEGATIVE SPACE)
          ===================================================================== */}
      {shellState === 'title' && (
        <div
          className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-10"
          style={{
            background:
              'linear-gradient(90deg, rgba(9,7,18,0.92) 0%, rgba(9,7,18,0.68) 42%, rgba(9,7,18,0.08) 78%, rgba(9,7,18,0) 100%)',
          }}
        >
          <div className="flex items-center justify-between pointer-events-auto">
            <button
              type="button"
              onClick={onExit}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#141126] border border-white/15 hover:border-rose-400/50 text-slate-200 text-[13px] font-semibold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span aria-hidden="true">←</span>
              <span>Back to Worlds</span>
            </button>
          </div>

          <div className="max-w-lg flex flex-col gap-5 pointer-events-auto my-auto">
            {/* Custom Inline <svg> Anatomical Title Crest & Lockup */}
            <div className="flex items-center gap-3.5">
              <svg
                width="54"
                height="54"
                viewBox="0 0 56 56"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  fill="#170E24"
                  stroke="#FB7185"
                  strokeWidth="2"
                />
                <path
                  d="M28 43C28 43 13 33.5 13 22.5C13 17.5 17 14 21.5 14C24.6 14 26.9 15.8 28 18C29.1 15.8 31.4 14 34.5 14C39 14 43 17.5 43 22.5C43 33.5 28 43 28 43Z"
                  fill="#E11D48"
                  stroke="#FFE4E6"
                  strokeWidth="1.6"
                />
                <path
                  d="M17 26H23L25.5 20L29.5 32L32.5 24H39"
                  stroke="#38BDF8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-xs font-semibold text-rose-300 tracking-wide">
                Biology · The Living World · Interactive 3D Expedition
              </div>
            </div>

            <h1
              className="font-[var(--display)] font-extrabold text-3xl sm:text-5xl text-white leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Voyage Through the Living Heart
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[46ch]">
              Pilot a red blood cell inside a beating four-chamber heart, exchange CO₂ for oxygen
              inside living alveoli, and run live heart-rate &amp; valve experiments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                data-start="true"
                onClick={triggerStartAdventure}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:translate-y-[1px] text-white font-bold text-[15px] shadow-lg shadow-rose-950/60 inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap transition"
              >
                <span>Enter Bloodstream</span>
                <span aria-hidden="true">→</span>
              </button>

              {onOpenSyllabusNotes && (
                <button
                  type="button"
                  onClick={onOpenSyllabusNotes}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-[#161329] hover:bg-[#1f1b38] border border-white/15 text-slate-200 font-semibold text-[14px] cursor-pointer whitespace-nowrap transition"
                >
                  Syllabus Notes
                </button>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-400 tracking-wide">
            Drag to Orbit 3D Heart · Click Chambers &amp; Valves · 1–3 Choose Vessel · Space Pulse ·
            H Hide Controls · P Pause
          </div>
        </div>
      )}

      {/* =====================================================================
          2. ACTIVE PLAYING HUD (PERIMETER CLUSTERS + COLLAPSIBLE BOTTOM DOCK)
          ===================================================================== */}
      {shellState === 'playing' && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3.5 sm:p-5">
          {/* TOP BAR: Left Bio-Telemetry Cluster + Right Square Icon Controls */}
          <div className="flex items-start justify-between gap-3">
            {/* Top-Left World-Matched Bio-HUD */}
            <div className="pointer-events-auto max-w-[min(560px,74vw)] rounded-2xl bg-[#110E20]/92 border border-rose-400/25 px-4 py-3 shadow-xl flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11.5px] font-bold text-amber-300 tracking-wide">
                  {missionBanner.phaseTitle} · {currentNodeSpec.name}
                </span>

                {/* 4 Discrete Haemoglobin O2 Sockets matching in-world Hero RBC orbs */}
                <div
                  className="flex items-center gap-1.5"
                  aria-label={`Haemoglobin carrying ${gameState.oxygenBoundMolecules} of 4 oxygen molecules`}
                >
                  <span className="text-[11px] font-semibold text-sky-300 mr-0.5">Hb·O₂</span>
                  {[0, 1, 2, 3].map((idx) => {
                    const filled = idx < gameState.oxygenBoundMolecules;
                    return (
                      <svg
                        key={idx}
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="6.5"
                          fill={filled ? '#38BDF8' : '#1E1B33'}
                          stroke={filled ? '#BAE6FD' : '#475569'}
                          strokeWidth="1.5"
                        />
                      </svg>
                    );
                  })}
                </div>
              </div>

              <p className="text-[13.5px] sm:text-[14px] font-semibold text-white leading-snug">
                {missionBanner.objectiveText}
              </p>

              {/* Hero-to-Kicker Tabular Physiology Readouts */}
              <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-white/10 tabular-nums">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[18px] font-extrabold text-rose-400">
                    {Math.round(metrics.heartRateBpm)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">BPM</span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-[18px] font-extrabold text-amber-300">
                    {metrics.cardiacOutputLMin.toFixed(1)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">L/min Output</span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-[18px] font-extrabold ${
                      currentNodeSpec.bloodState === 'deoxygenated' && gameState.missionPhase < 4
                        ? 'text-purple-300'
                        : 'text-sky-300'
                    }`}
                  >
                    {currentNodeSpec.bloodState === 'deoxygenated' && gameState.missionPhase < 4
                      ? metrics.venousReturnSpO2Pct
                      : metrics.arterialSpO2Pct}
                    %
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">SpO₂</span>
                </div>

                {metrics.hasMurmurBackflow && (
                  <span className="text-[11.5px] font-bold text-rose-300">
                    ▲ Valve Backflow Active
                  </span>
                )}
              </div>
            </div>

            {/* Top-Right Compact Utility Controls */}
            <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
              {/* Camera Zone Selector */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-[#110E20]/92 border border-white/15">
                {(
                  [
                    { id: 'overview', label: 'Thorax' },
                    { id: 'follow', label: 'Follow Cell' },
                    { id: 'heart_interior', label: 'Valves' },
                    { id: 'lungs', label: 'Alveoli' },
                  ] as const
                ).map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setCameraPreset(cam.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold cursor-pointer whitespace-nowrap transition ${
                      cameraPreset === cam.id
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                tabIndex={-1}
                aria-label={muted ? 'Unmute heartbeat audio' : 'Mute heartbeat audio'}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setMuted((m) => !m);
                }}
                className="w-10 h-10 rounded-xl bg-[#110E20]/92 border border-white/15 hover:border-rose-400/50 flex items-center justify-center text-slate-200 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M11 5L6 9H2V15H6L11 19V5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {muted ? (
                    <path
                      d="M22 9L16 15M16 9L22 15"
                      stroke="#FB7185"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path
                      d="M15.5 8.5C17 10 17 14 15.5 15.5M18.5 5.5C21.5 8.5 21.5 15.5 18.5 18.5"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Pause adventure"
                onClick={(e) => {
                  e.currentTarget.blur();
                  setShellState('paused');
                }}
                className="w-10 h-10 rounded-xl bg-[#110E20]/92 border border-white/15 hover:border-rose-400/50 flex items-center justify-center text-slate-200 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                  <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
                </svg>
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label="Exit 3D adventure"
                onClick={onExit}
                className="min-h-[40px] px-3 rounded-xl bg-[#110E20]/92 border border-white/15 hover:border-rose-400/50 text-[12.5px] font-bold text-slate-200 cursor-pointer whitespace-nowrap"
              >
                Exit
              </button>
            </div>
          </div>

          {/* BOTTOM STACK: Contextual Companion + 3D Inspect Strip + Unified Collapsible Control Dock */}
          <div className="flex flex-col items-center gap-2 w-full max-w-[920px] mx-auto">
            {/* Contextual Non-Intrusive Dr. Amaka Strip + Clicked 3D Structure Readout */}
            {!dockCollapsed && (companionCard || activeInspectCard) && (
              <div className="pointer-events-auto w-full grid grid-cols-1 md:grid-cols-12 gap-2">
                {companionCard && (
                  <div
                    className={` rounded-xl bg-[#120F24]/94 border px-3.5 py-2.5 flex items-start justify-between gap-3 ${
                      activeInspectCard ? 'md:col-span-7' : 'md:col-span-12'
                    } ${
                      companionCard.tone === 'mistake'
                        ? 'border-rose-400/50'
                        : companionCard.tone === 'success'
                          ? 'border-emerald-400/45'
                          : 'border-white/15'
                    }`}
                  >
                    <div className="text-[12.5px] leading-snug">
                      <span className="font-bold text-amber-300">Dr. Amaka</span>
                      <span className="text-slate-400"> · {companionCard.principle}: </span>
                      <span className="text-slate-100">{companionCard.message}</span>
                    </div>
                    <button
                      type="button"
                      aria-label="Dismiss companion tip"
                      onClick={() => setCompanionCard(null)}
                      className="text-slate-400 hover:text-white text-xs font-bold px-1.5 cursor-pointer shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {activeInspectCard && (
                  <div
                    className={`rounded-xl bg-[#101829]/94 border border-sky-400/35 px-3.5 py-2.5 flex items-start justify-between gap-2 ${
                      companionCard ? 'md:col-span-5' : 'md:col-span-12'
                    }`}
                  >
                    <div className="text-[12px] leading-snug">
                      <div className="font-bold text-sky-300">
                        {activeInspectCard.title} · {activeInspectCard.bloodStatus}
                      </div>
                      <p className="text-slate-200 mt-0.5">{activeInspectCard.actionSummary}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Close anatomy inspection"
                      onClick={() => setSelectedInspectId(null)}
                      className="text-slate-400 hover:text-white text-xs font-bold px-1 cursor-pointer shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Collapse / Expand Cinema Toggle */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDockCollapsed((c) => !c)}
                className="px-3.5 py-1 rounded-full bg-[#120F24]/92 border border-white/15 hover:border-rose-400/45 text-[11.5px] font-bold text-slate-200 cursor-pointer whitespace-nowrap"
              >
                {dockCollapsed ? '▴ Show Controls [H]' : '▾ Hide Controls [H]'}
              </button>

              <button
                type="button"
                disabled={isAskingCompanion}
                onClick={handleAskDrAmaka}
                className="px-3.5 py-1 rounded-full bg-[#120F24]/92 border border-amber-400/35 hover:border-amber-300 text-[11.5px] font-bold text-amber-300 cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                {isAskingCompanion ? 'Dr. Amaka...' : 'Ask Dr. Amaka'}
              </button>
            </div>

            {/* Unified Horizontal Bottom Control Dock */}
            {!dockCollapsed && (
              <div className="pointer-events-auto w-full rounded-2xl bg-[#110E20]/95 border border-white/15 p-3.5 shadow-2xl flex flex-col gap-3">
                {/* Dock Mode Switcher + Mobile Camera Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-[#1A1630]">
                    <button
                      type="button"
                      onClick={() => setDockTab('pilot')}
                      className={`px-3 py-1 rounded-md text-[12px] font-bold cursor-pointer whitespace-nowrap transition ${
                        dockTab === 'pilot'
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Bloodstream Navigation
                    </button>
                    <button
                      type="button"
                      onClick={() => setDockTab('experiment')}
                      className={`px-3 py-1 rounded-md text-[12px] font-bold cursor-pointer whitespace-nowrap transition ${
                        dockTab === 'experiment'
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Live Heart Experiment
                      {gameState.missionPhase === 4 ? ' · Active Mission' : ''}
                    </button>
                  </div>

                  <div className="flex sm:hidden items-center gap-1">
                    {(
                      [
                        { id: 'overview', label: 'Thorax' },
                        { id: 'follow', label: 'Follow' },
                        { id: 'heart_interior', label: 'Valves' },
                        { id: 'lungs', label: 'Lungs' },
                      ] as const
                    ).map((cam) => (
                      <button
                        key={cam.id}
                        type="button"
                        onClick={() => setCameraPreset(cam.id)}
                        className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer whitespace-nowrap ${
                          cameraPreset === cam.id
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#1A1630] text-slate-300'
                        }`}
                      >
                        {cam.label}
                      </button>
                    ))}
                  </div>

                  <div className="hidden sm:block text-[11.5px] text-slate-400 tabular-nums">
                    Structures inspected: {gameState.inspectedIds.length}/14 · Click any 3D chamber,
                    valve or lung sac
                  </div>
                </div>

                {/* DOCK TAB 1: BLOODSTREAM PILOTING & JUNCTION DECISIONS */}
                {dockTab === 'pilot' && (
                  <div className="flex flex-col gap-2.5">
                    {gameState.missionPhase === 4 ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-[13px] text-slate-200">
                          Full double-circulation loop completed! Open{' '}
                          <strong className="text-amber-300">Live Heart Experiment</strong> to
                          stabilise the sprinting athlete’s cardiac output.
                        </p>
                        <button
                          type="button"
                          onClick={() => setDockTab('experiment')}
                          className="min-h-[42px] px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[13px] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Open Experiment Controls →
                        </button>
                      </div>
                    ) : gameState.currentNode === 'alveoli_lungs' &&
                      !gameState.gasExchangeCompleted ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-[13px] text-slate-200">
                          Inside the Alveolar Capillaries: Unload purple <strong>CO₂</strong> into
                          the lung sac and bind 4 sky-blue <strong>O₂</strong> molecules onto
                          haemoglobin!
                        </p>
                        <button
                          type="button"
                          onClick={handleAdvanceStep}
                          className="min-h-[44px] px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-[13.5px] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Exchange CO₂ for 4 O₂ [Space]
                        </button>
                      </div>
                    ) : junctionOptions ? (
                      <div className="flex flex-col gap-2">
                        <div className="text-[12.5px] font-bold text-amber-300">
                          {currentNodeSpec.junctionPrompt}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {junctionOptions.map((opt, idx) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleJunctionSelect(idx as 0 | 1 | 2)}
                              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#1B1633] hover:bg-rose-600/25 border border-white/15 hover:border-rose-400 text-left text-[12.5px] font-semibold text-white flex items-center justify-between gap-2 cursor-pointer transition"
                            >
                              <span className="truncate">{opt.label}</span>
                              <span className="text-[11px] font-mono text-amber-300 shrink-0">
                                [{opt.keyHint}]
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-[13px] text-slate-200 leading-snug">
                          {currentNodeSpec.liveObservation}
                        </p>
                        <button
                          type="button"
                          onClick={handleAdvanceStep}
                          className="min-h-[44px] px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[13.5px] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Pulse to Next Chamber [Space] →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* DOCK TAB 2: LIVE PHYSIOLOGY EXPERIMENT SLIDERS */}
                {dockTab === 'experiment' && (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      {/* Slider 1: Heart Rate BPM */}
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="exp-hr-slider"
                          className="flex items-center justify-between text-[12px] font-bold text-slate-200 tabular-nums"
                        >
                          <span>Heart Rate</span>
                          <span className="text-rose-400">
                            {gameState.experiment.heartRateBpm} BPM
                          </span>
                        </label>
                        <input
                          id="exp-hr-slider"
                          type="range"
                          min={45}
                          max={165}
                          step={1}
                          value={gameState.experiment.heartRateBpm}
                          onChange={(e) =>
                            handleExperimentChange({ heartRateBpm: Number(e.target.value) })
                          }
                          className="w-full accent-rose-500 cursor-pointer"
                        />
                      </div>

                      {/* Slider 2: Inspired Alveolar O2 % */}
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor="exp-o2-slider"
                          className="flex items-center justify-between text-[12px] font-bold text-slate-200 tabular-nums"
                        >
                          <span>Alveolar O₂ Efficiency</span>
                          <span className="text-sky-300">
                            {gameState.experiment.inspiredOxygenPct}%
                          </span>
                        </label>
                        <input
                          id="exp-o2-slider"
                          type="range"
                          min={55}
                          max={100}
                          step={1}
                          value={gameState.experiment.inspiredOxygenPct}
                          onChange={(e) =>
                            handleExperimentChange({ inspiredOxygenPct: Number(e.target.value) })
                          }
                          className="w-full accent-sky-400 cursor-pointer"
                        />
                      </div>

                      {/* Control 3: One-Way Valve Competence vs Regurgitation Test */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-bold text-slate-200">
                          Mitral Valve Seal
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleExperimentChange({ valveRegurgitationPct: 0 })}
                            className={`min-h-[36px] px-2.5 rounded-lg text-[12px] font-bold cursor-pointer whitespace-nowrap ${
                              gameState.experiment.valveRegurgitationPct === 0
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-[#1B1633] border border-white/15 text-slate-200'
                            }`}
                          >
                            Sealed (0%)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExperimentChange({ valveRegurgitationPct: 28 })}
                            className={`min-h-[36px] px-2.5 rounded-lg text-[12px] font-bold cursor-pointer whitespace-nowrap ${
                              gameState.experiment.valveRegurgitationPct > 0
                                ? 'bg-rose-600 text-white'
                                : 'bg-[#1B1633] border border-white/15 text-slate-200'
                            }`}
                          >
                            Leaky (28%)
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-slate-300 tabular-nums pt-1 border-t border-white/10">
                      <span>{metrics.diagnosticNote}</span>
                      {gameState.missionPhase === 4 && (
                        <span className="font-bold text-amber-300">
                          Target: ≥ {SPRINT_TARGET_CO_L_MIN} L/min · ≥ {SPRINT_TARGET_SPO2_PCT}% SpO₂
                          · Sealed Valve
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          3. PAUSE MODAL (TRIGGERED BY P OR ESCAPE)
          ===================================================================== */}
      {shellState === 'paused' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Adventure Paused"
          className="absolute inset-0 z-30 bg-[#090712]/82 flex items-center justify-center p-5"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#141127] border border-white/15 p-6 flex flex-col gap-5 shadow-2xl">
            <div>
              <div className="text-xs font-bold text-rose-300">Expedition Paused</div>
              <h2 className="font-[var(--display)] text-2xl font-extrabold text-white mt-1">
                Voyage Through the Living Heart
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 tabular-nums">
              <div className="rounded-xl bg-[#0D0B1A] border border-white/10 p-3">
                <div className="text-[11px] font-semibold text-slate-400">Active Mission</div>
                <div className="text-lg font-extrabold text-amber-300 mt-0.5">
                  {gameState.missionPhase} / 4
                </div>
              </div>
              <div className="rounded-xl bg-[#0D0B1A] border border-white/10 p-3">
                <div className="text-[11px] font-semibold text-slate-400">Anatomy Explored</div>
                <div className="text-lg font-extrabold text-sky-300 mt-0.5">
                  {gameState.inspectedIds.length} / 14
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShellState('playing')}
                className="min-h-[44px] px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm cursor-pointer"
              >
                Resume Expedition
              </button>
              <button
                type="button"
                onClick={triggerStartAdventure}
                className="min-h-[44px] px-4 rounded-xl bg-[#1E1938] hover:bg-[#282249] text-slate-100 font-semibold text-sm cursor-pointer"
              >
                Restart from Vena Cava
              </button>
              <button
                type="button"
                onClick={onExit}
                className="min-h-[44px] px-4 rounded-xl border border-white/15 text-slate-300 hover:text-white font-semibold text-sm cursor-pointer"
              >
                Exit to Biology World
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. EXPEDITION VICTORY / MASTERY MODAL (document.body.dataset.state = 'gameover')
          ===================================================================== */}
      {shellState === 'gameover' && victorySnapshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Circulatory Expedition Complete"
          className="absolute inset-0 z-30 bg-[#090712]/84 flex items-center justify-center p-5"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#141127] border border-amber-400/35 p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold text-amber-300">
                Expedition Complete · Rank Unlocked: {victorySnapshot.rankUnlocked}
              </div>
              <h2 className="font-[var(--display)] text-2xl sm:text-3xl font-extrabold text-white">
                Double Circulation Mastered!
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                You piloted blood through the right heart to the alveoli, bound oxygen onto
                haemoglobin, surged out the thick-walled left ventricle, and stabilised sprint
                cardiac output!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 tabular-nums">
              <div className="rounded-xl bg-[#0D0B1A] border border-white/10 p-3 text-center">
                <div className="text-xl font-extrabold text-amber-300">
                  +{victorySnapshot.xpEarned} XP
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Reward</div>
              </div>
              <div className="rounded-xl bg-[#0D0B1A] border border-white/10 p-3 text-center">
                <div className="text-xl font-extrabold text-emerald-400">
                  {victorySnapshot.masteryAccuracyPct}%
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Mastery</div>
              </div>
              <div className="rounded-xl bg-[#0D0B1A] border border-white/10 p-3 text-center">
                <div className="text-xl font-extrabold text-sky-300">
                  {victorySnapshot.cardiacOutputLMin.toFixed(1)} L/m
                </div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Sprint Flow</div>
              </div>
            </div>

            <div className="rounded-xl bg-[#1B1633] border border-amber-400/25 px-4 py-3 text-xs text-slate-200">
              Unlocked Equipment: <strong className="text-amber-300">Bio-Pulse Scanner</strong> ·
              Added to your Explorer Sanctuary!
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShellState('playing');
                  setDockTab('experiment');
                }}
                className="min-h-[44px] px-4 rounded-xl bg-[#1E1938] hover:bg-[#282249] border border-white/15 text-slate-100 font-semibold text-sm cursor-pointer whitespace-nowrap"
              >
                Continue Free 3D Sandbox
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  data-start="true"
                  onClick={triggerStartAdventure}
                  className="min-h-[44px] px-4 rounded-xl bg-[#241E42] hover:bg-[#2F2756] text-white font-semibold text-sm cursor-pointer whitespace-nowrap"
                >
                  Replay
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className="min-h-[44px] px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm cursor-pointer whitespace-nowrap"
                >
                  Claim &amp; Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(stageContent, document.body) : stageContent;
}
