# 📝 Todo-List Challenge - Accenture

## 1. Presentación
Esta aplicación es una solución para la gestión de tareas, desarrollada como parte del proceso de evaluación técnica para **Accenture**. El proyecto se centra en la implementacion una arquitectura **Standalone**  y persistencia de datos local y remota.

---

## 2. Stack Tecnológico
Se optó por utilizar las versiones que aseguraran la compatibilidad de dependendicas.

* **Framework Frontend:** Angular 18 (Arquitectura Standalone)
* **Framework Móvil:** Ionic 8 / Capacitor 6
* **Entorno de Ejecución:** Node.js v18.20.0
* **Persistencia Local:** Capacitor Storage / SQLite
* **Servicios Cloud:** Firebase (Remote Config para Feature Flagging)
* **Java JDK:**  Java JDK 17
* **Rendimiento:** Angular CDK (Virtual Scrolling)

---

## 3. Despliegue y Ejecución

### Requisitos Previos
* Node.js instalado (v18+)
* Ionic CLI instalado (`npm install -g @ionic/cli`)
* Android Studio (para pruebas en APK)

### Instalación y Ejecución en Web
1.  Clonar el repositorio.
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Ejecutar en el navegador:
    ```bash
    ionic serve
    ```

### Despliegue en Android
Para generar y probar la versión nativa:
1.  Generar build de producción:
    ```bash
    npx ng build --configuration production
    ```
2.  Sincronizar con Capacitor:
    ```bash
    npx cap sync android
    ```
3.  Abrir en Android Studio:
    ```bash
    npx cap open android
    ```

---

## 4. Puntos Abordados y Soluciones Técnicas

### ✅ Gestión Masiva de Datos (Virtual Scroll)
Se implementó `cdk-virtual-scroll-viewport` para manejar grandes listas de datos.

### ✅ Persistencia y Sincronización
La aplicación utiliza un servicio de almacenamiento local mediante `Ionic Storage` que garantiza que la informacion tras cerrar la aplicación.

### ✅ Firebase Remote Config
Se integra **Firebase Remote Config** para habilitar dinámicamente funcionalidades desde la consola de Firebase (Feature Flagging).

---

## 5. Funcionalidades Destacadas
* **Filtros por Categoría:** Segmentación lógica de tareas.
* **Empty States:** Vistas informativas y amigables cuando no hay datos pendientes.
* **Arquitectura Limpia:** Separación estricta de responsabilidades entre servicios y componentes.
