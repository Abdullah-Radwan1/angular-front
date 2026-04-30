import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceItem } from '../../features/experience/experience.service';

@Component({
  selector: 'app-experience-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-table.component.html',
})
export class ExperienceTableComponent {
  @Input() experiences: ExperienceItem[] = [];
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<ExperienceItem>();
  @Output() delete = new EventEmitter<ExperienceItem>();

  onAdd() {
    this.add.emit();
  }

  onEdit(experience: ExperienceItem) {
    this.edit.emit(experience);
  }

  onDelete(experience: ExperienceItem) {
    this.delete.emit(experience);
  }
}
