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
        'wahaca-blue': '#5049df',
        'wahaca-teal': '#06a5ae',
        'wahaca-yellow': '#fff47c',
        'wahaca-navy' : '#243349',
        'wahaca-light-blue': '#bee2e9',
        'wahaca-pink': '#e60065'
      },
      fontFamily: {
        wahaca: ['Supersonic-Rocketship', 'sans'],
      },
    },
  },
  plugins: [],
};
export default config;
