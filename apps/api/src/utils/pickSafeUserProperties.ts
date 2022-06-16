import { User } from "@open-decision/prisma";
import * as R from "remeda";

const pickSafeUserProperties = (user: User) => {
  return R.pick(user, ["uuid", "name", "email", "emailIsVerified", "role"]);
};

export default pickSafeUserProperties;
