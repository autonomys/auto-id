export const getProviderImageUrl = (provider: string) => {
  switch (provider) {
    case "google":
      return "/google.png";
    case "discord":
      return "/discord.png";
    case "github":
      return "/github.png";
    default:
      return "";
  }
};
