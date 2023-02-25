import { MarketFilter } from "lib/types/market-filter";
import { X } from "react-feather";
import { ClearAllBtn } from "./ui";

export type MarketActiveFilterProps = {
  filter: MarketFilter;
  onRemove: (filter: MarketFilter) => void;
};

export const MarketActiveFilterItem = ({
  filter,
  onRemove,
}: MarketActiveFilterProps) => {
  return (
    <div className="flex px-zul-10 py-zul-5 rounded-zul-5 bg-sky-200 text-gray-800 font-normal text-zul-14-150 gap-zul-5">
      <button onClick={() => onRemove(filter)}>
        <X size={16} className="text-gray-800"></X>
      </button>
      {filter.label}
    </div>
  );
};

export type MarketActiveFiltersProps = {
  filters: MarketFilter[];
  onClear: () => void;
  onFilterRemove: (filter: MarketFilter) => void;
};

export const MarketActiveFilters = ({
  filters,
  onClear,
  onFilterRemove,
}: MarketActiveFiltersProps) => {
  return (
    <div className="flex gap-[10px] mt-[10px]">
      {filters?.length > 0 && <ClearAllBtn clear={onClear} />}
      {filters?.map((af, idx) => (
        <MarketActiveFilterItem
          filter={af}
          onRemove={onFilterRemove}
          key={`af-${idx}`}
        />
      ))}
    </div>
  );
};
