import crypto from "crypto";

/**
 * Generate MD5 signature for Z-Pay payment.
 * Algorithm: sort params by key (ASCII a-z), exclude sign/sign_type/empty values,
 * join as key=value&key=value, append secret key, MD5 hash (lowercase).
 */
export function generateSignature(
  params: Record<string, string | number>,
  secretKey: string
): string {
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== "sign" && key !== "sign_type" && params[key] !== "" && params[key] != null)
    .sort((a, b) => (a > b ? 1 : -1));

  const queryString = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  const signString = queryString + secretKey;

  return crypto.createHash("md5").update(signString, "utf8").digest("hex").toLowerCase();
}

/**
 * Verify an incoming Z-Pay notification signature.
 */
export function verifySignature(
  params: Record<string, string>,
  secretKey: string,
  receivedSign: string
): boolean {
  const computed = generateSignature(params, secretKey);
  return computed === receivedSign;
}

/**
 * Generate a unique out_trade_no for a new payment order.
 * Format: VG_YYYYMMDD_HHMMSS_random6
 */
export function generateOutTradeNo(): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const random = Math.floor(Math.random() * 900000 + 100000).toString();
  return `VG_${dateStr}_${random}`;
}

/**
 * Build the full Z-Pay payment redirect URL.
 */
export function buildPaymentUrl(params: Record<string, string | number>): string {
  const sortedKeys = Object.keys(params)
    .filter((key) => params[key] !== "" && params[key] != null)
    .sort((a, b) => (a > b ? 1 : -1));

  const queryString = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  return `https://zpayz.cn/submit.php?${queryString}`;
}

/**
 * Plan configuration: price in CNY and number of project credits.
 */
export const PRICING_PLANS = {
  "10": {
    price: 20,
    credits: 10,
    names: { zh: "基础版 - 10个项目点数", en: "Basic - 10 project credits" },
  },
  "30": {
    price: 40,
    credits: 30,
    names: { zh: "专业版 - 30个项目点数", en: "Pro - 30 project credits" },
  },
} as const;
