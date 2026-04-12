
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { Category as CateogryModel} from '../models/category.model';
import { Category as CategoryService } from '../services/category';
import {ScrollingModule,CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { AddTaskModalComponent } from '../componets/add-task-modal/add-task-modal.component';
import { Task as TaskService } from '../services/task';
import { fetchAndActivate, getRemoteConfig, getValue } from 'firebase/remote-config';
import { trash, flask, settings, add } from 'ionicons/icons'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ScrollingModule]
})
export class HomePage {

  @ViewChild(CdkVirtualScrollViewport)  viewport! : CdkVirtualScrollViewport;

  categories: CateogryModel[] = [];
  tasks: any[] = [];
  filteredTasks: any[] = [];
  selectedCategory: string = 'all';
  showMassiveBtn : boolean = false;

  constructor(
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private taskService : TaskService
  ) {
    addIcons({trash,flask,settings, add})
  }

  async ngOnInit() {
  }

  async ionViewWillEnter() {
    try{
      const rc = getRemoteConfig();

      await fetchAndActivate(rc);

      this.showMassiveBtn = getValue(rc, 'show_massive_load_option').asBoolean();

      this.categories = await this.categoryService.getCategories();
      this.tasks = await this.taskService.getTasks();
      this.applyFilter();
    }catch(error){
      this.categories = await this.categoryService.getCategories();
      this.tasks = await this.taskService.getTasks();
      this.applyFilter();
    }

  }

  async saveTasks(){
    await this.taskService.saveTasks(this.tasks)
  }

  async deleteTask( id : string){
    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.saveTasks();
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedCategory === 'all') {
      this.filteredTasks =[...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(t => t.categoryId === this.selectedCategory);
    }

    setTimeout(() => {
      if (this.viewport) {
        this.viewport.checkViewportSize();
      }
    }, 100);
  }

  getCategoryName(categoryId: string): string {
  const category = this.categories.find(c => c.id === categoryId);
  return category ? category.name : 'Sin categoría';
  }

  async openAddTask() {
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent,
      // Propiedades para el look de "Hoja de Cristal"
      initialBreakpoint: 0.5, // Abre hasta la mitad
      breakpoints: [0, 0.5, 0.8], // Permite expandirlo o minimizarlo
      handle: true, // Muestra la barrita superior para arrastrar
      backdropDismiss: true,
      cssClass: 'glass-modal' // Clase opcional por si quieres pulir bordes externos
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const newTask ={
        id: Date.now().toString(),
        title: data.title,
        categoryId: data.categoryId,
        completed: false
    }
      this.tasks = [newTask, ...this.tasks]
      await this.saveTasks();
      this.applyFilter();
    }
  }

  generateMassiveTasks(){
    const massive = Array.from({length : 500}, (_ , i ) => ({
      id: `stress-${Date.now()}-${i}`,
      title : `Tarea Masiva #${i + 1}`,
      completed : false,
      categoryId : ''
    }))

    this.tasks = [...this.tasks, ...massive];
    this.saveTasks();
    this.applyFilter();
  }

  trackById(index : number, item : any){
    return item.id;
  }



}
