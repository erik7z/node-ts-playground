import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'

import { flow, identity, pipe } from 'fp-ts/lib/function'
import { absurd, constVoid, unsafeCoerce } from 'fp-ts/lib/function'

import axios from 'axios'
import crypto from 'crypto'


//### url https://rlee.dev/practical-guide-to-fp-ts-part-3

//### TASK

// const foo = 'asdf' // string
// const bar = T.of(foo) // T.Task<string>

// console.log(bar);

// ### EITHER
//
// export class MinLengthValidationError extends Error {
//     public _tag: 'PasswordMinLengthValidationError'
//
//     public minLength: number
//
//     private constructor(minLength: number) {
//         super('password fails to meet min length requirement: ${minLength}')
//         this._tag = 'PasswordMinLengthValidationError'
//         this.minLength = minLength
//     }
//
//     public static of(minLength: number): MinLengthValidationError {
//         return new MinLengthValidationError(minLength)
//     }
// }
//
// export class CapitalLetterMissingValidationError extends Error {
//     public _tag: 'PasswordCapitalLetterMissingValidationError'
//
//     private constructor() {
//         super(`password is missing a capital letter`)
//         this._tag = 'PasswordCapitalLetterMissingValidationError'
//     }
//
//     public static of(): CapitalLetterMissingValidationError {
//         return new CapitalLetterMissingValidationError()
//     }
// }
//
// export type PasswordValidationError =
//     | MinLengthValidationError
//     | CapitalLetterMissingValidationError
//
// export interface Password {
//     _tag: 'Password'
//     value: string
//     isHashed: boolean
// }
//
// export function of(value: string): Password {
//     return {_tag: 'Password', value, isHashed: false}
// }
//
// export function fromHashed(value: string): Password {
//     return {_tag: 'Password', value, isHashed: true}
// }
//
// export type PasswordSpecification = {
//     minLength?: number
//     capitalLetterRequired?: boolean
// }
//
// export function validate({
//                              minLength = 0,
//                              capitalLetterRequired = false,
//                          }: PasswordSpecification = {}) {
//     return (password: Password): E.Either<PasswordValidationError, Password> => {
//         if (password.value.length < minLength) {
//             return E.left(MinLengthValidationError.of(minLength))
//         }
//
//         if (capitalLetterRequired && !/[A-Z]/.test(password.value)) {
//             return E.left(CapitalLetterMissingValidationError.of())
//         }
//
//         return E.right({...password, isValidated: true})
//     }
// }
//
// export type HashFn = (value: string) => E.Either<Error, string>
//
// export function hash(hashFn: HashFn) {
//     return (password: Password): E.Either<Error, Password> =>
//         pipe(
//             hashFn(password.value),
//             E.map((value) => ({
//                 ...password,
//                 value,
//                 isHashed: true,
//             })),
//         )
// }
//
// const result = pipe(
//     'Password',
//     flow(
//         of,
//         validate({ minLength: 8, capitalLetterRequired: true }),
//         E.chainW( // Less strict variant of chain
//             hash((value) =>
//                 E.right(crypto.createHash('md5').update(value).digest('hex')),
//             ),
//         ),
//     )
// )
//
// console.log(result)

//// just play
// const result = pipe(
//     'Password123',
//     of,
//     validate({ minLength: 8, capitalLetterRequired: true }),
//     E.map(
//         (validationResult) => ({
//             ...validationResult,
//             _tag: 'Password',
//             value: 'hashedvalue',
//             isHashed: true,
//         })
//         // hash((value) =>
//         //     crypto.createHash('md5').update(value).digest('hex'),
//         // ),
//     ),
// )


// #### TaksEither - is an asynchronous operation that can fail.
//// handling success
    // ;(async () => {
    //     const ok = await pipe(
    //         TE.tryCatch(
    //             () => axios.get('https://httpstat.us/200'),
    //             (reason) => new Error(`${reason}`),
    //         ),
    //         TE.map(({data}) => data),
    //     )()
    //
    //     console.log(ok)
    //     // { _tag: 'Right', right: { code: 200, description: 'OK' } }
    // })()

//// handling fail

//     ;(async () => {
//         const result = await pipe(
//             TE.tryCatch(
//                 () => axios.get('https://httpstat.us/500'),
//                 (reason) => new Error(`${reason}`),
//             ),
//             TE.map((resp) => resp.data),
//         )()
//
//         console.log(result)
//     })()
type Resp = { code: number; description: string }

;(async () => {
    const result = await pipe(
        TE.tryCatch(
            () => axios.get('https://httpstat.us/200'),
            () => constVoid() as never,
        ),
        TE.map(({data}) => unsafeCoerce<unknown, Resp>(data.code)),
        TE.fold(absurd, T.of),
    )()

    console.log(result)
})();


