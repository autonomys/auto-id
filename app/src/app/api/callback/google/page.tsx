'use client'

import { useEffect } from "react";

export default function Google() {
    useEffect(() => {
        const queryParamEntry = window.location.href.match(/access_token=.*&/);

        if (queryParamEntry?.[0]) {
            const targetUrl = window.location.href.replace(`${window.location.pathname}#`, `${window.location.pathname}/token?`);
            window.location.replace(targetUrl);
        }
    });

    return <div></div>;
}
