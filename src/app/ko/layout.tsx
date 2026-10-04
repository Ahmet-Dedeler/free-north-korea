import type { ReactNode } from 'react';

/** Everything under /ko is in Korean. The root layout owns <html lang="en">, so the language is set on this wrapper. */
export default function KoreanLayout({ children }: { children: ReactNode }) {
  return <div lang="ko">{children}</div>;
}
