import { Component, Input, signal, inject, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationImageService } from '../../../core/services/destination-image.service';
import { WikimediaImageService } from '../../../core/services/wikimedia-image.service';
import { Destination, DestinationImage } from '../../../models/destination.model';

@Component({
  selector: 'app-destination-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="destination-image-container"
      [class.has-error]="hasError()"
      [ngStyle]="{ 'aspect-ratio': aspectRatio }"
    >
      <!-- SKELETON SHIMMER (LOADING) -->
      @if (isLoading() && !hasError()) {
        <div class="skeleton-shimmer" aria-hidden="true"></div>
      }

      <!-- MAIN IMAGE -->
      @if (!hasError()) {
        <img
          [src]="effectiveSrc()"
          [alt]="altText()"
          [class]="cssClass + ' destination-img-element'"
          [class.is-loaded]="!isLoading() && isLoaded()"
          (load)="onImageLoad()"
          (error)="onImageError()"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
        />
      }

      <!-- ERROR / UNAVAILABLE STATE (PREMIUM GLASS PLACEHOLDER) -->
      @if (hasError()) {
        <div class="image-unavailable-placeholder" aria-label="Destination image unavailable">
          <div class="placeholder-glass-content">
            <div class="placeholder-icon-badge">
              <i class="bi bi-camera text-tf-primary"></i>
            </div>
            <span class="placeholder-title">Image Unavailable</span>
            @if (destinationName) {
              <span class="placeholder-subtitle text-truncate">{{ destinationName }}{{ stateName ? ', ' + stateName : '' }}</span>
            }
            <span class="badge-tf badge-tf-glass extra-small mt-1">
              <i class="bi bi-shield-check me-1"></i> Authentic Photography Only
            </span>
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

    .destination-image-container {
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
        rgba(255, 255, 255, 0.03) 25%,
        rgba(255, 255, 255, 0.12) 50%,
        rgba(255, 255, 255, 0.03) 75%
      );
      background-size: 200% 100%;
      animation: shimmerAnim 1.6s infinite cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }

    @keyframes shimmerAnim {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .destination-img-element {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transform: scale(1.02);
      transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: opacity, transform;
    }

    .destination-img-element.is-loaded {
      opacity: 1;
      transform: scale(1);
    }

    :host-context(.destination-card:hover) .destination-img-element.is-loaded {
      transform: scale(1.06);
    }

    /* Premium Placeholder */
    .image-unavailable-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: radial-gradient(circle at center, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95));
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      text-align: center;
      z-index: 2;
    }

    .placeholder-glass-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      max-width: 90%;
    }

    .placeholder-icon-badge {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(var(--tf-primary-rgb), 0.15);
      border: 1px solid rgba(var(--tf-primary-rgb), 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .placeholder-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--tf-text);
      letter-spacing: 0.02em;
    }

    .placeholder-subtitle {
      font-size: 0.75rem;
      color: var(--tf-text-muted);
      max-width: 100%;
    }
  `]
})
export class DestinationImageComponent implements OnChanges {
  private readonly destImageService = inject(DestinationImageService);
  private readonly wmService = inject(WikimediaImageService);

  @Input() src?: Destination | DestinationImage | string | null = '';
  @Input() alt?: string = '';
  @Input() aspectRatio?: string;
  @Input() useThumbnail: boolean = true;
  @Input() cssClass: string = '';
  @Input() destinationName?: string = '';
  @Input() stateName?: string = '';

  isLoading = signal<boolean>(true);
  isLoaded = signal<boolean>(false);
  hasError = signal<boolean>(false);

  effectiveSrc = computed(() => {
    const raw = this.src;
    if (!raw) return '';
    if (typeof raw === 'object' && raw !== null && 'name' in raw && 'state' in raw) {
      const dest = raw as Destination;
      return this.useThumbnail
        ? this.destImageService.getThumbnailImage(dest)
        : this.destImageService.getPrimaryImage(dest);
    }
    if (this.useThumbnail) {
      return this.wmService.getThumbnailUrl(raw);
    }
    return this.wmService.getHeroUrl(raw);
  });

  altText = computed(() => {
    if (this.alt) return this.alt;
    if (this.destinationName) {
      return `${this.destinationName}${this.stateName ? ', ' + this.stateName : ''} - Tourism Destination`;
    }
    return 'Authentic Tourism Destination Image';
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.isLoading.set(true);
      this.isLoaded.set(false);
      this.hasError.set(!this.effectiveSrc());
    }
  }

  onImageLoad(): void {
    this.isLoading.set(false);
    this.isLoaded.set(true);
    this.hasError.set(false);
  }

  onImageError(): void {
    this.isLoading.set(false);
    this.isLoaded.set(false);
    this.hasError.set(true);
  }
}
