# React TypeScript Login Form

[![React](https://img.shields.io/badge/React-TypeScript-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-React-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Last commit](https://img.shields.io/github/last-commit/fatmakahveci/react-ts-login)](https://github.com/fatmakahveci/react-ts-login/commits/main)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE.md)

A focused Next.js authentication UI exercise using React context, reusable inputs, and client-side form validation.

## Highlights

- Email and password validation with clear field states
- Shared authentication state through React Context
- Conditional login and authenticated home views
- Reusable card, input, button, header, and navigation components

## Technology

- Next.js
- React
- TypeScript
- React Context
- React Bootstrap

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000. Authentication is demonstrated in client state and is not a production identity service.

## Quality Checks

```bash
npm run lint
npm run build
```

## Repository Structure

- `src/app/components/Login` — login form and validation
- `src/app/store/auth-context.tsx` — authentication state
- `src/app/components/UI` — reusable interface primitives

## Project Resources

- [Changelog](CHANGELOG.md)
- [Contributing guide](.github/CONTRIBUTING.md)
- [Security policy](.github/SECURITY.md)
- [License](LICENSE.md)
