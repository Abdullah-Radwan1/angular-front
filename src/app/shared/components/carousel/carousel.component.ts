import { Component, signal, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  standalone: true, // ✅ This is important in Angular 19 standalone components
  imports: [RouterModule], // ✅ Only RouterModule needed
})
export class CarouselComponent implements OnInit, OnDestroy {
  banners = [
    {
      title: 'Modern Elegance',
      subtitle: 'Ergonomic Chair',
      description: 'Experience unparalleled comfort with our premium ergonomic design.',
      img: '/products/black-chair.jpg',
      ctaText: 'Shop Chairs',
      features: ['Ergonomic Design', 'Premium Materials', '24h Comfort'],
      routerLink: ['/products'],
      queryParams: { category: 'CHAIRS' },
    },
    {
      title: 'Artistic Touch',
      subtitle: 'Ceramic Vase Collection',
      description: 'Transform your space with handcrafted ceramic vases, each unique.',
      img: '/products/vase.jpg',
      ctaText: 'Explore Vases',
      features: ['Handcrafted', 'Unique Designs', 'Premium Ceramic'],
      routerLink: ['/products'],
      queryParams: { category: 'ACCESSORIES' },
    },
    {
      title: 'Timeless Precision',
      subtitle: 'Minimalist Clock',
      description: 'Minimalism meets precision. Perfect for any interior.',
      img: '/products/black-clock.jpg',
      ctaText: 'Discover Clocks',
      features: ['Quiet Movement', 'Sleek Design', 'Battery Included'],
      routerLink: ['/products'],
      queryParams: { category: 'CLOCKS' },
    },
  ];

  activeBanner = signal(0);
  private intervalId!: number;

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.nextBanner();
    }, 2500);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  selectBanner(index: number) {
    this.activeBanner.set(index);
  }

  nextBanner() {
    const next = (this.activeBanner() + 1) % this.banners.length;
    this.activeBanner.set(next);
  }
}
