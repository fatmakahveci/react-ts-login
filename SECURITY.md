# Security Policy

## Supported Versions

Security updates are provided for the latest version on the default branch.
Older releases and unmaintained branches may not receive security fixes.

## Reporting a Vulnerability

Please do not disclose security vulnerabilities in public issues, discussions,
or pull requests.

Report a vulnerability through this repository's
[private vulnerability reporting](https://github.com/fatmakahveci/react-ts-login/security/advisories/new).
If that option is unavailable, contact the repository owner through the
[GitHub profile](https://github.com/fatmakahveci) to arrange a private reporting
channel.

Include the affected component and version, reproduction steps, potential
impact, and any suggested mitigation. Reports will be reviewed as promptly as
possible, and coordinated disclosure is appreciated.

## Scope and Demo Limitations

This project demonstrates a client-side login interface. It does not verify
identities, authenticate against a server, or protect backend resources.

- The `isLoggedIn` localStorage flag controls the demo UI only. It is editable
  by the browser user and must not be used as an authorization mechanism.
- Email and password values are not persisted or sent to an authentication
  service. Use sample credentials when testing the demo.
- Form validation provides user feedback; it is not a security boundary.
- When localStorage is unavailable, the demo session remains in memory for
  the current page.

Changes that expose credentials, introduce script injection, or compromise
project dependencies are appropriate subjects for a private security report.

## Safe Reporting

Use a local copy and synthetic data to reproduce an issue. Do not include
real passwords, access tokens, personal information, or other secrets in a
report. Do not test against systems or accounts without authorization.

Before using this interface in a production application, integrate a
server-side identity service and enforce authentication and authorization
on the server.
