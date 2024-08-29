import { Proof } from '@reclaimprotocol/js-sdk'
import { useCallback, useEffect } from 'react';
import Modal from 'react-modal'
import QRCode from 'react-qr-code';
import { handleHttpResponse } from '../../utils/http';
import { useMediaQuery } from 'usehooks-ts';

export const ReclaimQRCode = ({
    requestUrl,
    statusUrl,
    onDismiss,
    onSuccess
}: { requestUrl: string, statusUrl: string, onDismiss: () => void, onSuccess: (proof: Proof) => void }) => {

    const checkStatus = useCallback((interval: NodeJS.Timeout) => {
        fetch(statusUrl, { method: 'GET' }).then(handleHttpResponse).then(response => response.json()).then(response => {
            if (response.session.proofs.length > 0) {
                onSuccess(response.session.proofs[0])
                clearInterval(interval)
            }
        }).catch((e) => {
            onDismiss()
        })
    }, [statusUrl, onSuccess, onDismiss])

    useEffect(() => {
        const interval = setInterval(() => checkStatus(interval), 1000)
        return () => clearInterval(interval)
    }, [checkStatus])

    const isMobile = useMediaQuery('(max-width: 640px)')

    return (
        <Modal isOpen={true}
            className="flex flex-col bg-white w-9/10 md:w-1/3 p-6 rounded-lg justify-center gap-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onRequestClose={onDismiss} preventScroll={true}>
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
                <p className="text-sm text-gray-500">2. {!isMobile ? "Scan the QR code" : "Click on the link"} to create your claim</p>
            </div>
            <div className="text-center">
            </div>
            <div className="flex justify-center">
                {isMobile ? <a className='underline' href={requestUrl} target='_blank'>{requestUrl}</a> : <QRCode className='text-black bg-white' value={requestUrl} />}
            </div>
        </Modal>
    )
};
