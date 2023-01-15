import { TInputPlugin, TAnswer } from "../..";

export type InputWithAnswers = TInputPlugin<string, { answers: TAnswer[] }>;
