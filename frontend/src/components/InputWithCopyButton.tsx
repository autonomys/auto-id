import { PropsWithoutRef, useCallback } from "react";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";

export const InputWithCopyButton = ({
  className = "",
  value,
}: PropsWithoutRef<{ className?: string; value: string }>) => {
  const [, updateClipboard] = useCopyToClipboard();

  const onClick = useCallback(() => {
    console.log("Copied");
    toast("Auto-ID copied to clipboard");
    updateClipboard(value);
  }, []);

  return (
    <div
      className={`flex flex-row justify-between items-center bg-white p-2 gap-2 w-full rounded border border-black ${className}`}
    >
      <span className="overflow-hidden text-ellipsis w-2/3 text-nowrap">
        {value}
      </span>
      <Square2StackIcon
        onClick={onClick}
        className="size-6 hover:cursor-pointer"
      />
    </div>
  );
};
