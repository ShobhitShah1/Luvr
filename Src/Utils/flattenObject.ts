export function flattenObject(obj: any): Record<string, any> {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  return Object.entries(obj).reduce((acc: Record<string, any>, [key, value]) => {
    const prefixedKey = key;
    if (typeof value === 'object' && !Array.isArray(value)) {
      const flattened = flattenObject(value);
      Object.assign(acc, flattened);
    } else {
      acc[prefixedKey] = value;
    }

    return acc;
  }, {});
}
