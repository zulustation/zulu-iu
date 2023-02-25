import { observer } from "mobx-react";
import React, { FC } from "react";
import StatCard, { StatCardProps } from "./StatCard";

const stats: StatCardProps[] = [
  {
    header: "Total Value",
    text: "176,780,870 ZGT",
    bottomText: "≈ $10,000,000",
  },
  {
    header: "Active markets",
    text: "12",
    bottomText: "Additional Info",
  },
  {
    header: "Transactions",
    text: "003",
    bottomText: "Additional Info",
  },
];

const InfoBoxes: FC = observer(() => {
  return (
    <></>
    // <div className="flex h-zul-104 mb-zul-30">
    //   {stats.map((stat, index) => (
    //     <StatCard
    //       key={index}
    //       header={stat.header}
    //       text={stat.text}
    //       bottomText={stat.bottomText}
    //     />
    //   ))}
    // </div>
  );
});

export default InfoBoxes;
