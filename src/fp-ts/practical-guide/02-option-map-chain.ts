import { pipe, flow } from 'fp-ts/lib/function'
import * as O from "fp-ts/lib/Option";
import {log} from 'fp-ts/Console'
import {undefined} from "io-ts";


// ### OPTION - makes container from value
// ### MAP - takes value from container (if its exist)

// const foo = {
//     bar: 'hello',
// }

// pipe(foo, (f) => f.bar, console.log) // hello

// pipe(
//     foo,
//     O.fromNullable,
//     O.map(({bar}) => bar),
//     console.log
// ) // { _tag: 'Some', value: 'hello' }
//
// pipe(
//     undefined,
//     O.fromNullable,
//     O.map(({bar}) => bar),
//     console.log
// ) // { _tag: 'None' }


// ### Flatten

interface Fizz {
    buzz: string
}

interface Foo {
    bar?: Fizz
}

// const foo = { bar: {buzz: "something"} } as Foo | undefined
// const foo = { bar: undefined } as Foo | undefined
const foo = undefined as Foo | undefined

// pipe(foo, (f) => f?.bar?.buzz, console.log)
//
// pipe(
//     foo,
//     O.fromNullable,
//     O.map(({ bar }) =>
//         pipe(
//             bar,
//             O.fromNullable,
//             O.map(({ buzz }) => buzz),
//         ),
//     ),
//     O.flatten, // result of the final Option
//     console.log
// ) // { _tag: 'Some', value: { _tag: 'None' } }


// following will fail in case buzz undefined

// pipe(
//     foo,
//     O.fromNullable,
//     O.map(({bar}) => bar),
//     O.map(({buzz}) => buzz),
//     O.getOrElse(() => "nothing"),
//     console.log
// )

// following will fail in case buzz undefined

// pipe(
//     foo,
//     O.fromNullable,
//     O.map(({bar}) => bar),
//     flow(
//         O.fromNullable,
//         O.flatten,
//         O.map(({buzz}) => buzz)
//     ),
//     // O.getOrElse(() => "nothing"),
//     console.log
// )


// following will work but verbose
// pipe(
//     foo,
//     O.fromNullable,
//     O.map(({bar}) =>
//         pipe(
//             bar,
//             O.fromNullable,
//             O.map(({buzz}) => buzz)
//         ),
//     ),
//     O.flatten,
//     console.log
// )

// following will work a bit less verbose

// ### Chain (flatmap) - mapping and returning deepest option

// pipe(
//     foo,
//     O.fromNullable,
//     O.map(({bar}) => bar),
//     O.chain(
//         flow(
//             O.fromNullable,
//             O.map(({buzz}) => buzz), // should receive option container
//         ),
//     ),
//     O.getOrElse(() => "nothing"), // should return same type of data in case fail
//     console.log
// )


// just play
pipe(
    foo,
    O.fromNullable,
    O.map(({bar}) => bar),
    O.chain( // chain must receive some function which accepts one param and returns option
        (banana) => pipe(
            {buzz: "wow" },
            O.fromNullable,
            O.map(({buzz}) => buzz)
        )
    ),
    O.getOrElse(() => "nothing"),
    console.log
)

