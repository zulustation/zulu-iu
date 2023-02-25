import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { useQueries } from "@tanstack/react-query";
import {
  Context,
  getAssetWeight,
  getIndexOf,
  getMarketIdOf,
  IndexerContext,
  isNA,
  isRpcSdk,
  Market,
  na,
  NA,
  Pool,
  SaturatedPoolEntryAsset,
} from "@zulustation/sdk-next";
import Decimal from "decimal.js";
import { useAtom } from "jotai";
import { MAX_IN_OUT_RATIO, ZUL } from "lib/constants";
import { useAccountAssetBalances } from "lib/hooks/queries/useAccountAssetBalances";
import { usePoolAccountIds } from "lib/hooks/queries/usePoolAccountIds";
import { usePoolsByIds } from "lib/hooks/queries/usePoolsByIds";
import { usePoolZulBalance } from "lib/hooks/queries/usePoolZulBalance";
import { useSaturatedPoolsIndex } from "lib/hooks/queries/useSaturatedPoolsIndex";
import { useZulBalance } from "lib/hooks/queries/useZulBalance";
import { useSdkv2 } from "lib/hooks/useSdkv2";
import { calcInGivenOut, calcOutGivenIn, calcSpotPrice } from "lib/math";
import { useStore } from "lib/stores/Store";
import { TradeSlipItem } from "./items";
import { slippagePercentageAtom } from "./slippage";

/**
 * State pr trade slip item that contains computed and related remote data.
 */
export type TradeSlipItemState = {
  /**
   * The item the state is for.
   */
  item: TradeSlipItem;
  /**
   * Pool related to the item.
   */
  pool: Pool<IndexerContext>;
  /**
   * Asset data related to the item.
   */
  asset: SaturatedPoolEntryAsset;
  /**
   * Market related to the item.
   */
  market: Market<Context>;
  /**
   * Weight setting of the zul in the pool.
   */
  zulWeight: Decimal;
  /**
   * Weight setting of the items asset in the pool.
   */
  assetWeight: Decimal;
  /**
   * Swap fee for the items pool.
   */
  swapFee: Decimal;
  /**
   * Zul balance of the trader.
   */
  traderZulBalance: Decimal | NA;
  /**
   * Free zul balance in the assets pool.
   */
  poolZulBalance: Decimal | NA;
  /**
   * Free balance the trader has of the items asset.
   */
  traderAssetBalance: Decimal | NA;
  /**
   * Free balance the pool has of the items asset.
   */
  poolAssetBalance: Decimal;
  /**
   * Amount of tradable assets in the pool.
   */
  tradeablePoolBalance: Decimal;
  /**
   * Calculated price of the asset.
   */
  price: Decimal;
  /**
   * The sum cost/gain for the buy or sell.
   */
  sum: Decimal;
  /**
   * The max ammount the trader can buy or sell. Depends on the item action.
   */
  max: Decimal;
  /**
   * Transaction for the item.
   */
  transaction: SubmittableExtrinsic<"promise", ISubmittableResult> | null;
};

/**
 * Composite id/key for a certain item by its assetid and action.
 */
export type TradeSlipItemStateKey = string & { readonly _tag: unique symbol };

/**
 * Identify a TradeSlipItem by its action and asset id.
 *
 * @param item TradeSlipItem
 * @returns string
 */
export const itemKey = (item: TradeSlipItem): TradeSlipItemStateKey =>
  `${item.action}|${JSON.stringify(item.assetId)}` as TradeSlipItemStateKey;

/**
 * Rootkey for trade slip item state query cache.
 */
export const rootKey = "trade-slip-item-state";

/**
 * Get the state for a singel trade slip item.
 *
 * @param item TradeSlipItem
 * @returns TradeSlipItemState | null
 */
export const useTradeslipItemState = (
  item: TradeSlipItem,
): TradeSlipItemState | null => {
  const states = useTradeslipItemsState([item]);
  return states[itemKey(item)];
};

/**
 * Returns remote and computed state pr trade slip item like max amount, sum, market, asset
 * the transaction etc.
 *
 * @param items TradeSlipItem[]
 * @returns UseTradeslipItemsState
 */
export const useTradeslipItemsState = (
  items: TradeSlipItem[],
): Record<TradeSlipItemStateKey, TradeSlipItemState> => {
  const [sdk, id] = useSdkv2();

  const { wallets } = useStore();
  const signer = wallets.activeAccount ? wallets.getActiveSigner() : null;

  const [slippage] = useAtom(slippagePercentageAtom);

  const { data: traderZulBalance } = useZulBalance(signer?.address);

  const { data: pools } = usePoolsByIds(
    items.map((item) => ({ marketId: getMarketIdOf(item.assetId) })),
  );

  const { data: saturatedIndex } = useSaturatedPoolsIndex(pools || []);

  const poolZulBalances = usePoolZulBalance(pools ?? []);

  const traderAssets = useAccountAssetBalances(
    items.map((item) => ({
      account: signer?.address,
      assetId: item.assetId,
    })),
  );

  const poolAccountIds = usePoolAccountIds(pools);

  const poolAssetBalances = useAccountAssetBalances(
    items.map((item) => ({
      account:
        poolAccountIds[
          pools?.find((p) => p.marketId == getMarketIdOf(item.assetId))?.poolId
        ],
      assetId: item.assetId,
    })),
  );

  const balancesKey = {
    traderZulBalance: traderZulBalance.toString(),
    traderAssets: traderAssets?.query.map((a) => a?.toString()),
  };

  const query = useQueries({
    queries: items.map((item) => {
      const pool = pools?.find(
        (p) => p.marketId == getMarketIdOf(item.assetId),
      );

      const amount = new Decimal(item.amount).mul(ZUL);
      const assetIndex = getIndexOf(item.assetId);
      const saturatedData = saturatedIndex?.[pool?.poolId];
      const asset = saturatedData?.assets[assetIndex];
      const market = saturatedData?.market;

      const zulWeight = pool
        ? getAssetWeight(pool, { Zul: null }).unwrap()
        : null;

      const assetWeight = asset
        ? getAssetWeight(pool, asset?.assetId).unwrap()
        : null;

      const swapFee = pool?.swapFee
        ? new Decimal(pool.swapFee)
        : new Decimal(0);

      const poolZulBalance =
        !pool ||
        !poolZulBalances[pool?.poolId] ||
        isNA(poolZulBalances[pool?.poolId])
          ? null
          : new Decimal(poolZulBalances[pool.poolId].free.toString());

      const traderAssetBalanceLookup = traderAssets.get(
        signer?.address,
        item.assetId,
      )?.data?.balance;

      const poolAssetBalanceLookup = poolAssetBalances.get(
        poolAccountIds[pool?.poolId],
        item.assetId,
      )?.data?.balance;

      const traderAssetBalance =
        !traderAssetBalanceLookup || isNA(traderAssetBalanceLookup)
          ? na("Account balance not available.")
          : new Decimal(traderAssetBalanceLookup.free.toString());

      const poolAssetBalance =
        !poolAssetBalanceLookup || isNA(poolAssetBalanceLookup)
          ? null
          : new Decimal(poolAssetBalanceLookup.free.toString());

      const tradeablePoolBalance =
        !poolAssetBalance || isNA(poolAssetBalance)
          ? null
          : new Decimal(poolAssetBalance).mul(MAX_IN_OUT_RATIO);

      const enabled = Boolean(
        item &&
          pool &&
          asset &&
          market &&
          zulWeight &&
          assetWeight &&
          swapFee &&
          poolZulBalance &&
          traderAssetBalance &&
          poolAssetBalance &&
          tradeablePoolBalance,
      );

      return {
        enabled: Boolean(sdk) && enabled,
        keepPreviousData: true,
        queryKey: [
          id,
          rootKey,
          itemKey(item),
          amount,
          signer?.address,
          balancesKey,
        ],
        queryFn: async () => {
          if (!enabled || !sdk) {
            return null;
          }

          const price = calcSpotPrice(
            poolZulBalance,
            zulWeight,
            poolAssetBalance,
            assetWeight,
            0,
          );

          const max = (() => {
            if (item.action === "buy") {
              const maxTokens = isNA(traderZulBalance)
                ? tradeablePoolBalance
                : traderZulBalance.div(price.div(ZUL) ?? 0);
              if (tradeablePoolBalance?.lte(maxTokens)) {
                return tradeablePoolBalance;
              } else {
                return maxTokens;
              }
            } else {
              if (!traderAssetBalance || isNA(traderAssetBalance)) {
                return tradeablePoolBalance;
              }
              if (tradeablePoolBalance?.lte(traderAssetBalance)) {
                return tradeablePoolBalance;
              } else {
                return traderAssetBalance;
              }
            }
          })();

          const sum =
            item.action === "buy"
              ? calcInGivenOut(
                  poolZulBalance,
                  zulWeight,
                  poolAssetBalance,
                  assetWeight,
                  new Decimal(item.amount).mul(ZUL),
                  swapFee.div(ZUL),
                )
              : calcOutGivenIn(
                  poolAssetBalance,
                  assetWeight,
                  poolZulBalance,
                  zulWeight,
                  new Decimal(item.amount).mul(ZUL),
                  swapFee.div(ZUL),
                );

          let transaction: SubmittableExtrinsic<
            "promise",
            ISubmittableResult
          > | null;

          if (isRpcSdk(sdk)) {
            try {
              if (item.action == "buy") {
                const maxAmountIn = calcInGivenOut(
                  poolZulBalance,
                  zulWeight,
                  poolAssetBalance,
                  assetWeight,
                  amount,
                  swapFee.div(ZUL),
                ).mul(new Decimal(slippage / 100 + 1));

                if (!maxAmountIn.isNaN()) {
                  transaction = sdk.api.tx.swaps.swapExactAmountOut(
                    pool.poolId,
                    { Zul: null },
                    maxAmountIn.toFixed(0),
                    asset.assetId,
                    amount.toFixed(0),
                    null,
                  );
                }
              } else {
                const minAmountOut = calcOutGivenIn(
                  poolAssetBalance,
                  assetWeight,
                  poolZulBalance,
                  zulWeight,
                  amount.toNumber(),
                  swapFee.div(ZUL),
                ).mul(new Decimal(1 - slippage / 100));

                if (!minAmountOut.isNaN()) {
                  transaction = sdk.api.tx.swaps.swapExactAmountIn(
                    pool.poolId,
                    asset.assetId,
                    amount.toFixed(0),
                    { Zul: null },
                    minAmountOut.toFixed(0),
                    null,
                  );
                }
              }
            } catch (error) {
              console.log(error);
            }
          }

          return {
            item,
            pool,
            asset,
            market,
            zulWeight,
            assetWeight,
            swapFee,
            traderZulBalance,
            poolZulBalance,
            traderAssetBalance,
            poolAssetBalance,
            tradeablePoolBalance,
            sum,
            max,
            price,
            transaction,
          };
        },
      };
    }),
  });

  return query.reduce<Record<TradeSlipItemStateKey, TradeSlipItemState>>(
    (index, { data: state }) => {
      if (!state) return index;
      return {
        ...index,
        [itemKey(state.item)]: state,
      };
    },
    {},
  );
};
