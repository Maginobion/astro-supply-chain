import { useEffect } from "react";
import { getPackageHistory } from "./services/PackageService";

type PackageDetailsProps = {
  packageId: string;
};

const PackageDetails = ({ packageId }: PackageDetailsProps) => {
  useEffect(() => {
    getPackageHistory(packageId).then(() => {
      console.log(packageId);
    });
  });

  return <h2>{packageId}</h2>;
};

export default PackageDetails;
