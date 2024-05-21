import confetti from 'canvas-confetti';
import { useEffect, useState, type FormEventHandler } from 'react';
import type { TProduct } from '../../common/types/product';
import type { TDestination } from '../../common/types/destination';

const DestinationCreator = () => {

    const [destinations, setDestinations] = useState<TDestination[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();
        fetch('/api/getProductsAndDestinations', { signal: abortController.signal })
        .then(response => response.json())
        .then(data => {
            setDestinations(data.destinations);
        }).catch(error => {
            console.error('Error:', error);
        }).finally(()=>{
            setIsLoading(false);
        })
        return () => abortController.abort();
    }, []);
    
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        
        const body = {
            destinationName: data.destinationName,
            destinationAddress: data.destinationAddress,
            destinationStatus: data.destinationStatus === "on",
            destinationType: data.destinationType
        }

        fetch('/api/destination/create', { method: "POST", body: JSON.stringify(body)})
        .then(res=>res.json())
        .then((res) => {
            confetti({
                origin: { y: 1 }
            });
            
            setDestinations(prev=>[...prev, {
                _id: res._id,
                name: res.name,
                address: res.address,
                status: res.status,
                type: res.type
            }])
            
            setIsSubmitting(false);
        }).catch(error => {
            console.error('Error:', error);
            setIsSubmitting(false);
        })
    }

    const handleDelete = (destinationId: string) => {
        if(isDeleting) return;
        setIsDeleting(true);
        fetch('/api/destination/delete', { method: "DELETE", body: JSON.stringify({ destinationId })})
        .then(res=>res.json())
        .then((res) => {
            confetti({
                origin: { y: 1 }
            });
            
            setDestinations(prev=>prev.filter(elem=>elem._id !== destinationId))
            setIsDeleting(false);
        }).catch(error => {
            console.error('Error:', error);
            setIsDeleting(false);
        })
    }

    return (
        <div>
            <div className='p-4 border shadow rounded'>
                <h1 className="mb-2">Create destination</h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className='flex gap-4'>
                        <div>
                            <p>Destination name:</p>
                            <input type='text' name='destinationName' className="border" />
                            <p>Address:</p>
                            <input type='text' name='destinationAddress' className="border" />
                        </div>
                        <div>
                            <p>Status:</p>
                            <input type='checkbox' name='destinationStatus' className="border" />
                            <p>Type:</p>
                            <select name="destinationType" id="destinationType" className="border">
                                <option value="dist-center">Distribution Center</option>
                                <option value="manufacture">Manufacture</option>
                                <option value="warehouse">Warehouse</option>
                                <option value="store">Store</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Submit
                    </button>
                </form>
            </div>
            {
                isLoading ? (
                    <p className='mt-4'>Loading...</p>
                ) : (
                    <div className='mt-4 flex flex-col border shadow rounded divide-y'>
                        {
                            destinations.length === 0 ? (
                                <p className='p-4'>No destinations.</p>
                            ) :
                            destinations.map((destination) => (
                                <div className='p-4 flex gap-4 justify-between hover:bg-[#BFB5AF] relative group' key={destination._id}>
                                    <div className='flex-1'>
                                        <h2>{destination.name}</h2>
                                        <p>{destination.address}</p>
                                    </div>
                                    <div className='flex-1'>
                                        <p>Status: {destination.status ? "✔️" : "❌"}</p>
                                        <p>Type: {destination.type}</p>
                                    </div>
                                    <button 
                                        className='w-6 h-6 absolute right-0 bottom-0 flex items-center justify-center 
                                        bg-red-600 hover:bg-red-500 text-white rounded-tl group-last:rounded-br'
                                        disabled={isDeleting}
                                        onClick={()=>handleDelete(destination._id)}
                                    >
                                        x
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default DestinationCreator;