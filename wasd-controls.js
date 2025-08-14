// wasd-controls.js — Free-fly using OrbitControls for mouse look.
// W/A/S/D = strafe/forward/back, E/Q or Space/Ctrl = up/down, Shift = boost.
// Mouse drag = look (OrbitControls). No pointer lock used.
//
// Strategy (no edits to main.js):
// - Keep OrbitControls for yaw/pitch (mouse drag).
// - Monkey-patch updateCamera() to preserve observer.position while flying.
// - Each frame: call updateCamera() so orientation follows mouse,
//   then move observer.position along right/forward/up based on keys,
//   and steer OrbitControls.target to a point ahead of the observer
//   so the mouse isn't locked to the black hole.

(function () {
  if (window.__wasdFlyInstalled) return;
  window.__wasdFlyInstalled = true;

  const keys = Object.create(null);
  window.addEventListener(
    "keydown",
    (e) => {
      if (/(INPUT|TEXTAREA|SELECT)/.test(e.target.tagName)) return;
      keys[e.code] = true;
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  // Tunables
  const SPEED = 4.0; // units/sec
  const BOOST = 3.0; // Shift multiplier
  const MAX_DT = 0.05; // clamp long frame gaps
  const LOOK_AHEAD_MIN = 5.0; // how far in front to place the OrbitControls target

  function haveGlobals() {
    return !!(
      window.observer &&
      window.shader &&
      window.updateCamera &&
      window.updateUniforms &&
      window.cameraControls &&
      window.THREE
    );
  }

  function installPatch() {
    if (!haveGlobals()) return false;

    // Ensure param object exists and stop orbital motion from fighting us
    const p = shader.parameters;
    if (!p.observer) p.observer = {};
    if (typeof p.observer.fly === "undefined") p.observer.fly = true;
    p.observer.motion = false;

    // So mouse drag works as "look", not zoom/pan
    cameraControls.enableZoom = false; // we handle zoom via movement if desired
    cameraControls.enablePan = false; // prevent weird target shifts
    cameraControls.rotateSpeed = cameraControls.rotateSpeed || 1.0;

    // Patch updateCamera so it won't overwrite our position while flying
    if (!window.__origUpdateCamera) {
      window.__origUpdateCamera = window.updateCamera;
      window.updateCamera = function patchedUpdateCamera(evt) {
        const keepPos =
          shader &&
          shader.parameters &&
          shader.parameters.observer &&
          shader.parameters.observer.fly &&
          !shader.parameters.observer.motion;
        let saved = null;
        if (keepPos && observer && observer.position) {
          saved = observer.position.clone();
        }
        const out = window.__origUpdateCamera.call(this, evt);
        if (keepPos && saved) {
          observer.position.copy(saved);
          if (observer.velocity) observer.velocity.set(0, 0, 0);
        }
        return out;
      };
    }

    return true;
  }

  // Per-frame fly movement using current orientation
  function stepFly(dt) {
    const p = shader.parameters;
    if (!p.observer.fly) return;
    if (p.observer.motion) return;

    // 1) Let OrbitControls update camera orientation from mouse drag.
    //    Our patch preserves observer.position so only orientation changes.
    updateCamera();

    // 2) Build basis from observer.orientation (row-major Matrix3)
    const e = observer.orientation.elements; // [r00,r01,r02, r10,r11,r12, r20,r21,r22]
    const right = new THREE.Vector3(e[0], e[1], e[2]).normalize();
    const forward = new THREE.Vector3(-e[6], -e[7], -e[8]).normalize(); // -row3
    const up = new THREE.Vector3().crossVectors(right, forward).normalize();

    // 3) Move with WASD/EQ
    let vx = 0,
      vy = 0,
      vz = 0;
    if (keys.KeyW) {
      vx += forward.x;
      vy += forward.y;
      vz += forward.z;
    }
    if (keys.KeyS) {
      vx -= forward.x;
      vy -= forward.y;
      vz -= forward.z;
    }
    if (keys.KeyD) {
      vx += right.x;
      vy += right.y;
      vz += right.z;
    }
    if (keys.KeyA) {
      vx -= right.x;
      vy -= right.y;
      vz -= right.z;
    }
    if (keys.KeyE || keys.Space) {
      vx += up.x;
      vy += up.y;
      vz += up.z;
    }
    if (keys.KeyQ || keys.ControlLeft || keys.ControlRight) {
      vx -= up.x;
      vy -= up.y;
      vz -= up.z;
    }

    let speed = SPEED * (keys.ShiftLeft || keys.ShiftRight ? BOOST : 1.0);
    const mag = Math.hypot(vx, vy, vz);
    if (mag > 0) {
      vx /= mag;
      vy /= mag;
      vz /= mag;
      observer.position.x += vx * speed * dt;
      observer.position.y += vy * speed * dt;
      observer.position.z += vz * speed * dt;
    }

    // 4) Steer OrbitControls' target straight ahead of us so look is free,
    //    not glued to the black hole.
    if (cameraControls && cameraControls.target) {
      const dist = Math.max(LOOK_AHEAD_MIN, (p.observer.distance || 0) + 1.0);
      const target = new THREE.Vector3(
        observer.position.x + forward.x * dist,
        observer.position.y + forward.y * dist,
        observer.position.z + forward.z * dist
      );
      cameraControls.target.copy(target);
      // No need to call cameraControls.update() here because updateCamera()
      // already ran this frame and uses OrbitControls' state to set orientation.
    }

    // 5) Push uniforms so the shader re-runs with the new observer pose
    updateUniforms();
    shader.needsUpdate = true;
  }

  // RAF loop
  let last = performance.now();
  function loop() {
    const now = performance.now();
    const dt = Math.min(MAX_DT, (now - last) / 1000);
    last = now;

    if (!window.__wasdPatched && installPatch()) {
      window.__wasdPatched = true;
    }
    if (window.__wasdPatched) {
      stepFly(dt);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
