import { Pattern } from '../../src/singlePattern'
import { None, Option, Some } from './utils'

// https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
declare function expectType<T>(t: T): void

type ExpectedPattern0 =
  | {
    None: (adt: None) => number
    Some: (adt: Some<string>) => number
  }
  | {
    None: (adt: None) => number
    Some_value: (value: string) => number
  }
  | {
    _: () => number
  }

declare const p0: Pattern<'_tag', Option<string>, number>
expectType<ExpectedPattern0>(p0)
expectType<Equals<typeof p0, ExpectedPattern0>>(true)

type ExpectedPattern1 =
  | {
    None: (adt: None) => number
    Some: (adt: Some<Option<string>>) => number
  }
  | {
    None: (adt: None) => number
    Some_value_Some: (adt: Some<string>) => number
    Some_value_None: (adt: None) => number
  }
  | {
    None: (adt: None) => number
    Some_value_Some_value: (value: string) => number
    Some_value_None: (adt: None) => number
  }
  | {
    _: () => number
  }

declare const p1: Pattern<'_tag', Option<Option<string>>, number>

expectType<ExpectedPattern1>(p1)
expectType<Equals<typeof p1, ExpectedPattern1>>(true)

type ExpectedPattern2 =
  | {
    None: (adt: None) => number
    Some: (adt: Some<Option<Option<string>>>) => number
  }
  | {
    None: (adt: None) => number
    Some_value_Some: (adt: Some<Option<string>>) => number
    Some_value_None: (adt: None) => number
  }
  | {
    None: (adt: None) => number
    Some_value_None: (adt: None) => number
    Some_value_Some_value_Some: (adt: Some<string>) => number
    Some_value_Some_value_None: (adt: None) => number
  }
  | {
    _: () => number
  }

declare const p2: Pattern<'_tag', Option<Option<Option<string>>>, number>

expectType<ExpectedPattern2>(p2)
expectType<Equals<typeof p2, ExpectedPattern2>>(true)

type ExpectedPattern3 =
  | {
    None: (adt: None) => number
    Some: (adt: Some<Option<Option<Option<string>>>>) => number
  }
  | {
    None: (adt: None) => number
    Some_value_Some: (adt: Some<Option<Option<string>>>) => number
    Some_value_None: (adt: None) => number
  }
  | {
    None: (adt: None) => number
    Some_value_None: (adt: None) => number
    Some_value_Some_value_Some: (adt: Some<Option<string>>) => number
    Some_value_Some_value_None: (adt: None) => number
  }
  | {
    _: () => number
  }

declare const p3: Pattern<'_tag', Option<Option<Option<Option<string>>>>, number>
expectType<ExpectedPattern3>(p3)
expectType<Equals<typeof p3, ExpectedPattern3>>(true)
