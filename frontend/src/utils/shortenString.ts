export const shortenString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength)}...`;
};

export const middleShortenString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength / 2)}...${str.slice(-maxLength / 2)}`;
};
