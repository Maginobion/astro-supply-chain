import type { APIRoute } from "astro";
import Web3 from "web3";
import type { SendPackageDTO } from "../../common/endpoints/sendPackageToDestination";
import ipfsClient from "../../ipfs/config";
import {
  getPackagesById,
  updatePackagesLocation,
} from "../../lib/repositories/packageRepository";
import ProductPackageContractEntity from "../../web3/contracts/ProductPackage";

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

    const submittedPackages = await Promise.all(
      packages.map(async (currPackage) => {
        const actionJson = {
          type: "transfer",
          from: currPackage.locationId,
          to: body.destinationId,
        };

        const jsonString = JSON.stringify(actionJson, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const file = new File([blob], "productData.json", {
          type: "application/json",
        });
        const res = await ipfsClient.uploadFile(file);
        console.log(res);
        return {
          packageId: String(currPackage._id),
          cid: String(res),
        };
      })
    );

    if (!submittedPackages) {
      return new Response(null, {
        status: 500,
        statusText: "There was an error saving the changes.",
      });
    }

    await Promise.all(
      submittedPackages.map(async (submittedData) => {
        const result = await ProductPackageContractEntity.methods
          .addPackageData(
            submittedData.cid,
            Web3.utils.asciiToHex(submittedData.packageId).padEnd(66, "0")
          )
          .send({
            from: "0x852262E3ec072f4a91EE8EDBB09532971b3F64cA",
            gas: "5000000",
          });

        console.log(result.effectiveGasPrice);
      })
    )

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      statusText: "OK",
    });
  } catch (e: any) {
    console.log(e);
    return new Response(e.message, { status: 500 });
  }
};
