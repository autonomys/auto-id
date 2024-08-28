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

export const getProviderName = (provider: string) => {
  switch (provider) {
    case "google":
      return "Google";
    case "discord":
      return "Discord";
    case "github":
      return "Github";
    default:
      return "";
  }
};
