"use client";

import { useDraftPersistence } from "../../hooks/useDraftPersistence";

export function WorkspaceDraftSync() {
  useDraftPersistence();
  return null;
}
