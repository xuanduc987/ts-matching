import { Adt, Du, Simplify, UnionToIntersection, UnionToIntersectionGroup } from './types'

type ValueOf<T> = T[keyof T]
type Strip<R> = { [K in ValueOf<{ [K in keyof R]: R[K] extends never ? never : K }>]: R[K] }
type EnsureNonEmpty<R> = keyof Strip<R> extends never ? never : R

type GroupValueOf<T, K> = K extends keyof T ? [T[K]] : never
type Peel<T> = UnionToIntersectionGroup<GroupValueOf<T, keyof T>>

type SinglePropOf<Tag extends string, R> = keyof Omit<R, Tag> extends never ? never
  : keyof Omit<R, Tag> extends UnionToIntersection<keyof Omit<R, Tag>> ? keyof Omit<R, Tag>
  : never

type Flatten<T, K extends string> = T extends Function ? { [K1 in K]: T }
  : Peel<
    {
      [K2 in keyof T & string]: Peel<
        {
          [Key in `${K}_${K2}`]: Flatten<T[K2], Key>
        }
      >
    }
  >

type JoinPath<T> = T extends unknown ? Peel<{ [K in keyof T & string]: Flatten<T[K], K> }>
  : never

type ExhaustivePattern<Tag extends string, T extends Adt<Tag>, R> = JoinPath<
  {
    [K1 in T[Tag]]:
      // level 2
      | EnsureNonEmpty<
        {
          [K2 in SinglePropOf<Tag, Du<Tag, K1, T>>]: (
            [
              Du<Tag, K1, T>[K2] extends infer Sub ? Sub extends Adt<Tag> ? Sub : never : never,
            ] extends infer Sub ? Sub extends [never] ? never : Sub extends [Adt<Tag>] ? {
              [K3 in Sub[0][Tag]]:
                // level 3
                | EnsureNonEmpty<
                  {
                    [K2 in SinglePropOf<Tag, Du<Tag, K3, Sub[0]>>]: (
                      [
                        Du<Tag, K3, Sub[0]>[K2] extends infer Sub ? Sub extends Adt<Tag> ? Sub : never : never,
                      ] extends infer SubSub ? SubSub extends [never] ? never : SubSub extends [Adt<Tag>] ? {
                        [K4 in SubSub[0][Tag]]: ((adt: Du<Tag, K4, SubSub[0]>) => R)
                      }
                      : never
                        : never
                    )
                  }
                >
                | ((adt: Du<Tag, K3, Sub[0]>) => R)
            }
            : never
              : never
          )
        }
      >
      // level 1
      | ((adt: Du<Tag, K1, T>) => R)
  }
>

export type Pattern<Tag extends string, T extends Adt<Tag>, R> = Simplify<
  | ExhaustivePattern<Tag, T, R>
  | { _: () => R } // catch all
>
