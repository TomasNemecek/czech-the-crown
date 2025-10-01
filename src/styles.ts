import styled, { createGlobalStyle } from "styled-components";

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

export const theme = {
  colors: {
    bg: "#f7f6f2",
    card: "#ffffff",
    text: "#1f2937",
    subtle: "#6b7280",
    border: "#e5e7eb",
    gold: "#d4af37",
    goldSoft: "#fff7e0",
    goldDark: "#b48918",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
    xxxl: "48px",
    buttonSize: "40px"
  },
  typography: {
    fontSize: {
      xs: "10px",
      sm: "12px",
      base: "13.5px",
      md: "14px",
      lg: "16px",
      xl: "18px",
      xxl: "28px",
      xxxl: "32px",
    }
  },
  borderRadius: {
    sm: "6px",
    md: "10px",
    lg: "12px",
    xl: "14px",
    full: "50%",
  },
  shadows: {
    sm: "0 1px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.55)",
    md: "0 10px 30px rgba(0,0,0,0.08)",
    focus: "0 0 0 3px rgba(212, 175, 55, 0.25)"
  },
  transitions: {
    fast: "0.06s ease",
    normal: "0.15s ease",
    none: "none",
  },
};

export type AppTheme = typeof theme;

// =============================================================================
// GLOBAL STYLES
// =============================================================================

export const GlobalStyle = createGlobalStyle<{ theme: AppTheme }>`
  :root {
    --bg: ${({ theme }) => theme.colors.bg};
    --card: ${({ theme }) => theme.colors.card};
    --text: ${({ theme }) => theme.colors.text};
    --subtle: ${({ theme }) => theme.colors.subtle};
    --border: ${({ theme }) => theme.colors.border};
    --gold: ${({ theme }) => theme.colors.gold};
    --goldSoft: ${({ theme }) => theme.colors.goldSoft};
    
    /* New design tokens */
    --spacing-xs: ${({ theme }) => theme.spacing.xs};
    --spacing-sm: ${({ theme }) => theme.spacing.sm};
    --spacing-md: ${({ theme }) => theme.spacing.md};
    --spacing-lg: ${({ theme }) => theme.spacing.lg};
    --spacing-xl: ${({ theme }) => theme.spacing.xl};
    --spacing-xxl: ${({ theme }) => theme.spacing.xxl};
    --spacing-xxxl: ${({ theme }) => theme.spacing.xxxl};
    --spacing-buttonSize: ${({ theme }) => theme.spacing.buttonSize};
    
    --font-xs: ${({ theme }) => theme.typography.fontSize.xs};
    --font-sm: ${({ theme }) => theme.typography.fontSize.sm};
    --font-base: ${({ theme }) => theme.typography.fontSize.base};
    --font-md: ${({ theme }) => theme.typography.fontSize.md};
    --font-lg: ${({ theme }) => theme.typography.fontSize.lg};
    --font-xl: ${({ theme }) => theme.typography.fontSize.xl};
    --font-xxl: ${({ theme }) => theme.typography.fontSize.xxl};
    --font-xxxl: ${({ theme }) => theme.typography.fontSize.xxxl};
    
    --radius-sm: ${({ theme }) => theme.borderRadius.sm};
    --radius-md: ${({ theme }) => theme.borderRadius.md};
    --radius-lg: ${({ theme }) => theme.borderRadius.lg};
    --radius-xl: ${({ theme }) => theme.borderRadius.xl};
    --radius-full: ${({ theme }) => theme.borderRadius.full};
    
    --shadow-sm: ${({ theme }) => theme.shadows.sm};
    --shadow-md: ${({ theme }) => theme.shadows.md};
    --shadow-focus: ${({ theme }) => theme.shadows.focus};

    --transition-fast: ${({ theme }) => theme.transitions.fast};
    --transition-normal: ${({ theme }) => theme.transitions.normal};
    --transition-none: ${({ theme }) => theme.transitions.none};

  }
  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    background: var(--bg);
    color: var(--text);
  }

  a { color: inherit; }

  :focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
    border-radius: var(--radius-sm);
  }
`;

// =============================================================================
// UI COMPONENTS
// =============================================================================

export const Card = styled.section`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
`;
