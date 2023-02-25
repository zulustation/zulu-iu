import { motion } from "framer-motion";
import { observer } from "mobx-react";
import Link from "next/link";

export interface TrendingMarketInfo {
  marketId: number;
  name: string;
  volume: string;
  img: string;
  outcomes: string;
  prediction: string;
  baseAsset: string;
}

const TrendingMarketCard = observer(
  ({
    marketId,
    name,
    volume,
    img,
    outcomes,
    prediction,
    baseAsset,
  }: TrendingMarketInfo) => {
    return (
      <motion.div
        className="bg-sky-100 dark:bg-black rounded-zul-10 p-zul-15 w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1 }}
      >
        <Link href={`/markets/${marketId}`}>
          <div className="flex-col">
            <div className="hidden sm:flex">
              <div className="w-zul-70 h-zul-70 rounded-zul-10 flex-shrink-0 bg-sky-600">
                <div
                  className="w-zul-70 h-zul-70 rounded-zul-10 flex-shrink-0"
                  style={{
                    backgroundImage:
                      img == null
                        ? "url(/icons/default-market.png)"
                        : `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
              <div className="flex flex-col ml-auto items-end">
                <div className="text-sky-600 uppercase font-bold text-zul-14-150">
                  Outcomes
                </div>
                <div>{outcomes}</div>
              </div>
            </div>
            <div className="text-zul-14-120 mb-zul-17 sm:my-zul-17 line-clamp-2">
              {name}
            </div>
            <div className="flex">
              <div className="flex flex-col ">
                <div className="text-sky-600 uppercase font-bold text-zul-14-150">
                  Prediction
                </div>
                <div>{prediction}</div>
              </div>
              <div className="flex flex-col ml-auto items-end">
                <div className="text-sky-600 uppercase font-bold text-zul-14-150">
                  Volume
                </div>
                <div>
                  {volume} {baseAsset.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  },
);

export default TrendingMarketCard;
