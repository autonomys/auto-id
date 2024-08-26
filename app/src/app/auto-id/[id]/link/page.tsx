'use client'

import { notFound } from "next/navigation";
import { useSessionStorage } from "usehooks-ts";
import { HexPrivateKey } from "../../../../types/keyring";
import { useCallback, useEffect, useRef } from "react";
import { pemToPrivateKey } from "@autonomys/auto-id";
import { discordLinkAccessTokenChallenge } from "../../../../services/autoid/challenges";
import toast from "react-hot-toast";
import { LinkedApp, useAddLinkedApp } from "../../../../services/autoid/localStorageDB";
import { handleHttpResponse } from "../../../../utils/http";

export default function AutoId({ params, searchParams: { access_token } }: { params: { id: string }, searchParams: { access_token: string } }) {
    const { id } = params;
    if (!id) {
        notFound()
    }
    const isLinking = useRef<boolean>(false)
    const [keyringPem,] = useSessionStorage<HexPrivateKey | null>("keypair", null)
    const signMessage = useCallback(async (message: Buffer) => {
        if (!keyringPem) {
            throw new Error('No keyring found')
        }
        const algorithm = {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
        };

        const privateKey = await pemToPrivateKey(keyringPem.data, algorithm);
        const signature = await window.crypto.subtle.sign(algorithm, privateKey, message)

        return Buffer.from(signature).toString('hex')
    }, [keyringPem])
    const addLinkedApp = useAddLinkedApp()

    const ensureServerMember = useCallback(async (accessToken: string) => {
        return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/discord/ensure-member`, {
            body: JSON.stringify({ accessToken }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(handleHttpResponse)
    }, [])

    const linkToDiscord = useCallback(async (signature: string, accessToken: string, autoId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auto-id/${autoId}/link-discord`, {
            body: JSON.stringify({ accessToken, signature, autoId }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(handleHttpResponse)

        if (response.ok) {
            const { guildId } = await response.json()
            return { provider: 'discord', url: `https://discord.com/channels/${guildId}` } as LinkedApp
        } else {
            throw new Error('Failed to link discord')
        }
    }, [])


    useEffect(() => {
        if (!keyringPem || isLinking.current) return
        isLinking.current = true

        ensureServerMember(access_token).then(() => new Promise((res) => setTimeout(res, 3_000))).then(() => signMessage(discordLinkAccessTokenChallenge(access_token))).then(signature => {
            linkToDiscord(signature, access_token, id).then((linkedApp) => {
                addLinkedApp(id, linkedApp)
                setTimeout(() => window.location.replace(`/auto-id/${id}`), 1000)
            }).catch(() => {
                toast.error('Failed to link discord account')
                setTimeout(() => window.location.replace(`/auto-id/${id}`), 2000)
            })
        })

    }, [keyringPem])



    return <div className="bg-white ring-1 ring-black ring-opacity-5 flex flex-row justify-center items-center gap-4 p-4 rounded text-lg">
        Linking to discord <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    </div>
} 