import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Category as CategoryModel } from '../models/category.model';
import { CategoryService } from '../services/category';
import { TaskService } from '../services/task';
import { AddTaskModalComponent } from '../componets/add-task-modal/add-task-modal.component';

import { fetchAndActivate, RemoteConfig, getValue } from '@angular/fire/remote-config';
import { trash, flask, settings, add, sparklesOutline, chevronDownOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ScrollingModule, AddTaskModalComponent, IonicModule],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomePage {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  categories: CategoryModel[] = [];
  tasks: any[] = [];
  filteredTasks: any[] = [];
  selectedCategory: string = 'all';
  showMassiveBtn: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private taskService: TaskService,
    private remoteConfig : RemoteConfig
  ) {
    addIcons({ trash, flask, settings, add, sparklesOutline, chevronDownOutline });
  }


  async ionViewWillEnter() {
    await this.loadLocalData();
    this.initRemoteConfig();
  }

  async loadLocalData() {
    try {
      const [cats, tks] = await Promise.all([
        this.categoryService.getCategories(),
        this.taskService.getTasks()
      ]);
      this.categories = cats;
      this.tasks = tks;
      this.applyFilter();
    } catch (e) {
    }
  }


  private async initRemoteConfig() {
    try {
      await fetchAndActivate(this.remoteConfig);
      this.showMassiveBtn = getValue(this.remoteConfig, 'show_massive_load_option').asBoolean();
      this.applyFilter();
    } catch (error) {
    }
  }

  async saveTasks() {
    await this.taskService.saveTasks(this.tasks);
  }


  async deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.saveTasks();
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedCategory === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(t => t.categoryId === this.selectedCategory);
    }

    setTimeout(() => {
      if (this.viewport) {
        this.viewport.checkViewportSize();
      }
    }, 150);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  async openAddTask() {
    setTimeout(async () => {
      try {
        const modal = await this.modalCtrl.create({
          component: AddTaskModalComponent,
          initialBreakpoint: 0.5,
          breakpoints: [0, 0.5, 0.8],
          handle: true,
          cssClass: 'glass-modal'
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();
        if (role === 'confirm' && data) {
          const newTask = {
            id: Date.now().toString(),
            title: data.title,
            categoryId: data.categoryId,
            completed: false
          };

          this.tasks = [newTask, ...this.tasks];
          await this.saveTasks();
          this.applyFilter();
        }
      } catch (error) {
        console.error('Error abriendo modal', error);
      }
    }, 50);
  }

  generateMassiveTasks() {
    const massive = Array.from({ length: 500 }, (_, i) => ({
      id: `stress-${Date.now()}-${i}`,
      title: `Tarea Masiva #${i + 1}`,
      completed: false,
      categoryId: ''
    }));

    this.tasks = [...this.tasks, ...massive];
    this.saveTasks();
    this.applyFilter();
  }

  trackById(index: number, item: any) {
    return item.id;
  }
  getSelectedCategoryName(): string {
  if (this.selectedCategory === 'all') return 'Todas';

  const category = this.categories.find(c => c.id === this.selectedCategory);
  return category ? category.name : 'Todas';
}
}
