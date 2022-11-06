import { useEffect } from "react";
import Head from "next/head";
import initSentry from "../widget/sentryInite"
import Intro from "../layout/components/Intro";
import FAQ from "../layout/components/FAQ";
import Mint from "../layout/components/Mint";
import Roadmap from "../layout/components/Roadmap";
import Footer from "../layout/components/Footer";
import About from "../layout/components/About";
import Gallery from "../layout/components/Gallery";
import Show from "../layout/components/Show";

export default function Home() {
  useEffect(() => {
    if (window.console) {
      console.log(
        "%c Hello,everyone.",
        "font-size: 20px;"
      );
    }
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      width: '100%', 
      flexDirection: "column", 
      alignItems: "center",
      paddingBottom: '40px',
       }}>
      <Head>
        <title>WEB3 NFT</title>
        <meta charset="utf-8" />
        <meta name="description" content="Start the Web3er Space journey now by owning a WEB3 NFT." />
        <meta name="keywords" content="WEB3,WEB3NFT,NFT,Metaverse" />
        <meta name="author" content="WEB3" />
        <link rel="icon" href="/favicon.png" />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <Intro />
      <Mint />
      {/* <Show /> */}
      {/* <Gallery /> */}
      <Footer /> 
    </div>
  );
}
