// js/weapons.js
export const bullets = [];

export function shootBullet(scene, plane) {
  if (!plane || !plane.container) return;

  const direction = new THREE.Vector3(0, 0, -1)
    .applyQuaternion(plane.container.quaternion)
    .normalize();

  const position = plane.position.clone().add(direction.clone().multiplyScalar(20));

  const bulletMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2, 8, 8), // Made slightly larger for visibility
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );

  bulletMesh.position.copy(position);
  scene.add(bulletMesh);

  bullets.push({
    mesh: bulletMesh,
    velocity: direction.multiplyScalar(2500), // Increased speed for dogfighting
    life: 0,
    owner: plane.role // Prevent shooting yourself
  });
}

export function updateBullets(scene, planes, delta) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.mesh.position.addScaledVector(b.velocity, 0.016 * delta);
    b.life += delta;

    // --- Collision Detection ---
    for (let j = planes.length - 1; j >= 0; j--) {
      const target = planes[j];
      
      // Don't hit the person who fired it or already "dead" planes
      if (b.owner === target.role) continue;

      const dist = b.mesh.position.distanceTo(target.position);
      if (dist < 30) { // Collision radius
        console.log(`${target.role} was destroyed!`);
        
        // Remove plane
        scene.remove(target.container);
        planes.splice(j, 1);

        // Remove bullet
        scene.remove(b.mesh);
        bullets.splice(i, 1);
        break; 
      }
    }

    // Despawn old bullets
    if (b && b.life > 200) {
      scene.remove(b.mesh);
      bullets.splice(i, 1);
    }
  }
}