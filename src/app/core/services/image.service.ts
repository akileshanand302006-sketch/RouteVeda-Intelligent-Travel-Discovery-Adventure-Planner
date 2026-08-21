import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly _isLightboxOpen = signal<boolean>(false);
  private readonly _lightboxImages = signal<string[]>([]);
  private readonly _currentImageIndex = signal<number>(0);
  private readonly _lightboxTitle = signal<string>('');

  readonly isLightboxOpen = computed(() => this._isLightboxOpen());
  readonly lightboxImages = computed(() => this._lightboxImages());
  readonly currentIndex = computed(() => this._currentImageIndex());
  readonly totalImages = computed(() => this._lightboxImages().length);
  readonly currentImage = computed(() => {
    const images = this._lightboxImages();
    const idx = this._currentImageIndex();
    return images[idx] || '';
  });
  readonly lightboxTitle = computed(() => this._lightboxTitle());

  /**
   * Returns empty string so components trigger authentic destination glass error state
   * rather than replacing with an unrelated destination (e.g. Taj Mahal).
   */
  getFallback(_category?: string): string {
    return '';
  }

  /**
   * Opens the glassmorphic lightbox with an image array.
   */
  openLightbox(images: string[], initialIndex: number = 0, title: string = ''): void {
    if (!images || images.length === 0) return;
    this._lightboxImages.set(images);
    this._currentImageIndex.set(Math.max(0, Math.min(initialIndex, images.length - 1)));
    this._lightboxTitle.set(title);
    this._isLightboxOpen.set(true);
  }

  closeLightbox(): void {
    this._isLightboxOpen.set(false);
  }

  nextImage(): void {
    const total = this._lightboxImages().length;
    if (total <= 1) return;
    this._currentImageIndex.update(idx => (idx + 1) % total);
  }

  prevImage(): void {
    const total = this._lightboxImages().length;
    if (total <= 1) return;
    this._currentImageIndex.update(idx => (idx - 1 + total) % total);
  }
}
