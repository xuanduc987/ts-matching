import { Pattern } from '../../src/singlePattern'
import { Equals, expectType, None, Option, Some } from './utils'

interface A {
  _tag: 'A'
}

interface B {
  _tag: 'B'
}

interface C {
  _tag: 'C'
  value: string
}

interface D {
  _tag: 'D'
  value: string
}

interface E<T> {
  _tag: 'E'
  value: T
}

type Test<T> = A | B | C | D | E<T>

type ExpectedPattern =
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D: (v: D) => number
    E: (v: E<Option<string>>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D: (v: D) => number
    E: (v: E<Option<string>>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D_value: (v: string) => number
    E: (v: E<Option<string>>) => number
  }
  // E only
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D: (v: D) => number
    E_value: (v: Option<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D: (v: D) => number
    E_value_None: (v: None) => number
    E_value_Some: (v: Some<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D: (v: D) => number
    E_value_None: (v: None) => number
    E_value_Some_value: (v: string) => number
  }
  // C and D
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D_value: (v: string) => number
    E: (v: E<Option<string>>) => number
  }
  // C and E
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D: (v: D) => number
    E_value: (v: Option<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D: (v: D) => number
    E_value_None: (v: None) => number
    E_value_Some: (v: Some<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D: (v: D) => number
    E_value_None: (v: None) => number
    E_value_Some_value: (v: string) => number
  }
  // D and E
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D_value: (v: string) => number
    E_value: (v: Option<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D_value: (v: string) => number
    E_value_None: (v: None) => number
    E_value_Some: (v: Some<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C: (v: C) => number
    D_value: (v: string) => number
    E_value_None: (v: None) => number
    E_value_Some_value: (v: string) => number
  }
  // C D E
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D_value: (v: string) => number
    E_value: (v: Option<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D_value: (v: string) => number
    E_value_None: (v: None) => number
    E_value_Some: (v: Some<string>) => number
  }
  | {
    A: (v: A) => number
    B: (v: B) => number
    C_value: (v: string) => number
    D_value: (v: string) => number
    E_value_None: (v: None) => number
    E_value_Some_value: (v: string) => number
  }
  | {
    _: () => number
  }

declare const p: Pattern<'_tag', Test<Option<string>>, number>
expectType<ExpectedPattern>(p)
expectType<Equals<typeof p, ExpectedPattern>>(true)
