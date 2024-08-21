import { Proof } from '@reclaimprotocol/js-sdk'
import { useCallback, useEffect } from 'react';
import Modal from 'react-modal'
import QRCode from 'react-qr-code';

export const ReclaimQRCode = ({
    requestUrl,
    statusUrl,
    onDismiss,
    onSuccess
}: { requestUrl: string, statusUrl: string, onDismiss: () => void, onSuccess: (proof: Proof) => void }) => {

    const checkStatus = useCallback((interval: NodeJS.Timeout) => {
        fetch(statusUrl, { method: 'GET' }).then(response => response.json()).then(response => {
            if (response.session.proofs.length > 0) {
                onSuccess(response.session.proofs[0])
                clearInterval(interval)
            }
        }).catch((e) => {
            console.log(e)
            onDismiss()
        })
    }, [statusUrl, onSuccess, onDismiss])

    useEffect(() => {
        const interval = setInterval(() => checkStatus(interval), 1000)
        return () => clearInterval(interval)
    }, [checkStatus])

    return (
        <Modal isOpen={true} className="flex flex-col" onRequestClose={onDismiss} preventScroll={true}>
            <div className="flex flex-col w-1/2 bg-slate-50 h-content absolute top-0 bottom-0 left-0 right-0 m-auto p-4 gap-2">
                <div className="text-center flex flex-col items-center gap-2">
                    <span>
                        1. Install Reclaim Protocol app
                    </span>
                    <span className="flex flex-row text-sm text-gray-500 items-center gap-4">
                        <a href='https://play.google.com/store/apps/details?id=com.reclaim.protocol&hl=en&pli=1' target='_blank'>
                            <img className='h-8 aspect-square rounded' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb5LOPUgzjbz_m4aVulC-GU5zu-30HBdYnAg&s' />
                        </a>
                        <a href='https://apps.apple.com/in/app/reclaim-protocol/id6475267895' target='_blank'>
                            <img className='h-8 aspect-square rounded' src='https://www.apple.com/v/app-store/b/images/overview/icon_appstore__ev0z770zyxoy_large_2x.png' />
                        </a>
                    </span>
                    <p className="text-sm text-gray-500">2. Scan the QR code to create your claim</p>
                </div>
                <div className="text-center">
                </div>
                <div className="flex justify-center">
                    <QRCode value={requestUrl} />
                </div>
            </div>
        </Modal>
    )
};
