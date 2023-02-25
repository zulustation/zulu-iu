import React, { FC } from "react";

const TypeSwitch: FC<{
  type: "buy" | "sell";
  onChange: (type: "buy" | "sell") => void;
}> = ({ type, onChange }) => {
  const base =
    "w-zul-53  text-zul-14-120 font-bold items-center cursor-pointer text-sky-600";

  const activeClass = "text-sunglow-2";

  return (
    <>
      <div
        className={`${base} ${type === "buy" ? activeClass : ""}`}
        onMouseDown={() => onChange("buy")}
      >
        Buy
      </div>
      <div
        className={`${base} ${type === "sell" ? activeClass : ""}`}
        onMouseDown={() => onChange("sell")}
      >
        Sell
      </div>
    </>
  );
};

export default TypeSwitch;
