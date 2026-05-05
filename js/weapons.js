export const bullets = [];

export function shootBullet(scene, plane) {
  if (!plane || !plane.container) return;

  // Direction the plane is facing
  const direction = new THREE.Vector3(0, 0, -1)
    .applyQuaternion(plane.container.quaternion)
    .normalize();

  // Spawn slightly in front of plane
  const position = plane.position.clone().add(direction.clone().multiplyScalar(10));

  // Bullet mesh
  const bulletMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );

  bulletMesh.position.copy(position);
  scene.add(bulletMesh);

  bullets.push({
    mesh: bulletMesh,
    velocity: direction.multiplyScalar(300), // speed
    life: 0
  });
}

export function updateBullets(scene, delta) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];

    // Move bullet
    b.mesh.position.addScaledVector(b.velocity, 0.016 * delta);

    b.life += delta;

    
    if (b.life > 120) {
      scene.remove(b.mesh);
      bullets.splice(i, 1);
    }
  }
}   