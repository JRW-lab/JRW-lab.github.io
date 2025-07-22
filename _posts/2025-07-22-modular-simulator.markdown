---
layout: default
title:  "Modular Simulator Design"
date:   2025-07-22 10:00:00 -0500
categories: simulator
---

I've spent a lot of time thinking through the most organized way to simulate a system in order to fully understand it. Obviously this is a general statement, and I've tried to create as specific a system as possible before the code becomes too general to make sense of. I eventually settled on a method that allows me to generate figures along a range of a selected variable, and the same method works for any stochastic process that intakes variables and outputs any kind of result metric.

Generally, this method works by treating a set of parameters as a unique identifier, which can either be created in a readable format (I used to just list the parameter values in a string) or simply be a generated hash key. Each set of parameters is treated as a single point in an N-dimensional space. In the same manner, a figure generated from these data points can be thought of as a 2D slice that holds all but a few parameters constant.

<div style="text-align: center;">
  <iframe src="/assets/3d_plane_plot.html" width="100%" height="500" style="border: none;"></iframe>
  <p style="font-style: italic; margin-top: 0.5em;">
    Figure 1: Interactive plot showing a 2D plane slicing through a 3D grid of points.
  </p>
</div>

As an overview, the steps of this simulator are:
1. Define the simulation profile, which determine the parametric sweep range and set of configurations to be tested.
2. Determine a system for creating a unique hash for each set of parameters.
2. For each primary sweep value and configuration, check the previously saved results under the same parameter hash.
3. 

-JRW