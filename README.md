# Mechanic by Design Systems International

This is a monorepo with all the open-source code for [Mechanic](https://mechanic.design)

- [mechanic-template](packages/mechanic-template) A project skeleton for a design tool made with Mechanic
- [mechanic-cli](packages/mechanic-cli) A command-line tool to generate new projects from the skeleton

The repo is managed via [lerna](https://github.com/lerna/lerna).

## Development

To get started, clone this repo.

Then run, `npm run bootstrap`. This will symlink all the dependencies together and run `npm i` inside each package. Running `npm i` inside a package folder will not work.

## Publish

Run `lerna publish`
