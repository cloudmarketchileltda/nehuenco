---
name: web-app-scaffolder
description: Inicializa una nueva aplicación web siguiendo los estándares de Antogravity: Next.js 15, TypeScript, Tailwind CSS, Supabase y configuración para Dockploy en el puerto 8080. Se activa cuando el usuario quiere empezar un nuevo proyecto web desde cero.
---

# Web App Scaffolder (Dockploy & Supabase)

Esta skill automatiza la creación de la infraestructura inicial para aplicaciones web modernas, asegurando el cumplimiento de las reglas globales del proyecto.

## Requisitos Previos
- El directorio de destino debe estar listo (puede estar vacío o ser un repo de Git inicializado).

## Instrucciones Paso a Paso

### 1. Inicialización del Framework (Next.js)
Ejecuta la creación del proyecto Next.js en el directorio actual (`./`) con las siguientes opciones automáticas:
- TypeScript: Sí
- ESLint: Sí
- Tailwind CSS: Sí
- `src/` directory: Sí
- App Router: Sí
- Turbopack: No (o según preferencia del usuario)
- Alias `@/*`: Sí

**Comando:** `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --src-dir --app --import-alias "@/*" --use-npm`

### 2. Configuración de Entorno y Puerto (Regla #17)
- Modifica el `package.json` para que `npm run dev` use el puerto **8080** con `strictPort`.
- Crea un archivo `.env.local` con placeholders para `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 3. Integración de Supabase (Regla #15)
- Instala las dependencias: `@supabase/supabase-js`, `@supabase/ssr`.
- Crea la estructura de servicios:
  - `src/lib/supabase/` (cliente de servidor y cliente de navegador).
  - `src/services/` (capa de datos).
  - Carpeta `supabase/migrations/` en la raíz.

### 4. Dockerización para Dockploy
Crea un `Dockerfile` optimizado para Next.js (standalone mode) que:
- Use `node:20-alpine`.
- Exponga el puerto **8080**.
- Configure `HOSTNAME="0.0.0.0"`.
Crea un `.dockerignore` excluyendo `node_modules`, `.next`, etc.

### 5. Estructura de Directorios (Regla #3.1)
Asegura la existencia de:
- `src/components/ui/`
- `src/components/features/`
- `src/hooks/`
- `src/types/`
- `src/services/`

### 6. Documentación Inicial (Regla #16)
- Crea el archivo `prd.md` en la raíz con la entrada inicial del proyecto.
- Actualiza el `README.md` con instrucciones locales y variables de entorno necesarias.

## Checklist de Seguridad y Despliegue
- [ ] **Puertos**: ¿Está configurado el puerto 8080 en el script `dev` y en el `Dockerfile`?
- [ ] **Supabase**: ¿Se están usando los clientes oficiales y no fetch directo?
- [ ] **Docker**: ¿El Dockerfile está optimizado para producción?
- [ ] **Tipos**: ¿Está TypeScript configurado en modo `strict: true`?
- [ ] **Secretos**: ¿Se han añadido `.env*` al `.gitignore`?

## Árbol de Decisión para el Agente
- **Si** el usuario pide añadir autenticación inmediatamente -> Sugiere configurar Supabase Auth con SSR.
- **Si** el usuario pide una base de datos diferente -> Advierte que Supabase es el estándar oficial (Regla #15).
- **Si** el puerto 8080 está ocupado -> La ejecución debe fallar (strictPort) para cumplir la regla #17.
