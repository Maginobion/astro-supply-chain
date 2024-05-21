import type { APIRoute } from "astro"
import { deleteDestination } from "../../../lib/repositories/destinationRepository.ts";

export const DELETE: APIRoute = async ({ params, request }) => {
    try {
        const body = await request.json();
        if(!body.destinationId) {
            return new Response(null, {
                status: 422,
                statusText: 'Unprocessable Entity'
            });
        }
        const result = await deleteDestination(body.destinationId);
        return new Response(JSON.stringify({ result }), {
            status: 200,
            statusText: 'OK'
        });
    } catch (e: any) {
        console.log(e)
        return new Response(e.message, { status: 500 });
    }
  }
  