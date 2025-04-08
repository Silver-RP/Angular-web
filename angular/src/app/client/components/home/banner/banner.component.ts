import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent {
  categories = [
    {
      image: 'assets/app/images/home/demo3/category_9.jpg',
      title: 'Blazers',
      price: '$19',
    },
    {
      image: 'assets/app/images/home/demo3/category_10.jpg',
      title: 'Sportswear',
      price: '$19',
    },
  ];
}
