import * as TaskEither from "fp-ts/TaskEither";
import * as Either from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as Task from "fp-ts/Task";

export const safeGetResponseData =
  (expectReturn = true) =>
  (response: Response) =>
    TaskEither.tryCatch(async (): Promise<any> => {
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
    }, Either.toError);

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
    TaskEither.tryCatch(
      () =>
        fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body ?? {}),
          ...options,
        }),
      Either.toError
    ),
    TaskEither.chain(safeGetResponseData(expectReturn)),
    TaskEither.chainEitherK((response) =>
      throwingValidation
        ? Either.tryCatch(() => throwingValidation(response), Either.toError)
        : Either.right(response)
    ),
    TaskEither.fold(
      (error) => Task.of(onError(error.message)),
      (data) => Task.of(onSuccess(data))
    )
  )();
