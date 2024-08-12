# TaskManager

## Descripción del Proyecto

TaskManager es una aplicación web desarrollada como proyecto final para la materia Programación 3 de la carrera de Desarrollo de Software de la UPATecO. Esta aplicación facilita a los usuarios la gestión de sus tareas cotidianas, la creación de proyectos, la asignación de tareas a proyectos específicos y el seguimiento del estado de dichas tareas.

## Propósito y Objetivos del Proyecto

El propósito fundamental de TaskManager es proporcionar una herramienta eficiente y de fácil uso para la gestión de tareas personales. Los objetivos principales del proyecto incluyen:

- Facilitar a los usuarios la creación y gestión de proyectos.
- Permitir la asignación de tareas a proyectos específicos.
- Ofrecer un seguimiento del estado de las tareas (pendiente, completada).
- Implementar un sistema de autenticación de usuarios y protección de rutas.
- Proporcionar una interfaz de usuario intuitiva y amigable.

## Requisitos de Software y Hardware

### Software

- **Lenguaje de Programación:** JavaScript
- **Bibliotecas:**
  - React (versión 18.3.1)
  - React Router DOM (versión 6.26.0)
  - Date-fns (versión 3.6.0)
  - React Datepicker (versión 7.3.0)
- **Herramientas de Desarrollo:**
  - Vite (versión 5.4.0)

### Hardware

- PC con conexión a internet.
- Memoria RAM recomendada: 4GB o superior.
- Procesador: Intel Core i3 o equivalente.

## Estructura del Código

El proyecto sigue una estructura modular que facilita la organización y el mantenimiento del código. A continuación, se detalla la estructura de directorios y archivos:

### Descripción de Módulos y Componentes

- **`Auth/`**: Contiene los componentes relacionados con la autenticación de usuarios.
  - **`Login.jsx`**: Componente para el inicio de sesión de usuarios.
  - **`Logout.jsx`**: Componente para el cierre de sesión de usuarios.
- **`Tasks/`**: Contiene los componentes relacionados con la gestión de tareas.
  - **`TaskList.jsx`**: Componente que muestra la lista de tareas del usuario.
- **`Profile.jsx`**: Componente que presenta la información del perfil del usuario.
- **`Navbar.jsx`**: Componente de la barra de navegación.
- **`ProtectedRoute.jsx`**: Componente que protege las rutas accesibles solo para usuarios autenticados.
- **`NotFound.jsx`**: Componente que se muestra cuando se accede a una ruta inexistente.
- **`context/`**: Contiene los contextos de la aplicación.
  - **`AuthContext.jsx`**: Contexto para la gestión de autenticación de usuarios.
- **`hooks/`**: Contiene los hooks personalizados.
  - **`useFetch.js`**: Hook para realizar peticiones.
- **`utils/`**: Contiene utilidades y funciones auxiliares.
  - **`taskUtils.js`**: Funciones auxiliares para la gestión de tareas.
- **`App.jsx`**: Componente principal de la aplicación.
- **`main.jsx`**: Punto de entrada de la aplicación.

## Guía de Utilización

### Inicio de Sesión

1. Dirigirse a la página de inicio de sesión.
2. Ingrese su nombre de usuario y contraseña.
3. Seleccione "Iniciar Sesión".

### Gestión de Proyectos

1. Para crear un nuevo proyecto, seleccione "Crear Proyecto" en la barra de navegación.
2. Ingrese el nombre del proyecto y seleccione "Crear".

### Gestión de Tareas

1. Una vez autenticado, podrá visualizar la lista de tareas en la página principal.
2. Para crear una nueva tarea, seleccione "Crear Tarea" en la barra de navegación.
3. Complete el formulario con el título, descripción, proyecto y fecha límite de la tarea.
4. Seleccione "Crear" para añadir la tarea a la lista.

### Cierre de Sesión

1. Ingrese a "Perfil".
2. Para cerrar sesión, seleccione "Salir".
