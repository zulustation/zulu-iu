import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchZULInfo, ZULPriceInfo } from "@zulustation/utility/dist/zul";
import Decimal from "decimal.js";
import { isEmpty } from "lodash";

export const key = () => ["zul-price-info"];

export const useZulInfo = (): UseQueryResult<ZULPriceInfo> => {
  return useQuery(
    key(),
    async () => {
      try {
        const zulInfo = await fetchZULInfo();
        window.localStorage.setItem("zulInfo", JSON.stringify(zulInfo));
        return zulInfo;
      } catch (err) {
        const zulInfo = JSON.parse(
          window.localStorage.getItem("zulInfo") || "{}",
        );
        if (isEmpty(zulInfo)) {
          return { price: new Decimal(0), change: new Decimal(0) };
        } else {
          return zulInfo;
        }
      }
    },
    {
      refetchInterval: 1000 * 60,
      keepPreviousData: true,
      staleTime: Infinity,
    },
  );
};
