import type { Config } from "tailwindcss";
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            h3: {
              color: 'inherit',
              fontSize: '1.5em',
              fontWeight: '700',
              marginTop: '2.5em',
              marginBottom: '0.8em',
              lineHeight: '1.3',
              '&:first-child': {
                marginTop: '0',
              },
            },
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              lineHeight: '1.8',
              fontSize: '1.075em',
            },
            'ul:not(.timeline)': {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              listStyleType: 'disc',
              paddingLeft: '1.625em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              lineHeight: '1.8',
              fontSize: '1.075em',
            },
            strong: {
              color: 'inherit',
              fontWeight: '700',
            },
            '> div > p': {
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                bottom: '-0.75em',
                left: '0',
                width: '100%',
                height: '1px',
                backgroundColor: 'var(--tw-prose-hr)',
                opacity: '0.1',
              },
            },
            '.not-prose': {
              marginTop: '2.5em',
              borderTopWidth: '1px',
              borderColor: 'var(--tw-prose-hr)',
              opacity: '0.2',
              paddingTop: '1.5em',
            },
          }
        }
      }
    },
  },
  plugins: [typography, daisyui],
} satisfies Config;

export default config;
