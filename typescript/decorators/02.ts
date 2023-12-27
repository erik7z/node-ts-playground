// class Greeter {
//   greeting: string;
//   constructor(message: string) {
//     this.greeting = message;
//   }
//
//   @enumerable(false)
//   greet() {
//     return "Hello, " + this.greeting;
//   }
// }
// function enumerable(value: boolean) {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     descriptor.enumerable = value;
//   };
// }
//
// const g = new Greeter('gosha')
//
// console.log(g.greet())



// #####

// const printMemberName = (target: any, memberName: string) => {
//   console.log(memberName);
// };
//
// class Person {
//   @printMemberName
//   name = "Jon";
// }
//
// const p = new Person()



// ###

// const deprecated = (deprecationReason: string) => {
//   return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
//     return {
//       get() {
//         const wrapperFn = (...args: any[]) => {
//           console.warn(`Method ${memberName} is deprecated with reason: ${deprecationReason}`);
//           propertyDescriptor.value.apply(this, args)
//         }
//
//         Object.defineProperty(this, memberName, {
//           value: wrapperFn,
//           configurable: true,
//           writable: true
//         });
//         return wrapperFn;
//       }
//     }
//   }
// }
//
// class TestClass {
//   static staticMember = true;
//
//   instanceMember = "hello"
//
//   @deprecated("Use another static method")
//   static deprecatedMethodStatic() {
//     console.log('inside deprecated static method - staticMember =', this.staticMember);
//   }
//
//   @deprecated("Use another instance method")
//   deprecatedMethod () {
//     console.log('inside deprecated instance method - instanceMember =', this.instanceMember);
//   }
// }
//
// TestClass.deprecatedMethodStatic();
//
// const instance = new TestClass();
// instance.deprecatedMethod();


// ##########


//
// const TryCatchWrapper = (target: any, key: string, descriptor: PropertyDescriptor) => {
//   const fn = descriptor.value;
//   descriptor.value = async (...args: any[]) => {
//     try {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       await fn.apply(this, args);
//     } catch (error) {
//       console.log('Entered Catch----->');
//       throw (error)
//       // const [,, next] = args;
//       // next(error);
//     }
//   };
// };
//
// class TestClass {
//
//   @TryCatchWrapper
//   async somfunc() {
//     throw new Error("wrong!")
//   }
// }
//
// const c = new TestClass()
//
// c.somfunc()
//
// console.log('all ok')


// ######


type HandlerFunction = (error: Error, ctx: any) => void;

export const Catch = (errorType: any, handler: HandlerFunction): any => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Save a reference to the original method
    const originalMethod = descriptor.value;

    // Rewrite original method with try/catch wrapper
    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);

        // Check if method is asynchronous
        if (result && result instanceof Promise) {
          // Return promise
          return result.catch((error: any) => {
            _handleError(this, errorType, handler, error);
          });
        }

        // Return actual result
        return result;
      } catch (error: any) {
        _handleError(this, errorType, handler, error);
      }
    };

    return descriptor;
  };
};

export const CatchAll = (handler: HandlerFunction): any => Catch(Error, handler);

function _handleError(ctx: any, errorType: any, handler: HandlerFunction, error: Error) {
  // Check if error is instance of given error type
  if (typeof handler === 'function' && error instanceof errorType) {
    // Run handler with error object and class context
    handler.call(null, error, ctx);
  } else {
    // Throw error further
    // Next decorator in chain can catch it
    throw error;
  }
}


class Messenger {
  @CatchAll((err, ctx) => {
    // console.log(ctx, err)
  })
  getMessages() {
    throw new Error("bad")
  }
  // all the other functions
}

const m = new Messenger()

m.getMessages()
