import type { APIRoute } from "astro"
import { createProduct, deleteProduct, getProducts } from "../../../lib/repositories/productRepository.ts";

export const DELETE: APIRoute = async ({ params, request }) => {
    try {
        const body = await request.json();
        if(!body.productId) {
            return new Response(null, {
                status: 422,
                statusText: 'Unprocessable Entity'
            });
        }
        const result = await deleteProduct(body.productId);
        return new Response(JSON.stringify({ result }), {
            status: 200,
            statusText: 'OK'
        });
    } catch (e: any) {
        console.log(e)
        return new Response(e.message, { status: 500 });
    }
  }
  