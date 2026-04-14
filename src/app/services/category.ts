import { Injectable, Optional } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Category as CategoryModel } from '../models/category.model';
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _storage: Storage | null = null;
  private readonly CATEGORIES_KEY = 'categories';
  private initPromise: Promise<void> | null = null;

  constructor(
    private storage: Storage,
    @Optional() private remoteConfig: RemoteConfig
  ) {}

  /**
   * Inicializa el almacenamiento de forma segura (Singleton)
   */

  private async init(): Promise<void> {
    if (this._storage) return;

    if (!this.initPromise) {
      this.initPromise = this.storage.create().then((storage) => {
        this._storage = storage;
      });
    }
    return this.initPromise;
  }

  /**
   * Obtiene la lista de categorías persistidas
   */
  async getCategories(): Promise<CategoryModel[]> {
    await this.init();
    const categories = await this._storage?.get(this.CATEGORIES_KEY);
    return categories || [];
  }

  /**
   * Guarda una nueva categoría
   */
  async saveCategory(category: CategoryModel): Promise<void> {
    const categories = await this.getCategories();
    categories.push(category);
    await this.init();
    await this._storage?.set(this.CATEGORIES_KEY, categories);
  }

  /**
   * Elimina una categoría por ID
   */
  async deleteCategory(id: string): Promise<void> {
    let categories = await this.getCategories();
    categories = categories.filter(c => c.id !== id);
    await this.init();
    await this._storage?.set(this.CATEGORIES_KEY, categories);
  }

  /**
   * Consulta el flag de Remote Config para permitir eliminación
   */
  async getCanDeleteFlag(): Promise<boolean> {
    if (!this.remoteConfig) {
      console.warn('Remote Config no inyectado, usando valor por defecto.');
      return false;
    }

    try {
      // Intentamos activar con un timeout implícito por la red
      await fetchAndActivate(this.remoteConfig);
      return getValue(this.remoteConfig, 'show_delete_category').asBoolean();
    } catch (error) {
      console.error('Error al obtener Remote Config:', error);
      return false; // Respaldo en caso de error de red en Android
    }
  }
}
