import { useAccountModals } from "lib/hooks/account";
import { useStore } from "lib/stores/Store";
import Wallets, { WalletErrorMessage } from "lib/wallets";
import { Wallet } from "lib/wallets/types";
import { flowResult } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Download } from "react-feather";

const WalletSelect = observer(() => {
  const store = useStore();
  const { wallets } = store;
  const { errorMessages, enablingInProgress } = wallets;
  const accountModals = useAccountModals();

  const selectWallet = async (wallet: Wallet) => {
    wallets.stopEnableLoop();
    if (!wallet.installed) {
      window.open(wallet.installUrl);
    } else {
      try {
        await flowResult(wallets.connectWallet(wallet.extensionName, true));

        if (!wallets.faultyConnection) {
          accountModals.openAccontSelect();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    return () => {
      wallets.stopEnableLoop();
    };
  }, [enablingInProgress]);

  return (
    <div className="flex flex-col">
      {Wallets.supportedWallets.map((wallet, idx) => {
        const error = errorMessages.find(
          (e) => e.extensionName === wallet.extensionName,
        );
        const hasError = error != null;
        return (
          <div key={wallet.extensionName}>
            <div
              className={
                "flex flex-row h-zul-64 items-center rounded-zul-12 bg-sky-100 dark:bg-sky-700 px-zul-12 cursor-pointer " +
                (idx < 2 ? "mb-zul-12 " : "")
              }
              onClick={() => {
                selectWallet(wallet);
              }}
            >
              <img
                className="w-zul-32 h-zul-32 text-zul-12-120 center mr-zul-10"
                alt={wallet.logo.alt}
                src={wallet.logo.src}
              />
              <div className="flex items-center  text-zul-18-150">
                {wallet.title}
              </div>
              {!wallet.installed && (
                <div className="ml-auto">
                  <Download size={24} />
                </div>
              )}
              {hasError && (
                <div className="text-vermilion ml-auto  text-zul-12-120 w-zul-275">
                  {error.message}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default WalletSelect;
