import type { APIRoute } from "astro"
import { getProducts } from "../lib/repositories/productRepository.ts";

export type Destination = {
    id: string;
    name: string;
}

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const products = await getProducts();
        const destinations: Destination[] = [
            {
                id: 'home',
                name: 'Home'
            }, {
                id: 'work',
                name: 'Work'
            }, {
                id: 'gym',
                name: 'Gym'
            }
        ]
        return new Response(JSON.stringify({products, destinations}), {
            status: 200,
            statusText: 'OK'
        });
    } catch (e: any) {
        console.log(e)
        return new Response(e.message, { status: 500 });
    }
  }
  