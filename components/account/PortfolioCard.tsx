import Table, { TableColumn, TableData } from "components/ui/Table";
import MarketStore from "lib/stores/MarketStore";
import { observer } from "mobx-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ExternalLink } from "react-feather";

export interface Position {
  marketId: string;
  marketEndTimeStamp: number;
  marketTitle: string;
  tableData: TableData[];
}

const PortfolioCard = observer(({ position }) => {
  const router = useRouter();

  const handleRowClick = (data: TableData) => {
    router.push({
      pathname: "/asset",
      query: {
        marketId: data.marketId.toString(),
        assetId: JSON.stringify(data.assetId),
      },
    });
  };
  const columns: TableColumn[] = [
    {
      header: "Token",
      accessor: "token",
      type: "token",
      onClick: (row) => {
        handleRowClick(row);
      },
      width: "130px",
    },
    {
      header: "Amount",
      accessor: "amount",
      type: "number",
    },
    {
      header: "Price Per Share",
      accessor: "sharePrice",
      type: "currency",
    },
    {
      header: "Total Value",
      accessor: "total",
      type: "currency",
    },
    {
      header: "Graph",
      accessor: "history",
      type: "graph",
    },
    {
      header: "24Hrs",
      accessor: "change",
      type: "change",
    },
    {
      header: "",
      accessor: "buttons",
      type: "component",
      width: "140px",
    },
  ];

  const handleMarketLinkClick = (marketId: string) => {
    //todo: update left drawer
    router.push(`/markets/${marketId}`);
  };

  return (
    <div className="rounded-zul-10 bg-sky-100 dark:bg-black">
      <div className="flex mt-zul-20 items-center px-zul-15 py-zul-5 bg-sky-300 dark:bg-sky-700 rounded-t-zul-10">
        <span className="font-bold text-zul-10-150 uppercase ">
          {position.marketTitle}
        </span>
        <span className="ml-auto font-bold text-zul-10-150 mr-zul-16">
          {new Date().getTime() < position.marketEndTimeStamp
            ? "Ends: "
            : "Ended: "}
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "long",
          }).format(new Date(position.marketEndTimeStamp))}
        </span>
        {new Date().getTime() < position.marketEndTimeStamp ? (
          <span className="bg-black text-white rounded-zul-100 text-zul-10-150 font-medium h-zul-20 w-zul-69 text-center pt-zul-2 mr-zul-16">
            Active
          </span>
        ) : (
          <span className="bg-black text-white rounded-zul-100 text-zul-10-150 font-medium h-zul-20 w-zul-69 text-center pt-zul-2 mr-zul-16">
            Inactive
          </span>
        )}
        <Link href={`/markets/${position.marketId}`}>
          <ExternalLink size={24} className="cursor-pointer text-sky-600" />
        </Link>
      </div>
      <Table columns={columns} data={position.tableData} rowHeightPx={50} />
    </div>
  );
});

export default PortfolioCard;
