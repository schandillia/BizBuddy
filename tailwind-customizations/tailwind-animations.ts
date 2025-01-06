// tailwind-animations.ts
import plugin from "tailwindcss/plugin"

const animationsPlugin = plugin(({ addBase, addUtilities }) => {
  addBase({
    "@keyframes slideUp": {
      "0%": { transform: "translateY(0)" },
      "100%": { transform: "translateY(-100%)" },
    },
  })

  addUtilities({
    ".animate-slide-up": {
      animation: "slideUp 7s steps(6, jump-none) infinite",
    },
  })
})

export default animationsPlugin
