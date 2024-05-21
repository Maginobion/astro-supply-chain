import confetti from 'canvas-confetti';
import { useEffect, useState, type FormEventHandler } from 'react';
import type { TProduct } from '../../common/types/product';

const ProductCreator = () => {

    const [products, setProducts] = useState<TProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();
        fetch('/api/getProductsAndDestinations', { signal: abortController.signal })
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
        fetch('/api/product/create', { method: "POST", body: JSON.stringify(data)})
        .then((res) => {
            confetti({
                origin: { y: 1 }
            });
            res.json().then(res=>
                setProducts(prev=>[...prev, {
                    _id: res._id,
                    name: res.name,
                    description: res.description,
                    price: res.price,
                    stock: res.stock
                }])
            )
            setIsSubmitting(false);
        }).catch(error => {
            console.error('Error:', error);
            setIsSubmitting(false);
        })
    }

    const handleDelete = (productId: string) => {
        if(isDeleting) return;
        setIsDeleting(true);
        fetch('/api/product/delete', { method: "DELETE", body: JSON.stringify({ productId })})
        .then(res=>res.json())
        .then((res) => {
            confetti({
                origin: { y: 1 }
            });
            
            setProducts(prev=>prev.filter(elem=>elem._id !== productId))
            setIsDeleting(false);
        }).catch(error => {
            console.error('Error:', error);
            setIsDeleting(false);
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
                    <div className='mt-4 flex flex-col border shadow rounded divide-y'>
                        {
                            products.length === 0 ? (
                                <p className='p-4'>No products.</p>
                            ) :
                            products.map((product) => (
                                <div className='p-4 flex gap-4 justify-between group hover:bg-[#BFB5AF] relative' key={product._id}>
                                    <div className='flex-1'>
                                        <h2>{product.name}</h2>
                                        <p>{product.description}</p>
                                    </div>
                                    <div className='flex-1'>
                                        <p>Price: ${product.price}</p>
                                        <p>Stock: {product.stock}</p>
                                    </div>
                                    <button 
                                        className='w-6 h-6 absolute right-0 bottom-0 flex items-center justify-center 
                                        bg-red-600 hover:bg-red-500 text-white rounded-tl group-last:rounded-br'
                                        disabled={isDeleting}
                                        onClick={()=>handleDelete(product._id)}
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

export default ProductCreator;