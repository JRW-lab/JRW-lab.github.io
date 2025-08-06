import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Settings
const cubeSize = 255;

const container = document.getElementById("cube-container");
const width = container.clientWidth;
const height = container.clientHeight;

// Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(cubeSize + 1, cubeSize + 1, cubeSize + 1);
camera.lookAt(scene.position);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xffffff);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Create a canvas for a face (e.g. fixed R = 255, varying G and B)
function createRGBFaceTexture(fixed, fixedVal, varying1, varying2, flipX = false, flipY = false) {
  const size = cubeSize;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = flipX ? size - 1 - x : x;
      const v = flipY ? size - 1 - y : y;

      const index = (y * size + x) * 4;

      let rgb = { r: 0, g: 0, b: 0 };
      rgb[fixed] = fixedVal;
      rgb[varying1] = u;
      rgb[varying2] = v;

      data[index]     = rgb.r;
      data[index + 1] = rgb.g;
      data[index + 2] = rgb.b;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  return texture;

}

const materials = [
  new THREE.MeshBasicMaterial({ map: createRGBFaceTexture('r', 255, 'b', 'g', true, true), side: THREE.DoubleSide }),   // left
  new THREE.MeshBasicMaterial({ map: createRGBFaceTexture('r', 0, 'b', 'g', false, true), side: THREE.DoubleSide }), // right
  new THREE.MeshBasicMaterial({ map: createRGBFaceTexture('g', 255, 'r', 'b', false, false), side: THREE.DoubleSide }),   // bottom
  new THREE.MeshBasicMaterial({ map: createRGBFaceTexture('g', 0, 'r', 'b', false, true), side: THREE.DoubleSide }), // top
  new THREE.MeshBasicMaterial({ map: createRGBFaceTexture('b', 255, 'r', 'g', false, true), side: THREE.DoubleSide }),   // back
  new THREE.MeshBasicMaterial({ map: createRGBFaceTexture('b', 0, 'r', 'g', true, true), side: THREE.DoubleSide })  // front
];

// Add cube
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const edges = new THREE.EdgesGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0x000000 });
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// Store points so we can update
let plottedPoints = [];

function plotPoint(r, g, b) {
  // Normalize to [0,1] without gamma correction
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Settings
  const radius = 30;

  // Color sphere
  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  const color = new THREE.Color().setRGB(rNorm, gNorm, bNorm); // sRGB input
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.set(r - cubeSize / 2, g - cubeSize / 2, b - cubeSize / 2);
  scene.add(sphere);
  plottedPoints.push(sphere);
}

function drawLine(p1, p2) {
  const hudCanvas = document.getElementById("hud-canvas");
  const ctx = hudCanvas.getContext("2d");

  // Resize to match renderer
  hudCanvas.width = renderer.domElement.width;
  hudCanvas.height = renderer.domElement.height;

  // Clear previous line
  ctx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);

  const steps = 1000;
  const y = hudCanvas.height - 10; // 20px from bottom

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    const r = Math.round(p1[0] + t * (p2[0] - p1[0]));
    const g = Math.round(p1[1] + t * (p2[1] - p1[1]));
    const b = Math.round(p1[2] + t * (p2[2] - p1[2]));

    const x = (hudCanvas.width / steps) * i;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, 1, 10); // vertical bar: width 1px, height 10px
  }
}

function clearPoints() {
  plottedPoints.forEach(p => scene.remove(p));
  plottedPoints = [];
}

// Animation loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Form handling
document.getElementById("rgb-form").addEventListener("submit", function (e) {
  e.preventDefault();
  
  const buttonClicked = e.submitter.id;

  const parseRGB = str => str.split(",").map(Number);
  const p1 = parseRGB(document.getElementById("point1").value);
  const p2 = parseRGB(document.getElementById("point2").value);

  if (p1.length !== 3 || p2.length !== 3) {
    alert("Enter valid coordinates for both points! \n\nRGB are comma-separated and should be in the range 0-255.");
    return;
  }

  if (buttonClicked === "plot-btn") {
    clearPoints();
    plotPoint(...p1);
    plotPoint(...p2);
  } else if (buttonClicked === "line-btn") {
    drawLine(p1, p2);
  }
});