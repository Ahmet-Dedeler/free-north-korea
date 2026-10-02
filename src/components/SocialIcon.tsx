import { siBluesky, siFacebook, siInstagram, siPatreon, siTiktok, siX, siYoutube } from 'simple-icons';
import type { Social } from '@/content/orgs';

/** simple-icons dropped LinkedIn at LinkedIn's request, so its mark lives here. */
const LINKEDIN =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

export const SOCIALS: Record<Social, { label: string; path: string; hex: string }> = {
  x: { label: 'X', path: siX.path, hex: siX.hex },
  bluesky: { label: 'Bluesky', path: siBluesky.path, hex: siBluesky.hex },
  instagram: { label: 'Instagram', path: siInstagram.path, hex: siInstagram.hex },
  tiktok: { label: 'TikTok', path: siTiktok.path, hex: siTiktok.hex },
  youtube: { label: 'YouTube', path: siYoutube.path, hex: siYoutube.hex },
  facebook: { label: 'Facebook', path: siFacebook.path, hex: siFacebook.hex },
  linkedin: { label: 'LinkedIn', path: LINKEDIN, hex: '0A66C2' },
  patreon: { label: 'Patreon', path: siPatreon.path, hex: siPatreon.hex },
};

/** Brand glyph, coloured with currentColor so it follows the theme until hovered. */
export function SocialIcon({ kind, size = 16 }: { kind: Social; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={SOCIALS[kind].path} />
    </svg>
  );
}

export function GlobeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </svg>
  );
}
