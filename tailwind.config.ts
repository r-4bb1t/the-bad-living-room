import type { Config } from "tailwindcss";

import { tailwindPreset } from "@r-4bb1t/rabbit-ui";

const config: Config = {
  presets: [tailwindPreset],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@r-4bb1t/rabbit-ui/src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff6464",
          darker: "#ff4c4c",
          text: "#ffffff",
          bright: "#ffdddd",
        },
      },
    },
  },
  plugins: [],
};
export default config;
