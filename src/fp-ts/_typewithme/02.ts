import * as IO from "io-ts";
import {pipe, flow} from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Option, some } from 'fp-ts/lib/Option'
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
// import {Task} from 'fp-ts/lib/Task'
import * as T from 'fp-ts/lib/Task'
// import * as Semigroup from 'fp-ts/lib/Semigroup'
import {Either, right, left, chain, flatten, mapLeft} from "fp-ts/lib/Either";
import {NonEmptyArray} from "fp-ts/NonEmptyArray";
import * as A from 'fp-ts/lib/Array'
import {Semigroup} from "fp-ts/Semigroup";
import {Monoid} from "fp-ts/lib/Monoid";
import {Do} from 'fp-ts-contrib/lib/Do'
import {Lens, fromTraversable, Optional} from "monocle-ts";
import {array} from 'fp-ts/lib/Array'
import {make, tree, Tree} from 'fp-ts/lib/Tree'

interface Fizz {
  buzz: string
}

interface Foo {
  bar?: Fizz
}

const foo = {bar: {buzz: 'whatsapp'}} as Foo | undefined
const n = 123
const fooFunc = ({bar}:Foo) => bar

// const res = pipe(
//     foo,
//     O.fromNullable,
//     O.map(({bar}) => bar)
// )
//
// console.log(res);

// const res = pipe(
//     foo,
//     O.fromNullable,
//     O.chain(({bar}) =>
//         pipe(
//             bar,
//             O.fromNullable,
//             O.map(({buzz}) => buzz),
//             (b) => b
//         )
//     )
// )

const res = pipe(
    123,
    O.fromNullable,
    // O.map((ccc) => 456),
    O.chain(bb => O.fromNullable(123))
        // pipe(
        // 567,
        // O.fromNullable,
        // O.map(ccc => ccc)
    // ))
    // O.chain((bbb) => O.fromNullable(bbb))
)

console.log(res)

// pipe(
//   foo,
//   O.fromNullable,
//   O.chain(({bar}: Foo) =>
//     pipe(
//       bar,
//       O.fromNullable,
//       O.map(({buzz} : Fizz) => buzz)
//     )
//   ),
//   console.log
// )
