import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-lightbox-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (imageService.isLightboxOpen()) {
      <div class="lightbox-overlay" (click)="imageService.closeLightbox()">
        <div class="lightbox-container glass-card" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="lightbox-header d-flex justify-content-between align-items-center">
            <div class="lightbox-title">
              <span class="fw-bold">{{ imageService.lightboxTitle() || 'Gallery Preview' }}</span>
              <span class="badge-tf badge-tf-glass ms-2">
                {{ imageService.currentIndex() + 1 }} / {{ imageService.totalImages() }}
              </span>
            </div>
            <button class="btn-close-lightbox" (click)="imageService.closeLightbox()" title="Close (Esc)">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Main Image -->
          <div class="lightbox-body">
            <img [src]="imageService.currentImage()" alt="Lightbox Preview" class="lightbox-img" />
          </div>

          <!-- Nav Controls -->
          @if (imageService.totalImages() > 1) {
            <button class="lightbox-nav-btn prev" (click)="imageService.prevImage()" title="Previous Image">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button class="lightbox-nav-btn next" (click)="imageService.nextImage()" title="Next Image">
              <i class="bi bi-chevron-right"></i>
            </button>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 15, 30, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }
    .lightbox-container {
      position: relative;
      max-width: 960px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: rgba(30, 41, 59, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--tf-radius-xl);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2);
      overflow: hidden;
    }
    .lightbox-header {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .btn-close-lightbox {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-close-lightbox:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #ef4444;
      transform: scale(1.1);
    }
    .lightbox-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow: hidden;
      min-height: 350px;
    }
    .lightbox-img {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: var(--tf-radius);
      box-shadow: var(--tf-shadow-lg);
      transition: transform 0.3s ease;
    }
    .lightbox-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(12px);
      color: #fff;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 2;
    }
    .lightbox-nav-btn:hover {
      background: var(--tf-gradient-primary);
      transform: translateY(-50%) scale(1.1);
    }
    .lightbox-nav-btn.prev { left: 16px; }
    .lightbox-nav-btn.next { right: 16px; }
  `]
})
export class LightboxModalComponent {
  readonly imageService = inject(ImageService);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.imageService.isLightboxOpen()) return;
    if (event.key === 'Escape') this.imageService.closeLightbox();
    if (event.key === 'ArrowRight') this.imageService.nextImage();
    if (event.key === 'ArrowLeft') this.imageService.prevImage();
  }
}
