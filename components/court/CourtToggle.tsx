import { useState, useEffect } from "react";

export type CourtTab = "allCases" | "myCases" | "jurors";

const CourtToggle = ({
  onToggle,
  allCasesCount,
  myCasesCount,
  jurorsCount,
}: {
  onToggle: (allCases: CourtTab) => void;
  allCasesCount: number;
  myCasesCount: number;
  jurorsCount: number;
}) => {
  const [selectedTab, setSelectedTab] = useState<CourtTab>("allCases");
  const inactiveClasses = "text-sky-600 text-zul-16-150";
  const activeClasses = "text-zul-18-150 cursor-default";

  useEffect(() => {
    onToggle(selectedTab);
  }, [selectedTab]);

  return (
    <div className="flex items-center mt-zul-49">
      <button
        className={` font-bold focus:outline-none ${
          selectedTab === "allCases" ? activeClasses : inactiveClasses
        }`}
        onClick={() => setSelectedTab("allCases")}
      >
        All Cases {allCasesCount ? `(${allCasesCount})` : <></>}
      </button>
      <button
        className={` font-bold focus:outline-none ml-zul-10 ${
          selectedTab === "myCases" ? activeClasses : inactiveClasses
        }`}
        onClick={() => setSelectedTab("myCases")}
      >
        My Cases {myCasesCount ? `(${myCasesCount})` : <></>}
      </button>
      <button
        className={` font-bold focus:outline-none ml-zul-10 ${
          selectedTab === "jurors" ? activeClasses : inactiveClasses
        }`}
        onClick={() => setSelectedTab("jurors")}
      >
        Jurors {jurorsCount ? `(${jurorsCount})` : <></>}
      </button>
    </div>
  );
};

export default CourtToggle;
