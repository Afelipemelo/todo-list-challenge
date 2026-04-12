import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Category as CategoryService} from '../../services/category';
import { Category as CategoryModel} from '../../models/category.model';

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

  constructor(private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async addCategory() {
    const newCat: CategoryModel = {
      id: Date.now().toString(),
      name: this.newCategoryName,
      color: 'primary'
    };

    await this.categoryService.saveCategory(newCat);
    this.newCategoryName = '';
    await this.loadCategories();
  }

  async removeCategory(id: string) {
    await this.categoryService.deleteCategory(id);
    await this.loadCategories();
  }
}
