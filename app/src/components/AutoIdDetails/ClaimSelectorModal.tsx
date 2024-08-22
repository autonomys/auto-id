
import React, { useCallback } from 'react';
import { SupportedClaimHashes } from '@autonomys/auto-id';
import { getProviderImageByHash } from './utils';
import ReactModal from 'react-modal';

interface ClaimSelectorModalProps {
    supportedClaims: SupportedClaimHashes[];
    onClaimSelected: (claim: SupportedClaimHashes) => void;
    onClose: () => void;
}

export const ClaimSelectorModal: React.FC<ClaimSelectorModalProps> = ({
    supportedClaims,
    onClaimSelected,
    onClose
}) => {
    const [loading, setLoading] = React.useState<SupportedClaimHashes | null>(null);

    const handleClaimClick = useCallback(async (claim: SupportedClaimHashes) => {
        setLoading(claim);
        onClaimSelected(claim);
    }, [setLoading, onClaimSelected])

    return (
        <ReactModal
            isOpen={true}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            className="flex flex-col bg-white w-9/10 md:w-1/3 p-6 rounded-lg justify-center gap-4 items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl text-center mb-4">Select your claim</h2>
            <div className="flex flex-row gap-4 justify-center">
                {supportedClaims.map((claim) => (
                    <div
                        key={claim}
                        className={`cursor-pointer ${loading === claim ? 'opacity-10' : 'hover:opacity-75'} transition-opacity relative flex justify-center items-center relative`}
                        onClick={() => handleClaimClick(claim)}
                    >
                        <img
                            src={getProviderImageByHash(claim)}
                            alt={claim}
                            className="w-20 h-20 object-contain"
                        />
                        {
                            loading === claim && <span className='absolute top-0 bottom-0 right-0 left-0 m-auto w-10 h-10'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="animate-spin h-10 w-10 mr-3" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </span>
                        }
                    </div>
                ))}
            </div>
            <div className='flex justify-center'>
                <button
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={onClose}
                    disabled={loading !== null}
                >
                    Close
                </button>
            </div>
        </ReactModal >
    );
};
