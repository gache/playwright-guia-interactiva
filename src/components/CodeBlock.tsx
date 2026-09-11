import { Highlight } from 'prism-react-renderer';
import { useState } from 'react';
import type { CodeBlockData } from '../types';
import { langClassToPrism } from './codeLang';
import { guideTheme } from './guideTheme';

export function CodeBlock({ label, langClass, code }: CodeBlockData) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code.trim());
    } catch {
      // clipboard unavailable — nothing to recover into, button just won't confirm
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="cb">
      <div className="cb-head">
        <span className={`lang ${langClass}`}>{label}</span>
        <button type="button" className={`copy-btn${copied ? ' ok' : ''}`} onClick={handleCopy}>
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
      <Highlight code={code.trim()} language={langClassToPrism(langClass)} theme={guideTheme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
