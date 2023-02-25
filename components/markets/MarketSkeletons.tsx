import { Skeleton } from "@material-ui/lab";

const MarketSkeletons = ({ pageSize }: { pageSize: number }) => {
  const indexes = [...new Array(pageSize)].map((_, idx) => idx);
  return (
    <div className="grid grid-cols-3 gap-[30px]">
      {indexes.map((idx) => {
        return (
          <Skeleton
            height={175}
            className="!rounded-zul-10 !mb-zul-15 !transform-none"
            key={idx}
          />
        );
      })}
    </div>
  );
};

export default MarketSkeletons;
