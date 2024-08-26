export const authBasicHeader = (user: string, pass: string) => {
  return `Basic ${Buffer.from([user, pass].join(":")).toString("base64")}`;
};

export const handleHttpResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
};
