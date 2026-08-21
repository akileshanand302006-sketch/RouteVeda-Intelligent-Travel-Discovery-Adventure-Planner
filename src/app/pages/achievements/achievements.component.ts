import { Component, inject } from '@angular/core';
import { AchievementService } from '../../core/services/achievement.service';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.css'
})
export class AchievementsComponent {
  readonly achievementService = inject(AchievementService);
}
