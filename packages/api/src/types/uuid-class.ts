import isUUID from "validator/lib/isUUID";

export class UUID {
  private str: string;

  constructor(str: string) {
    this.str = str;
  }

  toString() {
    return this.str;
  }

  isValid() {
    return isUUID(this.str);
  }
}
