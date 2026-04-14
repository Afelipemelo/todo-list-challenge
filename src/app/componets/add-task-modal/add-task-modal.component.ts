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

  /**
   * Inicialización del componente: Carga de categorías de forma segura
   */
  async ngOnInit() {
    try {
      this.categories = await this.categoryService.getCategories();
    } catch (error) {
      this.categories = [];
    }
  }

  /**
   * Cierra el modal sin retornar datos
   */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
   * Retorna los datos de la nueva tarea al componente padre
   */
  confirm() {
    const trimmedTitle = this.taskTitle.trim();

    if (!trimmedTitle) {
      console.warn(' sin título.');
      return;
    }

    // Aseguramos que el objeto de retorno sea limpio
    const taskData = {
      title: trimmedTitle,
      categoryId: this.selectedCategoryId || null // Si no hay categoría, enviamos null
    };

    return this.modalCtrl.dismiss(taskData, 'confirm');
  }
}
