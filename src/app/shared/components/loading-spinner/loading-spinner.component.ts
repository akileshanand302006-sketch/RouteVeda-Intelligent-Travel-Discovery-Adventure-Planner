import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="loading-container">
      <div class="spinner-wrapper">
        <div class="spinner"></div>
        <div class="spinner-icon"><i class="bi bi-compass"></i></div>
      </div>
      <p class="loading-text">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; }
    .spinner-wrapper { position: relative; width: 64px; height: 64px; margin-bottom: 1rem; }
    .spinner {
      width: 64px; height: 64px;
      border: 3px solid var(--tf-border-light);
      border-top: 3px solid var(--tf-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .spinner-icon {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem; color: var(--tf-primary);
      animation: pulse 2s ease-in-out infinite;
    }
    .loading-text { color: var(--tf-text-secondary); font-size: 0.95rem; font-weight: 500; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  message = input<string>('Loading...');
}
