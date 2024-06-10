import type { APIRoute } from "astro";
import { MongooseError } from "mongoose";
import type {
  LocalProductInstance,
  ProductInstance,
} from "../../../common/types/package.ts";
import {
  createPackage,
  isProductTagUnique,
} from "../../../lib/repositories/packageRepository.ts";

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const body = await request.json();
    if (!body.products || !body.locationId) {
      return new Response(null, {
        status: 422,
        statusText: "Unprocessable Entity",
      });
    }
    const isProductsInvalid = await validateProductsTag(
      body.products as LocalProductInstance[]
    );
    if (isProductsInvalid) {
      return new Response(null, {
        status: 422,
        statusText: "Unprocessable Entity",
      });
    }
    const newProducts: ProductInstance[] = (
      body.products as LocalProductInstance[]
    ).map((p) => ({
      productId: p.productId,
      serial: crypto.randomUUID(),
      tag: p.tag,
    }));
    const newPackage = await createPackage({
      lpn: body.lpn === "" ? crypto.randomUUID() : body.lpn,
      locationId: body.locationId,
      contents: newProducts,
    });
    return new Response(JSON.stringify(newPackage), {
      status: 200,
      statusText: "OK",
    });
  } catch (e: any) {
    if (e instanceof MongooseError) {
      return new Response(e.message, { status: 500 });
    }
    return new Response(e.message, { status: 500 });
  }
};

const validateProductsTag = async (
  products: LocalProductInstance[]
): Promise<boolean> => {
  const checks = products.map(async (p) => {
    const isTagUnique = await isProductTagUnique(p.tag);
    return !isTagUnique;
  });

  const results = await Promise.all(checks);
  return results.some((result) => result);
};
