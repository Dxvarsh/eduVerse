/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ["gilroy", "sans-serif"],
        monument: ["monument", "serif"],
        ptserif: ["ptserif", "serif"],
      },
      colors: {
        tailblue: "#38bdf8",
        darkblue: "#0b1121",
        offwhite: "#FAF9F6",
      },
    },
  },
  plugins: [],
}
