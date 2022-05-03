import React from "react";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { getCssText } from "@open-decision/design-system";
import { defaultTheme } from "../design/stitches.config";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body className={defaultTheme}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
