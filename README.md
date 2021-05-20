# ts-matching

A pattern matching libary for typescript with smart type inference.

## Install

yarn

```
yarn add ts-matching
```

npm

```
npm install --save ts-matching
```

## Usage

### `matchFor`

```typescript
import { matchFor } from 'ts-matching'
import { pipe } from 'fp-ts/function'

type Option<T> = { _tag: 'None' } | { _tag: 'Some', value: T }
const none: Option<never> = { _tag: 'None' }
const some = <T>(value: T): Option<T> => ({ _tag: 'Some', value })

type RemoteData<E, T> = { _tag: 'Loading' } | { _tag: 'Success', value: T } | { _tag: 'Failure', error: E }

const match = matchFor('_tag')

const toMsg = (data: RemoteData<Error, Option<string>>) =>
  pipe(
    data,
    match({
      Loading: () => 'loading',
      Failure: (e) => `error: ${e.error.message}`,
      Success_value_Some: (v) => `found ${v.value}`,
      Success_value_None: () => 'not found',
    }),
  )

assert.strictEqual(toMsg({ _tag: 'Loading' }), 'loading')
assert.strictEqual(toMsg({ _tag: 'Success', value: some('a') }), 'found a')
assert.strictEqual(toMsg({ _tag: 'Success', value: none }), 'not found')
```

### `matchWithFor`

```typescript
import { matchWithFor } from 'ts-matching'

type Option<T> = { _tag: 'None' } | { _tag: 'Some', value: T }
const none: Option<never> = { _tag: 'None' }
const some = <T>(value: T): Option<T> => ({ _tag: 'Some', value })

type RemoteData<E, T> = { _tag: 'Loading' } | { _tag: 'Success', value: T } | { _tag: 'Failure', error: E }

const match = matchWithFor('_tag')

const toMsg = (data: RemoteData<Error, Option<string>>) => match(data).with({
  Loading: () => 'loading',
  Failure: (e) => `error: ${e.error.message}`,
  Success_value_Some: (v) => `found ${v.value}`,
  Success_value_None: () => 'not found'
})

assert.strictEqual(toMsg({ _tag: 'Loading' }), 'loading')
assert.strictEqual(toMsg({ _tag: 'Success', value: some('a') }), 'found a')
assert.strictEqual(toMsg({ _tag: 'Success', value: none }), 'not found')
```
## License
[MIT](./LICENSE)
