export const authBasicHeader = (user: string, pass: string) => {
  return `Basic ${Buffer.from([user, pass].join(":")).toString("base64")}`;
};
