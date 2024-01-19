const queryValueToArray = (
  value: string | string[] | undefined,
): string[] | undefined => {
  if (typeof value == 'string') return [value];
  return value;
};

export default queryValueToArray;
