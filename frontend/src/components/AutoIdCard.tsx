"use client";

import { PropsWithChildren, useCallback, useMemo } from "react";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import { middleShortenString } from "../utils/shortenString";
import { getProviderImageUrl } from '../utils/provider';
import { AutoIdInfo } from "../services/autoid/localStorageDB";

export const AutoIdCard = ({
  autoId,
  provider,
  certificatePem,
  uuid: _,
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

  return (
    <div className="flex flex-col border border-black rounded p-4 md:w-[60%] w-[80%] bg-slate-50 items-center gap-4">
      <div className="flex flex-row items-center justify-around gap-4 w-full">
        <img
          src={getProviderImageUrl(provider)}
          className="h-[80px] max-w-[33%] aspect-square"
        />
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
