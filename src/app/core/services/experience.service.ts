import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Experience, ExperienceCategory } from '../../models/experience.model';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly http = inject(HttpClient);
  private readonly EXPERIENCES_URL = 'data/experiences.json';

  private readonly _experiences = signal<Experience[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  readonly experiences = this._experiences.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.loadExperiences();
  }

  private loadExperiences(): void {
    this._isLoading.set(true);
    this.http.get<Experience[]>(this.EXPERIENCES_URL).subscribe({
      next: (data) => {
        this._experiences.set(data);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load experiences.json:', err);
        this._isLoading.set(false);
      }
    });
  }

  getByCategory(category: ExperienceCategory): Experience | undefined {
    return this._experiences().find(e => e.category === category);
  }
}
