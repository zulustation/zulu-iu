import Link from "next/link";
import React, { FC } from "react";

export interface SubMenuItemProps {
  label: string;
  detail?: string;
  href?: string;
  active: boolean;
  showDot?: boolean;
  onClick: () => void;
}

const SubMenuItem: FC<SubMenuItemProps> = ({
  label,
  active,
  href,
  detail,
  showDot = true,
  onClick,
}) => {
  const Wrap: FC = ({ children }) =>
    href == null ? <div>{children}</div> : <Link href={href}>{children}</Link>;

  return (
    <Wrap>
      <div
        className={`cursor-pointer h-zul-56 flex items-center py-zul-16 ml-zul-24 
        text-zul-16-150  ${
          active
            ? "font-bold text-black dark:text-white"
            : "font-medium text-sky-600"
        }
        ${showDot ? "mr-zul-37" : "mr-zul-28"}
        `}
        onClick={onClick}
      >
        {active && showDot ? (
          <div className="bg-zul-blue w-zul-5 h-zul-5 rounded-full ml-zul-25"></div>
        ) : (
          <></>
        )}
        <span
          className={`zul-transition text-sky-600 hover:text-black dark:hover:text-white ${
            active && showDot ? "ml-zul-25" : showDot ? "ml-zul-55" : ""
          }`}
        >
          {label}
        </span>
        {detail ? (
          <span
            className={`${
              active ? "text-zul-blue " : "text-sky-600"
            } text-zul-10-150 ml-auto font-bold`}
          >
            {" "}
            {detail}
          </span>
        ) : (
          <></>
        )}
      </div>
    </Wrap>
  );
};

export default SubMenuItem;
