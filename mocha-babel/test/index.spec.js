import {expect} from "chai"
import sayHello from "../src/index"
import { Banana } from 'Bip/bip.js';

describe("index test", () => {
    describe("sayHello function", () => {
        it("should say Hello guys!", () => {
            console.log(Banana)
            const str = sayHello();
            expect(str).to.equal("Hello guys!")
        })
    })
})
