import { Metadata } from "../../types/autoScore";

export const createMetadata = (name: string): Metadata => {
  return {
    timestamp: Date.now(),
    name,
  };
};

export const signableMetadata = (metadata: Metadata): string => {
  return metadata.timestamp.toString();
};
