# UniTask - Agenda Universitaria Cifrada 🎓📅🔒

<p align="center">
  <img src="assets/logo.png" alt="UniTask Logo" width="120" style="border-radius: 24px; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);" />
</p>

**UniTask** es un gestor interactivo de entregas, exámenes y plazos académicos para estudiantes universitarios. Integra un sistema de **autenticación de usuarios**, **base de datos local en el navegador (IndexedDB)** y **cifrado criptográfico de grado militar (AES-256-GCM y PBKDF2)** de cero conocimiento (*zero-knowledge encryption*).

---

## 🚀 Demo en Vivo

🌐 Accede directamente sin instalar nada: **[https://rodalca03.github.io/uni-tasker/](https://rodalca03.github.io/uni-tasker/)**

---

## 🔐 Seguridad y Cifrado Local

- **Autenticación Segura**: Sistema de registro e inicio de sesión por usuario y contraseña.
- **Cifrado AES-256-GCM**: Todas las tareas, asignaturas y descripciones se cifran antes de persistir en la base de datos local del navegador.
- **Derivación con PBKDF2**: Claves criptográficas derivadas con 100,000 iteraciones y algoritmo SHA-256, con sal única aleatoria por usuario.
- **Cero Conocimiento**: Ni el navegador ni terceros pueden leer tus notas o entregas sin la contraseña que descifra la bóveda en memoria.
- **Base de Datos Local**: Soporte nativo para **IndexedDB** con respaldo automático a almacenamiento local cifrado.

---

## ✨ Características y Funcionalidades

- 📱 **Diseño Mobile Responsive & Touch-First**:
  - Selector deslizante de días de la semana con indicadores de tareas.
  - Conmutador de vista táctil: **Por Día** o **Semana Completa**.
  - Botón flotante (**FAB**) para crear tareas con una sola mano.
  - Modales fluidos estilo *bottom-sheet* en teléfonos móviles.

- 🗓️ **Tablero Semanal**:
  - Navegación ágil entre semanas y salto inmediato a "Hoy".
  - Barra de progreso que calcula el porcentaje de cumplimiento semanal.
  - Prioridades visuales: 🔴 Alta, 🟡 Media, 🟢 Baja.

- 🎨 **Gestión de Asignaturas**:
  - Colores personalizados por materia.
  - Reasignación de tareas al eliminar una asignatura.
  - Filtro instantáneo por asignatura.

---

## 🛠️ Tecnologías

- **HTML5 & CSS3** con diseño adaptativo.
- **Web Crypto API** nativa del navegador (`crypto.subtle`).
- **IndexedDB** para persistencia estructurada local.
- **Tailwind CSS** (vía CDN) & **Google Fonts** (Plus Jakarta Sans).
