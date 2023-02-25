import PercentageChange from "components/ui/PercentageChange";
import { useExchangeStore } from "lib/stores/ExchangeStore";
import MarketStore from "lib/stores/MarketStore";
import { useNavigationStore } from "lib/stores/NavigationStore";
import { useStore } from "lib/stores/Store";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { ReactFragment, useEffect, useMemo, useState } from "react";
import { useTradeslipItems } from "lib/state/tradeslip/items";
import { useZulInfo } from "lib/hooks/queries/useZulInfo";

import ExchangeBox from "../exchange/ExchangeBox";
import LiquidityPoolsBox from "../liquidity/LiquidityPoolsBox";
import TradeSlip from "../trade-slip";
import Tabs from "../ui/Tabs";
import Drawer from "./Drawer";

const ZULSummary = observer(() => {
  const { data: zulInfo } = useZulInfo();

  return (
    <div className="flex px-zul-28 items-center ">
      <div className=" flex items-center justify-center rounded-zul-10 flex-shrink-0 mb-auto mt-zul-5">
        <img src="/icons/ZUL.svg" alt="logo" />
      </div>

      <div className="flex flex-col ml-zul-12 mr-zul-6">
        <div className=" text-zul-16-150 font-bold text-sky-1100 dark:text-white">
          ZUL
        </div>
        <div className=" text-zul-12-150 text-sky-600 w-zul-90 ">Zeitgeist</div>
      </div>
      {zulInfo ? (
        <>
          <div className="bg-white dark:bg-sky-700 dark:text-white font-mono px-zul-12 py-zul-6 rounded-full text-zul-12-120 text-center whitespace-nowrap mr-zul-12">
            = ${zulInfo?.price.toFixed(2) ?? 0}
          </div>
          <PercentageChange change={zulInfo?.change.toFixed(0) ?? "0"} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
});

type DisplayMode = "default" | "liquidity";

const Box = observer(
  ({ mode, tabIndex }: { mode: DisplayMode; tabIndex: number }) => {
    const withSpacing = (children: ReactFragment) => {
      return (
        <div className="px-zul-28 mt-zul-20 overflow-auto">{children}</div>
      );
    };
    const exchangeStore = useExchangeStore();

    switch (mode) {
      case "default":
        return tabIndex === 0 ? (
          <TradeSlip />
        ) : (
          withSpacing(<ExchangeBox exchangeStore={exchangeStore} />)
        );
      case "liquidity":
        return withSpacing(
          tabIndex === 0 ? (
            <LiquidityPoolsBox />
          ) : (
            <ExchangeBox exchangeStore={exchangeStore} />
          ),
        );
      default:
        return tabIndex === 0 ? (
          <TradeSlip />
        ) : (
          withSpacing(<ExchangeBox exchangeStore={exchangeStore} />)
        );
    }
  },
);

const RightDrawer = observer(() => {
  const navigationStore = useNavigationStore();
  const tradeslipItems = useTradeslipItems();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const router = useRouter();
  const { marketid } = router.query;
  const store = useStore();
  const { markets, wallets } = store;

  const displayMode: DisplayMode = useMemo<DisplayMode>(() => {
    if (router.query.poolid !== undefined) {
      return "liquidity";
    } else {
      return "default";
    }
  }, [router, wallets.activeAccount]);

  const tabLabels = useMemo(() => {
    switch (displayMode) {
      case "default":
        return ["Trade Slip", "Exchange"];
      case "liquidity":
        return ["Liquidity Pools", "Exchange"];
      default:
        return ["Trade Slip", "Exchange"];
    }
  }, [displayMode]);

  useEffect(() => {
    setActiveTabIndex(0);
  }, [tradeslipItems.items.length]);

  return (
    <Drawer
      side="right"
      className="bg-sky-100 !fixed sm:!block right-0 z-zul-10 w-0"
    >
      <div className="h-full">
        <div className="mt-zul-10 h-full flex flex-col">
          <ZULSummary />
          {tabLabels ? (
            <Tabs
              labels={tabLabels}
              active={activeTabIndex}
              onTabChange={setActiveTabIndex}
              className="mt-zul-25 px-zul-28"
            />
          ) : (
            <></>
          )}
          <Box tabIndex={activeTabIndex} mode={displayMode} />
          <div className="mt-auto" />
          <div className="p-zul-28 pt-0">
            <button
              className="border-solid border-1 border-sky-600 rounded-zul-10 flex flex-row h-zul-64 w-full items-center"
              onClick={() => window.open("https://discord.gg/xv8HuA4s8v")}
            >
              <div className="w-1/4 flex justify-center items-center">
                <img src="/support.png" className="w-zul-18 h-zul-18" />
              </div>
              <p className="font-bold text-sky-600  text-zul-16-150">
                Feedback and Support
              </p>
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
});

export default RightDrawer;
