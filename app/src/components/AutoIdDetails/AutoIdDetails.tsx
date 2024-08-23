'use client'

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocalAutoIDs, useUpdateAutoScore } from "../../services/autoid/localStorageDB";
import { constructZkpClaim, pemToCertificate, pemToPrivateKey, reclaimSupportsClaimHash, SupportedClaimHashes, ZkpClaimType } from "@autonomys/auto-id";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useCopyToClipboard, useSessionStorage } from "usehooks-ts";
import { getProviderImageUrl } from "../../utils/provider";
import { middleShortenString } from "../../utils/shortenString";
import { InputFileWithButtons } from "../InputFileWithButtons";
import blake2b from "blake2b";
import toast from "react-hot-toast";
import { notFound } from "next/navigation";
import { ReclaimResponseBody } from "../../app/api/auto-id/[id]/auto-score/reclaim/route";
import { Proof } from '@reclaimprotocol/js-sdk'
import { ReclaimQRCode } from "./ReclaimQRCode";
import { HexPrivateKey } from "../../types/keyring";
import { userSignatureChallenge } from "../../services/autoid/challenges";
import { Metadata } from "../../types/autoScore";
import { extractFromHttpResponse } from "../../types/httpResponse";
import { IssueAutoScoreResponseBody } from "../../app/api/auto-id/[id]/auto-score/route";
import { DropdownButtons } from "../common/Dropdown";
import { getProviderImageByHash } from "./utils";
import { ClaimSelectorModal } from "./ClaimSelectorModal";

export const AutoIdDetails: FC<{ autoId: string, linkToDiscordUrl: string }> = (({
    autoId,
    linkToDiscordUrl
}) => {
    const autoID = useLocalAutoIDs().find(a => a.autoId === autoId)
    if (!autoID) {
        notFound()
    }

    const { provider, certificatePem, autoScore, linkedApps } = autoID
    const updateAutoScore = useUpdateAutoScore()
    const [showClaimSelector, setShowClaimSelector] = useState(false)

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

    const [, updateClipboard] = useCopyToClipboard();

    const copyAutoId = useCallback(() => {
        toast("Auto-ID copied to clipboard");
        updateClipboard(autoId);
    }, [autoId]);

    const [claimingInfo, setClaimingInfo] = useState<{
        claiming: ReclaimResponseBody, auth: {
            metadata: Metadata;
            signature: string;
        }
    } | null>(null)

    const onStartReclaimProtocolClaim = useCallback(async (hash: SupportedClaimHashes) => {
        console.log("Starting reclaim protocol for claim", hash);

        const auth = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auto-id/start-auth`, {
            method: 'POST',
        }).then(e => e.json()).then(extractFromHttpResponse<{ metadata: Metadata, signature: string }>)


        console.log("Claiming for auto-id", autoId, "claim", hash);


        const claiming = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auto-id/${autoId}/auto-score/reclaim`, {
            method: 'POST',
            body: JSON.stringify({ claimHash: hash }),
        }).then(res => res.json() as Promise<ReclaimResponseBody>)

        setClaimingInfo({ claiming, auth })
        setShowClaimSelector(false)
    }, [])

    const shortenAutoId = useMemo(
        () => middleShortenString(autoId, 12),
        [autoId]
    );

    const pemCertificate = useMemo(() => {
        if (!certificatePem) return null;
        return pemToCertificate(certificatePem).toString();
    }, [certificatePem]);

    const certificateHash = useMemo(() => {
        if (!pemCertificate) {
            return null;
        }

        return blake2b(16)
            .update(Buffer.from(pemCertificate))
            .digest("hex")
            .slice(0, 8);
    }, [certificatePem]);

    const jsonClaims = useMemo(() => autoScore?.data.claims.map(claim => ({ ...claim, serviceId: autoScore.data.serviceId })), [autoScore]);

    const claims = useMemo(() => jsonClaims?.map(claim => constructZkpClaim(claim)) || [], [jsonClaims]);

    const reclaimPendingClaims = useMemo(() => Object.values(SupportedClaimHashes).filter(hash => {
        return !claims.some(claim => claim.claimHash === hash)
    }), []).filter(hash => reclaimSupportsClaimHash(hash))

    const ActionsButton = useMemo(
        () => (
            <DropdownButtons
                buttonText="Actions"
                options={[
                    ...(reclaimPendingClaims.length > 0 ? [{
                        text: "Reclaim Auto-Score",
                        key: "reclaim",
                        onSelected: () => setShowClaimSelector(true)
                    }] : []),
                    {
                        text: "Download Auto-ID certificate",
                        key: "download-certificate",
                        onSelected: () => {
                            if (!pemCertificate) {
                                toast.error("No certificate found");
                                return;
                            }
                            const element = document.createElement("a");
                            const file = new Blob([pemCertificate], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = `auto-id-${certificateHash}.pem`;
                            document.body.appendChild(element);
                            element.click();
                        }
                    },
                    {
                        text: "Copy Auto-ID certificate",
                        key: "copy-certificate",
                        onSelected: () => {
                            if (!pemCertificate) {
                                toast.error("No certificate found");
                                return;
                            }
                            updateClipboard(pemCertificate);
                            toast.success("Certificate copied to clipboard");
                        }
                    },
                    ...(linkedApps?.some(({ provider }) => provider === "discord") ? [] : [{
                        text: <p>Link to Discord</p>,
                        key: "link-discord",
                        onSelected: () => {
                            location.assign(linkToDiscordUrl)
                        }

                    }])
                ]}
            />
        ),
        [certificateHash, pemCertificate, linkToDiscordUrl]
    );

    const ClaimsComp = useMemo(() => claims.map(claim => {
        return <div className="relative w-fit-content h-fit-content">
            <CheckBadgeIcon className="size-4 text-verify absolute right-0 bottom-0" />
            <img src={getProviderImageByHash(claim.claimHash)} alt="Auto-ID Score" className="w-[80px] aspect-square rounded" />
        </div>
    }), [claims])

    const handleReclaimProof = useCallback(async (proof: Proof) => {
        const signatureHash = userSignatureChallenge(claimingInfo!.auth.signature)
        const userSignature = await signMessage(signatureHash)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auto-id/${autoId}/auto-score`, {
            method: 'POST',
            body: JSON.stringify({
                metadata: claimingInfo!.auth.metadata,
                signedTimestamp: claimingInfo!.auth.signature,
                userAutoId: autoId,
                userSignature,
                webZKPserviceId: "reclaim <todo>",
                signedWebZKProof: {
                    type: ZkpClaimType.Reclaim,
                    proof
                }
            }),
        })

        if (response.status !== 200) {
            setClaimingInfo(null)
            toast.error("Failed to issue Auto-Score")
            return
        }

        const body: IssueAutoScoreResponseBody = await response.json()
        if (!body.success) {
            setClaimingInfo(null)
            toast.error("Failed to issue Auto-Score")
            return
        }

        updateAutoScore(autoId, body.data)
        window.location.reload()
        setClaimingInfo(null)
    }, [claimingInfo, autoId, signMessage])

    const score = autoScore?.data.score || 0


    const modal = useMemo(() => {
        if (claimingInfo && claimingInfo.claiming.requestUrl) {
            return <ReclaimQRCode onSuccess={handleReclaimProof} onDismiss={() => setClaimingInfo(null)} {...claimingInfo.claiming} />
        }
        if (showClaimSelector) {
            return <ClaimSelectorModal onClaimSelected={onStartReclaimProtocolClaim} onClose={() => setShowClaimSelector(false)} supportedClaims={reclaimPendingClaims} />
        }
    }, [claimingInfo, showClaimSelector, handleReclaimProof, onStartReclaimProtocolClaim, reclaimPendingClaims])

    return <div className="flex flex-col border border-black rounded p-4 md:w-[60%] w-[80%] bg-slate-50 items-center gap-4">
        <div className="flex flex-row items-center justify-around gap-4 w-full">
            <img
                src={getProviderImageUrl(provider)}
                className="h-[80px] max-w-[33%] aspect-square"
            />
            <div className="flex flex-row gap-2 w-fit-content items-center">
                <div className="text-lg md:text-2xl font-medium">{shortenAutoId}</div>
                <div>
                    <Square2StackIcon
                        onClick={copyAutoId}
                        className="size-6 hover:cursor-pointer"
                    />
                </div>
            </div>
            <span className="w-1/3 hidden md:block">
                {ActionsButton}
            </span>
        </div>
        <span className="w-full md:hidden block">{ActionsButton}</span>
        <div className="flex flex-col w-full h-full lg:flex-row">
            <div className="flex flex-col gap-8 w-full mt-10" style={claims.length === 0 ? { display: 'none' } : {}}>
                <h2 className="text-2xl text-center md:indent-10 md:text-left">
                    Auto-Score
                </h2>
                <div className="flex flex-row gap-8 items-center justify-center md:justify-start">
                    <div style={{ background: `conic-gradient(#929EEA 0% ${score}%, #929EEA40 ${score}% 100%)` }} className="flex rounded-circle w-[100px] h-[100px] justify-center items-center ml-10 rotate-90 mr-10">
                        <div className="flex rounded-circle bg-slate-50 w-[92px] h-[92px] aspect-square justify-center items-center">
                            <span className="text-4xl text-primary font-semibold -rotate-90 ">{score}</span>
                        </div>
                    </div>
                    <div className="hidden min-w-[100px] md:flex flex-row gap-4 justify-center">
                        {ClaimsComp}
                    </div>
                </div>
                <div className="md:hidden min-w-[100px] flex flex-row gap-4 justify-center">
                    {ClaimsComp}
                </div>
            </div>
            {
                linkedApps && <div className="flex flex-col gap-8 w-full mt-10">
                    <h2 className="text-2xl text-center md:indent-10 md:text-left">
                        Apps
                    </h2>
                    <div className="flex flex-row w-full h-full justify-center md:justify-start md:ml-10">
                        {
                            linkedApps.map(e => <a target="_blank" href={e.url}>
                                <img src={getProviderImageUrl(provider)} className="flex rounded-circle bg-slate-50 w-[92px] h-[92px] aspect-square justify-center items-center" />
                            </a>)
                        }
                    </div>
                </div>
            }
        </div>
        {modal}
    </div>
})


