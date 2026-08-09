/**
 * Model behind the homepage time & cost estimator.
 *
 * Pure and React-free so the arithmetic can be reasoned about — and tested —
 * without rendering anything.
 *
 * The rates below are the ones printed under the card as `basis`. They are
 * declared once here so the small print and the figures above it cannot drift
 * apart: change a rate and both move together.
 */

/** Days a conventional cast-in-situ footing takes per foundation point. */
const TRADITIONAL_DAYS_PER_POINT = 2.1;

/** Hours PEN takes per point. Driven, so there is no curing wait. */
const PEN_HOURS_PER_POINT = 2;

/** Rupees saved per point on excavation, spoil disposal and curing time. */
const COST_SAVED_PER_POINT = 45_000;

/**
 * Kilograms of CO₂ avoided per PEN foundation point, and the tree-planting
 * equivalent of that saving.
 *
 * Both from the IKEA Foundation case study, which states that a single unit of
 * PEN foundation saves more than 106 kg of CO₂ — "equivalent to planting 5
 * trees". The figures are floors in the source ("106+", "more than"), so the
 * estimate is conservative rather than optimistic.
 */
const CO2_SAVED_KG_PER_POINT = 106;
const TREES_PER_POINT = 5;

const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

export interface ProjectEstimate {
  /** Whole days saved against the conventional programme. */
  daysSaved: number;
  /** The same figure expressed in weeks, to one decimal. */
  weeksSaved: number;
  /** Rupees saved across the whole project. */
  costSaved: number;
  /** Kilograms of CO₂ avoided across the whole project. */
  co2SavedKg: number;
  /** Tree-planting equivalent of that CO₂ saving. */
  treesEquivalent: number;
}

/**
 * @param points  Number of foundation points.
 * @param factor  Project-type multiplier — larger structures carry more
 *                excavation and programme risk per point.
 */
export function estimateProject(points: number, factor: number): ProjectEstimate {
  const netDaysPerPoint = TRADITIONAL_DAYS_PER_POINT - PEN_HOURS_PER_POINT / HOURS_PER_DAY;
  const daysSaved = Math.round(points * netDaysPerPoint * factor);

  return {
    daysSaved,
    weeksSaved: daysSaved / DAYS_PER_WEEK,
    costSaved: Math.round(points * COST_SAVED_PER_POINT * factor),
    // Deliberately NOT scaled by `factor`. That multiplier stands for
    // programme and excavation risk, which is a property of the project; the
    // carbon saving is a property of the unit — one node displaces the same
    // concrete whether it is under a house or a solar table. Scaling it would
    // inflate a sourced figure into an unsourced one.
    co2SavedKg: Math.round(points * CO2_SAVED_KG_PER_POINT),
    treesEquivalent: Math.round(points * TREES_PER_POINT),
  };
}

/**
 * Kilograms up to a tonne, then tonnes to one decimal. The estimator shows a
 * magnitude, and "1.3 t" is read faster than "1272 kg".
 */
export function formatMass(kilograms: number): string {
  if (kilograms >= 1_000) return `${(kilograms / 1_000).toFixed(1)} t`;
  return `${kilograms} kg`;
}

/**
 * Indian short-scale currency: ₹1.8L, ₹2.4Cr. The estimator shows magnitudes
 * rather than exact rupees, and lakh/crore is how that is read locally.
 */
export function formatIndianShort(value: number): string {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(0)}K`;
  return `₹${value}`;
}
