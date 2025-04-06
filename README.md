# Extractorpack - Imagine an Organized Workspace

A power extractor management CLI tool for [discord-player](https://github.com/Androz2091/discord-player)

## The Fundemental Problem ...

Let's be real. No one likes managing extractors for discord-player. There are a lot of imports and a lot of calls to `player.extractor.register`. This begins to make your code cluttered a bit like the following.

```ts
import ... from "ext1"
import ... from "ext2"
import ... from "ext3"
import ... from "ext4"
import ... from "ext5"

player.extractor.register(..., {})
player.extractor.register(..., {})
player.extractor.register(..., {})
player.extractor.register(..., {})
player.extractor.register(..., {})
```

Extractorpack seek to fix this via its CLI tool by installing and writing code at the same time. This is all hidden from the end user so that they can have a seemless experience. With extractorpack, you just need 2 files ...

```ts
// main loader file
import { load } from "extractorpack"

load(player)
```

```ts
// extractorpack.config.mjs
import { defineConfig } from "extractorpack"

export default defineConfig({})
```

## Installation

> [!WARNING]
> As extractorpack manages local extractors, though it is a commandline tool, it will not work if you globally install it.

### npm
```bash
$ npm install --save-dev extractorpack
```
### yarn
```bash
$ yarn add -D extractorpack
```

## Using extractorpack

Before using extractorpack, please make sure to remove any `player.extractors.register` in your codebase.

### Getting started

(WIP)
Before using extractorpack, let us make build a structure for it.

```bash
$ npx --no extractorpack init
```

This will create a file named `extractorpack.config.mjs` and fill it with content similar to below.

```js
import { defineConfig } from "extractorpack"

export default defineConfig({})
```

Furthermore, extractorpack will also scan node_modules for any compatible extractors that you have previously installed.

If you want to use an existing project with alreaddy made `extractorpack.config.mjs`, you can use
```bash
$ npx --no extractorpack scan
```
to just use the scanning functionality. This is helpful for already made projects that you are deploying to the cloud. Ensure that this command is ran before building TypeScript to avoid type errors

### Installing an extractor

To install an extractor, you can use extractorpack as a package manager on compatible extractors.

```bash
$ npx --no extractorpack add discord-player-youtubei
```

This will automatically add the install the extractor using the package manager your project is configured to use and register it. You can then modify the options for this extractor inside your `extractorpack.config.mjs`

```js
import { defineConfig } from "extractorpack"

export default defineConfig({
    "discord-player-youtubei": {
        // HORRAY! Typesafety made possible by extractorpack dynamic code writer
        cookie: ""
    }
})
```

### Removing an extractor

```bash
$ npx --no extractorpack remove discord-player-youtubei
```