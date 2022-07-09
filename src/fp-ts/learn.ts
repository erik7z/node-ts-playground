import * as IO from "io-ts";
import {pipe, flow} from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Option, some } from 'fp-ts/lib/Option'
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import {Task} from 'fp-ts/lib/Task'
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

// --- ! Youtube (Bogomolov)

//
// const a: Option<number> = O.some(41);
//
// const addOne = (n: number) => n+1;
//
// const aPlusOne = O.map(addOne)(a);
//
// const aPlusTwo = pipe(
//   a,
//   O.map(addOne),
//   O.map(addOne)
// )
//
// console.log(aPlusOne);
// console.log(aPlusTwo);
//
// const one: number | null = pipe(
//   aPlusOne,
//   O.fold(
//     () => null,
//     (n) => n
//   )
// )
//
// const two: number | null = pipe(
//   aPlusTwo,
//   O.toNullable
// )
//
// console.log(one);
// console.log(two);

// --- example IO

// const parseJson = (input: string): Either<Error, number[]> => {
//   try{
//     const numbers = JSON.parse(input);
//     return E.right(numbers);
//   } catch(error) {
//     return E.left(error);
//   }
// }
//
// const avg = (ns: number[]): Either<Error, number> => {
//   const total = ns.length;
//   if(total === 0) {
//     return E.left(new Error('Empty input'))
//   }
//   const sum = ns.reduce((a,b) => a+b, 0)
//   return E.right(sum/total);
// }
//
// const check4NaN = (n: number): Either<Error, number> => {
//   if(isNaN(n)) {
//     return E.left(new Error('Nubers only, MF'))
//   } else {
//     return E.right(n)
//   }
// }
//
// const inp = E.fromNullable(new Error('Argv[2] is missing'))(process.argv[2])

// const result = pipe(
//   inp,
//   E.chain(parseJson),
//   E.chain(avg),
//   E.chain(check4NaN),
// )
//
// pipe(
//   result,
//   E.fold(
//     (error) => console.error(error),
//     (avgNumber) => console.log(avgNumber)
//   )
// )
//
// const program = Do(E.either)
//   .bind('input', inp)
//   .bindL('pardedJson', ({input}) => parseJson(input))
//   .bindL('average', ({pardedJson}) => avg(pardedJson))
//   .bindL('check', ({average}) => check4NaN(average))
//   .return(({check}) => check)
//

// --- ### Functional optics:

// interface User {
//   name: string;
//   login: string;
//   posts: Post[];
//   some?: string;
// }
//
// interface Post {
//   title: string;
//   tags: string[];
//   comments?: PostComment[];
//   attachment?: Blob;
// }
//
// interface PostComment {
//   date: Date;
//   text: string;
//   authorName: string;
//   attachment?: Blob;
// }
//
// const exampleData: User[] = [
//   {
//     name: 'Vasya',
//     login: 'vasya',
//     posts: [
//       {
//         title: 'first post',
//         tags: ['first', 'post'],
//         comments: [
//           {
//             date: new Date(2019, 0, 1, 0,0,0 ),
//             text: 'cool post',
//             authorName: 'vasiliy'
//           }
//         ]
//       }
//     ]
//   }
// ]
//
// interface UserWithTree {
//   name: string;
//   login: string;
//   posts: PostWithTreeComment[];
//   some?: string;
// }
//
//
// interface PostWithTreeComment {
//   title: string;
//   tags: string[];
//   comments: Option<Tree<PostComment>>;
//   attachment?: Blob;
// }
//
// const exampleTreeData: UserWithTree[] = [
//   {
//     name: 'Vasya',
//     login: 'vasya',
//     posts: [
//       {
//         title: 'first post',
//         tags: ['first', 'post'],
//         comments: some(make(
//           {
//             date: new Date(2019, 0, 1, 0,0,0 ),
//             text: 'cool post',
//             authorName: 'vasiliy'
//           },
//           [
//             tree.of({
//               date: new Date(2019, 0, 2, 0,0,0 ),
//               text: 'Egor nice comment',
//               authorName: 'Egor'
//             })
//           ]
//         ))
//       }
//     ]
//   }
// ]
//
//
// const capitalizeWord = (word: string) => word[0].toLocaleUpperCase() + word.substring(1).toLocaleLowerCase()
//
// const capitalizeTitle = (title: string) => title.split(' ').map(capitalizeWord).join(' ')
//
//
// const capitalize = (s: string) => s.split(' ').map(capitalizeWord).join(' ')

// Non-optics example:

// const modifiedDataImperative = exampleData.map(
//   (user) => ({
//     ...user,
//     posts: user.posts.map(
//       (post) => ({
//         ...post,
//         ...(post.attachment ? {attachment: post.attachment} : {}),
//         comments: post.comments.map(
//           (comment) => ({
//             ...comment,
//             ...(comment.attachment ? {attachment: comment.attachment} : {}),
//             text: capitalize(comment.text)
//           })
//         )
//       })
//     )
//   })
// )

// console.log('%o', modifiedData);


// optics example 1

// const postLens = Lens.fromProp<UserWithTree>()('posts')

// const res = postLens.set(exampleData[0].posts)({some: "banana", login: 'Grisha', name: 'Grigoriy', posts: []})
// console.log('1 %o', exampleData[0]);
// console.log('2 %o', res);


// optics example 2/3

// const usersTraversal = fromTraversable(array)<UserWithTree>();
// const postTraversal = fromTraversable(array)<PostWithTreeComment>();
// const commentsOptional = Optional.fromOptionProp<PostWithTreeComment>()('comments')
// const commentTraversal = fromTraversable(tree)<PostComment>();
// const textLens = Lens.fromProp<PostComment>()('text');
//
// const usersTextTraversal = usersTraversal
//   .composeLens(postLens)
//   .composeTraversal(postTraversal)
//   .composeOptional(commentsOptional)
//   .composeTraversal(commentTraversal)
//   .composeLens(textLens)
//
// const modifiedDataOptics = usersTextTraversal.modify(capitalize)(exampleTreeData)
//
// console.dir(modifiedDataImperative, {depth: null})
//
// console.dir(modifiedDataOptics, {depth: null})
//


// --- arrays, zip,  monoids

// const foo = [1,2,3]
// pipe(
//   A.array.map(foo, (x: number) => x),
//   A.filter((a) => a != 2),
//   A.reduce(0, (prev: number, next:number) => prev + next),
//   console.log
// )
//
//
// const bar = ['a', 'b', 'c', 'd', 'd']
// pipe(foo, A.zip(bar), console.log)

// const add1 = (x) => x + 1;
// const push1 = (x) => x.push(1);

// // no error
// const x: number = foo[4]
//
// // no runtime error
// foo[5] = 7
// console.log(foo)
// searching for value and return if found
// pipe(foo, A.lookup(5), console.log)


// pipe(foo, A.lookup(5), )

// - semigroups

// const onlyOne: Semigroup<number> = {
//   concat: (x, y) => 1
// }

// const semigroupMax: Semigroup<number> = {
//   concat: (x, y) => Math.max(x, y)
// }
//
// const monoidMax: Monoid<number> = {
//   concat: semigroupMax.concat,
//   empty: Number.NEGATIVE_INFINITY
// }



// --- either

const minLength = (s: string): Either<string, string> =>
  s.length >= 6 ? right(s) : left("< 6")

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left(" not capital ")


const validatePassword = (s: string): Either<string, string> =>
  pipe(
    minLength(s),
    chain(oneCapital),
  )

const res2 = pipe(
    validatePassword("a123456"),
    E.getOrElse((e) => e)
)

console.log(res2);
//
// function lift<E, A>(check: (a: A) => Either<E, A>): (a: A) => Either<NonEmptyArray<E>, A> {
//   return a => pipe(
//     check(a),
//     mapLeft(a => [a])
//   )
// }
//
// const minLengthV = lift(minLength)
// const oneCapitalV = lift(oneCapital)
//
// console.log(minLengthV("A23456"))

// --- task

// async function someTask(id: string) {
//   if(id.length > 36) {
//     throw new Error('id too much')
//   }
//   console.log('all fine')
// }
//
// const id = 'abc';
// const task: Task<void> = () => someTask(id)

// console.log(task());

// --
//
// const asyncFunction = () => new Promise((res, rej) => {
//   setTimeout(() => {
//     res(2000)
//   }, 2000)
// })
//
// const boolTask: Task<boolean> = async() => {
//   try {
//     await asyncFunction()
//     return true
//   } catch (err) {
//     return false
//   }
// }


// --
//
// const foo = 'asdf'
// const bar = T.of(foo)

// --


// ----------- option, map, flatten, chain


// interface Foo {
//   bar: string
// }

// interface Fizz {
//   buzz: string
// }
//
//
// interface Foo {
//   bar?: Fizz
// }
//
//
// const foo = {bar: {buzz: 'whatsapp'}} as Foo | undefined
//
// const fooFunc = ({bar}:Foo) => bar

// pipe(foo, fooFunc, console.log)
// pipe(undefined, fooFunc, console.log)

// pipe(undefined, O.fromNullable, O.map(fooFunc), console.log)
// pipe(undefined, O.fromNullable, O.map(fooFunc), console.log)


// pipe(
//   foo,
//   O.fromNullable,
//   O.map(({bar}: Foo) =>
//     pipe(
//       bar,
//       O.fromNullable,
//       O.map(({buzz} : Fizz) => buzz)
//     )
//   ),
//   O.flatten,
//   console.log
// )
//
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


/// ---------- PIPE & FLOW
// function add1(num: number): number {
//   return num + 1
// }
//
// function multiply2(num: number):number {
//   return num * 2
// }
//
// function toString(num: number): string {
//   return `"${num}"`
// }
//
// const callable = flow(add1, multiply2)
//
//
// const result = pipe(3, add1, callable);
//
//
// console.log(result);
