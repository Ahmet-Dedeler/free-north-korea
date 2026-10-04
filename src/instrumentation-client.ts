/**
 * Analytics (PostHog). Next.js runs this file once in the browser before the app hydrates.
 *
 * - The project key comes from NEXT_PUBLIC_POSTHOG_KEY (set in Vercel, or .env.local for testing). The repo is public,
 *   so no key is committed. Without the variable nothing loads and nothing is sent: forks and local dev stay silent.
 * - Cookieless: no cookies, no localStorage, no person profiles. People who read this site may have good reasons
 *   not to be tracked, so we only count page views and clicks anonymously. No session recording.
 * - Browsers that send Do Not Track are not counted at all.
 */
import posthog from 'posthog-js';

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    defaults: '2026-08-30',
    cookieless_mode: 'always',
    person_profiles: 'never',
    respect_dnt: true,
    disable_session_recording: true,
    disable_surveys: true,
    capture_exceptions: false,
  });
}
