import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F3EC",
        "paper-bright": "#FBFAF6",
        mist: "#ECEAE3",
        line: "#DEDBD2",
        silver: "#C7CBD1",
        wall: "#EFEAE0",
        floor: "#E2DBCD",
        ink: "#26262B",
        "ink-soft": "#5C5C64",
        coral: "#E8736A",
        "coral-deep": "#C8554C",
        lilac: "#B6A8E0",
        "lilac-deep": "#7B66B8",
        ice: "#AFCBE3",
        "ice-deep": "#5E89AD",
        "ice-wash": "#DCE9F2",
        blush: "#F2B8C6",
        sticky: "#F7EEC4",
      },
      fontFamily: {
        display: ["var(--font-main)", "monospace"],
        sans: ["var(--font-main)", "monospace"],
        mono: ["var(--font-main)", "monospace"],
        accent: ["var(--font-accent)", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(38,38,43,.06), 0 8px 20px rgba(38,38,43,.08)",
        room: "0 1px 2px rgba(38,38,43,.05), 0 24px 60px rgba(38,38,43,.10)",
        window: "0 10px 40px rgba(38,38,43,.18)",
      },
    },
  },
  plugins: [],
};

export default config;
