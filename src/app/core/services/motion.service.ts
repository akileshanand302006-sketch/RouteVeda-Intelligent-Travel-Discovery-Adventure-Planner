import { Injectable } from '@angular/core';
import { animate, createTimeline, stagger } from 'animejs';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  /** Detect whether the user prefers reduced motion */
  readonly prefersReducedMotion: boolean =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Staggered entrance animation for cards, dashboard modules, or list items.
   * Uses gentle scale, translateY, opacity, and backdrop blur transition.
   */
  animateCardEntrance(targets: string | HTMLElement | HTMLElement[], delayOffset: number = 0): void {
    if (this.prefersReducedMotion || typeof document === 'undefined') return;

    try {
      animate(targets, {
        opacity: [0, 1],
        translateY: [18, 0],
        scale: [0.97, 1],
        duration: 650,
        delay: stagger(65, { start: delayOffset }),
        ease: 'outCubic'
      });
    } catch {
      // Graceful fallback if DOM is not ready
    }
  }

  /**
   * Hero section entrance animation: badge, title, subtitle, buttons, stats
   */
  animateHero(containerSelector: string): void {
    if (this.prefersReducedMotion || typeof document === 'undefined') return;

    try {
      const tl = createTimeline({
        defaults: { ease: 'outCubic' }
      });

      tl.add(`${containerSelector} .hero-badge`, {
        opacity: [0, 1],
        translateY: [-10, 0],
        scale: [0.9, 1],
        duration: 500
      })
      .add(`${containerSelector} h1`, {
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 750
      }, '-=350')
      .add(`${containerSelector} .hero-subtitle`, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 650
      }, '-=500')
      .add(`${containerSelector} .hero-actions .btn-tf-primary, ${containerSelector} .hero-actions .btn-tf-glass, ${containerSelector} .hero-actions .btn-tf-accent`, {
        opacity: [0, 1],
        translateY: [14, 0],
        scale: [0.95, 1],
        delay: stagger(80),
        duration: 600
      }, '-=400')
      .add(`${containerSelector} .hero-stats`, {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.98, 1],
        duration: 700
      }, '-=300');
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Smooth number counter animation for travel metrics & stats
   */
  animateCounter(element: HTMLElement, targetValue: number, suffix: string = '', duration: number = 1400): void {
    if (this.prefersReducedMotion || typeof document === 'undefined' || !element) {
      if (element) element.textContent = `${targetValue}${suffix}`;
      return;
    }

    try {
      const counterObj = { val: 0 };
      animate(counterObj, {
        val: targetValue,
        round: 1,
        ease: 'outExpo',
        duration,
        onUpdate: () => {
          element.textContent = `${counterObj.val.toLocaleString()}${suffix}`;
        }
      });
    } catch {
      element.textContent = `${targetValue}${suffix}`;
    }
  }

  /**
   * Micro-interaction: subtle tactile press & glow pulse on interactive elements
   */
  pulseElement(target: HTMLElement): void {
    if (this.prefersReducedMotion || !target) return;

    try {
      animate(target, {
        scale: [1, 0.96, 1.02, 1],
        duration: 380,
        ease: 'outQuad'
      });
    } catch {
      // no-op
    }
  }
}
