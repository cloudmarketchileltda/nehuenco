---
name: mobile-app-scaffolder
description: Inicializa una nueva aplicación móvil siguiendo los estándares de Antogravity: Flutter 3.x, arquitectura limpia (Clean Architecture), Supabase y gestión de estado con BLoC/Cubit. Se activa cuando el usuario quiere empezar un nuevo proyecto móvil desde cero.
---

# Mobile App Scaffolder (Flutter & Supabase)

Esta skill automatiza la creación de la estructura base para aplicaciones móviles, asegurando el cumplimiento de las reglas globales (Clean Architecture y BLoC).

## Requisitos Previos
- Flutter SDK 3.x instalado en el sistema.
- Directorio de destino preparado.

## Instrucciones Paso a Paso

### 1. Inicialización del Proyecto Flutter
Ejecuta la creación del proyecto en el directorio actual.
- **Comando:** `flutter create --project-name <nombre_app> --platforms ios,android,web ./`
  *(Nota: Sustituir <nombre_app> por el nombre del proyecto en snake_case)*.

### 2. Configuración de Dependencias (Regla #6.2, #12, #15)
Añade las librerías esenciales al `pubspec.yaml`:
- **Comando:** `flutter pub add supabase_flutter flutter_bloc fpdart flutter_secure_storage equatable get_it`
- Ejecuta `flutter pub get` para sincronizar.

### 3. Estructura de Directorios (Regla #3.2)
Crea la estructura de carpetas dentro de `lib/`:
- `lib/core/`: Configuración, constantes, temas, errores.
- `lib/data/`: Repositorios (implementaciones), data sources, modelos.
- `lib/domain/`: Entidades, casos de uso, interfaces de repositorios.
- `lib/presentation/`: Widgets, pantallas, BLoC/Cubit.
  - `lib/presentation/screens/`
  - `lib/presentation/widgets/`
  - `lib/presentation/blocs/`

### 4. Inicialización de Supabase (Regla #15)
- Crea `lib/core/supabase_config.dart` con la inicialización de Supabase.
- Configura el `main.dart` para inicializar `Supabase.initialize` antes de `runApp`.

### 5. Configuración de Seguridad (Regla #12)
- Prepara un servicio base para `flutter_secure_storage` en `lib/core/services/storage_service.dart`.

### 6. Documentación (Regla #16)
- Crea el archivo `prd.md` en la raíz con la entrada inicial del proyecto móvil.
- Actualiza el `README.md` con los pasos para configurar las API Keys de Supabase.

## Checklist de Calidad Móvil
- [ ] **Arquitectura**: ¿Están los repositorios en la capa `data` y las interfaces en `domain`?
- [ ] **Estado**: ¿Se está usando BLoC/Cubit para la lógica de presentación?
- [ ] **Errores**: ¿Se está usando el patrón `Either` para el manejo de fallos?
- [ ] **Seguridad**: ¿Se ha configurado `flutter_secure_storage` para datos sensibles?
- [ ] **Const**: ¿Se han aplicado constructores `const` donde es posible para rendimiento?

## Árbol de Decisión para el Agente
- **Si** el usuario pide navegación -> Sugiere `go_router` o `auto_route` como estándar.
- **Si** el usuario pide manejo de imágenes -> Asegúrate de incluir `cached_network_image` (Regla #9).
- **Si** el usuario intenta poner lógica de negocio en un Widget -> Detente y muévela a un BLoC/Cubit (Regla #6.2).
