import Avatar from "components/ui/Avatar";
import { observer } from "mobx-react";
import React, { FC } from "react";

export interface AccountSelectValueProps {
  name: string;
  address: string;
}

const AccountSelectValue: FC<AccountSelectValueProps> = observer(
  ({ name, address }) => {
    return (
      <div className="flex items-center justify-between h-full w-full px-zul-8 bg-sky-100 dark:bg-black rounded-zul-10">
        <div className="center rounded-full w-zul-28 h-zul-28 bg-white dark:bg-sky-1000">
          <div className="rounded-full w-zul-22 h-zul-22 bg-sky-100 dark:bg-black">
            <Avatar zoomed address={address} />
          </div>
        </div>
        <div className="flex flex-col ml-zul-16">
          <div className="font-bold text-sky-600 text-zul-10-150 uppercase">
            {name}
          </div>
          <div className="font-mono text-zul-12-120 font-semibold">
            {address}
          </div>
        </div>
      </div>
    );
  },
);

export default AccountSelectValue;
