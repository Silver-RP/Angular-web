import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-slide-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slideShow.component.html',
  styleUrls: ['./slideShow.component.css'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SlideShowComponent implements AfterViewInit, OnInit {
  @ViewChild('swiper') swiper!: ElementRef;

  slides = [
    { id: 1, imgSrc: 'assets/app/images/slideshow-character1.png', title: 'Night Spring', subtitle: 'Dresses', label: 'Dresses' },
    { id: 2, imgSrc: 'assets/app/images/home/demo3/slideshow-character1.png', title: 'Night Spring', subtitle: 'Dresses', label: 'Summer' },
    { id: 3, imgSrc: 'assets/app/images/slideshow-character2.png', title: 'Night Spring', subtitle: 'Dresses', label: '' },
    { id: 4, imgSrc: 'assets/app/images/home/demo3/slideshow-character1.png', title: 'Night Spring', subtitle: 'Dresses', label: 'Dresses' },
    { id: 5, imgSrc: 'assets/app/images/slideshow-character1.png', title: 'Night Spring', subtitle: 'Dresses', label: 'Summer' },
    { id: 6, imgSrc: 'assets/app/images/slideshow-character2.png', title: 'Night Spring', subtitle: 'Dresses', label: '' },
  ];

  ngOnInit() {
    // Make sure Swiper CSS is loaded
    // console.log('SlideShowComponent initialized');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.swiper?.nativeElement) {
        console.error("Swiper element not found!");
        return;
      }
  
      const swiperParams = {
        slidesPerView: 1,
        effect: 'fade',
        fadeEffect: {
          crossFade: true  
        },
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: { 
          clickable: true 
        },
        navigation: true
      };
  
      Object.assign(this.swiper.nativeElement, swiperParams);
      this.swiper.nativeElement.initialize();
    }, 300);
  }
}