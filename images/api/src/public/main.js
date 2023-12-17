import * as THREE from 'three';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Function to create a dumbbell
function createDumbbell(xPosition) {
  // Create a group to hold the dumbbell components
  const dumbbell = new THREE.Group();

  // Create the handle of the dumbbell
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 32), new THREE.MeshBasicMaterial({ color: 0x808080 }));
  dumbbell.add(handle);

  // Create spheres on both ends of the handle
  const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere1.position.y = 1;
  dumbbell.add(sphere1);

  const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere2.position.y = -1;
  dumbbell.add(sphere2);

  // Position the dumbbell based on the input parameter
  dumbbell.position.x = xPosition;

  // Add the dumbbell to the scene
  scene.add(dumbbell);
}

// Create dumbbells with different x-positions
createDumbbell(-5); // Positioned more to the left
createDumbbell(5);  // Positioned more to the right

// Set camera position
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate both dumbbells around their own axes
  scene.children.forEach(obj => {
    if (obj instanceof THREE.Group) {
      obj.rotation.z += 0.01;
    }
  });

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
