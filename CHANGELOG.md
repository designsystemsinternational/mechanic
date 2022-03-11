# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2022-02-14

### Added

- Added styles (& fonts) to SVG frames for animated exports, so they export correctly.
- Added favicon to mechanic app and loading page.
- Added support to export images and video from HTML elements from React engine (credits to [@caroillemann](https://github.com/caroillemann))

### Changed

- Extra input values are passed to design function handler (`_widthOriginal`, `_heightOriginal` and `_ratio`) (credits to [@caroillemann](https://github.com/caroillemann))

### Fixed

- Included fonts in example functions

## [1.1.0] - 2021-09-29

### Added

- New business card generator example
- New instagram story generator example

### Changed

- Changed `usesRandom` setting name to `persistRandomOnExport` at it's default value to `true`.
- Updated all templates and examples to follow `persistRandomOnExport` behavior instead of `usesRandom`.
- Code base for `react-image` template

## [1.0.0] - 2021-09-14

Beta release

## [0.6.5] - 2021-09-14

### Changed

- Changed base of poster generator example to feel a bit more broad

## [0.6.4] - 2021-09-14

### Added

- Fixed anchor into App that link to feedback form.

### Changed

- Default preset is named "Custom" now
- Preset value changes to "Custom" after value of input is changed away from current preset

### Fixed

- Changed colors in ui-components to be consistent with colors in docs

## [0.6.3] - 2021-09-10

### Fixed

- Replaced nullish coalescing operator used in node scripts to support 12.20 onwards

## [0.6.2] - 2021-09-09

### Changed

- Tweaked CLI language

### Fixed

- Fixed bug when running on Windows
- Fixed p5-video template creation bug

## [0.6.1] - 2021-09-08

### Fixed

- Fixed bug in `create-mechanic`.

## [0.6.0] - 2021-09-08

### Changed

- Renamed creation CLI package to `create-mechanic`. Creation command is now `npm init mechanic`. `@mechanic-design/create` gets deprecated.

## [0.5.1] - 2021-09-07

### Fixed

- CLI commands now look for available port if one specified is used.

## [0.5.0] - 2021-09-06

### Changed

- Renamed design function's `params` export to `inputs`. From now on it's inputs everywhere. This is not backwards compatible and is an API change.

### Fixed

- Correctly enabled HMR to use while running `npm run dev` in Mechanic projects.
- Improved visual consistency and fixed minor bugs in ui components
- Animation export from SVG assets
- Fixed color input bugs (closing and z-index issues)
- Fixed inconsistencies on hover and active states across all inputs and buttons

## [0.4.2] - 2021-08-27

### Added

- App can be injected a different public path to be serve from a subfolder

## [0.4.1] - 2021-08-24

### Changed

- Renamed packages and scope. Now all packages live under `@mechanic-design`.

## [0.4.0] - 2021-08-24

### Added

- Create CLI project templates and examples

### Changed

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

[unreleased]: https://github.com/designsystemsinternational/mechanic/compare/v1.2.0...main
[1.2.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v1.2.0
[1.1.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v1.1.0
[1.0.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v1.0.0
[0.6.5]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.6.5
[0.6.4]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.6.4
[0.6.3]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.6.3
[0.6.2]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.6.2
[0.6.1]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.6.1
[0.6.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.6.0
[0.5.1]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.5.1
[0.5.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.5.0
[0.4.1]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.4.1
[0.4.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.4.0
[0.3.0]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.3.0
[0.2.11]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.11
[0.2.10]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.10
[0.2.9]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.9
[0.2.8]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.8
[0.2.7]: https://github.com/designsystemsinternational/mechanic/releases/tag/v0.2.7
