export interface None {
  readonly _tag: 'None'
}

export class Some<T> {
  readonly _tag = 'Some'
  constructor(readonly value: T) {}
}

export type Option<T> = None | Some<T>

export const none: Option<never> = { _tag: 'None' }
export const some = <T>(v: T): Option<T> => new Some(v)

const _pipe = (value: any, ...fns: any[]) => {
  return fns.reduce((prev, fn) => fn(prev), value)
}
export function pipe<T, R>(
  value: T,
  f: (v: T) => R,
): R {
  return _pipe(value, f)
}

// https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
export declare function expectType<T>(t: T): void
