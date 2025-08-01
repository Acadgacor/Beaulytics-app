import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFEB3B",
        secondary: "#FFF9C4",
        white: "#FFFFFF",
        "light-gray": "#F5F5F5",
        "medium-gray": "#E0E0E0",
        "dark-gray": "#757575",
        black: "#212121",
        error: "#FF5252",
        success: "#4CAF50",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
      },
      transitionDuration: {
        "300": "0.3s",
      },
    },
  },
  plugins: [],
};
export default config;