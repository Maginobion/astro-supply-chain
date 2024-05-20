import confetti from 'canvas-confetti';
import { useEffect, useState, type FormEventHandler } from 'react';
import type { Destination } from '../../pages/getProductsAndDestinations';
import type { TProduct } from '../../common/types/product';

const ProductPicker = () => {

    const [products, setProducts] = useState<TProduct[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);

    useEffect(() => {
        const abortController = new AbortController();
        fetch('/getProductsAndDestinations', { signal: abortController.signal })
        .then(response => response.json())
        .then(data => {
            setProducts(data.products);
            setDestinations(data.destinations);
        }).catch(error => {
            console.error('Error:', error);
        })
        return () => abortController.abort();
    }, []);
    
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        fetch('/sendProductToDestination', { method: "POST", body: JSON.stringify(data)})
        .then(() => {
            confetti({
                origin: { y: 1 }
            });
        }).catch(error => {
            console.error('Error:', error);
        })
    }

    return (
        <div>
            <h1 className="mb-2">Send product</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <p>Choose a product:</p>
                <select name="productId" className="border">
                    {
                        products.map((product) => (
                            <option key={product._id} value={product._id}>{product.name}</option>
                        ))
                    }
                </select>
                <p className='mt-2'>Choose a new destination</p>
                <select name="destinationId" className="border">
                    {
                        destinations.map((destination) => (
                            <option key={destination.id} value={destination.id}>{destination.name}</option>
                        ))
                    }
                </select>
                <button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ProductPicker;