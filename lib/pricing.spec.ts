import { describe, expect, it } from "vitest";
import { formatMonthlyPrice, getWorkspaceSummary } from "./pricing";
import type { PlacedItem } from "../types/workspace";

describe("workspace pricing", () => {
  it("derives quantities and monthly totals from placed products", () => {
    const items: PlacedItem[] = [
      { instanceId: "desk-a", productId: "desk-compact", x: 600, y: 470, surface: "floor" },
      { instanceId: "monitor-a", productId: "monitor", x: 530, y: 160, surface: "desk:desk-a" },
      { instanceId: "monitor-b", productId: "monitor", x: 670, y: 160, surface: "desk:desk-a" },
    ];

    expect(getWorkspaceSummary(items)).toEqual({
      items: [
        {
          productId: "desk-compact",
          name: "Compact oak desk",
          quantity: 1,
          monthlyPrice: 250_000,
          lineTotal: 250_000,
        },
        {
          productId: "monitor",
          name: "External monitor",
          quantity: 2,
          monthlyPrice: 85_000,
          lineTotal: 170_000,
        },
      ],
      itemCount: 3,
      monthlyTotal: 420_000,
    });
  });

  it("formats a total as Indonesian rupiah", () => {
    expect(formatMonthlyPrice(250_000)).toContain("250.000");
  });
});
