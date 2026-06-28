const defaultProductAppUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://app.biume.com";

export const productAppUrl =
  process.env.NEXT_PUBLIC_PRODUCT_APP_URL ?? defaultProductAppUrl;

export function productAppHref(path: `/${string}`) {
  return new URL(path, productAppUrl).toString();
}
