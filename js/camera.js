// js/camera.js
import { planeState } from './plane.js';

let cameraInitialized = false;

export function updateCamera(camera) {
  const target = planeState.container;
  if (!target) return;

  
  if (!cameraInitialized) {
    target.add(camera); 

    camera.position.set(0, 8, 30); 
    camera.lookAt(new THREE.Vector3(0, 2, -20)); 
    
    cameraInitialized = true;
  }
}