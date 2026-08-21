import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExperienceService } from '../../core/services/experience.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.css'
})
export class ExperiencesComponent {
  readonly experienceService = inject(ExperienceService);
}
