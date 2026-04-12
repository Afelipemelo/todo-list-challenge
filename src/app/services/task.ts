import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class Task {

  private _storage: Storage | null = null;
  private TASKS_KEY = 'tasks';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getTasks(): Promise<any[]> {
    await this.init();
    return (await this._storage?.get(this.TASKS_KEY)) || [];
  }

  async saveTasks(tasks: any[]) {
    console.log(tasks)
    await this.init();
    await this._storage?.set(this.TASKS_KEY, tasks);
  }
}
