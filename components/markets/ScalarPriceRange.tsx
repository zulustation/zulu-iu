import { observer } from "mobx-react";
import { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import { motion } from "framer-motion";
import type { ScalarRangeType } from "@zeitgeistpm/sdk/dist/types";
import moment from "moment";

interface ScalarPriceRangeProps {
  scalarType: string | ScalarRangeType;
  lowerBound: number;
  upperBound: number;
  shortPrice: number; //between 0 and 1
  longPrice: number; //between 0 and 1
}

const ScalarPriceRange = observer(
  ({
    scalarType,
    lowerBound,
    upperBound,
    shortPrice,
    longPrice,
  }: ScalarPriceRangeProps) => {
    const { width, ref } = useResizeDetector();

    const shortPercentage = 1 - shortPrice;
    const longPercentage = longPrice;
    const averagePercentage = (shortPercentage + longPercentage) / 2;
    const averagePosition = width * averagePercentage;
    const shortPosition = width * shortPercentage;
    const longPosition = width * longPercentage;

    const showShortAndLongPrices = Math.abs(1 - shortPrice - longPrice) > 0.03;
    const inferedType: string | ScalarRangeType = scalarType ?? "number";

    const dateFormat = "d/MM/D/YY, h:mm a";

    const lower = useMemo(
      () =>
        inferedType === "number"
          ? lowerBound
          : moment(lowerBound).format(dateFormat),
      [lowerBound],
    );
    const upper = useMemo(
      () =>
        inferedType === "number"
          ? upperBound
          : moment(upperBound).format(dateFormat),
      [upperBound],
    );
    // new Intl.DateTimeFormat("en-US", {
    //   dateStyle: "medium",
    // }).format(Number(indexedMarket.period.end))

    const position = useMemo(() => {
      const pos =
        (upperBound - lowerBound) * ((1 - shortPrice + longPrice) / 2) +
        lowerBound;
      const decimals = pos > 10 ? 0 : 3;
      return inferedType === "number"
        ? pos.toFixed(decimals)
        : moment(pos).format(dateFormat);
    }, [upperBound, lowerBound, shortPrice, longPrice]);
    console.log(lower, averagePosition, upper);

    return (
      <div ref={ref}>
        <div className="relative top-ztg-6 ">
          <div className="flex justify-between font-mono">
            <div className="flex flex-col justify-start">
              <div className="mb-ztg-8">
                {new Intl.NumberFormat("default", {
                  maximumSignificantDigits: 3,
                  notation: "compact",
                }).format(Number(lower))}
              </div>
              <div className="bg-sky-500 h-ztg-6 w-ztg-6 rounded-full mt-auto"></div>
            </div>
            <div className="flex flex-col justify-end items-end">
              <div className="mb-ztg-8">
                {new Intl.NumberFormat("default", {
                  maximumSignificantDigits: 3,
                  notation: "compact",
                }).format(Number(upper))}
              </div>
              <div className="bg-sky-500 h-ztg-6 w-ztg-6 rounded-full"></div>
            </div>
          </div>
          {showShortAndLongPrices && (
            <motion.div
              layout
              className="bg-vermilion h-ztg-6 w-ztg-6 rounded-full absolute bottom-ztg-0"
              style={{ left: `${shortPosition}px` }}
            ></motion.div>
          )}
          <div
            className="absolute bottom-ztg-0"
            style={{
              left: `${averagePosition}px`,
              transform: "translateX(calc(-50% + 2px))",
            }}
          >
            <div className="flex flex-col items-center font-mono">
              <div className="mb-ztg-8">
                {new Intl.NumberFormat("default", {
                  maximumSignificantDigits: 3,
                  notation: "compact",
                }).format(Number(position))}
              </div>
              <div className="bg-blue h-ztg-6 w-ztg-6 rounded-full"></div>
            </div>
          </div>

          {showShortAndLongPrices && (
            <motion.div
              layout
              className="bg-sheen-green h-ztg-6 w-ztg-6 rounded-full absolute bottom-ztg-0"
              style={{ left: `${longPosition}px` }}
            ></motion.div>
          )}
        </div>
        <div className="h-ztg-6 flex items-center">
          <div className="h-ztg-6 w-full bg-blue"></div>
        </div>
      </div>
    );
  },
);

export default ScalarPriceRange;
