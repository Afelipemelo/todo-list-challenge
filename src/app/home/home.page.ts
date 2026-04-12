
import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category as CateogryModel} from '../models/category.model';
import { Category as CategoryService } from '../services/category';
import { AddTaskModalComponent } from '../componets/add-task-modal/add-task-modal.component';
import { Task as TaskService } from '../services/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class HomePage {

 categories: CateogryModel[] = [];
  tasks: any[] = [];
  filteredTasks: any[] = [];
  selectedCategory: string = 'all';

  constructor(
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private taskService : TaskService
  ) {}

  async ngOnInit() {

  }

  async ionViewWillEnter() {
    this.categories = await this.categoryService.getCategories();
    this.tasks = await this.taskService.getTasks();
     this.applyFilter();
  }

  async saveTasks(){
    await this.taskService.saveTasks(this.tasks)
  }

  async deleteTask( id : string){
    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.saveTasks();
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedCategory === 'all') {
      this.filteredTasks = this.tasks;
      console.log(this.filteredTasks)
    } else {
      this.filteredTasks = this.tasks.filter(t => t.categoryId === this.selectedCategory);
    }
  }

  getCategoryName(categoryId: string): string {
  const category = this.categories.find(c => c.id === categoryId);
  return category ? category.name : 'Sin categoría';
  }

  async openAddTask() {
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(this.tasks)
    if (role === 'confirm') {
      this.tasks.push({
        id: Date.now().toString(),
        title: data.title,
        categoryId: data.categoryId,
        completed: false
    })
      await this.saveTasks();
      this.applyFilter();
    }
  }
}
