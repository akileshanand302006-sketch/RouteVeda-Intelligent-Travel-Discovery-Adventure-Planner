import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container not-found-page">
      <div class="container text-center py-5">
        <div class="nf-card glass-card p-5 mx-auto max-w-600 animate-scale-in">
          <div class="nf-icon mb-3">
            <i class="bi bi-compass text-tf-primary display-1 animate-float d-block"></i>
          </div>
          <h1 class="gradient-text display-3 font-weight-bold">404</h1>
          <h3 class="mb-3">Destination Not Found</h3>
          <p class="text-tf-secondary mb-4">
            Looks like you've wandered off the map! The page or adventure destination you are looking for doesn't exist.
          </p>
          <a routerLink="/" class="btn-tf-primary btn-lg">
            <i class="bi bi-house"></i> Return to Safety (Home)
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .max-w-600 { max-width: 600px; }
  `]
})
export class NotFoundComponent {}
