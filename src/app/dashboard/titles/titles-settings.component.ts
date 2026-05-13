import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleService } from './title.service';
import { Title } from './title.service';

@Component({
  selector: 'app-titles-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './titles-settings.component.html',
})
export class TitlesSettingsComponent implements OnInit {
  private titleService = inject(TitleService);

  title: Title = {
    main: '',
    subtitle: '',
  };

  loading = false;
  saving = false;

  ngOnInit() {
    this.fetchTitle();
  }

  fetchTitle() {
    this.loading = true;

    this.titleService.getTitle().subscribe({
      next: (data) => {
        this.title = data || { main: '', subtitle: '' };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  save() {
    this.saving = true;

    this.titleService.upsertTitle(this.title).subscribe({
      next: (res) => {
        this.title = res;
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      },
    });
  }
}
