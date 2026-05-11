import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  ngOnInit(): void {
    // Refresh user data on profile page visit
    this.authStore.loadCurrentUser();
  }
}
