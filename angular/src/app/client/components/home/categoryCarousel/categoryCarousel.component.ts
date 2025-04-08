import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../../../services/home.service';

// Đăng ký Swiper
register();

interface Category {
  _id: string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-category-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categoryCarousel.component.html',
  styleUrls: ['./categoryCarousel.component.css'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperEl') swiperEl!: ElementRef;
  categories: Category[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.fetchCategories();
  }

  // Hàm để theo dõi từng item trong ngFor
  trackByFn(index: number, item: Category): string {
    return item._id;
  }

  fetchCategories() {
    this.homeService.getHomeProducts().subscribe({
      next: (data) => {
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          this.categories = [...data.categories]; 
        } else {
          console.error('Data received but categories array is empty or invalid:', data);
          this.error = 'No categories found';
        }
        this.loading = false;
        
        setTimeout(() => this.initializeSwiper(), 100);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.error = 'Failed to fetch categories';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    if (!this.loading && this.categories.length > 0) {
      setTimeout(() => this.initializeSwiper(), 100);
    }
  }

  initializeSwiper() {
    if (!this.swiperEl || !this.swiperEl.nativeElement) {
      console.error('Swiper element not found');
      return;
    }
  
    const swiperParams: SwiperOptions = {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 15,
      autoplay: { delay: 5000, disableOnInteraction: false },
      loop: true,
      breakpoints: {
        768: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
        992: { slidesPerView: 6, slidesPerGroup: 1, spaceBetween: 45 },
        1200: { slidesPerView: 8, slidesPerGroup: 1, spaceBetween: 60 },
      },
    };
  
    Object.assign(this.swiperEl.nativeElement, swiperParams);
  
    try {
      this.swiperEl.nativeElement.initialize();
  
      // Gắn sự kiện click cho nút điều hướng
      this.setupNavigationButtons();
    } catch (error) {
      console.error('Error initializing Swiper:', error);
    }
  }
  
  setupNavigationButtons() {
    const swiperInstance = this.swiperEl.nativeElement;
  
    const prevBtn = document.getElementById('custom-prev');
    const nextBtn = document.getElementById('custom-next');
  
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        swiperInstance.swiper.slidePrev();
      });
  
      nextBtn.addEventListener('click', () => {
        swiperInstance.swiper.slideNext();
      });
  
    } else {
      console.error('Navigation buttons not found');
    }
  }
    
  
}