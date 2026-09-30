import { describe, expect, it } from "vitest";
import { clientPointToCanvas, evaluatePlacement } from "./placement";
import type { PlacedItem } from "../types/workspace";

const desk: PlacedItem = {
  instanceId: "desk-a",
  productId: "desk-compact",
  x: 600,
  y: 470,
  surface: "floor",
};

describe("evaluatePlacement", () => {
  it("requires a desk before placing desk accessories", () => {
    const result = evaluatePlacement("monitor", []);

    expect(result).toMatchObject({
      valid: false,
      message: "Choose a desk before adding desktop accessories.",
    });
  });

  it("places two monitors on the desk and enforces the product limit", () => {
    const first = evaluatePlacement("monitor", [desk]);
    expect(first).toMatchObject({ valid: true, surface: "desk:desk-a" });
    if (!first.valid) return;

    const firstMonitor: PlacedItem = {
      instanceId: "monitor-a",
      productId: "monitor",
      x: first.x,
      y: first.y,
      surface: first.surface,
    };
    const second = evaluatePlacement("monitor", [desk, firstMonitor]);
    expect(second).toMatchObject({ valid: true, surface: "desk:desk-a" });
    if (!second.valid) return;

    const secondMonitor: PlacedItem = {
      instanceId: "monitor-b",
      productId: "monitor",
      x: second.x,
      y: second.y,
      surface: second.surface,
    };
    expect(evaluatePlacement("monitor", [desk, firstMonitor, secondMonitor])).toMatchObject({
      valid: false,
      message: "You can add up to two monitors.",
    });
  });

  it("rejects a placement outside the workspace", () => {
    expect(evaluatePlacement("plant-floor", [], { x: 5, y: 5 })).toMatchObject({
      valid: false,
      message: "Keep the item inside the workspace.",
    });
  });

  it("rejects overlapping furniture", () => {
    expect(evaluatePlacement("chair-task", [desk], { x: desk.x, y: desk.y })).toMatchObject({
      valid: false,
      message: "That spot is occupied. Try another place.",
    });
  });

  it("converts pointer pixels into snapped canvas coordinates", () => {
    expect(
      clientPointToCanvas(170.4, 175.6, {
        left: 50,
        top: 100,
        width: 600,
        height: 380,
      }),
    ).toEqual({ x: 240, y: 160 });
  });
});
