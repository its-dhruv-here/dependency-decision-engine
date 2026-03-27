/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "error": "#ba1a1a",
        "inverse-surface": "#2f3131",
        "on-primary-fixed-variant": "#45455b",
        "tertiary-fixed-dim": "#ffb4ab",
        "primary-fixed-dim": "#c6c4df",
        "primary": "#00000b",
        "on-error-container": "#93000a",
        "surface-bright": "#f9f9f9",
        "surface-tint": "#5d5c74",
        "surface-container-high": "#e8e8e8",
        "on-surface": "#1a1c1c",
        "on-primary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "inverse-on-surface": "#f0f1f1",
        "surface-container-low": "#f3f3f3",
        "on-secondary-fixed": "#002109",
        "secondary-fixed-dim": "#62df7d",
        "primary-fixed": "#e2e0fc",
        "on-primary-fixed": "#1a1a2e",
        "on-surface-variant": "#47464c",
        "on-secondary": "#ffffff",
        "on-background": "#1a1c1c",
        "error-container": "#ffdad6",
        "outline": "#78767d",
        "on-tertiary-container": "#f73b36",
        "secondary": "#006e2d",
        "surface-container": "#eeeeee",
        "on-error": "#ffffff",
        "surface-variant": "#e2e2e2",
        "secondary-container": "#7cf994",
        "primary-container": "#1a1a2e",
        "surface-container-highest": "#e2e2e2",
        "surface": "#f9f9f9",
        "secondary-fixed": "#7ffc97",
        "tertiary": "#050000",
        "on-secondary-fixed-variant": "#005320",
        "on-secondary-container": "#007230",
        "on-tertiary-fixed-variant": "#93000b",
        "on-tertiary": "#ffffff",
        "outline-variant": "#c8c5cd",
        "inverse-primary": "#c6c4df",
        "on-tertiary-fixed": "#410002",
        "on-primary-container": "#83829b",
        "tertiary-container": "#420002",
        "background": "#f9f9f9",
        "surface-dim": "#dadada",
        "tertiary-fixed": "#ffdad6"
      },
      fontFamily: {
        "headline": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem", 
        "lg": "2rem", 
        "xl": "3rem", 
        "full": "9999px"
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
