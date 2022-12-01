const newFirst = () => {
  return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
    return {
      get() {
        const wrapperFn = async (value: number) => {
          value++
          if (propertyDescriptor.get) {
            console.log('newFirst propertyDescriptor.get ' + value)
            return await propertyDescriptor.get.apply(this)(value);
          }
          console.log('newFirst propertyDescriptor.value ' + value)

          await propertyDescriptor.value.apply(this, [value]);
        }

        Object.defineProperty(this, memberName, {
          value: wrapperFn,
          configurable: true,
          writable: true
        });
        return wrapperFn;
      }
    }
  };
}

const newSecond = () => {
  return (target: any, memberName: string, propertyDescriptor: PropertyDescriptor) => {
    return {
      get() {
        const wrapperFn = async (value: number) => {
          value++
          if (propertyDescriptor.get) {
            console.log('newSecond propertyDescriptor.get ' + value)
            return await propertyDescriptor.get.apply(this)(value);
          }
          console.log('newSecond propertyDescriptor.value ' + value)

          await propertyDescriptor.value.apply(this, [value]);
        }

        Object.defineProperty(this, memberName, {
          value: wrapperFn,
          configurable: true,
          writable: true
        });
        return wrapperFn;
      }
    }
  };
}


export const ClassDec = (): any => {
  return (target: any, actionName: string, descriptor: PropertyDescriptor): void => {
    if (descriptor) {
      return decorateControllerAction(descriptor, actionName) as any as void
    } else {
      for (const propertyName of Reflect.ownKeys(target.prototype).filter(prop => prop !== 'constructor')) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName)!;


        const isMethod = descriptor.value instanceof Function;

        console.log(isMethod)
        // if (!isMethod) continue;

        Object.defineProperty(target.prototype, propertyName, decorateControllerAction(descriptor, propertyName));
      }
    }
  }
};

function decorateControllerAction(descriptor: PropertyDescriptor, actionName: string | symbol): PropertyDescriptor {
  return {
    get() {
      const wrapperFn = async (value: string) => {
        if (descriptor.get) {
          console.log('class descriptor.get');
          return await descriptor.get.apply(this)(value);
        }
        console.log('class descriptor.value.apply');
        await descriptor.value.apply(this, [value]);
      }

      Object.defineProperty(this, actionName, {
        value: wrapperFn,
        configurable: true,
        writable: true
      });
      return wrapperFn;
    }
  }
}


@ClassDec()
class NewExampleClass {
  public banana = 'banana 123'

  @newFirst()
  @newSecond()
  method(value: number) {
    console.log(`value: ${value}`)
    console.log(this.banana)
  }
}

const ab = new NewExampleClass()

ab.method(1);
