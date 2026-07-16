import { Webhook } from "@creem_io/nextjs";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onCheckoutCompleted: async ({ product, customer }) => {
    console.log("Creem checkout completed:", customer?.email, product.name);
  },
});
