import { Checkout } from "@creem_io/nextjs";

export const POST = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true,
  defaultSuccessUrl: `${process.env.NEXT_PUBLIC_APP_URL}/en/my?payment=success`,
});
