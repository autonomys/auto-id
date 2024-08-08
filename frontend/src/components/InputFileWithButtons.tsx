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
}: PropsWithoutRef<{
  className?: string;
  name: string;
  value: string | null;
  placeholder: string;
  copyMessage: string;
}>) => {
  const [, updateClipboard] = useCopyToClipboard();

  const copyToClipboard = useCallback(() => {
    toast(copyMessage);
    value && updateClipboard(value);
  }, [copyMessage]);

  const url = useMemo(() => {
    if (!value) return;

    const blob = new Blob([value], { type: "text/plain" });
    return URL.createObjectURL(blob);
  }, [value]);

  return (
    <div
      className={`flex flex-row justify-between items-center bg-white p-2 gap-2 w-full rounded border border-black ${className} ${
        !value && "opacity-50"
      }`}
    >
      {value ? (
        <>
          <span className="overflow-hidden text-ellipsis w-2/3 text-nowrap">
            {name}
          </span>
          <a download="certificate.pem" href={url} target="_blank">
            <ArrowDownTrayIcon className="size-6 hover:cursor-pointer" />
          </a>
          <Square2StackIcon
            onClick={copyToClipboard}
            className="size-6 hover:cursor-pointer"
          />
        </>
      ) : (
        placeholder
      )}
    </div>
  );
};
