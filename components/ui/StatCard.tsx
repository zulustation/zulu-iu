import { FC } from "react";

export type StatCardProps = {
  header: string;
  text: string;
  bottomText: string;
};

const StatCard: FC<StatCardProps> = ({ header, text, bottomText }) => (
  <div className="w-1/3 pr-zul-15 ">
    <div className="rounded-zul-10 p-zul-15 h-full block bg-sky-100 dark:bg-black dark:text-white">
      <div className="text-zul-12-150  font-bold bg-sky-300 dark:bg-sky-700 rounded-zul-100 px-zul-6 py-zul-1 inline-block">
        {header}
      </div>
      <div className="flex flex-col mt-zul-8 font-mono">
        <div className="text-zul-16-150 h-zul-24 font-bold ">{text}</div>
        <div className="text-zul-14-150 h-zul-24 text-sky-600">
          {bottomText}
        </div>
      </div>
    </div>
  </div>
);

export default StatCard;
