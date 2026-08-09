/**
 * Public surface of the "Our Value" section.
 *
 * Callers mount `ValuesSection`; the parts below it are exported because the
 * column, the card and the figure are each reusable on their own, but nothing
 * outside this folder needs `ValuesAnimations` or `ValuesBackground`.
 */
export { ValuesSection } from './ValuesSection';
export { ValuesHeader } from './ValuesHeader';
export { ValuesGrid } from './ValuesGrid';
export { ValueCard } from './ValueCard';
export { ValueItem } from './ValueItem';
export { ValueGlyph } from './ValueGlyph';
