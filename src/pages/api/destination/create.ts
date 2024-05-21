import type { APIRoute } from "astro"
import { createDestination } from "../../../lib/repositories/destinationRepository.ts";

export const POST: APIRoute = async ({ params, request }) => {
    try {
        const body = await request.json();
        if(!body.destinationName || !body.destinationAddress || !body.destinationType) {
            return new Response(null, {
                status: 422,
                statusText: 'Unprocessable Entity'
            });
        }
        const newDestination = await createDestination({ 
            name: body.destinationName,
            address: body.destinationAddress,
            status: !!body.destinationStatus,
            type: body.destinationType
         });
        return new Response(JSON.stringify(newDestination), {
            status: 200,
            statusText: 'OK'
        });
    } catch (e: any) {
        console.log(e)
        return new Response(e.message, { status: 500 });
    }
  }
  