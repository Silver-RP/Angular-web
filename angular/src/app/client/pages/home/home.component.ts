import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/home/banner/banner.component';
import { CategoryCarouselComponent } from '../../components/home/categoryCarousel/categoryCarousel.component';
import { FeaturedProductsComponent } from '../../components/home/featuredProducts/featuredProducts.component';
import { HotProductsComponent } from '../../components/home/hotProducts/hotProducts.component';
import { SlideShowComponent } from '../../components/home/slideShow/slideShow.component';
import { HeadComponent } from "../../layout/head/head.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    HeadComponent,
    CommonModule,
    SlideShowComponent,
    CategoryCarouselComponent,
    HotProductsComponent,
    BannerComponent,
    FeaturedProductsComponent,
  ]
})
export class HomeComponent {}
