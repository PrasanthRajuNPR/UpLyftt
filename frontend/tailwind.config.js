/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        // Existing color
        richblack: {
          900: "#000814",
        },
        // New design colors (added safely)
        background: "#020617",
        card: "#020617",
        border: "#1E293B",
        primary: "#22D3EE",
        secondary: "#3B82F6",
        hover: "#67E8F9",
        success: "#22C55E",
        warning: "#FACC15",
        error: "#EF4444",
        heading: "#E5E7EB",
        subheading: "#CBD5E1",
        body: "#94A3B8",
        helper: "#64748B",
        disabled: "#475569",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Keep existing plugin
    require("@tailwindcss/line-clamp"), // Needed for line-clamp-2 in CourseCard
  ],
};
