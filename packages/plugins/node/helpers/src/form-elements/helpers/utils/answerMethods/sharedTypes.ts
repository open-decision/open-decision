import { TInputPlugin, TAnswer } from "../..";

export type InputWithAnswers = TInputPlugin<any, { answers: TAnswer[] }>;
