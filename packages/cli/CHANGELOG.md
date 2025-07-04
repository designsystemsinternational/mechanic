# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 2.0.0-beta.12 - 2023-07-08

### Fixed

- `dev` and `build` commands now will use a project's config values when the following options aren't specified :`functionsPath`, `inputsPath`, `staticPath` and `appCompsPath`

## 2.0.0-beta.10 - 2023-02-10

### Fixed

- new function command takes function name argument into account when using template or example option.

## 2.0.0-beta.6 - 2022-05-08

### Added

- `dev` and `build` commands have new `appCompsPath` option, can be passed to define folder containing custom app components for project
- `dev` and `build` commands have new `staticPath` option, can be passed to define folder containing static files to be served in app

## 2.0.0-beta.0 - 2022-03-24

### Added

- `dev` and `build` commands have new `inputsPath` option can be passed to define folder containing custom inputs for project

## 0.6.3 - 2021-09-10

### Fixed

- Replaced nullish coalescing operator used in node scripts to support 12.20 onwards

## 0.6.2 - 2021-09-09

### Fixed

- CLI language talked about user's "first" design function, when it shouldn't

## 0.5.0 - 2021-09-06

### Changed

- Renamed design function's `params` export to `inputs`. This is not backwards compatible and is an API change.

## 0.4.1 - 2021-08-24

### Changed

- Renamed packages and scope to `@mechanic-design/cli`.

## 0.4.0 - 2021-08-24

### Changed

- Added more options to the creation flow and concept explanations that were missing.

## 0.2.8 - 2021-07-15

### Changed

- Improved path default values with normalized values

## 0.2.7 - 2021-07-13

First logged release
