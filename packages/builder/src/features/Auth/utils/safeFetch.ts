import { taskEither, task, either } from "fp-ts";
import { pipe } from "remeda";

export const safeGetResponseData =
  (expectReturn = true) =>
  (response: Response) =>
    taskEither.tryCatch(async (): Promise<any> => {
      if (expectReturn) {
        if (response.ok) return await response.json();
      } else {
        if (response.ok) return response.ok;
      }

      if (response.status >= 500) {
        throw new Error(
          "Es gab einen Error auf dem Server. Bitte versuchen Sie es erneut."
        );
      }

      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      throw new Error(response.statusText);
    }, either.toError);

type ValidationFn<TData> = (responseBody: unknown) => TData;
type Config<TData> = {
  onSuccess: (data: TData) => void;
  onError: (error: string) => void;
  throwingValidation?: ValidationFn<TData>;
  expectReturn?: boolean;
};

export const safeFetch = <TData>(
  url: string,
  {
    body,
    ...options
  }: Omit<RequestInit, "body"> & {
    body?: Record<string, any>;
  },
  { onSuccess, onError, throwingValidation, expectReturn = true }: Config<TData>
) =>
  pipe(
    taskEither.tryCatch(
      () =>
        fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body ?? {}),
          ...options,
        }),
      either.toError
    ),
    taskEither.chain(safeGetResponseData(expectReturn)),
    taskEither.chainEitherK((response) =>
      throwingValidation
        ? either.tryCatch(() => throwingValidation(response), either.toError)
        : either.right(response)
    ),
    taskEither.fold(
      (error) => task.of(onError(error.message)),
      (data) => task.of(onSuccess(data))
    )
  )();
