// js/camera.js

export function updateCamera(camera, playerPlane) {
  if (!playerPlane || !playerPlane.container) return;

  const plane = playerPlane.container;

  // Offset behind and above the plane
  const offset = new THREE.Vector3(0, 2, 30);

  // Rotate offset based on plane orientation
  const worldOffset = offset.applyQuaternion(plane.quaternion);

  
  const desiredPosition = plane.position.clone().add(worldOffset);
  // Smooth follow (lerp)
  camera.position.lerp(desiredPosition, 0.1);
  
  //const speedFactor = playerPlane.speed * 0.1;
  //offset.z += speedFactor;

  const lookAtTarget = plane.position.clone().add(
    new THREE.Vector3(0, 2, -50).applyQuaternion(plane.quaternion)
  );

  camera.lookAt(lookAtTarget);
}