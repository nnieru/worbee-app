import { z } from "zod";
import { PRODUCT_IDS } from "./catalog";
import type { WorkspaceSurface } from "../types/workspace";

export const placedItemSchema = z
  .object({
    instanceId: z.string().min(1).max(80),
    productId: z.enum(PRODUCT_IDS),
    x: z.number().finite(),
    y: z.number().finite(),
    surface: z.custom<WorkspaceSurface>(
      (value): value is WorkspaceSurface =>
        value === "floor" ||
        (typeof value === "string" && /^desk:.{1,80}$/.test(value)),
      "Choose a valid workspace surface.",
    ),
  })
  .strict();

export const persistedWorkspaceSchema = z
  .object({
    version: z.literal(1),
    items: z.array(placedItemSchema).max(40),
  })
  .strict();
