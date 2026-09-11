import type { ShortcutItem } from '../types';

interface ShortcutsProps {
  items: ShortcutItem[];
}

export function Shortcuts({ items }: ShortcutsProps) {
  return (
    <div className="shortcuts">
      {items.map((item, i) => (
        <div className="sc" key={i}>
          <kbd>{item.keys}</kbd>
          <span className="sc-desc">{item.description}</span>
        </div>
      ))}
    </div>
  );
}
