import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  NgZone,
  inject,
  viewChild,
  effect
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
      filter: saturate(1.06) contrast(1.0) brightness(1.06);
      animation: scenicDrift 90s ease-in-out infinite alternate;
      will-change: transform;
      transition: opacity 0.8s ease, filter 0.8s ease;
    }

    .dark-mode .scenic-travel-layer {
      filter: saturate(1.1) contrast(1.12) brightness(0.68);
    }

    @keyframes scenicDrift {
      0% { transform: scale(1) translate(0, 0); }
      50% { transform: scale(1.03) translate(-1%, -0.8%); }
      100% { transform: scale(1.015) translate(1%, -0.4%); }
    }

    /* ---- Layer 2: Atmospheric Tint & Vignette ---- */
    .atmospheric-tint-layer {
      position: absolute;
      inset: 0;
      transition: background 0.6s ease;
    }

    /* Light Theme Atmosphere: Luminous alpine mist over lower forest, keeping Himalayan peaks & 3D space clear */
    .atmospheric-tint-layer {
      background:
        radial-gradient(ellipse 95% 65% at 50% 12%, rgba(255, 255, 255, 0.18) 0%, rgba(240, 246, 255, 0.38) 50%, rgba(225, 238, 252, 0.65) 100%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(245, 250, 255, 0.22) 28%, rgba(235, 245, 255, 0.55) 65%, rgba(225, 238, 252, 0.78) 100%);
    }

    /* Dark Theme Atmosphere: Rich deep nocturnal obsidian with warm indigo/amber undertones */
    .dark-mode .atmospheric-tint-layer {
      background:
        radial-gradient(ellipse 95% 70% at 50% 12%, rgba(13, 20, 40, 0.68) 0%, rgba(8, 12, 26, 0.86) 55%, rgba(5, 7, 16, 0.96) 100%),
        linear-gradient(180deg, rgba(10, 16, 32, 0.72) 0%, rgba(5, 8, 18, 0.94) 100%);
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
      filter: blur(100px);
      opacity: 0.22;
      animation: orbFloat 25s ease-in-out infinite alternate;
      will-change: transform, opacity;
      pointer-events: none;
      transition: opacity 0.6s ease;
    }

    .orb-primary {
      top: 15%;
      left: 6%;
      width: 45vw;
      height: 45vw;
      max-width: 550px;
      max-height: 550px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(124, 58, 237, 0.08) 60%, transparent 80%);
      animation-duration: 28s;
    }

    .orb-accent {
      bottom: 24%;
      right: 6%;
      width: 36vw;
      height: 36vw;
      max-width: 440px;
      max-height: 440px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(234, 88, 12, 0.04) 60%, transparent 80%);
      animation-duration: 32s;
      animation-delay: -5s;
    }

    .orb-cyan {
      top: 42%;
      right: 22%;
      width: 35vw;
      height: 35vw;
      max-width: 420px;
      max-height: 420px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.20) 0%, rgba(59, 130, 246, 0.06) 60%, transparent 80%);
      animation-duration: 36s;
      animation-delay: -10s;
    }

    .dark-mode .glow-orb {
      opacity: 0.40;
    }

    @keyframes orbFloat {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(25px, -35px) scale(1.06); }
      100% { transform: translate(-20px, 25px) scale(0.96); }
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
      pointer-events: none;
    }

    /* ---- Layer 5: Specular Frosted Glass Mesh ---- */
    .specular-frosted-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.06), transparent 60%);
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
        filter: blur(55px);
        opacity: 0.20;
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

  // Three.js core
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private animationFrameId?: number;

  // 3D Objects
  private particleMesh?: THREE.Points;
  private globeSphere?: THREE.LineSegments;
  private equatorRing?: THREE.LineLoop;
  private routeLinesGroup?: THREE.Group;
  private destinationNodesGroup?: THREE.Group;
  private moteTexture?: THREE.CanvasTexture;

  // Interaction & motion state
  private targetMouseX = 0;
  private targetMouseY = 0;
  private currentMouseX = 0;
  private currentMouseY = 0;
  private isDestroyed = false;
  private isTabVisible = true;
  private prefersReducedMotion = false;

  constructor() {
    // Reactive theme observer: smoothly update 3D materials on theme switch
    effect(() => {
      const isDark = this.themeService.isDark();
      this.update3DTheme(isDark);
    });
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Run WebGL initialization outside Angular zone for maximum performance
    this.ngZone.runOutsideAngular(() => {
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

  /**
   * Generates a circular, soft-glowing radial mote texture
   * Completely eliminates the default jagged "square particle" look!
   */
  private createMoteTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.32, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.22)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
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
        antialias: width > 768,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    } catch {
      return;
    }

    this.moteTexture = this.createMoteTexture();

    // 4. Construct Floating Travel Constellation Particles (Round Glowing Motes)
    this.createTravelParticles();

    // 5. Construct Subtle Celestial Travel Globe (Pushed far into background)
    this.createCelestialGlobe();

    // 6. Construct India Route Trajectories and Destination Nodes
    this.createIndiaTravelRoutes();

    // 7. Apply current theme colors
    this.update3DTheme(this.themeService.isDark());

    // 8. Start Animation Loop
    this.animate();
  }

  /**
   * Creates a constellation cloud of delicate, round luminous travel particles
   */
  private createTravelParticles(): void {
    if (!this.scene) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 45 : 75; // Restrained, non-crowded count

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const isDark = this.themeService.isDark();
    const primaryColor = new THREE.Color(isDark ? 0x818cf8 : 0x6366f1);
    const accentColor = new THREE.Color(0xf59e0b);
    const cyanColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < count; i++) {
      // Scatter in deep space behind the UI (-20 to -65)
      positions[i * 3] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 85;
      positions[i * 3 + 2] = -20 - Math.random() * 45;

      // Color variation: 50% indigo, 30% golden accent, 20% cyan
      const r = Math.random();
      const chosenColor = r < 0.5 ? primaryColor : r < 0.8 ? accentColor : cyanColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 1.8 : 2.4,
      map: this.moteTexture,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particleMesh);
  }

  /**
   * Creates an environmental celestial travel sphere with latitude/longitude
   * Pushed deep into the background (z = -40) to never dominate or obscure typography
   */
  private createCelestialGlobe(): void {
    if (!this.scene) return;

    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 14 : 19;

    // Elegant latitude/longitude grid wireframe
    const geometry = new THREE.SphereGeometry(radius, 20, 14);
    const wireframe = new THREE.WireframeGeometry(geometry);

    const isDark = this.themeService.isDark();
    const material = new THREE.LineBasicMaterial({
      color: isDark ? 0x6366f1 : 0x818cf8,
      transparent: true,
      opacity: isDark ? 0.10 : 0.07,
      blending: THREE.AdditiveBlending
    });

    this.globeSphere = new THREE.LineSegments(wireframe, material);
    // Position deep on the right side of the viewport
    this.globeSphere.position.set(isMobile ? 0 : 36, isMobile ? 12 : -6, -40);
    this.scene.add(this.globeSphere);

    // Subtle outer equatorial orbital ring
    const ringGeo = new THREE.RingGeometry(radius * 1.12, radius * 1.13, 36);
    const ringWire = new THREE.WireframeGeometry(ringGeo);
    const ringMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x6366f1,
      transparent: true,
      opacity: isDark ? 0.12 : 0.08,
      blending: THREE.AdditiveBlending
    });
    this.equatorRing = new THREE.LineLoop(ringWire, ringMat);
    this.equatorRing.rotation.x = Math.PI / 3;
    this.globeSphere.add(this.equatorRing);
  }

  /**
   * Creates India travel route trajectory arcs and destination hub nodes
   */
  private createIndiaTravelRoutes(): void {
    if (!this.scene) return;

    this.routeLinesGroup = new THREE.Group();
    this.destinationNodesGroup = new THREE.Group();

    // 6 Iconic Geographic Hubs across India
    const hubs = [
      new THREE.Vector3(-18, 16, -18),  // North: Himalayas / Kashmir / Ladakh
      new THREE.Vector3(-12, 6, -12),   // Capital: Delhi / Rajasthan
      new THREE.Vector3(-16, -10, -10), // West: Mumbai / Goa
      new THREE.Vector3(-10, -22, -14), // South: Bengaluru / Kerala
      new THREE.Vector3(8, 2, -12),     // East: Kolkata / Bengal
      new THREE.Vector3(20, 10, -18)    // North East: Shillong / Assam
    ];

    // Destination node point markers
    const nodeGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6
    });

    hubs.forEach(pos => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(pos);
      this.destinationNodesGroup?.add(node);
    });

    // 5 Route Connections
    const connections: [number, number, number][] = [
      [0, 1, 0xf59e0b], // North to Capital (Golden)
      [1, 2, 0x06b6d4], // Capital to West (Cyan)
      [2, 3, 0xf59e0b], // West to South (Golden)
      [1, 4, 0x818cf8], // Capital to East (Indigo)
      [4, 5, 0x06b6d4]  // East to North East (Cyan)
    ];

    connections.forEach(([fromIdx, toIdx, colorHex]) => {
      const p1 = hubs[fromIdx];
      const p2 = hubs[toIdx];

      // Quadratic curve lifted in Z for 3D trajectory
      const mid = new THREE.Vector3(
        (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 3,
        (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 3,
        Math.max(p1.z, p2.z) + 6
      );

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(28);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(geometry, material);
      this.routeLinesGroup?.add(line);
    });

    this.scene.add(this.destinationNodesGroup);
    this.scene.add(this.routeLinesGroup);
  }

  /**
   * Dynamically tunes 3D materials based on theme state
   */
  private update3DTheme(isDark: boolean): void {
    if (!this.scene) return;

    // Update Globe
    if (this.globeSphere) {
      const mat = this.globeSphere.material as THREE.LineBasicMaterial;
      mat.color.setHex(isDark ? 0x6366f1 : 0x4f46e5);
      mat.opacity = isDark ? 0.10 : 0.07;
    }

    if (this.equatorRing) {
      const mat = this.equatorRing.material as THREE.LineBasicMaterial;
      mat.color.setHex(isDark ? 0x06b6d4 : 0x6366f1);
      mat.opacity = isDark ? 0.12 : 0.08;
    }

    // Update Particles
    if (this.particleMesh) {
      const mat = this.particleMesh.material as THREE.PointsMaterial;
      mat.opacity = isDark ? 0.65 : 0.40;
    }

    // Update Routes
    if (this.routeLinesGroup) {
      this.routeLinesGroup.children.forEach(child => {
        if (child instanceof THREE.Line) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.opacity = isDark ? 0.28 : 0.16;
        }
      });
    }

    // Update Nodes
    if (this.destinationNodesGroup) {
      this.destinationNodesGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          mat.opacity = isDark ? 0.65 : 0.40;
        }
      });
    }
  }

  /**
   * High performance, slow cinematic animation loop
   */
  private animate = (): void => {
    if (this.isDestroyed) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    // Pause rendering when tab is inactive to save battery/GPU
    if (!this.isTabVisible || !this.renderer || !this.scene || !this.camera) return;

    // Smooth pointer lerp
    this.currentMouseX += (this.targetMouseX - this.currentMouseX) * 0.035;
    this.currentMouseY += (this.targetMouseY - this.currentMouseY) * 0.035;

    if (!this.prefersReducedMotion) {
      // 1. Rotate Globe very slowly
      if (this.globeSphere) {
        this.globeSphere.rotation.y += 0.0008;
        this.globeSphere.rotation.x += 0.0003;
      }

      // 2. Slow particle drift
      if (this.particleMesh) {
        this.particleMesh.rotation.y += 0.0004;
      }

      // 3. Subtle route lines tilt
      if (this.routeLinesGroup) {
        this.routeLinesGroup.rotation.y += 0.0003;
      }

      if (this.destinationNodesGroup) {
        this.destinationNodesGroup.rotation.y += 0.0003;
      }
    }

    // Camera responds gently to mouse parallax
    this.camera.position.x = this.currentMouseX * 3.5;
    this.camera.position.y = -this.currentMouseY * 2.5;
    this.camera.lookAt(0, 0, -20);

    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Event listeners for resize, pointer movement, and visibility
   */
  private setupEventListeners(): void {
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('resize', this.onWindowResize, { passive: true });
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

    if (this.moteTexture) {
      this.moteTexture.dispose();
    }

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

    if (this.equatorRing) {
      this.equatorRing.geometry.dispose();
      (this.equatorRing.material as THREE.Material).dispose();
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

    if (this.destinationNodesGroup) {
      this.destinationNodesGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      this.scene?.remove(this.destinationNodesGroup);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
  }
}
