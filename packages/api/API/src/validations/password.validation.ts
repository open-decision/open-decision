import { zxcvbn, ZxcvbnOptions } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import zxcvbnDePackage from "@zxcvbn-ts/language-en";

export async function isPasswordStrongEnough(password: string) {
  const slicedPassword =
    password.length > 50 ? password.substring(0, 50) : password;
  const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
      ...zxcvbnDePackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  };

  ZxcvbnOptions.setOptions(options);
  const result = await zxcvbn(slicedPassword);
  if (result.score >= 3) {
    return true;
  } else {
    return false;
  }
}
