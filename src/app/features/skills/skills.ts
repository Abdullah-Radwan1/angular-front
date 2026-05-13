import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  signal,
  computed,
  inject,
} from '@angular/core';
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

import { SkillsService, Skill, SkillCategoryKey } from './skills.service';
import { LoaderComponent } from '../../components/loader/loader';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, NgIconComponent, LoaderComponent],
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
})
export class SkillsComponent implements AfterViewInit, OnInit {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;

  private dataService = inject(SkillsService);

  inView = signal(false);
  skills = signal<Skill[] | null>(null);
  loading = signal(false);
  categories = [
    { key: 'frontend', title: 'Frontend', icon: 'heroComputerDesktop' },
    { key: 'ui', title: 'UI & Styling', icon: 'heroPaintBrush' },
    { key: 'backend', title: 'Backend', icon: 'heroServer' },
    { key: 'apis', title: 'APIs', icon: 'heroGlobeAlt' },
    { key: 'databases', title: 'Databases', icon: 'heroCircleStack' },
    { key: 'devops', title: 'DevOps & Tools', icon: 'heroCog6Tooth' },
  ] as const;

  // 🔥 group skills by category
  groupedSkills = computed(() => {
    const data = this.skills() ?? [];

    return this.categories.reduce(
      (acc, cat) => {
        acc[cat.key] = data
          .filter((s) => s.category === cat.key)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return acc;
      },
      {} as Record<SkillCategoryKey, Skill[]>,
    );
  });

  ngOnInit() {
    if (!this.skills()) {
      this.loading.set(true);
    }
    this.dataService.getSkills().subscribe({
      next: (data) => {
        this.skills.set(data);

        this.loading.set(false);
      },
      error: (err) => console.error(err),
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
      { threshold: 0.2 },
    );

    observer.observe(this.sectionRef.nativeElement);
  }
}
