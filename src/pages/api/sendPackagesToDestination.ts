import type { APIRoute } from "astro";
import type { SendPackageDTO } from "../../common/endpoints/sendPackageToDestination";
import {
  getPackagesById,
  updatePackagesLocation,
} from "../../lib/repositories/packageRepository";

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const body: SendPackageDTO = await request.json();
    if (
      !body.originId ||
      !body.destinationId ||
      !Array.isArray(body.packages) ||
      body.packages.length === 0
    ) {
      return new Response(null, {
        status: 422,
        statusText: "Unprocessable Entity",
      });
    }

    const packages = await getPackagesById(body.packages);
    if (packages.length === 0) {
      return new Response(null, {
        status: 404,
        statusText: "No packages found.",
      });
    }

    const packagesWereUpdatedRecently = packages.some(
      (p) => p.locationId !== body.originId
    );

    if (packagesWereUpdatedRecently) {
      return new Response(null, {
        status: 422,
        statusText:
          "There was an error processing this request. Please try again.",
      });
    }

    const success = await updatePackagesLocation(
      body.packages,
      body.destinationId
    );
    if (!success) {
      return new Response(null, {
        status: 422,
        statusText:
          "There was an error processing this request. Please try again.",
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      statusText: "OK",
    });
  } catch (e: any) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
};
