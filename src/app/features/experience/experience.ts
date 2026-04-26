import { Component, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBriefcase,
  heroMapPin,
  heroCalendarDays,
  heroCheckCircle,
} from '@ng-icons/heroicons/outline';

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
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroBriefcase, heroMapPin, heroCalendarDays, heroCheckCircle })],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class ExperienceComponent implements AfterViewInit {
  @ViewChild('sectionRef') sectionRef!: ElementRef;
  inView = signal(false);

  sectionTitle = 'Experience';
  sectionHeading = 'My Journey';

  experiences: ExperienceItem[] = [
    {
      role: 'Full-Stack Web Developer',
      company: 'National Telecommunication Institute',
      location: 'Egypt',
      period: 'March 2026 – Present',
      current: true,
      bullets: [
        'Built and deployed full-stack web applications using the MEAN stack, developing scalable Node.js APIs and dynamic Angular interfaces.',
        'Designed MongoDB schemas, implemented secure RESTful APIs with authentication and validation, improving data handling efficiency and application performance.',
      ],
    },
  ];

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
