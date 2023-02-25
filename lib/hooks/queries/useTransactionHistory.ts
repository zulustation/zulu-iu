import { useQuery } from "@tanstack/react-query";
import {
  parseAssetId,
  getMarketIdOf,
  isIndexedSdk,
  IOMarketOutcomeAssetId,
} from "@zulustation/sdk-next";
import Decimal from "decimal.js";
import { gql } from "graphql-request";
import { ZUL } from "lib/constants";
import { useSdkv2 } from "../useSdkv2";

export const transactionHistoryKey = "transaction-history";

const transactionHistoryQuery = gql`
  query TransactionHistory($address: String) {
    historicalAssets(
      where: { accountId_eq: $address }
      orderBy: timestamp_DESC
    ) {
      assetId
      zulTraded
      timestamp
      event
      newPrice
      dPrice
    }
  }
`;

const marketHeaderQuery = gql`
  query MarketTransactionHeader($marketIds: [Int!]) {
    markets(where: { marketId_in: $marketIds }) {
      question
    }
  }
`;

const humanReadableEventMap = {
  PoolCreate: "Create Pool",
  SwapExactAmountOut: "Trade",
  SwapExactAmountIn: "Trade",
  PoolExit: "Remove Subsidy",
  PoolJoin: "Add Subsidy",
} as const;

type Action = typeof humanReadableEventMap[keyof typeof humanReadableEventMap];

type TradeEvent = {
  question: string;
  action: Action;
  value: number;
  price: number;
  time: string;
};

type MarketHeader = {
  question: string;
};

export const useTransactionHistory = (address: string) => {
  const [sdk, id] = useSdkv2();

  const query = useQuery(
    [id, transactionHistoryKey, address],
    async () => {
      if (isIndexedSdk(sdk) && address) {
        const { historicalAssets } = await sdk.indexer.client.request<{
          historicalAssets: {
            assetId: string;
            dAmountInPool: string;
            zulTraded: string;
            newPrice: number;
            dPrice: number;
            timestamp: string;
            event: string;
          }[];
        }>(transactionHistoryQuery, {
          address: address,
        });

        const eventTypesToDisplay = Object.keys(humanReadableEventMap);

        const eventsToDisplay = historicalAssets.filter((asset) =>
          eventTypesToDisplay.includes(asset.event),
        );

        const marketIds = new Set<number>(
          eventsToDisplay.map((event) => {
            const assetId = parseAssetId(event.assetId).unwrap();

            return IOMarketOutcomeAssetId.is(assetId)
              ? getMarketIdOf(assetId)
              : null;
          }),
        );

        const marketIdsArray = Array.from(marketIds);

        const { markets } = await sdk.indexer.client.request<{
          markets: MarketHeader[];
        }>(marketHeaderQuery, {
          marketIds: marketIdsArray,
        });

        const marketsMap: Map<number, MarketHeader> = new Map();
        marketIdsArray.forEach((marketId, index) => {
          marketsMap.set(marketId, markets[index]);
        });

        const transactions: TradeEvent[] = eventsToDisplay.map((asset) => {
          const action: Action = humanReadableEventMap[asset.event];
          const assetId = parseAssetId(asset.assetId).unwrap();
          const marketId = IOMarketOutcomeAssetId.is(assetId)
            ? getMarketIdOf(assetId)
            : null;

          return {
            question: marketsMap.get(marketId).question,
            action: action,
            value:
              action === "Trade" && asset.zulTraded != null
                ? new Decimal(asset.zulTraded).div(ZUL).toNumber()
                : null,
            price:
              action === "Trade" ? asset.newPrice - asset.dPrice / 2 : null,
            time: asset.timestamp,
          };
        });

        return transactions;
      }
    },
    {
      keepPreviousData: true,
      enabled: Boolean(sdk && isIndexedSdk(sdk) && address),
    },
  );

  return query;
};
