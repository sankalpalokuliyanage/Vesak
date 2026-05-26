import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Scene Setup ---
const container = document.getElementById('three-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00f2ff, 15, 10);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

// --- Model Loading ---
let vesakModel;
const loader = new GLTFLoader();

// ඔබගේ glb ෆයිල් එකේ නම මෙතනට දෙන්න
loader.load('models/lotus.glb', (gltf) => {
    vesakModel = gltf.scene;

    // මධ්‍යගත කිරීම (Centering)
    const box = new THREE.Box3().setFromObject(vesakModel);
    const center = box.getCenter(new THREE.Vector3());
    vesakModel.position.sub(center);

    scene.add(vesakModel);

    // Glowing Material Effect
    vesakModel.traverse((child) => {
        if (child.isMesh) {
            child.material.emissive = new THREE.Color(0x00f2ff);
            child.material.emissiveIntensity = 1.5;
        }
    });
}, undefined, (error) => {
    console.error('Error loading model:', error);
});

camera.position.z = 3; // කැමරාව මට්ටමට ගෙන ඒම

// --- Color Change Logic ---
const colors = [0x00f2ff, 0xff0055, 0xffaa00, 0x00ff44];
let currentColorIndex = 0;

document.getElementById('colorBtn').addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    const newColor = colors[currentColorIndex];

    if (vesakModel) {
        vesakModel.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive.setHex(newColor);
                pointLight.color.setHex(newColor);
            }
        });
    }
});

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Responsive window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();