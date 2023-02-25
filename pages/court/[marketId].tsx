import CourtHeader from "components/court/CourtHeader";
import OutcomesTable from "components/court/OutcomesTable";
import Table, { TableColumn, TableData } from "components/ui/Table";
import ProgressReport from "components/ui/ProgressReport";
import { Case, useCourtStore } from "lib/stores/CourtStore";
import { useMarketsStore } from "lib/stores/MarketsStore";
import MarketStore from "lib/stores/MarketStore";
import { useStore } from "lib/stores/Store";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import NotFoundPage from "pages/404";
import { useEffect, useState } from "react";

const JurorsTable = ({
  courtCase,
  marketStore,
}: {
  courtCase: Case;
  marketStore: MarketStore;
}) => {
  const getOutcomeData = (jurorAddress: string) => {
    const assetId = courtCase.votes.find(
      (vote) => vote.address === jurorAddress,
    )?.asset.Categorical;

    if (assetId) {
      const outcome = marketStore?.marketOutcomes.find(
        //@ts-ignore
        (outcome) => outcome.asset.categoricalOutcome?.[1] === Number(assetId),
      );
      if (outcome) {
        return {
          outcome: outcome.metadata["name"],
          token: {
            color: outcome.metadata["color"],
            label: outcome.metadata["ticker"],
          },
        };
      } else {
        return {};
      }
    } else {
      return {};
    }
  };
  const data: TableData[] = courtCase?.jurors.map((juror) => ({
    address: juror.address,
    ...getOutcomeData(juror.address),
  }));

  const columns: TableColumn[] = [
    {
      header: "Address",
      accessor: "address",
      type: "address",
    },
    {
      header: "Voted Token",
      accessor: "token",
      type: "token",
    },
    {
      header: "Voted Outcome",
      accessor: "outcome",
      type: "text",
    },
  ];

  return <Table data={data} columns={columns} />;
};

const CaseSummary = ({ courtCase }: { courtCase: Case }) => {
  return (
    <div className="flex w-full">
      <div className="flex justify-between bg-sky-100 dark:bg-black p-zul-15 rounded-zul-10 w-full mr-zul-10">
        <span className="bg-sky-300 dark:bg-sky-700 rounded-zul-50 font-bold text-zul-14-120 p-zul-6">
          Jurors
        </span>
        <span className="font-mono font-bold">{courtCase?.jurors.length}</span>
      </div>
      <div className="flex justify-between bg-sky-100 dark:bg-black p-zul-15 rounded-zul-10 w-full mr-zul-10">
        <span className="bg-sky-300 dark:bg-sky-700 rounded-zul-50 font-bold text-zul-14-120 p-zul-6">
          Votes
        </span>
        <span className="font-mono font-bold">{courtCase?.votes.length}</span>
      </div>
    </div>
  );
};

const Court: NextPage = observer(() => {
  const [marketStore, setMarketStore] = useState<MarketStore>();
  const router = useRouter();
  const { marketId } = router.query;
  const marketsStore = useMarketsStore();
  const courtStore = useCourtStore();
  const store = useStore();

  const courtCase = courtStore.getCase(Number(marketId));
  const caseDuration = store.config.court.caseDurationSec;

  const handleBackClick = () => {
    router.push("/court");
  };

  useEffect(() => {
    (async () => {
      const market = await marketsStore.getMarket(Number(marketId));
      setMarketStore(market);
    })();
  }, [marketsStore]);

  if (courtCase == null) {
    return <NotFoundPage backText="Back To Cases" backLink="/court" />;
  }

  return (
    <section>
      <CourtHeader />
      <button
        className=" text-zul-16-150 text-sky-600"
        onClick={handleBackClick}
      >
        Back to Cases
      </button>

      <h2 className="header my-zul-23">{marketStore?.slug}</h2>
      <p className=" text-zul-16-150 mb-zul-20">{marketStore?.description}</p>
      <CaseSummary courtCase={courtCase} />
      {courtCase.endTimestamp - new Date().getTime() > 0 ? (
        <div className="my-zul-20 ml-zul-10">
          <ProgressReport
            title="Voting started"
            description="Waiting for voting period to end"
            totalTime={caseDuration}
            remainingTime={
              (courtCase.endTimestamp - new Date().getTime()) / 1000
            }
            stages={[
              {
                fillColor: "#0001FE",
                percentage:
                  1 -
                  (courtCase.endTimestamp - new Date().getTime()) /
                    1000 /
                    caseDuration,
                className: "w-2/3",
              },
            ]}
          />
        </div>
      ) : (
        <></>
      )}
      <div className=" text-zul-16-150 mt-zul-20 font-bold">Outcomes</div>
      <OutcomesTable marketStore={marketStore} courtCase={courtCase} />
      <div className=" text-zul-16-150 mt-zul-20 font-bold">Jurors</div>
      <JurorsTable courtCase={courtCase} marketStore={marketStore} />
    </section>
  );
});

export default Court;
