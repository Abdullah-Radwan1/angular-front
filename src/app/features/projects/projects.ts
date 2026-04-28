import { Component, ElementRef, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowTopRightOnSquare } from '@ng-icons/heroicons/outline';
import { heroCodeBracket } from '@ng-icons/heroicons/outline';
import { DataService } from '../../services/data';

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
  projects = signal<any[]>([]);
  private dataService = inject(DataService);

  ngOnInit() {
    this.dataService.getProjects().subscribe((data) => {
      this.projects.set(data);
    });
  }
  inView = signal(false);

  sectionTitle = 'Projects';
  sectionHeading = 'Featured Work';

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
