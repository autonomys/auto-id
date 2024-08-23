'use client'

import dynamic from "next/dynamic";
import { useEffect } from "react";

export function Google() {
    const queryParamEntry = window.location.href.match(/access_token=.*&/);

    useEffect(() => {
        if (queryParamEntry?.[0]) {
            const targetUrl = window.location.href.replace(`${window.location.pathname}#`, `${window.location.pathname}/token?`);
            window.location.replace(targetUrl);
        }
    });

    return <></>;
}

export default dynamic(() => Promise.resolve(Google), { ssr: false });