"use client";

import { useEffect, useRef } from "react";
import { persistedWorkspaceSchema } from "../lib/workspace-draft-schema";
import { validateWorkspaceItems } from "../lib/placement";
import { useWorkspaceStore } from "../lib/workspace-store";

const DRAFT_KEY = "worbee.workspace.v1";

export function useDraftPersistence(): void {
  const items = useWorkspaceStore((state) => state.items);
  const restoreItems = useWorkspaceStore((state) => state.restoreItems);
  const setPersistenceMessage = useWorkspaceStore(
    (state) => state.setPersistenceMessage,
  );
  const hydrationComplete = useRef(false);
  const initialPersistSkipped = useRef(false);
  const canPersist = useRef(true);

  useEffect(() => {
    try {
      const storedDraft = window.localStorage.getItem(DRAFT_KEY);
      if (storedDraft) {
        const parsedJson: unknown = JSON.parse(storedDraft);
        const parsedDraft = persistedWorkspaceSchema.safeParse(parsedJson);

        if (
          !parsedDraft.success ||
          !validateWorkspaceItems(parsedDraft.data.items)
        ) {
          canPersist.current = false;
          setPersistenceMessage(
            "A saved workspace could not be read. Your new setup will not replace that saved copy.",
          );
          hydrationComplete.current = true;
          return;
        }

        restoreItems(parsedDraft.data.items);
      }
    } catch {
      canPersist.current = false;
      setPersistenceMessage(
        "Browser storage is unavailable. Your setup will work until you leave this page.",
      );
    }

    hydrationComplete.current = true;
  }, [restoreItems, setPersistenceMessage]);

  useEffect(() => {
    if (!initialPersistSkipped.current) {
      initialPersistSkipped.current = true;
      return;
    }

    if (!hydrationComplete.current || !canPersist.current) {
      return;
    }

    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ version: 1, items }),
      );
      setPersistenceMessage("");
    } catch {
      canPersist.current = false;
      setPersistenceMessage(
        "Your workspace is ready, but this browser could not save it.",
      );
    }
  }, [items, setPersistenceMessage]);
}
