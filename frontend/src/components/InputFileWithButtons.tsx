import { PropsWithoutRef, useCallback, useMemo } from "react";
import {
  ArrowDownIcon,
  ArrowDownTrayIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";

export const InputFileWithButtons = ({
  className = "",
  placeholder = "No file",
  name,
  value,
  copyMessage,
  downloadFilename,
}: PropsWithoutRef<{
  className?: string;
  name: string;
  value: string | null;
  placeholder: string;
  copyMessage: string;
  downloadFilename?: string;
}>) => {
  const [, updateClipboard] = useCopyToClipboard();

  const copyToClipboard = useCallback(() => {
    toast(copyMessage);
    value && updateClipboard(value);
  }, [copyMessage, value, updateClipboard]);

  const url = useMemo(() => {
    if (!value) return;

    const blob = new Blob([value], { type: "text/plain" });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <div
      className={`flex flex-row relative justify-between items-center bg-white p-2 gap-2 w-full rounded border border-black ${className} ${
        !value && "opacity-50"
      }`}
    >
      {value ? (
        <>
          <span className="overflow-hidden text-ellipsis text-nowrap">
            {name}
          </span>
          <a download={downloadFilename || name} href={url} target="_blank">
            <ArrowDownTrayIcon className="size-6 hover:cursor-pointer absolute right-12 top-0 bottom-0 m-auto" />
          </a>
          <Square2StackIcon
            onClick={copyToClipboard}
            className="size-6 hover:cursor-pointer absolute right-4 top-0 bottom-0 m-auto"
          />
        </>
      ) : (
        placeholder
      )}
    </div>
  );
};
