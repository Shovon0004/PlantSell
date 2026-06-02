module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)"],
        sofadi: ["var(--font-sofadi)"],
        nunito: ["var(--font-nunito)"],
        "dm-sans": ["var(--font-dm-sans)"],
      },
    },
  },
};