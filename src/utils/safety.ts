export function assertNonNull<T>(
    value: T,
    errorMsg: string,
  ): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
      throw new Error(errorMsg);
    }
  }