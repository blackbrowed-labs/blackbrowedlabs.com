/**
 * Build-time environment helpers.
 *
 * PUBLIC_ENVIRONMENT and PUBLIC_SITE_URL are set by the GitHub Actions
 * deploy workflows per branch (dev → staging, main → production). In
 * local dev neither is set and we fall back to 'development' +
 * http://localhost:4321.
 */

export type Environment = 'production' | 'staging' | 'development';

export function getEnvironment(): Environment {
  const value = import.meta.env.PUBLIC_ENVIRONMENT;
  if (value === 'production' || value === 'staging') {
    return value;
  }
  return 'development';
}

export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

export function isStaging(): boolean {
  return getEnvironment() === 'staging';
}

export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Canonical site URL without trailing slash. Used for canonical <link>
 * tags, OG URLs, and absolute-URL generation.
 */
export function getSiteUrl(): string {
  const value = import.meta.env.PUBLIC_SITE_URL;
  if (typeof value === 'string' && value.length > 0) {
    return value.replace(/\/+$/, '');
  }
  return 'http://localhost:4321';
}
