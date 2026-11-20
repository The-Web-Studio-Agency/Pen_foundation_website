import Link from 'next/link';

import { ArrowRight, Chip, cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import { soilT } from './content';
import s from './technology.module.css';

/** Four nails splayed from the node into the soil, and the volume they engage. */
export function LoadPath() {
  const nails = [
    { x: 46, y: 228, w: 1.6, o: 0.55 },
    { x: 104, y: 238, w: 2.4, o: 1 },
    { x: 296, y: 238, w: 2.4, o: 1 },
    { x: 354, y: 228, w: 1.6, o: 0.55 },
  ];
  return (
    <svg className={s.soilDiagram} viewBox="0 0 400 260" aria-hidden>
      <defs>
        <radialGradient id="hv2-soil-glow" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#f7dc2e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f7dc2e" stopOpacity="0" />
        </radialGradient>
        <pattern id="hv2-soil-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.12)" />
        </pattern>
      </defs>
      {/* Soil below the ground line. */}
      <rect x="0" y="60" width="400" height="200" fill="url(#hv2-soil-dots)" />
      {/* The volume of soil the nails engage. */}
      <path d="M176 64 L20 246 L380 246 L224 64 Z" fill="url(#hv2-soil-glow)" />
      <path
        d="M176 64 L20 246 M224 64 L380 246"
        stroke="#f7dc2e"
        strokeOpacity="0.45"
        strokeDasharray="3 5"
        fill="none"
      />
      {/* Ground line. */}
      <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.4)" />
      {/* Nails. */}
      {nails.map((n) => (
        <line
          key={n.x}
          x1="200"
          y1="64"
          x2={n.x}
          y2={n.y}
          stroke="#e6ecea"
          strokeOpacity={n.o}
          strokeWidth={n.w}
          strokeLinecap="round"
        />
      ))}
      {/* The node at ground level, its bolts above. */}
      <path d="M178 40 H222 L230 60 L212 76 H188 L170 60 Z" fill="#c9cfcd" />
      {[188, 200, 212].map((x) => (
        <line key={x} x1={x} y1="28" x2={x} y2="40" stroke="#c9cfcd" strokeWidth="2" />
      ))}
      <text x="8" y="52" className={s.soilDiagramLabel} fill="rgba(255,255,255,0.55)">
        Ground level
      </text>
      <text x="200" y="210" textAnchor="middle" className={s.soilDiagramLabel} fill="#f7dc2e">
        Engaged soil volume
      </text>
    </svg>
  );
}

/**
 * Soil-structure interaction: the mechanism paragraph beside a diagram of
 * the four nails engaging a volume of soil. Moved from the homepage's former
 * system section.
 */
export function SoilInteraction() {
  return (
    <section className={cx(s.soil, t.gutter)} aria-labelledby="tech-soil-title">
      <div className={s.soilPanel} data-reveal>
        <div className={s.soilCopy}>
          <Chip>{soilT.chip}</Chip>
          <h2 id="tech-soil-title" className={cx(t.h3, s.soilHeading)}>
            {soilT.heading}
          </h2>
          <p className={s.soilText}>{soilT.body}</p>
          <Link href={soilT.cta.href} className={s.soilLink}>
            {soilT.cta.label}
            <ArrowRight size={14} />
          </Link>
        </div>
        <LoadPath />
      </div>
    </section>
  );
}
