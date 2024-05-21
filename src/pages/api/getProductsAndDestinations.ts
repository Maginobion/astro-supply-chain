import type { APIRoute } from "astro"
import { getProducts } from "../../lib/repositories/productRepository.ts";
import { getDestinations } from "../../lib/repositories/destinationRepository.ts";

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const products = await getProducts();
        const destinations = await getDestinations();
        return new Response(JSON.stringify({products, destinations}), {
            status: 200,
            statusText: 'OK'
        });
    } catch (e: any) {
        console.log(e)
        return new Response(e.message, { status: 500 });
    }
  }
  