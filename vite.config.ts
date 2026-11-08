import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const MRT_MANTINE_SHIM = fileURLToPath(
  new URL('./src/components/mantineCoreForMrt.tsx', import.meta.url),
);

/**
 * Mantine React Table v2 was built for Mantine 7; point its `@mantine/core` imports at a small
 * compat module (see src/components/mantineCoreForMrt.tsx). Other importers are unaffected.
 */
const mantineReactTableCompat = (): Plugin => ({
  name: 'mantine-react-table-compat',
  enforce: 'pre',
  resolveId(source, importer) {
    if (source === '@mantine/core' && importer?.includes('/node_modules/mantine-react-table/')) {
      return MRT_MANTINE_SHIM;
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [mantineReactTableCompat(), react(), babel({ presets: [reactCompilerPreset()] })],
  optimizeDeps: {
    // Served un-bundled in dev so the compat plugin above can rewrite its imports...
    exclude: ['mantine-react-table'],
    // ...which means its own (partly CommonJS) dependencies must be pre-bundled explicitly.
    include: [
      'mantine-react-table > @mantine/dates',
      'mantine-react-table > @tanstack/react-table',
      'mantine-react-table > @tanstack/match-sorter-utils',
      'mantine-react-table > @tanstack/react-virtual',
    ],
  },
});
