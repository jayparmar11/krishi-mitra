
import resolveConfig from 'tailwindcss/resolveConfig'
import * as tailwindConfig from '../tailwind.config'
import { Config } from 'tailwindcss'

const fullConfig = resolveConfig(tailwindConfig as Config)

// ! Keep Below sync with tailwind.config.js
export const tailwindCSSColors = {
  brand: {
    main: "#2A9D8F",
  },
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  radius: "var(--radius)",
}

export const tailwindColors: typeof fullConfig.theme.colors & typeof tailwindCSSColors = fullConfig.theme.colors as unknown as any

