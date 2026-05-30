# 💼 Dashboard Corporativo de Proyectos - shadcn/ui

Este es un **Dashboard de Gestión de Proyectos, Equipos y Tareas** de nivel profesional y empresarial, desarrollado utilizando **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS (v4)** y componentes reactivos y accesibles de **shadcn/ui**.

El proyecto ha sido personalizado estéticamente para reflejar un estilo **sobrio, minimalista e hiper-estilizado** de alta gama, ideal para entornos corporativos y productos de software premium.

---

## 🎨 Características Estéticas Sobrias (Sober & Elegant)

* **Paleta de Colores Zinc-Slate Premium**: El tema principal ha sido configurado en el archivo `src/app/globals.css` utilizando colores de base neutros. El color primario es un sofisticado **Grafito profundo** en modo claro (`oklch(0.205 0.01 240)`) y **Stark Platinum** (`oklch(0.985 0.005 240)`) en modo oscuro.
* **Aesthetics de Cristal Moderno (Glassmorphism)**: Las tarjetas y modales cuentan con bordes ultra-delgados (`border-slate-200/50 dark:border-slate-800/50`), sutiles fondos translúcidos (`bg-white/80 dark:bg-slate-900/50`) y desenfoques de fondo (`backdrop-blur-xs`), generando una sensación de profundidad premium.
* **Transiciones y Elevaciones Fluidas**: Hover dinámico en tarjetas (`transition-all duration-300`) que reaccionan con un sombreado flotante sofisticado y realces elegantes de borde.
* **Componentes Responsivos Unificados**: Toda la interfaz está diseñada bajo cuadrículas dinámicas fluidas e implementa variables de color del tema de shadcn/ui, garantizando soporte nativo e inmediato para el **Modo Oscuro experimental** integrado en la pestaña de configuración.

---

## 🧩 Componentes Utilizados de shadcn/ui

Se instalaron y adaptaron los siguientes componentes oficiales de la galería shadcn/ui:
1. **`Button`**: Acciones principales con variantes `default`, `outline` y `destructive` integrando transiciones suaves.
2. **`Card`**: Contenedores semánticos y paneles de información interactivos.
3. **`Input` & `Label`**: Formularios accesibles e inputs con focus rings contextuales.
4. **`Dialog`**: Modales fluidos y accesibles (para creación de proyectos, detalles de ficha técnica y CRUDs).
5. **`Tabs`**: Sistema de navegación por pestañas de bajo retardo y transiciones suaves.
6. **`Select`**: Menús desplegables estilizados para categorías, prioridad y asignaciones.
7. **`Badge`**: Etiquetas de estados y prioridad codificados con colores desaturados y elegantes.
8. **`Avatar`**: Representación gráfica con iniciales para miembros del equipo.
9. **`Switch`**: Interruptores de disponibilidad y configuración general.
10. **`Table`**: Grilla estructurada y pulida para renderizar las tareas.
11. **`Spinner`**: Indicadores de carga interactivos que brindan feedback visual en acciones asíncronas (simulación de latencia de backend de 800ms).
12. **`Alert`**: Tarjetas de notificación destructivas para validaciones de formularios y banners de éxito.
13. **`Calendar`**: Calendario interactivo embebido para selección de fechas (vencimientos y cumpleaños).
14. **`Pagination`**: Controles de navegación de grilla para segmentar de a 3 tareas por página con soporte de páginas previas/siguientes.

---

## 💻 Arquitectura e Implementación de CRUDs en Memoria

Para cumplir con los objetivos técnicos del laboratorio, se diseñó una lógica de estado compartido reactiva en la raíz del dashboard (`src/app/dashboard/page.tsx`) que opera 100% en memoria del cliente:

1. **KPIs Vivos**: Las tarjetas de resumen superior (Total Proyectos, Tareas Completadas, Horas Simulación y Miembros Activos) leen dinámicamente los arreglos de estado de React. Cualquier creación, edición o eliminación en los CRUDs altera las estadísticas de inmediato.
2. **Bitácora de Actividad**: Cada acción completada con éxito inserta un evento formateado en la lista de "Actividad Reciente", con avatares e iniciales generados en caliente.
3. **CRUD de Proyectos**:
   * Formulario con validaciones en tiempo real mediante el componente `Alert` de error y spinner animado en el guardado.
   * Selección interactiva múltiple de miembros asignados al proyecto.
   * Visualización técnica del proyecto en un modal (equipo asignado y progreso).
   * Eliminación en cascada con recálculo dinámico de estadísticas.
4. **CRUD de Equipo (Miembros)**:
   * Formulario completo que permite agregar o editar integrantes (`userId`, `role`, `name`, `email`, `position`, `birthdate` vía `Calendar`, `phone`, `projectId`, `isActive`).
   * Interruptor `Switch` en lista que conmuta el estado de disponibilidad del miembro (*Activo* o *Ausente*) actualizando al instante el panel general.
5. **CRUD de Tareas (Paginado)**:
   * Grid corporativo estructurado con soporte nativo para **Paginación Dinámica de shadcn**.
   * Filtros implícitos y asignación directa de responsable e iniciativas.
   * Formulario con selector de fechas `Calendar` integrado de forma fluida.
6. **Preferencias Generales (Settings)**:
   * Formulario interactivo que permite guardar la configuración en memoria (Nombre del Workspace, Simulación de horas, Frecuencia de reportes, alertas por correo y activación del **Modo Oscuro experimental**).

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para correr el proyecto localmente en tu máquina:

### 1. Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior recomendada).
* Gestor de paquetes **npm**.

### 2. Pasos para la Ejecución
1. Instala los módulos y dependencias de Node.js:
   ```bash
   npm install
   ```
2. Ejecuta el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
3. Abre tu navegador web favorito y accede a:
   [http://localhost:3000](http://localhost:3000)

El proyecto cuenta con una redirección nativa que te enviará automáticamente a [http://localhost:3000/dashboard](http://localhost:3000/dashboard) de forma limpia y transparente.

---

## ⚡ Soluciones para Entornos de Windows y Turbopack

Durante el desarrollo se superaron dos limitaciones del entorno habitual de Windows:
1. **Google Fonts en Windows**: Turbopack en ocasiones falla resolviendo la importación de `next/font/google` en Windows. Para solucionarlo de raíz, se removió de `layout.tsx` y se implementó una pila tipográfica de sistema premium de alta fidelidad en `globals.css` (Inter, Roboto, sans-serif) mejorando la velocidad de compilación.
2. **Divergencias en calendar.tsx**: La última versión del componente `Calendar` de shadcn tiene pequeñas inconsistencias tipográficas con la librería `react-day-picker` v10 en TypeScript. Se solucionó aplicando un casting seguro de tipado (`classNames as any`) dentro de `calendar.tsx` para evitar cualquier warning de TypeScript y lograr un build limpio e impecable.

---
*Desarrollado con obsesión por los detalles y estándares corporativos premium.*
