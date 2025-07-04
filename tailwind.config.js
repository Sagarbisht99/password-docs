/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can customize these colors
        blue: {
          100: '#DBEAFE', // Light blue background for badges
          400: '#60A5FA', // Icon color
          600: '#2563EB', // Primary blue color
          700: '#1D4ED8', // Hover state
          800: '#1E40AF', // Text color
          900: '#1E3A8A', // Dark mode background
        },
      },
      fontSize: {
        // Custom font sizes
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '6xl': '3.75rem',
      },
      spacing: {
        // Custom spacing
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
      },
      borderRadius: {
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      minHeight: {
        '90vh': '90vh',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode with class strategy
} 