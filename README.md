<p align="center">
  <a href="https://mechanic.design/">
    <img alt="Mechanic Logo" src="https://raw.githubusercontent.com/designsystemsinternational/mechanic/master/doc/logo.png" width="600"
    >
  </a>
</p>

[Mechanic](https://mechanic.design/) is a powerful design toolchain that helps forward-looking organizations move away from a manual design workflow by automating their design operations. Built with love by your friends at [Design Systems International](https://designsystems.international/).

**CURRENT STATUS**: We are working towards a 1.0 release and aim to start inviting beta testers in Q3, 2021

## Get Started

To start using right away and create a new Mechanic project, run the following:

```
$ npm init @designsystemsinternational/mechanic@latest mechanic-project
```

This will build a new base Mechanic project, with one **design function**! Follow the CLI instructions to customize, install and start running.

<p align="center">
  <img alt="Mechanic App Screenshot" src="https://raw.githubusercontent.com/designsystemsinternational/mechanic/master/doc/screenshot.png" width="600">
</p>

## Documentation

Check the [docs](doc/doc.md).

## Monorepo Content

The repo is managed via [lerna](https://github.com/lerna/lerna).

| Repository                                                | Description                                                                                                                                                                                                                        |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [create-mechanic](packages/create-mechanic)               | Mechanic project skeleton creator.                                                                                                                                                                                                 |
| [mechanic-cli](packages/mechanic-cli)                     | Command-line tool to generate new Mechanic projects, design functions and build app.                                                                                                                                               |
| [mechanic](packages/mechanic)                             | Core Mechanic functionalities. Used by Mechanic's design tools and defines `Mechanic` class to be extended as **Engines**.                                                                                                         |
| [mechanic-ui-components](packages/mechanic-ui-components) | React component library intended to be used as inputs for design function parameters.                                                                                                                                              |
| [mechanic-engine-canvas](packages/mechanic-engine-canvas) | Engine function that extends base `Mechanic` class, intended to render static assets or animations built using the [HTML Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).                                 |
| [mechanic-engine-p5](packages/mechanic-engine-p5)         | Engine function that extends base `Mechanic` class, intended to render static assets or animations built using [p5.js](https://p5js.org/).                                                                                         |
| [mechanic-engine-react](packages/mechanic-engine-react)   | Engine function that extends base `Mechanic` class, intended to render static assets or animations built using [React](https://reactjs.org/) components that renders [SVG](https://developer.mozilla.org/en-US/docs/Glossary/SVG). |
| [mechanic-engine-svg](packages/mechanic-engine-svg)       | Engine function that extends base `Mechanic` class, indended to render static assets or animations built using through [SVG](https://developer.mozilla.org/en-US/docs/Glossary/SVG) strings.                                       |
| [mechanic-utils](packages/mechanic-utils)                 | General purpose CLI definitions to be used by other Mechanic packages.                                                                                                                                                             |
| [dsi-logo-maker](packages/dsi-logo-maker)                 | A design tool project made with Mechanic to build assets and animations that follows [DSI's identity logo](https://designsystems.international/).                                                                                  |

## Development

To get started, clone this repo.

Then run, `npm run bootstrap`. This will symlink all the dependencies together and run `npm i` inside each package. Running `npm i` inside a package folder will not work.

That should be enough to test certain individual package functionality, but to test mechanic projects with local package versions, we use [`yalc`](https://github.com/wclr/yalc).

`npm link` falls short to reproduce package dependencies resolution as projects would by installing from the npm registry. `yalc` can locally publish packages as it would to the npm registry, to then use in local projects.

To do this, fisrt install `yalc` globally.
To publish all packages in the repo, run `npm run publish:local`. To publish an individual package, run `yalc push` from its directory or `yalc push ./packages/[package]`. Run any of these commands when you wish to update the published content.

Then in the project to test the package(s), before installing dependencies run `yalc add [package]` for all packages you wish to test. Then install normally with `npm i`.

For any other needs, check [`yalk`'s documentation](https://github.com/wclr/yalc).

## Publish

Run `npm run publish`
