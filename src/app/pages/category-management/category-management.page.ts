import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { IonicModule, ToastController } from '@ionic/angular';
import { CategoryService } from '../../services/category';
import { Category as CategoryModel } from '../../models/category.model';
import { TaskService } from 'src/app/services/task';
import { trash, bookmark, add, folderOpenOutline } from 'ionicons/icons';

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
  canDelete: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private tasksService: TaskService,
    private toastCtrl: ToastController
  ) {
    // Añadimos folderOpenOutline que se usa en el @empty del HTML
    addIcons({ trash, bookmark, add, folderOpenOutline });
  }

  /**
   * Inicialización de la página: Carga de datos con manejo de errores
   */
  async ngOnInit() {
    try {
      // Cargamos ambos en paralelo para ganar velocidad
      const [cats, deleteFlag] = await Promise.all([
        this.categoryService.getCategories(),
        this.categoryService.getCanDeleteFlag()
      ]);

      this.categories = cats;
      this.canDelete = deleteFlag;
    } catch (error) {
    }
  }

  /**
   * Refresca la lista de categorías desde el storage
   */
  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  /**
   * Crea y persiste una nueva categoría
   */
  async addCategory() {
    const trimmedName = this.newCategoryName.trim();
    if (!trimmedName) return;

    const newCat: CategoryModel = {
      id: Date.now().toString(),
      name: trimmedName,
      color: 'primary'
    };

    await this.categoryService.saveCategory(newCat);
    this.newCategoryName = '';
    await this.loadCategories();
  }

  /**
   * Proceso de eliminación con validaciones de negocio
   */
  async removeCategory(id: string) {
    // 1. Validar tareas asociadas
    const allTasks = await this.tasksService.getTasks();
    const hasTasks = allTasks.some(t => t.categoryId === id);

    if (hasTasks) {
      this.showToast('No puedes eliminar una categoría con tareas asignadas', 'warning');
      return;
    }

    // 2. Validar permiso de Remote Config
    if (!this.canDelete) {
      this.showToast('La eliminación de categorías está deshabilitada remotamente.', 'lock-closed');
      return;
    }

    // 3. Proceder con la eliminación
    await this.categoryService.deleteCategory(id);
    await this.loadCategories();
    this.showToast('Categoría eliminada con éxito', 'success');
  }

  /**
   * Helper centralizado para mostrar notificaciones
   */
  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
