export interface TemplateDefinition {
  id: string;
  name: string;
  isPremium: boolean;
}

/**
 * Server-side source of truth for which templates exist and whether they're
 * premium. Renderer components are added per template in a later build
 * step; for now this registry backs template selection and the publish
 * guard (CLAUDE.md §6 — never trust templateId/premium status from the
 * client).
 */
export const TEMPLATES: TemplateDefinition[] = [
  { id: "classic", name: "Classic", isPremium: false },
  { id: "modern", name: "Modern", isPremium: false },
  { id: "floral", name: "Floral", isPremium: false },
  { id: "gold-foil", name: "Gold Foil", isPremium: true },
];

export function getTemplate(templateId: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === templateId);
}

export function isValidTemplateId(templateId: string): boolean {
  return getTemplate(templateId) !== undefined;
}
