# Changelog

## Unreleased

- Add audited CI, container smoke tests, and automatic GHCR application image delivery from main; validate source releases and monitor npm/Docker updates.

- Upgrade Next.js and its ESLint configuration to 16.3.3 and the sharp override to 0.35.4 to address GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, and GHSA-rgj7-g3m4-5g8c.

- Standardize source filenames to kebab-case and organize components, contexts, and shared UI types outside the route directory.

- Fix forwarded input refs and validate current values synchronously on submit.
- Add accessible field errors, password visibility, keyboard focus management, and a responsive workspace UI.
- Handle unavailable browser storage and synchronize demo sessions across tabs.
- Remove unused dependencies and replace source-text assertions with behavioral regression tests.
- Add ESLint flat config, TypeScript checks, and full validation in CI.


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where applicable.

## [Unreleased]

### Added

- Added an initial changelog to track future project changes.

<!--
When preparing a release, move relevant entries from Unreleased into a dated
version section. Use Added, Changed, Deprecated, Removed, Fixed, and Security
headings as appropriate.
-->
