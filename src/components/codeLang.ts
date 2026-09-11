export function langClassToPrism(langClass: string): string {
  switch (langClass) {
    case 'js':
      return 'javascript';
    case 'sh':
      return 'bash';
    case 'ts':
    case 'cfg':
    case 'bad':
    case 'good':
    default:
      return 'typescript';
  }
}
