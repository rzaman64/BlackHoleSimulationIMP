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

> Full derivations are summarized from the attached `physics.pdf` within this repo.
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
