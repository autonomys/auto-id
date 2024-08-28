import { useCallback, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  useLocalAutoIDs,
  useSetLocalAutoIDs,
} from "../services/autoid/localStorageDB";

const useResetAutoScore = () => {
  const [autoScoreTimestamp, setAutoScoreTimestamp] = useLocalStorage<
    string | null
  >("autoScoreTimestamp", "0");
  const autoIDs = useLocalAutoIDs();
  const setAutoIds = useSetLocalAutoIDs();

  return useCallback(() => {
    const placeholderDate = 1724837909576;

    if (autoScoreTimestamp) {
      const parsedTs = parseInt(autoScoreTimestamp, 10);
      if (parsedTs < placeholderDate) {
        setAutoScoreTimestamp(Date.now().toString());
        const newAutoIDs = autoIDs.map((autoId) => {
          return {
            ...autoId,
            autoScore: undefined,
          };
        });
        setAutoIds(newAutoIDs);
      }
    }
  }, [autoScoreTimestamp, setAutoIds, setAutoScoreTimestamp]);
};

export default useResetAutoScore;
