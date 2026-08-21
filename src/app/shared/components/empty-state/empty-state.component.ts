import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state animate-fade-in-up">
      <i [class]="'bi ' + icon()"></i>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (actionLabel()) {
        <button class="btn-tf-primary" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  icon = input<string>('bi-inbox');
  title = input<string>('Nothing here yet');
  message = input<string>('Get started by exploring our destinations.');
  actionLabel = input<string>('');
  action = output<void>();
}
