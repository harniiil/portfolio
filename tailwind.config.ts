import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F3EE",     // warm off-white background
        ink: "#111111",       // near-black text
        muted: "#5B5B5B",     // secondary text
        line: "#E7E1D8",      // hairline borders
        accent: "#2B6CB0",    // calm network-blue
      },
      boxShadow: {
        soft: "0 8px 30px rgba(17, 17, 17, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
