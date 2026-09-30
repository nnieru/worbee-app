"use client";

import Link from "next/link";
import { useRef } from "react";
import { useWorkspaceDrag } from "../../hooks/useWorkspaceDrag";
import { useWorkspaceStore } from "../../lib/workspace-store";
import { ProductTray } from "./ProductTray";
import { SetupSummary } from "./SetupSummary";
import { WorkspaceCanvas } from "./WorkspaceCanvas";

export function WorkspaceBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const items = useWorkspaceStore((state) => state.items);
  const reset = useWorkspaceStore((state) => state.reset);
  const surpriseMe = useWorkspaceStore((state) => state.surpriseMe);
  const persistenceMessage = useWorkspaceStore((state) => state.persistenceMessage);
  const { preview, startProductDrag, startItemDrag } = useWorkspaceDrag(canvasRef, items);

  return (
    <main className="builder-shell">
      <header className="app-header">
        <Link href="/" className="wordmark" aria-label="Worbee home">
          <span className="wordmark-icon" aria-hidden="true">w</span>
          <span>Worbee</span>
        </Link>
        <div className="header-center">
          <span className="header-dot" aria-hidden="true" />
          A workspace, made yours
        </div>
        <div className="header-actions">
          <span className={`save-indicator${persistenceMessage ? " has-warning" : ""}`}>
            <span aria-hidden="true">{persistenceMessage ? "!" : "✓"}</span>
            {persistenceMessage ? "Save unavailable" : "Saved on this device"}
          </span>
          {items.length ? (
            <Link href="/checkout" className="button button-dark header-review">
              Review setup <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <button type="button" className="button button-dark header-review" disabled>
              Review setup
            </button>
          )}
        </div>
      </header>

      {persistenceMessage && (
        <p className="persistence-notice" role="status">{persistenceMessage}</p>
      )}

      <section className="builder-intro" aria-labelledby="builder-title">
        <div>
          <span className="eyebrow">A better workday starts with a good setup</span>
          <h1 id="builder-title">Make room for good work.</h1>
          <p>Choose your pieces and see the workspace come together as you go.</p>
        </div>
        <div className="builder-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={reset}
            disabled={!items.length}
          >
            Reset
          </button>
          <button type="button" className="button button-quiet surprise-button" onClick={surpriseMe}>
            <span aria-hidden="true">✳</span> Surprise me
          </button>
        </div>
      </section>

      <div className="builder-layout">
        <ProductTray items={items} onProductDragStart={startProductDrag} />
        <WorkspaceCanvas
          canvasRef={canvasRef}
          items={items}
          preview={preview}
          onItemPointerDown={startItemDrag}
        />
        <SetupSummary items={items} />
      </div>

      <footer className="builder-footer">
        <span>Thoughtful pieces. Flexible plans.</span>
        <span>Choose what works for you, change it as you go.</span>
      </footer>
    </main>
  );
}
