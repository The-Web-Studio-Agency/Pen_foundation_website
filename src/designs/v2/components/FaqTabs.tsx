import { anchors, faqV2 } from '../content';
import { FaqSection } from './FaqSection';

/** The homepage FAQ: its question sets in the shared FAQ section. */
export function FaqTabs() {
  return (
    <FaqSection
      id={anchors.faq}
      titleId="hv2-faq-title"
      chip={faqV2.chip}
      heading={faqV2.heading}
      body={faqV2.body}
      cta={faqV2.cta}
      tabs={faqV2.tabs}
    />
  );
}
