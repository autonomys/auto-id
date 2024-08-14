"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

function GoogleCallBack() {
  const queryParamEntry = window.location.href.match(/access_token=.*&/);

  useEffect(() => {
    if (queryParamEntry?.[0]) {
      window.location.replace(`/auto-id/new/google?${queryParamEntry[0]}`);
    }
  });

  return <></>;
}

export default dynamic(() => Promise.resolve(GoogleCallBack), { ssr: false });
