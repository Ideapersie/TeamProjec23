import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'wahaca-blue': '#0454a4',
        'wahaca-teal': '#06a5ae',
        'wahaca-yellow': '#fff47c',
        'wahaca-navy' : '#22314d',
        'wahaca-light-blue': '#bee2e9',
        'wahaca-pink': '#e80464',
        'wahaca-white': '#fff4f4',
        'wahaca-light-navy': '#3b527d',
      },
      fontFamily: {
        subtitle: ['subtitle', 'calibri'],
        title: ['title', 'Georgia'],
      },
    },
  },
  plugins: [],
};
export default config;
