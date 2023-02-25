import React, { FC, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";

const MarketSearch: FC = observer(() => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>();

  const router = useRouter();

  const searchMarkets = (searchText: string) => {
    router.push({ pathname: "/markets", query: { searchText } });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="flex flex-zul-basis-400 rounded-full h-zul-40 items-center justify-between w-full pl-zul-15 pr-zul-10 flex-shrink mr-zul-20 bg-sky-200 dark:bg-black"
      onClick={() => focusInput()}
    >
      <div className="flex items-center text-zul-16-150 flex-grow mr-zul-15  text-sky-600">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchMarkets(text);
          }}
          className="w-full"
        >
          <input
            type="text"
            placeholder="Search markets"
            value={text}
            ref={inputRef}
            onChange={(e) => setText(e.target.value)}
            className="bg-transparent focus:outline-none w-full"
          />
        </form>
      </div>
    </div>
  );
});

export default MarketSearch;
