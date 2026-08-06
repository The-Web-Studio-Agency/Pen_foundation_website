import { PersonCard } from './PersonCard';
import type { PersonCard as PersonCardData } from '@/content/data/people';

interface PersonGridProps {
  people: PersonCardData[];
}

export function PersonGrid({ people }: PersonGridProps) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-12 px-6 md:grid-cols-3">
      {people.map((person) => (
        <PersonCard key={person.name} {...person} />
      ))}
    </div>
  );
}
