# Product Requirements & Decisions (PRD)

Este archivo registra las decisiones técnicas y cambios relevantes del proyecto.

## Respaldo del Proyecto en GitHub — 2026-05-22

**Tipo**: infraestructura | respaldo

**Descripción**: Se respaldó todo el proyecto en el repositorio remoto de GitHub `https://github.com/cloudmarketchileltda/nehuenco.git` en la rama `main`.

**Detalles del respaldo**:
- **Repositorio**: `cloudmarketchileltda/nehuenco`
- **URL**: https://github.com/cloudmarketchileltda/nehuenco
- **Rama**: `main`
- **Commit**: `7a0a1e7` — "Respaldo inicial: Restobar Nehuenco - Aplicación web Next.js 15"
- **Archivos respaldados**: 40 archivos (62 objetos git)
- **Fecha**: 22 de mayo de 2026

**Estructura del proyecto respaldado**:
- `src/` — Código fuente de la aplicación Next.js 15 (App Router, TypeScript, Tailwind CSS v4)
- `public/` — Archivos estáticos e imágenes SVG
- `skills/` — Skills del asistente de IA (feature-generator, mobile-app-scaffolder, prd-manager, skill-creator, web-app-scaffolder)
- `prd.md` — Registro de decisiones técnicas y cambios
- `AGENTS.md`, `CLAUDE.md` — Configuración del asistente de IA
- `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` — Configuración del proyecto

**Comandos ejecutados**:
```bash
git init
git add .
git commit -m "Respaldo inicial: Restobar Nehuenco - Aplicación web Next.js 15"
git branch -m main
git remote add origin https://github.com/cloudmarketchileltda/nehuenco.git
git push -u origin main
```

## Configuración de Node.js para Dokploy/Nixpacks — 2026-05-22

**Tipo**: infraestructura | deploy

**Descripción**: Se corrigió el error de build en Dokploy que usaba Node.js 18.20.5, incompatible con Next.js 16 que requiere Node.js >= 20.9.0. Se agregaron archivos de configuración para forzar el uso de Node.js 22 en el entorno de deploy.

**Archivos creados**:
- **`nixpacks.toml`**: Configuración para Nixpacks (usado por Dokploy) que especifica `nodejs_22` como paquete Nix, instala dependencias con `npm ci --omit=dev` y ejecuta el build y start.
- **`.nvmrc`**: Archivo con la versión `22` para que herramientas como NVM y Nixpacks detecten automáticamente la versión de Node.js requerida.
- **`.env.example`**: Archivo de ejemplo con las variables de entorno necesarias (`NEXT_PUBLIC_ADMIN_USERNAME` y `NEXT_PUBLIC_ADMIN_PASSWORD`).

**Correcciones realizadas**:
- Se eliminó el `...` (spread inválido) del array `nixPkgs` en `nixpacks.toml` que causaba error de parseo TOML: `expected a value, found a period at line 2 column 25`.

**Variables de entorno requeridas en Dokploy**:
- `NEXT_PUBLIC_ADMIN_USERNAME` — Usuario para el panel de administración (default: `admin`)
- `NEXT_PUBLIC_ADMIN_PASSWORD` — Contraseña para el panel de administración (default: `nehuenco2026`)

**Impacto**: El build en Dokploy ahora usará Node.js 22, compatible con Next.js 16, resolviendo el error:
```
You are using Node.js 18.20.5. For Next.js, Node.js version ">=20.9.0" is required.
```

## Auditoría y Ajuste de Responsividad en Interfaces — 2026-05-20

**Tipo**: refactor | decisión técnica

**Descripción**: Se realizó una revisión exhaustiva de las dimensiones de todos los componentes clave y flujos interactivos para garantizar una visualización 100% responsiva (mobile-first) que evite desbordamientos en pantallas pequeñas.

**Impacto**:
- **Menú de Categorías (Página de Inicio)**: Se optimizó el espaciado interno (`p-4 sm:p-6`) y el tamaño de fuente (`text-xs sm:text-sm`) de las tarjetas de categorías, lo que previene truncamientos de texto y roturas de diseño en dispositivos de 320px de ancho.
- **Navegación del Panel de Admin**: Se modificó la barra lateral operativa para que en móviles (formato horizontal deslizable) los botones utilicen `w-auto` adaptándose a su contenido, mientras que en pantallas grandes (`lg:`) sigan ocupando el ancho completo del contenedor (`lg:w-full`).
- **Modal de Detalle de Producto**: Se configuró la altura de la imagen de forma condicional (`h-48 md:h-auto md:min-h-[350px]`) previniendo que la ventana modal supere el alto de la pantalla del celular y permitiendo el acceso fácil a los botones de acción sin necesidad de scroll infinito.

## Sección de Cupón Presencial con Código QR en Club de Beneficios — 2026-05-20

**Tipo**: feature | decisión técnica

**Descripción**: Se incorporó un botón y ventana modal interactiva en el banner del Club de Beneficios para que los clientes puedan generar e imprimir un cupón de descuento físico (15% OFF) con un código QR, diseñado específicamente para validar de manera presencial en el local de Cunco.

**Impacto**:
- **Página de Inicio**: Se agregó el botón "Cupón QR Local" (con icono de QR Code) en el banner de fidelidad que activa el modal.
- **Modal de Cupón Imprimible**: Se diseñó una interfaz con borde segmentado que contiene la marca del local, descuento de 15% OFF, un código de barras QR vectorizado en SVG (NEHUENCO15CUNCO) para que no dependa de APIs externas de generación de códigos de barras, y términos de uso.
- **Estilos de Impresión**: Se añadieron reglas CSS `@media print` específicas en `globals.css` bajo la clase `body.printing-coupon`. Al imprimir, el navegador oculta la cabecera, pie de página, barra de navegación y todo el fondo, imprimiendo únicamente la tarjeta del cupón para optimizar el uso de papel térmico.

## Definición de Propuesta de Valor y Ubicación en Cunco — 2026-05-20

**Tipo**: feature | decisión técnica

**Descripción**: Se ajustó la propuesta de valor en la página de inicio para definir al restobar como un restaurant de comida chilena, tradicional y moderna, y se estableció formalmente que se encuentra ubicado en la ciudad de Cunco, Región de La Araucanía.

**Impacto**:
- **Página de Inicio**: Se modificaron el título principal, subtítulos y badges de localización (`Cunco, La Araucanía`).
- **Footer**: Se cambió la dirección física de prueba por `Calle Comercio 456, Cunco, Región de La Araucanía`.
- **SEO/Metadatos**: Se actualizó la descripción del sitio en `layout.tsx` para reflejar la oferta en Cunco.

## Ajuste de Categorías y Rebranding a Restobar Chileno — 2026-05-20

**Tipo**: feature | refactor | decisión técnica

**Descripción**: Se redefinió por completo el foco de marca de Restobar Nehuenco. Se eliminó la propuesta de comida saludable, orgánica y vegetariana, orientando el negocio hacia un restobar de comida rápida tradicional (completos, chorrillanas), colaciones caseras, especialidades de sushi y bar (cervezas, vinos y jugos).

**Impacto**:
- **Base de Datos y Categorías**: Se rediseñó el catálogo inicial de productos de la tienda Zustand con platos típicos chilenos (Completo Italiano, Chorrillana Familiar, Pastel de Choclo, Lomo a lo Pobre), opciones de sushi y bebidas/vinos/cervezas locales. Se modificaron los tipos e interfaces de categorías para alinearse con `"Comida Rapida"`, `"Colaciones"`, `"Especialidades"`, `"Bebidas y Jugos"`, `"Cervezas y Vinos"`.
- **Identidad Visual y Textos**: Se actualizaron los textos de la página de inicio, catálogo, carrito, tickets y metadatos del sitio, eliminando términos como "orgánico", "consciente" o "saludable" y reemplazándolos con referencias al sabor tradicional y especialidades de la casa. El icono de la marca (`Leaf`) se cambió por cubiertos (`Utensils`).
- **Formularios del Panel de Administración**: Se actualizaron los campos de categorías y selecciones de adición de productos para reflejar fielmente las nuevas 5 secciones de la carta.

**Decisiones tomadas**:
- Reemplazar por completo los datos de prueba (`useStore.ts`) para evitar inconsistencias en el catálogo y facilitar demostraciones realistas del menú típico chileno y sushi.
- Mantener la paleta de colores del diseño original (`salvia`, `verde-profundo`) adaptando su justificación de marca desde "saludable" a "artesanal y de cocina tradicional".

## Pantalla de Login para Acceso al Panel de Administración — 2026-05-20

**Tipo**: feature | seguridad | decisión técnica

**Descripción**: Se incorporó un flujo de autenticación obligatorio para ingresar al Panel de Administración (`/admin`), bloqueando el acceso directo a usuarios no autenticados.

**Impacto**:
- Al acceder a `/admin`, los usuarios no autenticados visualizan una pantalla con una tarjeta de inicio de sesión con estilo glassmorphic y natural.
- Las credenciales se configuran a través de variables de entorno y se validan a través de la tienda Zustand.
- Se agregó un botón de "Cerrar Sesión" en la barra lateral del panel de administración para finalizar la sesión activa.

**Decisiones tomadas**:
- **Autenticación Basada en Sesión**: El estado `isAdminAuthenticated` está configurado en la tienda Zustand y se excluye de la persistencia de `localStorage` (`partialize`). Esto asegura que cuando se cierra la pestaña o ventana del navegador, la sesión expira automáticamente para mayor seguridad.
- **Configuración mediante Variables de Entorno**: Se definieron `NEXT_PUBLIC_ADMIN_USERNAME` y `NEXT_PUBLIC_ADMIN_PASSWORD` en `.env.local` con valores predeterminados seguros para desarrollo local (`admin` / `nehuenco2026`).

## Acceso Administrador como Icono en Cabecera — 2026-05-20

**Tipo**: decisión técnica | refactor

**Descripción**: Se reubicó el acceso de administración, que antes estaba en la lista de enlaces del menú de navegación, a un icono de engranaje (`Settings`) en la sección derecha de la cabecera, junto al acceso de perfil/registro del usuario.

**Impacto**: 
- Limpieza visual del menú de navegación principal (`Inicio`, `Carta`, `Mi Club`).
- Acceso directo y discreto al panel de administración visible de manera constante en la cabecera del sitio.

**Decisiones tomadas**: Utilizar el icono de configuración (`Settings`) de `lucide-react` posicionado inmediatamente a la izquierda del icono de usuario (`User`), manteniendo la consistencia de estilos con el resto de botones de acción rápida (carrito, perfil).

## Reorganización de la Estructura de Skills — 2026-05-20

**Tipo**: refactor | arquitectura

**Descripción**: Se movió el directorio de skills desde la carpeta de respaldo temporal `agents_backup_latest/skills` directamente a la raíz del repositorio como `skills/`. La carpeta vacía `agents_backup_latest` fue eliminada.

**Impacto**: Las rutas de las skills ahora se ubican directamente en la raíz (ej. `skills/prd-manager`), simplificando el acceso, la integración y las referencias por parte del asistente de IA.

**Decisiones tomadas**: Mantener las skills a nivel de raíz para tener una estructura limpia y optimizada según las convenciones del entorno de desarrollo.

## Implementación Base de la Aplicación Restobar Nehuenco — 2026-05-20

**Tipo**: feature | arquitectura

**Descripción**: Se implementó de manera completa y funcional la aplicación web Restobar Nehuenco utilizando Next.js 15 (App Router), Tailwind CSS v4, TypeScript y Zustand con persistencia en localStorage.

**Impacto**: 
- Se crearon todas las pantallas principales del flujo del cliente: Página de Inicio (Hero, Recomendaciones), Catálogo (Filtros por categorías, buscador, estados de agotado), Carrito de Compras (Edición de cantidades y notas), Checkout (Ingreso de datos, métodos de pago con simulador Webpay Plus) y Perfil del Cliente (Programa de puntos Club Nehuenco con Ana Contreras).
- Se desarrolló el Ticket de Seguimiento en Tiempo Real, con simulación automática de estado y diseño optimizado de impresión térmica.
- Se implementó el Panel de Administración completo para gestión operativa (Dashboard con métricas, tabla de pedidos activos, CRUD de productos, estado del local y gestor de cupones).

**Decisiones tomadas**: 
- **Zustand con Persistencia**: Permite que las operaciones de compra y las actualizaciones de estado de la cocina en el panel de administración se sincronicen en tiempo real con el ticket de seguimiento sin requerir una base de datos externa en desarrollo.
- **Next.js 15 App Router & Suspense Boundaries**: Se utilizaron límites Suspense para evitar errores de renderizado/hidratación por parámetros de consulta URL dinámicos.
- **Mobile-first & Estilo Impresión**: La interfaz se diseñó pensando prioritariamente en dispositivos móviles (el principal punto de contacto del cliente en el local) y se incorporaron estilos `@media print` dedicados para boletas de retiro térmicas.

## Registro de Ajustes de Catálogo — 2026-05-20

**Tipo**: feature | UI | datos de producto

**Descripción**: Se agregaron nuevas tarjetas de productos para las categorías `Colaciones` y `Especialidades` en el catálogo, con datos de producto actualizados y recursos de imagen locales cuando fue necesario.

**Impacto**:
- Añadidos los productos de `Colaciones`: `Colación de Pollo`, `Colación de Carne`, y `Milanesa` en `src/store/useStore.ts`.
- Añadidos los productos de `Especialidades`: `Chorrillana` y `HandRoll` en `src/store/useStore.ts`.
- Se creó una imagen local en `public/images/colacion-pollo.svg` para evitar la falla de carga de la imagen remota de la `Colación de Pollo`.
- Se añadieron imágenes locales de soporte en `public/images/chorrillana.svg` y `public/images/handroll.svg` para garantizar una experiencia de catálogo estable.
- Se eliminó el enlace de navegación `Mi Club` del menú principal en `src/components/features/Header.tsx`, dejando el acceso a `Mi Club` disponible únicamente mediante el icono de perfil.

**Decisiones tomadas**:
- Registrar siempre cambios significativos de producto y recursos visuales directamente en `prd.md`.
- Priorizar imágenes locales cuando la dependencia de recursos remotos genera fallos de carga en el catálogo.
- Mantener la interfaz de navegación limpia quitando enlaces duplicados cuando ya existe un acceso directo equivalente vía icono.
