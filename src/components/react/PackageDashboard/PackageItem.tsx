import type { TPackage } from "../../../common/types/package";
import useDestinationStore from "../../../stores/destinationStore";
import AddIcon from "../icons/AddIcon";
import DeleteIcon from "../icons/DeleteIcon";

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
        <button
          type="button"
          className={
            "flex gap-4 p-2 rounded " +
            (isSelected
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600")
          }
          onClick={toggleSelect}
        >
          {isSelected ? <DeleteIcon /> : <AddIcon />}
        </button>
      </header>
      <div>
        <div>Contents ({pack.contents.length}):</div>
        <ul className="flex flex-col gap-2">
          {pack.contents.slice(0, 3).map((p) => (
            <li key={p.serial}>
              <div>Id: {p.productId}</div>
              <div>Serial: {p.serial}</div>
              <div>Tag: {p.tag ?? "-"}</div>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default PackageItem;
