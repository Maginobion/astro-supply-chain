import type { FormEventHandler } from "react";
import type { LocalProductInstance } from "../../../common/types/package";
import useProductStore from "../../../stores/productStore";

type AddProductModalProps = {
  closeModal: () => void;
  addProductToPackage: (product: LocalProductInstance) => void;
};

const AddProductModal = ({
  closeModal,
  addProductToPackage,
}: AddProductModalProps) => {
  const products = useProductStore((p) => p.products);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const localProduct: LocalProductInstance = {
      productId: data.productId.toString(),
      localId: crypto.randomUUID(),
      tag: data.productTag.toString(),
    };
    addProductToPackage(localProduct);
  };

  return (
    <div className="fixed h-screen w-screen top-0 left-0 flex items-center bg-[#80808045]">
      <div onClick={closeModal} className="absolute h-screen w-screen "></div>
      <dialog open className="min-w-[20rem] bg-white shadow-md p-4 rounded">
        <header className="border-b border-gray-500 pb-2 mb-2">
          Add product to package
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <p>Product:</p>
            <select name="productId" className="border py-1 px-2">
              {products?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p>Tag (Optional):</p>
            <input type="text" name="productTag" className="border py-1 px-2" />
          </div>
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add product
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default AddProductModal;
