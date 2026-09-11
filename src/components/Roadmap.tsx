import type { RoadmapStage } from '../types';

export function Roadmap({ stages }: { stages: RoadmapStage[] }) {
  return (
    <div className="roadmap">
      {stages.map((s, i) => (
        <div className="road-stage" key={i}>
          <div className="road-dot">{s.dot}</div>
          <div>
            <div className="road-title">
              {s.title}
              <span className="road-range">{s.range}</span>
            </div>
            <div className="road-desc" dangerouslySetInnerHTML={{ __html: s.descriptionHtml }} />
          </div>
        </div>
      ))}
    </div>
  );
}
