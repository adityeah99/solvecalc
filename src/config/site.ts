// Brand + site settings. Change the name, URL or contact details here and
// every page, meta tag, sitemap entry and the logo wordmark picks it up.
export const SITE = {
  name: 'Calcora',
  tagline: 'Calculate, understand, practice, play.',
  description:
    'Free math calculators with worked steps, short lessons, practice quizzes and a library of browser games.',
  // Public origin used for canonical URLs, Open Graph and the sitemap.
  url: 'https://calcora.example',
  locale: 'en_US',
  lang: 'en',
  // Left blank on purpose: the contact page shows this address only when it is set.
  contactEmail: '',
  // Hex values used by the manifest/theme-color meta; the full palette lives in styles/tokens.css.
  themeColor: '#15202e',
} as const;

// Social links shown in the footer. Add your own real profile URLs here and
// they appear automatically; while the list is empty, no icons are shown.
// e.g. { network: 'instagram', href: 'https://instagram.com/yourhandle' }
export const SOCIAL: { network: 'instagram' | 'tiktok' | 'youtube' | 'x'; href: string }[] = [];
