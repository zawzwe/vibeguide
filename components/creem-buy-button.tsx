"use client";

import { CreemCheckout } from "@creem_io/nextjs";

export function CreemBuyButton({
  children,
  productId,
}: {
  children: React.ReactNode;
  productId: string;
}) {
  return (
    <CreemCheckout
      productId={productId}
      checkoutPath="/api/creem/checkout"
    >
      <span className="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full cursor-pointer">
        {children}
      </span>
    </CreemCheckout>
  );
}
