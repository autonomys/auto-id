import AutoIdIssuer from "../../../components/AutoIdIssuer";
import { generateAutoID } from "../../../services/autoid";

export default function NewAutoId({
  searchParams: { uuid, provider },
}: {
  searchParams: { uuid: string; provider: string };
}) {
  const autoId = generateAutoID(provider, uuid);

  return <AutoIdIssuer autoId={autoId} uuid={uuid} provider={provider} />;
}
