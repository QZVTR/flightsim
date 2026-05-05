// js/plane.js
export function createPlane(scene, role, startPos) {
  const container = new THREE.Group();

  const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff }); 
  const navyMat  = new THREE.MeshLambertMaterial({ color: 0x00247d }); 
  const enemyMat = new THREE.MeshLambertMaterial({ color: 0xff3333 });
  const metalMat = new THREE.MeshLambertMaterial({ color: 0x888888 });

  const bodyMat = role === 'enemy' ? enemyMat : whiteMat;
  const tailMat = role === 'enemy' ? enemyMat : navyMat;

  // =====================
  // FUSELAGE 
  // =====================
  const fuselage = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 0.6, 18, 12),
    bodyMat
  );
  fuselage.rotation.x = Math.PI / 2;
  container.add(fuselage);

  // Nose cone
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 3, 12),
    bodyMat
  );
  nose.position.z = -10.5;
  nose.rotation.x = Math.PI / 2;
  container.add(nose);

  // =====================
  // WINGS 
  // =====================
  const wingGeo = new THREE.BoxGeometry(22, 0.2, 5);

  const wings = new THREE.Mesh(wingGeo, bodyMat);
  wings.position.set(0, 0, -1);
  wings.rotation.y = Math.PI * 0.05; 
  container.add(wings);

  // =====================
  // TAIL FIN (vertical)
  // =====================
  const tailFin = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 5, 3),
    tailMat
  );
  tailFin.position.set(0, 2.5, 7);
  container.add(tailFin);

  // =====================
  // HORIZONTAL STABILIZERS
  // =====================
  const stabilizer = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.2, 2.5),
    tailMat
  );
  stabilizer.position.set(0, 0, 7);
  container.add(stabilizer);

  // =====================
  // ENGINES 
  // =====================
  const engineGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 10);

  const engineLeft = new THREE.Mesh(engineGeo, metalMat);
  engineLeft.rotation.x = Math.PI / 2;
  engineLeft.position.set(-3, -1, 0);
  container.add(engineLeft);

  const engineRight = new THREE.Mesh(engineGeo, metalMat);
  engineRight.rotation.x = Math.PI / 2;
  engineRight.position.set(3, -1, 0);
  container.add(engineRight);

  // =====================
  // SCALE
  // =====================
  container.scale.set(6, 6, 6);

  scene.add(container);

  return {
    role,
    container,
    position: startPos.clone(),
    speed: role === 'enemy' ? 80 : 0,
    thrust: role === 'enemy' ? 0.6 : 0,
    pitchVel: 0,
    yawVel: 0,
    rollVel: 0,
    aiTime: Math.random() * 1000,

    bullets: [],
    fireCooldown: 0,
  };
}