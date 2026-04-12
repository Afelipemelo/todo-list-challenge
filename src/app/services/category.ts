import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import { Category as CategoryModel} from '../models/category.model';
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private _storage: Storage | null = null;
  private CATEGORIES_KEY = 'categories';

  constructor(private storage : Storage, private RemoteConfig : RemoteConfig){
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

  async getCanDeleteFlag(): Promise<boolean>{
    try{
      await fetchAndActivate(this.RemoteConfig);
      const configValue = getValue(this.RemoteConfig, 'show_delete_category');
      return configValue.asBoolean();
    }catch (error){
      return false
    }
  }
}
