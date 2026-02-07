import "@testing-library/jest-dom";
import { expect } from "vitest";

// Extend Vitest's expect method with methods from jest-dom
expect.extend({
  // This is handled by the import above, but we need to import it
});
