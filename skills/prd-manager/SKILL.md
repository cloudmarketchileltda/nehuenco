---
name: prd-manager
description: Gestiona el archivo prd.md siguiendo la Regla #16. Se activa al finalizar una tarea relevante para documentar cambios de arquitectura, nuevas funcionalidades, decisiones técnicas o cambios en dependencias.
---

# PRD Manager (Product Requirements & Decisions)

Esta skill asegura que el historial del producto sea una "fuente de verdad" actualizada, permitiendo que cualquier desarrollador entienda la evolución del sistema.

## Instrucciones Paso a Paso

### 1. Evaluación de Relevancia
Al finalizar una tarea, pregúntate:
- ¿Es una nueva funcionalidad?
- ¿Cambió la arquitectura o la base de datos?
- ¿Se tomó una decisión técnica importante?
- ¿Se añadió/actualizó una dependencia mayor?
*Si la respuesta es Sí a cualquiera, esta skill DEBE ejecutarse.* (No documentar correcciones de typos o ajustes menores de estilo).

### 2. Generación del Contenido
Genera una entrada siguiendo este formato exacto:

```markdown
## [Título del cambio] — YYYY-MM-DD

**Tipo**: [feature | fix | refactor | arquitectura | dependencia | decisión técnica]

**Descripción**: [Qué se cambió y qué problema resuelve]

**Impacto**: [Qué partes del sistema se ven afectadas]

**Decisiones tomadas**: [Por qué se eligió este enfoque sobre otros]
```

### 3. Actualización del Archivo
- Verifica si existe `prd.md` en la raíz. Si no existe, créalo con un encabezado descriptivo.
- Añade la nueva entrada al final del archivo (o al principio si se prefiere orden cronológico inverso, según convenga al proyecto).

## Árbol de Decisión para el Agente
- **Si** el cambio es solo visual (CSS menor) -> Ignorar la actualización del PRD.
- **Si** se añade una nueva tabla en Supabase -> Obligatorio documentar en PRD indicando la estructura y políticas RLS.
- **Si** se cambia el puerto de desarrollo o Docker -> Obligatorio documentar como cambio de arquitectura/configuración.

## Checklist de Revisión del PRD
- [ ] **Claridad**: ¿La descripción es entendible para alguien que no conoce el código?
- [ ] **Contexto**: ¿Se explica el "por qué" y no solo el "qué"?
- [ ] **Formato**: ¿Se respetan los encabezados H2 y las negritas requeridas?
- [ ] **Fecha**: ¿La fecha es correcta (ISO 8601 recomendado o YYYY-MM-DD)?
