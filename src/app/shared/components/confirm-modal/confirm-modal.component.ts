import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop" (click)="onCancel()">
        <div class="modal-card animate-scale-in" (click)="$event.stopPropagation()">
          <div class="modal-icon">
            <i [class]="'bi ' + icon()"></i>
          </div>
          <h3>{{ title() }}</h3>
          <p>{{ message() }}</p>
          <div class="modal-actions">
            <button class="btn-tf-glass" (click)="onCancel()">Cancel</button>
            <button [class]="confirmBtnClass()" (click)="onConfirm()">
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(4, 7, 16, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
    }
    .modal-card {
      background: var(--glass-bg-strong);
      backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
      border: 1px solid var(--glass-border);
      border-radius: var(--card-radius);
      padding: 2.2rem;
      text-align: center;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 24px 60px var(--glass-shadow-glow), inset 0 1.5px 2px var(--glass-highlight);
      color: var(--text-primary);
    }
    .modal-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem;
      margin: 0 auto 1rem;
      background: rgba(239, 68, 68, 0.1);
      color: var(--tf-danger);
    }
    h3 { font-size: 1.3rem; margin-bottom: 0.5rem; }
    p { color: var(--tf-text-secondary); margin-bottom: 1.5rem; }
    .modal-actions { display: flex; gap: 12px; justify-content: center; }
  `]
})
export class ConfirmModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Are you sure?');
  message = input<string>('This action cannot be undone.');
  confirmLabel = input<string>('Delete');
  confirmBtnClass = input<string>('btn-tf-danger');
  icon = input<string>('bi-exclamation-triangle-fill');

  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
