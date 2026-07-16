import crypto from "crypto";

/**
 * USD pricing plans for Lemon Squeezy.
 * Prices match messages/en.json: $4.99 / $9.99
 */
export const PRICING_PLANS_USD = {
  "10": {
    price: 4.99,
    cents: 499,
    credits: 10,
    name: "Basic - 10 project credits",
  },
  "30": {
    price: 9.99,
    cents: 999,
    credits: 30,
    name: "Pro - 30 project credits",
  },
} as const;

const LS_API_BASE = "https://api.lemonsqueezy.com/v1";

interface CreateCheckoutParams {
  plan: "10" | "30";
  userId: string;
  outTradeNo: string;
  siteUrl: string;
}

interface CheckoutResult {
  checkoutUrl: string;
  checkoutId: string;
}

/**
 * Create a Lemon Squeezy hosted checkout session.
 * The user is redirected to `checkoutUrl` to complete payment.
 */
export async function createCheckout({
  plan,
  userId,
  outTradeNo,
  siteUrl,
}: CreateCheckoutParams): Promise<CheckoutResult> {
  const planConfig = PRICING_PLANS_USD[plan];

  const response = await fetch(`${LS_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LS_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            redirect_url: `${siteUrl}/en/my?payment=success`,
          },
          checkout_data: {
            custom: {
              user_id: userId,
              out_trade_no: outTradeNo,
              credits: planConfig.credits.toString(),
            },
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: process.env.LS_STORE_ID },
          },
          variant: {
            data: {
              type: "variants",
              id:
                plan === "10"
                  ? process.env.LS_VARIANT_10_ID!
                  : process.env.LS_VARIANT_30_ID!,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `LS checkout creation failed: ${response.status} ${errorBody}`,
    );
  }

  const json = await response.json();
  const checkoutUrl: string = json.data.attributes.url;
  const checkoutId: string = json.data.id;

  return { checkoutUrl, checkoutId };
}

/**
 * Verify a Lemon Squeezy webhook signature.
 * LS signs the raw request body with HMAC-SHA256 using the webhook secret.
 * The signature is sent in the X-Signature header.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
