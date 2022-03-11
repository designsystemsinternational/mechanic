# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
