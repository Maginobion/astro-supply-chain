import confetti from "canvas-confetti";
import { useEffect, useRef, useState, type FormEventHandler } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { LocalProductInstance } from "../../../common/types/package";
import useDestinationStore from "../../../stores/destinationStore";
import useProductStore from "../../../stores/productStore";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import AddProductModal from "./AddProductModal";

// only need to know destinations and products here
const PackageCreator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const products = useProductStore((p) => p.products);
  const setProducts = useProductStore((p) => p.setProducts);

  const destinations = useDestinationStore((p) => p.destinations);
  const setDestinations = useDestinationStore((p) => p.setDestinations);

  useEffect(() => {
    if (destinations && products) return setIsLoading(false);
    const abortController = new AbortController();
    fetch("/api/getProductsAndDestinations", { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setDestinations(data.destinations);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => abortController.abort();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    LocalProductInstance[]
  >([]);

  const addProductToPackage = (product: LocalProductInstance) => {
    setSelectedProducts((p) => [...p, product]);
    toast.success("Product added successfully.");
  };

  const removeProductFromPackage = (productLocalId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.localId !== productLocalId)
    );
    toast.success("Product removed successfully.");
  };

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0)
      return toast.error("Add at least one product to the package");

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const body = {
      lpn: data.packageLPN,
      locationId: data.packageLocationId,
      products: selectedProducts,
    };

    setIsSubmitting(true);
    fetch("/api/package/create", { method: "POST", body: JSON.stringify(body) })
      .then((res) => res.json())
      .then((res) => {
        confetti({
          origin: { y: 1 },
        });

        formRef.current?.reset();
        setSelectedProducts([]);
        toast.success("Package created!");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("There was an error submitting the form.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const getProductName = (productId: string) => {
    return products?.find((p) => p._id === productId)?.name;
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <div className="p-4 border shadow rounded min-w-[40rem]">
        <h1 className="mb-2">Create destination</h1>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-4">
            <div className="flex-1">
              <p>LPN (Optional):</p>
              <input
                type="text"
                name="packageLPN"
                className="border py-1 px-2"
              />
            </div>
            <div className="flex-1">
              <p>Location:</p>
              <select name="packageLocationId" className="border py-1 px-2">
                {destinations?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ul className="flex flex-col gap-2 divide-y">
            {selectedProducts.map((prod) => (
              <li
                key={prod.localId}
                className="pt-2 flex justify-between items-center gap-2"
              >
                <div>
                  <div>Name: {getProductName(prod.productId)}</div>
                  <div>Tag: {prod.tag ?? "-"}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex items-center bg-red-500 hover:bg-red-600 p-2 rounded text-white"
                    onClick={() => removeProductFromPackage(prod.localId)}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    type="button"
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white"
                    onClick={() =>
                      setSelectedProducts((prev) =>
                        prev.filter((p) => p.localId !== prod.localId)
                      )
                    }
                  >
                    <EditIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              disabled={isSubmitting}
              className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Add product
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <AddProductModal
          closeModal={() => setShowModal(false)}
          addProductToPackage={addProductToPackage}
        />
      )}
      <Toaster position="bottom-center" />
    </div>
  );
};

export default PackageCreator;
