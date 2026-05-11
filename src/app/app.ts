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
