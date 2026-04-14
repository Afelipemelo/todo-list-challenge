import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class TaskService { // Renombrado para consistencia con CategoryService
  private _storage: Storage | null = null;
  private readonly TASKS_KEY = 'tasks';
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {}

  /**
   * Inicializa el motor de almacenamiento de forma asíncrona y segura
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
   * Recupera la lista completa de tareas desde el almacenamiento local
   */
  async getTasks(): Promise<any[]> {
    await this.init();
    const tasks = await this._storage?.get(this.TASKS_KEY);
    return tasks || [];
  }

  /**
   * Persiste la lista de tareas actualizada en el almacenamiento
   * @param tasks Arreglo de tareas a guardar
   */
  async saveTasks(tasks: any[]): Promise<void> {
    try {
      await this.init();
      await this._storage?.set(this.TASKS_KEY, tasks);
    } catch (error) {
      console.error('Errorguardando las tareas en Storage:', error);
    }
  }
}
