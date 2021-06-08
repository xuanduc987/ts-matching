import test from 'ava'
import { matchWithFor } from '../src'
import { none, Option, some } from './types/utils'

const match = matchWithFor('_tag')

test('option undefined', t => {
  const o = some(void 0)
  t.is(
    match(o).with({
      Some_value: () => 1,
      None: () => 0,
    }),
    1,
  )
})

test('option some', t => {
  const o = some('TS')

  const actualSome = match(o).with({
    Some_value: value => `Hello ${value}`,
    None: () => 'Hello world',
  })
  t.is(actualSome, 'Hello TS')

  const actualSome_ = match(o).with({
    Some_value: value => `Hello ${value}`,
    _: () => 'Hello world',
  })
  t.is(actualSome_, 'Hello TS')

  const actual_ = match(o).with({
    _: () => 'Hello world',
  })
  t.is(actual_, 'Hello world')

  const actual_Some = match(o).with({
    _: () => 'Hello world',
    Some_value: value => `Hello ${value}`,
  })
  t.is(actual_Some, 'Hello world')
})

test('option none', t => {
  const o: Option<string> = none

  const actualNone = match(o).with({
    Some_value: value => `Hello ${value}`,
    None: () => 'Hello world',
  })
  t.is(actualNone, 'Hello world')

  const actualNone_ = match(o).with({
    None: () => 'Hello world',
    _: () => 'Bye world',
  })
  t.is(actualNone_, 'Hello world')

  const actual_None = match(o).with({
    _: () => 'Bye world',
    None: () => 'Hello world',
  })
  t.is(actual_None, 'Bye world')
})

test('option option some some', t => {
  const o = some(some('a'))

  t.is(
    match(o).with({
      None: () => 'none',
      Some_value: () => 'some',
    }),
    'some',
  )

  t.is(
    match(o).with({
      Some_value_None: () => 'some none',
      _: () => 'other',
    }),
    'other',
  )

  t.is(
    match(o).with({
      Some_value_Some_value: value => 'some some ' + value,
      _: () => 'other',
    }),
    'some some a',
  )
})

test('option option some none', t => {
  const o: Option<Option<string>> = some(none)

  t.is(
    match(o).with({
      None: () => 'none',
      Some_value: () => 'some',
    }),
    'some',
  )

  t.is(
    match(o).with({
      Some_value_None: () => 'some none',
      _: () => 'other',
    }),
    'some none',
  )

  t.is(
    match(o).with({
      Some_value_Some_value: (value) => 'some some ' + value,
      _: () => 'other',
    }),
    'other',
  )
})

test('option option none', t => {
  const o = none as Option<Option<string>>

  t.is(
    match(o).with({
      None: () => 'none',
      Some_value: () => 'some',
    }),
    'none',
  )

  t.is(
    match(o).with({
      Some_value_None: () => 'some none',
      _: () => 'other',
    }),
    'other',
  )

  t.is(
    match(o).with({
      Some_value_Some_value: () => 'some some',
      _: () => 'other',
    }),
    'other',
  )
})

test('option option option some some some', t => {
  const o = some(some(some('deep')))

  t.is(
    match(o).with({
      None: () => 'none',
      Some_value: () => 'some',
    }),
    'some',
  )

  t.is(
    match(o).with({
      Some_value_None: () => 'some none',
      Some_value_Some_value_Some_value: () => 'some deep',
      _: () => 'other',
    }),
    'some deep',
  )

  t.is(
    match(o).with({
      Some_value_Some_value: () => 'some shallow',
      _: () => 'other',
    }),
    'some shallow',
  )
  t.is(
    match(o).with({
      Some_value_Some_value_None: () => 'none deep',
      _: () => 'other',
    }),
    'other',
  )
})
