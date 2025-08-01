---
layout: default
title:  "Modular Simulator Design for 2D Plots"
date:   2025-07-22 10:00:00 -0500
categories: Post
highlight: true
toc: true
---

I've spent a lot of time thinking through the most organized way to simulate a system in order to fully understand it. Obviously this is a very broad statement, and I've gone through great lengths to keep the code general while still being readable. I eventually settled on a method that allows me to generate 2D plots along a range of a selected variable, specifying each line with its own settings. This method works for any stochastic process that intakes variables and outputs any kind of result metric.

Generally, this method works by treating a set of parameters as a unique unit and given a specific name, which can either be created in a readable format (I used to just list the parameter values in a string) or simply be a generated hash key. Each unique set of parameters is therefore treated as a single point in an N-dimensional space, where N is the number of parameters. In the same manner, a plot generated from these data points can be thought of as a 2D slice that holds all but a few parameters constant.

<div id="plot-container" style="position: relative; width: 100%; margin: 2em 0; text-align: center;">
  <button onclick="load3DPlot(this)" style="padding: 1em 2em; font-size: 1em;">Load Figure 1 (Interactive)</button>
</div>

<script>
  function load3DPlot(button) {
    const container = button.parentElement;

    container.innerHTML = `
      <div style="position: relative; width: 100%;">
        <iframe 
          src="/assets/3d_plane_plot.html" 
          style="
            width: 100%;
            height: auto;
            aspect-ratio: 4 / 3;
            border: none;
            display: block;
          "
          loading="lazy"
        ></iframe>

        <button onclick="unload3DPlot()" 
                style="
                  position: absolute;
                  bottom: 10px;
                  right: 10px;
                  padding: 0.5em 1.5em;
                  font-size: 0.9em;
                  background-color: #f0f0f0;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  cursor: pointer;
                ">
          Unload Plot
        </button>
      </div>
    `;
  }

  function unload3DPlot() {
    const container = document.getElementById("plot-container");
    container.innerHTML = `
      <button onclick="load3DPlot(this)" style="padding: 1em 2em; font-size: 1em;">Load Interactive Plot</button>
    `;
  }
</script>

<p style="font-style: italic; margin-top: 0.5em;">
  Figure 1: Interactive plot showing a 2D plane slicing through a 3D grid of points.
</p>

Figure 1 above shows a simplified case, where the generated plot made by the simulator is the 2D slice cutting through the 3D grid of data points (meaning number of variables N is equal to 3). Note that the points that fall on the 2D plane are marked red, and points that aren't are marked blue. Additionally, each green line of on-plane points represents a different line drawn on the generated plot, with its own set of unique variables. This is because a straight line only moves along one direction of motion, and moving in this direction only changes the value of the parametric value used for the plot range, holding all other variables constant. Since all data lines need to share the same y-axis, all lines of points on the 2D plane are parallel, moving in the same direction. The end goal of generating a plot is to create all needed on-plane data points to form the desired data lines. 

Speaking in terms of the plots themselves now, the range of x-values and the set of configurations are all that are needed to create a readable 2D plot. To create a flexible simulator that can display information in 2D plots, we must define the following:

- The parametric sweep parameter
- The range of sweep values
- The specific parameters that are different among configurations
- A set of parameter defaults that all configurations share.

A for-loop can easily loop through both the current sweep parameter value and configuration, and pass along those parameter instances as inputs for a simulator function. Once all data points needed to generate the plot are created, the plot can generate and the program can end.

### Overview

As an overview, the steps of this simulator are:
1. Define the simulation profile, which includes information on all needed results.
2. For each sweep range value and configuration, check the previously saved results under the same parameter hash.
3. If a result does not exist yet, run the simulation using the current parameters. Otherwise, continue.
4. Once all sweep values and configurations have generated results, generate the final plot.

If your result needs to be generated from a set number of trials instead of just once (for example, for generating an average or maximum result), this process is effectively the same but steps 2 and 3 are wrapped in another for-loop for iteratively increasing the minimum number of iterations for each result.

This method is clearly very simple, and yet it has taken me a long while to finally create a specific coding method that suits all my needs while still being flexible enough to be used in any project I'm working on. I firmly believe that every coder needs to determine their own best solution to a problem and the only way to learn is by doing. But in the interest of helping any struggling graduate students or amateur scientist, I include my own method for tackling this problem. Hopefully this guide can act as a useful roadmap for building your own system, and that personalized system may just need to be created once and replicated as needed for all your projects!

### Formatting Simulation Profiles

Before beginning, a simulation profile must be defined that contains all needed information to describe the current experiment. Any code snippets I include are written in MATLAB, since I am most familiar with it and I find it to be the most readable of the common programming languages.

The following is an example of how the information needed by the simulator can be defined.

```matlab
primary_var = "EbN0";
primary_vals = 9:3:24;
configs = {
    struct('system_name', "OTFS", 'M', 128)
    struct('system_name', "ODDM", 'M', 128)
    struct('system_name', "TODDM", 'M', 128, 'U', 1)
    struct('system_name', "TODDM", 'M', 64, 'U', 2)
    struct('system_name', "TODDM", 'M', 32, 'U', 4)
    };
default_parameters = struct(...
    'system_name', "TODDM",...
    'M_ary', 4, ...
    'EbN0', 18, ...
    'M', 128, ...
    'N', 16, ...
    'U', 1, ...
    'T', 1 / 15000, ...
    'Fc', 4e9, ...
    'vel', 500, ...
    'shape', "rrc", ...
    'alpha', 0.4, ...
    'Q', 8);
```

Just as was described before, this simulation profile defines the primary sweep variable ("EbN0"), the range of values for the parametric sweep ("primary_vals"), the configurations that define each plot line ("configs") and the default parameters that aren't defined by either the current parametric sweep value nor the current configuration ("default_parameters").

Note that each configuration can have an arbitrary length since each configuration is treated as a cell. This is useful for different kinds of simulations where a variable may exist in one system but not another. The parameters also do not need to be strictly one variable type, as seen with "default_parameters" being a collection of doubles and strings. 

Additionally, information needed to later generate the plot can be defined here.

```matlab
data_type = "BER";
title_vars = ["T","N","vel"];
legend_vec = {
    "OTFS, M = 128"
    "ODDM, M = 128"
    "TODDM, M = 128, U = 1"
    "TODDM, M = 64, U = 2"
    "TODDM, M = 32, U = 4"
    };
line_styles = {
    "-*"
    "-o"
    "-^"
    "--^"
    "-.^"
    };
line_colors = {...
    "#FF0000"
    "#0F62FE"
    "#000000"
    "#000000"
    "#000000"
    };
```

In my implementation for generating plots, I select a specific data type to display in the plot (in this case "BER") and the default parameters that are displayed in the plot title ("T","N", and "vel"). I also define each line's name (from "legend_vec"), line style (from "line_styles") and line color (from "line_colors"). In the past, I would generate information about the lines automatically from a collection of possible styles and colors, but this felt too general and would often lead to undesirable visualizations that didn't have an easy fix, so a manual method seems best for this.

With the initial simualtion profile set up, the results can now be iteratively simulated given the parameters we have defined.

### Simulation Loop

The simulation profile has now defined the parametric sweep range and the configurations to be tested, and in doing so we can simply loop through each of these settings for however many iterations are needed to fully render a result. An example of this loop can be seen below, where I have previously attempted to load all results for this experiment, saving the number of iterations for each in the matrix "prior_frames".

```matlab
for iter = 1:num_iters

  % Set current frame goal
  if iter < num_iters
      current_frames = iter*frames_per_iter;
  else
      current_frames = num_frames;
  end

  % Go through each settings profile
  for primvar_sel = 1:prvr_len
    for sel = 1:conf_len

      % Select parameters
      parameters = params_cell{primvar_sel,sel};

      % Continue to simulate if need more frames
      if current_frames > prior_frames(primvar_sel,sel)

        % Notify main thread of progress
        progress_bar_data = parameters;
        progress_bar_data.system_name = system_names{primvar_sel,sel};
        progress_bar_data.num_iters = num_iters;
        progress_bar_data.iter = iter;
        progress_bar_data.primvar_sel = primvar_sel;
        progress_bar_data.sel = sel;
        progress_bar_data.prvr_len = prvr_len;
        progress_bar_data.conf_len = conf_len;
        progress_bar_data.current_frames = current_frames;
        progress_bar_data.num_frames = num_frames;
        send(dq, progress_bar_data);

        % Simulate under current settings
        sim_save( save_data,...
                  conn_thrall,...
                  table_name,...
                  current_frames,...
                  parameters);

      end
    end
  end
end
```

-JRW