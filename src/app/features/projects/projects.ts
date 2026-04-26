import { Component, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowTopRightOnSquare } from '@ng-icons/heroicons/outline';
import { heroCodeBracket } from '@ng-icons/heroicons/outline';

export interface Project {
  title: string;
  description: string;
  image: string;
  github: string;
  live: string;
  tech: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroArrowTopRightOnSquare, heroCodeBracket })],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('sectionRef') sectionRef!: ElementRef;
  inView = signal(false);

  sectionTitle = 'Projects';
  sectionHeading = 'Featured Work';

  projects: Project[] = [
    {
      title: 'APEX – Project Management System',
      description:
        'Comprehensive project management platform featuring role-based access, team invitations, and workflow tracking capabilities.',
      tech: ['React', 'NestJS', 'Drizzle ORM', 'PostgreSQL', 'Neon'],
      github: '',
      live: 'https://managment-system-livid.vercel.app/',
      image: '/projects/apex.png',
    },
    {
      title: 'Fullstack E-commerce',
      description:
        'Complete online store solution with Stripe payment processing, secure authentication, and optimized database architecture.',
      tech: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'NextAuth'],
      github: 'https://github.com/Abdullah-Radwan1/fullstack-ecommerce',
      live: 'https://fullstack-ecommerce-flax.vercel.app/en',
      image: '/projects/ecommerce.png',
    },
    {
      title: 'FunnyGram (Mobile App)',
      description:
        'Social media mobile application enabling real-time interactions, content sharing, likes, comments, and user following.',
      tech: ['React Native', 'Expo', 'Clerk', 'Convex'],
      github: 'https://github.com/Abdullah-Radwan1/react-native-ecommerce',
      live: 'https://appetize.io/app/android/com.abdullah232.myapp',
      image: '/projects/funnygram.jpg',
    },
    {
      title: 'Learn Hub',
      description:
        'Educational platform offering interactive lessons, progress tracking, discussion comments, and Q&A functionality.',
      tech: ['Next.js', 'React', 'Tailwind CSS'],
      github: 'https://github.com/Abdullah-Radwan1/Courses-App',
      live: 'https://courses-app-livid.vercel.app/',
      image: '/projects/learn-hub.png',
    },
    {
      title: 'Angular Ecommerce',
      description:
        'Modern e-commerce application built with Angular 19 and NestJS REST API, using Neon PostgreSQL and SSR with RxJS-based reactive state',
      tech: ['Angular', 'Supabase', 'Prisma', 'Nest.js', 'Tailwind CSS'],
      github: 'https://github.com/Abdullah-Radwan1/angular-vogue',
      live: 'https://angular-vogue.vercel.app',
      image: '/projects/angular_ecommerce.png',
    },
    {
      title: 'Admin Dashboard',
      description:
        'Powerful administration interface for managing products, users, and transactions in e-commerce operations.',
      tech: ['React', 'Firebase', 'Dashboard UI'],
      github: 'https://github.com/Abdullah-Radwan1/Admin-Dashboard',
      live: 'https://admin-dashboard-84ee4.web.app/',
      image: '/projects/dashboard.png',
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
