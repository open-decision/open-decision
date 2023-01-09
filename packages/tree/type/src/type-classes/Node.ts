import { z } from "zod";

export const Coordinates = z.object({ x: z.number(), y: z.number() });
export type TCoordinates = z.infer<typeof Coordinates>;

export const Type = <
  TType extends string = string,
  TData extends z.ZodType = any
>(
  type: TType,
  data: TData
) =>
  z.object({
    id: z.string().uuid(),
    position: Coordinates,
    name: z.string().optional(),
    data: data,
    type: z.literal(type),
    parent: z.string().optional(),
    final: z.literal(true).optional(),
    rendererButtonLabel: z.string().optional(),
    isAddable: z.boolean().optional(),
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

export type TNode<
  TType extends string = string,
  TData extends z.ZodType = any
> = z.infer<ReturnType<typeof Type<TType, TData>>>;

export type TRecord<
  TType extends string = string,
  TData extends z.ZodType = any
> = z.infer<ReturnType<typeof Record<TType, TData>>>;
