---
layout: default
title:  "ColorCube"
date:   2025-08-02 0:00:00 -0500
categories: widgets
description: "A 3D Representation of RGB"
---

Enter the RGB values of two colors, with commas separating each color value (RGB values range from 0 to 255). Alternatively, click the button to select either Point 1 or Point 2, then click on the cube to define that point.

A gradient between the two colors is generated below, and hexcodes for each color can be seen by hovering over each point on the gradient.

<style>
  canvas {
    -webkit-user-drag: none;
    user-select: none;
  }
</style>

<form id="rgb-form" style="background: transparent; border: none;">
  <label>
  Point 1 (R,G,B): 
  <input type="text" id="point1" placeholder="e.g. 255,0,0" />
  <span id="hex1" style="margin-left: 10px; font-family: monospace;"></span>
</label>
<br />
<label>
  Point 2 (R,G,B): 
  <input type="text" id="point2" placeholder="e.g. 0,0,255" />
  <span id="hex2" style="margin-left: 10px; font-family: monospace;"></span>
</label><br /><br />
  <button type="submit" id="plot-btn">Generate Gradient</button>&nbsp;
  <button type="button" id="select-p1">Select Point 1</button>
  <button type="button" id="select-p2">Select Point 2</button>  
</form>

<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three/build/three.module.js",
      "three/addons/": "https://unpkg.com/three/examples/jsm/"
    }
  }
</script>

<div id="cube-container">
  <canvas id="hud-canvas" style="position:absolute; pointer-events:auto; z-index:10;"></canvas>
  <div id="hud-hover-area"></div>
  <script type="module" src="/assets/js/colorcube.js"></script>
</div>

<div id="tooltip" style="
  position: absolute;
  pointer-events: none;
  background: white;
  padding: 4px 8px;
  border: 1px solid #ccc;
  font-family: monospace;
  font-size: 12px;
  border-radius: 4px;
  display: none;
  z-index: 100;">
</div>

