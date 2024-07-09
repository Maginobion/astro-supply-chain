import type { APIRoute } from "astro";
import Web3 from "web3";
import envConfig from "../../../config/env/env";
import ProductPackageContractEntity from "../../../web3/contracts/ProductPackage";

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;

  if (!id) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const cids: string[] = await ProductPackageContractEntity.methods
    .getCIDsByPackageId(Web3.utils.asciiToHex(id).padEnd(66, "0"))
    .call({
      from: envConfig.testAddress,
      gas: "5000000",
    });

  const operations = await Promise.all(
    cids.map(async (cid) => {
      const ipfsLink = `https://${cid}.ipfs.w3s.link/`;
      const operation = await (await fetch(ipfsLink)).json();
      return operation;
    })
  );

  return new Response(JSON.stringify(operations), {
    status: 200,
    statusText: "OK",
  });
};
