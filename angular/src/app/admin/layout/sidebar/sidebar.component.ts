import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class SidebarComponent {
  menuState: { [key: string]: boolean } = {};

  toggleMenu(menuName: string) {
    this.menuState[menuName] = !this.menuState[menuName];
  }
}
