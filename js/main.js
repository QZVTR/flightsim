// js/main.js
import { loadPlaneModel, planeState } from './plane.js';
import { updatePhysics } from './physics.js';
import { createWorld } from './world.js';
import { updateCamera } from './camera.js';
import { updateUI } from './ui.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x88aaff);    
scene.fog = new THREE.Fog(0x88aaff, 2000, 15000);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(0, 800, 2000);   

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);


scene.add(new THREE.AmbientLight(0xaaaaaa, 0.8));
const sun = new THREE.DirectionalLight(0xffffff, 1.3);
sun.position.set(500, 800, 300);
scene.add(sun);

createWorld(scene);
loadPlaneModel(scene);

const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup',   e => keys[e.key.toLowerCase()] = false);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(currentTime = 0) {
  requestAnimationFrame(animate);
  
  updatePhysics(keys, currentTime);
  updateCamera(camera);
  updateUI();
  
  renderer.render(scene, camera);
}

animate();

console.log("Sim started");