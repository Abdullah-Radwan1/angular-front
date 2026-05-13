import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { ProjectService, Project } from '../features/projects/projects.service';
import { SkillsService, Skill } from '../features/skills/skills.service';
import { ExperienceService, ExperienceItem } from '../features/experience/experience.service';

// Components
import { ProjectsTableComponent } from './projects/projects-table.component';
import { ProjectsFormModalComponent } from './projects/projects-form-modal.component';
import { SkillsTableComponent } from './skills/skills-table.component';
import { SkillsFormModalComponent } from './skills/skills-form-modal.component';
import { ExperienceTableComponent } from './experience/experience-table.component';
import { ExperienceFormModalComponent } from './experience/experience-form-modal.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TitlesSettingsComponent } from './titles/titles-settings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ProjectsTableComponent,
    ProjectsFormModalComponent,
    SkillsTableComponent,
    SkillsFormModalComponent,
    ExperienceTableComponent,
    ExperienceFormModalComponent,
    ConfirmDialogComponent,
    TitlesSettingsComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  private projectService = inject(ProjectService);
  private skillsService = inject(SkillsService);
  private experienceService = inject(ExperienceService);

  // UI State
  activeTab: 'projects' | 'skills' | 'experience' | 'title' = 'projects';
  messageText = '';
  messageType: 'success' | 'error' = 'success';

  // Data
  projects$ = new BehaviorSubject<Project[]>([]);
  skills$ = new BehaviorSubject<Skill[]>([]);
  experiences$ = new BehaviorSubject<ExperienceItem[]>([]);

  // Modal States
  isProjectModalVisible = false;
  isSkillModalVisible = false;
  isExperienceModalVisible = false;

  // Editing
  editingProject: Project | null = null;
  editingSkill: Skill | null = null;
  editingExperience: ExperienceItem | null = null;

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadProjects();
    this.loadSkills();
    this.loadExperiences();
  }

  private loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => this.projects$.next(data),
      error: () => this.setMessage('Failed to load projects', 'error'),
    });
  }

  private loadSkills() {
    this.skillsService.getSkills().subscribe({
      next: (data) => this.skills$.next(data),
      error: () => this.setMessage('Failed to load skills', 'error'),
    });
  }

  private loadExperiences() {
    this.experienceService.getExperiences().subscribe({
      next: (data) => this.experiences$.next(data),
      error: () => this.setMessage('Failed to load experiences', 'error'),
    });
  }

  setActiveTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
  }

  // ================= PROJECTS =================

  onAddProject() {
    this.editingProject = null;
    this.isProjectModalVisible = true;
  }

  onEditProject(project: Project) {
    this.editingProject = project;
    this.isProjectModalVisible = true;
  }

  async onDeleteProject(project: Project) {
    const confirmed = await this.confirmDialog.open({
      title: 'Delete Project',
      message: `Delete "${project.title}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed && project._id) {
      this.projectService.deleteProject(project._id).subscribe({
        next: () => {
          this.setMessage('Project deleted');
          this.loadProjects();
        },
        error: () => this.setMessage('Delete failed', 'error'),
      });
    }
  }

  onSaveProject(data: Partial<Project>) {
    const operation = this.editingProject
      ? //@ts-ignore
        this.projectService.updateProject(this.editingProject._id!, data)
      : this.projectService.createProject(data as Project);

    operation.subscribe({
      next: () => {
        this.setMessage('Project saved');
        this.onCloseProjectModal();
        this.loadProjects();
      },
      error: () => this.setMessage('Save failed', 'error'),
    });
  }

  onCloseProjectModal() {
    this.isProjectModalVisible = false;
    this.editingProject = null;
  }

  // ================= SKILLS =================

  onAddSkill() {
    this.editingSkill = null;
    this.isSkillModalVisible = true;
  }

  onEditSkill(skill: Skill) {
    this.editingSkill = skill;
    this.isSkillModalVisible = true;
  }

  async onDeleteSkill(skill: Skill) {
    const confirmed = await this.confirmDialog.open({
      title: 'Delete Skill',
      message: `Delete "${skill.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed && skill._id) {
      this.skillsService.deleteSkill(skill._id).subscribe({
        next: () => {
          this.setMessage('Skill deleted');
          this.loadSkills();
        },
        error: () => this.setMessage('Delete failed', 'error'),
      });
    }
  }

  onSaveSkill(data: Partial<Skill>) {
    const operation = this.editingSkill
      ? this.skillsService.updateSkill(this.editingSkill._id!, data)
      : this.skillsService.createSkill(data as Skill);

    operation.subscribe({
      next: () => {
        this.setMessage('Skill saved');
        this.onCloseSkillModal();
        this.loadSkills();
      },
      error: () => this.setMessage('Save failed', 'error'),
    });
  }

  onCloseSkillModal() {
    this.isSkillModalVisible = false;
    this.editingSkill = null;
  }

  // ================= EXPERIENCE =================

  onAddExperience() {
    this.editingExperience = null;
    this.isExperienceModalVisible = true;
  }

  onEditExperience(exp: ExperienceItem) {
    this.editingExperience = exp;
    this.isExperienceModalVisible = true;
  }

  async onDeleteExperience(exp: ExperienceItem) {
    const confirmed = await this.confirmDialog.open({
      title: 'Delete Experience',
      message: `Delete "${exp.role} at ${exp.company}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed && exp._id) {
      this.experienceService.deleteExperience(exp._id).subscribe({
        next: () => {
          this.setMessage('Experience deleted');
          this.loadExperiences();
        },
        error: () => this.setMessage('Delete failed', 'error'),
      });
    }
  }

  onSaveExperience(data: Partial<ExperienceItem>) {
    const operation = this.editingExperience
      ? this.experienceService.updateExperience(this.editingExperience._id!, data)
      : this.experienceService.createExperience(data as ExperienceItem);

    operation.subscribe({
      next: () => {
        this.setMessage('Experience saved');
        this.onCloseExperienceModal();
        this.loadExperiences();
      },
      error: () => this.setMessage('Save failed', 'error'),
    });
  }

  onCloseExperienceModal() {
    this.isExperienceModalVisible = false;
    this.editingExperience = null;
  }

  // ================= UTIL =================

  private setMessage(msg: string, type: 'success' | 'error' = 'success') {
    this.messageText = msg;
    this.messageType = type;

    setTimeout(() => {
      if (this.messageText === msg) this.messageText = '';
    }, 3000);
  }
}
