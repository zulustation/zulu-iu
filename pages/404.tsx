import { useUserStore } from "lib/stores/UserStore";
import { observer } from "mobx-react";
import Image from "next/image";
import { useRouter } from "next/router";

const NotFoundPage = observer(
  ({ backText, backLink }: { backText?: string; backLink?: string }) => {
    const router = useRouter();
    const userStore = useUserStore();
    const src = userStore.theme === "dark" ? "/dark-404.png" : "/light-404.png";

    const handleClick = () => {
      router.push(backLink);
    };

    return (
      <>
        <Image
          src={src}
          height={1080}
          width={1920}
          layout="responsive"
          objectFit="scale-down"
          alt="404 Page"
        />
        {backText && backLink ? (
          <div className="flex justify-center items-center mb-zul-40">
            <button
              onClick={handleClick}
              className=" font-bold text-sky-600 border border-sky-600 rounded-zul-10 px-zul-50 py-zul-7"
            >
              {backText}
            </button>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  },
);

export default NotFoundPage;
