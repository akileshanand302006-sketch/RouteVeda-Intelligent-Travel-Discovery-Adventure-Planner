import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  NgZone,
  inject,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-travel-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="travel-bg-container" [class.dark-mode]="themeService.isDark()">
      <!-- Layer 1: Scenic Travel Photo with subtle cinematic drift -->
      <div class="scenic-travel-layer" aria-hidden="true"></div>

      <!-- Layer 2: Theme-specific atmospheric color overlay & gradient vignette -->
      <div class="atmospheric-tint-layer" aria-hidden="true"></div>

      <!-- Layer 3: Ambient Radial Glow Orbs -->
      <div class="ambient-orbs-layer" aria-hidden="true">
        <div class="glow-orb orb-primary"></div>
        <div class="glow-orb orb-accent"></div>
        <div class="glow-orb orb-cyan"></div>
      </div>

      <!-- Layer 4: Three.js Interactive 3D Travel Atmosphere Canvas -->
      <canvas #threeCanvas class="three-atmosphere-canvas" aria-hidden="true"></canvas>

      <!-- Layer 5: Ultra-subtle frosted glass noise/specular texture -->
      <div class="specular-frosted-overlay" aria-hidden="true"></div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
      contain: strict;
    }

    .travel-bg-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    /* ---- Layer 1: Scenic Image ---- */
    .scenic-travel-layer {
      position: absolute;
      inset: -5%;
      width: 110%;
      height: 110%;
      background-image: url('/assets/images/backgrounds/routeveda-travel-bg.jpg');
      background-size: cover;
      background-position: center 30%;
      background-repeat: no-repeat;
      filter: saturate(1.15) contrast(1.05);
      animation: scenicDrift 90s ease-in-out infinite alternate;
      will-change: transform;
      transition: opacity 0.8s ease;
    }

    @keyframes scenicDrift {
      0% { transform: scale(1) translate(0, 0); }
      50% { transform: scale(1.04) translate(-1%, -1%); }
      100% { transform: scale(1.02) translate(1%, -0.5%); }
    }

    /* ---- Layer 2: Atmospheric Tint & Vignette ---- */
    .atmospheric-tint-layer {
      position: absolute;
      inset: 0;
      transition: background 0.6s ease;
    }

    /* Light Theme Atmosphere: Luminous, airy, visionOS pearlescent */
    .atmospheric-tint-layer {
      background:
        radial-gradient(ellipse 90% 70% at 50% 20%, rgba(255, 255, 255, 0.78) 0%, rgba(248, 250, 252, 0.88) 60%, rgba(241, 245, 249, 0.96) 100%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(241, 245, 249, 0.92) 100%);
    }

    /* Dark Theme Atmosphere: Rich deep obsidian/indigo with golden twilight warmth */
    .dark-mode .atmospheric-tint-layer {
      background:
        radial-gradient(ellipse 90% 65% at 50% 15%, rgba(13, 19, 36, 0.72) 0%, rgba(7, 10, 20, 0.88) 55%, rgba(5, 7, 15, 0.96) 100%),
        linear-gradient(180deg, rgba(9, 13, 24, 0.75) 0%, rgba(6, 9, 18, 0.92) 100%);
    }

    /* ---- Layer 3: Ambient Glow Orbs ---- */
    .ambient-orbs-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.35;
      animation: orbFloat 25s ease-in-out infinite alternate;
      will-change: transform, opacity;
      pointer-events: none;
    }

    .orb-primary {
      top: 15%;
      left: 10%;
      width: 45vw;
      height: 45vw;
      max-width: 600px;
      max-height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(124, 58, 237, 0.15) 60%, transparent 80%);
      animation-duration: 28s;
    }

    .orb-accent {
      bottom: 20%;
      right: 5%;
      width: 40vw;
      height: 40vw;
      max-width: 500px;
      max-height: 500px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.32) 0%, rgba(234, 88, 12, 0.12) 60%, transparent 80%);
      animation-duration: 32s;
      animation-delay: -5s;
    }

    .orb-cyan {
      top: 45%;
      right: 25%;
      width: 35vw;
      height: 35vw;
      max-width: 450px;
      max-height: 450px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(59, 130, 246, 0.1) 60%, transparent 80%);
      animation-duration: 36s;
      animation-delay: -10s;
    }

    .dark-mode .glow-orb {
      opacity: 0.45;
    }

    @keyframes orbFloat {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(30px, -40px) scale(1.08); }
      100% { transform: translate(-25px, 30px) scale(0.95); }
    }

    /* ---- Layer 4: Three.js Canvas ---- */
    .three-atmosphere-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0.85;
      transition: opacity 0.5s ease;
    }

    /* ---- Layer 5: Specular Frosted Glass Mesh ---- */
    .specular-frosted-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08), transparent 60%);
      pointer-events: none;
    }

    /* Accessibility: Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .scenic-travel-layer,
      .glow-orb {
        animation: none !important;
      }
    }

    /* Mobile Optimization: Tone down heavy blur orbs */
    @media (max-width: 768px) {
      .glow-orb {
        filter: blur(50px);
        opacity: 0.25;
      }
      .orb-cyan {
        display: none;
      }
    }
  `]
})
export class TravelBackgroundComponent implements OnInit, OnDestroy {
  readonly themeService = inject(ThemeService);
  private readonly ngZone = inject(NgZone);

  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('threeCanvas');

  // Three.js instances
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private animationFrameId?: number;

  // 3D Objects
  private particleMesh?: THREE.Points;
  private globeSphere?: THREE.LineSegments;
  private routeLinesGroup?: THREE.Group;

  // Interaction & motion state
  private targetMouseX = 0;
  private targetMouseY = 0;
  private currentMouseX = 0;
  private currentMouseY = 0;
  private isDestroyed = false;
  private isTabVisible = true;
  private prefersReducedMotion = false;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Run WebGL initialization outside Angular zone for max performance
    this.ngZone.runOutsideAngular(() => {
      // Delay slightly so DOM canvas element is bound
      setTimeout(() => {
        this.initThree();
        this.setupEventListeners();
      }, 50);
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.cleanupThree();
  }

  private initThree(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Create Scene
    this.scene = new THREE.Scene();

    // 2. Camera with pleasant cinematic perspective
    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 85);

    // 3. WebGL Renderer with antialias and alpha transparency
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: width > 768, // antialias on desktop only for efficiency
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    } catch {
      // Graceful fallback if WebGL is not available on this device
      return;
    }

    // 4. Construct Floating Travel Constellation Particles
    this.createTravelParticles();

    // 5. Construct India Geographic Sphere / Wireframe Globe
    this.createCelestialGlobe();

    // 6. Construct Floating Travel Route Arcs
    this.createTravelRouteLines();

    // 7. Start Animation Loop
    this.animate();
  }

  /**
   * Creates a constellation particle cloud of golden & cyan travel points
   */
  private createTravelParticles(): void {
    if (!this.scene) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 80 : 180; // Optimized count

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const isDark = this.themeService.isDark();
    const primaryColor = new THREE.Color(isDark ? 0x818cf8 : 0x6366f1);
    const accentColor = new THREE.Color(0xf59e0b);
    const cyanColor = new THREE.Color(0x06b6d4);

    for (let i = 0; i < count; i++) {
      // Scatter in wide cinematic volume behind the interface
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;

      // Color variation: 50% primary indigo, 30% golden accent, 20% cyan
      const r = Math.random();
      const chosenColor = r < 0.5 ? primaryColor : r < 0.8 ? accentColor : cyanColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      scales[i] = Math.random() * 2.5 + 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: isMobile ? 2.5 : 3.5,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particleMesh);
  }

  /**
   * Creates an elegant wireframe celestial travel globe positioned on the right
   */
  private createCelestialGlobe(): void {
    if (!this.scene) return;

    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 18 : 26;

    // Use lightweight Icosahedron or Sphere Wireframe
    const geometry = new THREE.IcosahedronGeometry(radius, 2);
    const wireframe = new THREE.WireframeGeometry(geometry);

    const isDark = this.themeService.isDark();
    const material = new THREE.LineBasicMaterial({
      color: isDark ? 0x6366f1 : 0x818cf8,
      transparent: true,
      opacity: isDark ? 0.22 : 0.18,
      blending: THREE.AdditiveBlending
    });

    this.globeSphere = new THREE.LineSegments(wireframe, material);
    // Position on right side of viewport for cinematic balance
    this.globeSphere.position.set(isMobile ? 0 : 38, isMobile ? 5 : -4, -15);
    this.scene.add(this.globeSphere);
  }

  /**
   * Creates 3D curved travel route trajectories spanning across space
   */
  private createTravelRouteLines(): void {
    if (!this.scene) return;

    this.routeLinesGroup = new THREE.Group();
    const isDark = this.themeService.isDark();

    // 4 curved route paths
    const routePoints = [
      [new THREE.Vector3(-45, -20, -10), new THREE.Vector3(-15, 15, 5), new THREE.Vector3(25, -10, -5)],
      [new THREE.Vector3(-25, 25, -5), new THREE.Vector3(10, 30, 10), new THREE.Vector3(45, 10, -12)],
      [new THREE.Vector3(-50, 5, -15), new THREE.Vector3(-5, -25, 0), new THREE.Vector3(35, 15, -8)],
      [new THREE.Vector3(20, -25, -5), new THREE.Vector3(38, 0, 15), new THREE.Vector3(50, 25, -10)]
    ];

    routePoints.forEach((pts, idx) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const curvePoints = curve.getPoints(40);
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const color = idx % 2 === 0 ? (isDark ? 0xf59e0b : 0xea580c) : (isDark ? 0x06b6d4 : 0x3b82f6);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: isDark ? 0.35 : 0.25,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(geometry, material);
      this.routeLinesGroup?.add(line);
    });

    this.scene.add(this.routeLinesGroup);
  }

  /**
   * High performance animation loop
   */
  private animate = (): void => {
    if (this.isDestroyed) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    // Pause rendering when tab is inactive to save battery/GPU
    if (!this.isTabVisible || !this.renderer || !this.scene || !this.camera) return;

    // Smooth pointer lerp
    this.currentMouseX += (this.targetMouseX - this.currentMouseX) * 0.04;
    this.currentMouseY += (this.targetMouseY - this.currentMouseY) * 0.04;

    if (!this.prefersReducedMotion) {
      // 1. Rotate Globe slowly
      if (this.globeSphere) {
        this.globeSphere.rotation.y += 0.0022;
        this.globeSphere.rotation.x += 0.0008;
      }

      // 2. Rotate Particle Constellation
      if (this.particleMesh) {
        this.particleMesh.rotation.y += 0.0006;
        this.particleMesh.rotation.x += 0.0003;
      }

      // 3. Float Route Lines
      if (this.routeLinesGroup) {
        this.routeLinesGroup.rotation.y += 0.001;
      }
    }

    // Camera responds gently to mouse parallax
    this.camera.position.x = this.currentMouseX * 5;
    this.camera.position.y = -this.currentMouseY * 4;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Event listeners for resize, pointer movement, and visibility
   */
  private setupEventListeners(): void {
    // 1. Mouse move for gentle parallax
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });

    // 2. Responsive resize
    window.addEventListener('resize', this.onWindowResize, { passive: true });

    // 3. Tab visibility to pause render loop
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onMouseMove = (e: MouseEvent): void => {
    if (this.prefersReducedMotion) return;
    this.targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private onWindowResize = (): void => {
    if (!this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  };

  private onVisibilityChange = (): void => {
    this.isTabVisible = !document.hidden;
  };

  /**
   * Proper disposal of Three.js resources to prevent memory leaks
   */
  private cleanupThree(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('resize', this.onWindowResize);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Dispose Geometries and Materials
    if (this.particleMesh) {
      this.particleMesh.geometry.dispose();
      (this.particleMesh.material as THREE.Material).dispose();
      this.scene?.remove(this.particleMesh);
    }

    if (this.globeSphere) {
      this.globeSphere.geometry.dispose();
      (this.globeSphere.material as THREE.Material).dispose();
      this.scene?.remove(this.globeSphere);
    }

    if (this.routeLinesGroup) {
      this.routeLinesGroup.children.forEach(child => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.scene?.remove(this.routeLinesGroup);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
  }
}
