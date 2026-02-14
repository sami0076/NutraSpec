# Web App (FoodFinder.AI)

**Primary product:** web app. No mobile-native frameworks (no React Native, Expo, or Capacitor).

**Mobile demo:** provided by **vite-plugin-multi-device**. Same codebase is built/served for mobile viewport so you can demo on a phone or in device toolbar.

## Commands

| Command             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Dev server (desktop) — http://localhost:5173                  |
| `pnpm dev:mobile`   | Dev with device auto-detection (`vmd`) — use from phone or UA |
| `pnpm build`        | Production build → `dist/desktop`                             |
| `pnpm build:mobile` | Mobile demo build → `dist/mobile`                             |
| `pnpm build:all`    | Both desktop + mobile (`vmd build`)                           |

## Mobile demo flow

1. Run `pnpm dev:mobile` and open the shown URL on your phone, or
2. Run `pnpm build:mobile` and serve `dist/mobile` (e.g. by user-agent) for a production-style mobile demo.

All UI (camera, scan, overlay, results, Eleven Labs playback) lives in this app.
