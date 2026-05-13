import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestimonialService } from '../../shared/services/testimonial.service';
import { LucideFileText, LucideSend, LucideStar } from '@lucide/angular';
import { firstValueFrom } from 'rxjs';

import { TestimonialsComponent } from '../../shared/components/testimonials/testimonials.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideFileText,
    LucideSend,
    LucideStar,
    TestimonialsComponent,
    RouterLink,
  ],
  templateUrl: './testimonial.html',
})
export class TestimonialComponent {
  private fb = inject(FormBuilder);
  private testimonialService = inject(TestimonialService);

  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  hoveredRating = signal(0);
  selectedRating = signal(5);

  testimonialForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  setRating(rating: number): void {
    this.selectedRating.set(rating);

    this.testimonialForm.patchValue({
      rating,
    });
  }

  async onSubmit(): Promise<void> {
    if (this.testimonialForm.invalid) {
      this.testimonialForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const payload = {
        content: this.testimonialForm.value.content,
        rating: this.testimonialForm.value.rating,
      };

      // Using the service instead of hardcoded HttpClient call
      await firstValueFrom(this.testimonialService.createTestimonial(payload));

      this.successMessage.set(
        'Thank you! Your testimonial was submitted successfully and is pending approval.',
      );

      this.testimonialForm.reset({
        content: '',
        rating: 5,
      });

      this.selectedRating.set(5);
    } catch (error) {
      console.error(error);

      this.errorMessage.set('Something went wrong. Please make sure you are logged in.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  get contentControl() {
    return this.testimonialForm.get('content');
  }
}
