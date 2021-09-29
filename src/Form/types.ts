export type StringValue = string;
export type RecordValue = Record<string, boolean>;

export type FormStateValue = StringValue | RecordValue;

export type FormStateValuesList = Record<string, FormStateValue>;
