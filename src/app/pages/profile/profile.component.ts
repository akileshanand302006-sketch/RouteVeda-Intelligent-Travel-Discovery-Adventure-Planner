import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TripService } from '../../core/services/trip.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AchievementService } from '../../core/services/achievement.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly tripService = inject(TripService);
  readonly wishlistService = inject(WishlistService);
  readonly achievementService = inject(AchievementService);
  private readonly notificationService = inject(NotificationService);

  isEditing = false;
  name = '';
  phone = '';
  location = '';
  bio = '';
  favoriteCategory = 'Adventure';
  travelStyle = 'Adventure';
  avatar = '';

  readonly avatarOptions = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80'
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.loadUserData(user);
    }
  }

  private loadUserData(user: User): void {
    this.name = user.name;
    this.phone = user.phone ?? '';
    this.location = user.location ?? '';
    this.bio = user.bio ?? '';
    this.favoriteCategory = user.favoriteCategory ?? 'Adventure';
    this.travelStyle = user.preferences?.travelStyle ?? 'Adventure';
    this.avatar = user.avatar ?? this.avatarOptions[0];
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  selectAvatar(url: string): void {
    this.avatar = url;
  }

  saveProfile(form: any): void {
    if (form.valid) {
      const currentUser = this.authService.currentUser();
      this.authService.updateProfile({
        name: this.name,
        phone: this.phone,
        location: this.location,
        bio: this.bio,
        avatar: this.avatar,
        favoriteCategory: this.favoriteCategory,
        preferences: {
          ...(currentUser?.preferences || {
            travelStyle: this.travelStyle,
            preferredDestinationType: this.favoriteCategory,
            currency: 'INR',
            notifications: { tripReminders: true, budgetAlerts: true, recommendations: true }
          }),
          travelStyle: this.travelStyle,
          preferredDestinationType: this.favoriteCategory
        }
      });

      this.isEditing = false;
      this.notificationService.showToastMessage('Profile updated successfully!', 'success');
    }
  }
}
