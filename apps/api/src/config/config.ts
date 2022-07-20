import { baseEnvVars } from "../validations/env.validation";

const validationResult = baseEnvVars.safeParse(process.env);

if (!validationResult.success) {
  throw new Error(
    `Invalid ENV configuration: ${JSON.stringify(
      validationResult.error.issues
    )}`
  );
}

const config = validationResult.data;
export default config;
