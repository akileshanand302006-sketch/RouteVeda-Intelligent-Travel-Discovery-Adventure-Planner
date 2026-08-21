import { Injectable, signal, DestroyRef, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  private readonly destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  // Signals for real-time date and time
  private readonly _currentDate = signal<string>('');
  private readonly _currentTime = signal<string>('');
  private readonly _currentDay = signal<string>('');
  private readonly _formattedDate = signal<string>('');

  readonly currentDate = this._currentDate.asReadonly();
  readonly currentTime = this._currentTime.asReadonly();
  readonly currentDay = this._currentDay.asReadonly();
  readonly formattedDate = this._formattedDate.asReadonly();

  constructor() {
    this.updateDateTime();
    // Update every second using setInterval
    this.intervalId = setInterval(() => this.updateDateTime(), 1000);

    // Clean up interval when service is destroyed (using DestroyRef)
    this.destroyRef.onDestroy(() => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    });
  }

  /** Updates all date/time signals with current values */
  private updateDateTime(): void {
    const now = new Date();

    // Template literals for formatted strings
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this._currentDay.set(days[now.getDay()]);

    // Format: 12 August 2026
    this._currentDate.set(
      `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
    );

    // Format: 09:18:32 AM
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    this._currentTime.set(`${displayHours}:${minutes}:${seconds} ${ampm}`);

    // Full formatted date: Wednesday, 12 August 2026
    this._formattedDate.set(
      `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
    );
  }
}
