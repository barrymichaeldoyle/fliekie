export type Status<T = object> = ErrorStatus | SuccessStatus<T>;
export type ErrorStatus = { type: "error"; message: string };
export type SuccessStatus<T> = { type: "success" } & T;
