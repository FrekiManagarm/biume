export function readStringSearch(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string" ? value : fallback;
}

export function readNumberSearch(value: unknown, fallback = 1): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}
