---
layout: default
title:  "ODDM: Orthogonal Delay-Doppler Multiplexing"
date:   2026-01-06 00:09:00 -0500
categories: Project
---

[GitHub Repository](https://github.com/JRW-lab/Common_Wireless_Simulator)  
[Relevant Paper](https://ieeexplore.ieee.org/document/11319320)

While many modulation schemes are being proposed for the upcoming sixth generation of wireless carrier technology (better known as 6G), the most predominant candidate by far has been Orthogonal Time-Frequency Space modulation, or OTFS modulation. OTFS works by assigning data symbols to individual delay and Doppler taps, creating a 2D grid space where each symbol is modulated on a pulse that is orthogonal to all other pulses. For the sake of simplicity, delay and Doppler taps can be thought of as time and frequency taps, but with a much finer resolution than the typical scales used in time and frequency space.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/images/OTFS_mod.jpeg" alt="Example of how data is modulated for delay-Doppler domain systems" style="max-width: 100%; height: auto;">
  <p style="font-style: italic; margin-top: 0.5em;">Figure 1: Example of how data is modulated for delay-Doppler domain systems.</p>
</div>

OTFS functions by generating data in the delay-Doppler domain before converting them to symbols in time-frequency space, then finally converting the signal into a transmittable continuous-time waveform. This is desirable because directly embedding data in delay-Doppler space makes it inherently more resilient to delay-Doppler spread, compared to modulating data in time-frequency space. This means that a transmitter and receiver is able to have a higher relative velocity between them before throughput is reduced, and in fact, at least one OTFS receiver design is found to be able to improve in performance as relative speed increases.

However, the proposed OTFS model has several flaws. Notably, most implementations use an OFDM-based approach, relying on existing 5G hardware to perform IDFT rather than the more complex Wigner transform. This leads to reduced complexity in the receiver design at the expense of precision for determining delay and Doppler shifts, leading to overall lower efficiency. Arguably the most pressing issue, though, is that pulse shaping and filtering is performed in time-frequency space, rather than directly in delay-Doppler space where the symbols are first modulated. By converting delay-Doppler symbols to time-frequency symbols before pulse shaping, severe ISI is introduced because pulse-shaping waveforms that are orthogonal in time-frequency space may not be orthogonal in delay-Doppler space.

Despite these known issues, OTFS is still seen as a top contender for the basis of 6G, because it was theorized that pulse-shaping waveforms that are orthogonal in delay-Doppler space simply was not possible, based on the Weyl-Heisenberg frame theory. But, crucially, the WH frame theory explicitly stated that there were no *globally* orthogonal waveforms in delay-Doppler space. Interesting enough, that is not actually needed to directly pulse shape data in delay-Doppler space, since only a small subset of the space is used to create the 2D data grid. Based on this revelation, Orthogonal Delay-Doppler Multiplexing, or ODDM, was developed.

<div style="text-align: center; margin: 2em 0;">
  <img src="/assets/images/oddm_train.svg" alt="The locally-orthogonal delay-Doppler prototype pulse waveform" style="max-width: 100%; height: auto;">
  <p style="font-style: italic; margin-top: 0.5em;">Figure 2: The locally-orthogonal delay-Doppler prototype pulse waveform.</p>
</div>

To support local orthogonality in delay-Doppler space, the ODDM prototype pulse is actually a collection of elementary pulses. For a system with M subcarriers, elementary pulses are placed T₀ = T/M apart in time, where T is the time duration of one time symbol. In creating this prototype pulse waveform, each delay-Doppler symbol can be modulated on a delay- and Doppler-shifted version of the pulse waveform, and the results of these modulations are additively summed to form the continuous-time waveform, ready for transmission. After the signal has been captured at the receiver, it is passed through several matching filters of different frequency offsets before discrete sampling and equalization. These filters are similar to the prototype pulse waveform, with the slight modification of being extended in time by one more elementary pulse in either direction. This causes a wrap-around effect in the delay and Doppler spreads which additionally eliminates the need for cyclic prefix, although a guard band is still required to isolate frames that are adjacent in the spectrum.

All this is to say that ODDM seems to be a promising alternative to the much-loved OTFS modulation scheme, and in certain scenarios is shown to enable superior performance. If this interests you and would like to learn more, I urge you to read the paper I just helped finish, as well as inspect my code I used to generate the results for said paper. Links to both can be found at the top of this page!

Additionally, ODDM would not be possible without the work of Dr. Hai Lin and Dr. Jindong Yuan. A more technical explanation of the ODDM system is presented on their [website](https://oddm.io/).

-JRW