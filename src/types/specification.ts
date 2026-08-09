/**
 * One annotated component of the PEN system.
 *
 * `spec` is transcribed verbatim from the technical specification in the
 * company's website brief and must not be paraphrased or rounded — the figures
 * are what a structural engineer checks the system against.
 */
export interface SpecPart {
  term: string;
  spec: string;
}

/** The product specification, as rendered on the engineering page. */
export interface SpecificationContent {
  title: string;
  parts: SpecPart[];
  /** Model number and governing code, printed under the parts list. */
  note: string;
}
