import type { APIRoute } from "astro";
import { MongooseError } from "mongoose";
import Web3 from "web3";
import type {
  LocalProductInstance,
  ProductInstance,
  TPackage,
} from "../../../common/types/package.ts";
import envConfig from "../../../config/env/env.ts";
import ipfsClient from "../../../config/ipfs/config.ts";
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

    const productRef = newProducts[0];
    console.log(productRef);

    const actionJson = {
      type: "create",
      data: {
        _id: newPackage._id,
        contents: newPackage.contents,
        locationId: newPackage.locationId,
        lpn: newPackage.lpn,
      } as TPackage,
    };

    const jsonString = JSON.stringify(actionJson, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const file = new File([blob], "productData.json", {
      type: "application/json",
    });
    const res = await ipfsClient.uploadFile(file);

    await ProductPackageContractEntity.methods
      .addPackageData(
        String(res),
        Web3.utils.asciiToHex(String(newPackage._id)).padEnd(66, "0")
      )
      .send({
        from: envConfig.testAddress,
        gas: "5000000",
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
