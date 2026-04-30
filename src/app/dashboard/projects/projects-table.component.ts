import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../features/projects/projects.service';

@Component({
  selector: 'app-projects-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-table.component.html',
})
export class ProjectsTableComponent {
  @Input() projects: Project[] = [];
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();

  onAdd() {
    this.add.emit();
  }

  onEdit(project: Project) {
    this.edit.emit(project);
  }

  onDelete(project: Project) {
    this.delete.emit(project);
  }
}
