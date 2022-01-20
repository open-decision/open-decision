import * as TaskEither from "fp-ts/TaskEither";
import * as Either from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as Task from "fp-ts/Task";

type ValidationFn<TData> = (responseBody: unknown) => TData;
type Config<TData> = {
  onSuccess: (data: TData) => void;
  onError: (error: string) => void;
  throwingValidation?: ValidationFn<TData>;
};

export const safeFetch = <TData>(
  url: string,
  {
    body,
    ...options
  }: Omit<RequestInit, "body"> & {
    body?: Record<string, any>;
  },
  { onSuccess, onError, throwingValidation }: Config<TData>
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
    TaskEither.chain((response) =>
      TaskEither.tryCatch(async (): Promise<any> => {
        const body = await response.json();

        if (response.ok) return body;

        throw new Error(body.message);
      }, Either.toError)
    ),
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
