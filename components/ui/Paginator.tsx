import { observer } from "mobx-react";
import { Plus } from "react-feather";

type PaginatorProps = {
  disabled?: boolean;
  onPlusClicked?: () => void;
};

const Paginator = observer(
  ({ disabled = false, onPlusClicked = () => {} }: PaginatorProps) => {
    const handlePlusClicked = () => {
      onPlusClicked();
    };
    return (
      <div className="mt-zul-40 w-full flex justify-center items-center">
        <div className="w-zul-184 flex flex-col">
          <div className="flex flex-row h-zul-24 justify-center items-center">
            <Plus
              onClick={() => {
                if (!disabled) {
                  handlePlusClicked();
                }
              }}
              size={24}
              className={
                !disabled ? "cursor-pointer" : "cursor-default opacity-20"
              }
            />
          </div>
          <div className="flex flex-row h-zul-38 justify-center">
            <div
              className={
                "text-zul-12-150 font-medium w-zul-164 h-full flex items-center justify-center " +
                (!disabled ? "cursor-pointer" : "cursor-default opacity-20")
              }
            >
              Load more
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default Paginator;
