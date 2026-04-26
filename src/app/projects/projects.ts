import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';

interface Project {
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NzCardModule, NzTagModule],
  templateUrl: './projects.html',
})
export class ProjectsComponent {
  projects: Project[] = [
    { title: 'APEX', description: 'Project management system.', tags: ['Next.js', 'NestJS'] },
    {
      title: 'Angular E-Commerce',
      description: 'Angular 19/NestJS system.',
      tags: ['Angular', 'GraphQL'],
    },
  ];
}
