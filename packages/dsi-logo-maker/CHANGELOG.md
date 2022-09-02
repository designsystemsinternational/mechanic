# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Refactored all canvas based functions to use the new `getCanvas` functionality

## 1.1.0 -2021-09-29

### Changed

- Updated all functions to follow `persistRandomOnExport` behavior instead of `usesRandom`.

## 0.5.0 - 2021-09-06

### Changed

- Renamed design function's `params` export to `inputs`. This is not backwards compatible and is an API change.

## 0.4.1 - 2021-08-24

### Changed

- Renamed packages and scope to `@mechanic-design/dsi-logo-maker` and changed to private.

## 0.4.0 - 2021-08-24

### Changed

- Updated definitions to new design function parameter definition.

## 0.3.0 - 2021-08-02

### Added

- Added design functions `textAndImageCanvas` and `textAndImageSVG` that use new image param.

### Changed

- Changed name of system font used for logos from "F" to "F Grotesk Thin"

## 0.2.9 - 2021-07-21

### Changes

- Renamed some functions presets to existing words.
- Removed `usesRandom` setting from functions that didn't use it.

## 0.2.7 - 2021-07-13

First logged release
