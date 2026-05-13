import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product.card.component';
import { LucideFlame, LucideSparkles } from '@lucide/angular';
import { SkeletonCardComponent } from '../../skeleton-card-component/skeleton-card-component';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { TestimonialsComponent } from '../../shared/components/testimonials/testimonials.component';
import { productStore } from '../../store/product.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCardComponent,
    SkeletonCardComponent,
    LucideSparkles,
    LucideFlame,
    CarouselComponent,
    TestimonialsComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  productStore = inject(productStore);

  ngOnInit(): void {
    this.productStore.loadFeaturedProducts();
    this.productStore.loadFastSellingProducts();
  }

  // 👇 expose signals for template
  featured = this.productStore.featuredProducts;
  fastSelling = this.productStore.fastSellingProducts;

  featuredLoading = this.productStore.loading;
  fastSellingLoading = this.productStore.loading;
}
