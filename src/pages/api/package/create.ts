import type { APIRoute } from "astro";
import { MongooseError } from "mongoose";
import Web3 from "web3";
import type {
  LocalProductInstance,
  ProductInstance,
} from "../../../common/types/package.ts";
import {
  createPackage,
  isProductTagUnique,
} from "../../../lib/repositories/packageRepository.ts";
import ProductPackageContractEntity from "../../../web3/contracts/ProductPackage.ts";

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
    
    const productRef = newProducts[0]

    const result = await ProductPackageContractEntity.methods
    .createProduct(
      productRef.productId, 
      Web3.utils.asciiToHex("Randomamam").padEnd(66, '0'), 
      21, 
      Web3.utils.asciiToHex("Heyyyy this is a descriptioning").padEnd(66, '0')
    ).send({
      from: "0xD4779Bf40C2166bec03DA0F863fE4C345A5DeD8D"
    })

    console.log(result)
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
