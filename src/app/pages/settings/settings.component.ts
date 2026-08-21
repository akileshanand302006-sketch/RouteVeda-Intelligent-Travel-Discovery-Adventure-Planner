import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { StorageService } from '../../core/services/storage.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  readonly themeService = inject(ThemeService);
  private readonly storage = inject(StorageService);
  private readonly notificationService = inject(NotificationService);

  private readonly SETTINGS_KEY = 'tripforge_user_settings';

  tripReminders = true;
  budgetAlerts = true;
  recommendations = true;
  preferredCurrency = 'INR (₹)';
  preferredTravelStyle = 'Adventure';

  ngOnInit(): void {
    const saved = this.storage.get<any>(this.SETTINGS_KEY);
    if (saved) {
      this.tripReminders = saved.tripReminders ?? true;
      this.budgetAlerts = saved.budgetAlerts ?? true;
      this.recommendations = saved.recommendations ?? true;
      this.preferredCurrency = saved.preferredCurrency ?? 'INR (₹)';
      this.preferredTravelStyle = saved.preferredTravelStyle ?? 'Adventure';
    }
  }

  saveSettings(): void {
    this.storage.set(this.SETTINGS_KEY, {
      tripReminders: this.tripReminders,
      budgetAlerts: this.budgetAlerts,
      recommendations: this.recommendations,
      preferredCurrency: this.preferredCurrency,
      preferredTravelStyle: this.preferredTravelStyle
    });

    this.notificationService.showToastMessage('Settings saved successfully!', 'success');
  }
}
