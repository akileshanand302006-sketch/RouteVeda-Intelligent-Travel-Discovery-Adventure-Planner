import { Directive, ElementRef, HostListener, Input, booleanAttribute } from '@angular/core';

@Directive({
  selector: '[appLiquidGlassPointer]',
  standalone: true
})
export class LiquidGlassPointerDirective {
  @Input({ transform: booleanAttribute }) disableTilt = false;

  private isTouchDevice = false;
  private prefersReducedMotion = false;

  constructor(private readonly el: ElementRef<HTMLElement>) {
    if (typeof window !== 'undefined') {
      this.isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (this.isTouchDevice || this.prefersReducedMotion) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

    const style = this.el.nativeElement.style;
    style.setProperty('--mouse-x', `${xPercent.toFixed(1)}%`);
    style.setProperty('--mouse-y', `${yPercent.toFixed(1)}%`);
    style.setProperty('--mouse-px-x', `${x.toFixed(0)}px`);
    style.setProperty('--mouse-px-y', `${y.toFixed(0)}px`);

    if (!this.disableTilt) {
      // Subtle 3D tilt (max 3 degrees for refined Apple-grade feel)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.isTouchDevice || this.prefersReducedMotion) return;

    const style = this.el.nativeElement.style;
    style.setProperty('--mouse-x', '50%');
    style.setProperty('--mouse-y', '50%');
    style.transform = '';
  }
}
