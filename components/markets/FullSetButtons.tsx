import { useMarket } from "lib/hooks/queries/useMarket";
import { useMarketIsTradingEnabled } from "lib/hooks/queries/useMarketIsTradingEnabled";
import { useModalStore } from "lib/stores/ModalStore";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import BuyFullSetModal from "./BuyFullSetModal";
import SellFullSetModal from "./SellFullSetModal";

const FullSetButtons = observer(({ marketId }: { marketId: number }) => {
  const modalStore = useModalStore();
  const modalOptions = {
    styles: { width: "304px" },
  };

  const handleBuyFullSetClick = () => {
    modalStore.openModal(
      <BuyFullSetModal marketId={marketId} />,
      "Buy Full Set",
      modalOptions,
    );
  };

  const handleSellFullSetClick = () => {
    modalStore.openModal(
      <SellFullSetModal marketId={marketId} />,
      "Sell Full Set",
      modalOptions,
    );
  };

  const { data: market } = useMarket({ marketId });
  const enabled = useMarketIsTradingEnabled(market);

  return (
    <div className="hidden sm:block">
      {enabled ? (
        <>
          <button
            onClick={handleBuyFullSetClick}
            className="h-zul-19 ml-zul-20 text-sky-600 border-sky-600 rounded-zul-100 border-2 text-zul-10-150 px-zul-10 font-bold"
          >
            Buy Full Set
          </button>
          <button
            onClick={handleSellFullSetClick}
            className="h-zul-19 ml-zul-15 text-sky-600 border-sky-600 rounded-zul-100 border-2 text-zul-10-150 px-zul-10 font-bold"
          >
            Sell Full Set
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
});

export default dynamic(() => Promise.resolve(FullSetButtons), {
  ssr: false,
});
