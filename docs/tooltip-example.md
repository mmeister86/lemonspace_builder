# Tooltip Usage

Die Tooltip-Komponente verwendet Radix UI unter der Haube. Um Tooltips zu verwenden, muss die App einmalig mit `TooltipProvider` gewrappt werden.

## Setup

Wrappe deine App im Root Layout mit `TooltipProvider`:

```tsx
// app/layout.tsx
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
```

## Verwendung

Nachdem `TooltipProvider` einmalig im Root Layout gesetzt wurde, kannst du Tooltips überall in deiner App verwenden:

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Dies ist ein Tooltip</p>
      </TooltipContent>
    </Tooltip>
  )
}
```

## Wichtig

- **Nicht** jeden Tooltip mit `TooltipProvider` wrappen - das führt zu verschachtelten Providern
- `TooltipProvider` sollte **nur einmal** im Root Layout verwendet werden
- Alle Tooltips teilen sich die Konfiguration vom Root-Provider (z.B. `delayDuration`)
