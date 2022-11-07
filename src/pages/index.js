import { useEffect } from "react";
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
      <Intro />
      <Mint />
      {/* <Show /> */}
      {/* <Gallery /> */}
      <Footer />
    </div>
  );
}
