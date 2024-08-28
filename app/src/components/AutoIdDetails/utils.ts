import { SupportedClaimHashes } from "@autonomys/auto-id";

export const getProviderImageByHash = (hash: string) => {
  switch (hash) {
    case SupportedClaimHashes.GithubUsername:
      return "/github.png";
    case SupportedClaimHashes.UberUUID:
      return "/uber.png";
    case SupportedClaimHashes.GoogleEmail:
      return "/google.png";
    default:
      return "/github.png";
  }
};

export const getProviderNameByHash = (hash: string) => {
  switch (hash) {
    case SupportedClaimHashes.GithubUsername:
      return "Github";
    case SupportedClaimHashes.UberUUID:
      return "Uber";
    case SupportedClaimHashes.GoogleEmail:
      return "Google";
    default:
      return "";
  }
};
