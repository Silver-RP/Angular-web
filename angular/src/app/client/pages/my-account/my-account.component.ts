import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountSidebarComponent } from '../../components/common/my-account-sidebar/my-account-sidebar.component';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MyAccountSidebarComponent,
  ]
})
export class MyAccountComponent implements OnInit {
  user: any = null;

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
  }
}
