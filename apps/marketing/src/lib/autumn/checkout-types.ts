import type { UseCustomerResult } from "autumn-js/react";

/** Même type que le retour de `previewAttach` / `checkoutResult` du dialogue Autumn. */
export type CheckoutPreviewResult = Awaited<
  ReturnType<UseCustomerResult["previewAttach"]>
>;
