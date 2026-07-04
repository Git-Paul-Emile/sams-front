import { Construction } from "lucide-react";

// Provisoire : rendu tant qu'une feature/page n'a pas encore été construite
// pendant la migration progressive vers l'architecture feature-sliced.
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-24">
      <Construction className="w-8 h-8 text-muted-foreground mb-3" />
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">Module en cours de migration.</p>
    </div>
  );
}
