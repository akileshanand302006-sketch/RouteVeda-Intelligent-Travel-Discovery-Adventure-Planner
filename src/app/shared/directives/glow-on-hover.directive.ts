import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

/**
 * Custom directive: appGlowOnHover
 * Adds a glowing border, elevation, and shadow effect on hover.
 * Demonstrates custom Angular directives.
 */
@Directive({
  selector: '[appGlowOnHover]',
  standalone: true
})
export class GlowOnHoverDirective {
  private readonly el = inject(ElementRef);

  /** Optional glow color input */
  glowColor = input<string>('rgba(99, 102, 241, 0.4)');

  @HostListener('mouseenter')
  onMouseEnter(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.boxShadow = `0 0 20px ${this.glowColor()}, 0 8px 32px rgba(0, 0, 0, 0.15)`;
    element.style.transform = 'translateY(-6px) scale(1.01)';
    element.style.borderColor = this.glowColor();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.boxShadow = '';
    element.style.transform = '';
    element.style.borderColor = '';
  }
}
