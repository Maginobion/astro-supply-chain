import type { APIRoute } from "astro"
import { createProduct, getProducts } from "../../../lib/repositories/productRepository.ts";

export const POST: APIRoute = async ({ params, request }) => {
    try {
        const body = await request.json();
        if(!body.productName || !body.productPrice || !body.productStock || !body.productDescription) {
            return new Response(null, {
                status: 422,
                statusText: 'Unprocessable Entity'
            });
        }
        const newProduct = await createProduct({ 
            name: body.productName,
            price: body.productPrice,
            stock: body.productStock,
            description: body.productDescription
         });
        return new Response(JSON.stringify(newProduct), {
            status: 200,
            statusText: 'OK'
        });
    } catch (e: any) {
        console.log(e)
        return new Response(e.message, { status: 500 });
    }
  }
  