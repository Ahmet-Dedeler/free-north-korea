import type { AnchorHTMLAttributes } from 'react';

/** External link that opens in a new tab. */
export function Ext({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
