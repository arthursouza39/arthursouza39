import type { Config } from "tailwindcss";

// Paleta herdada da landing page (trackfood.site)
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marca: {
          DEFAULT: "#CC0000",
          escuro: "#a30000",
          bg: "#FFF5F5",
          borda: "#FECACA",
        },
        // Semáforo do CMV
        semaforo: {
          verde: "#16A34A",
          amarelo: "#D97706",
          vermelho: "#DC2626",
        },
        tinta: {
          DEFAULT: "#1F2937",
          2: "#374151",
          3: "#6B7280",
          4: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
