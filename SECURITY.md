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

## Security Model

Authentication uses Better Auth with PostgreSQL-backed sessions, password hashing,
HTTP-only cookies, required email verification, and database-backed rate limits.
Task endpoints check the authenticated user on every request and scope queries to
that user's ID. Mutating task requests require the configured application Origin.
The workspace route redirects unauthenticated users; hiding UI is not the
security boundary. No passwords or session tokens are stored in localStorage.

Production requires HTTPS, a random BETTER_AUTH_SECRET, a protected database,
and TLS-enabled SMTP. Do not expose PostgreSQL, test mailboxes, or the application
port directly; use the configured reverse proxy. Never enable ALLOW_LOCAL_HTTP
on a public deployment. Keep .env files and backups out of version control.

The test inbox is strictly a development fixture bound to loopback. Browser
tests must use a dedicated database. They create test users and revoke their
sessions. The old demo.gif depicts the historical client-only interface, not
the current authentication behavior.

## Safe Reporting

Use synthetic accounts in an authorized test environment. Include reproduction
steps, affected versions, and impact, but never include credentials, verification
links, session cookies, or personal information. Report suspected authentication,
authorization, dependency, and data-isolation issues through the private channel
above. Automated checks do not constitute a third-party security audit.
