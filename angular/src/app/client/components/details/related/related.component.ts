import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { NotificationService } from '../../../../services/notification.service';
import { from } from 'rxjs';

register();

interface Product {
  _id: string;
  name: string;
  images: string[][];
  salePrice: number;
  price: number;
  productCate: string;
}

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './related.component.html',
  styleUrls: ['./related.component.css'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RelatedProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperEl') swiperEl!: ElementRef;
  products: Product[] = [];
  hoveredProduct: string = ''; // Lưu ID sản phẩm đang hover
  loading: boolean = true;
  error: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService

    ) {}

  ngOnInit() {
    this.fetchRelatedProducts();
  }

  fetchRelatedProducts() {
    const productId = window.location.pathname.split('/').pop();
    if (!productId) {
      this.error = 'Invalid product ID';
      this.loading = false;
      return;
    }

    this.productService.fetchProduct(productId).subscribe({
      next: (data) => {
        if (Array.isArray(data.relatedProducts) && data.relatedProducts.length > 0) {
          this.products = [...data.relatedProducts];
        } else {
          this.error = 'No related products found';
        }
        this.loading = false;
        setTimeout(() => this.initializeSwiper(), 100);
      },
      error: (err) => {
        console.error('Error fetching related products:', err);
        this.error = 'Failed to fetch related products';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    if (!this.loading && this.products.length > 0) {
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
        768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
        992: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 },
        1200: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 40 },
      },
    };

    Object.assign(this.swiperEl.nativeElement, swiperParams);

    try {
      this.swiperEl.nativeElement.initialize();
      this.setupNavigationButtons();
    } catch (error) {
      console.error('Error initializing Swiper:', error);
    }
  }

  setupNavigationButtons() {
    const swiperInstance = this.swiperEl.nativeElement;
    const prevBtn = document.getElementById('related-prev');
    const nextBtn = document.getElementById('related-next');

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

