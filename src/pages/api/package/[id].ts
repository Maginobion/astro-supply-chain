import type { APIRoute } from "astro";
import Web3 from "web3";
import ProductPackageContractEntity from "../../../web3/contracts/ProductPackage";

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;

  if (!id) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    });
  }
  
  const result = await ProductPackageContractEntity.methods
      .getCIDsByPackageId(
        Web3.utils.asciiToHex(id).padEnd(66, "0")
      )
      .send({
        from: "0x852262E3ec072f4a91EE8EDBB09532971b3F64cA",
        gas: "5000000",
      });

  return new Response(JSON.stringify(result), {
    status: 200,
    statusText: "OK",
  });
}