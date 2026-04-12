import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import { Category as CategoryModel} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private _storage: Storage | null = null;
  private CATEGORIES_KEY = 'categories';

  constructor(private storage : Storage){
    this.init();
  }

  async init(){
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async getCategories(): Promise<CategoryModel[]>{
    await this.init();
    return (await this._storage?.get(this.CATEGORIES_KEY)) || [];
  }

  async saveCategory(category : CategoryModel){
    const categories = await this.getCategories();
    categories.push(category);
    await this._storage?.set(this.CATEGORIES_KEY, categories)
  }

  async deleteCategory(id : string ){
    let categories = await this.getCategories();
    categories = categories.filter(c => c.id !== id);
    await this._storage?.set(this.CATEGORIES_KEY, categories);
  }
}
