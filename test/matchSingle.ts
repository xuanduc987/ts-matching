import test from 'ava'
import { matchFor } from '../src'
import { none, Option, pipe, some } from './types/utils'

const match = matchFor('_tag')

test('option some', t => {
  const o = some('TS')

  const actualSome = pipe(
    o,
    match({
      Some: o => `Hello ${o.value}`,
      None: () => 'Hello world',
    }),
  )
  t.is(actualSome, 'Hello TS')

  const actualSome_ = pipe(
    o,
    match({
      Some: o => `Hello ${o.value}`,
      _: () => 'Hello world',
    }),
  )
  t.is(actualSome_, 'Hello TS')

  const actual_ = pipe(
    o,
    match({
      _: () => 'Hello world',
    }),
  )
  t.is(actual_, 'Hello world')

  const actual_Some = pipe(
    o,
    match({
      _: () => 'Hello world',
      Some: o => `Hello ${o.value}`,
    }),
  )
  t.is(actual_Some, 'Hello world')
})

test('option none', t => {
  const o: Option<string> = none

  const actualNone = pipe(
    o,
    match({
      Some: o => `Hello ${o.value}`,
      None: () => 'Hello world',
    }),
  )
  t.is(actualNone, 'Hello world')

  const actualNone_ = pipe(
    o,
    match({
      None: () => 'Hello world',
      _: () => 'Bye world',
    }),
  )
  t.is(actualNone_, 'Hello world')

  const actual_None = pipe(
    o,
    match({
      _: () => 'Bye world',
      None: () => 'Hello world',
    }),
  )
  t.is(actual_None, 'Bye world')
})

test('option option some some', t => {
  const o = some(some('a'))

  t.is(
    pipe(
      o,
      match({
        None: () => 'none',
        Some: () => 'some',
      }),
    ),
    'some',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_None: () => 'some none',
        _: () => 'other',
      }),
    ),
    'other',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_Some: (v) => 'some some ' + v.value,
        _: () => 'other',
      }),
    ),
    'some some a',
  )
})

test('option option some none', t => {
  const o: Option<Option<string>> = some(none)

  t.is(
    pipe(
      o,
      match({
        None: () => 'none',
        Some: () => 'some',
      }),
    ),
    'some',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_None: () => 'some none',
        _: () => 'other',
      }),
    ),
    'some none',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_Some: (v) => 'some some ' + v.value,
        _: () => 'other',
      }),
    ),
    'other',
  )
})

test('option option none', t => {
  const o = none as Option<Option<string>>

  t.is(
    pipe(
      o,
      match({
        None: () => 'none',
        Some: () => 'some',
      }),
    ),
    'none',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_None: () => 'some none',
        _: () => 'other',
      }),
    ),
    'other',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_Some: () => 'some some',
        _: () => 'other',
      }),
    ),
    'other',
  )
})

test('option option option some some some', t => {
  const o = some(some(some('deep')))

  t.is(
    pipe(
      o,
      match({
        None: () => 'none',
        Some: () => 'some',
      }),
    ),
    'some',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_None: () => 'some none',
        Some_value_Some_value_Some: () => 'some deep',
        _: () => 'other',
      }),
    ),
    'some deep',
  )

  t.is(
    pipe(
      o,
      match({
        Some_value_Some: () => 'some shallow',
        _: () => 'other',
      }),
    ),
    'some shallow',
  )
  t.is(
    pipe(
      o,
      match({
        Some_value_Some_value_None: () => 'none deep',
        _: () => 'other',
      }),
    ),
    'other',
  )
})
