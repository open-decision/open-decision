import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import Docxtemplater from "docxtemplater";
import { DXT } from "docxtemplater";
import PizZip from "pizzip";
import expressionParser from "docxtemplater/expressions";
import { APIError } from "@open-decision/type-classes";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reqData = z
    .object({
      templateUrl: z.string(),
      variables: z.object({}).passthrough(),
    })
    .parse(req.body);

  const docTemplate = await fetch(reqData.templateUrl, {
    method: "get",
  }).then((res) => {
    if (res.status != 200 || !res.body) {
      throw new APIError({
        code: "DOC_GENERATION_FAILED",
      });
    } else {
      return res.arrayBuffer();
    }
  });

  const zip = new PizZip(docTemplate);
  // const exp = new expressionParser();
  // exp.filters.contains = function (
  //   stringToCheck: string,
  //   searchString: string
  // ) {
  //   if (!stringToCheck) return stringToCheck;
  //   return stringToCheck.toLowerCase().includes(searchString.toLowerCase());
  // };

  // exp.filters.containsNot = function (
  //   stringToCheck: string,
  //   searchString: string
  // ) {
  //   if (!stringToCheck) return stringToCheck;
  //   return !stringToCheck.toLowerCase().includes(searchString.toLowerCase());
  // };

  function nullGetter(part: DXT.Part): any {
    if (!part.module) {
      return "#######";
    }
    if (part.module === "rawxml") {
      return "";
    }
    return "";
  }
  let doc;
  try {
    doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: expressionParser,
      nullGetter: nullGetter,
    });
  } catch (e) {
    return res.status(500).send({});
  }
  // Render the document
  doc.render(reqData.variables);

  const buf: Buffer = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  res.send(buf);
}

export default handler;
