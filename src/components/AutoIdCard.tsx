"use client";

import { PropsWithChildren, useCallback, useMemo } from "react";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import { middleShortenString } from "../utils/shortenString";
import { AutoIdInfo } from "../services/autoid/localStorageDB";
import { AutoScore } from "./common/AutoScore";

export const AutoIdCard = ({
  autoId,
  provider,
  certificatePem,
  uuid: _,
  autoScore
}: PropsWithChildren<AutoIdInfo>) => {
  const [, updateClipboard] = useCopyToClipboard();

  const onClick = useCallback(() => {
    toast("Auto-ID copied to clipboard");
    updateClipboard(autoId);
  }, [autoId]);

  const shortenAutoId = useMemo(
    () => middleShortenString(autoId, 12),
    [autoId]
  );

  const score = autoScore?.data.score || 0

  return (
    <div className="flex flex-col ring-1 ring-black ring-opacity-10 rounded p-4 md:w-[60%] w-[80%] bg-white shadow-lg items-center gap-4">
      <div className="flex flex-row items-center justify-around gap-4 w-full">
        <span className="hidden md:block"><AutoScore score={score} /></span>
        <div className="flex flex-row gap-2 w-fit-content items-center">
          <div className="text-lg md:text-2xl font-medium">{shortenAutoId}</div>
          <div>
            <Square2StackIcon
              onClick={onClick}
              className="size-6 hover:cursor-pointer"
            />
          </div>
        </div>
        <a
          href={`${window.location.pathname}/${autoId}`}
          className={`text-white bg-primary py-1 px-4 rounded-md text-xl hover:opacity-80 hover:scale-101 flex items-center gap-1 w-content`}
        >
          Manage
        </a>
      </div>
    </div>
  );
};
