import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  activeTab = signal<'login' | 'register'>('login');

  // Sign In fields - defaults to Demo User 1 (Akilesh)
  email = 'demo1@tripforge.com';
  password = 'password123';
  rememberMe = true;
  showPassword = signal<boolean>(false);

  // Registration fields
  regName = '';
  regEmail = '';
  regPassword = '';
  regConfirmPassword = '';
  regTravelStyle = 'Adventure';
  showRegPassword = signal<boolean>(false);

  readonly travelStyles = [
    'Adventure', 'Relaxation', 'Nature', 'Luxury', 'Budget', 'Family', 'Photography'
  ];

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    const savedEmail = this.authService.getRememberedEmail();
    if (savedEmail) {
      this.email = savedEmail;
    }
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.authService.clearError();
  }

  togglePasswordVisibility(event?: Event): void {
    if (event) event.stopPropagation();
    this.showPassword.update(v => !v);
  }

  toggleRegPasswordVisibility(event?: Event): void {
    if (event) event.stopPropagation();
    this.showRegPassword.update(v => !v);
  }

  quickFillUser(userNum: 1 | 2 | 3): void {
    if (userNum === 1) {
      this.email = 'demo1@tripforge.com';
      this.password = 'password123';
      this.notificationService.showToastMessage('Loaded Demo User 1 (Akilesh Sharma)', 'info');
    } else if (userNum === 2) {
      this.email = 'demo2@tripforge.com';
      this.password = 'password123';
      this.notificationService.showToastMessage('Loaded Demo User 2 (Priya Patel)', 'info');
    } else {
      this.email = 'demo3@tripforge.com';
      this.password = 'password123';
      this.notificationService.showToastMessage('Loaded Demo User 3 (Rahul Verma)', 'info');
    }
    this.setTab('login');
  }

  async onLogin(form: any): Promise<void> {
    if (!this.email || !this.password) {
      this.notificationService.showToastMessage('Please enter email and password.', 'warning');
      return;
    }

    const success = await this.authService.login(this.email, this.password, this.rememberMe);
    if (success) {
      this.notificationService.showToastMessage(`Welcome back, ${this.authService.displayName()}!`, 'success');
      this.router.navigate(['/']);
    } else {
      this.notificationService.showToastMessage(
        this.authService.loginError() || 'Invalid email or password. Please try again.',
        'error'
      );
    }
  }

  async onRegister(form: any): Promise<void> {
    if (!this.regName || !this.regEmail || !this.regPassword || !this.regConfirmPassword) {
      this.notificationService.showToastMessage('Please complete all required fields.', 'warning');
      return;
    }

    if (this.regPassword.length < 6) {
      this.notificationService.showToastMessage('Password must be at least 6 characters.', 'warning');
      return;
    }

    if (this.regPassword !== this.regConfirmPassword) {
      this.notificationService.showToastMessage('Passwords do not match. Please re-enter.', 'error');
      return;
    }

    const success = await this.authService.register({
      name: this.regName,
      email: this.regEmail,
      password: this.regPassword,
      travelStyle: this.regTravelStyle
    });

    if (success) {
      this.notificationService.showToastMessage('🎉 Account created successfully! Welcome to TripForge.', 'success');
      this.router.navigate(['/']);
    } else {
      this.notificationService.showToastMessage(
        this.authService.loginError() || 'Could not create account. Please check your details.',
        'error'
      );
    }
  }
}
