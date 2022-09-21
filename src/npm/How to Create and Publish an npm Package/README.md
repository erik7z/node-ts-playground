# [How to Create and Publish an npm Package](https://medium.com/swlh/how-to-create-and-publish-an-npm-package-17b5e1744f26)

### Initial Setup


```shell
# Create a new folder with the name github-repos-search and initialize a package.json file
mkdir github-repos-search
cd github-repos-search
npm init -y

# Initialize the current project as a git repository
git init .

# Create a .gitignore file to exclude the node_modules folder
echo 'node_modules' > .gitignore

# add some code of your future npm package:
cat << EOF > index.js
const square = (num) => num * num;

module.exports = {
  square
}
EOF
```


### Testing the created npm package using require statement
- Before publishing it to the npm repository, you need to make sure it works when you use it using require or import statement.

```shell
# Execute the following command from the command line from inside the github-repos-search folder:
npm link

# Executing npm link command creates a symbolic link for your current package inside the global npm node_modules folder


cd ~/Desktop
mkdir test-repos-library-node
cd test-repos-library-node
npm init -y

# execute the following command from inside the test-repos-library-node folder to use the package you created:
npm link github-repos-search


# Create a new file with the name index.js and add the following code inside it:
cat << EOF > index.js
const { square } = require('github-repos-search');

console.log(square(4))
EOF

# run the file by executing it from the command line:
node index.js

```

### Testing the created npm package using the import statement
```shell
# change code of repo to comply with es modules standart:

# (github-repos-search)
cat << EOF > index.js
export const square = (num) => num * num;
EOF

# then use imports in 'test-repos-library-node' as follows:
cat << EOF > index.js
import { square } from 'github-repos-search'

console.log(square(4))
EOF
```


## Publish to the npm repository

Let’s add some metadata in the 'github-repos-search' package.json file to display some more information about the package.

```json
{
  "name": "github-repos-search",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "homepage": "https://github.com/myogeshchavan97/github-repos-search",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/myogeshchavan97/github-repos-search.git"
  },
  "dependencies": {
    "axios": "^0.20.0"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "github",
    "repos",
    "repositories",
    "sort",
    "stars"
  ],
  "author": "Yogesh Chavan <myogeshchavan97@gmail.com>",
  "license": "ISC"
}
```


Open the terminal and from inside the github-repos-search folder, execute the following commands:
```shell
npm login #  enter your npm credentials to log in.


# publish code to the npm repository
npm publish
```

Then navigate to the : [github-repos-search]( https://www.npmjs.com/package/github-repos-search)
and you'll find you freshly published package.


```shell
# add a readme.md file for displaying some information regarding the package.

cat << EOF > README.md
# My first npm package
EOF

# if you try to publish it again using the npm publish command, you will get an error.
# This is because you are publishing the module with the same version again.
# update version in package.json and try again
```

### Install package to your test repo
```shell
# remove reference to local node_modules
npm unlink github-repos-search

# install from npm
npm install github-repos-search
```


### Semantic versioning in npm

The version value is a combination of 3 digits separated by dot operator. 
Let’s say the version is a.b.c

1. First value (a in a.b.c) specifies the major version of the package — It means this version has Major code changes and it might contain breaking API changes.
2. Second value (b in a.b.c) specifies the minor version which contains minor changes but will not contain breaking API changes.
3. Third value (c in a.b.c) specifies the patch version which usually contains bug fixes.


