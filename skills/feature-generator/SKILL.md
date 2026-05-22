---
name: feature-generator
description: Genera la estructura completa de una nueva funcionalidad siguiendo los estándares de arquitectura de Antogravity para Web (Next.js) o Móvil (Flutter). Asegura la separación de capas y el tipado correcto.
---

# Feature Generator (Web & Mobile)

Esta skill automatiza la creación de los archivos necesarios para una nueva funcionalidad, evitando el "copy-paste" propenso a errores y asegurando que se sigan las reglas de arquitectura (Regla #3).

## Instrucciones Paso a Paso

### 1. Recopilación de Datos
Pregunta al usuario:
- **Nombre de la funcionalidad**: (ej: `user-profile` o `auth`).
- **Plataforma**: (Web o Móvil).
- **Alcance**: ¿Necesita una página/pantalla completa o solo componentes/servicios?

### 2. Generación para WEB (Next.js)
Si la plataforma es **Web**, crea los siguientes archivos:
- **Service**: `src/services/[name]-service.ts` (Lógica de Supabase, Regla #8).
- **Types**: `src/types/[name].ts` (Interfaces de TypeScript, Regla #2).
- **Componentes**: `src/components/features/[Name]Card.tsx` (UI sin estado, Regla #5).
- **Página (Opcional)**: `src/app/[name]/page.tsx` (Estructura Next.js 15).

### 3. Generación para MÓVIL (Flutter)
Si la plataforma es **Móvil**, crea los siguientes archivos:
- **Domain (Entidad)**: `lib/domain/entities/[name].dart`.
- **Domain (Interfaz)**: `lib/domain/repositories/i_[name]_repository.dart`.
- **Data (Repositorio)**: `lib/data/repositories/[name]_repository.dart` (Usando `Either<Failure, Data>`, Regla #6.2).
- **Presentation (BLoC)**: `lib/presentation/blocs/[name]/[name]_bloc.dart` (Gestión de estado, Regla #6.2).
- **Presentation (Screen)**: `lib/presentation/screens/[name]_screen.dart`.

### 4. Registro en el Sistema
- Si es Web, asegúrate de que los componentes sigan las convenciones de Tailwind CSS (Regla #5).
- Si es Móvil, usa `equatable` para los estados del BLoC.

## Árbol de Decisión para el Agente
- **Si** el nombre de la funcionalidad ya existe -> Detente e informa al usuario para evitar sobrescritura.
- **Si** el usuario no especifica plataforma -> Revisa la estructura actual del proyecto para deducirla.
- **Si** la funcionalidad requiere acceso a base de datos -> Incluye automáticamente los imports de Supabase y el service role check si aplica.

## Checklist de Revisión de Feature
- [ ] **Naming**: ¿Se usó `kebab-case` para archivos TS y `snake_case` para Dart? (Regla #4.1).
- [ ] **Responsabilidad**: ¿El componente/widget tiene menos de 200 líneas? (Regla #4.2).
- [ ] **Tipado**: ¿Se evitaron los `any` y se usaron tipos estrictos? (Regla #4.2).
- [ ] **Estilos**: ¿Se usaron exclusivamente clases de Tailwind (Web) o constantes de tema (Móvil)? (Regla #5).
