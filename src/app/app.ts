import { Component, signal } from '@angular/core';
import { NavbarComponent } from './layout/navbar/navbar.component';

import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './shared/components/notification.component';
import { LoadingComponent } from './shared/components/loading.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    RouterOutlet,
    NavbarComponent,
    NotificationComponent,
    LoadingComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('eceommerce');
}
