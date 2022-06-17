import { client } from "@open-decision/api-client";

export const OD = client({ urlPrefix: `${process.env.OD_API_ENDPOINT}/v1` });
