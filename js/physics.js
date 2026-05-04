// js/physics.js
import { planeState } from './plane.js';

let lastTime = 0;

export function updatePhysics(keys, currentTime) {
  if (!lastTime) lastTime = currentTime;
  const delta = Math.min((currentTime - lastTime) / 16, 3);
  lastTime = currentTime;

  // 1. Thrust
  if (keys['w']) planeState.thrust = Math.min(planeState.thrust + 0.02 * delta, 1);
  if (keys['s']) planeState.thrust = Math.max(planeState.thrust - 0.03 * delta, 0);

  // 2. Simple Controls
  // Pitch (Up/Down)
  if (keys['arrowup'])    planeState.pitchVel -= 0.0025 * delta;
  if (keys['arrowdown'])  planeState.pitchVel += 0.0025 * delta;
  
  // Banking (Left/Right) - This now handles both Roll and Yaw
  const bankSpeed = 0.004 * delta;
  if (keys['arrowleft']) {
    planeState.rollVel += bankSpeed;
    planeState.yawVel  += bankSpeed * 0.4; 
  }
  if (keys['arrowright']) {
    planeState.rollVel -= bankSpeed;
    planeState.yawVel  -= bankSpeed * 0.4;
  }

  // 3. Natural Stability (The plane wants to level itself)
  if (!keys['arrowleft'] && !keys['arrowright']) {
    planeState.rollVel *= Math.pow(0.85, delta);
  }

  // 4. Damping
  planeState.pitchVel *= Math.pow(0.9, delta);
  planeState.yawVel   *= Math.pow(0.8, delta);
  planeState.rollVel  *= Math.pow(0.8, delta);

  // 5. Apply Rotations
  if (planeState.container) {
    planeState.container.rotateX(planeState.pitchVel * delta);
    planeState.container.rotateY(planeState.yawVel * delta);
    planeState.container.rotateZ(planeState.rollVel * delta);
  }

  // 6. Speed & Movement
  const targetSpeed = planeState.thrust * 160;
  planeState.speed = planeState.speed * 0.96 + targetSpeed * 0.04;

  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(planeState.container.quaternion);
  planeState.position.addScaledVector(direction, planeState.speed * 0.2 * delta);

  // 7. Lift and Gravity
  const upVector = new THREE.Vector3(0, 1, 0).applyQuaternion(planeState.container.quaternion);
  const gravity = 0.8;
  const liftFactor = (planeState.speed ** 2) * 0.00004;
  
  planeState.position.y -= gravity * delta;
  planeState.position.addScaledVector(upVector, liftFactor * delta);

  // 8. Ground Clamp
  if (planeState.position.y < 5) { 
    planeState.position.y = 5;
    if (planeState.speed > 60 && Math.abs(planeState.position.x) > 2000) {
        console.log("CRASHED INTO MOUNTAIN");
        planeState.speed = 0;
        planeState.thrust = 0;
    }
}

  planeState.container.position.copy(planeState.position);
}