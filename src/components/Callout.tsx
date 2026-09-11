interface CalloutProps {
  variant: 'info' | 'tip' | 'warn' | 'err' | 'why';
  icon: string;
  html: string;
}

export function Callout({ variant, icon, html }: CalloutProps) {
  return (
    <div className={`call ${variant}`}>
      <span className="call-icon">{icon}</span>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
