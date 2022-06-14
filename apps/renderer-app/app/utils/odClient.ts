import { client } from "@open-decision/tree-api-specification";

export const OD = client({ urlPrefix: `${process.env.OD_API_ENDPOINT}/v1` });
