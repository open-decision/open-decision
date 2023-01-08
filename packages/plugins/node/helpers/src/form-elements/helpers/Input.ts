import { z } from "zod";

export const Type = <
  TType extends string = string,
  TData extends z.ZodType = any
>(
  type: TType,
  data: TData
) =>
  z.object({
    id: z.string().uuid(),
    type: z.literal(type),
    label: z.string().optional(),
    name: z.string().optional(),
    data: data,
  });

export const Record = <
  TType extends string = string,
  TData extends z.ZodType = any
>(
  type: TType,
  data: TData
) => z.record(Type(type, data));

export type TType<
  TType extends string = string,
  TData extends z.ZodType = any
> = ReturnType<typeof Type<TType, TData>>;

export type TRecordType<
  TType extends string = string,
  TData extends z.ZodType = any
> = ReturnType<typeof Record<TType, TData>>;

export type TInput<
  TType extends string = string,
  TData extends z.ZodType = any
> = z.infer<ReturnType<typeof Type<TType, TData>>>;

export type TRecord<
  TType extends string = string,
  TData extends z.ZodType = any
> = z.infer<ReturnType<typeof Record<TType, TData>>>;
