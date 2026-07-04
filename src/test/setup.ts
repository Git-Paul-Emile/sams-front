import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// recharts' <ResponsiveContainer> mesure son conteneur via ResizeObserver, absent de jsdom.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error -- polyfill de test, pas une implémentation conforme au DOM.
globalThis.ResizeObserver = ResizeObserverStub;
