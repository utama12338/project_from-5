import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./Navbar/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5161ce',
        gsb: {
          50: '#fdf2fa',
          100: '#fbe5f5',
          200: '#f7cbec',
          300: '#f2a7e3',
          400: '#ec80d6',
          500: '#e45bc7',
          600: '#bc4ca0',
          700: '#9a3d7f',
          800: '#7b2f61',
          900: '#61244b',
        }
      },
    },
    
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
