---
layout: default
title:  "ODDM: Orthogonal Delay-Doppler Multiplexing"
date:   2026-01-06 00:09:00 -0500
categories: Project
---

[GitHub Repository](https://github.com/JRW-lab/Common_Wireless_Simulator)

While many modulation schemes are being proposed for the upcoming sixth generation of wireless carrier technology (better known as 6G), the most predominant candidate by far has been Orthogonal Time-Frequency Space modulation, or OTFS modulation. OTFS works by assigning data symbols to individual delay and Doppler taps, creating a 2D grid space where each symbol is modulated on a pulse that is orthogonal to all other pulses. For the sake of simplicity, delay and Doppler taps can be thought of as time and frequency taps, but with a much finer resolution than the typical scales used in time and frequency space. OTFS functions by generating data in the delay-Doppler domain before converting them to symbols in time-frequency space, before finally converting the signal into a transmittable continuous-time waveform. This is desirable because directly generating data in delay-Doppler space makes it inherently more resilient to delay-Doppler spread compared to modulating data in time-frequency space directly. This means that a transmitter and receiver is able to have a higher relative velocity between them before throughput is reduced, and in fact, at least one OTFS receiver design is even able to improve in performance as relative speed increases.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/images/OTFS_mod.jpeg" alt="Example of how data is modulated for delay-Doppler domain systems" style="max-width: 100%; height: auto;">
  <p style="font-style: italic; margin-top: 0.5em;">Figure 1: Example of how data is modulated for delay-Doppler domain systems.</p>
</div>

However, the proposed OTFS model has several flaws. 

- Most implementations use an OFDM-based approach, relying on existing 5G hardware while approximating the theoretical method (approximating Wigner transform)
- Pulse shaping and filtering is performed in time-frequency space, rather than directly in delay-Doppler space where the symbols are first modulated, 

in that designing an efficient receiver is a daunting task and most implementations utilize an OFDM-based approach, relying on existing 5G hardware rather than novel ideas. Moreover, pulse shaping and filtering is performed in time-frequency space