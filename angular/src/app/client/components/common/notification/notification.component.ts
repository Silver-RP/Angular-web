import { Component, OnInit } from '@angular/core';
import { NotificationService, NotificationType } from '../../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification" class="notification" [ngClass]="notification.type">
      {{ notification.message }}
    </div>
  `,
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notification: { message: string; type: NotificationType } | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((notif) => {
      this.notification = notif;
    });
  }
}
