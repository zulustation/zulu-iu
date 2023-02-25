import { useQuery } from "@tanstack/react-query";
import { isRpcSdk, NA } from "@zulustation/sdk-next";
import Decimal from "decimal.js";
import { getApiAtBlock } from "lib/util/get-api-at";
import { useSdkv2 } from "../useSdkv2";

export const zulBalanceRootKey = "zul-blance";

export const useZulBalance = (address: string, blockNumber?: number) => {
  const [sdk, id] = useSdkv2();

  const query = useQuery(
    [id, zulBalanceRootKey, address, blockNumber],
    async () => {
      if (address && isRpcSdk(sdk)) {
        const api = await getApiAtBlock(sdk.api, blockNumber);

        const balance = await api.query.system.account(address);
        return new Decimal(balance.data.free.toString());
      }
      return NA;
    },
    {
      initialData: NA,
      keepPreviousData: true,
      enabled: Boolean(sdk && address && isRpcSdk(sdk)),
    },
  );

  return query;
};
