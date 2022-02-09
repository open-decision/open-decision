import { ValidationError } from "class-validator";
import { UUID } from "../types/uuid-class";

function getConstraint(idOrUUID: string | number | UUID) {
  let value = idOrUUID;
  if (value instanceof UUID) {
    value = value.toString();
  }
  if (typeof value === "string") {
    return {
      uuid: value,
    };
  } else {
    return {
      id: value,
    };
  }
}

export default getConstraint;
