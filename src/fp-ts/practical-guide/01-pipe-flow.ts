import { flow } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/function'


//### PIPE
/*
    The type definition of pipe takes an arbitrary number of arguments.
    The first argument can be any arbitrary value and subsequent arguments must be functions of arity one.
    The return type of a preceding function in the pipeline must match the input type of the subsequent function.
 */


function add1(num: number): number {
    return num + 1
}

function multiply2(num: number): number {
    return num * 2
}

pipe(1, add1, multiply2) // 4


//### FLOW
/*
flow operator is almost analogous to the pipe operator.
The difference being the first argument must be a function, rather than any arbitrary value, say a number.
 */

const a = pipe(1, flow(add1, multiply2))
const b = flow(add1, multiply2)(1) // this is equivalent

console.log(a);
console.log(b);
