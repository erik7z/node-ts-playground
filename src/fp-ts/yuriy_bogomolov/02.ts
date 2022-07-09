import * as O from 'fp-ts/lib/Option'
import Option = O.Option;

const a: Option<number> = O.some(41);

const addOne = (n: number) => n + 1;

const aPlusOne = O.map(addOne)(a)

console.log(aPlusOne);
