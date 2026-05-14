import { Component, signal } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { Footer } from './layout/footer/footer';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, NotificationComponent, LoadingComponent } from './shared/components';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    Footer,
    RouterOutlet,
    HeaderComponent,
    NotificationComponent,
    LoadingComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('eceommerce');
}
