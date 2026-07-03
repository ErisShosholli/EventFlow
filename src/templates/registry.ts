import type { ComponentType } from "react";
import type { TemplateProps } from "@/templates/types";
import { ClassicTemplate } from "@/templates/classic/ClassicTemplate";
import { ModernTemplate } from "@/templates/modern/ModernTemplate";
import { FloralTemplate } from "@/templates/floral/FloralTemplate";
import { GoldFoilTemplate } from "@/templates/gold-foil/GoldFoilTemplate";

export interface TemplateDefinition {
  id: string;
  name: string;
  isPremium: boolean;
  component: ComponentType<TemplateProps>;
}

/**
 * Server-side source of truth for which templates exist, whether they're
 * premium, and which component renders them. Backs template selection, the
 * invite/preview renderer, and the publish guard (CLAUDE.md §6 — never
 * trust templateId/premium status from the client).
 */
export const TEMPLATES: TemplateDefinition[] = [
  { id: "classic", name: "Classic", isPremium: false, component: ClassicTemplate },
  { id: "modern", name: "Modern", isPremium: false, component: ModernTemplate },
  { id: "floral", name: "Floral", isPremium: false, component: FloralTemplate },
  { id: "gold-foil", name: "Gold Foil", isPremium: true, component: GoldFoilTemplate },
];

export function getTemplate(templateId: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === templateId);
}

export function isValidTemplateId(templateId: string): boolean {
  return getTemplate(templateId) !== undefined;
}
