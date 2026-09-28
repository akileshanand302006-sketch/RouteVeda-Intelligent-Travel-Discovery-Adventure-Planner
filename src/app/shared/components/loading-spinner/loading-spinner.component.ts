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
    .spinner-wrapper {
      position: relative;
      width: 72px;
      height: 72px;
      margin-bottom: 1.25rem;
      background: var(--glass-bg-soft);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 30px var(--glass-shadow-glow), inset 0 1px 1.5px var(--glass-highlight);
    }
    .spinner {
      position: absolute;
      inset: 4px;
      border: 3px solid transparent;
      border-top: 3px solid var(--accent-primary);
      border-right: 3px solid rgba(124, 58, 237, 0.4);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .spinner-icon {
      font-size: 1.6rem;
      color: var(--accent-primary);
      animation: pulse 2s ease-in-out infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loading-text { color: var(--text-secondary); font-size: 0.95rem; font-weight: 500; letter-spacing: 0.02em; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  message = input<string>('Loading...');
}
