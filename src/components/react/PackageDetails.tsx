import { useEffect, useState } from "react";
import { getPackageHistory } from "./services/PackageService";

type PackageDetailItemProps = {
  type: "create" | "transfer";
  data: any;
};

type Item = {
  productId: string;
  serial: string;
  tag: string;
  _id: string;
};

const PackageDetailItem = ({ type, data }: PackageDetailItemProps) => {
  if (type === "transfer")
    return (
      <li className="border mb-4 p-4 rounded">
        <p>Type: Transfer</p>
        <p>From: {data.from}</p>
        <p>To: {data.to}</p>
      </li>
    );

  if (type === "create")
    return (
      <li className="border mb-4 p-4 rounded">
        <p>Type: Package created</p>
        <p>Location: {data.data.locationId}</p>
        <p>Package LPN: {data.data.lpn}</p>
        <p>Contents:</p>
        <ul>
          {data.data.contents.map((item: Item) => (
            <li key={item._id}>
              <p>Serial: {item.serial}</p>
              <p>Tag: {item.tag}</p>
              <p>Product: {item.productId}</p>
            </li>
          ))}
        </ul>
      </li>
    );

  return null;
};

type PackageDetailsProps = {
  packageId: string;
};

const PackageDetails = ({ packageId }: PackageDetailsProps) => {
  const [loading, setLoading] = useState(true);
  const [packageHistory, setPackageHistory] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPackageHistory(packageId)
      .then((res) => res.json())
      .then((res) => {
        if (res.length === 0) setError("This package has no registry data.");
        setLoading(false);
        setPackageHistory(res);
      })
      .catch((error) => {
        error.json().then((err: string) => setError(err));
      });
  }, []);

  if (error)
    return (
      <main>
        <h2>Error retrieving package data:</h2>
        <p>{error}</p>
      </main>
    );

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h2 className="py-4">History for Package: {packageId}</h2>
      <ul>
        {packageHistory.map((history, i) => (
          <PackageDetailItem key={i} type={history.type} data={history} />
        ))}
      </ul>
    </main>
  );
};

export default PackageDetails;
