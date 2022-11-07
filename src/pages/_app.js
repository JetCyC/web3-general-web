import '../../styles/globals.css';
import '../../public/fonts/style.css';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { padWidth } from '../widget/utils';
import { createEmotionCache } from '../@core/utils/create-emotion-cache';
import { CacheProvider } from '@emotion/react';
import Head from "next/head";


const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Helvetica Neue',
      'PingFang SC',
      'Microsoft YaHei',
      'Source Han Sans SC',
      'Noto Sans CJK SC',
      'WenQuanYi Micro Hei',
      'Roboto',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#000',
    },
  },
});

theme.typography.h3 = {
  fontFamily: 'Montserrat',
  fontSize: '3.2rem',
  fontWeight: 'normal',
  [`@media (max-width: ${padWidth})`]: {
    fontSize: '2rem',
  },
};
theme.typography.h4 = {
  fontFamily: 'Montserrat',
  fontSize: '2.4rem',
  fontWeight: 'normal',
  [`@media (max-width: ${padWidth})`]: {
    fontSize: '1.8rem',
  },
};

theme.typography.faqtitle = {
  fontFamily: 'Montserrat',
  fontSize: '1.9rem',
  fontWeight: 'normal',
  [`@media (max-width: ${padWidth})`]: {
    fontSize: '1.1rem',
  },
};

theme.typography.body1 = {
  fontFamily: 'Montserrat',
  fontSize: '1.8rem',
  [`@media (max-width: ${padWidth})`]: {
    fontSize: '1.1rem',
  },
};

theme.typography.body2 = {
  fontFamily: 'Montserrat',
  fontSize: '1.3rem',
  [`@media (max-width: ${padWidth})`]: {
    fontSize: '1rem',
  },
};


const clientSideEmotionCache = createEmotionCache()

const MyApp = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
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
        <script dangerouslySetInnerHTML={{
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
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );

}

export default MyApp;
