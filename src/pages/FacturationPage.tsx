import { useState } from "react";
import { FacturationOverview, NewFactureModal } from "../features/facturation";

export function FacturationPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <FacturationOverview onNew={() => setShowNew(true)} />
      {showNew && <NewFactureModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
