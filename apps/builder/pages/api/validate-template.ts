import { NextApiRequest, NextApiResponse } from "next";
import z from "zod";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import * as expressionParser from "docxtemplater/expressions";
import InspectModule from "docxtemplater/js/inspect-module";
import { APIError } from "@open-decision/type-classes";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reqData = z
    .object({
      templateUrl: z.string(),
    })
    .parse(req.body);
  const docTemplate = await fetch(reqData.templateUrl, {
    method: "get",
  }).then((docRes) => {
    if (docRes.status != 200 || !docRes.body) {
      throw new APIError({
        code: "DOC_GENERATION_FAILED",
      });
    } else {
      return docRes.arrayBuffer();
    }
  });

  const zip = new PizZip(docTemplate);
  const iModule = new InspectModule();
  let tags = {};
  try {
    new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: expressionParser,
      modules: [iModule],
    });
    tags = iModule.getAllTags();
    res.json({
      isValid: true,
      variables: tags,
    });
  } catch (error: any) {
    if (error.properties && error.properties.errors instanceof Array) {
      const errorMessages = error.properties.errors
        .map((error: any) => {
          return error.properties.explanation;
        })
        .join("\n");
      res.status(400).json({
        isValid: false,
        error: errorMessages,
      });
    } else {
      res.status(400).json({ isValid: false, error: error });
    }
  }
}

export default handler;
