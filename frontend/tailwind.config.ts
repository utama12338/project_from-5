import type { Config } from "tailwindcss";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./Navbar/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#5161ce',
        gsb: {
          // ...existing gsb colors...
        },
        // Add dark mode colors
        dark: {
          bg: '#1a1a1a',
          text: '#ffffff',
          primary: '#6172df'
        },
        light: {
          bg: '#ffffff',
          text: '#000000',
          primary: '#5161ce'
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
