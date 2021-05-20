import { Adt, Du, Simplify, UnionToIntersection, UnionToIntersectionGroup } from './types'

// Expression produces a union type that is too complex to represent when T1, T2
// have 4 variants, slow down tsc when they have 3 variants
export type ExhaustiveTuplePattern<Tag extends string, T1 extends Adt<Tag>, T2 extends Adt<Tag>, R> =
  UnionToIntersectionGroup<
    [T1[Tag], T2[Tag]] extends [infer K1, infer K2] ? K1 extends T1[Tag] ? K2 extends T2[Tag] ? [
      | { [K in `${K1}, ${K2}`]: (m1: Du<Tag, K1, T1>, m2: Du<Tag, K2, T2>) => R }
      | { [K in `_, ${K2}`]: (m2: Du<Tag, K2, T2>) => R }
      | { [K in `${K1}, _`]: (m1: Du<Tag, K1, T1>) => R },
    ]
    : never
    : never
      : never
  >

type FullTuplePattern<Tag extends string, T1 extends Adt<Tag>, T2 extends Adt<Tag>, R> = UnionToIntersection<
  [T1[Tag], T2[Tag]] extends [infer K1, infer K2]
    ? K1 extends T1[Tag]
      ? K2 extends T2[Tag] ? { [K in `${K1}, ${K2}`]: (m1: Du<Tag, K1, T1>, m2: Du<Tag, K2, T2>) => R }
      : never
    : never
    : never
>

type TuplePatternWithWildcard<Tag extends string, T1 extends Adt<Tag>, T2 extends Adt<Tag>, R> = Simplify<
  | FullTuplePattern<Tag, T1, T2, R>
  | (
    & Partial<FullTuplePattern<Tag, T1, T2, R>>
    & UnionToIntersection<
      T1[Tag] extends infer K1 ? K1 extends T1[Tag] ? { [K in `${K1}, _`]?: (m1: Du<Tag, K1, T1>) => R }
      : never
        : never
    >
    & UnionToIntersection<
      T2[Tag] extends infer K2 ? K2 extends T2[Tag] ? { [K in `_, ${K2}`]?: (m2: Du<Tag, K2, T2>) => R }
      : never
        : never
    >
  )
>

type MatchTuple<A, P> = A extends `${infer A1}, ${infer A2}` ? P extends '_' ? A
: P extends `${infer P1}, ${infer P2}` ? P1 extends '_' ? P2 extends '_' ? A : (A2 extends P2 ? A : never)
: (P2 extends '_' ? (A1 extends P1 ? A : never) : A extends P ? A : never)
: never
  : never

export type IsExhaustiveTuple<Tag extends string, T1 extends Adt<Tag>, T2 extends Adt<Tag>, Ps> =
  keyof (FullTuplePattern<Tag, T1, T2, unknown> extends infer As
    ? keyof Ps extends infer P ? Omit<As, MatchTuple<keyof As, P>> : never
    : never) extends never ? true
    : false

export type TuplePattern<Tag extends string, T1 extends Adt<Tag>, T2 extends Adt<Tag>, R> =
  | TuplePatternWithWildcard<Tag, T1, T2, R>
  | {
    _: () => R
  }
