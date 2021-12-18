import dotenv from "dotenv";
import path from "path";
import { EnvVars } from "../validations/env.validation";

//TODO: properly load env file
dotenv.config({ path: path.join(__dirname, `../../.env.development`) });

const validationResult = EnvVars.safeParse(process.env);

if (!validationResult.success) {
  throw new Error(
    `Invalid ENV configuration: ${JSON.stringify(
      validationResult.error.issues
    )}`
  );
}

const config = validationResult.data;
export default config;
