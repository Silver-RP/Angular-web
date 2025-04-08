import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../../../services/home.service';
import { CartService } from '../../../../services/cart.service';
import { NotificationService } from '../../../../services/notification.service';
import { from } from 'rxjs';

register();

interface Product {
  _id: string;
  name: string;
  price: string;
  salePrice: string;
  images: string[];
  isWishlisted: boolean;
}

@Component({
  selector: 'app-countdown',
  imports: [CommonModule], 
  standalone: true,
  template: `
    <div class="d-flex text-center pt-4 mb-3">
      <div *ngFor="let unit of timeLeft | keyvalue" class="countdown-unit mx-2">
        <span class="countdown-num d-block">{{ unit.value }}</span>
        <span class="countdown-word text-uppercase text-secondary">
          {{ unit.key }}
        </span>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CountdownComponent implements OnInit {

  timeLeft: any = {};
  interval: any;
  targetDate: string = '2025-12-31T23:59:59';

  ngOnInit() {
    this.calculateTimeLeft();
    this.interval = setInterval(() => this.calculateTimeLeft(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  calculateTimeLeft() {
    const difference = +new Date(this.targetDate) - +new Date();
    this.timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
}

@Component({
  selector: 'app-hot-products',
  standalone: true,
  imports: [CommonModule, RouterModule, CommonModule, CountdownComponent],
  templateUrl: './hotProducts.component.html',
  styleUrls: ['./hotProducts.component.css'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HotProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperEl') swiperEl!: ElementRef;
  hotDeals: Product[] = [];

  // constructor(private homeService: HomeService, private cartService: CartService) {}
  constructor(
    private homeService: HomeService,
    private cartService: CartService,
    private notificationService: NotificationService
    ) {}

    
  ngAfterViewInit(): void {
                                                                                
  }


  ngOnInit() {
    this.fetchHotDeals();
  }

  fetchHotDeals() {
    this.homeService.getHomeProducts().subscribe({
      next: (data) => {
        this.hotDeals = data.productsHot || [];
        setTimeout(() => this.initializeSwiper(), 100);
      },
      error: (err) => console.error('Error fetching hot deals:', err),
    });
  }

  initializeSwiper() {
    if (!this.swiperEl || !this.swiperEl.nativeElement) return;

    const swiperParams: SwiperOptions = {
      slidesPerView: 2,
      spaceBetween: 15,
      autoplay: { delay: 5000 },
      breakpoints: {
        768: { slidesPerView: 2, slidesPerGroup: 3, spaceBetween: 24 },
        992: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 30 },
        1200: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 30 },
      },
    };

    Object.assign(this.swiperEl.nativeElement, swiperParams);
    this.swiperEl.nativeElement.initialize();
  }

  addToCart(product: Product) {
    if (!product || !product._id) {
      console.error("Product is undefined:", product);
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }
  
    from(this.cartService.addToCart(product._id, 1)).subscribe({
      next: (response) => {
        // console.log("Cart response:", response);
        this.notificationService.showNotification('Product added to cart!', 'success');
      },
      error: (error) => {
        console.error("Error adding to cart:", error);
        this.notificationService.showNotification('Failed to add product to cart.', 'error');
      }
    });
  }
}
