import {
  SupportedClaimHashes,
  ZkpClaimJSON,
  ZkpClaimType,
} from "@autonomys/auto-id";

export interface SignableAutoScoreClaim {
  uuid: string;
  claimHash: SupportedClaimHashes;
  type: ZkpClaimType;
  proof: ZkpClaimJSON["proof"];
}

export interface SignableAutoScore {
  score: number;
  serviceId: string;
}

export interface SignedAutoScore {
  signature: string;
  data: SignableAutoScore;
  claims: { claimHash: SupportedClaimHashes; uuid: string }[];
}
