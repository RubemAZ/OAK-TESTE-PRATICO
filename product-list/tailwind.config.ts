import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        'dark-green':'#1e2326',
        'dark-green2':'#002828',
        'mid-light-green':'#365656',
        'light-green':'#03e083',
        'mid-green':'#009540',
      },
    },
  },
  plugins: [],
} satisfies Config;
