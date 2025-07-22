---
layout: default
title:  "Modular Simulator Design"
date:   2025-07-22 10:00:00 -0500
categories: simulator
---

# Modular Simulator Design
## Stumbling upon the ideal 2D plot generator

I've spent a lot of time thinking through the most organized way to simulate a system in order to fully understand it. Obviously this is a general statement, and I've tried to create as specific a system as possible before the code becomes too general to make sense of. I eventually settled on a method that allows me to generate plots along a range of a selected variable, and the same method works for any stochastic process that intakes variables and outputs any kind of result metric.

Generally, this method works by treating a set of parameters as a unique unit and given a specific name, which can either be created in a readable format (I used to just list the parameter values in a string) or simply be a generated hash key. Each set of parameters is therefore treated as a single point in an N-dimensional space, where N is the number of parameters. In the same manner, a plot generated from these data points can be thought of as a 2D slice that holds all but a few parameters constant.

<div style="text-align: center;">
  <iframe src="/assets/3d_plane_plot.html" width="100%" height="500" style="border: none;"></iframe>
  <p style="font-style: italic; margin-top: 0.5em;">
    Figure 1: Interactive plot showing a 2D plane slicing through a 3D grid of points.
  </p>
</div>

Figure 1 above shows a simplified case, where the generated plot made by the simulator is the 2D slice cutting through the 3D collection of data points (meaning N=3). Additionally, each straight line of on-plane points represented a different line drawn on the generated plot. All other off-plane points aren't used in generating the plot. The end goal of generating a plot, then, is to create all needed on-plane data points to draw the desired line of points. Since all data lines need to share the same y-axis, all lines of points on the 2D plane are parallel, moving in the same direction.

Speaking in terms of the plots themselves now, the range of x-values and the set of configurations are all that are needed to create a readable 2D plot. To create a flexible simulator that can display information in 2D plots, we must define the following: the parameter chosen for the parametric sweep, the range of sweep values, the specific parameters that are different among configurations, and a list of parameter defaults that all configurations share. A for-loop can easily loop through both the current sweep parameter value and configuration, and pass along those instances of the parameters to be given to the simulator. Once all data points needed to generate the plot are created, the plot can generate and the program can end.

As an overview, the steps of this simulator are:
1. Define the simulation profile, which include information on all needed results.
2. For each sweep value and configuration, check the previously saved results under the same parameter hash.
3. If a result does not exist yet, run the simulation using the current parameters. Otherwise, continue.
4. Once all sweep values and configurations have generated results, generate the final plot.

This method is completely simple, and yet it has taken me a long while to finally create a specific coding method that suits all my needs. I firmly believe that every coder needs to determine their own best solution to a problem and the only way to learn is by doing. But in the interest of helping any struggling graduate students or amateur scientist I include my own method for tackling this problem, hopefully in a way that can be created once and replicated as needed.

-JRW