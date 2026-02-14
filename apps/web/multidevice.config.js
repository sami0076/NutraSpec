/**
 * Config for vite-plugin-multi-device.
 * Mobile demo = same web app, built/served for mobile viewport (no native framework).
 */
module.exports = {
  devices: {
    mobile:
      /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/,
  },
  fallback: "desktop",
  env: "DEVICE",
};
