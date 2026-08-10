/**
 * Model behind the homepage project estimator.
 *
 * Pure and React-free so the arithmetic can be reasoned about — and tested —
 * without rendering anything.
 *
 * REWRITTEN against the C-DISC content handoff (9 August 2026), which changed
 * both the input and the outputs:
 *
 *   - INPUT is built-up area in square feet, not a foundation-point count.
 *     "Use built-up area in sq. ft. as the primary input, not foundation-point
 *     count. Show project type only as a supporting selector." A visitor with
 *     drawings knows their area; almost nobody knows their point count, which
 *     is an output of the design, not an input to it.
 *
 *   - COST OUTPUT IS GONE. The handoff removes it outright: "Cost is too
 *     project- and site-dependent for a generic public calculator." The
 *     ₹45,000-per-point rate that drove it is deleted with it rather than left
 *     here unused, so it cannot quietly come back.
 *
 *   - EVERY FIGURE IS A BAND, not a point value. The handoff states the unit
 *     count as a range ("approximately 16–20 PEN units" per 1,000 sq ft,
 *     "subject to the structural layout, soil and design"), so the carbon that
 *     derives from it is a range too. Presenting a single number would claim a
 *     precision the source explicitly declines to give.
 *
 * The rates below are the ones printed under the card as `basis`. They are
 * declared once here so the small print and the figures above it cannot drift
 * apart: change a rate and both move together.
 */

/**
 * PEN units per square foot of built-up area, as a low–high band.
 *
 * HANDOFF, illustrative output: "A typical 1,000 sq ft low-rise structure may
 * require approximately 16–20 PEN units, subject to the structural layout, soil
 * and design." Written as the division rather than as 0.016 / 0.02 so the
 * source sentence is legible in the code.
 */
const UNITS_PER_SQFT_MIN = 16 / 1000;
const UNITS_PER_SQFT_MAX = 20 / 1000;

/**
 * Kilograms of CO₂e avoided per PEN unit, and the tree-planting equivalent.
 *
 * From the IKEA Foundation case study, which states that a single unit of PEN
 * foundation saves more than 106 kg of CO₂ — "equivalent to planting 5 trees".
 * The figures are floors in the source ("106+", "more than"), so the estimate
 * is conservative rather than optimistic.
 *
 * HANDOFF's claims-control table permits this figure in public copy only "with
 * comparison basis, boundary and source" stated, and its verification box lists
 * the carbon boundary among the items to reconcile before publishing. Both
 * obligations are discharged in `calculator.basis`, which prints alongside.
 */
const CO2_SAVED_KG_PER_UNIT = 106;
const TREES_PER_UNIT = 5;

export interface ProjectEstimate {
  /** Foundation points the area is likely to need, as a low–high band. */
  unitsMin: number;
  unitsMax: number;
  /** Kilograms of CO₂e avoided across the project, over the same band. */
  co2SavedKgMin: number;
  co2SavedKgMax: number;
  /** Tree-planting equivalent of that saving, over the same band. */
  treesMin: number;
  treesMax: number;
}

/**
 * @param areaSqFt  Built-up area of the proposed structure, in square feet.
 *
 * Takes no project-type argument. The selector beside the slider is captured
 * for the assessment request and shown as context, but it does not scale
 * anything here: the handoff supplies one unit-per-area band for suitable
 * low-rise structures and no per-type multipliers, so scaling by type would
 * turn a sourced range into an invented one. `calculator.basis` says as much on
 * the card, so the control's effect is stated rather than left to be guessed.
 */
export function estimateProject(areaSqFt: number): ProjectEstimate {
  const unitsMin = Math.round(areaSqFt * UNITS_PER_SQFT_MIN);
  const unitsMax = Math.round(areaSqFt * UNITS_PER_SQFT_MAX);

  return {
    unitsMin,
    unitsMax,
    co2SavedKgMin: Math.round(unitsMin * CO2_SAVED_KG_PER_UNIT),
    co2SavedKgMax: Math.round(unitsMax * CO2_SAVED_KG_PER_UNIT),
    treesMin: Math.round(unitsMin * TREES_PER_UNIT),
    treesMax: Math.round(unitsMax * TREES_PER_UNIT),
  };
}

/**
 * A low–high mass band in one unit: "1.6–2.1 t", "424–530 kg".
 *
 * The unit is chosen from the TOP of the band so both ends are expressed the
 * same way — "870 kg–1.1 t" reads as two different measurements rather than as
 * one range. Kilograms up to a tonne, then tonnes to one decimal, because the
 * estimator shows a magnitude and "1.6 t" is read faster than "1696 kg".
 */
export function formatMassRange(minKg: number, maxKg: number): string {
  if (maxKg >= 1_000) {
    return `${(minKg / 1_000).toFixed(1)}–${(maxKg / 1_000).toFixed(1)} t`;
  }
  return `${minKg}–${maxKg} kg`;
}

/** A plain low–high count: "16–20". Collapses when both ends are equal. */
export function formatCountRange(min: number, max: number): string {
  return min === max ? `${min}` : `${min}–${max}`;
}

/** Thousands separators for the area readout: "1,000". */
export function formatArea(areaSqFt: number): string {
  return areaSqFt.toLocaleString('en-IN');
}
