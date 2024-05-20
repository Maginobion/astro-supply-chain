import confetti from 'canvas-confetti';
import { useEffect, useState, type FormEventHandler } from 'react';
import type { TProduct } from '../../common/types/product';

const ProductCreator = () => {

    const [products, setProducts] = useState<TProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        fetch('/getProductsAndDestinations', { signal: abortController.signal })
        .then(response => response.json())
        .then(data => {
            setProducts(data.products);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error:', error);
            setIsLoading(false);
        })
        return () => abortController.abort();
    }, []);
    
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        fetch('/createProduct', { method: "POST", body: JSON.stringify(data)})
        .then(() => {
            confetti({
                origin: { y: 1 }
            });
            setIsSubmitting(false);
        }).catch(error => {
            console.error('Error:', error);
            setIsSubmitting(false);
        })
    }

    return (
        <div>
            <div className='p-4 border shadow rounded'>
                <h1 className="mb-2">Create product</h1>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className='flex gap-4'>
                        <div>
                            <p>Product name:</p>
                            <input type='text' name='productName' className="border" />
                            <p>Description:</p>
                            <input type='text' name='productDescription' className="border" />
                        </div>
                        <div>
                            <p>Price:</p>
                            <input type='number' name='productPrice' className="border" />
                            <p>Initial Stock:</p>
                            <input type='number' name='productStock' className="border" />
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
                    <div className='mt-4 flex flex-col border rounded divide-y'>
                        {
                            products.map((product) => (
                                <div className='p-4 flex gap-4 justify-between hover:bg-[#BFB5AF]' key={product._id}>
                                    <div>
                                        <h2>{product.name}</h2>
                                        <p>{product.description}</p>
                                    </div>
                                    <div>
                                        <p>Price: ${product.price}</p>
                                        <p>Stock: {product.stock}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ProductCreator;