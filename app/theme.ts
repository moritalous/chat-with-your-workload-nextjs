import { createTheme } from '@aws-amplify/ui-react';

export const theme = createTheme({
  name: 'aws-brand-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#FFF8E6' },
          20: { value: '#FFEBC0' },
          40: { value: '#FFDA8A' },
          60: { value: '#FFC455' },
          80: { value: '#FF9900' },
          90: { value: '#EC7211' },
          100: { value: '#D45B07' },
        },
        secondary: {
          10: { value: '#F2F8FD' },
          20: { value: '#D4E5F9' },
          40: { value: '#A8CCF5' },
          60: { value: '#7CB3F1' },
          80: { value: '#0073BB' },
          90: { value: '#00A1C9' },
          100: { value: '#232F3E' },
        },
      },
      overlays: {
        orange: {
          5: { value: 'rgba(255, 153, 0, 0.05)' },
          10: { value: 'rgba(255, 153, 0, 0.1)' },
          20: { value: 'rgba(255, 153, 0, 0.2)' },
          30: { value: 'rgba(255, 153, 0, 0.3)' },
        },
        white: {
          10: { value: 'rgba(255, 255, 255, 0.1)' },
          20: { value: 'rgba(255, 255, 255, 0.2)' },
        },
        black: {
          5: { value: 'rgba(0, 0, 0, 0.05)' },
          10: { value: 'rgba(0, 0, 0, 0.1)' },
          15: { value: 'rgba(0, 0, 0, 0.15)' },
        },
      },
      background: {
        primary: { value: '{colors.white.value}' },
        secondary: { value: '#f8f9fa' },
        tertiary: { value: '#f1f3f5' },
      },
      border: {
        primary: { value: '#dee2e6' },
        secondary: { value: '#e9ecef' },
      },
      font: {
        primary: { value: '#232F3E' },
        secondary: { value: '#545B64' },
        tertiary: { value: '#687078' },
      },
      scrollbar: {
        track: { value: '#f1f3f5' },
        thumb: { value: '#c1c8ce' },
        thumbHover: { value: '#a8b1b8' },
      },
    },
    components: {
      card: {
        boxShadow: { value: '0 4px 6px {colors.overlays.black.5.value}' },
        borderRadius: { value: '0.5rem' },
      },
      heading: {
        1: {
          fontWeight: { value: '{fontWeights.bold.value}' },
        },
        2: {
          fontWeight: { value: '{fontWeights.semibold.value}' },
        },
      },
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80.value}' },
          color: { value: '{colors.white.value}' },
          _hover: {
            backgroundColor: { value: '{colors.brand.primary.90.value}' },
          },
          _active: {
            backgroundColor: { value: '{colors.brand.primary.90.value}' },
          },
          _focus: {
            boxShadow: { value: '0 0 0 3px {colors.brand.primary.60.value}' },
          },
        },
        link: {
          color: { value: '{colors.brand.secondary.100.value}' },
          _hover: {
            color: { value: '{colors.brand.primary.80.value}' },
          },
          _active: {
            backgroundColor: { value: '{colors.brand.primary.10.value}' },
            borderColor: { value: '{colors.brand.primary.80.value}' },
          },
        },
      },
      tabs: {
        item: {
          _active: {
            color: { value: '{colors.brand.primary.80.value}' },
            borderColor: { value: '{colors.brand.primary.80.value}' },
          },
          _hover: {
            color: { value: '{colors.brand.primary.80.value}' },
          },
        },
      },
    },
    space: {
      small: { value: '0.75rem' },
      medium: { value: '1rem' },
      large: { value: '1.5rem' },
      xl: { value: '2rem' },
      xxl: { value: '3rem' },
    },
    borderWidths: {
      small: { value: '1px' },
      medium: { value: '2px' },
    },
    radii: {
      small: { value: '0.25rem' },
      medium: { value: '0.5rem' },
      large: { value: '0.75rem' },
      xl: { value: '1rem' },
    },
  },
});
