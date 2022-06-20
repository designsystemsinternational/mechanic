# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 2.0.0-beta.8 - 2022-06-20

### Fixed

- Design function iframe also takes basename to load resources

## 2.0.0-beta.7 - 2022-05-16

### Fixed

- Build command had a import missing
- Removed unused log left in development

## 2.0.0-beta.6 - 2022-05-08

### Added

- Adds cli and config file options to define static folder (`staticPath`) and custom app components ( `appCompsPath`)

### Fixed

- App breaking when no custom app components are defined
- Error log when no static folder is included in project

## 2.0.0-beta.5 - 2022-05-04

### Added

- Support to import custom `SideBar` component in `app/` folder that replaces sidebar in Mechanic UI.
- New design function export `ExtraUi`, expected to be a React component that's added to the bottom section of sidebar, on top of default toggles and buttons.
- Support for SVG and PNG exports for SVG based engines like `engine-react` and `engine-svg`.
- New `hideFeedback` design function setting. When true, Mechanic's feedback button is hidden. Defaults to false.
- New `hideNavigation` design function setting. When true, the navigation input that lets users select a design function is hidden. Defaults to false.
- New `hidePresets` design function setting. When true, preset selection input is hidden. Defaults to false.
- New `hideScaleToFit` design function setting. When true, Scale to Fit toggle is hidden. Defaults to false.
- New `initialScaleToFit` design function setting. When false, Scale to Fit will be off initially. Defaults to true.
- New `hideAutoRefresh` design function setting. When true, Auto Refresh toggle is hidden. Defaults to false.
- New `initialAutoRefresh` design function setting. When false, Auto Refresh will be off initially. Defaults to true.
- New `hideGenerate` design function setting. When true, Generate button is hidden. Defaults to false.
- New `showMultipleExports` design function setting. When false, single export button is shown. When true, two separate export buttons are shown: one for PNG export and another for SVG export. Defaults to false.
- New `ignoreStyles` design function setting. When true, CSS in iframe is injected into design function's SVG output. Defaults to false.
- Support to serve `static/` folder for all design functions.
- `_isPreview` value is passed to design function handler in `inputs` argument.

### Changed

- Changed filename from `[name][timestamp].[ext]` to `[filename]-[timestamp].[ext]` for better readability

## 2.0.0-beta.4 - 2022-04-14

### Fixed

- Adds `immer` as dependency.

## 2.0.0-beta.3 - 2022-03-24

### Changed

- Preview / Randomize button was renamed to Generate and styled as a single button with undo / redo

## 2.0.0-beta.2 - 2022-03-18

### Fixed

- Error capturing during df render
- Typos in input validation

## 2.0.0-beta.1 - 2022-03-17

### Fixed

- Captured instance when animation only calls done and never frame.

## 2.0.0-beta.0 - 2022-03-16

### Added

- Custom inputs as components can be defined and imported into a mechanic project
- Custom inputs as interaction observers can be defined and imported into a mechanic project
- Title in app shows open design function's name
- Not found page renders link to home
- Random seed history, with undo and redo options
- Random seed history local storage persistency
- State can be set in mechanic instances and passed to the next instance

### Changed

- Not found page is centered
- Loading and running errors are now shown in app as a modal instead of as an alert
- Uses [`immer`](https://github.com/immerjs/immer) to manage input values in app
- Generated script from function loader is now written in ESM
- Updated PostCSS dependencies: `postcss-loader`and `postcss-preset-env`
- Generalized and streamlined input validation, and added basic inputs definitions and behaviors
- Renamed original width and height values passed from `_widthOriginal` and `_heightOriginal`to just `_width`and `_height`.

### Fixed

- Feedback tag gets lifted
- Added array case to local storage input values serialization
- Allows nested URLs in app that redirect to first level of URL (to main design functions)

## 1.2.0 - 2022-02-14

### Added

- Added styles (& fonts) to SVG frames for animated exports, so they export correctly.
- Added support to export images and video from HTML elements from React engine (credits to [@caroillemann](https://github.com/caroillemann))
- Added favicon to mechanic app and loading page.

### Changed

- Extra input values are passed to design function handler (`_widthOriginal`, `_heightOriginal` and `_ratio`) (credits to [@caroillemann](https://github.com/caroillemann))

## 1.1.0 - 2021-09-29

### Changed

- Changed `usesRandom` setting name to `persistRandomOnExport` at it's default value to `true`.

## 0.6.4 - 2021-09-14

### Added

- Fixed anchor into App that link to feedback form.

### Changed

- Default preset is named "Custom" now and behaves more nicely

### Fixed

- Changed colors in ui-components to be consistent with colors in docs

## 0.6.3 - 2021-09-10

### Fixed

- Replaced nullish coalescing operator used in node scripts to support 12.20 onwards

## 0.6.2 - 2021-09-09

### Fixed

- Fixed bug involving importing scripts in Windows without using POSIX.

## 0.5.1 - 2021-09-07

### Fixed

- `dev` and `serve` commands look for available port to use instead of crushing.

## 0.5.0 - 2021-09-06

### Changed

- Renamed design function's `params` export to `inputs`. This is not backwards compatible and is an API change.

### Fixed

- HMR is now correctly enabled while running `npm run dev` on Mechanic project.

## 0.4.2 - 2021-08-27

### Added

- App can be injected a different public path to be serve from a subfolder

## 0.4.1 - 2021-08-24

### Changed

- Renamed packages and scope to `@mechanic-design/core`.

## 0.4.0 - 2021-08-24

### Added

- Added ability to import fonts in functions, and embed them on SVG export
- Added ability to import css files in functions. They are now properly handled when exporting svg.
- Added SVG optimization via [SVGO](https://github.com/svg/svgo#svgo). This also removes unused css in the exported file. There is a new `optimize` setting key that defaults to true and accepts a boolean or a [SVGO config](https://github.com/svg/svgo#configuration) object.
- Updated app to use new visual styles.

### Changed

- Changed how design functions are bundled, instead of a single functions bundle that mixes definitions, one per design function bundle is generated through temporal scripts. This lets CSS stylings to not get mixed in the loaded iframe of the app.
- Improved language and logs in main Mechanic commands (`dev`, `build`, `serve`)
- Updated app loading page to use rotating mini Mechanic logo.

### Fixed

- Fixed bug in mechanic value validation through validation field.
- Fixed bug in preset value sets.

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
