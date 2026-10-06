import type { ReactNode } from 'react';

/** Everything under /zh is in Simplified Chinese. The root layout owns <html lang="en">, so the language is set on this wrapper. */
export default function ChineseLayout({ children }: { children: ReactNode }) {
  return <div lang="zh-Hans">{children}</div>;
}
