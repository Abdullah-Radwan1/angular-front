import { Component, signal } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { Footer } from './layout/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, Footer, RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('eceommerce');
}
