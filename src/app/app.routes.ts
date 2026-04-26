import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ContactComponent } from './features/contact/contact';
import { SkillsComponent } from './features/skills/skills';
import { ProjectsComponent } from './features/projects/projects';
import { ExperienceComponent } from './features/experience/experience';

export const routes: Routes = [
  { path: '', component: Home }, // "/" → Home
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'experience',
    component: ExperienceComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'skills',
    component: SkillsComponent,
  },
];
