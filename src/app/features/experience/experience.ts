import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBriefcase,
  heroMapPin,
  heroCalendarDays,
  heroCheckCircle,
} from '@ng-icons/heroicons/outline';

import { ExperienceService } from './experience.service';
import { LoaderComponent } from '../../components/loader/loader';

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, NgIconComponent, LoaderComponent],
  providers: [
    provideIcons({
      heroBriefcase,
      heroMapPin,
      heroCalendarDays,
      heroCheckCircle,
    }),
  ],
  templateUrl: './experience.html',
})
export class ExperienceComponent implements AfterViewInit, OnInit {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;

  private experiencesService = inject(ExperienceService);

  /* ================= STATE ================= */

  experiences = signal<ExperienceItem[] | null>(null);
  loading = signal(true);
  error = signal(false);

  inView = signal(false);

  sectionTitle = 'Experience';
  sectionHeading = 'My Journey';

  /* ================= LIFECYCLE ================= */

  ngOnInit() {
    // 🔥 only show loader if no cached data
    if (!this.experiences()) {
      this.loading.set(true);
    }

    this.experiencesService.getExperiences().subscribe({
      next: (data) => {
        this.experiences.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.inView.set(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(this.sectionRef.nativeElement);
  }

  getDelay(i: number): string {
    return `${i * 150}ms`;
  }
}
