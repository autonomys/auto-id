import blake2b from "blake2b";
import { Metadata } from "../../types/autoScore";
import { SignableAutoScore } from "../../types/autoId";

export const metadataSignatureChallenge = (metadata: Metadata): Buffer => {
  return Buffer.from(metadata.timestamp.toString(), "utf-8");
};

export const userSignatureChallenge = (hexSignature: string): Buffer =>
  Buffer.from(blake2b(32).update(Buffer.from(hexSignature, "hex")).digest());

export const autoScoreSignatureChallenge = ({
  score,
  serviceId,
}: SignableAutoScore): Buffer => {
  return Buffer.from(
    blake2b(32)
      .update(Buffer.from(serviceId))
      .update(Buffer.from(score.toString()))
      .digest()
  );
};

export const discordLinkAccessTokenChallenge = (
  accessToken: string
): Buffer => {
  return Buffer.from(blake2b(32).update(Buffer.from(accessToken)).digest());
};
