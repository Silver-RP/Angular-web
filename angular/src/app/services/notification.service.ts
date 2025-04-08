import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root', 
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationSubject.asObservable(); 

  private timeoutId: any;

  constructor() {}

  showNotification(message: string, type: NotificationType = 'info', duration: number = 3000): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.notificationSubject.next({ message, type });

    this.timeoutId = setTimeout(() => {
      this.notificationSubject.next(null);
    }, duration);
  }
}
