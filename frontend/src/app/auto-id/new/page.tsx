import AutoIdIssuer from "../../../components/AutoIdIssuer";

export default function NewAutoId({
  searchParams: { uuid, provider },
}: {
  searchParams: { uuid: string; provider: string };
}) {
  const autoId = generateAutoID(provider, uuid);

  return <AutoIdIssuer autoId={autoId} />;
}

function generateAutoID(provider: string, uuid: string) {
  return process.env.LETSID_SERVER_AUTO_ID + provider + uuid;
}
