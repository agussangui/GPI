import themes from 'daisyui/theme/object';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        "figma": {
          "primary": "oklch(65% 0.25 220)",
          "primary-content": "oklch(28% 0.091 267.935)",
          "secondary": "oklch(81% 0.111 293.571)",
          "secondary-content": "oklch(28% 0.141 291.089)",
          "accent": "oklch(80% 0.105 251.813)",
          "accent-content": "oklch(28% 0.091 267.935)",
          "neutral": "oklch(44% 0.011 73.639)",
          "neutral-content": "oklch(98% 0.001 106.423)",
          "base-100": "oklch(98% 0.001 106.423)",
          "base-200": "oklch(97% 0.001 106.424)",
          "base-300": "oklch(92% 0.003 48.717)",
          "base-content": "oklch(21% 0.006 56.043)",
          "info": "oklch(74% 0.16 232.661)",
          "info-content": "oklch(29% 0.066 243.157)",
          "success": "oklch(77% 0.152 181.912)",
          "success-content": "oklch(27% 0.046 192.524)",
          "warning": "oklch(85% 0.199 91.936)",
          "warning-content": "oklch(28% 0.066 53.813)",
          "error": "oklch(71% 0.194 13.428)",
          "error-content": "oklch(27% 0.105 12.094)",
          "radius-selector": "2rem",
          "radius-field": "0.5rem",
          "radius-box": "1rem",
          "size-selector": "0.25rem",
          "size-field": "0.25rem",
          "border": "0.5px",
          "depth": "1",
          "noise": "0",
        },
      },
    ]
    },

};

export default config;
