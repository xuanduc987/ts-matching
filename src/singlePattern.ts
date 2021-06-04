import { Adt, Du, Simplify, UnionToIntersection, UnionToIntersectionGroup } from './types'

type ValueOf<T> = T[keyof T]

type SinglePropOf<Tag extends string, R> = keyof Omit<R, Tag> extends never ? never
  : keyof Omit<R, Tag> extends UnionToIntersection<keyof Omit<R, Tag>> ? keyof Omit<R, Tag>
  : never

type NestedKeys<Tag extends string, T extends Adt<Tag>> = ValueOf<
  {
    [K in T[Tag]]: SinglePropOf<Tag, Du<Tag, K, T>> extends never ? never : K
  }
>

type Exclude<T, K> = T extends unknown ? T extends K ? never : T : never

export type ExhaustivePattern<Tag extends string, T extends Adt<Tag>, R> = NestedKeys<Tag, T> extends infer NK
  ? Exclude<T[Tag], NK> extends infer OK ? 
    & { [K in OK & string]: (v: Du<Tag, K, T>) => R }
    & UnionToIntersectionGroup<
      NK extends string ? [
        SinglePropOf<Tag, Du<Tag, NK, T>> extends infer P ? P extends keyof Du<Tag, NK, T> & string ? (
          | (
            [Du<Tag, NK, T>[P]] extends infer Sub
              ? Sub extends [Adt<Tag>]
                ? ExhaustivePattern<Tag, Sub[0], R> extends infer SubPattern ? SubPattern extends unknown ? {
                  [SubKey in keyof SubPattern & string as `${NK}_${P}_${SubKey}`]: SubPattern[SubKey]
                }
                : never
                : never
              : never
              : never
          )
          | { [K in `${NK}_${P}`]: (v: Du<Tag, NK, T>[P]) => R }
          | { [K in NK]: (v: Du<Tag, NK, T>) => R }
        )
        : never
          : never,
      ]
        : never
    >
  : never
  : never

export type Pattern<Tag extends string, T extends Adt<Tag>, R> = Simplify<
  | ExhaustivePattern<Tag, T, R>
  | { _: () => R } // catch all
>
