Offline fonts for VIREDÁ
========================

The website fonts are bundled from npm packages, not remote CDN requests:

- `@fontsource-variable/bricolage-grotesque`
- `@fontsource/instrument-serif`
- `@fontsource/instrument-sans`

The CSS imports live in `resources/css/app.css`; Vite copies the required font
files into `public/build/assets` during `npm run build`, so production and local
builds work offline after dependencies are installed.
