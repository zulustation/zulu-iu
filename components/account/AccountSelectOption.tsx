import Avatar from "components/ui/Avatar";
import { observer } from "mobx-react";
import React, { FC } from "react";

export interface AccountSelectRowProps {
  name: string;
  address: string;
}

const AccountSelectOption: FC<AccountSelectRowProps> = observer(
  ({ name, address }) => {
    return (
      <div className="flex p-zul-8 items-center bg-sky-100 dark:bg-black cursor-pointer text-black dark:text-white">
        <div className="center rounded-full w-zul-28 h-zul-28">
          <div className="mr-4 rounded-full w-zul-22 h-zul-22 bg-sky-100 dark:bg-black">
            <Avatar zoomed address={address} />
          </div>
        </div>
        <div className="flex flex-col mr-zul-10">
          <div className="text-zul-12-120 font-medium">{name}</div>
          <div className="font-mono text-zul-12-120 font-semibold">
            {address}
          </div>
        </div>
      </div>
    );
  },
);

export default AccountSelectOption;
