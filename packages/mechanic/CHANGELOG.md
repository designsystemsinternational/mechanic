# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Added ability to import fonts in functions, and embed them on SVG export
- Added ability to import css files in functions. They are now properly handled when exporting svg.
- Added SVG optimization via [SVGO](https://github.com/svg/svgo#svgo). This also removes unused css in the exported file. There is a new `optimize` setting key that defaults to true and accepts a boolean or a [SVGO config](https://github.com/svg/svgo#configuration) object.
- Updated app to use new visual styles.

## 0.3.0 - 2021-08-02

### Changed

- App adds new edge cases to support new image param.
- Core function validation adds support for image param validation.

## 0.2.11 - 2021-07-27

### Changed

- Internal app constructions now uses named exports for CSS Modules.

## 0.2.10 - 2021-07-21

### Changed

- Added extra information log for "options" field in param validation.

## 0.2.9 - 2021-07-21

### Added

- Added validation of new `"editable"` param property.
- Adds "Auto-refresh" toggle to app that enables automatic function call when inputs are changed. It also preserves random seeds when run is automatic.

### Changed

- Added title to HTML of main app, title to iframe, and a label to design function select for navigation.
- Updated prop pass for `ParamInput` components.
- Adapted `mechanic` partially as an ES module package

## [0.2.8] - 2021-07-15

### Changed

- Improved path normalization and logs
- Fixed Windows bug when requiring modules without POSIX format.

## 0.2.7 - 2021-07-13

First logged release
