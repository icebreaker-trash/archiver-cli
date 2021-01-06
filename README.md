# simple-archiver-cli

very easy to use

## Installation

```sh
# global cli
npm i -g simple-archiver-cli
yarn global add simple-archiver-cli

//or

npm i -D simple-archiver-cli
yarn add -D simple-archiver-cli
```

## How to use

if you install globally
you could run

```sh
# get zip
node-zip <path> <dest>
# get tar.gz
node-tar <path> <dest>
# for example 
node-tar node_modules

node-zip node_modules .serverless/layer/node_modules.zip

```

or

```js
const {
  zip,
  tar,
  util,
  factory,
  cli
} = require('simple-archiver-cli')

//write code below
...

```

## Why i write this package?

Because i am too poor to buy me a `Macbook Pro`

So i use this package in my Windows PC

like `node-tar` instead of `tar`

`node-zip` instead of `zlib`

......

None
