# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- Tweaks size of thumbnails in image input
- Resets cursor style on disabled image inputs

## 2.0.0-beta.4 - 2022-04-14

### Fixed

- Updated width of number value display to `ch` units in slider so it does not overflow

## 2.0.0-beta.3 - 2022-03-24

### Changed

- Button was changed to prevent it to be focused and disabled at the same time.
- The `common` disabled state was changed to prevent events from triggering behind a disabled element.

## 2.0.0-beta.0 - 2022-03-16

### Added

- `OptionInput` is now also an export of the package.

### Changed

- Reset border width in buttons that are both disabled and on focus
- Updated `html-loader` dependency to match one in `core`
- Updated PostCSS dependencies: `postcss-loader`and `postcss-preset-env`

## 0.6.4 - 2021-09-14

### Fixed

- Changed colors in ui-components to be consistent with colors in docs

## 0.5.0 - 2021-09-06

### Changed

- Renamed design function's `params` export to `inputs`. From now on it's inputs everywhere. Main component that wraps multiple inputs is now called `MechanicInput` (instead of `ParamInput`).

### Fixed

- Fixed color input bug that prevented it from closing when clicking another instance of the input, and a related z-index issue

- Fixed inconsistencies on hover and active states across all inputs and buttons

## 0.4.1 - 2021-08-24

### Changed

- Renamed packages and scope to `@mechanic-design/ui-components`.

## 0.4.0 - 2021-08-24

### Changed

- Updated components to use new visual language

## 0.3.0 - 2021-08-02

### Added

- Added new image param into library. It's available for export as is and `ParamInput` also supports this new typo of input.

### Changed

- Refactored how styling is set up in example app.

### Fixed

- Gray color for disabled inputs was changed into one that supports full accessible contrast.

## 0.2.11 - 2021-07-27

### Changed

- Components now use named exports for CSS Modules.

## 0.2.9 - 2021-07-21

### Added

- Support for `"editable"` property in params. It disables the input in case of non editable result.
- Extended base stylings for disabled inputs.

### Changed

- `ParamInput` component doesn't receive single `value` prop, but `values` prop with the whole object of values. This enables the `"editable"` function evaluation.
- Tweaked flex settings for slider input to fit smaller containers.

## 0.2.7 - 2021-07-13

First logged release
