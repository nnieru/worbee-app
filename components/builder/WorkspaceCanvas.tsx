"use client";

import Image from "next/image";
import type { PointerEvent, RefObject } from "react";
import { getProduct } from "../../lib/catalog";
import { CANVAS_HEIGHT, CANVAS_WIDTH, getSceneDepth } from "../../lib/placement";
import { useWorkspaceStore } from "../../lib/workspace-store";
import type { PlacedItem } from "../../types/workspace";
import type { DragPreview } from "../../hooks/useWorkspaceDrag";

interface WorkspaceCanvasProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  items: PlacedItem[];
  preview: DragPreview | null;
  onItemPointerDown: (
    instanceId: string,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
}

export function WorkspaceCanvas({
  canvasRef,
  items,
  preview,
  onItemPointerDown,
}: WorkspaceCanvasProps) {
  const selectedItemId = useWorkspaceStore((state) => state.selectedItemId);
  const selectItem = useWorkspaceStore((state) => state.selectItem);
  const placeProduct = useWorkspaceStore((state) => state.placeProduct);
  const removeItem = useWorkspaceStore((state) => state.removeItem);
  const statusMessage = useWorkspaceStore((state) => state.statusMessage);

  const hasDesk = items.some((item) => getProduct(item.productId).category === "desk");
  const monitorCount = items.filter((item) => item.productId === "monitor").length;
  const hasFloorPlant = items.some((item) => item.productId === "plant-floor");
  const selectedItem = items.find((item) => item.instanceId === selectedItemId);
  const renderItems = [...items].sort(
    (a, b) => getSceneDepth(a, items) - getSceneDepth(b, items),
  );

  return (
    <section className="workspace-panel" aria-labelledby="workspace-title">
      <div className="workspace-toolbar">
        <div>
          <span className="eyebrow">Live preview</span>
          <h2 id="workspace-title">Your workspace</h2>
        </div>
        <span className="canvas-dimensions">DESIGN IN 2D</span>
      </div>

      <div
        ref={canvasRef}
        className="workspace-canvas"
        aria-label="Interactive workspace preview. Drag items here to place them."
        data-workspace-canvas="true"
      >
        <div className="canvas-wall" aria-hidden="true">
          <span className="wall-sunlight" />
          <span className="wall-frame" />
          <span className="wall-sill" />
        </div>
        <div className="canvas-ground" aria-hidden="true">
          <span className="ground-rug" />
          <span className="ground-shadow ground-shadow-left" />
          <span className="ground-shadow ground-shadow-right" />
        </div>
        <div className="scene-caption" aria-hidden="true">
          <span>ROOM STUDY</span>
          <span>01 / 01</span>
        </div>

        {renderItems.map((item) => {
          const product = getProduct(item.productId);
          const isSelected = item.instanceId === selectedItemId;
          return (
            <button
              key={item.instanceId}
              type="button"
              className={`scene-item${isSelected ? " is-active" : ""}`}
              style={{
                left: `${(item.x / CANVAS_WIDTH) * 100}%`,
                top: `${(item.y / CANVAS_HEIGHT) * 100}%`,
                width: `${(product.sprite.renderWidth / CANVAS_WIDTH) * 100}%`,
                aspectRatio: `${product.sprite.width} / ${product.sprite.height}`,
                transform: `translate(-${product.sprite.anchor.x * 100}%, -${product.sprite.anchor.y * 100}%)`,
                zIndex: 10 + Math.round(getSceneDepth(item, items)),
              }}
              onPointerDown={(event) => onItemPointerDown(item.instanceId, event)}
              onClick={() => selectItem(item.instanceId)}
              aria-label={`Select ${product.name}`}
              aria-pressed={isSelected}
            >
              <Image
                src={product.sprite.src}
                alt=""
                fill
                sizes="(max-width: 760px) 46vw, 32vw"
                className="scene-item-image"
              />
            </button>
          );
        })}

        {!items.length && (
          <div className="canvas-empty-state">
            <span className="empty-state-icon" aria-hidden="true">✳</span>
            <p>Start with a desk</p>
            <span>Then make the space your own.</span>
          </div>
        )}

        {preview && (
          <div
            className={`drag-placement-preview${preview.valid ? " is-valid" : " is-invalid"}`}
            style={{
              left: `${(preview.x / CANVAS_WIDTH) * 100}%`,
              top: `${(preview.y / CANVAS_HEIGHT) * 100}%`,
              width: `${(getProduct(preview.productId).sprite.renderWidth / CANVAS_WIDTH) * 100}%`,
              aspectRatio: `${getProduct(preview.productId).sprite.width} / ${getProduct(preview.productId).sprite.height}`,
              transform: `translate(-${getProduct(preview.productId).sprite.anchor.x * 100}%, -${getProduct(preview.productId).sprite.anchor.y * 100}%)`,
            }}
            aria-hidden="true"
          >
            <Image
              src={getProduct(preview.productId).sprite.src}
              alt=""
              fill
              sizes="(max-width: 760px) 46vw, 32vw"
              className="scene-item-image"
            />
          </div>
        )}

        {hasDesk && monitorCount < 2 && (
          <button
            type="button"
            className="scene-hotspot hotspot-monitor"
            onClick={() => placeProduct("monitor")}
          >
            <span aria-hidden="true">＋</span>
            {monitorCount ? "Add another monitor" : "Add a monitor"}
          </button>
        )}
        {!hasFloorPlant && (
          <button
            type="button"
            className="scene-hotspot hotspot-plant"
            onClick={() => placeProduct("plant-floor")}
          >
            <span aria-hidden="true">＋</span>
            Place a plant
          </button>
        )}
      </div>

      <div className="canvas-feedback" aria-live="polite" aria-atomic="true">
        <span className="feedback-dot" aria-hidden="true" />
        <span>{statusMessage}</span>
      </div>

      {selectedItem && (
        <div className="selection-toolbar">
          <div>
            <span className="eyebrow">Selected piece</span>
            <strong>{getProduct(selectedItem.productId).name}</strong>
            <span>Drag it to rearrange or remove it from the setup.</span>
          </div>
          <button
            type="button"
            className="button button-quiet button-remove"
            onClick={() => removeItem(selectedItem.instanceId)}
          >
            Remove item
          </button>
        </div>
      )}
    </section>
  );
}
