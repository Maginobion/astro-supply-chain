import type { APIRoute } from "astro";
import { getPackages } from "../../../lib/repositories/packageRepository.ts";

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const packages = await getPackages();
    return new Response(JSON.stringify(packages), {
      status: 200,
      statusText: "OK",
    });
  } catch (e: any) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
};
