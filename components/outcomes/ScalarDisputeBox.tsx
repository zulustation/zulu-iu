import {
  getScalarBounds,
  IndexerContext,
  isRpcSdk,
  Market,
} from "@zulustation/sdk-next";
import { AmountInput, DateTimeInput } from "components/ui/inputs";
import TransactionButton from "components/ui/TransactionButton";
import Decimal from "decimal.js";
import { ZUL } from "lib/constants";
import { useMarketDisputes } from "lib/hooks/queries/useMarketDisputes";
import { useSdkv2 } from "lib/hooks/useSdkv2";
import { useNotificationStore } from "lib/stores/NotificationStore";
import { useStore } from "lib/stores/Store";
import { extrinsicCallback, signAndSend } from "lib/util/tx";
import { observer } from "mobx-react";
import moment from "moment";
import { useState } from "react";

const ScalarDisputeBox = observer(
  ({
    market,
    onDispute,
  }: {
    market: Market<IndexerContext>;
    onDispute?: () => void;
  }) => {
    const [sdk] = useSdkv2();
    const store = useStore();
    const notificationStore = useNotificationStore();

    //TODO: move to react query
    const disputeBond = store.config.markets.disputeBond;
    const disputeFactor = store.config.markets.disputeFactor;
    const tokenSymbol = store.config.tokenSymbol;

    const { data: disputes } = useMarketDisputes(market);
    const lastDispute = disputes?.[disputes.length - 1];

    const signer = store?.wallets?.getActiveSigner();

    const bondAmount = disputes
      ? disputeBond + disputes.length * disputeFactor
      : disputeBond;

    const bounds = getScalarBounds(market).unwrap();

    const isScalarDate = market.scalarType === "date";

    const [scalarReportValue, setScalarReportValue] = useState(() => {
      if (isScalarDate) {
        return ((bounds[1].toNumber() + bounds[0].toNumber()) / 2).toFixed(0);
      } else {
        return "";
      }
    });

    const getPreviousReport = () => {
      const reportVal = new Decimal(
        lastDispute?.outcome.asScalar.toString() ??
          market.report?.outcome.scalar,
      )
        .div(ZUL)
        .toString();
      if (isScalarDate) {
        return moment(Number(reportVal)).format("YYYY-MM-DD HH:mm");
      } else {
        return reportVal;
      }
    };

    const handleSignTransaction = async () => {
      if (!isRpcSdk(sdk)) return;
      const outcomeReport = {
        Scalar: new Decimal(scalarReportValue).mul(ZUL).toFixed(0),
      };

      const callback = extrinsicCallback({
        notificationStore,
        successCallback: async () => {
          notificationStore.pushNotification("Outcome Disputed", {
            type: "Success",
          });
          onDispute?.();
        },
        failCallback: ({ index, error }) => {
          notificationStore.pushNotification(
            store.getTransactionError(index, error),
            {
              type: "Error",
            },
          );
        },
      });

      const tx = sdk.api.tx.predictionMarkets.dispute(
        market.marketId,
        outcomeReport,
      );
      await signAndSend(tx, signer, callback);
    };

    return (
      <>
        <div className=" text-zul-10-150 mb-zul-5">
          Bond will start at {disputeBond} {tokenSymbol}, increasing by{" "}
          {disputeFactor} {tokenSymbol} for each dispute
        </div>
        {isScalarDate ? (
          <DateTimeInput
            timestamp={scalarReportValue}
            onChange={setScalarReportValue}
            isValidDate={(current) => {
              const loBound = bounds[0].toNumber();
              const hiBound = bounds[1].toNumber();
              if (
                current.valueOf() >= loBound &&
                current.valueOf() <= hiBound
              ) {
                return true;
              }
              return false;
            }}
          />
        ) : (
          <AmountInput
            value={scalarReportValue}
            min={bounds?.[0].toString()}
            max={bounds?.[1].toString()}
            onChange={(val) => setScalarReportValue(val)}
            showErrorMessage={false}
          />
        )}
        <div className="my-zul-10">
          <div className=" h-zul-18 flex px-zul-8 justify-between text-zul-12-150 font-bold text-sky-600">
            <span>Previous Report:</span>
            <span className="font-mono">{getPreviousReport()}</span>
          </div>
          {bondAmount !== disputeBond && bondAmount !== undefined ? (
            <div className=" h-zul-18 flex px-zul-8 justify-between text-zul-12-150 font-bold text-sky-600 ">
              <span>Previous Bond:</span>
              <span className="font-mono">{bondAmount - disputeFactor}</span>
            </div>
          ) : (
            <></>
          )}
        </div>

        <TransactionButton
          className="my-zul-10 shadow-zul-2"
          onClick={handleSignTransaction}
        >
          Dispute Outcome
        </TransactionButton>
      </>
    );
  },
);

export default ScalarDisputeBox;
