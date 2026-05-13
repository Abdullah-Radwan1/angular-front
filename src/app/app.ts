<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  HeaderComponent,
  FooterComponent,
  NotificationComponent,
  LoadingComponent,
} from './shared/components';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    LoadingComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
=======
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
>>>>>>> ad21ca7f608955e0942e7442e6a004e1e81683c6
