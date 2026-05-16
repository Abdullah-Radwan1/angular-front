import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent],
  templateUrl: './home.html',
})
export class Home {}
