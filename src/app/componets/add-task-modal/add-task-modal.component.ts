import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category';
import { Category as CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class AddTaskModalComponent implements OnInit {
  taskTitle: string = '';
  selectedCategoryId: string = '';
  categories: CategoryModel[] = [];

  constructor(
    private modalCtrl: ModalController,
    private categoryService: CategoryService
  ) {}


  async ngOnInit() {
    try {
      this.categories = await this.categoryService.getCategories();
    } catch (error) {
      this.categories = [];
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const trimmedTitle = this.taskTitle.trim();

    if (!trimmedTitle) {
      console.warn(' sin título.');
      return;
    }

    const taskData = {
      title: trimmedTitle,
      categoryId: this.selectedCategoryId || null
    };

    return this.modalCtrl.dismiss(taskData, 'confirm');
  }
}
