import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Settings
const cubeSize = 255;

const container = document.getElementById("cube-container");
const width = container.clientWidth;
const height = width;

// Global variables
let p1Sphere = null;
let p2Sphere = null;
let p1RGB = null;
let p2RGB = null;

// Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
camera.position.set(cubeSize + 1, cubeSize + 1, cubeSize + 1);
camera.lookAt(scene.position);

window.addEventListener('resize', () => {
  const width = container.clientWidth;
  const height = width; // to preserve square shape

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  const hudCanvas = document.getElementById('hud-canvas');
  hudCanvas.width = width;
  hudCanvas.height = height;
});

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xffffff, 0);
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

function plotPoint(r, g, b, label = null) {
  const radius = 30;

  const geometry = new THREE.SphereGeometry(radius, 16, 16);
  const color = new THREE.Color().setRGB(r / 255, g / 255, b / 255);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.set(r - cubeSize / 2, g - cubeSize / 2, b - cubeSize / 2);
  scene.add(sphere);

  if (label === 'p1') {
    if (p1Sphere) scene.remove(p1Sphere);
    p1Sphere = sphere;
  } else if (label === 'p2') {
    if (p2Sphere) scene.remove(p2Sphere);
    p2Sphere = sphere;
  } else {
    plottedPoints.push(sphere);
  }
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
  const y = hudCanvas.height - 70; // 20px from bottom

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    const r = Math.round(p1[0] + t * (p2[0] - p1[0]));
    const g = Math.round(p1[1] + t * (p2[1] - p1[1]));
    const b = Math.round(p1[2] + t * (p2[2] - p1[2]));

    const x = (hudCanvas.width / steps) * i;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, 1, 70); // vertical bar: width 1px, height 10px
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
    if (p1Sphere) scene.remove(p1Sphere);
    if (p2Sphere) scene.remove(p2Sphere);

    plotPoint(...p1, 'p1');
    plotPoint(...p2, 'p2');

    p1RGB = p1;
    p2RGB = p2;
    document.getElementById("hex1").textContent = rgbToHex(p1);
    document.getElementById("hex2").textContent = rgbToHex(p2);
  } else if (buttonClicked === "line-btn") {
    drawLine(p1, p2);
  }

  tryDrawLine();

});

let selectingPoint = null; // 'p1' or 'p2'
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', onCubeClick);

function onCubeClick(event) {
  if (!selectingPoint) return;

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    
    // Convert world position to RGB values
    const r = Math.round(point.x + cubeSize / 2);
    const g = Math.round(point.y + cubeSize / 2);
    const b = Math.round(point.z + cubeSize / 2);

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      alert("Clicked point is outside RGB bounds.");
      return;
    }

    if (selectingPoint === 'p1') {
      if (p1Sphere) scene.remove(p1Sphere);
      document.getElementById('point1').value = `${r},${g},${b}`;
      plotPoint(r, g, b, 'p1');
      p1RGB = [r, g, b];
      document.getElementById("hex1").textContent = rgbToHex(p1RGB);
    } else if (selectingPoint === 'p2') {
      if (p2Sphere) scene.remove(p2Sphere);
      document.getElementById('point2').value = `${r},${g},${b}`;
      plotPoint(r, g, b, 'p2');
      p2RGB = [r, g, b];
      document.getElementById("hex2").textContent = rgbToHex(p2RGB);
    }

    tryDrawLine();
    selectingPoint = null;
  }
}

document.getElementById("select-p1").addEventListener("click", () => {
  selectingPoint = 'p1';
  if (p1Sphere) {
    scene.remove(p1Sphere);
    p1Sphere = null;
  }
});

document.getElementById("select-p2").addEventListener("click", () => {
  selectingPoint = 'p2';
  if (p2Sphere) {
    scene.remove(p2Sphere);
    p2Sphere = null;
  }
});

function isValidRGB(arr) {
  return Array.isArray(arr) &&
         arr.length === 3 &&
         arr.every(n => typeof n === 'number' && n >= 0 && n <= 255);
}

function tryDrawLine() {
  if (isValidRGB(p1RGB) && isValidRGB(p2RGB)) {
    drawLine(p1RGB, p2RGB);
  }
}

function rgbToHex([r, g, b]) {
  return "#" + [r, g, b]
    .map(c => Math.max(0, Math.min(255, c))) // Clamp values
    .map(c => c.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

const tooltip = document.getElementById("tooltip");

const hoverArea = document.getElementById("hud-hover-area");

hoverArea.addEventListener("mousemove", (e) => {
  if (!isValidRGB(p1RGB) || !isValidRGB(p2RGB)) return;

  const rect = hoverArea.getBoundingClientRect();
  const x = e.clientX - rect.left;

  // Calculate t in [0,1]
  const t = Math.min(Math.max(x / rect.width, 0), 1);

  const r = Math.round(p1RGB[0] + t * (p2RGB[0] - p1RGB[0]));
  const g = Math.round(p1RGB[1] + t * (p2RGB[1] - p1RGB[1]));
  const b = Math.round(p1RGB[2] + t * (p2RGB[2] - p1RGB[2]));

  const hex = rgbToHex([r, g, b]);

  tooltip.style.display = "block";
  tooltip.textContent = `${hex} (${r},${g},${b})`;

  const parentRect = tooltip.offsetParent.getBoundingClientRect();

  let left = e.clientX - parentRect.left + 5;
  let top = e.clientY - parentRect.top + 5;

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
});

hoverArea.addEventListener("mouseleave", () => {
  tooltip.style.display = "none";
});

document.getElementById("hud-canvas").addEventListener("mouseleave", () => {
  tooltip.style.display = "none";
});
