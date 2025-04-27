/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"], // Or "Lora"
        body: ["Inter", "sans-serif"], // Or "Roboto"
      },
      colors: {
        // backround-colors
        primary: "#f7fafc", // Example: gray-100
        secondary: "#ffffff", // Example: white
        tertiary: "#F59E0B", // Example: Amber 400

        // text-colors
        light: "#4B5563", // Previously gray-600
        dark: "#1F2937", // Previously gray-800
      },
      fontSize: {
        // Primary group: General use text sizes (body content, default headings)
        "primary-sm": "0.875rem", // 14px - secondary content
        "primary-base": "1rem", // 16px - standard body text
        "primary-lg": "1.125rem", // 18px - slightly larger text

        // ...... not used yet
        // Secondary group: Larger headings or standout sections
        "secondary-sm": "1.25rem", // 20px - small headings
        "secondary-base": "1.5rem", // 24px - main headings
        "secondary-lg": "1.875rem", // 30px - prominent headings

        // Tertiary group: Hero sections, banners, and branding
        "tertiary-sm": "2.25rem", // 36px - hero section subtitles
        "tertiary-base": "3rem", // 48px - large hero section headings
        "tertiary-lg": "3.75rem", // 60px - display text for banners
      },
    },
  },
  plugins: [],
};
