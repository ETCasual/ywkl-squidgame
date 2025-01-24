import Head from "next/head";
import type { FunctionComponent } from "react";
import React, { useEffect, useState } from "react";

type Data = {
  createdAt: string;
  updatedAt: string;
  number: number;
  src: string;
  id: number;
};

export default function Home() {
  const [data, setData] = useState<Data[]>();

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/getAll")
        .then((res) => res.json())
        .then((data: Data[]) => {
          setData(data);
        });
    };
    void fetchData();
    const interval = setInterval(() => {
      void fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  // Add useEffect for centering and zooming
  // React.useEffect(() => {
  //   // Add zoom effect
  //   document.body.style.transform = "scale(1.07)";
  //   document.body.style.transformOrigin = "10% center";
  // }, []);

  return (
    <>
      <Head>
        <title>YW Squid Game L5</title>
        <meta name="description" content="YW Squid Game L5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative min-h-[1000px] min-w-[4000px] overflow-hidden bg-[url('/bg.jpg')] bg-cover bg-center px-20 py-14">
        <div className={`grid-container`}>
          {data
            ?.sort((a, b) => a.number - b.number)
            .map((item) => {
              const num = item.number;
              const paddedNo =
                num < 10 ? `00${num}` : num < 100 ? `0${num}` : `${num}`;
              return (
                <GridItem key={item.number} imgSrc={item.src} no={paddedNo} />
              );
            })}
          {/* <GridItem imgSrc="/test.jpeg" no="001" sequence={1} /> */}
        </div>
      </main>
    </>
  );
}

interface GridItemProps {
  imgSrc?: string;
  no: string;
}

const GridItem: FunctionComponent<GridItemProps> = ({ imgSrc, no }) => {
  return (
    <div className={`div-grid`}>
      <div>
        <div className={`absolute h-full w-full bg-[#ff0096] transition-all`} />
        <div
          style={{
            backgroundImage: imgSrc ? `url('${imgSrc}')` : "bg-black",
          }}
          className={`div-grid2 relative -left-[0px] -top-[0px] flex h-full flex-col bg-cover bg-center transition-all`}
        >
          <div
            className={`font-zekton absolute bottom-7 flex w-full flex-col items-center justify-center font-bold transition-all`}
          >
            <p className="w-full text-center text-[4rem] font-bold leading-[0.75] text-[#00FF00] [text-shadow:_0_0_5px_#ffffff]">
              {no}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
