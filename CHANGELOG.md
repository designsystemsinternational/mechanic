# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2021-08-24

### Added

- Create CLI project templates and examples

### Change

- Improved project creation CLI experience.
- Changed single bundle for design functions approach to one isolated bundle per design function.
- Improved other commands experience.
- Updated engines argument pass to single object with named fields.

## [0.3.0] - 2021-08-02

### Added

- Support for new param added of type `"image"`.

## [0.2.11] - 2021-07-27

### Changed

- UI components and app now use named exports for CSS Modules.

## [0.2.10] - 2021-07-21

### Changed

- Added extra information log for "options" field in param validation.

## [0.2.9] - 2021-07-21

### Added

- Support for `"editable"` property in params. It disables the input in case of non editable result.

### Changed

- `ParamInput` component doesn't receive single `value` prop, but `values` prop with the whole object of values.

## [0.2.8] - 2021-07-15

### Changed

- Improved path usage through normalization
- Fixed Windows bug when requiring modules without POSIX format.

## [0.2.7] - 2021-07-13

First logged release

[unreleased]: https://github.com/designsystemsinternational/mechanic/compare/v0.4.0...main
[0.4.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.4.0
[0.3.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.3.0
[0.2.11]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.11
[0.2.10]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.10
[0.2.9]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.9
[0.2.8]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.8
[0.2.7]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.7
