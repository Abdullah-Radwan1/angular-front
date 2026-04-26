import { Component } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NzTagModule],
  templateUrl: './technologies.html',
})
export class SkillsComponent {
  // You can later convert this to a Signal for reactive filtering
  skills = {
    frontend: ['Next.js', 'Angular', 'React', 'Tailwind CSS'],
    backend: ['Node.js', 'NestJS', 'PostgreSQL', 'Drizzle'],
  };
}
