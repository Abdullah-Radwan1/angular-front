import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ContactComponent } from './contact/contact';
import { SkillsComponent } from './skills/technologies';

export const routes: Routes = [
  { path: '', component: Home }, // "/" → Home
  {
    path: 'Projects',
    component: Home,
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
