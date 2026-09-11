import type { PrismTheme } from 'prism-react-renderer';

export const guideTheme: PrismTheme = {
  plain: { color: '#E2E8F0', backgroundColor: 'transparent' },
  styles: [
    { types: ['keyword', 'operator', 'builtin'], style: { color: '#C084FC' } },
    { types: ['function', 'method'], style: { color: '#38BDF8' } },
    { types: ['string', 'char', 'url', 'attr-value', 'template-string'], style: { color: '#FB923C' } },
    { types: ['number'], style: { color: '#3DD68C' } },
    { types: ['comment'], style: { color: '#4B5D73', fontStyle: 'italic' } },
    { types: ['property', 'attr-name', 'maybe-class-name', 'class-name'], style: { color: '#60A5FA' } },
    { types: ['boolean'], style: { color: '#F87171' } },
  ],
};
