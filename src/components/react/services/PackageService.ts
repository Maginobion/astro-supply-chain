import type { SendPackageDTO } from "../../../common/endpoints/sendPackageToDestination";

export const sendPackagesToDestination = (body: SendPackageDTO) => {
  return fetch("/api/sendPackagesToDestination", {
    method: "POST",
    body: JSON.stringify(body),
  });
};
