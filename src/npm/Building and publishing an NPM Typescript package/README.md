# [Building and publishing an NPM Typescript package.](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c)

## Basic Setup

```shell
# check version of node & npm
node -v
npm -v

# Create your package folder 
mkdir my-awesome-greeter && cd my-awesome-greeter

```

You need a remote git repository for your package so it can be downloaded. Once you have done it you can use the
following lines to initialize your local repository and set your remote origin.

```shell
git init
echo "# My Awesome Greeter" >> README.md
git add . && git commit -m "Initial commit"

# Replace <Git Repository Url> with the URL to your remote repository.
git remote add origin <Git Repository Url>
git push -u origin master

# Add .gitignore
cat << EOF > .gitignore
node_modules
/lib
EOF

# Init your Package
npm init -y

# Add Typescript as a DevDependency
npm install --save-dev typescript

```

To compile Typescript we also need a tsconfig.json file

```json lines
{
  "compilerOptions": {
    "baseUrl": "./",
    /* Specify the base directory to resolve non-relative module names. */
    "target": "es5",
    "module": "commonjs",
    /* proper imports/exports, for node preferable to use commonjs */
    "declaration": true,
    /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    "outDir": "./lib",
    /* Specify an output folder for all emitted files. */
    "allowJs": true,
    /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    "strict": true
    /* Enable all strict type-checking options. */,
    "esModuleInterop": true,
    /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true,
    /* Ensure that casing is correct in imports. */
    "noImplicitAny": true,
    /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    "skipLibCheck": true
    /* Skip type checking all .d.ts files. */
  },
  "include": [
    "src/**/*.ts"
  ],
  /* including only ts files in src folder */
  "exclude": [
    "node_modules",
    "lib"
  ]
  /* exclude generated and resource files*/
}
```

### Add some code

```ts
// src/index.ts
export const Greeter = (name: string) => `Hello ${name}`; 
```

### Formatting and Linting

```shell
# tslint-config-prettier is a preset we need since it prevents conflicts between tslint and prettiers formatting rules.
npm install --save-dev prettier tslint tslint-config-prettier

# Add tslint.json
cat << EOF > tslint.json
{
  "defaultSeverity": "error",
  "extends": ["tslint:recommended", "tslint-config-prettier"],
  "jsRules": {},
  "rules": {
    "curly": [false, "ignore-same-line"],
    "semicolon": [true, "always", "ignore-bound-class-methods"],
    "trailing-comma": [true, {
      "singleline": "never",
      "multiline": {
        "objects": "always",
        "arrays": "always",
        "functions": "never",
        "typeLiterals": "ignore"
      }
    }]
  },
  "rulesDirectory": []
}
EOF

# And a .prettierrc
cat << EOF > .prettierrc
{
  "printWidth": 120,
  "trailingComma": "all",
  "singleQuote": true
}
EOF
```

Add the lint- and format scripts to package.json

```package.json
"format": "prettier --write \"src/**/*.ts\" \"src/**/*.js\"",
"lint": "tslint -p tsconfig.json"
```

#### Don’t include more than you need in your package!

In our .gitignore file, we added /lib since we don’t want the build-files in our git repository. The opposite goes for a
published package. We don’t want the source code, only the build-files!

Whitelist the files /folders you want to publish. This can be done by adding the files property in package.json:

```package.json
"files": ["lib"]
```

Create .npmignore file [read more](https://stackoverflow.com/questions/24942161/does-npm-ignore-files-listed-in-gitignore)
In your .gitignore file, add the file/dir you wish to exclude **/build for example and in your .npmignore file
> make sure you specify the same file/dir but with the ! prefix so for the build example you would include !/build
```.gitignore
lib/
```

```.npmignore
!lib/
```

>>> FINALLY all above npmignore/gitignore not working -> just remove all needed files from .gitignore 

### Setup Testing with Jest

```shell
npm install --save-dev jest ts-jest @types/jest

cat << EOF > jestconfig.json
{
  "transform": {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}
EOF

# Remove the old test script in package.json and change it to:
# "test": "jest --config jestconfig.json",

```

### Write a basic test

In the src folder, add a new folder called __tests__ and inside, add a new file with a name you like, but it has to end
with test.ts, for example Greeter.test.ts

```shell
cat << EOF > __tests__/Greeter.test.ts
import { Greeter } from '../index';
test('My Greeter', () => {
  expect(Greeter('Carl')).toBe('Hello Carl');
});
EOF

# Now run
npm test
```

### Use the magic scripts in NPM

prepare, prepublishOnly, preversion, version and postversion

- **prepare** will run both BEFORE the package is packed and published, and on local npm install. Perfect for running
  building the code.
- **prepublishOnly** will run BEFORE prepare and ONLY on npm publish.
- **preversion** will run before bumping a new package version.
- **version** will run after a new version has been bumped. If your package has a git repository, like in our case, a
  commit and a new version-tag will be made every time you bump a new version. This command will run BEFORE the commit
  is made. One idea is to run the formatter here and so no ugly code will pass into the new version.
- **postversion** will run after the commit has been made. A perfect place for pushing the commit as well as the tag.

This is how scripts section in package.json now looks like:
```json lines
{
  //...
  "scripts": {
    "prepare": "npm run build",
    "prepublishOnly": "npm test && npm run lint",
    "preversion": "npm run lint",
    "version": "npm run format && git add -A src",
    "postversion": "git push && git push --tags",
    "lint": "./node_modules/tslint/bin/tslint --fix -c tslint.json src/**/*.ts",
    // specify node_modules for runner to always use local and not global pakage
    "format": "./node_modules/.bin/prettier --write \"src/**/*.ts\"",
    "build": "./node_modules/typescript/bin/tsc",
    "test": "./node_modules/.bin/jest --config jestconfig.json"
  },
  //...
}
```

Here is the example of full configuration in the package.json

```json lines
{
  "author": "erik7z_digis",
  "bugs": {
    "url": "https://bitbucket.org/erik7z_digis/glb-logger/issues"
  },
  "dependencies": {
  },
  "description": "Logger library for GemlightBox projects",
  "devDependencies": {
    "@types/jest": "^29.0.3",
    "jest": "^29.0.3",
    "prettier": "^2.7.1",
    "ts-jest": "^29.0.1",
    "tslint": "^6.1.3",
    "tslint-config-prettier": "^1.18.0",
    "typescript": "^4.8.3"
  },
  "engines": {
    "node": ">=18.4.0",
    "npm": ">=8.12.1"
  },
  "engineStrict": true,
  "files": [
    "lib/**/*"
  ],
  "homepage": "https://bitbucket.org/erik7z_digis/glb-logger#readme",
  "keywords": [
    "gemlightbox",
    "logger",
    "tracer"
  ],
  "license": "ISC",
  "main": "lib/index.js",
  "name": "@gemlightbox/logger",
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@bitbucket.org/erik7z_digis/glb-logger.git"
  },
  "scripts": {
    "build": "./node_modules/typescript/bin/tsc",
    "format": "./node_modules/.bin/prettier --write \"src/**/*.ts\"",
    "lint": "./node_modules/tslint/bin/tslint --fix -c tslint.json src/**/*.ts",
    "prepare": "npm run build",
    "prepublishOnly": "npm test && npm run lint && npm run format",
    "test": "./node_modules/.bin/jest --config jestconfig.json"
  },
  "types": "lib/index.d.ts",
  "version": "1.2.7"
}
```


## Publish your package to NPM!
In order to publish your package, you need to create an NPM account.
If you don’t have an account you can do so at https://www.npmjs.com/signup
or run the command: `npm adduser`

If you already have an account, run `npm login` to login to your NPM account.
Alternatively you can use special auth token which will be automatically used during npm operations.
```shell
export NPM_TOKEN='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'
```

# Important notes:
- specify and restrict node version in package.json
```json lines
{
  //...
  "engines": {
    "node": ">=18.4.0",
    "npm": ">=8.12.1"
  },
  "engineStrict": true,
  //...
}
```

- specify engine-strict in npmrc and add authtoken (can be used in automated workflows - pipelines etc.)
```.npmrc
engine-strict=true  
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```


Alright! Now run `npm publish`

As you can see the package will first be built by the prepare script, then test and lint will run by the prepublishOnly script before the package is published.

## View your package
Now browse your package on npmjs. 
The URL is https://npmjs.com/package/<your-package-name> in my case it is
https://npmjs.com/package/my-awesome-greeter

