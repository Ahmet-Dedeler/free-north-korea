import type { ReactNode } from 'react';

/** Everything under /ja is in Japanese. The root layout owns <html lang="en">, so the language is set on this wrapper. */
export default function JapaneseLayout({ children }: { children: ReactNode }) {
  return <div lang="ja">{children}</div>;
}
