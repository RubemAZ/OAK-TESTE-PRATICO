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
        'dark-green':'#002828',
        'dark-green-button':'#00632b',
        'mid-dark-green':'#365656',
        'mid-green':'#009540',
        'light-green':'#03e083',

      },
    },
  },
  plugins: [],
} satisfies Config;
