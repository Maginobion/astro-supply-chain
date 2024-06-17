import confetti from "canvas-confetti";
import {
  useEffect,
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import type { SendPackageDTO } from "../../../common/endpoints/sendPackageToDestination";
import useDestinationStore from "../../../stores/destinationStore";
import usePackageStore from "../../../stores/packageStore";
import useProductStore from "../../../stores/productStore";
import { sendPackagesToDestination } from "../services/PackageService";
import PackageItem from "./PackageItem";

const PackageDashboard = () => {
  const products = useProductStore((p) => p.products);
  const setProducts = useProductStore((p) => p.setProducts);

  const destinations = useDestinationStore((p) => p.destinations);
  const setDestinations = useDestinationStore((p) => p.setDestinations);

  const packages = usePackageStore((p) => p.packages);
  const setPackages = usePackageStore((p) => p.setPackages);

  useEffect(() => {
    if (destinations && packages && products) return;
    const abortController = new AbortController();
    fetch("/api/getProductsAndDestinations", { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setDestinations(data.destinations);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    fetch("/api/package/getAll", { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        setPackages(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    return () => abortController.abort();
  }, []);

  const [selectedPackagesIds, setSelectedPackagesIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (selectedPackagesIds.length === 0)
      return toast.error("Please select at least one package");

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const body = {
      originId: data.originId,
      destinationId: data.destinationId,
      packages: selectedPackagesIds,
    } as SendPackageDTO;

    if (body.originId === body.destinationId)
      return toast.error("Choose a destination different than the origin");

    setIsSubmitting(true);
    sendPackagesToDestination(body)
      .then((response) => response.json())
      .then(() => {
        confetti({
          origin: { y: 1 },
        });
        toast.success("Packages successfully sent!");

        const newPackages = packages!.map((p) => ({
          ...p,
          locationId: selectedPackagesIds.includes(p._id)
            ? body.destinationId
            : p.locationId,
        }));
        setPackages(newPackages);

        setSelectedPackagesIds([]);
      })
      .catch((error) => {
        toast.error(
          "There was an error sending the package. Please try again."
        );
        console.error("Error:", error);
      })
      .finally(() => setIsSubmitting(false));
  };

  const toggleListItem = (packageId: string) => {
    const packageSet = new Set(selectedPackagesIds);
    if (packageSet.has(packageId)) packageSet.delete(packageId);
    else packageSet.add(packageId);
    setSelectedPackagesIds([...packageSet]);
  };

  const [selectedOriginId, setSelectedOriginId] = useState<string | null>(null);

  if (!packages || !destinations) return <p>Loading...</p>;

  const destinationPackages = selectedOriginId
    ? packages.filter((p) => p.locationId === selectedOriginId)
    : [];

  const handleOriginChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedPackagesIds([]);
    setSelectedOriginId(e.target.value);
  };

  return (
    <div className="border shadow p-4 rounded">
      <h1 className="mb-2">Send packages</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="fixed border shadow-md p-4 top-10 left-20 flex flex-col">
          <p>Choose an origin:</p>
          <select
            name="originId"
            className="border"
            onChange={handleOriginChange}
          >
            <option value={"No value"}>---Choose an option---</option>
            {destinations.map((destination) => (
              <option key={destination._id} value={destination._id}>
                {destination.name}
              </option>
            ))}
          </select>
        </div>
        <p>Choose a package:</p>
        <ul className="divide-y">
          {destinationPackages.length === 0 ? (
            <p>No packages in this location.</p>
          ) : (
            destinationPackages.map((pack) => (
              <PackageItem
                key={pack._id}
                pack={pack}
                toggleSelect={() => toggleListItem(pack._id)}
                isSelected={selectedPackagesIds.some((p) => p === pack._id)}
              />
            ))
          )}
        </ul>
        <div className="fixed border shadow-md p-4 top-10 right-10 flex flex-col">
          <p>Choose a destination:</p>
          <select name="destinationId" className="border">
            {destinations.map((destination) => (
              <option key={destination._id} value={destination._id}>
                {destination.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Submit
          </button>
        </div>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default PackageDashboard;
