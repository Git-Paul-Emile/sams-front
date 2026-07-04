import type { TimelineEvent } from "../../types/ventes.types";
import { Check } from "lucide-react";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="flex flex-col">
      {events.map((ev, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 z-10"><Check className="w-3.5 h-3.5 text-white" /></div>
            {i < events.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 my-1" />}
          </div>
          <div className={i < events.length - 1 ? "pb-4" : ""}>
            <p className="text-sm font-semibold text-foreground">{ev.etat}</p>
            <p className="text-xs text-muted-foreground">{ev.date} · {ev.user}</p>
            {ev.commentaire && <p className="text-xs text-muted-foreground/70 italic mt-0.5">"{ev.commentaire}"</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
