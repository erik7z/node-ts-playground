# Publishing to private npm repository, in CI/CD


### Access tokens
An access token is an alternative to using your username and password for authenticating to npm when using the API or the npm command-line interface (CLI). 
An access token is a hexadecimal string that you can use to authenticate, and which gives you the right to install and/or publish your modules.


You can work with tokens from the web or the CLI, whichever is easiest. 
What you do in each environment will be reflected in the other environment.

Type of tokens:
- Read-only Token: Tokens that allow installation and distribution only, but no publishing or other rights associated with your account.

- Publish Token: The default setting for new tokens, and most permissive token type. 
  Publish tokens allow installation, distribution, modification, publishing, and all rights that you have on your account.

- Automation Token: an automation token can download packages and publish new ones, but if you have two-factor authentication (2FA) configured on your account, 
it will not be enforced. You can use an automation token in continuous integration workflows and other automation systems to 
publish a package even when you cannot enter a one-time passcode. 
This is recommended for automation workflows where you are publishing new packages.
  *You cannot create **automation** tokens from cli, only from web*


```shell
# To create a new token, on the command line, run
npm token create # for a read and publish token
npm token create --read-only # for a read-only token
npm token create --cidr=[list] # for a CIDR-restricted read and publish token.

# Viewing tokens on the CLI
npm token list
```


# [Using private packages in a CI/CD workflow](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow)

- run following command to use token in pipeline for scoper repos:
```shell
npm config set @gemlightbox:registry https://registry.npmjs.com
npm config set //registry.npmjs.com/:_authToken=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
```

npm config set //registry.npmjs.com/:_authToken=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


- or set above in .npmrc file for repo
```.npmrc
//registry.npmjs.com/:_authToken=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
@gemlightbox:registry=https://registry.npmjs.com
registry=https://registry.npmjs.com
```
