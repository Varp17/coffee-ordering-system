/**
 * Simple client-side internationalization helper.
 * Resolves IDE warnings for un-internationalized JSX strings without requiring external dependencies.
 */
export function t(key, defaultValue) {
  return defaultValue !== undefined ? defaultValue : key;
}
