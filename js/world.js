export function createWorld(scene) {
  // Ground
  const size = 100000;
  const segments = 128; 
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  
  
  const vertices = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1]; 

    
    const dist = Math.sqrt(x * x + y * y);

    if (dist > 4000) { 
      const height = 
        Math.sin(x * 0.0005) * 800 + 
        Math.cos(y * 0.0003) * 1200 + 
        Math.sin((x + y) * 0.001) * 400;
      
      vertices[i + 2] = Math.max(0, height); 
    }
  }
  geometry.computeVertexNormals(); 

  const ground = new THREE.Mesh(
    geometry,
    new THREE.MeshLambertMaterial({ color: 0x2d5a27 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // 3. Runway
  const runway = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 5000),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );
  runway.rotation.x = -Math.PI / 2;
  runway.position.set(0, 10, 800); 
  scene.add(runway);

  // Clouds 

  const cloudGeo = new THREE.SphereGeometry(1, 7, 7);
  const cloudMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });

  const cloudCount = 400;
  for (let i = 0; i < cloudCount; i++) {
    const cloudGroup = new THREE.Group();

    const puffs = 3 + Math.random() * 5;
    for (let j = 0; j < puffs; j++) {
        const puff = new THREE.Mesh(cloudGeo, cloudMat);
        puff.position.set(
            Math.random() * 50 - 25,
            Math.random() * 20 - 10,
            Math.random() * 50 - 25
        );
        const s = 40 + Math.random() * 100;
        puff.scale.set(s, s * 0.6, s);
        cloudGroup.add(puff);
    }

    cloudGroup.position.set(
        (Math.random() - 0.5) * 60000,
        2000 + Math.random() * 3000,
        (Math.random() - 0.5) * 60000
    );
    scene.add(cloudGroup)
  }

  // Runway markings
  const line = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 5000),
    new THREE.MeshLambertMaterial({ color: 0xeeeeee })
  );
  line.rotation.x = -Math.PI / 2;
  line.position.set(0, 10.1, 800);
  scene.add(line);

  for (let i = -1; i <= 1; i += 2) {
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(10, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    light.position.set(i * 140, 15, -1700); 
    scene.add(light);
  }

  return { ground, runway };
}