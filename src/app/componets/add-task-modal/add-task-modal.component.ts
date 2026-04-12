import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category as CategoryService } from '../../services/category';
import { Category as CategoryModel} from '../../models/category.model';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
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
    this.categories = await this.categoryService.getCategories();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.taskTitle.trim()) return;

    return this.modalCtrl.dismiss({
      title: this.taskTitle,
      categoryId: this.selectedCategoryId
    }, 'confirm');
  }
}
