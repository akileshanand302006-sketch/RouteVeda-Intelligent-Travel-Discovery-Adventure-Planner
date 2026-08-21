import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AchievementService } from '../../core/services/achievement.service';
import { DestinationService } from '../../core/services/destination.service';
import { NotificationService } from '../../core/services/notification.service';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-bucket-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bucket-list.component.html',
  styleUrl: './bucket-list.component.css'
})
export class BucketListComponent {
  readonly achievementService = inject(AchievementService);
  readonly destinationService = inject(DestinationService);
  private readonly notificationService = inject(NotificationService);

  toggleVisited(dest: Destination): void {
    const isNowVisited = this.achievementService.toggleVisited(dest.id);
    if (isNowVisited) {
      this.notificationService.showToastMessage(`Marked ${dest.name} as Visited! 🇮🇳`, 'success');
    } else {
      this.notificationService.showToastMessage(`Removed ${dest.name} from visited list`, 'info');
    }
  }
}
