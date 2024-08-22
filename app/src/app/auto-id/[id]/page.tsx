import { notFound } from 'next/navigation';
import { AutoIdDetails } from '../../../components/AutoIdDetails/AutoIdDetails';


export default function AutoId({ params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) {
        notFound()
    }

    return <AutoIdDetails autoId={id}></AutoIdDetails>
}