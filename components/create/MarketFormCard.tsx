import { Skeleton } from "@material-ui/lab";
import { useStore } from "lib/stores/Store";
import { observer } from "mobx-react";
import { FC } from "react";

const SectionTitle: FC<{ text: string; className?: string }> = ({
  text,
  className = "",
}) => {
  const classes = "text-zul-16-150 font-bold mb-zul-20 " + className;
  return <div className={classes}>{text}</div>;
};

const MarketFormCard: FC<{ header: string }> = observer(
  ({ children, header }) => {
    const store = useStore();

    if (!store.initialized) {
      return (
        <Skeleton className="!transform-none !h-zul-99 w-full !mb-zul-23" />
      );
    }
    return (
      <div
        data-test={header}
        className="p-zul-20 rounded-zul-10 mb-zul-23 bg-sky-100 dark:bg-sky-700"
      >
        <SectionTitle text={header} />
        {children}
      </div>
    );
  },
);

export default MarketFormCard;
