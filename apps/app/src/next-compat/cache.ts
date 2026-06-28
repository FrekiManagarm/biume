export function revalidatePath(_path: string) {
  return undefined;
}

export function revalidateTag(_tag: string) {
  return undefined;
}

export function unstable_noStore() {
  return undefined;
}

export function unstable_cache<T extends (...args: Array<unknown>) => unknown>(
  fn: T,
) {
  return fn;
}
