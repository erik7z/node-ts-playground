import * as T from 'fp-ts/lib/Task'
import { Do } from 'fp-ts-contrib/lib/Do'


// ### url https://rlee.dev/practical-guide-to-fp-ts-p6-the-do-notation
// ### Monad  is any type that has the following instance methods: OF, MAP, CHAIN, AP


// filler values for brevity
type A = 'A'
type B = 'B'
type C = 'C'

declare const fa: () => T.Task<A>
declare const fb: (a: A) => T.Task<B>
declare const fc: (ab: { a: A; b: B }) => T.Task<C>

//
// T.task.chain(
//     fa(),
//     (a) => T.task.chain(
//         fb(a),
//         (b) => fc({a, b})
//     )
// ) // Task<"C">


// const res = Do(T.task)
//     .bind('a', fa()) // task
//     .bindL('b', ({ a } /* context */) => fb(a)) // lazy task
//     .bindL('c', fc) // lazy task
//     .return(({ c }) => c) // Task<"C">
//
// console.log(res);
