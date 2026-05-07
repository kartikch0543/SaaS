/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        mist: "#eff6ff",
        surf: "#d6f4ff",
        ember: "#ff7a59",
        pine: "#0f766e",
        slate: "#10233b"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glass: "0 20px 60px rgba(7, 17, 31, 0.12)"
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(255,122,89,0.24), transparent 32%), radial-gradient(circle at top right, rgba(15,118,110,0.2), transparent 28%), linear-gradient(135deg, #f8fbff 0%, #eff6ff 50%, #dff5ef 100%)"
      }
    }
  },
  plugins: []
};
