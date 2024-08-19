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
  claims,
  serviceId,
}: SignableAutoScore): Buffer => {
  claims.sort((a, b) => a.uuid.localeCompare(b.uuid));

  const serialized = JSON.stringify(JSON.parse(JSON.stringify(claims)));

  return Buffer.from(
    blake2b(32)
      .update(Buffer.from(serialized))
      .update(Buffer.from(serviceId))
      .update(Buffer.from(score.toString()))
      .digest()
  );
};
