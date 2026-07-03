/**
 * Internal admin emails that bypass credit checks.
 * These accounts have unlimited access for testing purposes.
 */
const ADMIN_EMAILS: string[] = [
  "1099417497@qq.com",
];

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
