# Setting up bitbucket-pipeline lintering & versioning

## Create a bot user to update restricted branches
If your repository has restricted branches, you will need to create a bot user for ci operations:

- create a new [bitbucket user](https://id.atlassian.com/signup?application=bitbucket)
- set his name and username as ci_bot to clearly state his purpose in [settings](https://bitbucket.org/account/settings/)
- create app password, which will be used as a secret during ci operations  [app password](https://bitbucket.org/account/settings/app-passwords/)
- In your bitbucket-pipelines.yml file, configure git to use the app password by changing the remote URL to authenticate with your Bitbucket username and the app password.
  `git remote set-url origin https://<your username>:${APP_SECRET}@bitbucket.org/${BITBUCKET_REPO_OWNER}/${BITBUCKET_REPO_SLUG}`
> More options on ci_bot setup can be found here: [push-back-to-your-repository](https://support.atlassian.com/bitbucket-cloud/docs/push-back-to-your-repository/)

## install and setup linter (TODO: complete!!!)

- [Getting Started with ESLint](https://eslint.org/docs/latest/user-guide/getting-started)
- [Migrating from TSLint to ESLin](https://medium.com/@KevinBGreene/migrating-from-tslint-to-eslint-6382f8bd3b6)
- [tslint-to-eslint-config](https://github.com/typescript-eslint/tslint-to-eslint-config)
- [Eslint configuration for Node Project](https://dev.to/drsimplegraffiti/eslint-configuration-for-node-project-275l)
- [Activate and configure ESLint in WebStorm](https://www.jetbrains.com/help/webstorm/eslint.html#ws_js_eslint_activate)
- [Use ESLint plugin only for some files/directories](https://stackoverflow.com/questions/59900258/use-eslint-plugin-only-for-some-files-directories)
- [ESLint only target a specific directory (eslintrc, create-react-app)](https://stackoverflow.com/questions/48087277/eslint-only-target-a-specific-directory-eslintrc-create-react-app)
-  [Adding eslint for typescript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/)

### --

## [Pre-commits](https://www.npmjs.com/package/pre-commit)

- Add pre-commit hooks to run lint before commit: 
```sh
npm install pre-commit
```
By defaults pre-commit runs `npm test` script, to run other configurations set them in package.json under root "pre-commit" config:
- Example of pre-commit config
```json lines
{
  "name": "437464d0899504fb6b7b",
  "version": "0.0.0",
  "description": "ERROR: No README.md file found!",
  "main": "index.js",
  "scripts": {
    "lint": "./node_modules/.bin/eslint src/**/*.ts -c .eslintrc.json --ext .ts",
    "test": "echo \"Error: I SHOULD FAIL LOLOLOLOLOL \" && exit 1",
  },
  "pre-commit": [
    "lint",
    "test"
  ],
}
```

## Update bitbucket.pipelines.yml

Update bitbucket.pipelines.yml to apply above configurations
```yml
image: node:18.4.0
pipelines:
  branches:
    dev:
      - step:
          name: PrePublish
          runs-on:
            - 'self.hosted'
          script:
            - apt-get update && apt-get install -y unzip git
            - git remote set-url origin https://glb_ci_bot:${APP_SECRET}@bitbucket.org/picupmedia/api.git
            - npm ci
            - npm run lint
            - npm version patch -m "Upgrade to version %s [skip ci]"
            - git push && git push --tags
```






