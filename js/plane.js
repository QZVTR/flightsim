// js/plane.js
export const planeState = {
  container: new THREE.Group(),
  position: new THREE.Vector3(0, 20, 3000), 
  rotation: new THREE.Euler(0, 0, 0),
  speed: 0,         
  thrust: 0,
  pitchVel: 0,
  yawVel: 0,
  rollVel: 0,
};

export function loadPlaneModel(scene) {
  // BA Color Palette
  const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff }); 
  const navyMat  = new THREE.MeshLambertMaterial({ color: 0x00247d }); 
  const redMat   = new THREE.MeshLambertMaterial({ color: 0xeb112e }); 

  // Fuselage
  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 15, 8), whiteMat);
  fuselage.rotation.x = Math.PI / 2;
  planeState.container.add(fuselage);

  // Wings (White with Red Tips)
  const wings = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 4), whiteMat);
  wings.position.set(0, -0.2, -1);
  planeState.container.add(wings);

  // Tail Fin (Navy Blue for that BA look)
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 3), navyMat);
  tail.position.set(0, 1.8, 6);
  planeState.container.add(tail);

  // Horizontal Stabilizers (Navy Blue)
  const stab = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 2.5), navyMat);
  stab.position.set(0, 0, 6);
  planeState.container.add(stab);

  scene.add(planeState.container);
}