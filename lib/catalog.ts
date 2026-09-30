import type { Product, ProductId } from "../types/catalog";

export const PRODUCT_IDS = [
  "desk-compact",
  "desk-wide",
  "chair-task",
  "chair-lounge",
  "monitor",
  "lamp",
  "plant-floor",
  "plant-desk",
  "keyboard-mouse",
  "storage",
] as const satisfies readonly ProductId[];

export const PRODUCTS: Product[] = [
  {
    id: "desk-compact",
    category: "desk",
    name: "Compact oak desk",
    description: "A tidy footprint for focused work.",
    monthlyPrice: 250_000,
    sprite: {
      src: "/assets/sprites/desk-compact.webp",
      width: 1383,
      height: 1137,
      renderWidth: 520,
      anchor: { x: 0.5, y: 0.96 },
    },
    placement: {
      allowedSurfaces: ["floor"],
      footprint: { width: 360, height: 150 },
      maxQuantity: 1,
      deskSurface: { left: -190, top: -340, width: 380, height: 135 },
    },
  },
  {
    id: "desk-wide",
    category: "desk",
    name: "Wide standing desk",
    description: "More room to spread out and shift posture.",
    monthlyPrice: 390_000,
    sprite: {
      src: "/assets/sprites/desk-wide.webp",
      width: 1536,
      height: 1024,
      renderWidth: 580,
      anchor: { x: 0.5, y: 0.94 },
    },
    placement: {
      allowedSurfaces: ["floor"],
      footprint: { width: 430, height: 165 },
      maxQuantity: 1,
      deskSurface: { left: -230, top: -310, width: 460, height: 145 },
    },
  },
  {
    id: "chair-task",
    category: "chair",
    name: "Ergonomic task chair",
    description: "Breathable support for a long workday.",
    monthlyPrice: 180_000,
    sprite: {
      src: "/assets/sprites/chair-task.webp",
      width: 1207,
      height: 1303,
      renderWidth: 250,
      anchor: { x: 0.5, y: 0.98 },
    },
    placement: {
      allowedSurfaces: ["floor"],
      footprint: { width: 145, height: 105 },
      maxQuantity: 1,
    },
  },
  {
    id: "chair-lounge",
    category: "chair",
    name: "Lounge chair",
    description: "A softer seat for slower afternoons.",
    monthlyPrice: 220_000,
    sprite: {
      src: "/assets/sprites/chair-lounge.webp",
      width: 1312,
      height: 1199,
      renderWidth: 260,
      anchor: { x: 0.5, y: 0.96 },
    },
    placement: {
      allowedSurfaces: ["floor"],
      footprint: { width: 175, height: 135 },
      maxQuantity: 1,
    },
  },
  {
    id: "monitor",
    category: "accessory",
    name: "External monitor",
    description: "A clear second screen for your setup.",
    monthlyPrice: 85_000,
    sprite: {
      src: "/assets/sprites/monitor.webp",
      width: 1536,
      height: 1024,
      renderWidth: 168,
      anchor: { x: 0.5, y: 0.91 },
    },
    placement: {
      allowedSurfaces: ["desk"],
      footprint: { width: 115, height: 72 },
      maxQuantity: 2,
    },
  },
  {
    id: "lamp",
    category: "accessory",
    name: "Adjustable desk lamp",
    description: "Warm task lighting with a small footprint.",
    monthlyPrice: 35_000,
    sprite: {
      src: "/assets/sprites/lamp.webp",
      width: 1261,
      height: 1247,
      renderWidth: 115,
      anchor: { x: 0.5, y: 0.95 },
    },
    placement: {
      allowedSurfaces: ["desk"],
      footprint: { width: 70, height: 72 },
      maxQuantity: 1,
    },
  },
  {
    id: "plant-floor",
    category: "accessory",
    name: "Floor plant",
    description: "A little greenery for the corner.",
    monthlyPrice: 28_000,
    sprite: {
      src: "/assets/sprites/plant-floor.webp",
      width: 1145,
      height: 1374,
      renderWidth: 188,
      anchor: { x: 0.5, y: 0.98 },
    },
    placement: {
      allowedSurfaces: ["floor"],
      footprint: { width: 125, height: 105 },
      maxQuantity: 1,
    },
  },
  {
    id: "plant-desk",
    category: "accessory",
    name: "Desk plant",
    description: "A compact green accent for your desktop.",
    monthlyPrice: 18_000,
    sprite: {
      src: "/assets/sprites/plant-desk.webp",
      width: 1312,
      height: 1199,
      renderWidth: 82,
      anchor: { x: 0.5, y: 0.96 },
    },
    placement: {
      allowedSurfaces: ["desk"],
      footprint: { width: 60, height: 56 },
      maxQuantity: 1,
    },
  },
  {
    id: "keyboard-mouse",
    category: "accessory",
    name: "Keyboard + mouse",
    description: "A comfortable wireless pairing.",
    monthlyPrice: 42_000,
    sprite: {
      src: "/assets/sprites/keyboard-mouse.webp",
      width: 1536,
      height: 1024,
      renderWidth: 190,
      anchor: { x: 0.5, y: 0.88 },
    },
    placement: {
      allowedSurfaces: ["desk"],
      footprint: { width: 150, height: 55 },
      maxQuantity: 1,
    },
  },
  {
    id: "storage",
    category: "accessory",
    name: "Rolling storage",
    description: "Keep the essentials close and tucked away.",
    monthlyPrice: 55_000,
    sprite: {
      src: "/assets/sprites/storage.webp",
      width: 1275,
      height: 1234,
      renderWidth: 180,
      anchor: { x: 0.5, y: 0.98 },
    },
    placement: {
      allowedSurfaces: ["floor"],
      footprint: { width: 125, height: 100 },
      maxQuantity: 1,
    },
  },
];

export function getProduct(productId: ProductId): Product {
  const product = PRODUCTS.find((candidate) => candidate.id === productId);

  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }

  return product;
}

export function getProductsByCategory(category: Product["category"]): Product[] {
  return PRODUCTS.filter((product) => product.category === category);
}
