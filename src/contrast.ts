// The measuring tool behind RULES.md section 4: every color pair carries a measured ratio,
// and the tests recompute it from the hex on every run. A ratio nobody recomputes is a claim.

/** WCAG 2.x relative luminance of a `#rrggbb` color, 0 (black) to 1 (white). */
export function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const channel = (index: number): number => {
    const raw = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16) / 255;
    return raw <= 0.03928 ? raw / 12.92 : ((raw + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

/** WCAG contrast ratio between two `#rrggbb` colors, 1 (identical) to 21 (black on white). */
export function contrast(a: string, b: string): number {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
