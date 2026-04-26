import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, NavbarComponent],
  templateUrl: './home.html',
})
export class Home {}
