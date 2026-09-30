"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import {
  clientPointToCanvas,
  evaluatePlacement,
  type CanvasPoint,
} from "../lib/placement";
import { useWorkspaceStore } from "../lib/workspace-store";
import type { ProductId } from "../types/catalog";
import type { PlacedItem } from "../types/workspace";

interface DragSession {
  productId: ProductId;
  movingInstanceId: string | null;
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
}

export interface DragPreview extends CanvasPoint {
  productId: ProductId;
  valid: boolean;
}

export function useWorkspaceDrag(
  canvasRef: RefObject<HTMLDivElement | null>,
  items: PlacedItem[],
) {
  const [preview, setPreview] = useState<DragPreview | null>(null);
  const session = useRef<DragSession | null>(null);
  const setStatusMessage = useWorkspaceStore((state) => state.setStatusMessage);

  const startProductDrag = useCallback(
    (productId: ProductId, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      session.current = {
        productId,
        movingInstanceId: null,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
    },
    [],
  );

  const startItemDrag = useCallback(
    (instanceId: string, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      const item = items.find((candidate) => candidate.instanceId === instanceId);
      if (!item) {
        return;
      }

      session.current = {
        productId: item.productId,
        movingInstanceId: instanceId,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
    },
    [items],
  );

  const handlePointerMove = useCallback(
    (event: globalThis.PointerEvent) => {
      const activeSession = session.current;
      if (!activeSession || activeSession.pointerId !== event.pointerId) {
        return;
      }

      if (
        !activeSession.moved &&
        Math.hypot(event.clientX - activeSession.startX, event.clientY - activeSession.startY) < 6
      ) {
        return;
      }

      activeSession.moved = true;
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) {
        setPreview(null);
        return;
      }

      const point = clientPointToCanvas(event.clientX, event.clientY, rect);
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        setPreview(null);
        return;
      }

      const placement = evaluatePlacement(
        activeSession.productId,
        items,
        point,
        activeSession.movingInstanceId ?? undefined,
      );
      setPreview({
        ...point,
        productId: activeSession.productId,
        valid: placement.valid,
      });
    },
    [canvasRef, items],
  );

  const handlePointerUp = useCallback(
    (event: globalThis.PointerEvent) => {
      const activeSession = session.current;
      if (!activeSession || activeSession.pointerId !== event.pointerId) {
        return;
      }

      session.current = null;
      setPreview(null);
      if (!activeSession.moved) {
        return;
      }

      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const isInside =
        rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!rect || !isInside) {
        setStatusMessage("Drop items onto the workspace to place them.");
        return;
      }

      const point = clientPointToCanvas(event.clientX, event.clientY, rect);
      const store = useWorkspaceStore.getState();
      if (activeSession.movingInstanceId) {
        store.moveItem(activeSession.movingInstanceId, point);
      } else {
        store.placeProduct(activeSession.productId, point);
      }
    },
    [canvasRef, setStatusMessage],
  );

  const handlePointerCancel = useCallback((event: globalThis.PointerEvent) => {
    if (session.current?.pointerId === event.pointerId) {
      session.current = null;
      setPreview(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, [handlePointerMove, handlePointerUp, handlePointerCancel]);

  return { preview, startProductDrag, startItemDrag };
}
