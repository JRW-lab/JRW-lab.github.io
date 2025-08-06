---
layout: default
title:  "ColorCube"
date:   2025-08-02 0:00:00 -0500
categories: widgets
description: "A 3D Representation of RGB"
---

Enter the RGB values of two colors, with commas separating each color value. RGB values range from 0 to 255.

<style>
  canvas {
    -webkit-user-drag: none;
    user-select: none;
  }
</style>

<form id="rgb-form" style="background: transparent; border: none;">
  <label>Point 1 (R,G,B): <input type="text" id="point1" placeholder="e.g. 255,0,0" /></label><br />
  <label>Point 2 (R,G,B): <input type="text" id="point2" placeholder="e.g. 0,0,255" /></label><br /><br />
  <button type="submit" id="plot-btn">Plot Points</button>&nbsp;
  <button type="submit" id="line-btn">Draw Line</button>
</form>

<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three/build/three.module.js",
      "three/addons/": "https://unpkg.com/three/examples/jsm/"
    }
  }
</script>

<div id="cube-container" style="width: 100%; height: 600px;"></div>
<canvas id="hud-canvas" style="position:absolute; left:0; top:200px; pointer-events:none; z-index:10;"></canvas>
<script type="module" src="/assets/js/colorcube.js"></script>

