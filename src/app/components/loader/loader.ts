import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loader-container">
      <div class="spinner"></div>
      <span class="loader-text">Loading...</span>
    </div>
  `,
})
export class LoaderComponent {}
