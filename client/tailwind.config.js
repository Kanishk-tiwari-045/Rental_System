// import { addDynamicIconSelectors } from '@iconify/tailwind';
import defaultTheme from "tailwindcss/defaultTheme";

// import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

const tailwindConfig = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern':
          "url('D:/Celebal/Rental/client/src/pages/admin/data')",
      }
    },
  },
};

const combinedConfig = {
  ...defaultTheme, // Merge defaultTheme
  ...tailwindConfig // Merge tailwindConfig
};

export default combinedConfig;
