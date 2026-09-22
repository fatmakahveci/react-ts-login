import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Restore browser-only persistence after hydration.
  { files: ['src/contexts/auth-context.tsx'], rules: { 'react-hooks/set-state-in-effect': 'off' } },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
]);
