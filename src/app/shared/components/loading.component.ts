import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styles: [],
})
export class LoadingComponent {
  isLoading = new ApiService({} as any).isLoading(); // This won't work, need to inject

  constructor(private apiService: ApiService) {
    this.isLoading = this.apiService.isLoading();
  }
}
