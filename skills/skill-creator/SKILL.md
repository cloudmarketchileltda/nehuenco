---
name: skill-creator
description: Ayuda a crear nuevas skills para el agente Antigravity siguiendo las mejores prácticas y estructura oficial. Se activa cuando el usuario pide crear una nueva skill, instruir al agente sobre cómo hacer algo nuevo, o documentar un flujo de trabajo para el agente.
---

# Skill Creator

Esta skill te guía paso a paso en la creación de nuevas skills para el agente Antigravity. Las skills son paquetes de conocimiento que el agente usa para saber cómo realizar tareas específicas.

## Reglas y Convenciones

Toda nueva skill que crees debe cumplir obligatoriamente con las siguientes reglas (extraídas de la documentación oficial de Antigravity):
1. **Ubicación:** Debe guardarse en `.agents/skills/<nombre-de-la-skill>/`.
2. **Archivo Principal:** Debe existir un archivo `SKILL.md` en esa carpeta.
3. **Frontmatter YAML:** El `SKILL.md` debe empezar con `name` y `description`. La descripción es **crucial** porque el agente la lee durante el proceso de "Discovery" para saber si debe usar esta skill.
4. **Estructura Opcional:** Puedes crear carpetas adicionales como `scripts/` (para lógica compleja), `examples/` (para referencias) y `resources/` (para assets).
5. **Enfoque:** La skill debe tener un solo propósito o dominio específico.
6. **Lógica Explicita:** Usa lógica condicional clara (if/then) para guiar al agente en diferentes escenarios.

## Pasos para crear una nueva skill

### Paso 1: Recopilación de Contexto
Si el usuario te pide crear una skill pero no da detalles suficientes, pregúntale:
- ¿Qué nombre le daremos a la skill? (Formato recomendado: `kebab-case`)
- ¿Cuál es la descripción corta y exacta de cuándo debo usar esta skill?
- ¿Cuáles son los pasos específicos, reglas o checklist que debo seguir cuando use esta skill?

### Paso 2: Generación de la Estructura
Usa la herramienta `write_to_file` para crear el archivo `.agents/skills/<nombre-de-la-skill>/SKILL.md`.

Aquí tienes la plantilla obligatoria que debes usar como punto de partida:

```markdown
---
name: [nombre-de-la-skill]
description: [Descripción concisa que el agente leerá para saber cuándo activar la skill]
---

# [Título de la Skill]

## Contexto
[Explicación breve de lo que hace la skill]

## Instrucciones y Árboles de Decisión
[Instrucciones paso a paso de lo que el agente debe hacer. Usa condicionales como "Si X, entonces haz Y"]

## Interacción con Scripts (Si aplica)
[Si hay scripts complejos en la carpeta `scripts/`, explica aquí cómo llamarlos y qué entradas/salidas tienen]

## Checklist de Revisión
Antes de terminar la tarea al usar esta skill, verifica:
- [ ] **Correctness**: ¿La solución funciona y cumple con el objetivo?
- [ ] **Edge cases**: ¿Se probaron caminos alternativos o posibles errores?
- [ ] **Style**: ¿Se respetó el estilo de código y la arquitectura del proyecto?
- [ ] **Performance**: ¿Hay algún problema evidente de rendimiento?
```

### Paso 3: Revisión y Sugerencias
Una vez creada la skill, informa al usuario y recuérdale que si la skill involucra tareas muy complejas que requieran llamadas al sistema o ejecución repetitiva, puede crear scripts en `.agents/skills/<nombre-de-la-skill>/scripts/` para que el agente los use como "cajas negras".
