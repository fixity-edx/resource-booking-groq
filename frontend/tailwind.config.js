/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 0 1px rgba(59,130,246,.12), 0 16px 50px rgba(0,0,0,.5)",
        card: "0 18px 60px rgba(0,0,0,.45)"
      },
      borderRadius: { xxl: "28px" }
    },
  },
  plugins: [],
}
