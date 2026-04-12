import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { IonicModule, ToastController } from '@ionic/angular';
import { Category as CategoryService} from '../../services/category';
import { Category as CategoryModel} from '../../models/category.model';
import { Task } from 'src/app/services/task';
import { trash, bookmark, add } from 'ionicons/icons'

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.page.html',
  styleUrls: ['./category-management.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CategoryManagementPage implements OnInit {
  categories: CategoryModel[] = [];
  newCategoryName: string = '';
  canDelete : boolean = false;

  constructor(
    private categoryService: CategoryService,
    private tasks: Task,
    private toastCtrl: ToastController
  ) {
    addIcons({trash,bookmark,add});
  }

  async ngOnInit() {
    await this.loadCategories();
    this.canDelete = await this.categoryService.getCanDeleteFlag();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async addCategory() {
    if (!this.newCategoryName.trim()) return

    const newCat: CategoryModel = {
      id: Date.now().toString(),
      name: this.newCategoryName,
      color: 'primary'
    };

    await this.categoryService.saveCategory(newCat);
    this.newCategoryName = '';
    await this.loadCategories();
  }

  async removeCategory(id: string) {
    let task = await this.tasks.getTasks();
    task = task.filter(t => t.categoryId == id);
    if(task.length != 0){
       const toast = await this.toastCtrl.create({
        message: 'La cateogria tiene tareas asignadas',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return
    }
    console.log(task)
    console.log(id)
    if(!this.canDelete){
      const toast = await this.toastCtrl.create({
        message: 'La eliminacion de la categoria esta deshabilitada.',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return
    }
    await this.categoryService.deleteCategory(id);
    await this.loadCategories();
  }
}
