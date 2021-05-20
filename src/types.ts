export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I
  : never
export type Simplify<T> = { [K in keyof T]: T[K] }
export type UnionToIntersectionGroup<U> = (U extends [unknown] ? (k: U[0]) => void : never) extends
  ((k: infer I) => void) ? I
  : never

export type Adt<Tag extends string, Case extends string = string> = { [T in Tag]: Case }
export type Du<Tag extends string, Case extends string, T extends Adt<Tag>> = T extends Adt<Tag, Case> ? T : never
