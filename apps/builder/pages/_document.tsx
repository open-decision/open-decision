import React from "react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { getCssText } from "@open-decision/design-system";
import { defaultTheme } from "../design/stitches.config";

export default class Document extends NextDocument {
  override render() {
    return (
      <Html lang="en">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#302e81" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#302e81"></meta>
        </Head>
        <body className={defaultTheme}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
