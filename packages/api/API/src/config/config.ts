import dotenv from "dotenv";
import path from "path";
import { z } from "zod";
import { EnvVars } from "../validations/env.validation";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const validationResult = EnvVars.safeParse(config);

if (!validationResult.success) {
  throw new Error(
    `Invalid ENV configuration: ${validationResult.error.issues}`
  );
}

type EnvVarsType = z.infer<typeof EnvVars>;

const config = validationResult.data;
export default config;
