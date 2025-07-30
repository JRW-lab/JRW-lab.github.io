---
layout: default
title:  "Frequency-Based Detection of Physiological Processes"
date:   2025-07-25 00:09:00 -0500
categories: projects
---

[Project GitHub Repository](https://github.com/JRW-lab/PVP_IPFM_simulator)

Signals collected from physiological processes have been ubiquitous in medical settings since arguably the beginning of civilization, although rudamentary uses were not as visualizable as what technology allows today. For instance, it has long been known that finding a patient's pulse was an indicator that said patient was still alive. Obviously, advances in medical science and methodology have revealed much more about the human body over the years, and the binary indicator of "alive/deceased" has been replaced with a more sophisticated interpretations of internal bodily processes.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/gifs/ekg-heart-rate.gif" alt="Gif of EKG signal" style="max-width: 100%; height: auto;">
  <p style="font-style: italic; margin-top: 0.5em;">Figure 1: Example of electrocardiogram (commonly known as an EKG signal).</p>
</div>

More recently, peripheral venous pressure (PVP) waveforms have been seen to be particularly sensitive to changes to the cardiovascular system, such as dehydration and blood loss. Collecting PVP signals can be performed non-invasively with an external monitor, and they measure the relative pressure seen within a nearby vein. Taking a small time-domain window of a set duration (ex: 1 second or 10 seconds), a fast Fourier transform (commonly known as FFT) can be performed to get the frequency-domain representation of a subsection of the signal. These PVP signals are information dense in the frequency domain, and a logistic regression model can be trained to detect the differences in frequency components between two distinct groups, enabling accurate prediction of the state of a patient not seen in training.

Aside from being a useful tool for determining whether or not a patient is in a specific condition (hydrated vs. dehydrated, bleeding vs. stable, etc.), a sort of decision tree can emerge as a result of performing incrementally more precise comparisons of frequency components. The implication of this is that one could feasibly design a multi-stage detector for any cardiovascular process, given sufficient training data.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/images/multi-stage-detector.png" alt="Multi-stage detector example" style="max-width: 100%; height: auto;">
  <p style="font-style: italic; margin-top: 0.5em;">Figure 2: Decision tree for multi-stage total blood volume (TBV) detector.</p>
</div>

At the time of writing this, the code included on GitHub can only perform the single-stage detection method, but implementing multiple layers is not fundamentally different; it simply performs prediction on the same frequency domain sample multiple times using different models. While this strategy of using PVP signals is still fairly new, the potential benefit to the medical field should be apparent, and I hope that it eventually develops as a real tool for preventing complications in a clinical setting. If you are interested in using logistic regression models for your own detection project using PVP signals, feel free to look at the project code included above!

-JRW