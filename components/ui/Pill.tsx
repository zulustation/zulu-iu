import { FC } from "react";

const Pill: FC<{ title: string; value: string }> = ({
  title,
  value,
  children,
}) => {
  return (
    <div
      className="flex w-full justify-center bg-sky-200 dark:bg-border-dark rounded-zul-100 
      text-zul-12-150 py-zul-5 mr-zul-15 mb-zul-10 min-w-[90px] max-w-[170px]"
    >
      <span className="font-bold mr-zul-3">{title}: </span>
      <span className="">{value}</span>
      {children}
    </div>
  );
};

export default Pill;
