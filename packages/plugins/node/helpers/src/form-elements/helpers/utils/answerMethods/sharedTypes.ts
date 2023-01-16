import { IInputPlugin, TAnswer } from "../..";

export interface InputWithAnswers extends IInputPlugin<string> {
  answers: TAnswer[];
}
