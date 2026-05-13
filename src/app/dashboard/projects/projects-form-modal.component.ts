import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../features/projects/projects.service';

@Component({
  selector: 'app-projects-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projects-form-modal.component.html',
})
export class ProjectsFormModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() project: Project | null = null;
  @Output() save = new EventEmitter<Partial<Project>>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      technologies: [''],
      liveUrl: [''],
      repoUrl: [''],
      image: [''],
    });
  }

  ngOnChanges() {
    if (this.project) {
      this.form.patchValue({
        ...this.project,
        technologies: (this.project.technologies || []).join(', '),
      });
    } else {
      this.form.reset();
    }
  }

  onSave() {
    if (this.form.valid) {
      const raw = this.form.value;
      const projectData = {
        ...raw,
        technologies: this.toArray(raw.technologies),
      };
      this.save.emit(projectData);
    }
  }

  onClose() {
    this.close.emit();
  }

  private toArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    return String(value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
