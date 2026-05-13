import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideQuote, LucideStar } from '@lucide/angular';
import { TestimonialService } from '../../services/testimonial.service';
import { Testimonial } from '../../models';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, LucideQuote, LucideStar],
  template: `
    <section class="py-12 space-y-8">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <svg lucideQuote class="text-primary" [size]="24"></svg>
          <h2 class="text-3xl font-bold">What Our Customers Say</h2>
        </div>
        <p class="text-sm text-base-content/60">
          Real stories from people who transformed their homes with us
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (isLoading()) {
          @for (_ of [1, 2, 3]; track $index) {
            <div class="card bg-base-200 animate-pulse h-48 rounded-3xl"></div>
          }
        } @else {
          @for (testimonial of testimonials(); track testimonial._id) {
            <div class="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl p-6 group">
              <div class="flex flex-col h-full justify-between gap-4">
                <div class="space-y-3">
                  <!-- Rating -->
                  <div class="flex gap-1">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <svg 
                        lucideStar 
                        [size]="14" 
                        [class]="star <= testimonial.rating ? 'fill-warning text-warning' : 'text-base-content/20'"
                      ></svg>
                    }
                  </div>
                  
                  <!-- Content -->
                  <p class="text-base-content/80 italic leading-relaxed">
                    "{{ testimonial.content }}"
                  </p>
                </div>

                <!-- User info -->
                <div class="flex items-center gap-3 pt-4 border-t border-base-200">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {{ testimonial.user.name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-bold text-sm">{{ testimonial.user.name }}</h4>
                    <p class="text-[10px] uppercase tracking-widest opacity-50">Verified Customer</p>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
             <div class="col-span-full py-12 text-center bg-base-200 rounded-3xl">
                <p class="text-base-content/40 italic">No testimonials yet. Be the first to share your experience!</p>
             </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TestimonialsComponent implements OnInit {
  private testimonialService = inject(TestimonialService);
  
  testimonials = signal<Testimonial[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.fetchTestimonials();
  }

  fetchTestimonials() {
    this.testimonialService.getApprovedTestimonials(1, 3).subscribe({
      next: (response) => {
        this.testimonials.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
