import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Skill, SkillCategoryKey } from '../../features/skills/skills.service';

@Component({
  selector: 'app-skills-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skills-form-modal.component.html',
})
export class SkillsFormModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() skill: Skill | null = null;
  @Output() save = new EventEmitter<Partial<Skill>>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  skillCategories: { label: string; value: SkillCategoryKey }[] = [
    { label: 'Frontend', value: 'frontend' },
    { label: 'UI/UX', value: 'ui' },
    { label: 'Backend', value: 'backend' },
    { label: 'APIs', value: 'apis' },
    { label: 'Databases', value: 'databases' },
    { label: 'DevOps', value: 'devops' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      level: [''],
      iconUrl: [''],
    });
  }

  ngOnChanges() {
    if (this.skill) {
      this.form.patchValue(this.skill);
    } else {
      this.form.reset();
    }
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onClose() {
    this.close.emit();
  }
}
