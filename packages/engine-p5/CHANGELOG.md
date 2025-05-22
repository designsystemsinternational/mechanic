# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Updated engine to new `registerFrameCallback` and `registerDoneCallback` setup
- `done` and `frame` are passed into the design function directly now. Destructuring them from `mechanic` is deprecated.
- Expose `isPreview` to design function.

## 2.0.0-beta.0 - 2022-03-16

### Added

- Provides design functions `state` and `setState` in mechanic instance.

### Changed

- Updates inner workings to fit new loading and running flow.

## 0.5.0 - 2021-09-06

### Changed

- Renamed design function's `params` export to `inputs`. This is not backwards compatible and is an API change.

## 0.4.1 - 2021-08-24

### Changed

- Renamed packages and scope to `@mechanic-design/engine-p5`.

## 0.4.0 - 2021-08-24

### Changed

- Updated engine to pass single argument object with named fields to design functions.

## 0.2.7 - 2021-07-13

First logged release
