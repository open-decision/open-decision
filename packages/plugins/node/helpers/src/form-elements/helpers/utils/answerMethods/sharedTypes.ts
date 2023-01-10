import { IInputPlugin, TAnswer } from "../..";

export type InputWithAnswers = IInputPlugin<any, { answers: TAnswer[] }>;
