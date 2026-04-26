import { Component, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroComputerDesktop,
  heroPaintBrush,
  heroServer,
  heroGlobeAlt,
  heroCircleStack,
  heroCog6Tooth,
} from '@ng-icons/heroicons/outline';

type SkillCategoryKey = 'frontend' | 'ui' | 'backend' | 'apis' | 'databases' | 'devops';

type SkillCategory = {
  key: SkillCategoryKey;
  icon: string;
};

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroComputerDesktop,
      heroPaintBrush,
      heroServer,
      heroGlobeAlt,
      heroCircleStack,
      heroCog6Tooth,
    }),
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class SkillsComponent implements AfterViewInit {
  @ViewChild('sectionRef') sectionRef!: ElementRef;
  inView = signal(false);

  categories: SkillCategory[] = [
    { key: 'frontend', icon: 'heroComputerDesktop' },
    { key: 'ui', icon: 'heroPaintBrush' },
    { key: 'backend', icon: 'heroServer' },
    { key: 'apis', icon: 'heroGlobeAlt' },
    { key: 'databases', icon: 'heroCircleStack' },
    { key: 'devops', icon: 'heroCog6Tooth' },
  ];

  skillsData = {
    title: 'Skills',
    heading: 'My Tech Stack',
    categories: {
      frontend: {
        title: 'Frontend',
        skills: ['Next.js', 'Angular', 'React Native', 'TypeScript', 'Redux', 'Zustand'],
      },
      ui: {
        title: 'UI & Styling',
        skills: ['Tailwind CSS', 'ShadCN UI', 'MUI', 'Sass'],
      },
      backend: {
        title: 'Backend',
        skills: ['Node.js', 'NestJS', 'Express.js', 'Laravel'],
      },
      apis: {
        title: 'APIs',
        skills: ['REST', 'GraphQL'],
      },
      databases: {
        title: 'Databases',
        skills: ['Drizzle', 'Prisma', 'MongoDB', 'PostgreSQL', 'Convex'],
      },
      devops: {
        title: 'DevOps & Tools',
        skills: ['Docker', 'Linux', 'CI/CD', 'Git', 'GitHub Actions'],
      },
    },
  };

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.inView.set(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(this.sectionRef.nativeElement);
  }

  getCategoryData(key: SkillCategoryKey) {
    return this.skillsData.categories[key];
  }
}
