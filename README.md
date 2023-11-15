<p align="center">
  <a href="https://mechanic.design/">
    <img alt="Mechanic Logo" src="https://raw.githubusercontent.com/designsystemsinternational/mechanic/main/doc/logo.gif" width="600"
    >
  </a>
</p>
<p align="center">Built with ❤️ by <br/><a href="https://designsystems.international/">
  <img width="150" alt="logo" src="https://raw.githubusercontent.com/designsystemsinternational/mechanic/main/doc/dsi_logo.png">
</a></p><br/><br/>



[![npm version](https://img.shields.io/npm/v/@mechanic-design/core.svg?style=for-the-badge&color=201ed2&labelColor=ed4600)](https://www.npmjs.com/package/@mechanic-design/core) [![Documentation](https://img.shields.io/badge/docs-v2.0.0.beta.9-red.svg?style=for-the-badge&color=201ed2&labelColor=ed4600)](https://mechanic.design/) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-red.svg?style=for-the-badge&color=201ed2&labelColor=ed4600)](https://github.com/designsystemsinternational/mechanic/pulls)

[Mechanic](https://mechanic.design/) is a powerful design toolchain that helps forward-looking organizations move away from a manual design workflow by automating their design operations. 

**CURRENT STATUS**: `v1.2.0` is out now! Try it and tell us what you think! `v2.0.0-beta.9` is also out and we're testing it! Feel free to test it out too!



## Get Started

To start using right away and create a new Mechanic project, run the following:

```
npm init mechanic@latest
```

This will build a new base Mechanic project, with one **design function**! Follow the CLI instructions to customize, install and start running.

<p align="center">
  <img alt="Mechanic App Screenshot" src="https://raw.githubusercontent.com/designsystemsinternational/mechanic/master/doc/screenshot.png" width="600">
</p>

## Documentation

Check out [v1.2.0 documentation](https://mechanic.design/docs/v1.2.0).

## Monorepo Content

The repo is managed via [lerna](https://github.com/lerna/lerna).

| Repository                                                 | Description                                                                                                                                                                                                                        |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [create-mechanic](packages/create-mechanic)                | Mechanic project skeleton creator.                                                                                                                                                                                                 |
| [@mechanic-design/cli](packages/cli)                       | Command-line tool to generate new Mechanic projects, design functions and build app.                                                                                                                                               |
| [@mechanic-design/core](packages/core)                     | Core Mechanic functionalities. Used by Mechanic's design tools and defines `Mechanic` class to be extended as **Engines**.                                                                                                         |
| [@mechanic-design/ui-components](packages/ui-components)   | React component library intended to be used as inputs for design function inputs.                                                                                                                                                  |
| [@mechanic-design/engine-canvas](packages/engine-canvas)   | Engine function that extends base `Mechanic` class, intended to render static assets or animations built using the [HTML Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).                                 |
| [@mechanic-design/engine-p5](packages/engine-p5)           | Engine function that extends base `Mechanic` class, intended to render static assets or animations built using [p5.js](https://p5js.org/).                                                                                         |
| [@mechanic-design/engine-react](packages/engine-react)     | Engine function that extends base `Mechanic` class, intended to render static assets or animations built using [React](https://reactjs.org/) components that renders [SVG](https://developer.mozilla.org/en-US/docs/Glossary/SVG). |
| [@mechanic-design/engine-svg](packages/engine-svg)         | Engine function that extends base `Mechanic` class, indended to render static assets or animations built using through [SVG](https://developer.mozilla.org/en-US/docs/Glossary/SVG) strings.                                       |
| [@mechanic-design/utils](packages/utils)                   | General purpose CLI definitions to be used by other Mechanic packages.                                                                                                                                                             |
| [@mechanic-design/dsi-logo-maker](packages/dsi-logo-maker) | A design tool project made with Mechanic to build assets and animations that follows [DSI's identity logo](https://designsystems.international/).                                                                                  |

## Development

To get started, clone this repo.

Then run, `npm run bootstrap`. This will symlink all the dependencies together and run `npm i` inside each package. Running `npm i` inside a package folder will not work.

That should be enough to test certain individual package functionality, but to test mechanic projects with local package versions, we use [`yalc`](https://github.com/wclr/yalc).

`npm link` falls short to reproduce package dependencies resolution as projects would by installing from the npm registry. `yalc` can locally publish packages as it would to the npm registry, to then use in local projects.

To do this, first install `yalc` globally.
To publish all packages in the repo, run `npm run publish:local`. To publish an individual package, run `yalc push` from its directory or `yalc push ./packages/[package]`. Run any of these commands when you wish to update the published content.

Then in the project to test the package(s), before installing dependencies run `yalc add [package]` for all packages you wish to test. Then install normally with `npm i`.

For any other needs, check [`yalc`'s documentation](https://github.com/wclr/yalc).

## Publish

Run `npm run publish`
