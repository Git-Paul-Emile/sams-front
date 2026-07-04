import { useState } from "react";
import { VentesOverview, NewCommandeModal } from "../features/ventes";

export function VentesPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <VentesOverview onNew={() => setShowNew(true)} />
      {showNew && <NewCommandeModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
