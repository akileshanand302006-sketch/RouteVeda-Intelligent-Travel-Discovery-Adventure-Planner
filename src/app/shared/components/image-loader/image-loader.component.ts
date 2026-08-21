import { Component, Input, signal, inject, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikimediaImageService } from '../../../core/services/wikimedia-image.service';

@Component({
  selector: 'app-image-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="image-loader-wrapper"
      [class.has-error]="hasError()"
      [ngStyle]="{ 'aspect-ratio': aspectRatio }"
    >
      @if (isLoading() && !hasError()) {
        <div class="skeleton-shimmer" aria-hidden="true"></div>
      }

      @if (!hasError()) {
        <img
          [src]="effectiveSrc()"
          [alt]="alt"
          [class]="cssClass + ' image-element'"
          [class.loaded]="!isLoading() && isLoaded()"
          (load)="onLoad()"
          (error)="onError()"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
        />
      }

      @if (hasError()) {
        <div class="image-error-placeholder" role="img" [attr.aria-label]="alt + ' (Image unavailable)'">
          <div class="error-placeholder-content">
            <div class="placeholder-icon-circle">
              <i class="bi bi-camera text-tf-primary"></i>
            </div>
            <span class="error-title">Authentic Image</span>
            <span class="error-subtitle text-truncate">{{ alt }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .image-loader-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: rgba(15, 23, 42, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.04) 25%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.04) 75%
      );
      background-size: 200% 100%;
      animation: shimmerAnim 1.6s infinite cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }

    @keyframes shimmerAnim {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .image-element {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transform: scale(1.02);
      transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: opacity, transform;
    }

    .image-element.loaded {
      opacity: 1;
      transform: scale(1);
    }

    .image-error-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      background: radial-gradient(circle at center, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95));
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      text-align: center;
      z-index: 2;
    }

    .error-placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      max-width: 90%;
    }

    .placeholder-icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(var(--tf-primary-rgb), 0.15);
      border: 1px solid rgba(var(--tf-primary-rgb), 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      margin-bottom: 0.25rem;
    }

    .error-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--tf-text);
      letter-spacing: 0.02em;
    }

    .error-subtitle {
      font-size: 0.72rem;
      color: var(--tf-text-muted);
      max-width: 100%;
    }
  `]
})
export class ImageLoaderComponent implements OnChanges {
  private readonly wmService = inject(WikimediaImageService);

  @Input() src: any = '';
  @Input() alt: string = 'Tourism Destination Image';
  @Input() category?: string = 'Default';
  @Input() cssClass: string = '';
  @Input() aspectRatio?: string;
  @Input() useThumbnail: boolean = true;

  isLoading = signal<boolean>(true);
  isLoaded = signal<boolean>(false);
  hasError = signal<boolean>(false);
  private hasTriedFallback = signal<boolean>(false);

  effectiveSrc = computed(() => {
    const raw = this.src;
    if (!raw) return this.wmService.getCategoryFallback(this.category, this.useThumbnail ? 800 : 1200);
    if (this.useThumbnail) {
      return this.wmService.getThumbnailUrl(raw, this.category);
    }
    return this.wmService.getHeroUrl(raw, this.category);
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] || changes['category']) {
      this.isLoading.set(true);
      this.isLoaded.set(false);
      this.hasError.set(false);
      this.hasTriedFallback.set(false);
    }
  }

  onLoad(): void {
    this.isLoading.set(false);
    this.isLoaded.set(true);
    this.hasError.set(false);
  }

  onError(): void {
    if (!this.hasTriedFallback()) {
      this.hasTriedFallback.set(true);
      const fallbackUrl = this.wmService.getCategoryFallback(this.category, this.useThumbnail ? 800 : 1200);
      if (fallbackUrl && fallbackUrl !== this.effectiveSrc()) {
        this.src = fallbackUrl;
        return;
      }
    }
    this.isLoading.set(false);
    this.isLoaded.set(false);
    this.hasError.set(true);
  }
}
