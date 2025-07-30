---
layout: default
title:  "Tri-Orthogonal Delay-Doppler Modulation: TODDM"
date:   2025-07-24 11:59:00 -0500
categories: projects
---

[Project GitHub Repository](https://github.com/JRW-lab/TODDM_simulator)

As society shifts to more demanding usages of wireless communication technology, it has become apparent that we have effectively reached a limit of orthogonal frequency division multiplexing (widely known as OFDM). This is due to delay and Doppler shifts appearing during data transmissions when a relatively high velocity can be seen between transmitting and receiving base stations. This same weakness of OFDM happens to be a strength of what became known as orthogonal time-frequency space modulation, or OTFS modulation.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/images/high-speed-railway.png" alt="Resiliency of OTFS to vehicular velocity" style="max-width: 100%; height: auto;">
  <p style="font-style: italic; margin-top: 0.5em;">Figure 1: Multipath fading between a base station and a high-speed train [1].</p>
</div>

OTFS quickly became well-known for its utility in high-speed environments due to its utilization of what's called the delay-Doppler domain, but it was initially designed to create continuous data waveforms using the same time-frequency pulse shaping methods seen in OFDM. This was because it was originally found to be impossible to create a practical equivalent delay-Doppler space that remains orthogonal throughout all of that space, but this has since been shown to not be necessary anyway. Instead, a pulse shaping waveform can be created that holds for only the desired region of delay-Doppler space. With this in mind, OTFS has since been slightly modified and created what is now known as orthogonal delay-Doppler multiplexing (ODDM).

If ODDM is unfamiliar to you, [please go here](https://oddm.io/) for a well-written primer on its fundamentals, but it works by essentially encoding data directly in the delay-Doppler domain, a subspace that does not experience fading as fast as the traditionally known time-frequency space. This resiliency is due to the delay-Doppler domain being effectively the time-frequency domain with a finer resolution, leaving the data relatively unaffected by the velocities of the receiver and transmitter. In fact, a high relative velocity actually compliments ODDM, as seen in Figure 2 below.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/images/oddm-velocity.png" alt="Resiliency of ODDM to vehicular velocity" style="max-width: 100%; height: auto;">
  <p style="font-style: italic; margin-top: 0.5em;">Figure 2: Resiliency of ODDM to vehicular velocity under different pulse shapes.</p>
</div>



###### [1] Wang, Xiyu & Wang, Gongpu & Fan, Rongfei & ai, bo. (2017). Channel Estimation With Expectation Maximization and Historical Information Based Basis Expansion Model for Wireless Communication Systems on High Speed Railways. IEEE Access. PP. 1-1. 10.1109/ACCESS.2017.2745708. 