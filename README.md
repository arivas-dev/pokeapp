# PokeApp

Aplicación Angular para gestión de perfil de entrenador y equipo Pokémon, consumiendo la [PokeAPI](https://pokeapi.co/).

---

## Descripción general

PokeApp permite a los usuarios:
- Crear y editar su perfil de entrenador (nombre, foto, pasatiempo, cumpleaños, documento).
- Seleccionar un equipo de 3 Pokémon de la primera generación, con búsqueda y filtrado.
- Visualizar su perfil y equipo en un dashboard moderno, con stats visuales y diseño responsivo.
---

## Estructura del proyecto

```
pokeapp/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── profile/           # Perfil de entrenador (formulario, validaciones)
│   │   │   ├── pokemon-team/      # Selección de equipo Pokémon
│   │   │   ├── trainer-dashboard/ # Dashboard principal
│   │   │   ├── shared/            # Componentes y servicios reutilizables
│   │   ├── layout/                # Header y layout global
│   │   ├── store/                 # Estado global (TrainerStore)
│   │   ├── app-routing.module.ts  # Rutas principales
│   │   ├── app.module.ts          # Módulo raíz
│   ├── assets/                    # Imágenes y recursos estáticos
│   ├── styles/                    # Variables y estilos globales SASS
│   ├── styles.sass                # Estilos globales
│   └── environments/              # Configuración de entornos
├── package.json                   # Dependencias y scripts
├── angular.json                   # Configuración Angular CLI
└── ...
```

---

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd pokeapp
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Ejecuta la app en modo desarrollo:
   ```bash
   ng serve
   ```
   Accede a [http://localhost:4200](http://localhost:4200)

---

## Tecnologías principales

- **Angular 12+**
- **TypeScript** (estricto)
- **Angular Material** (UI)
- **Swiper** (carrusel de Pokémon)
- **RxJS** (estado reactivo)
- **SASS** (mobile-first)
- **PokeAPI** (datos de Pokémon)

---

## Arquitectura y módulos

- **features/profile:**  
  Formulario de perfil con validaciones, subida de imagen y lógica de edad/documento.
- **features/pokemon-team:**  
  Selección de equipo con búsqueda, filtrado y virtual scroll.
- **features/trainer-dashboard:**  
  Dashboard visual con Swiper para mostrar el equipo y stats.
- **features/shared:**  
  Componentes reutilizables: cards, headers, servicios de datos.
- **layout:**  
  Header global y layout principal.
- **store:**  
  Estado global del perfil y equipo, persistido en localStorage.

---

## Bonus implementados

- **Virtual scroll** en la selección de Pokémon.
- **Swiper** en el dashboard para mostrar el equipo como carrusel.
- **Validaciones** en formularios (DUI, edad, etc).
- **Diseño mobile-first** y responsivo.