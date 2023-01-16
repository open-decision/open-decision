import { IInputPlugin } from "../../InputPlugin";
import { TAnswer } from "../../types/answer";

export interface InputWithAnswers extends IInputPlugin<string> {
  answers: TAnswer[];
}
