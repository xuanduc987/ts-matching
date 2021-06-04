import { Adt, Du, Simplify, UnionToIntersection } from './types'

type ValueOf<T> = T[keyof T]

type SinglePropOf<Tag extends string, R> = keyof Omit<R, Tag> extends never ? never
  : keyof Omit<R, Tag> extends UnionToIntersection<keyof Omit<R, Tag>> ? keyof Omit<R, Tag>
  : never

export interface None {
  readonly _tag: 'None'
}

export interface None2 {
  readonly _tag: 'None2'
}

export class Some<T> {
  readonly _tag = 'Some'
  constructor(readonly value: T) {}
}

export type Option<T> = None2 | None | Some<T>

type GetFullPattern<Tag extends string, T extends Adt<Tag>, R> = {
  [K in T[Tag]]: (v: Du<Tag, K, T>) => R
}

type NestedKeys<Tag extends string, T extends Adt<Tag>> = ValueOf<
  {
    [K in T[Tag]]: SinglePropOf<Tag, Du<Tag, K, T>> extends never ? never : K
  }
>

type AltPatternsFor<Tag extends string, T extends Adt<Tag>, K extends T[Tag], R> = K extends unknown
  ? SinglePropOf<Tag, Du<Tag, K, T>> extends infer P ? P extends keyof Du<Tag, K, T> & string ? (
    | (
      & Omit<GetFullPattern<Tag, T, R>, K>
      & (
        [Du<Tag, K, T>[P]] extends infer Sub
          ? Sub extends [Adt<Tag>]
            ? ExhaustivePattern<Tag, Sub[0], R> extends infer SubPattern ? SubPattern extends unknown ? {
              [SubKey in keyof SubPattern & string as `${K}_${P}_${SubKey}`]: SubPattern[SubKey]
            }
            : never
            : never
          : never
          : never
      )
    )
    | (
      & Omit<GetFullPattern<Tag, T, R>, K>
      & {
        [K_ in `${K}_${P}`]: (v: Du<Tag, K, T>[P]) => R
      }
    )
  )
  : never
  : never
  : never

type ExhaustivePattern<Tag extends string, T extends Adt<Tag>, R> =
  | GetFullPattern<Tag, T, R>
  | AltPatternsFor<Tag, T, NestedKeys<Tag, T>, R>

export type Pattern<Tag extends string, T extends Adt<Tag>, R> = Simplify<
  | ExhaustivePattern<Tag, T, R>
  | { _: () => R } // catch all
>
