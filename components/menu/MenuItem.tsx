import { motion, Variants } from "framer-motion";
import { useStore } from "lib/stores/Store";
import { observer } from "mobx-react";
import Link from "next/link";
import React, { FC, useMemo } from "react";
import { Icon, ChevronUp } from "react-feather";

export interface MenuItemProps {
  hideLabel: boolean;
  IconComponent: Icon;
  textLabel?: string;
  className?: string;
  href?: string;
  active?: boolean;
  open?: boolean;
  onClick: () => void;
}

const WrapComponent: FC<{ href: string }> = ({ children, href }) => {
  return href == null ? (
    <>{children}</>
  ) : (
    <Link href={href} scroll={true}>
      {children}
    </Link>
  );
};

const MenuChevron = ({ open }: { open: boolean }) => {
  const variants: Variants = {
    open: { rotate: 0, color: "#0001FE" },
    closed: { rotate: 180, color: "#748296" },
  };
  return (
    <motion.div
      className="ml-auto"
      variants={variants}
      animate={open ? "open" : "closed"}
      transition={{ duration: 0.3 }}
    >
      <ChevronUp size={24} className="ml-auto" />
    </motion.div>
  );
};

export const MenuItem: FC<MenuItemProps> = observer(
  ({
    IconComponent,
    textLabel,
    className = "",
    hideLabel,
    href,
    active = false,
    open,
    onClick,
  }) => {
    const store = useStore();

    const classes = useMemo(() => {
      return `flex flex-row h-zul-56 items-center cursor-pointer
      ${
        store.leftDrawerClosed === true
          ? "justify-center"
          : "py-zul-16 px-zul-11"
      }
    `;
    }, [store.leftDrawerClosed]);

    return (
      <WrapComponent href={href}>
        <div
          className={`${classes} ${className} ${
            active
              ? "bg-border-dark text-white dark:bg-sky-1100 font-bold"
              : "zul-transition text-sky-600 hover:text-white"
          } 
           rounded-zul-10 
          mx-zul-20
          `}
          onClick={onClick}
        >
          <div className="center w-zul-34">
            <IconComponent
              size={24}
              className={`p-zul-2 rounded-zul-5 ${
                active ? "bg-zul-blue text-white" : ""
              }`}
            />
          </div>
          <div
            className={`text-zul-16-150  ml-zul-15 ${hideLabel ? "hidden" : ""}
            ${open ? "text-black dark:text-white" : ""}`}
          >
            {textLabel}
          </div>
          {store.leftDrawerClosed === false && open !== undefined ? (
            <MenuChevron open={open} />
          ) : (
            <></>
          )}
        </div>
      </WrapComponent>
    );
  },
);
