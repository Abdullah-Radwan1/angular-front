import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExperienceItem } from '../../features/experience/experience.service';

@Component({
  selector: 'app-experience-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experience-form-modal.component.html',
})
export class ExperienceFormModalComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() experience: ExperienceItem | null = null;
  @Output() save = new EventEmitter<Partial<ExperienceItem>>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      role: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      period: ['', Validators.required],
      current: [false],
      bullets: [''],
    });
  }

  ngOnChanges() {
    if (this.experience) {
      this.form.patchValue({
        ...this.experience,
        bullets: (this.experience.bullets || []).join(', '),
      });
    } else {
      this.form.reset({ current: false });
    }
  }

  onSave() {
    if (this.form.valid) {
      const raw = this.form.value;
      const experienceData = {
        ...raw,
        bullets: this.toArray(raw.bullets),
      };
      this.save.emit(experienceData);
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
