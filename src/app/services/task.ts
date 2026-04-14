import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _storage: Storage | null = null;
  private readonly TASKS_KEY = 'tasks';
  private initPromise: Promise<void> | null = null;

  constructor(private storage: Storage) {}


  private async init(): Promise<void> {
    if (this._storage) return;

    if (!this.initPromise) {
      this.initPromise = this.storage.create().then((storage) => {
        this._storage = storage;
      });
    }
    return this.initPromise;
  }


  async getTasks(): Promise<any[]> {
    await this.init();
    const tasks = await this._storage?.get(this.TASKS_KEY);
    return tasks || [];
  }


  async saveTasks(tasks: any[]): Promise<void> {
    try {
      await this.init();
      await this._storage?.set(this.TASKS_KEY, tasks);
    } catch (error) {
      console.error('Errorguardando las tareas en Storage:', error);
    }
  }
}
