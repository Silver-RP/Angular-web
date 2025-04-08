import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { CartService } from '../../../../services/cart.service';
import { NotificationService } from '../../../../services/notification.service';
import { from } from 'rxjs';
// Import các modules cần thiết của Swiper

interface Product {
  id: number;
  _id: string;
  name: string;
  cateName: string;
  salePrice: number;
  price: number;
  images: string[];
}

interface CateName {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-details-child',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None // Để CSS của Swiper hoạt động đúng
})

export class DetailsChildComponent implements OnInit, AfterViewInit, OnDestroy {
  product: Product | null = null;
  cateName: CateName[] = [];
  quantity: number = 1;
  routeSub: any;
  mainSwiper: Swiper | null = null;
  thumbsSwiper: Swiper | null = null;
  isDataLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}
 
  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.fetchProduct(productId);
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    
    if (this.mainSwiper) {
      this.mainSwiper.destroy();
    }
    if (this.thumbsSwiper) {
      this.thumbsSwiper.destroy();
    }
  }

  fetchProduct(id: string) {
    this.productService.fetchProduct(id).subscribe({
      next: (data) => {
        this.product = data.product;
        this.cateName = data.productCate;
        this.isDataLoaded = true;
        
        setTimeout(() => {
          this.initializeSwiper();
        }, 100);
      },
      error: (err) => console.error('Error fetching product:', err),
    });
  }
  

  initializeSwiper() {
    if (!this.product || !this.product.images || this.product.images.length === 0) {
      console.warn('❌ Không có dữ liệu sản phẩm hoặc ảnh.');
      return;
    }
  
    const commonConfig: SwiperOptions = {
      observer: true,          
      observeParents: true,     
      updateOnWindowResize: true, 
    };
  
    // 🔹 Khởi tạo Swiper thumbnails trước
    this.thumbsSwiper = new Swiper('.product-thumbs-swiper', {
      ...commonConfig,
      slidesPerView: 4,
      spaceBetween: 10,
      slideToClickedSlide: true,
      navigation: {
        nextEl: '.thumb-button-next',
        prevEl: '.thumb-button-prev',
      },
      on: {
        init: () => console.log('✅ Thumbs Swiper Initialized!'),
      },
    });
  
    // 🔹 Khởi tạo Swiper chính
    this.mainSwiper = new Swiper('.swiper-container', {
      ...commonConfig,
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: this.thumbsSwiper,
      },
      on: {
        init: () => console.log('✅ Main Swiper Initialized!'),
      },
    });
  
    setTimeout(() => {
      if (this.mainSwiper) {
        this.mainSwiper.update();
      }
      if (this.thumbsSwiper) {
        this.thumbsSwiper.update();
      }
    }, 500);
  
 
    this.mainSwiper?.on('slideChange', () => {
      if (this.mainSwiper && this.thumbsSwiper) {
        this.thumbsSwiper.slideTo(this.mainSwiper.realIndex);
      }
    });
    
  
    console.log('🎯 Swiper đã được khởi tạo!');
  }
  
  
  changeImage(index: number) {
    if (this.mainSwiper) {
      this.mainSwiper.slideTo(index);
    }
  }
  
  increaseQuantity() {
    this.quantity++;
  }
  
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(product: any) {
    if (!product || !product._id) {
      console.error("Product is undefined:", product);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }

    from(this.cartService.addToCart(product._id, this.quantity)).subscribe({
      next: (response) => {
        this.notificationService.showNotification('Product added to cart!', 'success');
      },
      error: (error) => {
        console.error("Error adding to cart:", error);
        this.notificationService.showNotification('Failed to add product to cart.', 'error');
      }
    });
  }

}