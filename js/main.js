// js/main.js
import { createPlane } from './plane.js';
import { updatePhysics } from './physics.js';
import { createWorld } from './world.js';
import { updateCamera } from './camera.js';
import { updateUI } from './ui.js';
import { shootBullet, updateBullets } from './weapons.js';

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

const planes = [];

// Player
const player = createPlane(scene, 'player', new THREE.Vector3(0, 20, 3000));
planes.push(player);

// Enemies
for (let i = 0; i < 50; i++) {
  const enemy = createPlane(
    scene,
    'enemy',
    new THREE.Vector3(
      Math.random() * 2000 - 1000,
      200 + Math.random() * 200,
      Math.random() * -2000
    )
  );
  planes.push(enemy);
}

const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup',   e => keys[e.key.toLowerCase()] = false);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inside your animate function in main.js:
function animate(currentTime = 0) {
  requestAnimationFrame(animate);
  
  // Calculate delta if you haven't moved that logic to a central spot
  const delta = 1; // Or use the delta logic from your physics.js
  const enemyCount = planes.filter(p => p.role === 'enemy').length;
  // Handle Shooting
  if (keys[' ']) { // Spacebar
    if (player.fireCooldown <= 0) {
      shootBullet(scene, player);
      player.fireCooldown = 3; // Frames between shots
    }
  }
  if (player.fireCooldown > 0) player.fireCooldown -= 1;

  updatePhysics(planes, keys, currentTime);
  updateBullets(scene, planes, delta); // Pass planes here!
  updateCamera(camera, player);
  updateUI(player, enemyCount);
  renderer.render(scene, camera);
}

animate();

console.log("Sim started");