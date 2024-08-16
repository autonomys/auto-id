import { ZkpClaimJSON } from "@autonomys/auto-id";
import { postgres } from "../services/db";
import { QueryResult } from "pg";

interface ZkpClaimTableSchema {
  uuid: string;
  autoId: string;
  claim: ZkpClaimJSON;
}

export class ZkpClaimRepository {
  constructor() {}

  save(
    uuid: string,
    autoId: string,
    claim: ZkpClaimJSON
  ): Promise<QueryResult<ZkpClaimTableSchema>> {
    return postgres.query<ZkpClaimTableSchema>({
      text: "`INSERT INTO zkp_claims (uuid, autoId, claim) VALUES ($1, $2, $3)`",
      values: [uuid, autoId, claim],
    });
  }

  async getByUUID(uuid: string): Promise<ZkpClaimTableSchema | null> {
    const result = await postgres.query<ZkpClaimTableSchema>({
      text: "`SELECT * FROM zkp_claims WHERE uuid = $1`",
      values: [uuid],
    });

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getByAutoId(autoId: string): Promise<ZkpClaimTableSchema[]> {
    const result = await postgres.query<ZkpClaimTableSchema>({
      text: "`SELECT * FROM zkp_claims WHERE autoId = $1`",
      values: [autoId],
    });

    return result.rows;
  }
}
