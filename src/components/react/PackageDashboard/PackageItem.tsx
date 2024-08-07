import type { TPackage } from "../../../common/types/package";
import useDestinationStore from "../../../stores/destinationStore";
import useProductStore from "../../../stores/productStore";
import AddIcon from "../icons/AddIcon";
import DeleteIcon from "../icons/DeleteIcon";
import InfoIcon from "../icons/InfoIcon";

type ProductItemProps = {
  serial: string;
  productId: string;
  tag: string;
};

const ProductItem = ({ serial, productId, tag }: ProductItemProps) => {
  const products = useProductStore((p) => p.products);
  const currentItemName = products?.find((p) => p._id === productId)?.name;
  return (
    <li key={serial}>
      <div>Id: {productId}</div>
      <div>Product name: {currentItemName}</div>
      <div>Serial: {serial}</div>
      <div>Tag: {tag ?? "-"}</div>
    </li>
  );
};

type PackageItemProps = {
  pack: TPackage;
  isSelected: boolean;
  toggleSelect: () => void;
};

const PackageItem = ({ pack, isSelected, toggleSelect }: PackageItemProps) => {
  const destinations = useDestinationStore((p) => p.destinations);
  const currentLocation = destinations?.find(
    (d) => d._id === pack.locationId
  )?.name;
  return (
    <li className="flex-col p-2">
      <header className="w-full flex justify-between">
        <div className="flex gap-2">
          <b>LPN: {pack.lpn}</b>
          <span>Location: {currentLocation}</span>
        </div>
        <div className="flex gap-2">
          <a href={"/" + String(pack._id)}>
            <button
              type="button"
              className={"flex p-2 rounded bg-blue-400 hover:bg-blue-600"}
              onClick={toggleSelect}
            >
              <InfoIcon />
            </button>
          </a>
          <button
            type="button"
            className={
              "flex p-2 rounded " +
              (isSelected
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600")
            }
            onClick={toggleSelect}
          >
            {isSelected ? <DeleteIcon /> : <AddIcon />}
          </button>
        </div>
      </header>
      <div>
        <div>Contents ({pack.contents.length}):</div>
        <ul className="flex flex-col gap-2">
          {pack.contents.slice(0, 3).map((p) => (
            <ProductItem
              key={p.serial}
              serial={p.serial}
              productId={p.productId}
              tag={p.tag}
            />
          ))}
        </ul>
      </div>
    </li>
  );
};

export default PackageItem;
