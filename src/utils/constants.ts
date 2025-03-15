export const DND_TYPES = {
  INGREDIENT: "ingredient",
  CONSTRUCTOR_ITEM: "constructor_item",
} as const;

export type DndTypes = typeof DND_TYPES;

export const login = "/login";
export const forgotPass = "/forgot-password";
