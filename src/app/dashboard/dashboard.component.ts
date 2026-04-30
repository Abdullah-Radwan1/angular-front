import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { ProjectService, Project } from '../features/projects/projects.service';
import { SkillsService, Skill } from '../features/skills/skills.service';
import { ExperienceService, ExperienceItem } from '../features/experience/experience.service';

// Feature Components
import { ProjectsTableComponent } from './projects/projects-table.component';
import { ProjectsFormModalComponent } from './projects/projects-form-modal.component';
import { SkillsTableComponent } from './skills/skills-table.component';
import { SkillsFormModalComponent } from './skills/skills-form-modal.component';
import { ExperienceTableComponent } from './experience/experience-table.component';
import { ExperienceFormModalComponent } from './experience/experience-form-modal.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
export type CreateExperienceDto = {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets?: string[];
};
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
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  private projectService = inject(ProjectService);
  private skillsService = inject(SkillsService);
  private experienceService = inject(ExperienceService);

  // State
  activeTab = 'projects';
  messageText = '';
  messageType: 'success' | 'error' = 'success';

  // Data Observables
  projects$ = new BehaviorSubject<Project[]>([]);
  skills$ = new BehaviorSubject<Skill[]>([]);
  experiences$ = new BehaviorSubject<ExperienceItem[]>([]);

  // Modal States
  isProjectModalVisible = false;
  isSkillModalVisible = false;
  isExperienceModalVisible = false;

  // Edit States
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
      next: (projects) => this.projects$.next(projects),
      error: () => this.setMessage('Failed to load projects', 'error'),
    });
  }

  private loadSkills() {
    this.skillsService.getSkills().subscribe({
      next: (skills) => this.skills$.next(skills),
      error: () => this.setMessage('Failed to load skills', 'error'),
    });
  }

  private loadExperiences() {
    this.experienceService.getExperiences().subscribe({
      next: (experiences) => this.experiences$.next(experiences),
      error: () => this.setMessage('Failed to load experiences', 'error'),
    });
  }

  // Tab Management
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Projects Handlers
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
      message: `Are you sure you want to delete "${project.title}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed && project._id) {
      this.projectService.deleteProject(project._id).subscribe({
        next: () => {
          this.setMessage('Project deleted successfully');
          this.loadProjects();
        },
        error: () => this.setMessage('Failed to delete project', 'error'),
      });
    }
  }

  onSaveProject(projectData: Partial<Project>) {
    const operation = this.editingProject
      ? //@ts-ignore
        this.projectService.updateProject(this.editingProject._id!, projectData)
      : //@ts-ignore
        this.projectService.createProject(projectData);

    operation.subscribe({
      next: () => {
        this.setMessage(`Project ${this.editingProject ? 'updated' : 'created'} successfully`);
        this.onCloseExperienceModal();
        this.loadProjects();
      },
      error: () => this.setMessage('Failed to save project', 'error'),
    });
  }

  onCloseProjectModal() {
    this.isProjectModalVisible = false;
    this.editingProject = null;
  }

  // Skills Handlers
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
      message: `Are you sure you want to delete "${skill.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed && skill._id) {
      this.skillsService.deleteSkill(skill._id).subscribe({
        next: () => {
          this.setMessage('Skill deleted successfully');
          this.loadSkills();
        },
        error: () => this.setMessage('Failed to delete skill', 'error'),
      });
    }
  }

  onSaveSkill(skillData: Partial<Skill>) {
    const operation = this.editingSkill
      ? this.skillsService.updateSkill(this.editingSkill._id!, skillData)
      : //@ts-ignore
        this.skillsService.createSkill(skillData);

    operation.subscribe({
      next: () => {
        this.setMessage(`Skill ${this.editingSkill ? 'updated' : 'created'} successfully`);
        this.onCloseSkillModal();
        this.loadSkills();
      },
      error: () => this.setMessage('Failed to save skill', 'error'),
    });
  }

  onCloseSkillModal() {
    this.isSkillModalVisible = false;
    this.editingSkill = null;
  }

  // Experience Handlers
  onAddExperience() {
    this.editingExperience = null;
    this.isExperienceModalVisible = true;
  }

  onEditExperience(experience: ExperienceItem) {
    this.editingExperience = experience;
    this.isExperienceModalVisible = true;
  }

  async onDeleteExperience(experience: ExperienceItem) {
    const confirmed = await this.confirmDialog.open({
      title: 'Delete Experience',
      message: `Are you sure you want to delete "${experience.role} at ${experience.company}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmed && experience._id) {
      this.experienceService.deleteExperience(experience._id).subscribe({
        next: () => {
          this.setMessage('Experience deleted successfully');
          this.loadExperiences();
        },
        error: () => this.setMessage('Failed to delete experience', 'error'),
      });
    }
  }

  onSaveExperience(experienceData: Partial<ExperienceItem>) {
    const operation = this.editingExperience
      ? this.experienceService.updateExperience(this.editingExperience._id!, experienceData)
      : //@ts-ignore
        this.experienceService.createExperience(createexpe);

    operation.subscribe({
      next: () => {
        this.setMessage(
          `Experience ${this.editingExperience ? 'updated' : 'created'} successfully`,
        );
        this.onCloseExperienceModal();
        this.loadExperiences();
      },
      error: () => this.setMessage('Failed to save experience', 'error'),
    });
  }

  onCloseExperienceModal() {
    this.isExperienceModalVisible = false;
    this.editingExperience = null;
  }

  private setMessage(message: string, type: 'success' | 'error' = 'success') {
    this.messageText = message;
    this.messageType = type;
    setTimeout(() => {
      if (this.messageText === message) this.messageText = '';
    }, 3000);
  }
}
