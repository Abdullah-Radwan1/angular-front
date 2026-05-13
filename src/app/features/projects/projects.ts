import { Component, ElementRef, ViewChild, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowTopRightOnSquare } from '@ng-icons/heroicons/outline';
import { heroCodeBracket } from '@ng-icons/heroicons/outline';
import { Project, ProjectService } from './projects.service';
import { LoaderComponent } from '../../components/loader/loader';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgIconComponent, LoaderComponent],
  providers: [provideIcons({ heroArrowTopRightOnSquare, heroCodeBracket })],
  templateUrl: './projects.html',
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('sectionRef') sectionRef!: ElementRef;
  projects = signal<Project[]>([]);
  private projectService = inject(ProjectService);
  loading = signal(true);

  ngOnInit() {
    // 🔥 only show loader if no cached data
    if (!this.projects()) {
      this.loading.set(true);
    }

    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
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
