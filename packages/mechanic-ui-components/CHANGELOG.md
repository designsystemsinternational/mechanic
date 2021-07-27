# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
