import { Component, input, output } from '@angular/core';
import { Activity } from '../../../models/activity.model';
import { GlowOnHoverDirective } from '../../directives/glow-on-hover.directive';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [GlowOnHoverDirective, TruncatePipe, ImageLoaderComponent],
  template: `
    <div class="glass-card activity-card" appGlowOnHover [glowColor]="'rgba(245, 158, 11, 0.4)'">
      <div class="card-img-wrapper">
        <app-image-loader
          [src]="activity().image"
          [alt]="activity().name"
          [category]="activity().category"
          cssClass="card-img-top"
        />
        <span class="category-badge badge-tf badge-tf-primary">{{ activity().category }}</span>
      </div>
      <div class="card-body">
        <h5 class="card-title fw-bold mb-1">{{ activity().name }}</h5>
        <p class="card-desc">{{ activity().description | truncate:85 }}</p>
        <div class="card-meta">
          <div class="meta-item">
            <i class="bi bi-clock text-tf-primary"></i>
            <span>{{ activity().duration }}</span>
          </div>
          <div class="meta-item">
            <span class="badge-tf"
              [class.badge-tf-success]="activity().difficulty === 'Easy'"
              [class.badge-tf-warning]="activity().difficulty === 'Moderate'"
              [class.badge-tf-danger]="activity().difficulty === 'Challenging' || activity().difficulty === 'Extreme'"
            >{{ activity().difficulty }}</span>
          </div>
        </div>
        <div class="card-footer-section">
          <div class="d-flex align-items-center gap-2">
            <div class="star-rating">
              <i class="bi bi-star-fill text-tf-accent"></i>
              <span class="rating-value ms-1">{{ activity().rating }}</span>
            </div>
            <span class="price-tag ms-2">₹{{ activity().price.toLocaleString() }}</span>
          </div>
          <button class="btn btn-sm btn-tf-accent" (click)="onAdd()" title="Add to Trip Builder">
            <i class="bi bi-plus-lg"></i> Add
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activity-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: var(--tf-radius-lg);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
      overflow: hidden;
      background: var(--tf-card-bg);
      border: 1px solid var(--tf-card-border);
    }
    .activity-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(245, 158, 11, 0.25);
      border-color: rgba(245, 158, 11, 0.4);
    }
    .card-img-wrapper {
      position: relative;
      overflow: hidden;
      height: 180px;
    }
    .category-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;
    }
    .card-body {
      padding: 1.1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .card-title {
      font-size: 1.05rem;
      color: var(--tf-text);
    }
    .card-desc {
      font-size: 0.85rem;
      color: var(--tf-text-secondary);
      margin-bottom: 10px;
      flex: 1;
      line-height: 1.5;
    }
    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.82rem;
      color: var(--tf-text-secondary);
    }
    .card-footer-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      border-top: 1px solid var(--tf-border-light);
    }
    .price-tag {
      font-weight: 700;
      color: var(--tf-accent);
      font-size: 1.05rem;
    }
  `]
})
export class ActivityCardComponent {
  activity = input.required<Activity>();
  addActivity = output<Activity>();

  onAdd(): void {
    this.addActivity.emit(this.activity());
  }
}
