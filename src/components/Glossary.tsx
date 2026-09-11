import type { GlossaryTerm } from '../types';

export function Glossary({ terms }: { terms: GlossaryTerm[] }) {
  return (
    <div className="glossary">
      {terms.map((t, i) => (
        <div className="gloss-item" key={i}>
          <div className="gloss-term">{t.term}</div>
          <div className="gloss-def" dangerouslySetInnerHTML={{ __html: t.definitionHtml }} />
        </div>
      ))}
    </div>
  );
}
