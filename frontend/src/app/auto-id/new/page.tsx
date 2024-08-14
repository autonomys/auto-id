import AutoIdIssuer from "../../../components/AutoIdIssuer";
import { generateAutoIDDigest } from "../../../services/autoid";

export default function NewAutoId({
  searchParams: { uuid, provider },
}: {
  searchParams: { uuid: string; provider: string };
}) {
  const autoIdDigest = generateAutoIDDigest(provider, uuid);

  return (
    <AutoIdIssuer autoIdDigest={autoIdDigest} uuid={uuid} provider={provider} />
  );
}
