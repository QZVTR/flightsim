// js/ui.js
const uiElement = document.getElementById('ui');

export function updateUI(playerPlane) {
  if (!playerPlane || !playerPlane.container) return;

  const p = playerPlane;

  const matrix = new THREE.Matrix4().extractRotation(p.container.matrixWorld);
  const forward = new THREE.Vector3(0, 0, -1).applyMatrix4(matrix);

  let angle = Math.atan2(forward.x, forward.z);
  let heading = (angle * 57.3 + 180) % 360;

  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dirIndex = Math.round(heading / 45) % 8;
  const cardinal = directions[dirIndex];

  const displayRot = new THREE.Euler().setFromQuaternion(p.container.quaternion);

  uiElement.innerHTML = `
    <div style="border-bottom: 1px solid #555; margin-bottom: 5px; padding-bottom: 5px;">
      <b>COMPASS: ${Math.floor(heading)}° ${cardinal}</b>
    </div>
    Altitude: <b>${Math.floor(p.position.y)}</b> ft<br>
    Speed: <b>${Math.floor(p.speed)}</b> kts<br>
    Pitch: <b>${(displayRot.x * 57.3).toFixed(1)}</b>°<br>
    Bank: <b>${(displayRot.z * 57.3).toFixed(1)}</b>°
  `;
}