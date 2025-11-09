"use client";

export default function Canvas() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            Canvas
          </h2>
          <p className="text-sm text-muted-foreground">
            Hier wird der Builder-Canvas erscheinen
          </p>
        </div>
      </div>
    </div>
  );
}
