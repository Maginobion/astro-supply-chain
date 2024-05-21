import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ params, request }) => {
    try {
        const body = await request.json();
        if(!body.productId || !body.destinationId) {
            return new Response(null, {
                status: 422,
                statusText: 'Unprocessable Entity'
            });
        }
        return new Response(null, {
            status: 200,
            statusText: 'OK'
        });
    } catch (e: any) {
        console.log(e)
        return new Response(e.message, { status: 500 });
    }
  }
  