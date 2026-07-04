import { useState } from "react";
import { AchatsOverview, NewAchatModal, AchatDetailModal } from "../features/achats";
import type { Achat } from "../types/achats.types";

export function AchatsPage() {
  const [showNew, setShowNew] = useState(false);
  const [viewed, setViewed] = useState<Achat | null>(null);

  return (
    <div>
      <AchatsOverview onNew={() => setShowNew(true)} onView={(a) => setViewed(a)} />
      {showNew && <NewAchatModal onClose={() => setShowNew(false)} />}
      {viewed && <AchatDetailModal achat={viewed} onClose={() => setViewed(null)} />}
    </div>
  );
}
