import { transactionErrorToString } from "@zulustation/rpc";
import { Context, hasMarketMethods } from "@zulustation/sdk-next";
import { Market } from "@zulustation/sdk/dist/models";
import { isRight } from "@zulustation/utility/dist/either";
import { AmountInput } from "components/ui/inputs";
import TransactionButton from "components/ui/TransactionButton";
import Decimal from "decimal.js";
import { ZUL } from "lib/constants";
import { useAccountPoolAssetBalances } from "lib/hooks/queries/useAccountPoolAssetBalances";
import { useMarket } from "lib/hooks/queries/useMarket";
import { usePool } from "lib/hooks/queries/usePool";
import { useSaturatedMarket } from "lib/hooks/queries/useSaturatedMarket";
import { useModalStore } from "lib/stores/ModalStore";
import { useNotificationStore } from "lib/stores/NotificationStore";
import { useStore } from "lib/stores/Store";
import { extrinsicCallback } from "lib/util/tx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import Loader from "react-spinners/PulseLoader";
import { from } from "rxjs";

const BuyFullSetModal = observer(({ marketId }: { marketId: number }) => {
  const store = useStore();
  const { wallets } = store;
  const notificationStore = useNotificationStore();
  const modalStore = useModalStore();

  const { data: market } = useMarket({ marketId });
  const { data: saturatedMarket } = useSaturatedMarket(market);
  const { data: pool } = usePool({ marketId: marketId });
  const [sdkMarket, setSdkMarket] = useState<Market>();

  const { data: balances } = useAccountPoolAssetBalances(
    wallets.getActiveSigner()?.address,
    pool,
  );

  const [transacting, setTransacting] = useState(false);
  const [amount, setAmount] = useState<string>("0");
  const [maxTokenSet, setMaxTokenSet] = useState<Decimal>(new Decimal(0));

  useEffect(() => {
    const sub = from(store.sdk.models.fetchMarketData(marketId)).subscribe(
      (market) => {
        setSdkMarket(market);
      },
    );
    return () => sub.unsubscribe();
  }, [store.sdk]);

  useEffect(() => {
    let lowestTokenAmount: Decimal = null;
    balances?.forEach((balance) => {
      const free = new Decimal(balance.free.toNumber());
      if (!lowestTokenAmount || free.lessThan(lowestTokenAmount)) {
        lowestTokenAmount = free;
      }
    });
    setMaxTokenSet(lowestTokenAmount ?? new Decimal(0));
  }, [balances]);

  const handleAmountChange = (amount: string) => {
    setAmount(amount);
  };

  const handleSignTransaction = async () => {
    if (
      Number(amount) > wallets.activeBalance.toNumber() ||
      Number(amount) === 0 ||
      sdkMarket == null
    ) {
      return;
    }

    setTransacting(true);

    const signer = wallets.getActiveSigner();

    sdkMarket.buyCompleteSet(
      signer,
      new Decimal(amount).mul(ZUL).toNumber(),
      extrinsicCallback({
        notificationStore,
        successCallback: () => {
          notificationStore.pushNotification(
            `Bought ${new Decimal(amount).toFixed(1)} full sets`,
            { type: "Success" },
          );
          modalStore.closeModal();
        },
        failCallback: ({ index, error }) => {
          notificationStore.pushNotification(
            store.getTransactionError(index, error),
            {
              type: "Error",
            },
          );
        },
      }),
    );

    setTransacting(false);
    modalStore.closeModal();
  };

  useEffect(() => {
    modalStore.setOnEnterKeyPress(() => handleSignTransaction());
  }, [modalStore, market, handleSignTransaction]);

  const disabled =
    transacting ||
    Number(amount) > wallets.activeBalance.toNumber() ||
    Number(amount) === 0;

  return (
    <div>
      <div>
        <div className="flex items-center mt-zul-24 mb-zul-8">
          <div className="rounded-full w-zul-20 h-zul-20 mr-zul-10 border-sky-600 border-2 bg-zul-blue"></div>
          <div className="font-bold   text-zul-16-150 uppercase text-black dark:text-white">
            {store.config.tokenSymbol}
          </div>
          <span className="font-mono text-zul-12-150 font-medium ml-auto text-sky-600">
            {wallets.activeBalance.toNumber()}
          </span>
        </div>
        <AmountInput value={amount} onChange={handleAmountChange} min="0" />
      </div>
      <div>
        <div className="flex items-center mt-zul-24 mb-zul-8">
          {saturatedMarket?.categories.map((outcome, index) => (
            <div
              key={index}
              className="rounded-full w-zul-20 h-zul-20 -mr-zul-8 border-sky-600 border-2"
              style={{ backgroundColor: outcome.color }}
            ></div>
          ))}
          <div className="font-bold  ml-zul-20  text-zul-16-150 text-black dark:text-white">
            Full Set
          </div>
          <span className="font-mono text-zul-12-150 font-medium ml-auto ">
            {maxTokenSet.div(ZUL).toString()}
          </span>
        </div>
        <AmountInput
          value={amount}
          onChange={handleAmountChange}
          disabled={true}
          min="0"
        />
      </div>
      <div className="h-zul-18 flex px-zul-8 justify-between text-zul-12-150 my-zul-10 text-sky-600">
        <span className=" font-bold">Price per Set:</span>
        <span className="font-mono font-medium">
          1 {store.config.tokenSymbol}
        </span>
      </div>
      <TransactionButton
        className="!rounded-zul-10 h-zul-50"
        onClick={handleSignTransaction}
        disabled={disabled}
      >
        {transacting ? <Loader size={8} /> : "Sign Transaction"}
      </TransactionButton>
    </div>
  );
});

export default BuyFullSetModal;
