import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as S from 'fp-ts/string'
import * as N from 'fp-ts/number'
import * as D from 'fp-ts/date'
import * as Ord from 'fp-ts/Ord'

// // ## array functions
const foo = [1, 2, 3, 4, 5]
//
const sum = pipe(
    // A.array.map(foo, (x) => x - 1),
    foo,
    A.filter((x: number) => x % 2 === 0),
    A.reduce(0, (prev, next) => prev + next),
)
console.log(sum) // 6

// // ## zip
// const foo = [1, 2, 3]
// const bar = ['a', 'b', 'c']
//
// const zipped = pipe(foo, A.zip(bar))
// console.log(zipped) // [[1, 'a], [2, 'b], [3, 'c']]
//
//
// // ## lookup, NEA
// pipe([1, 2, 3], A.lookup(1)) // { _tag: 'Some', value: 2 }
// pipe([1, 2, 3], A.lookup(3)) // { _tag: 'None' }

// const foo = [1, 2, 3]
// if (A.isNonEmpty(foo)) {
//     const firstElement = NEA.head(foo) // 1
// }


// #### Semigroups is a type that is able to take two homogenous values and produce a single homogenous value.

type dataObj = {
    treaty_create_date: Date
    id: number
}

const data = [
    {
        treaty_create_date: "2014-01-21T00:00:00",
        id: 3
    },
    {
        treaty_create_date: "2015-04-03T00:00:00",
        id: 1
    },
    {
        treaty_create_date: "2020-01-21T00:00:00",
        id: 0
    }
]

// const ordDate = D.Ord
//

// const ordString = S.Ord
//
// const ordStringLength = pipe(N.Ord, Ord.contramap((s: string) => s.length))
//
// const listOfStrings = ['bb', 'a', 'aaa']
//
// const sorted = pipe(listOfStrings, A.sort(ordStringLength))


const sortedData = pipe(
    data,
    A.map((dataObj) => ({
        ...dataObj,
        treaty_create_date: new Date(dataObj.treaty_create_date)
    })),
    A.sort(Ord.reverse(pipe(D.Ord, Ord.contramap((o: {treaty_create_date: Date}) => o.treaty_create_date))))
)


console.log(sortedData);
