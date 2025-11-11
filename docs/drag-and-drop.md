# Drag & Drop System - Dokumentation

## Übersicht

Das Drag & Drop System ermöglicht es Benutzern, Blöcke aus der Sidebar in den Canvas zu ziehen, um interaktive Marketing Boards zu erstellen. Das System basiert auf `@dnd-kit/core` und ist vollständig typisiert mit TypeScript.

## Architektur

### Komponenten-Hierarchie

```
App (page.tsx)
└── DndContext (umschließt Sidebar + Canvas)
    ├── AppSidebar
    │   └── NavBlocks (Draggable Items)
    └── Canvas
        └── DropArea (Droppable Zone)
```

### State Management

- **Zustand Store** (`lib/stores/canvas-store.ts`): Verwaltet Canvas-State (Blöcke, selektierte Blöcke, Drop-Area Sichtbarkeit)
- **TanStack Query**: Verwaltet Server-State (Boards aus AppWrite)
- **AppWrite**: Persistierung der Board-Daten

## Datenfluss

### 1. Drag Start (Sidebar)

```typescript
// components/sidebar/nav-blocks.tsx
const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
  id: "block-text", // Eindeutige ID für das draggable Element
  data: {
    type: "text", // Block-Typ
    data: { content: "" }, // Block-spezifische Daten
  },
});
```

**Wichtig:**
- `id`: Muss eindeutig sein, wird verwendet um das Element zu identifizieren
- `data.type`: Muss ein gültiger `BlockType` sein (siehe `lib/types/board.ts`)
- `data.data`: Block-spezifische Daten als Objekt

### 2. Drag End (Canvas)

```typescript
// app/page.tsx
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (over?.id === "canvas-drop-area") {
    // Validierung der Block-Daten
    // Erstellung eines neuen Blocks
    // Hinzufügen zum Store
  }
};
```

**Event-Struktur:**
- `active`: Das gezogene Element (enthält `id` und `data.current`)
- `over`: Das Element über dem gedroppt wird (null wenn nicht über Drop-Zone)
- `active.data.current`: Die Daten die beim Drag Start gesetzt wurden

### 3. Block-Erstellung

```typescript
const newBlock: Block = {
  id: ID.unique(), // AppWrite ID Generator
  type: validatedType, // Validierter Block-Typ
  data: validatedData, // Validierte Block-Daten
};

addBlock(newBlock); // Hinzufügen zum Zustand Store
```

## Block-Typen

### Aktuell unterstützte Typen

```typescript
type BlockType =
  | "text"        // ✅ Implementiert
  | "heading"     // ⏳ Geplant
  | "image"       // ⏳ Geplant
  | "button"      // ⏳ Geplant
  | "spacer"      // ⏳ Geplant
  | "video"       // ⏳ Geplant
  | "form"        // ⏳ Geplant
  | "pricing"     // ⏳ Geplant
  | "testimonial" // ⏳ Geplant
  | "accordion"   // ⏳ Geplant
  | "code";       // ⏳ Geplant
```

### Block-Struktur

```typescript
interface Block {
  id: string;                    // Eindeutige ID (UUID)
  type: BlockType;               // Block-Typ
  data: Record<string, unknown>;  // Block-spezifische Daten
  position?: {                   // Optional: Position im Grid
    x: number;
    y: number;
  };
  size?: {                       // Optional: Größe im Grid
    width: number;
    height: number;
  };
}
```

## Neue Blöcke hinzufügen

### Schritt 1: Block-Typ definieren

Falls noch nicht vorhanden, füge den neuen Block-Typ zu `lib/types/board.ts` hinzu:

```typescript
export type BlockType =
  | "text"
  | "heading"
  | "image"
  // ... neuer Typ
  | "new-block-type";
```

### Schritt 2: Draggable Item in Sidebar hinzufügen

In `components/sidebar/nav-blocks.tsx`:

```typescript
const blocks = [
  {
    id: "block-text",
    title: "Text",
    icon: Type,
    blockType: "text",
    blockData: { content: "" },
  },
  // Neuer Block
  {
    id: "block-heading",
    title: "Überschrift",
    icon: Heading, // Lucide Icon importieren
    blockType: "heading",
    blockData: {
      level: 1, // h1, h2, h3, etc.
      content: "",
    },
  },
];
```

### Schritt 3: Block-Validierung erweitern

In `app/page.tsx` - `VALID_BLOCK_TYPES` Array erweitern:

```typescript
const VALID_BLOCK_TYPES: BlockType[] = [
  "text",
  "heading", // Neuer Typ hinzufügen
  // ...
] as const;
```

### Schritt 4: Block-Renderer erstellen

Erstelle eine neue Komponente für die Darstellung des Blocks im Canvas:

```typescript
// app/components/blocks/HeadingBlock.tsx
"use client";

interface HeadingBlockProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function HeadingBlock({ block, isSelected, onSelect }: HeadingBlockProps) {
  const level = (block.data.level as number) || 1;
  const content = (block.data.content as string) || "";

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-4 border rounded-lg",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <HeadingTag>{content}</HeadingTag>
    </div>
  );
}
```

### Schritt 5: Block im Canvas rendern

In `app/components/Canvas.tsx`:

```typescript
{blocks.map((block) => {
  switch (block.type) {
    case "text":
      return <TextBlock key={block.id} block={block} />;
    case "heading":
      return <HeadingBlock key={block.id} block={block} />;
    // ...
    default:
      return <DefaultBlock key={block.id} block={block} />;
  }
})}
```

## Best Practices

### 1. Block-Daten-Struktur

**Gut:**
```typescript
blockData: {
  content: "Textinhalt",
  fontSize: 16,
  color: "#000000",
}
```

**Schlecht:**
```typescript
blockData: {
  text: "Textinhalt", // Inkonsistente Namensgebung
  style: { fontSize: 16 }, // Verschachtelte Strukturen vermeiden
}
```

### 2. Validierung

Immer Runtime-Validierung im `handleDragEnd` Handler durchführen:

```typescript
// ✅ Gut: Validierung mit Fallback
let validatedType: BlockType = "text";
if (typeof current.type === "string" &&
    VALID_BLOCK_TYPES.includes(current.type as BlockType)) {
  validatedType = current.type as BlockType;
} else {
  console.warn(`Invalid block type "${current.type}", defaulting to "text"`);
}
```

### 3. ID-Verwaltung

- **Draggable Items**: Statische IDs (z.B. `"block-text"`)
- **Canvas Blöcke**: Dynamische IDs mit `ID.unique()` (AppWrite)

### 4. State Management

- **Zustand Store**: Für UI-State (Blöcke, Selektion)
- **TanStack Query**: Für Server-State (Board-Daten)
- **Nicht**: Server-State im Zustand Store speichern

## Drop-Area Verhalten

### Sichtbarkeit

Die Drop-Area wird automatisch versteckt wenn:
- Blöcke vorhanden sind (`blocks.length > 0`)
- Ein Board geladen wird mit vorhandenen Blöcken

Die Drop-Area wird angezeigt wenn:
- Keine Blöcke vorhanden sind
- Ein neues Board erstellt wird

### Visuelles Feedback

- **Normal**: Gestrichelter Border, muted Hintergrund
- **Hover**: Border wird dunkler, Hintergrund wird heller
- **isOver**: Border wird primary, Hintergrund wird primary/10, leichtes Scale

## Nächste Schritte

### Phase 1: Basis-Blöcke (MVP)

- [x] Text-Block (draggable)
- [ ] Text-Block Rendering mit ProseKit
- [ ] Heading-Block
- [ ] Image-Block
- [ ] Button-Block
- [ ] Spacer-Block

### Phase 2: Grid-System

- [ ] Grid-Layout implementieren (max. 4 Spalten)
- [ ] Block-Positionierung im Grid
- [ ] Block-Größe (width, height)
- [ ] Drag & Drop innerhalb des Grids (Sortierung)

### Phase 3: Block-Interaktionen

- [ ] Block-Selektion
- [ ] Block-Bearbeitung (Inline-Editing)
- [ ] Property Panel für Block-Einstellungen
- [ ] Block-Löschen
- [ ] Block-Duplizieren

### Phase 4: Premium-Blöcke

- [ ] Video-Block (YouTube/Vimeo)
- [ ] Form-Block
- [ ] Pricing-Table-Block
- [ ] Testimonial-Block
- [ ] Accordion-Block
- [ ] Code-Block

## Fehlerbehandlung

### Häufige Fehler

1. **"Invalid drag event: active.data.current is missing"**
   - Ursache: `useDraggable` wurde ohne `data` Property aufgerufen
   - Lösung: Stelle sicher, dass `data` immer gesetzt ist

2. **"Invalid block type"**
   - Ursache: Block-Typ ist nicht in `VALID_BLOCK_TYPES` enthalten
   - Lösung: Füge den Typ zu `VALID_BLOCK_TYPES` hinzu

3. **Block wird nicht angezeigt**
   - Ursache: Block-Renderer fehlt oder Block-Typ wird nicht erkannt
   - Lösung: Prüfe `Canvas.tsx` Switch-Statement

## Code-Beispiele

### Minimaler Block-Implementierung

```typescript
// 1. Sidebar Item
{
  id: "block-example",
  title: "Beispiel",
  icon: ExampleIcon,
  blockType: "example",
  blockData: { value: "default" },
}

// 2. Block-Renderer
export function ExampleBlock({ block }: { block: Block }) {
  const value = (block.data.value as string) || "";
  return <div>{value}</div>;
}

// 3. Canvas Integration
case "example":
  return <ExampleBlock key={block.id} block={block} />;
```

## Testing

### Manuelle Tests

1. **Drag & Drop Test**
   - Ziehe Block aus Sidebar
   - Prüfe visuelles Feedback während Drag
   - Drop auf Drop-Area
   - Prüfe ob Block erstellt wurde

2. **Validierung Test**
   - Versuche ungültigen Block-Typ zu droppen
   - Prüfe Console-Warnings
   - Prüfe ob Default-Wert verwendet wird

3. **State Test**
   - Prüfe ob Drop-Area verschwindet nach erstem Block
   - Prüfe ob alle Blöcke im Store sind
   - Prüfe Board-Speicherung

## Performance

### Optimierungen

- **Memoization**: Block-Renderer mit `React.memo` wrappen
- **Lazy Loading**: Block-Komponenten dynamisch importieren
- **Virtualization**: Für viele Blöcke (später)

## Referenzen

- [@dnd-kit Dokumentation](https://docs.dndkit.com/)
- [Zustand Dokumentation](https://zustand-demo.pmnd.rs/)
- [TanStack Query Dokumentation](https://tanstack.com/query/latest)
- [AppWrite Dokumentation](https://appwrite.io/docs)

---

**Letzte Aktualisierung**: 2024-01-XX
**Status**: In Entwicklung
**Version**: 0.1.0
