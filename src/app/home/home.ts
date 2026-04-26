import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { About } from './components/about/about';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, About],
  templateUrl: './home.html',
})
export class Home {}
