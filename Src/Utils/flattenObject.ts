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

export function safeJsonParse(value: any): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
