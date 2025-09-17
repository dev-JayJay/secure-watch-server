export const stripQuotes = (s?: string): string | undefined => s?.replace(/^"(.*)"$/, '$1');

