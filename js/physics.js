// js/physics.js
let lastTime = 0;

export function updatePhysics(planes, keys, currentTime) {
  if (!lastTime) lastTime = currentTime;
  const delta = Math.min((currentTime - lastTime) / 16, 3);
  lastTime = currentTime;

  planes.forEach((plane) => {

    // =========================
    // 1. INPUT / AI
    // =========================
    if (plane.role === 'player') {
      // Thrust
      if (keys['w']) plane.thrust = Math.min(plane.thrust + 0.02 * delta, 1);
      if (keys['s']) plane.thrust = Math.max(plane.thrust - 0.03 * delta, 0);

      // Pitch
      if (keys['arrowup'])    plane.pitchVel -= 0.0025 * delta;
      if (keys['arrowdown'])  plane.pitchVel += 0.0025 * delta;

      // Roll (Q/E)
      if (keys['q']) plane.rollVel += 0.025 * delta;
      if (keys['e']) plane.rollVel -= 0.025 * delta;

      // Banking (roll + yaw)
      const bankSpeed = 0.004 * delta;

      if (keys['arrowleft']) {
        plane.rollVel += bankSpeed;
        plane.yawVel  += bankSpeed * 0.4;
      }

      if (keys['arrowright']) {
        plane.rollVel -= bankSpeed;
        plane.yawVel  -= bankSpeed * 0.4;
      }

      // Auto-level roll
      if (!keys['arrowleft'] && !keys['arrowright']) {
        plane.rollVel *= Math.pow(0.85, delta);
      }

    } else {
      // =========================
      // ✈️ ENEMY AI (IMPROVED)
      // =========================

      plane.aiTime += 0.01 * delta;

      // --- 1. Pick / update a target point ---
      if (!plane.target || plane.aiTime % 200 < 1) {
        plane.target = new THREE.Vector3(
          plane.position.x + (Math.random() * 2000 - 1000),
          200 + Math.random() * 400,
          plane.position.z + (Math.random() * 2000 - 1000)
        );
      }

      // --- 2. Direction to target ---
      const toTarget = plane.target.clone().sub(plane.position).normalize();

      // Current forward direction
      const forward = new THREE.Vector3(0, 0, -1)
        .applyQuaternion(plane.container.quaternion);

      // --- 3. Yaw control (turn toward target) ---
      const cross = new THREE.Vector3().crossVectors(forward, toTarget);
      const turnAmount = cross.y;

      // Bank into the turn (this is KEY for realism)
      plane.rollVel -= turnAmount * 0.01 * delta;

      // Yaw follows roll (coordinated turn feel)
      plane.yawVel += plane.rollVel * 0.02;

      // --- 4. Pitch control (climb/dive toward target altitude) ---
      const altitudeError = plane.target.y - plane.position.y;
      plane.pitchVel -= altitudeError * 0.00001 * delta;

      // --- 5. TERRAIN AVOIDANCE (stronger + smoother) ---
      const minSafeHeight = 120;
      const hardFloor = 50;

      if (plane.position.y < minSafeHeight) {
        plane.pitchVel -= 0.003 * delta;
      }

      if (plane.position.y < hardFloor) {
        plane.pitchVel -= 0.01 * delta;
        plane.thrust = 1;
      } else {
        plane.thrust = 0.65;
      }

      // --- 6. Clamp rotations (prevents crazy spinning) ---
      plane.rollVel  = THREE.MathUtils.clamp(plane.rollVel, -0.05, 0.05);
      plane.pitchVel = THREE.MathUtils.clamp(plane.pitchVel, -0.03, 0.03);
      plane.yawVel   = THREE.MathUtils.clamp(plane.yawVel, -0.02, 0.02);
    }

    // =========================
    // 2. DAMPING
    // =========================
    plane.pitchVel *= Math.pow(0.9, delta);
    plane.yawVel   *= Math.pow(0.8, delta);
    plane.rollVel  *= Math.pow(0.8, delta);

    // =========================
    // 3. APPLY ROTATION
    // =========================
    plane.container.rotateX(plane.pitchVel * delta);
    plane.container.rotateY(plane.yawVel * delta);
    plane.container.rotateZ(plane.rollVel * delta);

    // =========================
    // 4. SPEED & FORWARD MOVE
    // =========================
    const targetSpeed = plane.thrust * 160;
    plane.speed = plane.speed * 0.96 + targetSpeed * 0.04;

    const direction = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(plane.container.quaternion);

    plane.position.addScaledVector(direction, plane.speed * 0.2 * delta);

    // =========================
    // 5. LIFT + GRAVITY
    // =========================
    const upVector = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(plane.container.quaternion);

    const gravity = 0.8;
    const liftFactor = (plane.speed ** 2) * 0.00004;

    plane.position.y -= gravity * delta;
    plane.position.addScaledVector(upVector, liftFactor * delta);

    // =========================
    // 6. GROUND CLAMP
    // =========================
    if (plane.position.y < 5) {
      plane.position.y = 5;

      if (plane.speed > 60 && Math.abs(plane.position.x) > 2000) {
        console.log(`${plane.role} crashed`);
        plane.speed = 0;
        plane.thrust = 0;
      }
    }

    // =========================
    // 7. APPLY POSITION
    // =========================
    plane.container.position.copy(plane.position);
  });
}