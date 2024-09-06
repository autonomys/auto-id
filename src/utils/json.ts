export const jsonSafeParse = (json: string): any => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};
