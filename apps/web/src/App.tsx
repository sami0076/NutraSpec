/**
 * Main web app. Camera, scan, overlay, and results will live here.
 * Mobile demo = same app served/built via vite-plugin-multi-device (no native framework).
 */
export default function App() {
  return (
    <div className="app">
      <h1>FoodFinder.AI</h1>
      <p>Web app — mobile demo via Vite plugin (run <code>pnpm dev:mobile</code> or open on device).</p>
    </div>
  );
}
