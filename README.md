# 📝 Task Manager - Deep Glass Edition

Una aplicación de gestión de tareas de alto rendimiento construida con **Ionic 8+** y **Angular**.

## ✨ Características Principales


* **Virtual Scroll :** Implementación de `@angular/cdk/scrolling` para garantizar una navegación fluida incluso con miles de tareas, optimizando el uso de memoria y CPU.
* **UI Adaptativa (Adaptive Layout):** El sistema detecta la plataforma automáticamente; muestra *Sheet Modals* nativos en dispositivos móviles y diálogos elegantes centrados en escritorio.
* **Gestión de Categorías:** Sistema de organización dinámico que permite clasificar tareas y filtrar la vista principal en tiempo real.

## 🛠️ Stack Tecnológico

* **Framework:** [Ionic Framework 8+](https://ionicframework.com/)
* **Core:** [Angular](https://angular.io/) (Standalone Components)
* **Scrolling:** CDK Virtual Scroll.
* **Estilos:** SCSS avanzado con variables CSS dinámicas y Shadow Parts.

## 🎨 Design System

El corazón de la aplicación es su identidad visual coherente en cada componente:

| Elemento | Propiedad / Valor |
| :--- | :--- |
| **Fondo Base** | `#0f172a` (Deep Slate) |
| **Tarjetas (Cards)** | `rgba(255, 255, 255, 0.03)` |
| **Bordes de Cristal** | `rgba(255, 255, 255, 0.08)` |
| **Radio de Bordes** | `14px` / `16px` (Bento Style) |
| **Tipografía** | Inter / System Default (Font-weight: 500, 800) |

## 🚀 Instalación y Configuración

1.  **Clonación del proyecto:**
    ```bash
    git clone [https://github.com/tu-usuario/task-manager.git](https://github.com/tu-usuario/task-manager.git)
    cd task-manager
    ```

2.  **Instalación de dependencias:**
    ```bash
    npm install
    ```

3.  **Lanzamiento en entorno local:**
    ```bash
    ionic serve
    ```

## 🏗️ Estructura del Proyecto

* `home/`: Vista principal con lógica de filtrado y scroll infinito.
* `category-management/`: Interfaz para la administración de etiquetas.
* `components/add-task-modal/`: Componente de entrada de datos con diseño adaptativo.
* `global.scss`: Definiciones maestras del efecto Glass y personalización de componentes nativos (Popovers, Modals).

---

Desarrollado con ❤️ por **Andres Melo**
