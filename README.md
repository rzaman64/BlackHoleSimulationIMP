<<<<<<< HEAD
# Photon Ring – Real-Time Black Hole Simulator

A minimal, real-time WebGL/Three.js visualization of a **Schwarzschild** black hole with true gravitational lensing. This fork of the original oseiskar demo adds a glassy, compact UI and smooth **WASD** free-fly navigation for exploring the scene. More physics overlays are on the way.

---

## Features
- Real-time GPU ray-traced black hole rendering  
- Minimal, blurred/transparent control panel (repositioned under FPS; no scrollbar/“Close Controls”)  
- Mouse-drag look (OrbitControls) + **WASD/E/Q** fly; **Shift** for boost  
- Relativistic effect toggles (aberration, Doppler/beaming, time dilation, Lorentz contraction, light-travel time)  
- Starfield + accretion disk + optional planet with lensing  
- Built-in FPS meter; runs fully in the browser  
- *Planned:* ISCO & photon-sphere markers (GR), presets, high-res export, diagnostic overlays

---

## Controls
- **Mouse**: freecam - drag to look around
- **W / A / S / D**: forward / left / back / right
- **E / Q** (or Space / Ctrl): up / down
- **Shift**: speed boost
- **GUI**: quality, observer distance/motion, planet/disk toggles, relativistic effects, time/light-travel controls
- **Tip**: For the smoothest free-fly experience, keep Observer → motion off.

## How it works (physics overview)

> Full derivations are summarized from the attached `physics.pdf`.
- **Null geodesics in Schwarzschild spacetime**  
  For each pixel, a photon path is traced by integrating the (dimensionless) equation for $$\(u(\phi)=1/r\)$$:
  $$\[
  \frac{d^2u}{d\phi^2} + u = 3Mu^2
  \]$$
  (in geometrized units $$\(G=c=1\)$$; $$\(M\)$ is the mass parameter). Integration proceeds from camera-defined initial conditions until the ray escapes, hits the disk/planet, or crosses the horizon.

- **Light-travel time & apparent motion**  
  Along each ray we accumulate coordinate time to account for finite light speed (Shapiro-like delay), which shifts the apparent phase of moving objects.

- **Relativistic aberration & Doppler/beaming**  
  Rays are transformed between the observer/source frames with the Lorentz transform. Frequency shift and intensity use a “g-factor”/Doppler term (with gravitational redshift):
  $$\[
  g=\frac{\nu_{\text{obs}}}{\nu_{\text{emit}}}, \qquad I_{\text{obs}} \propto g^3 I_{\text{emit}}
  \]$$
  Colors are mapped from shifted spectra via a small lookup.

- **Key GR radii (planned overlays)**  
  Photon sphere at $$\(r=3M=1.5\,r_s\)$$; ISCO (Schwarzschild) at $$\(r=6M=3\,r_s\)$$. These will be exposed as optional markers/readouts.
---
## Customizations in this fork
- Repositioned dat.GUI under FPS with glassmorphism (blurred/translucent)
- Removed GUI scrollbar and “Close Controls” button; polished spacing
- WASD free-fly navigation (with E/Q vertical and Shift boost)
- Safer defaults and small UX refinements
---

## Getting started

**Customizations in this fork**
- Repositioned dat.GUI under FPS with glassmorphism (blurred/translucent)
- Removed GUI scrollbar and “Close Controls” button; polished spacing
- WASD free-fly navigation (with E/Q vertical and Shift boost)
- Safer defaults and small UX refinements

### Requirements
- A modern desktop browser with WebGL (Chrome/Firefox recommended)
- A local HTTP server (browsers block shader loads from `file://`)

### Run locally
```bash
# From the project root:
python3 -m http.server 8080
```
---
###
Credits
Base simulation and physics notes: Otto Seiskari (oseiskar)
Modern Implementation, maintanence, and ui: Rasib Zaman
Libraries: Three.js, dat.GUI, stats.js, etc.
This fork: UI refinements, WASD fly navigation, and upcoming GR overlays
=======
---
---

# Ray-traced simulation of a black hole

In this simulation, the light ray paths are computed by integrating an ODE describing the Schwarzschild geodesics using GLSL on the GPU, leveraging WebGL and [three.js](http://threejs.org). This should result to a fairly physically accurate gravitational lensing effect. Various other relativistic effects have also been added and their contributions can be toggled from the GUI.
The simulation has normalized units such that the Schwarzschild radius of the black hole is one and the speed of light is one length unit per second (unless changed using the "time scale" parameter).

See **[this page](https://oseiskar.github.io/black-hole/docs/physics.html)** ([PDF version](https://oseiskar.github.io/black-hole/docs/physics.pdf)) for a more detailed description of the physics of the simulation.

### System requirements

The simulation needs a decent GPU and a recent variant of Chrome or Firefox to run smoothly. In addition to changing simulation quality from the GUI, frame rate can be increased by shrinking the browser window and/or reducing screen resolution. Disabling the planet from the GUI also increases frame rate.

Example: runs 30+ fps at resolution 1920 x 1080 in Chrome 48 on a Linux desktop with GeForce GTX 750 Ti and "high" simulation quality

### Known artefacts

 * The striped accretion disk and planet textures are (obviously?) fake and are included to help visualizing motion.
 * The spectrum used in modeling the Doppler shift of the Milky Way background image is quite arbitrary (not based on real spectral data) and consequently the Doppler-shifted background colors may be wrong.
 * The lighting model of the planet is based on a point-like light source and a quite unphysical ambient component.
 * In the "medium" quality mode, the planet deforms unphysically when it travels between the camera and the black hole.
 * The light paths bend a bit more than they should due to low ODE solver step counts (see [numeric tests](https://github.com/oseiskar/black-hole/blob/numeric-notebooks/numeric_tests.ipynb)), but this seems to happen in a systematic way so that the image looks very similar in comparison to a more accurate simulation.
 * Lorentz contraction causes jagged looks in the planet when simultaneously enabled with "light travel time" and the planet is close to the black hole.
 * Texture sampling issues cause unintended star blinking.

_see **[COPYRIGHT.md](https://github.com/oseiskar/black-hole/blob/master/COPYRIGHT.md)** for license and copyright info_
>>>>>>> 0a30160 (Initial commit (working black hole build))
