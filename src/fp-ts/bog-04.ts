import { Lazy } from 'fp-ts/lib/function'
import {Either} from 'fp-ts/lib/Either'
import {promises as fs } from 'fs'
import {ReaderTaskEither} from "fp-ts/lib/ReaderTaskEither";
import {TaskEither, tryCatch} from "fp-ts/lib/TaskEither";
import {Config} from './types'


// const readConfig: ReaderTaskEither<void, Error, Config> = () => tryCatch(
//     () => fs.readFile('./config/common.json', {encoding: 'utf8'})
//         .then((configStr: string) => JSON.parse(configStr));
// )

// type Task <A> = () => Lazy<Promise<A>>;
// type TaskEither<E, A> = Lazy<Promise<Either<E,A>>>
// type Reader<R, A> = (r: R) => A;

// async function main(config: any) {
//     console.dir(config, {depth: null})
// }
//
// main({}).catch((err) => {
//     console.error(err.stack || err.message || err);
//     process.exit(1);
// })
//
//
