import { Pattern } from './singlePattern'
import { Adt } from './types'

interface MatchWith<Tag extends string> {
  <V extends Adt<Tag>>(v: V): { with: <R>(pattern: Pattern<Tag, V, R>) => R }
}

type UnionValueOf<T> = T extends unknown ? T[keyof T] : never
type UnionReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type _R<T> = UnionReturnType<UnionValueOf<T>>

interface Match<Tag extends string> {
  <V extends Adt<Tag>, P extends Pattern<Tag, V, unknown>>(pattern: P): (v: V) => _R<P>
}

const tryMatch = (tag: string, [k, field, ...rest]: string[], v: any): unknown => {
  if (!k) return [v]
  if (k === '_') return [null]
  if (v?.[tag] !== k) return
  if (!v) return
  if (field) return tryMatch(tag, rest, v[field])
  return [v]
}

export const matchFor = <Tag extends string>(tag: Tag): Match<Tag> =>
  ((pattern: Record<string, Function>) =>
    (value: unknown) => {
      for (const [p, f] of Object.entries(pattern)) {
        const ps = p === '_' ? ['_'] : p.split('_')
        const m = tryMatch(tag, ps, value)
        if (m !== undefined && Array.isArray(m)) {
          return f(m[0] ?? undefined)
        }
      }
      throw new TypeError('Incomplete pattern!')
    }) as any

export const matchWithFor = <Tag extends string>(tag: Tag): MatchWith<Tag> => {
  const match = matchFor(tag)
  return (vs: any) => ({ with: (pattern: any) => match(pattern)(vs) as any })
}
