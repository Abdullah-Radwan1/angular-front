import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../features/skills/skills.service';

@Component({
  selector: 'app-skills-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-table.component.html',
})
export class SkillsTableComponent {
  @Input() skills: Skill[] = [];
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Skill>();
  @Output() delete = new EventEmitter<Skill>();

  onAdd() {
    this.add.emit();
  }

  onEdit(skill: Skill) {
    this.edit.emit(skill);
  }

  onDelete(skill: Skill) {
    this.delete.emit(skill);
  }
}
